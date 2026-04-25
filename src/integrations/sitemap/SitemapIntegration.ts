import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { SitemapService } from './SitemapService';
import { MaterialsSitemapUrlGenerator } from './entities/MaterialsSitemapUrlGenerator';

export function wshSitemap(): AstroIntegration {
  return {
    name: 'wsh-sitemap',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          logger.warn('wsh-sitemap: Missing Supabase env vars — skipping sitemap generation');
          return;
        }

        const service = new SitemapService({
          outputDir: fileURLToPath(dir),
          generators: [new MaterialsSitemapUrlGenerator({ supabaseUrl, supabaseKey })],
        });

        await service.generateSitemap();
        logger.info('wsh-sitemap: sitemaps generated');
      },
    },
  };
}
