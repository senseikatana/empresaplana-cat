# Design System — Mediterranean Horizon

Brand tokens defined in `app/globals.css` via CSS custom properties and Tailwind v4 `@theme`.

## Brand Colors

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| `deep-navy` | `--brand-primary` | `#013990` | Primary brand, header, active nav |
| `coastal-teal` | `--brand-secondary` | `#13AEB8` | Secondary accents, focus rings, icons |
| `energetic-orange` | `--brand-tertiary` | `#EB8E02` | CTAs only — buttons, search, highlights |
| `surface-gray` | — | `#F1F3F5` | Subtle backgrounds |
| `text-main` | — | `#1A1C1E` | Body text |

## Palettes

### Navy (`navy-50` to `navy-950`)

| Step | Hex |
|------|-----|
| 50 | `#EEF4FF` |
| 100 | `#D9E6FF` |
| 200 | `#BCD2FF` |
| 300 | `#8FB4FF` |
| 400 | `#5B8BFB` |
| 500 | `#3564E6` |
| 600 | `#1A4BC3` |
| **700** | **`#013990`** |
| 800 | `#002E78` |
| 900 | `#002563` |
| 950 | `#001845` |

### Teal (`teal-50` to `teal-950`)

| Step | Hex |
|------|-----|
| 50 | `#E9FBFB` |
| 100 | `#C9F4F6` |
| 200 | `#99E9EE` |
| 300 | `#5AD7E0` |
| 400 | `#2BC3CE` |
| **500** | **`#13AEB8`** |
| 600 | `#0E8E97` |
| 700 | `#0E6F76` |
| 800 | `#10595E` |
| 900 | `#124A4E` |
| 950 | `#062E31` |

### Orange (`orange-50` to `orange-950`)

| Step | Hex |
|------|-----|
| 50 | `#FFF5E6` |
| 100 | `#FFE6BF` |
| 200 | `#FFD399` |
| 300 | `#FFBB5C` |
| 400 | `#FB9F26` |
| **500** | **`#EB8E02`** |
| 600 | `#D57200` |
| 700 | `#B15A02` |
| 800 | `#8F4708` |
| 900 | `#743A0A` |
| 950 | `#421D02` |

## Surfaces (Material Design 3)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#F8F9FA` | Page background |
| `on-background` | `#191C1D` | Text on background |
| `surface` | `#F8F9FA` | Card/panel base |
| `surface-container-lowest` | `#FFFFFF` | Elevated cards |
| `surface-container-low` | `#F3F4F5` | Subtle containers |
| `surface-container` | `#EDEEEF` | Default container |
| `surface-container-high` | `#E7E8E9` | Active/hover state |
| `surface-container-highest` | `#E1E3E4` | Pressed state |
| `on-surface` | `#191C1D` | Text on surface |
| `on-surface-variant` | `#434652` | Secondary text |
| `outline` | `#747783` | Borders |
| `outline-variant` | `#C4C6D4` | Subtle borders |

## Typography

Font family: **Geist** (loaded via `next/font/google`).

| Scale | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `display-lg` | 48px | 56px | 700 | -0.02em |
| `headline-lg` | 32px | 40px | 700 | — |
| `headline-md` | 24px | 32px | 600 | — |
| `body-lg` | 18px | 28px | 400 | — |
| `body-md` | 16px | 24px | 400 | — |
| `label-md` | 14px | 20px | 600 | 0.05em |
| `button` | 16px | 16px | 600 | 0.02em |

## Iconography

**Material Symbols Outlined** (Google Fonts, variable font).

- Default: `FILL 0, wght 400, GRAD 0, opsz 24`
- Filled state: add class `.icon-filled` or `.icon-fill` (sets `FILL 1`)

```html
<span class="material-symbols-outlined">directions_bus</span>
<span class="material-symbols-outlined icon-filled">favorite</span>
```

## Spacing

| Token | Value |
|-------|-------|
| `container-max` | 1280px |
| `gutter` | 24px |
| `margin-mobile` | 16px |
| `margin-desktop` | 48px |
| `stack-sm` | 8px |
| `stack-md` | 16px |
| `stack-lg` | 32px |

## Elevation

| Class | Effect |
|-------|--------|
| `.ambient-shadow` | `0px 4px 20px rgba(1,57,144,0.08)` |
| (variable `--shadow-ambient-lg`) | `0px 8px 30px rgba(1,57,144,0.12)` |

## Utility Classes

| Class | Effect |
|-------|--------|
| `.glass-panel` | Frosted glass: `rgba(255,255,255,0.9)` + `blur(12px)` + subtle border |
| `.bg-pattern` | Dot grid background (20px spacing) |

## Rules

- **Naranja** (`energetic-orange`): solo para CTAs, botones de búsqueda, alertas activas. No para texto ni decoración.
- **Teal**: focus rings de inputs, iconos secundarios, badges de estado.
- **Navy**: header, nav activo, headings principales.
- **Fondo**: siempre `#F8F9FA` (nunca blanco puro para el body).
- **Cards**: `surface-container-lowest` (#FFFFFF) con `.ambient-shadow`.
