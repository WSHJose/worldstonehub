export interface Material {
  id: number;
  slug: string;
  nombre_comercial: string;
  nombre_cientifico?: string;
  nombres_alternativos?: string[];
  categoria: string;
  subcategoria?: string;
  color_principal?: string;
  color_acento?: string;
  origen_pais?: string | string[];
  origen_region?: string | string[];
  acabados_disponibles?: string[];
  usos_recomendados?: string[];
  propiedades_tecnicas?: Record<string, unknown>;
  tags_busqueda?: string[];
  imagen_url?: string;
  imagen_url_principal?: string;
  activo?: boolean;
  content_score?: number;
  precio_orientativo?: string;
  lat?: number;
  lng?: number;
}

export type MaterialBasic = Pick<
  Material,
  'slug' | 'nombre_comercial' | 'content_score' | 'categoria'
>;

export type MaterialCard = Pick<
  Material,
  | 'id'
  | 'slug'
  | 'nombre_comercial'
  | 'categoria'
  | 'subcategoria'
  | 'color_principal'
  | 'color_acento'
  | 'origen_pais'
  | 'origen_region'
  | 'imagen_url_principal'
  | 'content_score'
  | 'precio_orientativo'
  | 'activo'
  | 'acabados_disponibles'
  | 'usos_recomendados'
  | 'tags_busqueda'
  | 'nombres_alternativos'
  | 'propiedades_tecnicas'
>;

export type MaterialMapPoint = Pick<
  Material,
  | 'id'
  | 'slug'
  | 'nombre_comercial'
  | 'categoria'
  | 'color_principal'
  | 'origen_pais'
  | 'origen_region'
  | 'imagen_url_principal'
  | 'content_score'
  | 'lat'
  | 'lng'
>;

export type MaterialSearchHit = Pick<
  Material,
  | 'slug'
  | 'nombre_comercial'
  | 'categoria'
  | 'color_principal'
  | 'origen_pais'
  | 'imagen_url_principal'
>;

export type MaterialNav = Pick<Material, 'slug' | 'nombre_comercial'>;

export interface MaterialContribucion {
  id: string;
  proveedor_slug: string;
  material_slug: string;
  tipo_contribucion: string;
  contenido: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  created_at: string;
}

export interface ProveedorPorMaterial {
  nombre_empresa: string;
  slug: string;
  plan: string;
  pais?: string;
  ciudad?: string;
  visibility_score?: number;
  contribuciones?: number;
  material_slug?: string;
}
