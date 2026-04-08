export interface Proveedor {
  id: string;
  slug: string;
  user_id?: string;
  nombre_empresa: string;
  tipo_empresa?: string;
  sector?: string[];
  plan: 'elite' | 'profesional' | 'presencia' | 'free';
  plan_activo?: boolean;
  estado: string;
  activo?: boolean;
  verificado?: boolean;
  descripcion?: string;
  pais?: string;
  ciudad?: string;
  website?: string;
  email_contacto?: string;
  telefono?: string;
  logo_url?: string;
  ano_fundacion?: number;
  num_empleados?: string;
  materiales?: string[];
  certificaciones?: string[];
  visibility_score?: number;
  contribuciones?: number;
}
