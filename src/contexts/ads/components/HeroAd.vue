<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAdByCode } from '@contexts/ads/services/http/adsHttp';
import type { Advertisement } from '@contexts/ads/services/http/adsHttp.types';

const props = defineProps<{
  code: string;
  fill?: boolean;
}>();

const emit = defineEmits<{
  loaded: [];
}>();

const ad = ref<Advertisement | null>(null);

onMounted(async () => {
  try {
    const data = await getAdByCode(props.code);
    if (!data.length) return;

    const today = new Date().toISOString().slice(0, 10);
    const valid = data.filter((a) => {
      if (a.startDate && a.startDate > today) return false;
      if (a.endDate && a.endDate < today) return false;
      return true;
    });

    if (!valid.length) return;
    ad.value = valid[0];
    emit('loaded');
  } catch {
    // No ad available — stay hidden
  }
});

function resolveHref(url: string): string {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
}
</script>

<template>
  <div v-if="ad" :class="['hero-ad', { 'hero-ad--fill': fill }]">
    <p class="hero-ad__label">Publicidad</p>
    <a
      :href="resolveHref(ad.destinationUrl)"
      class="hero-ad__link"
      target="_blank"
      rel="noopener sponsored"
    >
      <img
        :src="ad.imageUrl"
        :alt="ad.altText || 'Publicidad'"
        class="hero-ad__img"
        loading="lazy"
      />
    </a>
  </div>
</template>

<style scoped>
.hero-ad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
}

.hero-ad__label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0;
}

.hero-ad__link {
  display: block;
  border: 1px solid var(--border);
  transition: border-color 200ms ease-out;
}

.hero-ad__link:hover {
  border-color: var(--border-strong);
}

.hero-ad__img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Fill variant — covers parent container edge-to-edge */
.hero-ad--fill {
  position: absolute;
  inset: 0;
  gap: 0;
}

.hero-ad--fill .hero-ad__label {
  position: absolute;
  bottom: 8px;
  right: 12px;
  z-index: 2;
  color: var(--text-faint);
}

.hero-ad--fill .hero-ad__link {
  flex: 1;
  width: 100%;
  border: none;
}

.hero-ad--fill .hero-ad__link:hover {
  border: none;
}

.hero-ad--fill .hero-ad__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: none;
}
</style>
