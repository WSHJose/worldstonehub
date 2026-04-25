import { ChangeFrequency, SitemapUrl } from '../SitemapUrl';
import type { ISitemapUrlGenerator } from '../SitemapUrl';

interface MaterialSitemapEntry {
  slug: string;
  content_score: number;
}

interface Config {
  supabaseUrl: string;
  supabaseKey: string;
}

const PAGE_SIZE = 1000;
const MIN_SCORE = 50;

export class MaterialsSitemapUrlGenerator implements ISitemapUrlGenerator {
  readonly filename = 'sitemap-materials.xml';

  constructor(private readonly config: Config) {}

  async generate(): Promise<SitemapUrl[]> {
    const materials = await this.fetchAll();
    return materials.map((m) => this.toSitemapUrl(m));
  }

  private async fetchAll(): Promise<MaterialSitemapEntry[]> {
    const path = `materiales?select=slug,content_score&activo=eq.true&content_score=gte.${MIN_SCORE}&order=slug.asc`;

    const first = await this.fetchPage(path, 0);
    if (first.total <= PAGE_SIZE) return first.data;

    const totalPages = Math.ceil(first.total / PAGE_SIZE);
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        this.fetchPage(path, (i + 1) * PAGE_SIZE).then((r) => r.data)
      )
    );

    return [first.data, ...rest].flat();
  }

  private async fetchPage(
    path: string,
    offset: number
  ): Promise<{ data: MaterialSitemapEntry[]; total: number }> {
    const rangeEnd = offset + PAGE_SIZE - 1;
    const res = await fetch(
      `${this.config.supabaseUrl}/rest/v1/${path}&limit=${PAGE_SIZE}&offset=${offset}`,
      {
        headers: {
          apikey: this.config.supabaseKey,
          Authorization: `Bearer ${this.config.supabaseKey}`,
          Accept: 'application/json',
          Prefer: 'count=exact',
          Range: `${offset}-${rangeEnd}`,
        },
      }
    );
    const range = res.headers.get('content-range') ?? '';
    const match = range.match(/\/(\d+)$/);
    const total = match ? parseInt(match[1], 10) : 0;
    const data = (await res.json()) as MaterialSitemapEntry[];
    return { data, total };
  }

  private toSitemapUrl(m: MaterialSitemapEntry): SitemapUrl {
    const priority = m.content_score >= 80 ? 0.8 : 0.6;
    return new SitemapUrl(`/materiales/${m.slug}`, new Date(), ChangeFrequency.MONTHLY, priority);
  }
}
