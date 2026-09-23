import { defineMiddleware } from "astro:middleware";

/**
 * Két URL-szintű szabály, ami a keresőt érinti.
 */
export const onRequest = defineMiddleware((context, next) => {
  // CSAK olvasó kéréseket terelünk. Egy POST-ra adott 301-et a böngésző GET-ként
  // ismétli meg, vagyis egy beküldött jelentkezés NÉMÁN elveszne. A jelentkezési
  // űrlap ma a perjel nélküli `/api/signup`-ra küld, de ez nem maradhat a
  // helyes működés egyetlen őre.
  const { method } = context.request;
  if (method !== "GET" && method !== "HEAD") return next();

  const url = new URL(context.request.url);

  // 1) A sitemap valódi neve `sitemap-index.xml` (így generálja az Astro
  //    sitemap-integrációja). A `/sitemap.xml` viszont az az út, amit ember és
  //    eszköz elsőre kipróbál — a Search Console beküldő mezője is ezt kínálja
  //    fel —, és eddig 404-et adott. Innentől a valódi fájlra terel.
  if (url.pathname === "/sitemap.xml") {
    return context.redirect("/sitemap-index.xml", 301);
  }

  // 2) Egy oldal = egy URL. Az Astro alapbeállításban a `/jelentkezes` és a
  //    `/jelentkezes/` címen is kiszolgálja ugyanazt az oldalt, 200-as
  //    válasszal, önmagára mutató canonical-lal. A Google emiatt két külön
  //    oldalnak látta őket, és megosztotta közöttük a rangsorolási erőt — a
  //    Search Console-ban mindkét változat kapott megjelenést (`/jelentkezes`
  //    35 + `/jelentkezes/` 6, `/blog` 12 + `/blog/` 3, a fő aloldalon 315 + 4).
  //    A gyökér (`/`) kivétel: ott a perjel maga a kanonikus alak.
  const trimmed = url.pathname.replace(/\/+$/, "");

  if (trimmed !== "" && trimmed !== url.pathname) {
    url.pathname = trimmed;
    return context.redirect(url.href, 301);
  }

  return next();
});
