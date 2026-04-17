/** Raw shape returned by the Supabase REST API (DB column names). */
export interface RawAdvertisement {
  imagen_url: string;
  url_destino: string;
  texto_alt?: string;
  espacio_codigo?: string;
  activo?: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
}

/** Domain type used throughout the application (English field names). */
export interface Advertisement {
  imageUrl: string;
  destinationUrl: string;
  altText?: string;
  spaceCode?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
}
