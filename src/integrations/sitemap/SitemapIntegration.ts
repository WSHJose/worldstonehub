import type { AstroIntegration } from 'astro';
import { SitemapService } from '@Integrations/sitemap/SitemapService';

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
          supabaseUrl,
          supabaseKey,
          outputDir: dir.pathname,
        });

        await service.generateSitemap();
        logger.info('wsh-sitemap: sitemap-materials.xml generated');
      },
    },
  };
}
