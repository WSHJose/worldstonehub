export const FLAG_CODES: Record<string, string> = {
  España: 'es',
  Italia: 'it',
  Portugal: 'pt',
  Grecia: 'gr',
  Turquía: 'tr',
  Francia: 'fr',
  Alemania: 'de',
  Austria: 'at',
  Bélgica: 'be',
  'Países Bajos': 'nl',
  Suecia: 'se',
  Noruega: 'no',
  Finlandia: 'fi',
  Polonia: 'pl',
  'República Checa': 'cz',
  Eslovenia: 'si',
  Croacia: 'hr',
  Serbia: 'rs',
  Bulgaria: 'bg',
  Rumanía: 'ro',
  Ucrania: 'ua',
  Rusia: 'ru',
  India: 'in',
  China: 'cn',
  Brasil: 'br',
  'Estados Unidos': 'us',
  México: 'mx',
  Canadá: 'ca',
  Argentina: 'ar',
  Chile: 'cl',
  Perú: 'pe',
  Colombia: 'co',
  Australia: 'au',
  Sudáfrica: 'za',
  Marruecos: 'ma',
  Egipto: 'eg',
  Irán: 'ir',
  Pakistán: 'pk',
  Vietnam: 'vn',
  Indonesia: 'id',
  Tailandia: 'th',
  Japón: 'jp',
  'Corea del Sur': 'kr',
  Israel: 'il',
  'Arabia Saudita': 'sa',
  Etiopía: 'et',
  Tanzania: 'tz',
  Zimbabwe: 'zw',
  Madagascar: 'mg',
  Bolivia: 'bo',
  Ecuador: 'ec',
  Venezuela: 've',
  Uruguay: 'uy',
  Paraguay: 'py',
  Honduras: 'hn',
  Guatemala: 'gt',
  Cuba: 'cu',
  Nigeria: 'ng',
  Ghana: 'gh',
  Angola: 'ao',
  Mozambique: 'mz',
  Namibia: 'na',
  Kenia: 'ke',
  Túnez: 'tn',
  Argelia: 'dz',
  Azerbaiyán: 'az',
  Georgia: 'ge',
  Armenia: 'am',
  Hungría: 'hu',
  Eslovaquia: 'sk',
  Letonia: 'lv',
  Lituania: 'lt',
  Estonia: 'ee',
  Suiza: 'ch',
  'Reino Unido': 'gb',
  Irlanda: 'ie',
  'Nueva Zelanda': 'nz',
  Filipinas: 'ph',
  Malasia: 'my',
  'Sri Lanka': 'lk',
  Nepal: 'np',
  Afganistán: 'af',
  Libia: 'ly',
  Sudán: 'sd',
  Moldavia: 'md',
  Bielorrusia: 'by',
  Kosovo: 'xk',
  Montenegro: 'me',
  Albania: 'al',
};

export function getFlagCode(pais: string | null | undefined): string | null {
  if (!pais) return null;
  const name = String(pais).trim();
  if (!name) return null;
  const direct = FLAG_CODES[name];
  if (direct) return direct;
  const lower = name.toLowerCase();
  for (const k in FLAG_CODES) {
    if (k.toLowerCase() === lower) return FLAG_CODES[k];
  }
  return null;
}

export function getFlagUrl(pais: string | null | undefined): string | null {
  const code = getFlagCode(pais);
  return code ? `https://flagicons.lipis.dev/flags/1x1/${code}.svg` : null;
}

export interface FlagImgOptions {
  size?: number;
  rounded?: boolean;
  hideOnError?: boolean;
  loading?: 'lazy' | 'eager';
}

export function getFlagImg(
  pais: string | string[] | null | undefined,
  options: FlagImgOptions = {}
): string {
  const name = Array.isArray(pais) ? String(pais[0] || '') : pais ? String(pais) : '';
  const url = getFlagUrl(name);
  if (!url) return '';
  const size = options.size ?? 18;
  const rounded = options.rounded ?? true;
  const hideOnError = options.hideOnError ?? true;
  const loading = options.loading ?? 'lazy';
  const alt = name.replace(/"/g, '&quot;');
  const style =
    (rounded ? 'border-radius:3px;' : '') +
    'flex-shrink:0;display:inline-block;vertical-align:middle';
  const onerror = hideOnError ? ' onerror="this.style.display=\'none\'"' : '';
  return (
    `<img src="${url}" width="${size}" height="${size}" alt="${alt}"` +
    ` style="${style}" loading="${loading}"${onerror}>`
  );
}
