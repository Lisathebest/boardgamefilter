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
pdf viewer/              (PDF text-search viewer + auto-generated gamePdfAnchors.js)

Script load order (classic scripts, NOT ES modules — must work via file://):
  gamesData.js → pdf viewer/gamePdfAnchors.js → bggApi.js → router.js
  → inspiration.js → resources.js → nav.js → gameSelector.js → footer.js → app.js
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
| PDF viewer | `pdf viewer/pdf-viewer.css` (+ shared tokens from `index.css`) |

**Fonts:** DM Sans (display), Plus Jakarta Sans (body).

---

## File Responsibilities


| File | Role |
| ---- | ---- |
| `gamesData.js` | **Single source of truth** — `const GAMES = [...]` |
| `gameSelector.js` | Filters, search, `filterGames()`, card HTML (`renderGameCard`), card detail links, tag summarization, BGG image preload |
| `pdf viewer/gamePdfAnchors.js` | Auto-generated PDF title search map (`GAME_PDF_ANCHORS`) — run `scripts/add-pdf-anchors.py` after PDF or `gamesData.js` changes |
| `pdf viewer/pdf-viewer.html` | Standalone page — opens the board game report PDF and scrolls to a title (Cmd+F-style text search via PDF.js) |
| `pdf viewer/pdf-viewer.js` / `pdf-viewer.css` | Viewer logic + layout (loads `../assets/Final_Board_Game_Report_V3.pdf`) |
| `scripts/add-pdf-anchors.py` | Matches `gamesData.js` titles to PDF section headings; writes `pdf viewer/gamePdfAnchors.js` |
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
  bggId: "83195",                  // cover image + card link fallback (see below)
  link: "https://…",               // optional — custom detail URL (alias: linkTag)
}
```

**`targetStages` allowed values:**  
`Preschool` | `Lower Elementary` | `Upper Elementary` | `Secondary & Adult`

**Optional fields for card links:**

| Field | Purpose |
| ----- | ------- |
| `bggId` | BGG cover via API; card click fallback → `boardgamegeek.com/boardgame/{bggId}` |
| `link` or `linkTag` | Full URL — card opens in a new tab when no PDF section exists (use for articles, Baidu pages, niche games not on BGG) |
| `detailPdfTitle` | Rare override — PDF heading to match when `name` differs from the report (consumed by `scripts/add-pdf-anchors.py`) |

**Do not add:** `bggScore`, BGG weight, rank, mechanism, theme fields (unless user explicitly approves).

After editing `GAMES`, filter dropdown options for `subjects` and `softSkills` auto-rebuild from data at load time.

### Adding a new game — card link checklist

When you add a row to `gamesData.js`, decide how the card should open on click (`buildGameCardLink` in `gameSelector.js`):

1. **PDF guide (preferred)** — title appears in `assets/Final_Board_Game_Report_V3.pdf`  
   - Run `python3 scripts/add-pdf-anchors.py` to refresh `pdf viewer/gamePdfAnchors.js`  
   - Card links to `pdf viewer/pdf-viewer.html?search=…&page=…` (text search, like Cmd+F)  
   - If the PDF heading differs from `name`, add `"detailPdfTitle": "Exact PDF Heading"`

2. **`link` or `linkTag`** — any other URL (article, Baidu page, publisher site, etc.)  
   - Add `"link": "https://example.com/…"`  
   - Used when there is **no** PDF match and you do not want BGG (or BGG has no entry)

3. **`bggId` only** — commercial game on BoardGameGeek  
   - Set `"bggId": "123456"` (non-empty string)  
   - Cover loads from BGG API; card falls back to the BGG game page when not in the PDF

4. **No link** — card is not clickable (plain `<article>`)  
   - Missing PDF match, empty `bggId`, and no `link` / `linkTag`

**Priority (first match wins):** PDF guide → `link` / `linkTag` → `bggId` → none.

**After PDF or library changes:**

```bash
python3 scripts/add-pdf-anchors.py
```

Serve over `localhost` when testing PDF navigation (`python3 -m http.server 8000`).

### Link coverage (current library)

All games in `gamesData.js` currently have at least one card link (PDF, `link`, or `bggId`).

**Custom `link` examples (no PDF section):**

| `id` | Destination |
| ---- | ----------- |
| `sense-series` | Gcores article |
| `yin-shi-zuo-hua` | Baidu news page |
| `24-hour-doctor` | Baidu baijiahao article |

**No PDF, BGG fallback:** e.g. `heureka`, `clumsy-thief-jr`, `duplik`, `terraforming-mars` — swap to `"link": "…"` if BGG is not the right page.

Re-run `scripts/add-pdf-anchors.py` after updating the PDF so new report sections pick up PDF links automatically.

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
- **Clickable cards:** `<a target="_blank">` when a detail link exists (PDF guide → `linkTag` → BGG); otherwise non-clickable `<article>`
- **No** BGG score / weight badges

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
- **Brand column:** `FOOTER_BRAND` in `footer.js` — "What is LudoMind?" blurb (left column); not a link list item
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
- Full filter/search/card pipeline for game library
- Smart tag truncation + Targets summary line
- Card detail links: PDF text-search viewer, `linkTag`, BGG fallback
- Inspiration research page
- Global footer + back to top

### Not implemented (safe to build if user asks)
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
- New games: PDF match or `link` / `bggId` for card links; run `add-pdf-anchors.py` if PDF changed
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