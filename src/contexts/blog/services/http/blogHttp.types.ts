export interface Articulo {
  id?: number;
  slug: string;
  titulo: string;
  subtitulo?: string;
  resumen?: string;
  extracto?: string;
  contenido?: string;
  categoria?: string;
  imagen_portada?: string;
  imagen_alt?: string;
  autor_nombre?: string;
  tags_busqueda?: string[];
  minutos_lectura?: number;
  destacado?: boolean;
  publicado?: boolean;
  created_at?: string;
  published_at?: string;
}
