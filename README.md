# LudoMind — Agent Onboarding

> **Audience:** AI coding agents and contributors working on this repo.  
> **Product:** Evidence-based board game finder for **K–12 educators** (not a BGG hobby catalog).  
> **Repo:** [github.com/Lisathebest/boardgamefilter](https://github.com/Lisathebest/boardgamefilter)

---

## Updating the Word guide (`assets/Final_Board_Game_Report_V3.docx`)

When you add or edit a game in the Word report, sync **both** the guide viewer and the Game Selector (index page). The `.docx` is **not** read at runtime — you must rebuild static files and update `gamesData.js`.

### Checklist (every Word change)

1. **Research the game** — look up pedagogical info (BGG, publisher, your notes). You need the same facts on the index card as in the report.
2. **Update `gamesData.js`** — add a new `GAMES` entry or edit the existing one (`name`, `subjects`, `softSkills`, `pedagogicalTrait`, `researchNote`, `players`, `duration`, `minAge`, `targetStages`, optional `bggId` / `link`).
  - The `name` should match the **Heading 1** title in Word (e.g. if the doc section is **Daybreak**, use `"name": "Daybreak"`).
  - If the card title and Word heading differ, set `"detailGuideTitle": "Exact Word Heading"`.
3. **Rebuild the guide + anchors** (run both, in order):

```bash
python3 scripts/build-guide-html.py
python3 scripts/add-pdf-anchors.py
```

1. **Covers (optional)** — if you add a box image, put `assets/covers/{game-id}.jpg` and add the id to `gameCovers.js` (or run `scripts/fetch-game-covers.py`).
2. **Test locally** — `python3 -m http.server 8000`, open `http://localhost:8000`, click the card; it should open `doc viewer/guide-viewer.html?search=…` and scroll to that game’s **h2** section.

### Example: adding **Daybreak**


| Step           | Action                                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Word           | New section: **Daybreak** → Description → Community Comments → Visuals                                                                       |
| `gamesData.js` | New object with `"id": "daybreak"`, `"name": "Daybreak"`, subjects/skills/tags filled from your research                                     |
| Scripts        | `build-guide-html.py` then `add-pdf-anchors.py` → entry in `doc viewer/gamePdfAnchors.js` e.g. `"daybreak": { search: "Daybreak", page: N }` |
| Index          | Card shows on Game Selector with cover, filters, and clickable link to the guide                                                             |


**Rename example (Cakes):** Word heading **Cakes** + `"name": "Cakes"` in `gamesData.js` — no `detailGuideTitle` needed when they match.

---

## Before You Edit Anything

1. Read `**.cursor/rules/eduplay-requirements.mdc`** — non-negotiable product rules (`alwaysApply: true`).
2. Read `**.cursor/rules/design.md**` — visual system (OKLCH palette, typography, components).
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
doc viewer/              (Word guide viewer + auto-generated gamePdfAnchors.js)
assets/guide.html        (built from Final_Board_Game_Report_V3.docx — run build-guide-html.py)
assets/guide-media/      (images extracted from the .docx)

Script load order (classic scripts, NOT ES modules — must work via file://):
  gamesData.js → gameCovers.js → doc viewer/gamePdfAnchors.js → bggApi.js → router.js
  → inspiration.js → resources.js → nav.js → gameSelector.js → footer.js → app.js
```

`app.js` bootstraps: `initRouter(showView)` → `initNav()` → `initGameSelector()` → `initFooter()`.

**Routing** (`router.js`): hash-based SPA routes:


| Route             | Hash                    | Query fallback (from `Articles-pages/`)       |
| ----------------- | ----------------------- | --------------------------------------------- |
| Game Selector     | `#/`                    | `index.html?view=selector`                    |
| Inspiration       | `#/inspiration`         | `index.html?view=inspiration`                 |
| Resources         | `#/resources`           | `index.html?view=resources`                   |
| Resources section | `#/resources/{section}` | `index.html?view=resources&section={section}` |


Resource section IDs: `websites` | `youtubers` | `online-games` | `articles`

No React, no Vite.

**Styling split:**


| Area                                     | Styles                                                           |
| ---------------------------------------- | ---------------------------------------------------------------- |
| Game Selector, cards, filters, Resources | `index.css` (OKLCH CSS variables)                                |
| Navbar, Inspiration, Footer              | Tailwind CDN (see `index.html` `<script>tailwind.config`)        |
| Standalone articles                      | `Articles-pages/article.css`                                     |
| Guide viewer                             | `doc viewer/guide-viewer.css` (+ shared tokens from `index.css`) |


**Fonts:** DM Sans (display), Plus Jakarta Sans (body).

---

## File Responsibilities


| File                                              | Role                                                                                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `gamesData.js`                                    | **Single source of truth** — `const GAMES = [...]`                                                                          |
| `gameSelector.js`                                 | Filters, search, `filterGames()`, card HTML (`renderGameCard`), card detail links, tag summarization, BGG image preload     |
| `doc viewer/gamePdfAnchors.js`                    | Auto-generated guide title map (`GAME_PDF_ANCHORS`) — run `scripts/add-pdf-anchors.py` after Word or `gamesData.js` changes |
| `doc viewer/guide-viewer.html`                    | Standalone page — loads `assets/guide.html` and scrolls to the game’s **h2** heading                                        |
| `doc viewer/guide-viewer.js` / `guide-viewer.css` | Viewer logic + layout                                                                                                       |
| `scripts/build-guide-html.py`                     | Builds `assets/guide.html` + `assets/guide-media/` from `Final_Board_Game_Report_V3.docx`                                   |
| `scripts/add-pdf-anchors.py`                      | Matches `gamesData.js` titles to Word section headings; writes `doc viewer/gamePdfAnchors.js`                               |
| `inspiration.js`                                  | `renderInspiration(container)` — research page HTML + citation formatting                                                   |
| `resources.js`                                    | `RESOURCE_CONTENT` config, Resources page renderers, section filters                                                        |
| `nav.js`                                          | `NAV_ITEMS` config, global navbar render, hover page-dropdowns                                                              |
| `footer.js`                                       | `FOOTER_COLUMNS` config, `renderFooter()`, back-to-top                                                                      |
| `bggApi.js`                                       | `fetchBggImageUrl`, `preloadBggImages`, `parseBggThingXml` — needs Bearer token since 2025                                  |
| `router.js`                                       | `initRouter`, `navigateTo`, `ROUTES`, hash + query param parsing                                                            |
| `app.js`                                          | View switching, app init                                                                                                    |
| `index.html`                                      | Page shells, ambient background, script tags                                                                                |
| `index.css`                                       | Design tokens, game cards, filters, Resources layouts, ambient blobs                                                        |
| `Articles-pages/`                                 | Standalone republished articles (`article.css` editorial layout; `articles-nav.js` for back-links)                          |
| `useBggImage.js`                                  | **Unused** — React hook stub; app is vanilla JS                                                                             |
| `temporaryTexts.txt`                              | Source copy for articles / Inspiration (reference only)                                                                     |


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

`**targetStages` allowed values:**  
`Preschool` | `Lower Elementary` | `Upper Elementary` | `Secondary & Adult`

**Optional fields for card links:**


| Field                                 | Purpose                                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `bggId`                               | BGG cover via API; card click fallback → `boardgamegeek.com/boardgame/{bggId}`                                        |
| `link` or `linkTag`                   | Full URL — card opens in a new tab when no PDF section exists (use for articles, Baidu pages, niche games not on BGG) |
| `detailGuideTitle` / `detailPdfTitle` | Rare override — Word heading to match when `name` differs from the report (consumed by `scripts/add-pdf-anchors.py`)  |


**Do not add:** `bggScore`, BGG weight, rank, mechanism, theme fields (unless user explicitly approves).

After editing `GAMES`, filter dropdown options for `subjects` and `softSkills` auto-rebuild from data at load time.

### Adding a new game — card link checklist

When you add a row to `gamesData.js`, decide how the card should open on click (`buildGameCardLink` in `gameSelector.js`):

1. **Word guide (preferred)** — title appears in `assets/Final_Board_Game_Report_V3.docx`
  - Run `python3 scripts/build-guide-html.py` then `python3 scripts/add-pdf-anchors.py`  
  - Card links to `doc viewer/guide-viewer.html?search=…&page=…` (scrolls to that game’s **h2** title)  
  - If the Word heading differs from `name`, add `"detailGuideTitle": "Exact Word Heading"`
2. `**link` or `linkTag`** — any other URL (article, Baidu page, publisher site, etc.)
  - Add `"link": "https://example.com/…"`  
  - Used when there is **no** PDF match and you do not want BGG (or BGG has no entry)
3. `**bggId` only** — commercial game on BoardGameGeek
  - Set `"bggId": "123456"` (non-empty string)  
  - Cover loads from BGG API; card falls back to the BGG game page when not in the PDF
4. **No link** — card is not clickable (plain `<article>`)
  - Missing PDF match, empty `bggId`, and no `link` / `linkTag`

**Priority (first match wins):** Word guide → `link` / `linkTag` → `bggId` → none.

**After Word or `gamesData.js` changes:** see [Updating the Word guide](#updating-the-word-guide-assetsfinal_board_game_report_v3docx) above.

Serve over `localhost` when testing guide links (`python3 -m http.server 8000`).

### Link coverage (current library)

All games in `gamesData.js` should have at least one card link (Word guide, `link`, or `bggId`).

**Custom `link` examples (no Word section):**


| `id`              | Destination             |
| ----------------- | ----------------------- |
| `sense-series`    | Gcores article          |
| `yin-shi-zuo-hua` | Baidu news page         |
| `24-hour-doctor`  | Baidu baijiahao article |


**No Word section, BGG fallback:** e.g. `heureka`, `clumsy-thief-jr`, `duplik`, `terraforming-mars` — swap to `"link": "…"` if BGG is not the right page.

Re-run `build-guide-html.py` and `add-pdf-anchors.py` after updating the Word file so new sections pick up guide links automatically.

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


| Section            | `layout` value     | UI                                                                                   |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------ |
| Websites           | `filtered-links`   | Vertical list + topic filter pills + tag pills on each item                          |
| YouTubers          | `youtube-channels` | Circular channel avatars (YouTube-style) + name + description                        |
| Online Board Games | `filtered-cards`   | Compact square tiles + topic filter pills (tags hidden on cards; used for filtering) |
| Articles           | `article-cards`    | Large 3-column cards → standalone pages in `Articles-pages/`                         |


### Adding content

- **Websites / Online Board Games:** edit `items[]` in `RESOURCE_CONTENT`; include `tags[]` matching filter IDs in `WEBSITE_FILTER_TAGS` or `ONLINE_GAMES_FILTER_TAGS`.
- **YouTubers:** add `avatar` URL for channel photo; falls back to initials in a colored circle.
- **Articles:** set `url` to path under `Articles-pages/`; use `articles-nav.js` + query-param back-links (Safari `file://` cannot open `index.html#/route` from another page).

### Global nav (`nav.js`)

- Direct tabs: Game Selector, Inspiration
- **Resources** page-dropdown — default `openOn: "hover"`; items link to `#/resources/{section}`
- Game Selector filter dropdowns (`filter__`* in `gameSelector.js`) stay **click-only** — do not reuse nav hover pattern

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