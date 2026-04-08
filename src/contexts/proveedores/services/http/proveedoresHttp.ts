import { supabase, restFetch, restFetchCount } from '@services/http/config';
import type { Proveedor } from './proveedoresHttp.types';

const CARD_FIELDS =
  'id,slug,nombre_empresa,tipo_empresa,sector,plan,plan_activo,estado,activo,verificado,descripcion,pais,ciudad,website,email_contacto,telefono,logo_url,materiales,certificaciones';

const SEARCH_FIELDS = 'slug,nombre_empresa,tipo_empresa,pais,logo_url,plan';

export async function getActive(): Promise<Proveedor[]> {
  const { data, error } = await supabase
    .from('proveedores')
    .select(CARD_FIELDS)
    .eq('estado', 'activo')
    .order('nombre_empresa', { ascending: true });
  if (error) return [];
  return data as Proveedor[];
}

export async function getBySlug(slug: string): Promise<Proveedor | null> {
  const { data, error } = await supabase.from('proveedores').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Proveedor;
}

export async function getActiveCount(): Promise<number | null> {
  return restFetchCount('proveedores?estado=eq.activo');
}

export async function getRelated(sector: string, excludeSlug: string): Promise<Proveedor[]> {
  const { data, error } = await supabase
    .from('proveedores')
    .select(CARD_FIELDS)
    .eq('estado', 'activo')
    .contains('sector', [sector])
    .neq('slug', excludeSlug)
    .limit(4);
  if (error) return [];
  return data as Proveedor[];
}

export async function getForSearch(): Promise<Proveedor[]> {
  return restFetch<Proveedor[]>(
    `proveedores?select=${SEARCH_FIELDS}&estado=eq.activo&order=nombre_empresa.asc&limit=500`
  );
}

export async function getByUserId(userId: string): Promise<Proveedor | null> {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data as Proveedor;
}

export async function getEmpresaName(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('proveedores')
    .select('nombre_empresa')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return (data as { nombre_empresa: string })?.nombre_empresa ?? null;
}
