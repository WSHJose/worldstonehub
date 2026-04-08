---
name: Project Files Map
description: Estructura y propósito de archivos HTML, JS, SQL en el repositorio
type: reference
---

# Project Files Map

## Public Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, stats (22K+ materiales, 138 países), búsqueda inteligente |
| `materiales.html` | Catálogo — filtros, búsqueda, badges ★, orden precio/calidad |
| `mapa.html` | Mapa interactivo (MapLibre/MapTiler) — materiales ★★+ por defecto |
| `proveedores.html` | Directorio de proveedores B2B |
| `proveedor.html` | Ficha individual proveedor |
| `material.html` | Ficha individual material |
| `canteras.html` | Directorio de canteras |
| `cantera.html` | Ficha individual cantera |
| `registro.html` | Registro proveedor (con Stripe checkout) |
| `blog.html` | Blog — estructura existe, sin contenido real |
| `nosotros.html` | About page |
| `contacto.html` | Contact form |
| `legal.html` | Términos legales |
| `gracias.html` | Post-pago Stripe confirmation |
| `sector-*.html` (7) | Sector pages (arquitectura, constructoras, etc.) — idénticas, pendiente unificar |

## Admin & Private Pages

| File | Purpose |
|------|---------|
| `admin.html` | Panel admin — gestión proveedores, anuncios, contribuciones, RLS |
| `admin-anuncios.html` | Subpanel gestión anuncios específicamente |
| `panel.html` | Proveedor dashboard privado |
| `login.html` | Login Supabase Auth |

## Special Pages

| File | Purpose |
|------|---------|
| `proponer-material.html` | Formulario público proponer materiales |
| `proponer-cantera.html` | Formulario público proponer canteras |
| `lapidis-*.html` (4) | Experimentos alternativos (no público) |
| `404.html` | Error page |
| `i18n-example.html` | i18n demo (noindex, experimental) |

## Shared JavaScript

| File | Purpose |
|------|---------|
| `_prov_loader.js` | Carga lista proveedores, placeholders si tabla vacía |
| `auth-nav.js` | Estado autenticación en navbar, mostrar/ocultar elementos |
| `i18n.js` | Sistema traducciones (experimental) |

## SQL Migrations

Ejecutadas en Supabase (ver `.claude/rules/db-schema.md` para detalles):

- `content_score_migration.sql` — trigger + función + update inicial
- `contribuciones_parte1.sql` — tablas contribuciones + puntos
- `contribuciones_parte2.sql` — función visibility_score + vista materializada + RLS
- `fichas_50_piedras.sql` — 50 materiales de calidad
- `mapa_coordenadas.sql` — coords para materiales sin lat/lng
- `materiales_spain_import.sql` — importación España
- `blog_setup.sql` — estructura blog

## Naming Conventions

- **HTML:** lowercase, kebab-case (`proveedor.html`, `admin-anuncios.html`)
- **JS:** lowercase, kebab-case (`_prov_loader.js`, `auth-nav.js`)
- **SQL:** snake_case files, descriptive names
- **Prefixes:** `_` = loader/utility, `admin-*` = admin pages, `lapidis-*` = experiments
