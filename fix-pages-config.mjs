/**
 * Post-build script to restructure the Astro Cloudflare adapter output
 * for Cloudflare Pages deployment.
 *
 * The adapter targets Workers (`dist/server/entry.mjs` + redirect config).
 * Pages needs the `_worker.js` directory convention instead:
 *   dist/              ← pages_build_output_dir (static assets at root)
 *     _worker.js/      ← SSR worker directory
 *       index.mjs      ← entry point (renamed from entry.mjs)
 *       chunks/         ← code-split chunks
 *
 * This script:
 * 1. Moves static assets from dist/client/* to dist/ root
 * 2. Moves the SSR worker from dist/server/ to dist/_worker.js/
 * 3. Removes the Workers redirect config (.wrangler/deploy/config.json)
 */
import { cpSync, renameSync, rmSync, readdirSync } from "node:fs";

// 1. Move static assets from dist/client/ to dist/ root
for (const entry of readdirSync("./dist/client", { withFileTypes: true })) {
	const src = `./dist/client/${entry.name}`;
	const dest = `./dist/${entry.name}`;
	renameSync(src, dest);
}
rmSync("./dist/client", { recursive: true });

// 2. Move SSR worker to dist/_worker.js/ (Pages convention)
renameSync("./dist/server", "./dist/_worker.js");
renameSync("./dist/_worker.js/entry.mjs", "./dist/_worker.js/index.mjs");

// Clean up files Pages doesn't need in the worker directory
rmSync("./dist/_worker.js/wrangler.json", { force: true });
rmSync("./dist/_worker.js/.prerender", { recursive: true, force: true });

// 3. Remove the Workers redirect config so Pages uses root wrangler.jsonc
rmSync("./.wrangler/deploy", { recursive: true, force: true });
