import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://whcptmdapnavcxcszwwk.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_CsE_EOAwQSJgKDC2eEcBOA_UztVp7gO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function restFetch<T>(
  path: string,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
      ...extraHeaders,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase REST error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function restFetchCount(path: string): Promise<number | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  const range = res.headers.get('content-range') ?? '';
  const match = range.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
