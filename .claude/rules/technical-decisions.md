---
name: Technical Decisions
description: Decisiones arquitectónicas, patrones de código y restricciones técnicas
type: feedback
---

# Technical Decisions

## Frontend Architecture

1. **Astro 6 SSG** — framework de páginas. Todas las páginas en `src/pages/*.astro`. Output estático con `astro build`.

2. **TypeScript** — todo el código nuevo en `.ts` / `.astro` con tipado. Interfaces en `*Http.types.ts`.

3. **Context-based architecture** — cada dominio tiene su propio directorio:

   ```
   src/contexts/{context}/services/http/{context}Http.ts        ← funciones API
   src/contexts/{context}/services/http/{context}Http.types.ts  ← interfaces TS
   src/contexts/{context}/components/                           ← componentes Astro del contexto (opcional)
   ```

   Contextos actuales: `auth`, `blog`, `canteras`, `home`, `materials`, `proveedores`
   - `src/components/` → **solo componentes compartidos** (Navbar, Footer, etc.)
   - `src/contexts/{context}/components/` → componentes exclusivos de ese dominio

4. **Shared HTTP layer** — `src/services/http/config.ts` exporta:
   - `supabase` — cliente `@supabase/supabase-js` (para queries complejas)
   - `restFetch<T>(path, extraHeaders?)` — fetch directo a REST API con tipado genérico
   - `restFetchCount(path)` — fetch con `Prefer: count=exact` para totales

5. **Dual API pattern** — dentro de `*Http.ts` se usan ambos según complejidad:
   - `supabase.from(...).select(...)` — para queries con filtros encadenados o `.single()`
   - `restFetch<T>(...)` — para queries con fields específicos, order, limit/offset

6. **`origen_region` parsing** — función `arr()` en TS parsea 3 formatos:
   - PostgreSQL array: `{Toscana}`
   - JSON string: `["Italy (Lazio)"]`
   - null: sin región

7. **Paginación** — máximo ~1000 filas/request. Para datasets grandes: múltiples páginas con `offset`.

## Database & Scoring

8. **`content_score` no editable** — calculado automáticamente por trigger. Solo lectura en admin.

9. **Coordenadas de materiales** — 50 materiales ★★/★★★ con coords precisas. Resto: coords aproximadas por país (centroide + jitter).

10. **REFRESH vistas materializadas** — tras cambios en dependencias, ejecutar manualmente.

11. **PL/pgSQL con `SET search_path = public`** — Supabase ejecuta funciones con search_path vacío. Siempre añadir esta cláusula en DDL.

## Deployment & Build

12. **Build command:** `astro build` → genera `dist/` → GitHub Pages sirve desde `dist/`

13. **`build.format: 'file'`** en `astro.config.mjs` — genera `materiales.html` en vez de `materiales/index.html` (compatibilidad con URLs existentes).

14. **Git workflow** — rama `main` es deployable. Push a `origin main` dispara deploy automático.

## CSS / Tailwind

15. **Tailwind CSS 4** — instalado via `@tailwindcss/vite` (plugin Vite). No usar `@astrojs/tailwind` (solo compatible con Tailwind 3).
16. **Tokens `@theme`** — declarados en `src/styles/global.css` justo después del `@import "tailwindcss"`. Generan clases utilitarias con los colores, tipografías y espaciados del Brand Book: `bg-ochre`, `text-text-primary`, `font-display`, `bg-surface-dark`, `spacing-*`, etc. **Siempre usar estos tokens en componentes nuevos**, no hardcodear valores hex ni usar clases Tailwind genéricas (`bg-amber-600`) para colores de marca.
17. **`:root` legacy** — las variables CSS `--gold`, `--ink`, `--font-mono`, etc. siguen activas para CSS inline existente. En código nuevo preferir clases Tailwind generadas por `@theme`.

## Icons

18. **unplugin-icons** — librería instalada para iconos. Import syntax: `import IconName from '~icons/{set}/{icon-name}'`. Configurado en `astro.config.mjs` con `compiler: 'astro'`.
19. **Lucide primero** — usar `~icons/lucide/{icon}` como primera opción. Solo usar otro set (`mdi`, `tabler`, etc.) si el icono no existe en Lucide.
20. **No migrar flags de países** — los flags (lipis.dev CDN) se mantienen como están; unplugin-icons no tiene flags de países.

## Stripe

21. **Stripe dinámico** — sin payment links estáticos. Todo vía Edge Functions:
    - `create-checkout`: genera sesión por actor+plan+billing
    - `stripe-webhook`: activa proveedor en DB tras `checkout.session.completed`
