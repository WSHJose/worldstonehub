import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

type Primitive = string | number | boolean;
type Distribute<T> = T extends Primitive ? T : never;
type FilterValue<T> = Distribute<NonNullable<T>>;

interface OrderClause {
  field: string;
  direction: 'asc' | 'desc';
  nullsLast?: boolean;
}

interface QueryState {
  table: string;
  fields: readonly string[];
  filters: string[];
  orders: OrderClause[];
  limit?: number;
  offset?: number;
}

interface PageOverrides {
  limit?: number;
  offset?: number;
}

function encodeValue(value: Primitive): string {
  return encodeURIComponent(String(value));
}

export class TypedQuery<TRow, TSelected extends keyof TRow = keyof TRow> {
  constructor(private state: QueryState) {}

  select<F extends keyof TRow>(...fields: [F, ...F[]]): TypedQuery<TRow, F> {
    return new TypedQuery<TRow, F>({
      ...this.state,
      fields: fields.map((f) => String(f)),
      filters: [...this.state.filters],
      orders: [...this.state.orders],
    });
  }

  eq<F extends keyof TRow>(field: F, value: FilterValue<TRow[F]>): this {
    return this.addFilter(`${String(field)}=eq.${encodeValue(value as Primitive)}`);
  }

  neq<F extends keyof TRow>(field: F, value: FilterValue<TRow[F]>): this {
    return this.addFilter(`${String(field)}=neq.${encodeValue(value as Primitive)}`);
  }

  gt<F extends keyof TRow>(field: F, value: FilterValue<TRow[F]>): this {
    return this.addFilter(`${String(field)}=gt.${encodeValue(value as Primitive)}`);
  }

  gte<F extends keyof TRow>(field: F, value: FilterValue<TRow[F]>): this {
    return this.addFilter(`${String(field)}=gte.${encodeValue(value as Primitive)}`);
  }

  lt<F extends keyof TRow>(field: F, value: FilterValue<TRow[F]>): this {
    return this.addFilter(`${String(field)}=lt.${encodeValue(value as Primitive)}`);
  }

  lte<F extends keyof TRow>(field: F, value: FilterValue<TRow[F]>): this {
    return this.addFilter(`${String(field)}=lte.${encodeValue(value as Primitive)}`);
  }

  in<F extends keyof TRow>(field: F, values: readonly FilterValue<TRow[F]>[]): this {
    const list = values.map((v) => encodeValue(v as Primitive)).join(',');
    return this.addFilter(`${String(field)}=in.(${list})`);
  }

  ilike<F extends keyof TRow>(field: F, pattern: string): this {
    return this.addFilter(`${String(field)}=ilike.${encodeURIComponent(pattern)}`);
  }

  isNull<F extends keyof TRow>(field: F): this {
    return this.addFilter(`${String(field)}=is.null`);
  }

  isNotNull<F extends keyof TRow>(field: F): this {
    return this.addFilter(`${String(field)}=not.is.null`);
  }

  contains<F extends keyof TRow>(field: F, values: readonly Primitive[]): this {
    const list = values.map((v) => encodeValue(v)).join(',');
    return this.addFilter(`${String(field)}=cs.{${list}}`);
  }

  order<F extends keyof TRow>(
    field: F,
    options?: { ascending?: boolean; nullsLast?: boolean }
  ): this {
    this.state.orders.push({
      field: String(field),
      direction: options?.ascending === false ? 'desc' : 'asc',
      nullsLast: options?.nullsLast,
    });
    return this;
  }

  limit(n: number): this {
    this.state.limit = n;
    return this;
  }

  offset(n: number): this {
    this.state.offset = n;
    return this;
  }

  private addFilter(clause: string): this {
    this.state.filters.push(clause);
    return this;
  }

  private buildPath(overrides?: PageOverrides): string {
    const params: string[] = [];
    params.push(`select=${this.state.fields.join(',')}`);
    params.push(...this.state.filters);
    if (this.state.orders.length > 0) {
      const orderStr = this.state.orders
        .map((o) => `${o.field}.${o.direction}${o.nullsLast ? '.nullslast' : ''}`)
        .join(',');
      params.push(`order=${orderStr}`);
    }
    const finalLimit = overrides?.limit ?? this.state.limit;
    const finalOffset = overrides?.offset ?? this.state.offset;
    if (finalLimit !== undefined) params.push(`limit=${finalLimit}`);
    if (finalOffset !== undefined) params.push(`offset=${finalOffset}`);
    return `${this.state.table}?${params.join('&')}`;
  }

  private async runFetch(
    overrides?: PageOverrides,
    extraHeaders?: Record<string, string>
  ): Promise<Response> {
    return fetch(`${SUPABASE_URL}/rest/v1/${this.buildPath(overrides)}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
        ...extraHeaders,
      },
    });
  }

  async execute(): Promise<Pick<TRow, TSelected>[]> {
    const res = await this.runFetch();
    if (!res.ok) {
      throw new Error(`Supabase REST error ${res.status}: ${await res.text()}`);
    }
    return (await res.json()) as Pick<TRow, TSelected>[];
  }

  async maybeSingle(): Promise<Pick<TRow, TSelected> | null> {
    const res = await this.runFetch({ limit: 1 });
    if (!res.ok) return null;
    const rows = (await res.json()) as Pick<TRow, TSelected>[];
    return rows[0] ?? null;
  }

  async paged(page?: PageOverrides): Promise<{ data: Pick<TRow, TSelected>[]; total: number }> {
    const limit = page?.limit ?? this.state.limit ?? 1000;
    const offset = page?.offset ?? this.state.offset ?? 0;
    const res = await this.runFetch(
      { limit, offset },
      { Prefer: 'count=exact', Range: `${offset}-${offset + limit - 1}` }
    );
    if (!res.ok) {
      throw new Error(`Supabase REST error ${res.status}: ${await res.text()}`);
    }
    const range = res.headers.get('content-range') ?? '';
    const match = range.match(/\/(\d+)$/);
    const total = match ? parseInt(match[1], 10) : 0;
    const data = (await res.json()) as Pick<TRow, TSelected>[];
    return { data, total };
  }

  async fetchAllPages(pageSize = 1000): Promise<Pick<TRow, TSelected>[]> {
    const first = await this.paged({ limit: pageSize, offset: 0 });
    if (first.total <= pageSize) return first.data;
    const totalPages = Math.ceil(first.total / pageSize);
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, async (_, i) => {
        const res = await this.runFetch({ limit: pageSize, offset: (i + 1) * pageSize });
        if (!res.ok) {
          throw new Error(`Supabase REST error ${res.status}: ${await res.text()}`);
        }
        return (await res.json()) as Pick<TRow, TSelected>[];
      })
    );
    return [first.data, ...rest].flat();
  }

  async count(): Promise<number | null> {
    const res = await this.runFetch(undefined, {
      Prefer: 'count=exact',
      Range: '0-0',
    });
    const range = res.headers.get('content-range') ?? '';
    const match = range.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }
}

export function from<TRow>(table: string): TypedQuery<TRow> {
  return new TypedQuery<TRow>({
    table,
    fields: ['*'],
    filters: [],
    orders: [],
  });
}
