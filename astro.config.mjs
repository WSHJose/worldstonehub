import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  output: 'static',
  site: 'https://worldstonehub.com',
  // GitHub Pages sirve desde la raíz del repo — no hay base path
  trailingSlash: 'never',
  build: {
    format: 'file', // genera materiales.html en vez de materiales/index.html
  },
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: 'astro' })],
  },
});
