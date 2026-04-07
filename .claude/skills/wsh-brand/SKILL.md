---
name: wsh-brand
description: >
  World Stone Hub visual brand system. ALWAYS use this skill whenever creating, editing, or reviewing any visual component, UI element, CSS, HTML section, card, button, badge, form, or page layout for the worldstonehub project. Triggers on: "create a component", "add a section", "style this", "design a card", "make a button", "new page", "panel", "badge", "tag", "modal", "form", or any request involving visual output in this project. Use it even if the user doesn't explicitly mention branding — if it touches the UI, this skill applies.
---

# WSH Brand System — Reference for Visual Components

> Brand Book v2.0 · Abril 2026 · Source of truth: `public/WSH-BrandBook-v2.html`

Apply every rule below when writing or editing HTML/CSS for worldstonehub. No exceptions. If a visual value isn't in this document, it doesn't exist in the brand.

---

## CSS Tokens (copy into `:root` if not present)

```css
/* WORLD STONE HUB — CSS Design Tokens v2.0 */
:root {
  /* SURFACES */
  --surface-0:      #FFFFFF;   /* Cards, inputs, modals */
  --surface-1:      #F8F7F5;   /* Page background */
  --surface-2:      #F0EFED;   /* Hover, chips, secondary panels */
  --surface-3:      #EDE8DF;   /* Callouts, featured areas */
  --surface-dark:   #1A1917;   /* Dark panels, footer, premium cards */
  --surface-deeper: #0E0D0C;   /* Nested dark elements */

  /* TEXT */
  --text-primary:   #1A1917;   /* Headings, primary text */
  --text-secondary: #4A4845;   /* Body text, descriptions */
  --text-muted:     #8A8784;   /* Labels, metadata, captions */
  --text-faint:     #B8B5B0;   /* Placeholders, disabled */
  --text-on-dark:   #F0EDE8;   /* Primary text on dark surfaces */
  --text-on-dark-2: #C9B99A;   /* Secondary text on dark surfaces */

  /* BORDERS */
  --border:         #E2E0DC;   /* Default borders, dividers */
  --border-strong:  #C8C5BF;   /* Hover borders, active inputs */

  /* ACCENT — Stone Ochre (THE brand color) */
  --ochre:          #A67C52;   /* CTAs, active nav, links, eyebrows, icons */
  --ochre-dark:     #8F6A40;   /* Hover/pressed state of ochre */
  --ochre-tint:     #F5EFEA;   /* Chip/tag backgrounds */

  /* SAND — decorative only, on dark surfaces */
  --sand:           #C9B99A;

  /* ELITE — restricted: ONLY ★★★ stars + Elite plan badge */
  --elite:          #C9A84C;

  /* TYPOGRAPHY */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-mono:    'DM Mono', monospace;
  --font-body:    'Instrument Sans', sans-serif;

  /* SPACING — multiples of 4px, no exceptions */
  --sp-1:  4px;   --sp-2:  8px;
  --sp-3:  12px;  --sp-4:  16px;
  --sp-6:  24px;  --sp-8:  32px;
  --sp-12: 48px;  --sp-16: 64px;
  --sp-24: 96px;
}
```

---

## Typography — Three fonts, one character

Each font has a single, irreplaceable role. Using a font outside its role breaks coherence.

| Role | Font | Weight | Sizes | Use |
|------|------|--------|-------|-----|
| Display XL | Cormorant Garamond | 300 | clamp(52px→96px), line-height 1.0 | Cover headlines, landing hero |
| Display L | Cormorant Garamond | 300 | clamp(34px→52px), line-height 1.05 | Section titles, H2 |
| Display M | Cormorant Garamond | 300 | clamp(22px→32px), line-height 1.1 | Material names, card titles |
| Body L | Instrument Sans | 400 | 16–17px, line-height 1.75 | Long descriptions, intro paragraphs |
| Body M | Instrument Sans | 400 | 14px, line-height 1.65 | Standard text, lists, card descriptions |
| Body S | Instrument Sans | 300 | 12px, line-height 1.6 | Notes, secondary text, footer |
| Label / Eyebrow | DM Mono | 400 | 8–10px, letter-spacing 0.22em, UPPERCASE | Eyebrows, nav labels, metadata, badges |
| Mono Data | DM Mono | 300 | 11–13px, letter-spacing 0.06em | Tech specs, coordinates, prices, data |

