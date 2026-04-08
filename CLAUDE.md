# CLAUDE.md — World Stone Hub

> Archivo de contexto permanente. Se carga automáticamente al inicio de cada sesión.
> Última actualización: 2026-04-03

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

| Capa      | Tecnología                              |
| --------- | --------------------------------------- |
| Frontend  | HTML + CSS + JS vanilla (sin framework) |
| Database  | Supabase (PostgreSQL)                   |
| Auth      | Supabase Auth                           |
| Payments  | Stripe (**LIVE MODE** desde 2026-04-01) |
| Analytics | Google Analytics 4                      |
| Deploy    | GitHub Pages                            |

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
- [ ] Unificar `sector-*.html` → `sector.html?id=`
- [ ] `index.html` 690KB — lazy-load

---

## 💡 Key Technical Notes

1. **No framework JS** — vanilla only
2. **Supabase REST directo** — fetch() nativo, no SDK JS
3. **`SET search_path = public`** en funciones PL/pgSQL
4. **Paginación:** máximo 1000 filas/request
5. **No build system** — cambios HTML/JS/CSS directos en `main`
6. **Git:** rama `main` es deployable

→ Decisiones completas en [@path/.claude/rules/technical-decisions.md]
