// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://gyermekagykontroll.hu",
  output: "server",

  // SZÁNDÉKOSAN "ignore", nem "never". A "never" a perjeles alakra 404-et ad,
  // MÉG A MIDDLEWARE ELŐTT — vagyis a régi, perjeles URL-ekre érkező látogató
  // és a Google is hibaoldalt kapna 301 helyett. Az "ignore" mellett a kérés
  // eljut a src/middleware.ts-ig, ami rendesen átirányít.
  trailingSlash: "ignore",

  integrations: [
    sitemap({
      // A kanonikus alak a perjel nélküli (lásd src/middleware.ts), ezért a
      // sitemap is azt sorolja fel. Enélkül minden sitemap-sor egy
      // átirányításra mutatna. A gyökér kivétel: ott a perjel a kanonikus.
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname !== "/") {
          url.pathname = url.pathname.replace(/\/+$/, "");
          item.url = url.href;
        }
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
