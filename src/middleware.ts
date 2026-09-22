import { defineMiddleware } from "astro:middleware";

/**
 * Egy oldal = egy URL.
 *
 * Az Astro alapbeállításban a `/jelentkezes` és a `/jelentkezes/` címen is
 * kiszolgálja ugyanazt az oldalt, 200-as válasszal, önmagára mutató
 * canonical-lal. A Google emiatt két külön oldalnak látta őket, és megosztotta
 * közöttük a rangsorolási erőt — a Search Console-ban mindkét változat kapott
 * megjelenést (`/jelentkezes` 35 + `/jelentkezes/` 6, `/blog` 12 + `/blog/` 3,
 * a fő aloldalon 315 + 4).
 *
 * Innentől a perjellel végződő alak 301-gyel a perjel nélkülire terel. A gyökér
 * (`/`) kivétel: ott a perjel maga a kanonikus alak.
 */
export const onRequest = defineMiddleware((context, next) => {
  // CSAK olvasó kéréseket terelünk. Egy POST-ra adott 301-et a böngésző GET-ként
  // ismétli meg, vagyis egy beküldött jelentkezés NÉMÁN elveszne. A jelentkezési
  // űrlap ma a perjel nélküli `/api/signup`-ra küld, de ez nem maradhat a
  // helyes működés egyetlen őre.
  const { method } = context.request;
  if (method !== "GET" && method !== "HEAD") return next();

  const url = new URL(context.request.url);
  const trimmed = url.pathname.replace(/\/+$/, "");

  if (trimmed !== "" && trimmed !== url.pathname) {
    url.pathname = trimmed;
    return context.redirect(url.href, 301);
  }

  return next();
});
