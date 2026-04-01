# CLAUDE.md — World Stone Hub
> Archivo de contexto permanente. Se carga automáticamente al inicio de cada sesión.
> Última actualización: 2026-03-31

---

## Proyecto

**World Stone Hub** — directorio B2B del sector de la piedra natural (mármol, granito, cuarcita, etc.).
Conecta proveedores, canteras, distribuidores y compradores a nivel mundial.

- **Live site:** https://worldstonehub.com (dominio activo desde 2026-04-01 · DNS propagando)
- **Repo GitHub:** https://github.com/WSHJose/worldstonehub
- **Deploy:** GitHub Pages (rama `main`, automático en cada push)
- **Propietario:** Jose (WSHJose)

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML estático + CSS + JS vanilla (sin framework) |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (bucket `materiales`) |
| Pagos | Stripe (actualmente en TEST MODE) |
| Analytics | Google Analytics 4 — `G-Z386REXEZF` |
| Deploy | GitHub Pages |

---

## Credenciales y configuración

### Supabase
- **Project ID:** `whcptmdapnavcxcszwwk`
- **URL:** `https://whcptmdapnavcxcszwwk.supabase.co`
- **Publishable key (nueva, activa desde 2026-03-25):**
  `sb_publishable_CsE_EOAwQSJgKDC2eEcBOA_UztVp7gO`
- **Personal Access Token (Management API / DDL):**
  `sbp_b78a17f932fa333f2bf8dd8082944163ab89f936`
- **Management API endpoint:**
  `POST https://api.supabase.com/v1/projects/whcptmdapnavcxcszwwk/database/query`
- ⚠️ Las JWT keys antiguas (eyJhbGci...) fueron desactivadas el 2026-03-25

### Stripe
- **LIVE MODE** activo desde 2026-04-01
- 3 productos: `prod_UFp0wbjjA0P39j` (Presencia) · `prod_UFp0DiTVCMUFTl` (Profesional) · `prod_UFp0jz4JHheaR6` (Elite)
- 40 precios creados (20 anual + 20 mensual, lookup_key por actor+importe+periodo)
- Webhook: `we_1THJQn5kSYznftY2B2tDPrnX` → `supabase.co/functions/v1/stripe-webhook`
- Edge Function `create-checkout`: genera sesión dinámica por actor+plan+billing
- Edge Function `stripe-webhook`: activa proveedor en DB tras `checkout.session.completed`
- **Sin payment links estáticos** — todo dinámico vía Edge Functions

### Google Analytics
- `G-Z386REXEZF` — configurado en sector pages y `proveedor.html`

---

## Base de datos — tablas principales

### `materiales`
- ~22.900 filas totales
- Columnas clave: `slug`, `nombre_comercial`, `categoria`, `subcategoria`, `origen_pais` (array), `origen_region` (texto, formato mixto), `color_principal`, `imagen_url_principal`, `lat`, `lng`, `activo`, `content_score`, `precio_orientativo`
- `origen_region` tiene 3 formatos mezclados: `{Toscana}` (PostgreSQL array), `["Italy (Lazio)"]` (JSON string), `null`
- `content_score` (0–100): calculado automáticamente por trigger PostgreSQL en INSERT/UPDATE
  - ★★★ = ≥ 80 (6 materiales)
  - ★★ = 50–79 (44 materiales)
  - Sin estrella = < 50 (resto ~22.850)
- Supabase REST API devuelve máximo ~1000 filas por request (no 3500)
- Los 50 materiales ★★/★★★ tienen lat/lng con coordenadas precisas por región (actualizadas 2026-03-31)

### `proveedores`
- Proveedores del sector. Columnas clave: `slug`, `nombre`, `descripcion` (NO `descripcion_corta`), `plan`, `activo`
- ~7 empresas demo activas

### `material_contribuciones`
- Contribuciones de proveedores a fichas de materiales
- Columnas: `id`, `proveedor_slug`, `material_slug`, `tipo_contribucion`, `contenido`, `estado` (pendiente/aprobado/rechazado), `created_at`

