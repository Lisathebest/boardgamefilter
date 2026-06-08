# LudoMind — Agent Onboarding

> **Audience:** AI coding agents and contributors working on this repo.  
> **Product:** Evidence-based board game finder for **K–12 educators** (not a BGG hobby catalog).  
> **Repo:** [github.com/Lisathebest/boardgamefilter](https://github.com/Lisathebest/boardgamefilter)

---

## Before You Edit Anything

1. Read **`.cursor/rules/eduplay-requirements.mdc`** — non-negotiable product rules (`alwaysApply: true`).
2. Read **`.cursor/rules/design.md`** — visual system (OKLCH palette, typography, components).
3. **Never** commit `BGG_API_TOKEN` or add BGG scores/ratings/weight to the UI.
4. **Never** delete or trim content in `gamesData.js` unless the user explicitly asks (`@` mention).
5. When adding fields to `gamesData.js`, wire them through **filter UI + card display** in `gameSelector.js` if they are user-facing.

---

## Architecture (Vanilla JS, No Build)

```
index.html
├── #global-nav          (#global-nav-tabs filled by nav.js)
├── #view-selector       (Game Selector — hero, filters, grid)
├── #view-inspiration    (filled by inspiration.js)
├── #view-resources      (filled by resources.js)
└── #global-footer       (filled by footer.js)

Articles-pages/          (standalone article HTML — links back via query params)

Script load order (classic scripts, NOT ES modules — must work via file://):
  gamesData.js → bggApi.js → router.js → inspiration.js → resources.js
  → nav.js → gameSelector.js → footer.js → app.js
```

`app.js` bootstraps: `initRouter(showView)` → `initNav()` → `initGameSelector()` → `initFooter()`.

**Routing** (`router.js`): hash-based SPA routes:

| Route | Hash | Query fallback (from `Articles-pages/`) |
| ----- | ---- | --------------------------------------- |
| Game Selector | `#/` | `index.html?view=selector` |
| Inspiration | `#/inspiration` | `index.html?view=inspiration` |
| Resources | `#/resources` | `index.html?view=resources` |
| Resources section | `#/resources/{section}` | `index.html?view=resources&section={section}` |

Resource section IDs: `websites` | `youtubers` | `online-games` | `articles`

No React, no Vite.

**Styling split:**

| Area | Styles |
| ---- | ------ |
| Game Selector, cards, filters, Resources | `index.css` (OKLCH CSS variables) |
| Navbar, Inspiration, Footer | Tailwind CDN (see `index.html` `<script>tailwind.config`) |
| Standalone articles | `Articles-pages/article.css` |

**Fonts:** DM Sans (display), Plus Jakarta Sans (body).

---

## File Responsibilities


| File | Role |
| ---- | ---- |
| `gamesData.js` | **Single source of truth** — `const GAMES = [...]` |
| `gameSelector.js` | Filters, search, `filterGames()`, card HTML (`renderGameCard`), tag summarization, BGG image preload |
| `inspiration.js` | `renderInspiration(container)` — research page HTML + citation formatting |
| `resources.js` | `RESOURCE_CONTENT` config, Resources page renderers, section filters |
| `nav.js` | `NAV_ITEMS` config, global navbar render, hover page-dropdowns |
| `footer.js` | `FOOTER_COLUMNS` config, `renderFooter()`, back-to-top |
| `bggApi.js` | `fetchBggImageUrl`, `preloadBggImages`, `parseBggThingXml` — needs Bearer token since 2025 |
| `router.js` | `initRouter`, `navigateTo`, `ROUTES`, hash + query param parsing |
| `app.js` | View switching, app init |
| `index.html` | Page shells, ambient background, script tags |
| `index.css` | Design tokens, game cards, filters, Resources layouts, ambient blobs |
| `Articles-pages/` | Standalone republished articles (`article.css` editorial layout; `articles-nav.js` for back-links) |
| `useBggImage.js` | **Unused** — React hook stub; app is vanilla JS |
| `temporaryTexts.txt` | Source copy for articles / Inspiration (reference only) |


---

## Data Schema (`gamesData.js`)

Each game object:

```js
{
  id: "kebab-case-slug",           // required, unique
  name: "Display Name",
  subjects: ["Math", "Logic"],     // academic subjects — drives filter options
  softSkills: ["Logical Thinking"],// behavioral outcomes — drives filter options
  pedagogicalTrait: "Short label", // card subtitle (NOT marketing fluff)
  researchNote: "One paragraph…",  // educator rationale; included in search
  players: "2-8",                  // human-readable string
  duration: "15-20 min",             // human-readable string
  minAge: 8,                       // number → shown as "8+" pill; min-age filter
  targetStages: ["Preschool", …],  // summarized in card footer "Targets:" line only
  bggId: "83195",                  // cover image lookup ONLY — not shown in UI
}
```

**`targetStages` allowed values:**  
`Preschool` | `Lower Elementary` | `Upper Elementary` | `Secondary & Adult`

**Do not add:** `bggScore`, BGG weight, rank, mechanism, theme fields (unless user explicitly approves).

After editing `GAMES`, filter dropdown options for `subjects` and `softSkills` auto-rebuild from data at load time.

---

## Game Selector — Filter & Card Behavior

### Filters (`FILTER_CONFIG` in `gameSelector.js`)


| Key          | Type        | Logic                                                            |
| ------------ | ----------- | ---------------------------------------------------------------- |
| `players`    | multiselect | Range match on `players` string                                  |
| `time`       | multiselect | `short` ≤30m, `medium` 31–60m, `long` 60m+                       |
| `minAge`     | multiselect | `6+`…`14+` — game matches if `game.minAge <= selected threshold` |
| `subjects`   | multiselect | any overlap with `game.subjects`                                 |
| `softSkills` | multiselect | any overlap with `game.softSkills`                               |


**Note:** `targetStages` is **not** a filter — only displayed on cards. `minAge` is the age filter (specific age, not stage).

### Card presentation (`renderGameCard` in `gameSelector.js`)

- **Image:** BGG cover via `bggId`, or subject emoji on pastel tint
- **Title:** `name`
- **Subtitle:** `pedagogicalTrait`
- **Meta row:** `players`, `duration`
- **Tag pills:** `minAge+` (`.tag--age`), up to 2 `subjects`, up to 2 `softSkills`, `+N` overflow badges
- **Footer line:** `Targets: {summary}` from `formatTargetStagesSummary(targetStages)` — keep this; do not remove when adding features
- **No** BGG score / weight badges

Full tag lists are reserved for a future **game detail modal** (not built yet).

---

## Resources Page (`resources.js`)

Single-page view at `#/resources` with four sections. Data lives in `RESOURCE_CONTENT`; nav dropdown items in `nav.js` `NAV_ITEMS` must stay in sync with section IDs.

### Section layouts

| Section | `layout` value | UI |
| ------- | -------------- | -- |
| Websites | `filtered-links` | Vertical list + topic filter pills + tag pills on each item |
| YouTubers | `youtube-channels` | Circular channel avatars (YouTube-style) + name + description |
| Online Board Games | `filtered-cards` | Compact square tiles + topic filter pills (tags hidden on cards; used for filtering) |
| Articles | `article-cards` | Large 3-column cards → standalone pages in `Articles-pages/` |

### Adding content

- **Websites / Online Board Games:** edit `items[]` in `RESOURCE_CONTENT`; include `tags[]` matching filter IDs in `WEBSITE_FILTER_TAGS` or `ONLINE_GAMES_FILTER_TAGS`.
- **YouTubers:** add `avatar` URL for channel photo; falls back to initials in a colored circle.
- **Articles:** set `url` to path under `Articles-pages/`; use `articles-nav.js` + query-param back-links (Safari `file://` cannot open `index.html#/route` from another page).

### Global nav (`nav.js`)

- Direct tabs: Game Selector, Inspiration
- **Resources** page-dropdown — default `openOn: "hover"`; items link to `#/resources/{section}`
- Game Selector filter dropdowns (`filter__*` in `gameSelector.js`) stay **click-only** — do not reuse nav hover pattern

---

## Inspiration Page

- Content in `inspiration.js` (`PEDAGOGY_SECTIONS`, `DIVERSE_LEARNERS`, intro copy)
- **Keep all in-text citations intact** — never strip author/year
- Auto-bold: *Reveal-and-React*, *Inhibitory Control*, *Microworlds*
- Rendered once on first visit to `#/inspiration`

---

## Footer (`footer.js`)

- Dark `bg-slate-900`, gradient top stripe, 2 link columns (About / Contribute)
- Links with empty `href` render as inactive `<span>` — configure in `FOOTER_COLUMNS`
- Comments at top of file document intended URLs and owner notes (contact email, WeChat, form hints)
- **Planned:** Common Sense–style brand intro column for "What is LudoMind?" (not implemented — remove from About links when added)
- `The Pedagogy of Play` → `#/inspiration`
- Report a Bug: prefer **Google Form** or **mailto** for teachers without GitHub (GitHub Issues requires login)

---

## BGG Images

- API: `https://boardgamegeek.com/xmlapi2/thing?id={bggId}`
- Requires `window.BGG_API_TOKEN` (set in `index.html`, never commit)
- Without token: emoji fallbacks still work

---

## Local Development

```bash
cd /path/to/boardgamefilter
python3 -m http.server 8000   # recommended — http://localhost:8000
open index.html               # file:// also works for in-app hash routing
```

**Prefer `localhost`** for full navigation (especially returning from `Articles-pages/`). Safari blocks cross-page links like `index.html#/resources/articles` under `file://`; article back-links use `?view=resources&section=articles` instead.

**Do not** switch to ES-module-only entry without ensuring `file://` still works, unless user requests a full migration (Vite/React).

---

## Current State vs. Backlog

### Implemented

- Navbar (`nav.js`) + hash routing (Game Selector, Inspiration, Resources)
- Resources page: Websites (filtered list), YouTubers (circular channel icons), Online Board Games (filtered square tiles), Articles (card grid)
- Standalone republished articles under `Articles-pages/` with editorial layout
- Full filter/search/card pipeline for sample games
- Smart tag truncation + Targets summary line
- Inspiration research page
- Global footer + back to top

### Not implemented (safe to build if user asks)

- Game detail modal/page (`data-game-id` on cards is ready)
- Footer brand intro column (Common Sense layout)
- Footer link URLs (FAQ, Contact, forms, bug report)
- Contact / suggestion forms
- `targetStages` multiselect filter (user chose `minAge` filter instead)
- GitHub Pages / hosting
- Larger game library

### Dead / ignore unless migrating

- `useBggImage.js` (React hook)

---

## Agent Checklist (Pre-PR / Pre-Commit)

- Navbar renders on load (`nav.js` → `#global-nav-tabs`)
- No BGG scores in UI
- New game fields wired to filters/cards if user-facing
- `targetStages` bottom line still present on cards
- Inspiration citations untouched
- `gamesData.js` content not deleted without user request
- Resources section IDs match `router.js` `RESOURCE_SECTION_IDS` and `nav.js` dropdown items
- New Resources sections use correct `layout` value; filter tag IDs match item `tags[]`
- Article back-links use query params, not `index.html#/…` from `Articles-pages/`
- No secrets in git
- Minimal diff — match existing vanilla JS patterns

---

## Tech Stack Summary

Vanilla HTML / CSS / JavaScript. Tailwind CDN for Inspiration and footer; Resources + Game Selector primarily in `index.css`. No npm, no bundler, no framework.