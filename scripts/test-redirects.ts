// Futtatás: npm run test:redirects
// Ellenőrzi: minden cél létező oldal, nincs lánc, és a /x vs /x/ alak egyezik.
import { existsSync } from "node:fs";
import assert from "node:assert/strict";
import { REDIRECTS, resolveRedirect } from "../src/config/redirects.ts";

const pageExists = (p: string) =>
  p === "/" ||
  existsSync(`src/pages${p}.astro`) ||
  existsSync(`src/pages${p}/index.astro`);

for (const [from, to] of Object.entries(REDIRECTS)) {
  assert.ok(pageExists(to), `${from} -> ${to}: a cél nem létező oldal`);
  assert.equal(resolveRedirect(to), null, `${from} -> ${to}: lánc (a cél maga is terel)`);
  assert.equal(resolveRedirect(from + "/"), to, `${from}/ nem ugyanoda megy`);
}

const cases: Record<string, string | null> = {
  "/kapcsolat/": "/jelentkezes",
  "/index.php/kapcsolat": "/jelentkezes",
  "/index.php/agykontroll/": "/gyermekagykontroll-agykontroll-gyermekeknek",
  "/termek/tantorta-hatekony-tanulasi-modszerek-10-14-eveseknek/": "/tantorta",
  "/termek/barmi/": "/",
  "/category/hirek/": "/",
  "/jelentkezes": null,
  "/": null,
};
for (const [from, to] of Object.entries(cases)) {
  assert.equal(resolveRedirect(from), to, from);
}
console.log(`OK: ${Object.keys(REDIRECTS).length} szabály + ${Object.keys(cases).length} eset`);
