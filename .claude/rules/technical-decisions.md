---
name: Technical Decisions
description: Decisiones arquitectónicas, patrones de código y restricciones técnicas
type: feedback
---

# Technical Decisions

## Frontend Architecture

1. **No JavaScript framework** — vanilla JS only (sin React/Vue/etc). Mantener así.

2. **Supabase REST API directo** — fetch() nativo con headers, NO Supabase JS SDK.

3. **PL/pgSQL con `SET search_path = public`** — Supabase ejecuta funciones con search_path vacío. Siempre añadir esta cláusula en DDL.

4. **`origen_region` parsing** — función `arr()` en JS parsea 3 formatos automáticamente:
   - PostgreSQL array: `{Toscana}`
   - JSON string: `["Italy (Lazio)"]`
   - null: sin región

5. **Paginación** — máximo ~1000 filas/request. Para datasets grandes: múltiples páginas con `offset`.

## Database & Scoring

6. **`content_score` no editable** — calculado automáticamente por trigger. No hay UI de edición, solo lectura en admin para auditoría.

7. **Coordenadas de materiales** — 50 materiales ★★/★★★ con coords precisas (región/cantera). Resto: coords aproximadas por país (centroide + jitter).

8. **REFRESH vistas materializadas** — tras cambios en dependencias, ejecutar manualmente.

## Deployment & Build

9. **No build system** — cambios en HTML/JS/CSS son directos en `main` → GitHub Pages automático.

10. **Git workflow** — rama `main` es deployable. Push a `origin` dispara deploy.

## Data API Calls

11. **Headers estándar:**
    ```js
    {
      'apikey': SUPABASE_PUBLISHABLE_KEY,
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    }
    ```

12. **Stripe dinámico** — sin payment links estáticos. Todo vía Edge Functions:
    - `create-checkout`: genera sesión por actor+plan+billing
    - `stripe-webhook`: activa proveedor en DB tras `checkout.session.completed`
