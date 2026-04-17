import { restFetch } from '@services/http/config';
import type { Advertisement, RawAdvertisement } from './adsHttp.types';

function mapAdvertisement(raw: RawAdvertisement): Advertisement {
  return {
    imageUrl: raw.imagen_url,
    destinationUrl: raw.url_destino,
    altText: raw.texto_alt,
    spaceCode: raw.espacio_codigo,
    active: raw.activo,
    startDate: raw.fecha_inicio,
    endDate: raw.fecha_fin,
  };
}

export async function getAdByCode(code: string): Promise<Advertisement[]> {
  const raw = await restFetch<RawAdvertisement[]>(
    `anuncios?select=imagen_url,url_destino,texto_alt,fecha_inicio,fecha_fin&espacio_codigo=eq.${encodeURIComponent(code)}&activo=eq.true&limit=5`
  );
  return raw.map(mapAdvertisement);
}
