# EduPlay Selector

An evidence-based board game finder for **K–12 educators**. Filter games by pedagogical subjects, soft skills, players, and duration — then read the research-backed **Inspiration** page to understand why play works in the classroom.

---

## Current Progress

### Done

- **Global navigation** — Sticky top bar with **EduPlay Selector** branding and two tabs: **Game Selector** and **Inspiration**
- **Hash routing** — `#/` (selector) and `#/inspiration` (research view), works with browser back/forward
- **Game Selector view**
  - Search by name, pedagogical trait, research note, subjects, or soft skills
  - Filters: players, time, subjects, soft skills
  - Card grid showing pedagogical trait, players, duration, subject/skill tags
  - Live BGG cover images via `bggId` (emoji fallback when unavailable)
  - **No BGG scores or ratings** in the UI
- **Inspiration view** — Structured research content on play-based pedagogy, with intact citations and bold key terms (*Reveal-and-React*, *Inhibitory Control*, *Microworlds*)
- **Data layer** — `gamesData.js` with 5 sample games using normalized fields: `subjects`, `softSkills`, `pedagogicalTrait`, `researchNote`
- **Design system** — Warm OKLCH palette, ambient blur background, DM Sans + Plus Jakarta Sans (see `.cursor/rules/design.md`)
- **Direct open support** — Runs by double-clicking `index.html` (classic scripts, no build step)

### In Progress / Not Yet Built

- Expanding the game library beyond the initial 5 entries
- BGG cover images require an API token (see below) — without it, cards show emoji fallbacks
- Game detail / expanded research view on card click
- README deployment / hosting instructions

---

## Quick Start

**Option A — double-click**

Open `index.html` in your browser.

**Option B — local server**

```bash
cd boardgamefilter
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

### BGG cover images (optional)

BoardGameGeek requires a Bearer token for their XML API. To enable live box art:

1. Register at [boardgamegeek.com/applications](https://boardgamegeek.com/applications)
2. Uncomment and set the token in `index.html`:

```html
<script>window.BGG_API_TOKEN = "your-token-here";</script>
```

**Do not commit your token.**

---

## Project Structure

```
index.html          Entry point + static navbar
index.css           Game Selector styles (OKLCH design tokens)
gamesData.js        Game catalog (pedagogical metadata)
gameSelector.js     Search, filters, card rendering
inspiration.js      Inspiration page content + layout
bggApi.js           BGG XML API2 image fetching
router.js           Hash-based view switching
app.js              Navbar wiring + app bootstrap
.cursor/rules/      Design system + strict product requirements
```

---

## Adding a Game

Edit `gamesData.js`. Each entry needs:


| Field              | Example                                     |
| ------------------ | ------------------------------------------- |
| `id`               | `"ghost-blitz"`                             |
| `name`             | `"Ghost Blitz"`                             |
| `subjects`         | `["Logic"]`                                 |
| `softSkills`       | `["Self-Regulation", "Logical Thinking"]`   |
| `pedagogicalTrait` | `"Speed Deduction & Impulsive Suppression"` |
| `researchNote`     | Educator-facing rationale (one paragraph)   |
| `players`          | `"2-8"`                                     |
| `duration`         | `"10-20 min"`                               |
| `bggId`            | `"83195"` (cover image only)                |


See `.cursor/rules/` for non-negotiable product rules.

---

## Tech Stack

Vanilla HTML / CSS / JavaScript — no build step, no framework. Tailwind CDN is used for the Inspiration page and navbar utilities.