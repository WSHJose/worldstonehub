<script setup lang="ts">
import { useGlobalSearch, type SearchItem } from '@contexts/shared/composables/useGlobalSearch';

const { query, results, loading, total, hasMore, setQuery, loadMore } = useGlobalSearch();

const trendingTags = [
  'Mármol Carrara',
  'Granito negro',
  'Travertino',
  'Cuarcita blanca',
  'Crema Marfil',
  'Levantina',
  'Pizarra',
  'Basalto',
];

const FLAG_CODES: Record<string, string> = {
  España: 'es', Italia: 'it', Portugal: 'pt', Grecia: 'gr', Turquía: 'tr',
  Francia: 'fr', Alemania: 'de', India: 'in', China: 'cn', Brasil: 'br',
  'Estados Unidos': 'us', México: 'mx', Canadá: 'ca', Argentina: 'ar',
  Chile: 'cl', Australia: 'au', Sudáfrica: 'za', Marruecos: 'ma',
  Egipto: 'eg', Irán: 'ir', Pakistán: 'pk', Vietnam: 'vn', Indonesia: 'id', Japón: 'jp',
};

function getFlag(pais: string): string {
  if (!pais) return '';
  const code = FLAG_CODES[pais] ?? FLAG_CODES[Object.keys(FLAG_CODES).find(k => k.toLowerCase() === pais.toLowerCase()) ?? ''];
  if (!code) return '';
  return `https://flagicons.lipis.dev/flags/1x1/${code}.svg`;
}

function thumbBg(item: SearchItem): string {
  if (item.t === 'cantera') return '#c4aa86';
  if (item.t === 'proveedor') return '#8a7a6a';
  return '#A67C52';
}

function onInput(e: Event) {
  setQuery((e.target as HTMLInputElement).value);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    setQuery('');
    (e.target as HTMLInputElement).value = '';
  }
}

function pickTrending(tag: string) {
  setQuery(tag);
}

const showResults = () => query.value.trim() && !loading.value && results.value.length > 0;
const showEmpty = () => query.value.trim() && !loading.value && results.value.length === 0;
const showTrending = () => !query.value.trim();
</script>

<template>
  <div class="sp-header">
    <div class="section-eyebrow" style="justify-content:center">Búsqueda inteligente</div>
    <h2 class="section-title" style="font-size:clamp(30px,3.5vw,46px);text-align:center">
      Encuentra la piedra,<br /><em>cantera o proveedor</em> perfecto
    </h2>
    <p class="sp-subtitle">
      22.000+ materiales · 180 canteras · todo en tiempo real
    </p>
  </div>

  <div class="sp-bar-wrap">
    <span class="sp-icon">&#9906;</span>
    <input
      type="text"
      class="sp-input"
      placeholder="Busca: mármol blanco Italia, Carrara, granito negro, Levantina, encimera cocina…"
      autocomplete="new-password"
      spellcheck="false"
      name="search"
      :value="query"
      @input="onInput"
      @keydown="onKeydown"
    />
    <span class="sp-kbd">ESC para cerrar</span>
  </div>

  <!-- Trending -->
  <div v-if="showTrending()" class="sp-trending">
    <div class="sp-trending-label">Búsquedas populares</div>
    <div class="sp-trending-tags">
      <button
        v-for="tag in trendingTags"
        :key="tag"
        class="sp-trending-tag"
        @click="pickTrending(tag)"
      >{{ tag }}</button>
    </div>
  </div>

  <!-- Loading skeleton -->
  <div v-if="loading" class="sp-results-wrap">
    <div class="sp-results-header">
      <span class="sp-results-count">Buscando…</span>
    </div>
    <div class="sp-results-grid">
      <div v-for="i in 6" :key="i" class="sp-card sp-card--skeleton">
        <div class="sp-card-thumb" style="background:#e2e0dc"></div>
        <div class="sp-card-body">
          <div style="height:14px;width:60%;background:#e2e0dc;border-radius:2px"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Results -->
  <div v-else-if="showResults()" class="sp-results-wrap">
    <div class="sp-results-header">
      <span class="sp-results-count">{{ total }} resultado{{ total !== 1 ? 's' : '' }}</span>
      <span class="sp-results-hint">Haz clic para ir a la ficha completa</span>
    </div>
    <div class="sp-results-grid">
      <a
        v-for="(item, idx) in results"
        :key="idx"
        class="sp-card"
        :href="item.link"
      >
        <div class="sp-card-thumb" :style="!item.img ? `background:${thumbBg(item)};opacity:0.35` : ''">
          <img v-if="item.img" :src="item.img" alt="" loading="lazy" />
        </div>
        <div class="sp-card-body">
          <div class="sp-card-main">
            <div class="sp-card-name">{{ item.n }}</div>
          </div>
          <img
            v-if="getFlag(item.pais)"
            :src="getFlag(item.pais)"
            width="18"
            height="18"
            :alt="item.pais"
            style="border-radius:3px;flex-shrink:0"
            loading="lazy"
          />
        </div>
      </a>
    </div>
    <div v-if="hasMore" class="sp-results-more">
      <button class="sp-more-btn" @click="loadMore">Ver más resultados</button>
    </div>
  </div>

  <!-- Empty -->
  <div v-else-if="showEmpty()" class="sp-empty">
    <div class="sp-empty-icon">&#9670;</div>
    <div class="sp-empty-title">Sin resultados</div>
    <div class="sp-empty-sub">Prueba con: blanco, Italia, granito, Carrara, Levantina...</div>
  </div>
</template>

<style scoped>
.sp-more-btn {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #a67c52;
  border: 1px solid rgba(166, 124, 82, 0.4);
  background: transparent;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s;
}
.sp-more-btn:hover {
  border-color: #a67c52;
  background: rgba(166, 124, 82, 0.06);
}
.sp-card--skeleton {
  pointer-events: none;
  animation: spFadeIn 0.3s ease both;
}
</style>
