import { from } from '@services/http/queryBuilder';
import type {
  Material,
  MaterialBasic,
  MaterialCard,
  MaterialContribucion,
  MaterialMapPoint,
  MaterialNav,
  MaterialSearchHit,
  ProveedorPorMaterial,
} from './materialsHttp.types';

const materials = () => from<Material>('materiales');
const contribuciones = () => from<MaterialContribucion>('material_contribuciones');
const proveedoresPorMaterial = () => from<ProveedorPorMaterial>('mv_proveedores_por_material');

export async function getAllBasic(): Promise<MaterialBasic[]> {
  return materials()
    .select('slug', 'nombre_comercial', 'content_score', 'categoria')
    .eq('activo', true)
    .order('slug')
    .fetchAllPages();
}

export async function getAll(options?: {
  offset?: number;
  limit?: number;
}): Promise<MaterialCard[]> {
  return materials()
    .select(
      'id',
      'slug',
      'nombre_comercial',
      'categoria',
      'subcategoria',
      'color_principal',
      'color_acento',
      'origen_pais',
      'origen_region',
      'imagen_url_principal',
      'content_score',
      'precio_orientativo',
      'activo',
      'acabados_disponibles',
      'usos_recomendados',
      'tags_busqueda',
      'nombres_alternativos',
      'propiedades_tecnicas'
    )
    .eq('activo', true)
    .order('content_score', { ascending: false })
    .order('nombre_comercial')
    .limit(options?.limit ?? 1000)
    .offset(options?.offset ?? 0)
    .execute();
}

export async function getBySlug(slug: string): Promise<Material | null> {
  return materials().eq('slug', slug).maybeSingle();
}

export async function getForMap(minScore = 0): Promise<MaterialMapPoint[]> {
  const query = materials()
    .select(
      'id',
      'slug',
      'nombre_comercial',
      'categoria',
      'color_principal',
      'origen_pais',
      'origen_region',
      'imagen_url_principal',
      'content_score',
      'lat',
      'lng'
    )
    .isNotNull('lat')
    .order('content_score', { ascending: false })
    .limit(1000);
  if (minScore > 0) query.gte('content_score', minScore);
  return query.execute();
}

export async function getMapById(id: number): Promise<Material | null> {
  return materials().eq('id', id).maybeSingle();
}

export async function getForSearch(): Promise<MaterialSearchHit[]> {
  return materials()
    .select(
      'slug',
      'nombre_comercial',
      'categoria',
      'color_principal',
      'origen_pais',
      'imagen_url_principal'
    )
    .eq('activo', true)
    .order('nombre_comercial')
    .limit(500)
    .execute();
}

export async function getPrev(id: number): Promise<MaterialNav | null> {
  return materials()
    .select('slug', 'nombre_comercial')
    .lt('id', id)
    .order('id', { ascending: false })
    .maybeSingle();
}

export async function getNext(id: number): Promise<MaterialNav | null> {
  return materials()
    .select('slug', 'nombre_comercial')
    .gt('id', id)
    .order('id', { ascending: true })
    .maybeSingle();
}

export async function getContributions(materialSlug: string): Promise<MaterialContribucion[]> {
  return contribuciones()
    .eq('material_slug', materialSlug)
    .eq('estado', 'aprobado')
    .order('created_at', { ascending: false })
    .execute();
}

export async function getProveedores(materialSlug: string): Promise<ProveedorPorMaterial[]> {
  return proveedoresPorMaterial()
    .select(
      'nombre_empresa',
      'slug',
      'plan',
      'pais',
      'ciudad',
      'visibility_score',
      'contribuciones'
    )
    .eq('material_slug', materialSlug)
    .order('visibility_score', { ascending: false })
    .execute();
}
