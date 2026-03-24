// Post-build script: restructure Astro's output for Cloudflare Pages
// Astro outputs dist/client (static) + dist/server (worker)
// CF Pages expects static assets + _worker.js/ directory in pages_build_output_dir

import { cpSync, writeFileSync } from "node:fs";

// Copy server code into _worker.js directory inside client output
cpSync("dist/server/chunks", "dist/client/_worker.js/chunks", { recursive: true });
cpSync("dist/server/entry.mjs", "dist/client/_worker.js/entry.mjs");
cpSync("dist/server/virtual_astro_middleware.mjs", "dist/client/_worker.js/virtual_astro_middleware.mjs");

// Create index.js entry point that CF Pages expects
writeFileSync(
  "dist/client/_worker.js/index.js",
  `export { default } from "./entry.mjs";\n`
);

console.log("Pages build restructured: dist/client/_worker.js/ created");
