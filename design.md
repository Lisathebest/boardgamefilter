---

colors:
  background: "#faf8f5"
  foreground: "#2d2d2d"
  card: "#ffffff"
  card-foreground: "#2d2d2d"
  popover: "#ffffff"
  popover-foreground: "#2d2d2d"
  primary: "#e8835a"
  primary-foreground: "#fff8f0"
  secondary: "#f0ebe3"
  secondary-foreground: "#4a4a4a"
  muted: "#f5f0e8"
  muted-foreground: "#7a7a7a"
  accent: "#7ec4cf"
  accent-foreground: "#1a3c40"
  destructive: "#c45c4a"
  destructive-foreground: "#fff0ec"
  border: "#e8e0d5"
  input: "#f0ebe3"
  ring: "#e8835a"
  peach: "#f0c0a0"
  sky: "#a8d8e6"
  sage: "#b8d4b8"
  butter: "#f5e6a0"
  blush: "#f0c8c8"

typography:
  display:
    fontFamily: "Syne, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    textTransform: "uppercase"
    letterSpacing: "0.05em"

rounded:
  sm: "8px"
  md: "18px"
  lg: "20px"
  xl: "24px"
  2xl: "28px"
  3xl: "32px"
  4xl: "36px"
  full: "9999px"
---

# Design System

## Overview

A warm, relaxed board-game finder for slow afternoons. The palette draws from lazy-day pastels — peach, sky, sage, butter, and blush — blended into a cozy, sunlit atmosphere. Nothing should feel rigid or corporate; edges are soft, motion is gentle, and the overall mood is "take your time."

## Colors

All colors are defined in OKLCH for perceptual uniformity and smooth interpolation.

### Semantic tokens

| Token | OKLCH | Role |
|-------|-------|------|
| **Background** | `oklch(0.97 0.02 85)` | Page background — warm cream |
| **Foreground** | `oklch(0.27 0.04 50)` | Primary text — rich brown-black |
| **Card** | `oklch(0.99 0.012 90)` | Card / popover surfaces — near-white with warmth |
| **Primary** | `oklch(0.72 0.14 35)` | CTAs, active states, hero emphasis — warm peach-coral |
| **Primary-foreground** | `oklch(0.99 0.01 80)` | Text on primary — cream |
| **Secondary** | `oklch(0.92 0.04 80)` | Chips, tags, subtle backgrounds — warm sand |
| **Secondary-foreground** | `oklch(0.3 0.04 50)` | Text on secondary |
| **Muted** | `oklch(0.94 0.025 85)` | Hover states, subtle fills |
| **Muted-foreground** | `oklch(0.5 0.03 60)` | Placeholder, helper text |
| **Accent** | `oklch(0.82 0.11 200)` | Sky-blue accents |
| **Accent-foreground** | `oklch(0.25 0.04 240)` | Text on accent |
| **Border** | `oklch(0.88 0.02 75)` | Dividers, card borders — warm gray |
| **Ring** | `oklch(0.72 0.14 35)` | Focus rings — matches primary |

### Decorative accents (card hero tints)

| Token | OKLCH | Used for |
|-------|-------|----------|
| **Peach** | `oklch(0.84 0.09 50)` | Card image backgrounds — warm apricot |
| **Sky** | `oklch(0.85 0.08 220)` | Card image backgrounds — soft blue |
| **Sage** | `oklch(0.83 0.07 150)` | Card image backgrounds — muted green |
| **Butter** | `oklch(0.92 0.1 95)` | Card image backgrounds — creamy yellow |
| **Blush** | `oklch(0.86 0.07 15)` | Card image backgrounds — dusty rose |

### Ambient background

The page uses a fixed, full-viewport ambient layer behind all content:

- **Base wash**: `bg-gradient-to-br from-peach/30 via-blush/20 to-sky/30`
- **Blur blobs**: 6 oversized (`420–560px`) absolutely-positioned circles with `blur-[140–150px]` in peach, sky, sage, blush, butter, and peach again, positioned across the viewport at various offsets. These create a dreamy, seamless background with no hard edges.

## Typography

- **Display / Headlines**: **Syne** (weights 400, 600, 700, 800). Used for H1–H4 and any large statement text. Tight letter-spacing (`-0.02em`).
- **Body / UI**: **Plus Jakarta Sans** (weights 400, 500, 600, 700). Used for all body text, labels, buttons, and metadata.

### Type scale

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| H1 (hero) | `5xl` → `7xl` (mobile → desktop) | Bold | Line-height `1.05` |
| H2 (section) | `2xl` | Bold | — |
| H3 (card title) | `xl` | Bold | Tight leading |
| Body | `base` / `lg` | Regular | — |
| Meta / tags | `xs` / `11px` | Medium | Caps for labels |
| Tagline | `sm` | Regular | Muted-foreground color |

