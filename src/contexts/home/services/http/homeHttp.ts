import { restFetch, restFetchCount } from '@services/http/config';
import type { Anuncio } from './homeHttp.types';

export async function getAdByCode(codigo: string): Promise<Anuncio[]> {
  return restFetch<Anuncio[]>(
    `anuncios?select=imagen_url,url_destino,texto_alt,fecha_inicio,fecha_fin&espacio_codigo=eq.${encodeURIComponent(codigo)}&activo=eq.true&limit=5`
  );
}

export async function getFundadoresCount(): Promise<number | null> {
  return restFetchCount('solicitudes_fundadores?estado=neq.rechazado');
}
