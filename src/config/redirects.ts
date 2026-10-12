/**
 * Régi (WordPress) URL-ek -> új Astro oldalak, 301-gyel.
 *
 * MIÉRT ITT ÉS NEM A public/_redirects-BEN: a build egy `_worker.js`-t szállít
 * (pages-build.mjs), így a Cloudflare Pages "advanced mode"-ban fut, és a
 * `_redirects` fájlt FIGYELMEN KÍVÜL HAGYJA. A szabályokat ezért a
 * src/middleware.ts alkalmazza, ebből a táblából.
 *
 * Szabályok:
 * - A kulcs normalizált út: perjel nélkül a végén (`/kapcsolat`), kisbetűvel.
 *   A `/x` és a `/x/` alak ugyanazt a sort találja el.
 * - A cél MINDIG végleges, létező, perjel nélküli oldal — lánc nincs
 *   (a scripts/test-redirects.ts ezt ellenőrzi).
 */
export const REDIRECTS: Record<string, string> = {
  // Rólam oldal variánsok
  "/about": "/rolam",
  "/tihanyi-rita": "/rolam",
  "/tihanyi-rita-agykontroll-oktato": "/rolam",

  // Mi az agykontroll
  "/mi-az-agykontroll": "/tanulas",

  // Tanfolyam info
  "/agykontroll-gyerekeknek": "/gyermekagykontroll-agykontroll-gyermekeknek",
  "/agykontroll": "/gyermekagykontroll-agykontroll-gyermekeknek",
  // A src/pages/gyermekagykontroll.astro csonk is ide terel; a middleware
  // előbb fut, így egyetlen 301 lesz belőle.
  "/gyermekagykontroll": "/gyermekagykontroll-agykontroll-gyermekeknek",

  // Tematika duplikátum
  "/gyermekagykontroll-tematika-2": "/gyermekagykontroll-tematika",

  // GYIK
  "/gyermekagykontroll-gyik": "/tanulas",

  // Blog posztok (régi top-level -> /blog/ alá)
  "/gyermekagykontroll-tihanyi": "/blog/gyermekagykontroll-tihanyi",
  "/gyermekagykontroll-stressz": "/blog/gyermekagykontroll-stressz",
  "/emlekek-szigete": "/blog/emlekek-szigete",
  "/agykontroll-sikerek": "/blog/agykontroll-sikereim",

  // Kapcsolat -> Jelentkezés
  "/kapcsolat": "/jelentkezes",

  // Jogi oldalak
  "/adatkezelesi-tajekoztato": "/adatvedelmi-tajekoztato",
  "/altalanos-szerzodesi-feltetelek": "/aszf",

  // Köszönő oldal
  "/koszonet": "/koszonjuk",
  "/koszonjuk-a-jelentkezest": "/koszonjuk",

  // Relaxáció & Meditáció -> Tanulás
  "/relaxacio": "/tanulas",
  "/meditacio": "/tanulas",

  // Landing / egyéb régi oldalak -> Főoldal
  "/zseni": "/",
  "/landing": "/",
  "/lehet-jobb": "/",
  "/ausztria": "/",
  "/508-2": "/",
  "/egyeni": "/",

  // WooCommerce oldalak -> Főoldal
  "/fiokom": "/",
  "/kosar": "/",
  "/penztar": "/",
  "/uzlet": "/",
  "/termek/tantorta-hatekony-tanulasi-modszerek-10-14-eveseknek": "/tantorta",
};

/** Perjel nélküli, kisbetűs alak; a gyökér `/` marad. */
export function normalizePath(pathname: string): string {
  let p = pathname;
  try {
    p = decodeURIComponent(p);
  } catch {
    // hibás %-kódolás: nyersen hagyjuk
  }
  p = p.toLowerCase().replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/**
 * Visszaadja a végleges célt, vagy null-t, ha nincs szabály.
 * Prefix-szabályok a pontos találat után.
 */
export function resolveRedirect(pathname: string): string | null {
  const p = normalizePath(pathname);

  const exact = REDIRECTS[p];
  if (exact) return exact;

  // /index.php és /index.php/<régi út>: a régi út szabálya, különben főoldal.
  if (p === "/index.php") return "/";
  if (p.startsWith("/index.php/")) {
    const rest = p.slice("/index.php".length);
    return resolveRedirect(rest) ?? "/";
  }

  // WooCommerce termékek: a tantorta-termékek a Tantorta oldalra, a többi főoldal.
  if (p.startsWith("/termek/")) {
    return p.includes("tantorta") ? "/tantorta" : "/";
  }

  // Régi WP-kategóriák, termékkategóriák, fiók-aloldalak -> főoldal.
  if (
    p.startsWith("/category/") ||
    p.startsWith("/termekkategoria/") ||
    p.startsWith("/fiokom/")
  ) {
    return "/";
  }

  return null;
}
