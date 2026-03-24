/**
 * Post-build script to patch the @astrojs/cloudflare adapter's generated
 * wrangler.json for Cloudflare Pages compatibility.
 *
 * The adapter generates a Workers-style redirected config in dist/server/
 * that Cloudflare Pages rejects. This script strips all Workers-only fields
 * so Pages can validate and deploy the SSR worker.
 */
import { readFileSync, writeFileSync } from "node:fs";

const configPath = "./dist/server/wrangler.json";
const config = JSON.parse(readFileSync(configPath, "utf8"));

// Remove pages_build_output_dir from redirected config — the root wrangler.jsonc
// already provides it, and Pages rejects configs with both "main" and "pages_build_output_dir"
delete config.pages_build_output_dir;

// Fields not supported by Pages
delete config.triggers;
delete config.rules;
delete config.no_bundle;
delete config.images;
delete config.assets;

// Remove KV namespace entries that lack an id (adapter adds SESSION without one)
config.kv_namespaces = (config.kv_namespaces || []).filter((ns) => ns.id);

writeFileSync(configPath, JSON.stringify(config));
