export interface Cantera {
  id: string;
  slug: string;
  nombre: string;
  tipo_piedra?: string;
  pais?: string;
  localizacion?: string;
  continente?: string;
  materiales?: string[];
  color_principal?: string;
  activo?: boolean;
  lat?: number;
  lng?: number;
}

export interface MaterialCanteraJoin {
  material_id: string;
  materiales: {
    id: number;
    slug: string;
    nombre_comercial: string;
    categoria: string;
    color_principal?: string;
  };
}