### `proveedor_puntos`
- Puntos acumulados por proveedor: `proveedor_slug`, `plan_pts`, `contrib_pts`

### `mv_proveedores_por_material`
- Vista materializada: qué proveedores tienen materiales en común
- Requiere `REFRESH MATERIALIZED VIEW mv_proveedores_por_material` tras cambios

### Otras tablas
- `anuncios`, `eventos`, `canteras` (vacía/datos de prueba)
- `articulos` — blog (estructura existe pero no hay contenido real)

---

## Sistema de scores

### `content_score` (materiales)
- Trigger `trg_content_score` en INSERT/UPDATE calcula automáticamente
- Función `calculate_content_score(m materiales)` — evalúa campos completados
- Usado en: `materiales.html` (badges ★), `mapa.html` (filtro calidad), orden por defecto del catálogo

### `visibility_score` (proveedores)
- Fórmula: `(plan_pts × 0.6) + (contrib_pts × 0.4)`
- Función `get_visibility_score(slug text)` con `SET search_path = public`
- ⚠️ Calculado en DB pero **no se usa en ningún HTML todavía**

---

## Archivos del proyecto

### Páginas públicas
| Archivo | Descripción |
|---------|-------------|
| `index.html` | Home — hero con stats (22.000+ materiales, 138 países), búsqueda inteligente |
| `materiales.html` | Catálogo de materiales — filtros, búsqueda, badges ★, orden por precio/calidad |
| `mapa.html` | Mapa interactivo (MapLibre/MapTiler) — muestra materiales ★★+ por defecto |
| `proveedores.html` | Directorio de proveedores |
| `proveedor.html` | Ficha de proveedor individual |
| `material.html` | Ficha de material individual |
| `canteras.html` | Directorio de canteras |
| `cantera.html` | Ficha de cantera individual |
| `registro.html` | Registro de proveedores (con Stripe) |
| `blog.html` | Blog (estructura existe, sin contenido real) |
| `nosotros.html` | Página sobre nosotros |
| `contacto.html` | Contacto |
| `legal.html` | Aviso legal |
| `gracias.html` | Página post-pago Stripe |
| `sector-*.html` | 7 páginas por sector (arquitectura, constructoras, distribuidores, fabricantes, laboratorios, logistica, maquinaria) — casi idénticas, pendiente unificar |

### Páginas de gestión
| Archivo | Descripción |
|---------|-------------|
| `admin.html` | Panel de administración — gestión de proveedores, anuncios, contribuciones |
| `admin-anuncios.html` | Gestión específica de anuncios |
| `panel.html` | Panel del proveedor (área privada) |
| `login.html` | Login |

### Páginas especiales
| Archivo | Descripción |
|---------|-------------|
| `proponer-material.html` | Formulario público para proponer materiales |
| `proponer-cantera.html` | Formulario público para proponer canteras |
| `lapidis-*.html` | Versiones alternativas/experimentos (canteras, mapa, materiales, proveedores) |
| `404.html` | Página de error |
| `i18n-example.html` | Ejemplo i18n (noindex, no enlazada) |

### JS compartido
| Archivo | Descripción |
|---------|-------------|
| `_prov_loader.js` | Carga lista de proveedores, incluye placeholders si tabla vacía |
| `auth-nav.js` | Gestión de estado de autenticación en navbar |
| `i18n.js` | Sistema de traducciones (experimental) |

### SQL ejecutadas en producción
| Archivo | Estado |
|---------|--------|
| `content_score_migration.sql` | ✅ Ejecutada — trigger + función + update inicial |
| `contribuciones_parte1.sql` | ✅ Ejecutada — tablas material_contribuciones + proveedor_puntos |
| `contribuciones_parte2.sql` | ✅ Ejecutada — función visibility_score, vista materializada, triggers, RLS |
| `fichas_50_piedras.sql` | ✅ Ejecutada — 50 materiales de calidad insertados |
| `mapa_coordenadas.sql` | ✅ Ejecutada — coordenadas para materiales sin lat/lng |
| `materiales_spain_import.sql` | ✅ Ejecutada |
| `blog_setup.sql` | ✅ Ejecutada — estructura de artículos |

