import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    vue(),
    sitemap({
      filter: (page) =>
        ![
          '/admin',
          '/admin-anuncios',
          '/panel',
          '/login',
          '/gracias',
          '/esquema-negocio',
          '/i18n-example',
          '/404',
        ].some((path) => page.includes(path)),
    }),
  ],
  output: 'static',
  site: 'https://worldstonehub.com',
  // GitHub Pages sirve desde la raíz del repo — no hay base path
  trailingSlash: 'never',
  build: {
    format: 'file', // genera materiales.html en vez de materiales/index.html
  },
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
        customCollections: {
          wsh: FileSystemIconLoader('./src/assets/icons'),
        },
      }),
    ],
  },
});
