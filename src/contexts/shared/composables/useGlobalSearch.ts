import { ref, computed } from 'vue';
import { restFetchPaged } from '@services/http/config';

export interface SearchItem {
  t: 'material' | 'cantera' | 'proveedor';
  n: string;
  pais: string;
  img: string;
  link: string;
}

interface MaterialSearchRow {
  slug: string;
  nombre_comercial: string;
  origen_pais: string | string[] | null;
  imagen_url_principal: string | null;
}

interface canteraSearchRow {
  slug: string;
  nombre: string;
  tipo_piedra: string | null;
  pais: string | null;
}

interface ProveedorSearchRow {
  slug: string;
  nombre_empresa: string;
  tipo_empresa: string | null;
  pais: string | null;
  logo_url: string | null;
  plan: string;
}

const PAGE_SIZE = 6;

interface EntityState {
  offset: number;
  total: number;
}

function encodeQuery(q: string): string {
  return encodeURIComponent(`*${q}*`);
}

async function fetchMateriales(q: string, offset: number) {
  const eq = encodeQuery(q);
  const path =
    `materiales?select=slug,nombre_comercial,origen_pais,imagen_url_principal` +
    `&activo=eq.true` +
    `&or=(nombre_comercial.ilike.${eq},categoria.ilike.${eq},color_principal.ilike.${eq},subcategoria.ilike.${eq})` +
    `&order=content_score.desc,nombre_comercial.asc`;
  const { data, total } = await restFetchPaged<MaterialSearchRow>(path, PAGE_SIZE, offset);
  const items: SearchItem[] = data.map((m) => ({
    t: 'material',
    n: m.nombre_comercial || '',
    pais: Array.isArray(m.origen_pais) ? m.origen_pais[0] || '' : m.origen_pais || '',
    img: m.imagen_url_principal || '',
    link: m.slug ? `material.html?id=${m.slug}` : 'materiales.html',
  }));
  return { items, total };
}

async function fetchCanteras(q: string, offset: number) {
  const eq = encodeQuery(q);
  const path =
    `canteras?select=slug,nombre,tipo_piedra,pais` +
    `&or=(nombre.ilike.${eq},tipo_piedra.ilike.${eq},pais.ilike.${eq},color_principal.ilike.${eq})` +
    `&order=nombre.asc`;
  const { data, total } = await restFetchPaged<canteraSearchRow>(path, PAGE_SIZE, offset);
  const items: SearchItem[] = data.map((c) => ({
    t: 'cantera',
    n: c.nombre || '',
    pais: c.pais || '',
    img: '',
    link: c.slug ? `cantera.html?id=${c.slug}` : 'canteras.html',
  }));
  return { items, total };
}

async function fetchProveedores(q: string, offset: number) {
  const eq = encodeQuery(q);
  const path =
    `proveedores?select=slug,nombre_empresa,tipo_empresa,pais,logo_url,plan` +
    `&estado=eq.activo` +
    `&or=(nombre_empresa.ilike.${eq},tipo_empresa.ilike.${eq},pais.ilike.${eq})` +
    `&order=nombre_empresa.asc`;
  const { data, total } = await restFetchPaged<ProveedorSearchRow>(path, PAGE_SIZE, offset);
  const items: SearchItem[] = data.map((p) => ({
    t: 'proveedor',
    n: p.nombre_empresa || '',
    pais: p.pais || '',
    img: p.logo_url || '',
    link: p.slug ? `proveedor.html?id=${p.slug}` : 'proveedores.html',
  }));
  return { items, total };
}

export function useGlobalSearch() {
  const query = ref('');
  const results = ref<SearchItem[]>([]);
  const loading = ref(false);
  const total = ref(0);

  const entityState = ref<Record<'material' | 'cantera' | 'proveedor', EntityState>>({
    material: { offset: 0, total: 0 },
    cantera: { offset: 0, total: 0 },
    proveedor: { offset: 0, total: 0 },
  });

  const hasMore = computed(() => {
    const s = entityState.value;
    return (
      s.material.offset < s.material.total ||
      s.cantera.offset < s.cantera.total ||
      s.proveedor.offset < s.proveedor.total
    );
  });

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function setQuery(q: string) {
    query.value = q;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!q.trim()) {
      results.value = [];
      total.value = 0;
      return;
    }
    debounceTimer = setTimeout(() => runSearch(q.trim()), 300);
  }

  async function runSearch(q: string) {
    loading.value = true;
    results.value = [];
    entityState.value = {
      material: { offset: 0, total: 0 },
      cantera: { offset: 0, total: 0 },
      proveedor: { offset: 0, total: 0 },
    };

    try {
      const [mats, cants, provs] = await Promise.all([
        fetchMateriales(q, 0),
        fetchCanteras(q, 0),
        fetchProveedores(q, 0),
      ]);

      entityState.value.material = { offset: mats.items.length, total: mats.total };
      entityState.value.cantera = { offset: cants.items.length, total: cants.total };
      entityState.value.proveedor = { offset: provs.items.length, total: provs.total };

      results.value = [...mats.items, ...cants.items, ...provs.items];
      total.value = mats.total + cants.total + provs.total;
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (!query.value.trim() || loading.value) return;
    loading.value = true;
    const q = query.value.trim();
    const s = entityState.value;

    try {
      const fetches: Promise<{ items: SearchItem[]; total: number }>[] = [];
      const types: ('material' | 'cantera' | 'proveedor')[] = [];

      if (s.material.offset < s.material.total) {
        fetches.push(fetchMateriales(q, s.material.offset));
        types.push('material');
      }
      if (s.cantera.offset < s.cantera.total) {
        fetches.push(fetchCanteras(q, s.cantera.offset));
        types.push('cantera');
      }
      if (s.proveedor.offset < s.proveedor.total) {
        fetches.push(fetchProveedores(q, s.proveedor.offset));
        types.push('proveedor');
      }

      const responses = await Promise.all(fetches);
      responses.forEach((res, i) => {
        const type = types[i];
        entityState.value[type].offset += res.items.length;
        results.value = [...results.value, ...res.items];
      });
    } finally {
      loading.value = false;
    }
  }

  return { query, results, loading, total, hasMore, setQuery, loadMore };
}
