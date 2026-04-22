import { supabase, restFetch, restFetchPaged } from '@services/http/config';
import type {
  Material,
  MaterialBasic,
  MaterialContribucion,
  ProveedorPorMaterial,
} from './materialsHttp.types';

const BASIC_FIELDS = 'slug,nombre_comercial,content_score,categoria';

const CATALOG_FIELDS =
  'id,slug,nombre_comercial,categoria,subcategoria,color_principal,origen_pais,origen_region,imagen_url_principal,content_score,precio_orientativo,activo';

const MAP_FIELDS =
  'id,slug,nombre_comercial,categoria,color_principal,origen_pais,origen_region,imagen_url_principal,content_score,lat,lng';

const SEARCH_FIELDS =
  'slug,nombre_comercial,categoria,color_principal,origen_pais,imagen_url_principal';

export async function getAllBasic(): Promise<MaterialBasic[]> {
  const pageSize = 1000;
  const base = `materiales?select=${BASIC_FIELDS}&activo=eq.true&order=slug.asc`;

  const first = await restFetchPaged<MaterialBasic>(base, pageSize, 0);
  if (first.total <= pageSize) return first.data;

  const totalPages = Math.ceil(first.total / pageSize);
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      restFetchPaged<MaterialBasic>(base, pageSize, (i + 1) * pageSize).then((r) => r.data)
    )
  );

  return [first.data, ...rest].flat();
}

export async function getAll(options?: { offset?: number; limit?: number }): Promise<Material[]> {
  const limit = options?.limit ?? 1000;
  const offset = options?.offset ?? 0;
  return restFetch<Material[]>(
    `materiales?select=${CATALOG_FIELDS}&activo=eq.true&order=content_score.desc,nombre_comercial.asc&limit=${limit}&offset=${offset}`,
    { Range: `${offset}-${offset + limit - 1}` }
  );
}

export async function getBySlug(slug: string): Promise<Material | null> {
  const { data, error } = await supabase.from('materiales').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Material;
}

export async function getForMap(minScore = 0): Promise<Material[]> {
  const base = `materiales?select=${MAP_FIELDS}&lat=not.is.null&order=content_score.desc&limit=1000`;
  const filter = minScore > 0 ? `&content_score=gte.${minScore}` : '';
  return restFetch<Material[]>(base + filter);
}

export async function getMapById(id: number): Promise<Material | null> {
  const results = await restFetch<Material[]>(`materiales?select=*&id=eq.${id}&limit=1`);
  return results[0] ?? null;
}

export async function getForSearch(): Promise<Material[]> {
  return restFetch<Material[]>(
    `materiales?select=${SEARCH_FIELDS}&activo=eq.true&order=nombre_comercial.asc&limit=500`
  );
}

export async function getContributions(materialSlug: string): Promise<MaterialContribucion[]> {
  const { data, error } = await supabase
    .from('material_contribuciones')
    .select('*')
    .eq('material_slug', materialSlug)
    .eq('estado', 'aprobado')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as MaterialContribucion[];
}

export async function getProveedores(materialSlug: string): Promise<ProveedorPorMaterial[]> {
  const { data, error } = await supabase
    .from('mv_proveedores_por_material')
    .select('nombre_empresa,slug,plan,pais,ciudad,visibility_score,contribuciones')
    .eq('material_slug', materialSlug)
    .order('visibility_score', { ascending: false });
  if (error) return [];
  return data as ProveedorPorMaterial[];
}
