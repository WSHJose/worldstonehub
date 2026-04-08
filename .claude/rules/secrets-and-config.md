---
name: Secrets & Configuration
description: Dónde obtener credenciales, variables de entorno, y detalles de configuración
type: reference
---

# Secrets & Configuration

⚠️ **Nunca commitear credenciales en CLAUDE.md o en archivos versionados.**

## Supabase Configuration

**Project ID:** `whcptmdapnavcxcszwwk`  
**URL:** `https://whcptmdapnavcxcszwwk.supabase.co`

### Keys

- **Publishable Key** (anónimo, safe para cliente) — obtener de Supabase Dashboard > Settings > API
- **Personal Access Token** (DDL/Management API) — obtener de Account > Personal Access Tokens
- **Management API:** `POST https://api.supabase.com/v1/projects/whcptmdapnavcxcszwwk/database/query`

Usar headers:
```js
{
  'apikey': PUBLISHABLE_KEY,
  'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
  'Content-Type': 'application/json'
}
```

Para DDL (Management API), usar PAT token en `Authorization: Bearer` header.

## Stripe Configuration

**Status:** LIVE MODE (activo desde 2026-04-01)

### Products

- `Presencia` — basic listing
- `Profesional` — enhanced features
- `Elite` — premium features

40 precios creados (20 anual + 20 mensual), lookup_key por `actor+importe+periodo`.

### Edge Functions

- `create-checkout` → genera sesión dinámica
- `stripe-webhook` → activa proveedor post-checkout

**Webhook:** obtener de Stripe Dashboard > Webhooks

## Google Analytics

**Property ID:** `G-Z386REXEZF`

Configurado en:
- Sector pages
- `proveedor.html`

Tracking ID debe estar en `<script>` tag.

## Environment Setup

Para desarrolladores:

1. Copiar `.env.example` (template, no en repo)
2. Llenar con credenciales del Supabase project
3. **Nunca commitear `.env`**

Credenciales correctas (2026-03-25+):
- Supabase Publishable Key — para cliente-side API calls
- Stripe Public Key — para formularios checkout
- GA4 Property ID — para tracking scripts

## Access Control

- **Admin panel** (`admin.html`): acceso por Supabase Auth (email/password)
- **RLS enabled** en tablas sensibles (contribuciones, puntos, etc.)
- **Proveedor panel** (`panel.html`): solo acceso owner (session token)