## Spacing & Shape

- **Border radius (default)**: `1.25rem` (`20px`)
- **Cards**: `rounded-3xl` (`24px`)
- **Buttons / inputs / filters**: `rounded-full` (`9999px`) — pill shape throughout
- **Chips / badges**: `rounded-full`
- **Max content width**: `max-w-6xl` (`72rem`)
- **Page padding**: `px-6`
- **Section gaps**: `pb-8`, `pb-24`, `pt-16`–`pt-24`

## Shadows

- **Card hover**: `shadow-[0_20px_60px_-20px_rgba(120,80,40,0.25)]` — warm, diffuse, lifting the card on hover.
- **Search bar**: `shadow-sm` — minimal lift.

## Components

### Cards (GameCard)

- **Container**: `rounded-3xl`, `border border-border`, `bg-card`, flex column.
- **Image area**: `h-48`, centered, tinted with one of the five accent colors (`bg-peach`, `bg-sky`, `bg-sage`, `bg-butter`, `bg-blush`).
  - If a BGG cover image is available, it fills the area with `object-cover` and a `group-hover:scale-105` zoom.
  - Fallback: a large emoji (`text-7xl`) with `drop-shadow-sm`, also zooms on hover.
- **Weight badge**: absolute top-right, `rounded-full`, `bg-background/80`, `backdrop-blur`, `capitalize`.
- **Content area**: `p-5`, flex column with `gap-3`.
  - Title (`h3`, bold), tagline (`sm`, muted).
  - Meta row: players, time, age — each with a 14×14px Lucide icon.
  - Tags: up to 2 categories (filled `bg-secondary` pills) and up to 2 skills (outlined `border-border` pills).
- **Hover**: `hover:-translate-y-1` lift + warm shadow.

### Filter Dropdowns

- **Label**: `xs`, semibold, uppercase, `tracking-wider`, `text-muted-foreground`.
- **Trigger**: pill button (`rounded-full`), `border`, `bg-card/80`, `backdrop-blur`.
  - Active state: `border-primary/60`, `ring-1 ring-primary/20`, `shadow-sm`.
  - Inactive state: `border-border`, `text-muted-foreground`.
  - Contains a truncated summary label, a clear (×) button when active, and a chevron.
- **Popover**: `w-60`, `rounded-lg`, `p-1.5`, max-height `18rem` with scroll.
  - Options: `rounded-lg` rows, selected state uses `bg-secondary` + a `Check` icon in primary color.

### Search Bar

- **Container**: `rounded-full`, `border border-border`, `bg-card/90`, `px-5 py-3`, `shadow-sm`, `backdrop-blur`.
- **Input**: transparent background, `placeholder:text-muted-foreground`, no outline.
- **Reset button**: small pill inside the bar, `bg-secondary`, appears only when filters are active.

### Hero / Header

- **Pill badge**: `rounded-full`, `border border-border`, `bg-card/70`, `backdrop-blur`, contains a small primary dot + label text.
- **Headline**: Display font, `text-5xl` → `text-7xl`, the word "mood" is italic and colored with `text-primary`.
- **Body copy**: `text-lg`, `text-muted-foreground`, `max-w-xl`.

### Empty State

- **Container**: `rounded-3xl`, `border-dashed border-border`, `bg-card/50`, centered, large emoji + friendly message.

### Footer

- **Style**: `border-t border-border`, `py-8`, centered, `text-xs`, `text-muted-foreground`.

## Icons

Uses **Lucide React** throughout at small sizes (`h-3.5 w-3.5` for meta, `h-4 w-4` for UI controls).

## Motion

- **Card hover**: `transition-all duration-300` — translate Y + shadow + image scale.
- **Image zoom**: `duration-500` scale on group hover.
- **Emoji play**: `group-hover:scale-110 group-hover:rotate-3` — subtle, cheerful.
- **Filter popover**: standard Popover transition.

## Do's and Don'ts

- **Do** keep all interactive surfaces pill-shaped (`rounded-full`) — it's the signature of this UI.
- **Do** use the warm pastel accent colors for card image backgrounds — they unify the grid even when box art is missing.
- **Do** use `backdrop-blur` on floating elements (search bar, badges, dropdowns) to let the ambient background bleed through.
- **Don't** use sharp corners (`rounded-none` or small radii like `4px`) — it breaks the lazy-afternoon mood.
- **Don't** place saturated colors next to each other without the ambient blur layer — the blobs are what soften the transitions.
- **Don't** use generic gray shadows — the card hover shadow carries a warm brown tint (`rgba(120,80,40,0.25)`) to match the palette.
