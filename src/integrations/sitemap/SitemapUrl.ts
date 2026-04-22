export enum ChangeFrequency {
  ALWAYS = 'always',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  NEVER = 'never',
}

export class SitemapUrl {
  constructor(
    private readonly _loc: string,
    private readonly _lastmod: Date,
    private readonly _changefreq: ChangeFrequency = ChangeFrequency.WEEKLY,
    private readonly _priority: number = 0.5
  ) {}

  get loc(): string {
    return this._loc;
  }

  get lastmod(): string {
    return this._lastmod.toISOString().split('T')[0];
  }

  get changefreq(): ChangeFrequency {
    return this._changefreq;
  }

  get priority(): number {
    return this._priority;
  }

  toXml(baseUrl: string): string {
    return `
    <url>
      <loc>${baseUrl}${this.loc}</loc>
      <lastmod>${this.lastmod}</lastmod>
      <changefreq>${this.changefreq}</changefreq>
      <priority>${this.priority}</priority>
    </url>`;
  }
}
