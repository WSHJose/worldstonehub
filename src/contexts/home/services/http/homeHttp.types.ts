export interface Anuncio {
  imagen_url: string;
  url_destino: string;
  texto_alt?: string;
  espacio_codigo?: string;
  activo?: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface SolicitudFundador {
  id: string;
  estado?: string;
}
