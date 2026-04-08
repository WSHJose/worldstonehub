---
name: Project Files Map
description: Mapa de archivos del proyecto — páginas Astro, contextos, servicios HTTP, layouts
type: reference
---

# Project Files Map

## Source Structure

```
src/
├── pages/          ← rutas públicas (.astro)
├── layouts/        ← layouts base reutilizables
├── components/     ← componentes Astro COMPARTIDOS entre páginas (Navbar, Footer…)
├── contexts/       ← lógica por dominio (API + tipos + componentes propios)
│   └── {context}/
│       ├── services/http/   ← {context}Http.ts + types
│       └── components/      ← componentes Astro exclusivos del dominio
├── services/       ← servicios compartidos (HTTP config)
├── scripts/        ← scripts TS del lado cliente
└── styles/         ← CSS global
```

## Pages (`src/pages/`)

| File | Purpose |
|------|---------|
| `index.astro` | Home — hero, stats, búsqueda inteligente |
| `materiales.astro` | Catálogo — filtros, búsqueda, badges ★, orden |
| `material.astro` | Ficha individual material |
| `mapa.astro` | Mapa interactivo (MapLibre/MapTiler) |
| `proveedores.astro` | Directorio de proveedores B2B |
| `proveedor.astro` | Ficha individual proveedor |
| `proveedor-levantina.astro` | Ficha especial Levantina |
| `canteras.astro` | Directorio de canteras |
| `cantera.astro` | Ficha individual cantera |
| `sector.astro` | Página de sector (unificada, reemplaza `sector-*.html`) |
| `registro.astro` | Registro proveedor (con Stripe checkout) |
| `blog.astro` | Blog — estructura existe, sin contenido real |
| `nosotros.astro` | About page |
| `contacto.astro` | Contact form |
| `legal.astro` | Términos legales |
| `gracias.astro` | Post-pago Stripe confirmation |
| `fundadores.astro` | Página oferta fundadores |
| `fundadores-oferta.astro` | Detalle oferta fundadores |
| `fundadores-templates.astro` | Templates fundadores |
| `esquema-negocio.astro` | Esquema de negocio (interno) |
| `login.astro` | Login Supabase Auth |
| `panel.astro` | Proveedor dashboard privado |
| `admin.astro` | Panel admin — gestión completa |
| `admin-anuncios.astro` | Subpanel gestión anuncios |
| `proponer-material.astro` | Formulario público proponer materiales |
| `proponer-cantera.astro` | Formulario público proponer canteras |
| `i18n-example.astro` | i18n demo (noindex, experimental) |
| `404.astro` | Error page |

## Layouts (`src/layouts/`)

| File | Purpose |
|------|---------|
| `Base.astro` | Layout HTML base — head, meta, estilos globales |
| `Page.astro` | Layout de página con navbar y footer |

## Components (`src/components/`)

| File | Purpose |
|------|---------|
| `Navbar.astro` | Barra de navegación principal |
| `Footer.astro` | Pie de página |

## Contexts (`src/contexts/`)

Cada contexto sigue la estructura:
```
src/contexts/{context}/services/http/
  {context}Http.ts        ← funciones de acceso a API
  {context}Http.types.ts  ← interfaces TypeScript
```

| Context | Dominio |
|---------|---------|
| `auth` | Autenticación Supabase |
| `blog` | Artículos del blog |
| `canteras` | Directorio de canteras |
| `home` | Datos para la home (stats, etc.) |
| `materials` | Catálogo de materiales |
| `proveedores` | Directorio de proveedores |

## Shared Services (`src/services/`)

| File | Purpose |
|------|---------|
| `services/http/config.ts` | `supabase` client, `restFetch<T>()`, `restFetchCount()` |

## Scripts (`src/scripts/`)

| File | Purpose |
|------|---------|
| `auth-nav.ts` | Estado autenticación en navbar, mostrar/ocultar elementos |

## SQL Migrations (`sqls/`)

- `content_score_migration.sql` — trigger + función + update inicial ✅
- `contribuciones_parte1.sql` — tablas contribuciones + puntos ✅
- `contribuciones_parte2.sql` — visibility_score + vista materializada + RLS ✅
- `fichas_50_piedras.sql` — 50 materiales de calidad ✅
- `mapa_coordenadas.sql` — coords para materiales sin lat/lng ✅
- `materiales_spain_import.sql` — importación España ✅
- `blog_setup.sql` — estructura blog ✅

## Naming Conventions

- **Pages:** kebab-case (`materiales.astro`, `admin-anuncios.astro`)
- **Layouts/Components:** PascalCase (`Base.astro`, `Navbar.astro`)
- **Context services:** camelCase con sufijo `Http` (`materialsHttp.ts`, `materialsHttp.types.ts`)
- **Scripts TS:** kebab-case (`auth-nav.ts`)
- **SQL:** snake_case descriptivo
