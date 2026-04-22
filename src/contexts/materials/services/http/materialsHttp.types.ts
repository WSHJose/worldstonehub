export interface MaterialBasic {
  slug: string;
  nombre_comercial: string;
  content_score: number;
  categoria: string;
}

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
}
