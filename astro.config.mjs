import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import { wshSitemap } from './src/integrations/sitemap/SitemapIntegration';

export default defineConfig({
  integrations: [
    vue(),
    wshSitemap(),
    sitemap({
      filter: (page) => {
        const excluded = [
          '/admin',
          '/admin-anuncios',
          '/panel',
          '/login',
          '/gracias',
          '/esquema-negocio',
          '/i18n-example',
          '/404',
        ];
        if (excluded.some((path) => page.includes(path))) return false;
        // Exclude individual material pages — most have content_score < 50 (noindex).
        // Phase 2: replace with Cloudflare SSR + per-page sitemap logic.
        if (/\/materiales\/.+/.test(page)) return false;
        return true;
      },
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
        defaultStyle: '',
        defaultClass: '',
        iconCustomizer(_collection, _icon, props) {
          props.width = undefined;
          props.height = undefined;
        },
        customCollections: {
          wsh: FileSystemIconLoader('./src/assets/icons'),
        },
      }),
    ],
  },
});
