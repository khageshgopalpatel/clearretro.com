import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs/promises';

const notAllowedPages = ['https://clearretro.com/board', 'https://clearretro.com/dashboard', 'https://clearretro.com/signin', 'https://clearretro.com/signup', 'https://clearretro.com/admin'];

// https://astro.build/config
export default defineConfig({
  site: 'https://clearretro.com',
  trailingSlash: 'never',
  integrations: [
    react(), 
    tailwind(), 
    sitemap({
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
    }),
    {
      name: 'rename-sitemap',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          try {
            await fs.rename(new URL('sitemap-0.xml', dir), new URL('sitemap.xml', dir));
            await fs.rm(new URL('sitemap-index.xml', dir));
            console.log('Renamed sitemap-0.xml to sitemap.xml');
          } catch (error) {
            console.error('Error renaming sitemap:', error);
          }
        }
      }
    }
  ],
  build: {
    inlineStylesheets: 'auto',
  },
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
