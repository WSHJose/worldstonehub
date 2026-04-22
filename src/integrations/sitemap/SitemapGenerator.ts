import fs from 'fs';
import path from 'path';
import type { SitemapUrl } from './SitemapUrl';

export class SitemapGenerator {
  private readonly urls: SitemapUrl[] = [];
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  addUrl(url: SitemapUrl): void {
    this.urls.push(url);
  }

  addUrls(urls: SitemapUrl[]): void {
    this.urls.push(...urls);
  }

  generateSitemap(): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    const footer = `
</urlset>`;

    const urlsXml = this.urls.map((url) => url.toXml(this.baseUrl)).join('');
    return `${header}${urlsXml}${footer}`;
  }

  async writeSitemapToFile(outputPath: string): Promise<void> {
    const sitemapXml = this.generateSitemap();
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await fs.promises.writeFile(outputPath, sitemapXml);
  }
}
