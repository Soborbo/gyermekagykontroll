/**
 * Post-build script to patch the @astrojs/cloudflare adapter's generated
 * wrangler.json for Cloudflare Pages compatibility.
 *
 * The adapter generates a Workers-style config that Pages rejects due to:
 * - `triggers: {}` (invalid for Pages)
 * - `kv_namespaces` entries without `id` (adapter adds SESSION binding without one)
 * - `assets` binding named "ASSETS" (reserved in Pages — the platform provides it)
 * - `images` field (not a valid Pages config field)
 */
import { readFileSync, writeFileSync } from "node:fs";

const configPath = "./dist/server/wrangler.json";
const config = JSON.parse(readFileSync(configPath, "utf8"));

// Pages expects triggers.crons, not an empty object
delete config.triggers;

// Remove KV namespace entries that lack an id (adapter adds SESSION without one)
config.kv_namespaces = (config.kv_namespaces || []).filter((ns) => ns.id);

// Pages provides ASSETS natively — remove to avoid "reserved name" error
delete config.assets;

// Not a valid Pages config field
delete config.images;

writeFileSync(configPath, JSON.stringify(config));
