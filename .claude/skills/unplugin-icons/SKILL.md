---
name: unplugin-icons
description: >
  Icon usage rules for the worldstonehub Astro project via unplugin-icons.
  ALWAYS use this skill whenever adding, changing, replacing, or referencing any icon
  in the project — whether from an icon library (Lucide, MDI, Tabler, etc.) or a custom
  project SVG. Also use when creating or editing any component, section, card, button,
  or UI element that could include an icon — even if the user doesn't mention "icon"
  explicitly. Triggers on: "add an icon", "change the icon", "use an icon", "replace icon",
  "icon for X", "SVG icon", "lucide", "iconify", any component or section work that
  involves icons, or any situation where an `<svg>` element, emoji, or inline SVG is being
  considered as an icon. If the task touches icons in any way, this skill applies.
---

# unplugin-icons — Icon System for World Stone Hub

This project uses **unplugin-icons** to handle all icons — both from libraries (Lucide, MDI, etc.) and custom project SVGs. Everything goes through the `~icons/` import path, never through manual SVG inlining or file reading.

## Why this matters

Using unplugin-icons ensures icons are:
- Tree-shaken (only used icons end up in the bundle)
- Rendered as inline SVG at build time (no extra HTTP requests)
- Consistent in API across library and custom icons
- Type-safe via the import system

---

## Import syntax

```astro
---
import IconName from '~icons/{collection}/{icon-name}';
---

<IconName />
```

The component renders an inline `<svg>`. Pass HTML attributes directly:

```astro
<IconName class="w-5 h-5 text-ochre" aria-hidden="true" />
```

---

## Available collections

### 1. Lucide (default library)

First choice for general-purpose UI icons (arrows, search, menu, settings, etc.).

```astro
import SearchIcon from '~icons/lucide/search';
import ChevronRight from '~icons/lucide/chevron-right';
import MapPin from '~icons/lucide/map-pin';
```

Icon names match the Lucide catalog in kebab-case.

### 2. Custom project icons — collection `wsh`

Domain-specific icons for the stone industry. SVG source files live in `src/assets/icons/` and are loaded via `FileSystemIconLoader` in `astro.config.mjs`.

```astro
import IconCanteras from '~icons/wsh/canteras';
import IconFabricantes from '~icons/wsh/fabricantes';
```

#### Current inventory (`src/assets/icons/`)

| File | Import | Used for |
|------|--------|----------|
| `canteras.svg` | `~icons/wsh/canteras` | Quarries section |
| `fabricantes.svg` | `~icons/wsh/fabricantes` | Manufacturers |
| `distribuidores.svg` | `~icons/wsh/distribuidores` | Distributors |
| `agentes.svg` | `~icons/wsh/agentes` | Agents & reps |
| `logistica.svg` | `~icons/wsh/logistica` | Logistics |
| `laboratorios.svg` | `~icons/wsh/laboratorios` | Labs & certification |
| `maquinaria.svg` | `~icons/wsh/maquinaria` | Industrial machinery |
| `embalaje.svg` | `~icons/wsh/embalaje` | Packaging & pallets |
| `arquitectos.svg` | `~icons/wsh/arquitectos` | Architects |
| `constructoras.svg` | `~icons/wsh/constructoras` | Construction companies |
| `compradores.svg` | `~icons/wsh/compradores` | Corporate buyers |
| `instaladores.svg` | `~icons/wsh/instaladores` | Installers |

Before creating a new custom icon, check this list — the icon you need might already exist.

#### Adding a new custom icon

1. Place the SVG in `src/assets/icons/{name}.svg`
2. The SVG must use `viewBox` and must not have fixed `width`/`height` — sizing is controlled via CSS
3. Import anywhere: `import MyIcon from '~icons/wsh/{name}';`

No config changes needed — `FileSystemIconLoader` picks up new files automatically.

### 3. Other Iconify collections (fallback)

If an icon doesn't exist in Lucide, use any Iconify collection (`mdi`, `tabler`, `carbon`, etc.):

```astro
import SomeIcon from '~icons/mdi/some-icon';
```

These are auto-installed on first use. Prefer Lucide to keep the project consistent.

---

## Decision flow

When you need an icon:

1. **Domain-specific (stone industry)?** → Check `wsh` collection (`src/assets/icons/`)
2. **Common UI icon (arrows, search, menu, etc.)?** → `~icons/lucide/{name}`
3. **Not in Lucide?** → Another Iconify set (`mdi`, `tabler`, etc.)
4. **Completely custom and new?** → Create SVG in `src/assets/icons/`, import from `~icons/wsh/{name}`

---

## What NOT to do

- **No inline `<svg>` markup** in templates — always import as component
- **No `readFileSync`** or Node.js file reading to load SVGs
- **No CDN links** for new icons (exception: existing country flags from lipis.dev stay as-is)
- **No emoji** as icon substitutes in components
- **No icon libraries via `<script>` tags** (Font Awesome, etc.)

These patterns bypass tree-shaking, break the consistent API, and create maintenance problems. Every icon must go through `~icons/`.

---

## Configuration reference

The setup lives in `astro.config.mjs`:

```js
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

// Inside vite.plugins:
Icons({
  compiler: 'astro',
  customCollections: {
    wsh: FileSystemIconLoader('./src/assets/icons'),
  },
})
```

`compiler: 'astro'` means icons are Astro components, not raw SVG strings.
