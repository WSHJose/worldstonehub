import fs from 'fs';
import path from 'path';
import type { ISitemapUrlGenerator } from './SitemapUrl';
import { SitemapGenerator } from './SitemapGenerator';

const BASE_URL = 'https://worldstonehub.com';

interface Config {
  /** Absolute path of dist/ directory */
  outputDir: string;
  generators: ISitemapUrlGenerator[];
}

export class SitemapService {
  constructor(private readonly config: Config) {}

  async generateSitemap(): Promise<void> {
    for (const gen of this.config.generators) {
      const generator = new SitemapGenerator(BASE_URL);
      generator.addUrls(await gen.generate());

      const outputPath = path.join(this.config.outputDir, gen.filename);
      await generator.writeSitemapToFile(outputPath);
      await this.addToSitemapIndex(gen.filename, outputPath);
    }
  }

  private async addToSitemapIndex(filename: string, sitemapPath: string): Promise<void> {
    const indexPath = path.join(path.dirname(sitemapPath), 'sitemap-index.xml');
    if (!fs.existsSync(indexPath)) return;

    const entry = `<sitemap><loc>${BASE_URL}/${filename}</loc></sitemap>`;
    let content = await fs.promises.readFile(indexPath, 'utf-8');

    if (content.includes(filename)) return;

    content = content.replace('</sitemapindex>', `${entry}</sitemapindex>`);
    await fs.promises.writeFile(indexPath, content, 'utf-8');
  }
}
