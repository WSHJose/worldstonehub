import { restFetch } from '@services/http/config';
import type { Articulo } from './blogHttp.types';

export async function getAll(): Promise<Articulo[]> {
  return restFetch<Articulo[]>(
    'articulos?select=id,slug,titulo,subtitulo,categoria,resumen,imagen_portada,imagen_alt,autor_nombre,tags_busqueda,minutos_lectura,destacado,publicado,created_at,published_at&publicado=eq.true&order=published_at.desc,created_at.desc'
  );
}

export async function getBySlug(slug: string): Promise<Articulo | null> {
  const results = await restFetch<Articulo[]>(
    `articulos?select=*&slug=eq.${encodeURIComponent(slug)}&publicado=eq.true&limit=1`
  );
  return results[0] ?? null;
}
