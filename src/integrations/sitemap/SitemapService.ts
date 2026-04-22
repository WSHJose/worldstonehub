import path from 'path';
import { SitemapGenerator } from '@Integrations/sitemap/SitemapGenerator';
import { SitemapUrl, ChangeFrequency } from '@Integrations/sitemap/SitemapUrl';
import { MaterialsSitemapUrlGenerator } from '@Integrations/sitemap/entities/MaterialsSitemapUrlGenerator';

const BASE_URL = 'https://worldstonehub.com';

interface Config {
  supabaseUrl: string;
  supabaseKey: string;
  /** Absolute path where sitemap-materials.xml will be written (inside dist/) */
  outputDir: string;
}

export class SitemapService {
  constructor(private readonly config: Config) {}

  async generateSitemap(): Promise<void> {
    const generator = new SitemapGenerator(BASE_URL);

    const staticPages: Array<{ loc: string; freq: ChangeFrequency; priority: number }> = [
      { loc: '', freq: ChangeFrequency.DAILY, priority: 1.0 },
      { loc: '/materiales', freq: ChangeFrequency.DAILY, priority: 0.9 },
      { loc: '/proveedores', freq: ChangeFrequency.WEEKLY, priority: 0.8 },
      { loc: '/mapa', freq: ChangeFrequency.MONTHLY, priority: 0.7 },
      { loc: '/sector', freq: ChangeFrequency.MONTHLY, priority: 0.6 },
      { loc: '/nosotros', freq: ChangeFrequency.MONTHLY, priority: 0.5 },
      { loc: '/contacto', freq: ChangeFrequency.MONTHLY, priority: 0.5 },
    ];

    for (const page of staticPages) {
      generator.addUrl(new SitemapUrl(page.loc, new Date(), page.freq, page.priority));
    }

    const materialGenerator = new MaterialsSitemapUrlGenerator({
      supabaseUrl: this.config.supabaseUrl,
      supabaseKey: this.config.supabaseKey,
    });
    generator.addUrls(await materialGenerator.generate());

    const outputPath = path.join(this.config.outputDir, 'sitemap-materials.xml');
    await generator.writeSitemapToFile(outputPath);
  }
}
