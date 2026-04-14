<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGlobalSearch, type SearchItem } from '@contexts/shared/composables/useGlobalSearch';

const { query, results, loading, total, hasMore, setQuery, loadMore } = useGlobalSearch();

const inputFocused = ref(false);

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
  España: 'es',
  Italia: 'it',
  Portugal: 'pt',
  Grecia: 'gr',
  Turquía: 'tr',
  Francia: 'fr',
  Alemania: 'de',
  India: 'in',
  China: 'cn',
  Brasil: 'br',
  'Estados Unidos': 'us',
  México: 'mx',
  Canadá: 'ca',
  Argentina: 'ar',
  Chile: 'cl',
  Australia: 'au',
  Sudáfrica: 'za',
  Marruecos: 'ma',
  Egipto: 'eg',
  Irán: 'ir',
  Pakistán: 'pk',
  Vietnam: 'vn',
  Indonesia: 'id',
  Japón: 'jp',
};

function getFlag(pais: string): string {
  if (!pais) return '';
  const code =
    FLAG_CODES[pais] ??
    FLAG_CODES[Object.keys(FLAG_CODES).find((k) => k.toLowerCase() === pais.toLowerCase()) ?? ''];
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

const showResults = computed(
  () => query.value.trim() && !loading.value && results.value.length > 0
);
const showEmpty = computed(
  () => query.value.trim() && !loading.value && results.value.length === 0
);
const showTrending = computed(() => !query.value.trim());
</script>

<template>
  <!-- Header -->
  <div class="mb-8 text-center">
    <div class="section-eyebrow" style="justify-content: center">Búsqueda inteligente</div>
    <h2 class="section-title" style="font-size: clamp(30px, 3.5vw, 46px); text-align: center">
      Encuentra la piedra,<br /><em>cantera o proveedor</em> perfecto
    </h2>
    <p class="mt-3 text-[11px] text-text-muted uppercase tracking-[2px]">
      22.000+ materiales · 180 canteras · todo en tiempo real
    </p>
  </div>

  <!-- Search bar -->
  <div class="relative mb-4">
    <span
      class="top-1/2 left-[18px] z-[2] absolute text-ochre text-xl -translate-y-1/2 pointer-events-none"
      >&#9906;</span
    >
    <input
      type="text"
      class="bg-surface-0 focus:shadow-[0_0_0_3px_rgba(166,124,82,0.1)] py-[18px] pr-[120px] pl-[52px] border border-border focus:border-ochre outline-none w-full font-body text-text-primary placeholder:text-text-muted placeholder:text-sm text-base tracking-[0.3px] transition-[border-color,box-shadow] duration-300"
      placeholder="Busca: mármol blanco Italia, Carrara, granito negro, Levantina, encimera cocina…"
      autocomplete="new-password"
      spellcheck="false"
      name="search"
      :value="query"
      @input="onInput"
      @keydown="onKeydown"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
    />
    <span
      class="top-1/2 right-4 absolute text-[9px] text-text-muted uppercase tracking-[2px] transition-opacity -translate-y-1/2 duration-300 pointer-events-none"
      :class="inputFocused ? 'opacity-100' : 'opacity-0'"
      >ESC para cerrar</span
    >
  </div>

  <!-- Trending -->
  <div v-if="showTrending" class="mt-5 pt-4 border-black/[0.07] border-t">
    <div class="mb-2.5 text-[9px] text-text-muted uppercase tracking-[4px]">
      Búsquedas populares
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in trendingTags"
        :key="tag"
        class="bg-transparent hover:bg-ochre/[0.04] px-3.5 py-1.5 border border-black/10 hover:border-ochre font-body text-[11px] text-ochre tracking-[1px] transition-all cursor-pointer"
        @click="pickTrending(tag)"
      >
        {{ tag }}
      </button>
    </div>
  </div>

  <!-- Loading skeleton -->
  <div v-if="loading" class="mt-1">
    <div class="flex justify-between items-center mb-3 pb-2.5 border-black/[0.07] border-b">
      <span class="text-[10px] text-ochre uppercase tracking-[3px]">Buscando…</span>
    </div>
    <div class="flex flex-col gap-0.5">
      <div
        v-for="i in 6"
        :key="i"
        class="flex items-stretch bg-surface-0 border border-border animate-[spFadeIn_0.3s_ease_both] pointer-events-none"
      >
        <div class="bg-border w-16 h-16 shrink-0"></div>
        <div class="flex flex-1 items-center px-4 py-3.5">
          <div class="bg-border rounded-sm w-3/5 h-3.5"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Results -->
  <div v-else-if="showResults" class="mt-1">
    <div class="flex justify-between items-center mb-3 pb-2.5 border-black/[0.07] border-b">
      <span class="text-[10px] text-ochre uppercase tracking-[3px]">
        {{ total }} resultado{{ total !== 1 ? 's' : '' }}
      </span>
      <span class="text-[10px] text-text-muted tracking-[1px]"
        >Haz clic para ir a la ficha completa</span
      >
    </div>
    <div class="flex flex-col gap-0.5">
      <a
        v-for="(item, idx) in results"
        :key="idx"
        class="group flex items-stretch bg-surface-0 hover:bg-surface-1 border border-border hover:border-ochre/35 text-inherit no-underline transition-[background,border-color,transform] hover:translate-x-1 animate-[spFadeIn_0.2s_ease_both] duration-200"
        :href="item.link"
      >
        <div
          class="flex items-center self-stretch w-16 overflow-hidden shrink-0"
          :style="
            !item.img ? `background:${thumbBg(item)};opacity:0.35` : 'background:rgba(0,0,0,0.3)'
          "
        >
          <img
            v-if="item.img"
            :src="item.img"
            alt=""
            loading="lazy"
            class="block brightness-90 group-hover:brightness-100 w-full h-full object-cover transition-[filter]"
          />
        </div>
        <div class="flex flex-1 items-center gap-4 px-4 py-3.5 min-w-0">
          <div class="flex-1 min-w-0">
            <div
              class="overflow-hidden font-display text-[18px] text-text-primary text-ellipsis leading-[1.2] whitespace-nowrap"
            >
              {{ item.n }}
            </div>
          </div>
          <img
            v-if="getFlag(item.pais)"
            :src="getFlag(item.pais)"
            width="18"
            height="18"
            :alt="item.pais"
            class="rounded-[3px] shrink-0"
            loading="lazy"
          />
        </div>
      </a>
    </div>
    <div v-if="hasMore" class="mt-3 text-center">
      <button
        class="bg-transparent hover:bg-ochre/[0.06] px-6 py-2.5 border border-ochre/40 hover:border-ochre font-body text-[11px] text-ochre uppercase tracking-[2px] transition-all cursor-pointer"
        @click="loadMore"
      >
        Ver más resultados
      </button>
    </div>
  </div>

  <!-- Empty -->
  <div v-else-if="showEmpty" class="py-8 text-center">
    <div class="opacity-40 mb-2 text-text-muted text-2xl">&#9670;</div>
    <div class="mb-1.5 font-display text-[22px] text-ochre">Sin resultados</div>
    <div class="text-text-muted text-xs">
      Prueba con: blanco, Italia, granito, Carrara, Levantina...
    </div>
  </div>
</template>

<style>
@keyframes spFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