**Italic in Cormorant** (`font-style: italic`) is the emphasis mechanism — used for decorative words within display titles, always in `--ochre` or `--sand` on dark backgrounds.

---

## Surface Hierarchy — 5 levels, zero ambiguity

Never skip more than one level within a single section.

| Level | Token | Hex | Use |
|-------|-------|-----|-----|
| 0 | `--surface-0` | `#FFFFFF` | Cards, form fields, modals, table rows |
| 1 | `--surface-1` | `#F8F7F5` | Main page background — the site's default color |
| 2 | `--surface-2` | `#F0EFED` | Hover states, chip backgrounds, secondary panels |
| 3 | `--surface-3` | `#EDE8DF` | Callout boxes, blockquotes, featured content, brand docs |
| Dark | `--surface-dark` | `#1A1917` | Hero panels, footer, founder/premium cards — use with intention |

---

## Components — Permitted variants

### Buttons

```css
/* Primary — dark background, hover to ochre */
.btn-primary {
  background: var(--text-primary); /* #1A1917 */
  color: #F8F7F5;
  padding: 12px 24px;
  font-family: var(--font-body);
  font-size: 9px; font-weight: 600;
  letter-spacing: 2.5px; text-transform: uppercase;
  border: none; transition: all 0.25s;
}
.btn-primary:hover { background: var(--ochre); }

/* Ochre — brand action */
.btn-ochre {
  background: var(--ochre);
  color: #F8F7F5;
  border: 1px solid var(--ochre);
}
.btn-ochre:hover { background: var(--ochre-dark); }

/* Outline — secondary action */
.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-strong);
}
.btn-outline:hover { border-color: var(--ochre); color: var(--ochre); }

/* Ghost dark — on dark backgrounds only */
.btn-ghost-dark {
  background: transparent;
  color: var(--text-on-dark);
  border: 1px solid rgba(201,185,154,0.3);
}

/* Small variant: padding 8px 16px, font-size 8px */
```

**Rule:** Only 3 button variants (primary, ochre, outline) + ghost-dark for dark panels. No 4th variant without documenting it in the Brand Book.

**Transitions:** Always `200–250ms ease-out`. Predictable, smooth, no bounce.

### Tags / Badges

```css
.tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: var(--font-mono);
  font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase;
  padding: 4px 10px;
}
.tag-ochre   { background: var(--ochre-tint); border: 1px solid rgba(166,124,82,0.22); color: var(--ochre); }
.tag-neutral { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-muted); }
.tag-sand    { background: rgba(201,185,154,0.15); border: 1px solid rgba(201,185,154,0.35); color: #9C8571; }
.tag-elite   { background: var(--elite); color: var(--text-primary); font-weight: 500; } /* ONLY for Elite plan */
.tag-dark    { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); color: rgba(240,237,232,0.7); }
```

### Quality Stars (content_score)

