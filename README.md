# EduPlay Selector — Agent Onboarding

> **Audience:** AI coding agents and contributors working on this repo.  
> **Product:** Evidence-based board game finder for **K–12 educators** (not a BGG hobby catalog).  
> **Repo:** [github.com/Lisathebest/boardgamefilter](https://github.com/Lisathebest/boardgamefilter)

---

## Before You Edit Anything

1. Read `**.cursor/rules/eduplay-requirements.mdc`** — non-negotiable product rules (`alwaysApply: true`).
2. Read `**.cursor/rules/design.md`** — visual system (OKLCH palette, typography, components).
3. **Never** commit `BGG_API_TOKEN` or add BGG scores/ratings/weight to the UI.
4. **Never** delete or trim content in `gamesData.js` unless the user explicitly asks (`@` mention).
5. When adding fields to `gamesData.js`, wire them through **filter UI + card display** in `gameSelector.js` if they are user-facing.

---

## Architecture (Vanilla JS, No Build)

```
index.html
├── #global-nav          (static HTML — navbar)
├── #view-selector       (Game Selector shell — hero, filters, grid)
├── #view-inspiration    (empty shell — filled by inspiration.js)
└── #global-footer       (empty shell — filled by footer.js)

Script load order (classic scripts, NOT ES modules — must work via file://):
  gamesData.js → bggApi.js → router.js → inspiration.js
  → gameSelector.js → footer.js → app.js
```

`**app.js**` bootstraps: `initRouter(showView)` → `initGameSelector()` → `initFooter()`.

**Routing** (`router.js`): hash-based `#/` (selector) and `#/inspiration`. No React, no Vite.

**Styling split:**


| Area                          | Styles                                                    |
| ----------------------------- | --------------------------------------------------------- |
| Game Selector, cards, filters | `index.css` (OKLCH CSS variables)                         |
| Navbar, Inspiration, Footer   | Tailwind CDN (see `index.html` `<script>tailwind.config`) |


**Fonts:** DM Sans (display), Plus Jakarta Sans (body).

---

## File Responsibilities


| File                 | Role                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `gamesData.js`       | **Single source of truth** — `const GAMES = [...]`                                                   |
| `gameSelector.js`    | Filters, search, `filterGames()`, card HTML (`renderGameCard`), tag summarization, BGG image preload |
| `inspiration.js`     | `renderInspiration(container)` — research page HTML + citation formatting                            |
| `footer.js`          | `FOOTER_COLUMNS` config, `renderFooter()`, back-to-top                                               |
| `bggApi.js`          | `fetchBggImageUrl`, `preloadBggImages`, `parseBggThingXml` — needs Bearer token since 2025           |
| `router.js`          | `initRouter`, `navigateTo`, `ROUTES`                                                                 |
| `app.js`             | View switching, navbar active state, app init                                                        |
| `index.html`         | Page structure, navbar markup, ambient background, script tags                                       |
| `index.css`          | Design tokens, game cards, filters, ambient blobs                                                    |
| `useBggImage.js`     | **Unused** — React hook stub; app is vanilla JS                                                      |
| `temporaryTexts.txt` | Source copy for Inspiration page (reference only)                                                    |
| `Articles-pages/`    | Standalone republished articles — flat editorial layout via `article.css` (hero, flowing prose, no card blocks) |


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

`**targetStages` allowed values:**  
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
- **Planned:** Common Sense–style brand intro column for "What is EduPlay Selector?" (not implemented — remove from About links when added)
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
# Works both ways:
open index.html                    # file:// — classic scripts support this
python3 -m http.server 8000        # http://localhost:8000
```

**Do not** switch to ES-module-only entry without ensuring `file://` still works, unless user requests a full migration (Vite/React).

---

## Current State vs. Backlog

### Implemented

- Navbar + hash routing (3 views: Game Selector, Inspiration, Resources)
- Resources page with curated lists (Websites, YouTubers, Online Board Games) and collapsible hover dropdown
- Dynamic topic filtering on Websites list under Resources
- Standalone republished article system under `Articles-pages/` (e.g. 5 Principles of Playful Learning)
- Full filter/search/card pipeline for 5 sample games
- Smart tag truncation + Targets summary line
- Inspiration research page
- Global footer + back to top

### Not implemented (safe to build if user asks)

- Game detail modal/page (`data-game-id` on cards is ready)
- Footer brand intro column (Common Sense layout)
- Footer link URLs (FAQ, Contact, forms, bug report)
- `targetStages` multiselect filter (user chose `minAge` filter instead)
- GitHub Pages / hosting
- Larger game library

### Dead / ignore unless migrating

- `useBggImage.js` (React hook)

---

## Agent Checklist (Pre-PR / Pre-Commit)

- Navbar visible on load (static HTML in `index.html`, not JS-only)
- No BGG scores in UI
- New game fields wired to filters/cards if user-facing
- `targetStages` bottom line still present on cards
- Inspiration citations untouched
- `gamesData.js` content not deleted without user request
- No secrets in git
- Minimal diff — match existing vanilla JS patterns

---

## Tech Stack Summary

Vanilla HTML / CSS / JavaScript. Tailwind CDN for navbar, Inspiration, footer. No npm, no bundler, no framework.