import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const notAllowedPages = ['https://clearretro.com/board/', 'https://clearretro.com/dashboard/', 'https://clearretro.com/signin/', 'https://clearretro.com/signup/', 'https://clearretro.com/admin/'];

// https://astro.build/config
export default defineConfig({
  site: 'https://clearretro.com',
  integrations: [react(), tailwind(), sitemap({
    filter: (page) => {
      return !notAllowedPages.includes(page);
    },
    serialize(item) {

      if (item.url === "https://clearretro.com/") {
        item.changefreq = 'daily';
        item.lastmod = new Date();
        item.priority = 1;
      } else if (/blog/.test(item.url)) {
        item.changefreq = 'weekly';
        item.lastmod = new Date();
        item.priority = 0.8;
      } else {
        item.changefreq = 'monthly';
        item.lastmod = new Date();
        item.priority = 0.5;
      }
      return item;
    },
  })],
  vite: {
    plugins: [
      {
        name: 'rewrite-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url.startsWith('/board/') && req.url.indexOf('.') === -1) {
              req.url = '/board';
            }
            next();
          });
        }
      }
    ]
  }
});