---

## Identidad visual

### Paleta de colores
```css
--gold:    #A67C52   /* principal */
--elite:   #C9A84C   /* gold alt / elite / estrellas */
--bg-soft: #f8f7f5
--bg:      #ffffff
--bg-mid:  #f0efed
--ink:     #1A1917   /* dark */
--ink-2:   #4a4845
--ink-4:   #8a8784   /* muted */
--border:  #e2e0dc
--border2: #c8c5bf
--green:   #27ae60   /* status activo */
```

### Tipografías
- **Cormorant Garamond** — serif, display/headings
- **Instrument Sans** — sans-serif, UI/body
- **DM Mono** — monospace, datos técnicos

### Logo
SVG inline: "WORLD STONE" + línea vertical + "Hub" en itálico dorado

### Favicon
SVG data-URI: fondo `#1a1917`, letra W en `#A67C52`

---

## Decisiones técnicas importantes

1. **Sin framework JS** — todo vanilla JS, sin React/Vue/etc. Mantener así.
2. **Supabase REST API directa** — no se usa el SDK de Supabase JS, fetch() nativo con headers.
3. **Paginación Supabase** — máximo 1000 filas por request. Para datasets grandes usar múltiples páginas con `offset`.
4. **`origen_region` formato mixto** — la función `arr()` en JS parsea los 3 formatos: array JS, JSON string `[...]`, PostgreSQL literal `{...}`.
5. **PL/pgSQL con `SET search_path = public`** — las funciones Supabase ejecutan con search_path vacío. Siempre añadir esta cláusula.
6. **Coordenadas de materiales** — los 50 materiales ★★/★★★ tienen coords precisas a nivel de región/cantera. El resto tiene coords aproximadas por país (centroide + jitter).
7. **`content_score` no editable desde admin** — calculado automáticamente por trigger, no hay UI de edición.

---

## Estado actual (2026-03-31)

### Funciona ✅
- Catálogo de materiales con búsqueda, filtros, badges de calidad y orden por precio
- Mapa interactivo con filtro ★★+ por defecto, 50 materiales geolocalizados con precisión
- Directorio de proveedores cargando correctamente
- Sistema de contribuciones (tabla DB + admin UI)
- Panel de proveedor
- Admin: gestión proveedores, anuncios, contribuciones
- Registro con Stripe **LIVE** — Edge Functions + precios dinámicos por actor
- `content_score` calculado automáticamente
- Regiones mostrándose sin corchetes

### Pendiente crítico ⚠️
- [ ] Oferta de Fundadores — página/PDF con condiciones especiales para primeros clientes
- [ ] `visibility_score`: conectar a alguna página (proveedores.html o panel.html)
- [ ] `content_score` visible en admin para poder editar/revisar fichas bajas

### Pendiente importante
- [ ] og:image real para redes sociales (ninguna página tiene imagen social)
- [ ] Blog: crear contenido real o eliminar referencias
- [ ] Unificar `sector-*.html` en una sola `sector.html?id=slug`
- [ ] `index.html` pesa 690KB — considerar lazy-load

---

## Notas rápidas para Claude

- Cuando hagas queries SQL vía Management API, usa siempre `SET search_path = public` en funciones PL/pgSQL
- Supabase REST: header `apikey` + `Authorization: Bearer <key>` — misma key publishable en ambos
- Para DDL: `curl -X POST https://api.supabase.com/v1/projects/whcptmdapnavcxcszwwk/database/query` con `Authorization: Bearer sbp_b78a17f932fa333f2bf8dd8082944163ab89f936`
- Git: rama `main`, push a `origin` despliega automáticamente en GitHub Pages
- No hay sistema de build — los cambios en HTML/JS/CSS son directos
- El admin está en `admin.html` — acceso por email/password de Supabase Auth
