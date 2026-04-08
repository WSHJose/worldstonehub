import { supabase, restFetch } from '@services/http/config';
import type { Cantera, MaterialCanteraJoin } from './canterasHttp.types';

const SEARCH_FIELDS = 'id,slug,nombre,tipo_piedra,pais,color_principal';

export async function getAll(): Promise<Cantera[]> {
  const { data, error } = await supabase
    .from('canteras')
    .select('*')
    .order('nombre', { ascending: true });
  if (error) return [];
  return data as Cantera[];
}

export async function getBySlug(slug: string): Promise<Cantera | null> {
  const { data, error } = await supabase.from('canteras').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Cantera;
}

export async function getMaterialesVinculados(canteraId: string): Promise<MaterialCanteraJoin[]> {
  const { data, error } = await supabase
    .from('material_cantera')
    .select('material_id,materiales(id,slug,nombre_comercial,categoria,color_principal)')
    .eq('cantera_id', canteraId);
  if (error) return [];
  return data as unknown as MaterialCanteraJoin[];
}

export async function getForSearch(): Promise<Cantera[]> {
  return restFetch<Cantera[]>(`canteras?select=${SEARCH_FIELDS}&order=nombre.asc&limit=500`);
}