| Score | Display | Color |
|-------|---------|-------|
| ≥ 80 | ★★★ | `--elite` (#C9A84C) |
| 50–79 | ★★ | `--ochre` (#A67C52) |
| < 50 | — (no badge) | — |

### Material Cards

Structure: image area (–24px bleed) → tag → title (Display M) → meta (Label mono) → description (Body S) → footer (link + tag).

```css
.card {
  background: var(--surface-0);
  border: 1px solid var(--border);
  padding: 24px;
  position: relative; overflow: hidden;
}
.card::after { /* bottom ochre accent on hover */
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0; height: 2px;
  background: var(--ochre);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.25s;
}
.card:hover::after { transform: scaleX(1); }
```

### Section Labels (eyebrows)

```css
.section-label {
  font-family: var(--font-mono);
  font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
  color: #9C8571;
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 40px;
}
.section-label::after {
  content: ''; flex: 1; max-width: 40px;
  height: 1px; background: var(--sand); opacity: 0.5;
}
```

### Logo Wordmark

```html
<!-- Light background -->
<div style="display:flex;align-items:center;gap:18px;">
  <span style="font-family:var(--font-display);font-size:18px;font-weight:300;letter-spacing:6px;color:var(--text-primary);">WORLD STONE</span>
  <div style="width:1px;height:42px;background:var(--ochre);opacity:0.65;"></div>
  <span style="font-family:var(--font-display);font-size:38px;font-weight:300;font-style:italic;color:var(--ochre);">Hub</span>
</div>
```

"Hub" is **always** `--ochre` regardless of background. The separator is always `--ochre` at 0.55–0.65 opacity.

---

## Rules — What protects WSH identity

### DO

- Use only the CSS tokens documented above. If in doubt, use a lighter variant of the same color.
- To differentiate two groups, use **surface level + typographic weight** — never introduce a new color.
- For success/confirmation states: text with `--ochre` + a check icon (✓). No green. No new color.
- Transitions: always `200–250ms ease-out`.
- Cormorant Garamond for all external communication titles. Always.
- Abundant white space. A premium B2B directory needs breathing room, not density.
- Technical data (density, absorption, Mohs, coordinates) always use DM Mono.

### DON'T

- Introduce any color outside the documented palette. No green for "free", no blue for "verified", no red for "error". The system has solutions for everything.
- Use gradients between two different ochre values — creates the illusion of unapproved colors.
- Use Cormorant Garamond below 16px — loses both legibility and elegance. Use Body S instead.
- Use DM Mono in paragraphs longer than 2 lines — it's for technical display, not reading.
- Put white text on `--surface-1` (#F8F7F5) or `--surface-2` (#F0EFED) — insufficient contrast.
- Use `--elite` (#C9A84C) outside the star system and Elite plan badge. Using it elsewhere empties it of meaning.
- Apply the same visual hierarchy to a ★★★ card and an unrated one. Content quality must be visually evident.

---

## Voice & Tone

WSH speaks as a sector expert who respects user intelligence. It informs, not sells.

| Context | Wrong | Right |
|---------|-------|-------|
| Material description | "Hermoso mármol blanco de alta calidad con preciosas vetas" | "Mármol blanco de grano fino. Veteado gris azulado. Dureza Mohs 3.5. Extracción: Macael, Almería, ES." |
| CTA | "¡Regístrate gratis ahora y da a conocer tus productos al mundo!" | "Lista tu empresa. Llega a compradores en 138 países." |
| Empty state | "¡Ups! No hemos encontrado resultados." | "Sin resultados para esta búsqueda. Prueba con: blanco, Italia, granito…" |

**Never:** superlatives ("el mejor", "único en su clase"), exclamation marks in data contexts, jargon without context for mixed audiences.

---

## Quick Checklist Before Shipping a Component

- [ ] All colors use CSS tokens from `:root` — no hardcoded hex values outside the palette
- [ ] Typography uses the correct font for its role (display/data/body)
- [ ] Cormorant not used below 16px
- [ ] DM Mono not used in paragraphs > 2 lines
- [ ] Spacing uses `--sp-*` tokens or multiples of 4px
- [ ] `--elite` used only for ★★★ or Elite plan badge
- [ ] No new colors introduced (no green, blue, red outside palette)
- [ ] Hover transitions: `200–250ms ease-out`
- [ ] Surface hierarchy not skipped more than one level
- [ ] On dark backgrounds: text uses `--text-on-dark` or `--text-on-dark-2`
