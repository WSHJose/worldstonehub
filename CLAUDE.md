# CLAUDE.md — World Stone Hub

> Archivo de contexto permanente. Se carga automáticamente al inicio de cada sesión.
> Última actualización: 2026-04-08

---

## 📋 Proyecto

**World Stone Hub** — directorio B2B del sector de la piedra natural (mármol, granito, cuarcita, etc.).  
Conecta proveedores, canteras, distribuidores y compradores a nivel mundial.

- **Live site:** https://worldstonehub.com (activo desde 2026-04-01)
- **Repo GitHub:** https://github.com/WSHJose/worldstonehub
- **Deploy:** GitHub Pages (rama `main`, automático en cada push)
- **Owner:** Jose (WSHJose)

---

## 🛠️ Stack Técnico

| Capa      | Tecnología                                      |
| --------- | ----------------------------------------------- |
| Frontend  | **Astro 6** (SSG) + TypeScript                  |
| Database  | Supabase (PostgreSQL) + `@supabase/supabase-js` |
| Auth      | Supabase Auth                                   |
| Payments  | Stripe (**LIVE MODE** desde 2026-04-01)         |
| Analytics | Google Analytics 4                              |
| Build     | `astro build` → `dist/` → GitHub Pages          |

---

## 📁 Documentación por Dominio

Detalles específicos están organizados en `.claude/rules/`:

- **[@path/.claude/rules/db-schema.md]** — Tablas, columnas, triggers, vistas. Contenido automático: `content_score`, `visibility_score`.
- **[@path/.claude/rules/technical-decisions.md]** — Decisiones arquitectónicas, patrones JS, restricciones DB.
- **[@path/.claude/rules/visual-identity.md]** — Paleta de colores, tipografías, logo, favicon.
- **[@path/.claude/rules/project-files.md]** — Mapa completo de HTML, JS, SQL files.
- **[@path/.claude/rules/secrets-and-config.md]** — Dónde obtener credenciales (sin exponerlas aquí).

---

## 🔑 Configuración Rápida

**Supabase Project:** `whcptmdapnavcxcszwwk`  
**API URL:** `https://whcptmdapnavcxcszwwk.supabase.co`

⚠️ **Credenciales:** obtener de [@path/.claude/rules/secrets-and-config.md] o Supabase Dashboard. **NUNCA** en CLAUDE.md.

---

## 📊 Base de Datos — Resumen

~22.900 materiales + proveedores, contribuciones, anuncios. Triggers automáticos para scoring.  
REST API máximo ~1000 filas/request. Coordenadas: 50 materiales con precisión región, resto con centroide país.

**Scoring automático:**

- `content_score`: 0–100, badges ★ en materiales
- `visibility_score`: para proveedores (no usado en HTML aún)

---

## 🎨 Identidad Visual

**Colores:** oro principal `#A67C52`, elite `#C9A84C`, dark ink `#1A1917`, verde status `#27ae60`

**Tipografía:** Cormorant Garamond (display), Instrument Sans (body), DM Mono (datos)

**Logo:** SVG inline "WORLD STONE" + Hub (itálico, dorado)  
**Favicon:** W dorado sobre fondo dark

→ Detalles en [@path/.claude/rules/visual-identity.md]

---

## ✅ Estado Actual

**Funciona:**

- Catálogo materiales (filtros, búsqueda, badges ★, orden)
- Mapa interactivo (50 materiales geolocalizados)
- Directorio proveedores + fichas individuales
- Sistema contribuciones (DB + admin UI)
- Admin panel + panel proveedor privado
- Stripe checkout dinámico (Edge Functions)
- Google Analytics 4

**Pendiente crítico:**

- [ ] Oferta de Fundadores (página/PDF)
- [ ] `visibility_score` conectada a UI
- [ ] `content_score` auditable en admin

**Pendiente importante:**

- [ ] og:image para redes sociales
- [ ] Blog: contenido o eliminar
- [ ] `visibility_score` conectada a UI en `.astro` pages

---

## 💡 Key Technical Notes

1. **Astro SSG** — `src/pages/*.astro`, output estático, `astro build` → `dist/`
2. **Context-based architecture** — `src/contexts/{context}/services/http/{context}Http.ts` + `{context}Http.types.ts`
3. **API calls y tipos** — siempre en archivos `*Http.ts` / `*Http.types.ts` dentro del contexto correspondiente
4. **Shared HTTP** — `src/services/http/config.ts` exporta `supabase` (SDK client), `restFetch<T>()`, `restFetchCount()`
5. **`SET search_path = public`** en funciones PL/pgSQL
6. **Paginación:** máximo 1000 filas/request
7. **Git:** rama `main` es deployable. Push a `origin` dispara deploy.

→ Decisiones completas en [@path/.claude/rules/technical-decisions.md]
