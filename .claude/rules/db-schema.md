---
name: Database Schema
description: Estructura de tablas, columnas, triggers y vistas en Supabase PostgreSQL
type: reference
---

# Database Schema

## Core Tables

### `materiales`
- ~22.900 filas
- **Columnas clave:** `slug`, `nombre_comercial`, `categoria`, `subcategoria`, `origen_pais` (array), `origen_region` (texto, 3 formatos), `color_principal`, `imagen_url_principal`, `lat`, `lng`, `activo`, `content_score`, `precio_orientativo`
- **`origen_region` formatos:** `{Toscana}` (array), `["Italy (Lazio)"]` (JSON), `null`
- **`content_score` (0–100):** trigger automático en INSERT/UPDATE
  - ★★★ = ≥ 80 (6 materiales)
  - ★★ = 50–79 (44 materiales)
  - Sin estrella = < 50 (resto)
- **Coords:** 50 materiales con lat/lng precisos (región/cantera); resto aproximados (país + jitter)
- **REST API limit:** máximo ~1000 filas/request

### `proveedores`
- Columnas: `slug`, `nombre`, `descripcion` (NOT `descripcion_corta`), `plan`, `activo`
- ~7 empresas demo activas

### `material_contribuciones`
- Columnas: `id`, `proveedor_slug`, `material_slug`, `tipo_contribucion`, `contenido`, `estado` (pendiente/aprobado/rechazado), `created_at`

### `proveedor_puntos`
- Columnas: `proveedor_slug`, `plan_pts`, `contrib_pts`

### Otros
- `anuncios`, `eventos`, `canteras` (demo), `articulos` (blog, vacío)

## Views & Functions

### `mv_proveedores_por_material` (Materialized View)
- Qué proveedores comparten materiales
- Requiere `REFRESH MATERIALIZED VIEW` tras cambios

### `calculate_content_score(m materiales)` (PL/pgSQL)
- Calcula automáticamente score de completitud
- Trigger: `trg_content_score` en INSERT/UPDATE

### `get_visibility_score(slug text)` (PL/pgSQL)
- Fórmula: `(plan_pts × 0.6) + (contrib_pts × 0.4)`
- ⚠️ Calculado pero no usado en HTML aún

## SQL Migrations Executed

- `content_score_migration.sql` ✅
- `contribuciones_parte1.sql` ✅
- `contribuciones_parte2.sql` ✅
- `fichas_50_piedras.sql` ✅
- `mapa_coordenadas.sql` ✅
- `materiales_spain_import.sql` ✅
- `blog_setup.sql` ✅
