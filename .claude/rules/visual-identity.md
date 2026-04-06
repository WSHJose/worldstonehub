---
name: Visual Identity
description: Paleta de colores, tipografías, logo y favicon del brand
type: reference
---

# Visual Identity

## Color Palette

```css
--gold:    #A67C52   /* principal / hero backgrounds */
--elite:   #C9A84C   /* gold alternativo, estrellas ★, premium badges */
--bg-soft: #f8f7f5   /* very light backgrounds */
--bg:      #ffffff   /* white */
--bg-mid:  #f0efed   /* mid-tone backgrounds */
--ink:     #1A1917   /* dark / headings / body text */
--ink-2:   #4a4845   /* secondary text */
--ink-4:   #8a8784   /* muted / hints */
--border:  #e2e0dc   /* light borders */
--border2: #c8c5bf   /* medium borders */
--green:   #27ae60   /* status activo / success */
```

## Typography

- **Cormorant Garamond** — serif, display/headings, premium feel
- **Instrument Sans** — sans-serif, UI/body text, clean
- **DM Mono** — monospace, datos técnicos, precios

## Logo

**SVG inline format:**
- Text: "WORLD STONE" + vertical separator line + "Hub" (italic, gold)
- Location: Navbar, footer, hero sections
- No background constraint

## Favicon

**SVG data-URI:**
- Background: `#1a1917` (dark)
- Letter W: `#A67C52` (gold)
- 32x32 px

## Brand Guidelines

- **Premium aesthetic** — material luxury, natural stone industry positioning
- **Spacing:** generous whitespace, 16px base unit
- **Hierarchy:** gold for premium features (elite plans, starred materials, CTAs)
- **Consistency:** use CSS variables, never hardcode hex values
