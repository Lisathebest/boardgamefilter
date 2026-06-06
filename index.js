import { GAMES } from "./gamesData.js";
import { preloadBggImages } from "./bggApi.js";

const TINTS = ["peach", "sky", "sage", "butter", "blush"];

const SUBJECT_EMOJI = {
  Math: "🔢",
  Logic: "🧩",
  "Language Arts": "📖",
  Vocabulary: "📝",
  "Visual Arts": "🎨",
  "Social Studies": "🌍",
  Economics: "💰",
  "Environmental Science": "🌿",
};

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function buildOptions(values) {
  return values.map((value) => ({ value, label: value }));
}

const FILTER_CONFIG = {
  players: {
    label: "Players",
    placeholder: "Any players",
    options: [
      { value: "1", label: "1 player" },
      { value: "2", label: "2 players" },
      { value: "3", label: "3 players" },
      { value: "4", label: "4 players" },
      { value: "5+", label: "5+ players" },
    ],
  },
  time: {
    label: "Time",
    placeholder: "Any duration",
    options: [
      { value: "short", label: "≤ 30 min" },
      { value: "medium", label: "31–60 min" },
      { value: "long", label: "60+ min" },
    ],
  },
  subjects: {
    label: "Subjects",
    placeholder: "Any subject",
    options: buildOptions(uniqueSorted(GAMES.flatMap((g) => g.subjects))),
  },
  softSkills: {
    label: "Soft skills",
    placeholder: "Any skills",
    options: buildOptions(uniqueSorted(GAMES.flatMap((g) => g.softSkills))),
  },
};

const state = {
  search: "",
  filters: Object.fromEntries(Object.keys(FILTER_CONFIG).map((key) => [key, new Set()])),
};

const bggImages = new Map();

const searchInput = document.getElementById("search-input");
const resetAllBtn = document.getElementById("reset-all");
const filtersContainer = document.getElementById("filters");
const gameGrid = document.getElementById("game-grid");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

let openFilterKey = null;

function parsePlayers(players) {
  const range = players.match(/^(\d+)-(\d+)$/);
  if (range) return { min: Number(range[1]), max: Number(range[2]) };

  const plus = players.match(/^(\d+)\+$/);
  if (plus) return { min: Number(plus[1]), max: 99 };

  const single = players.match(/^(\d+)$/);
  if (single) {
    const n = Number(single[1]);
    return { min: n, max: n };
  }

  return { min: 1, max: 99 };
}

function parseDurationMinutes(duration) {
  const nums = duration.match(/\d+/g);
  if (!nums?.length) return null;
  return Math.max(...nums.map(Number));
}

function getTimeCategory(minutes) {
  if (minutes <= 30) return "short";
  if (minutes <= 60) return "medium";
  return "long";
}

function getGameEmoji(game) {
  for (const subject of game.subjects) {
    if (SUBJECT_EMOJI[subject]) return SUBJECT_EMOJI[subject];
  }
  return "🎲";
}

function matchesPlayers(game, selected) {
  if (selected.size === 0) return true;
  const { min, max } = parsePlayers(game.players);
  return [...selected].some((value) => {
    if (value === "5+") return max >= 5;
    const n = parseInt(value, 10);
    return n >= min && n <= max;
  });
}

function matchesSet(gameValues, selected) {
  if (selected.size === 0) return true;
  return [...selected].some((value) => gameValues.includes(value));
}

function filterGames() {
  const search = state.search.trim().toLowerCase();

  return GAMES.filter((game) => {
    if (search) {
      const haystack = [
        game.name,
        game.pedagogicalTrait,
        game.researchNote,
        ...game.subjects,
        ...game.softSkills,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (!matchesPlayers(game, state.filters.players)) return false;

    const minutes = parseDurationMinutes(game.duration);
    if (state.filters.time.size > 0 && minutes != null) {
      if (!state.filters.time.has(getTimeCategory(minutes))) return false;
    }

    if (!matchesSet(game.subjects, state.filters.subjects)) return false;
    if (!matchesSet(game.softSkills, state.filters.softSkills)) return false;
    return true;
  });
}

function hasActiveFilters() {
  if (state.search.trim()) return true;
  return Object.values(state.filters).some((set) => set.size > 0);
}

function renderCardImage(game) {
  const imageUrl = bggImages.get(String(game.bggId));
  const emoji = getGameEmoji(game);

  if (imageUrl) {
    return `
      <img
        class="game-card__cover"
        src="${imageUrl}"
        alt="${game.name} box cover"
        loading="lazy"
        decoding="async"
      >
      <span class="game-card__emoji game-card__emoji--fallback" aria-hidden="true">${emoji}</span>
    `;
  }
  return `<span class="game-card__emoji" aria-hidden="true">${emoji}</span>`;
}

function attachCoverHandlers() {
  gameGrid.querySelectorAll(".game-card__cover").forEach((img) => {
    const showFallback = () => {
      img.classList.add("game-card__cover--hidden");
      img.parentElement?.classList.add("game-card__image--fallback");
    };

    if (img.complete && img.naturalWidth === 0) showFallback();
    else {
      img.addEventListener("error", showFallback, { once: true });
      img.addEventListener(
        "load",
        () => img.parentElement?.classList.add("game-card__image--loaded"),
        { once: true }
      );
    }
  });
}

function getSummary(key) {
  const config = FILTER_CONFIG[key];
  const selected = state.filters[key];
  if (selected.size === 0) return config.placeholder;
  const labels = config.options
    .filter((opt) => selected.has(opt.value))
    .map((opt) => opt.label);
  return labels.join(", ");
}

function closeAllPopovers() {
  openFilterKey = null;
  document.querySelectorAll(".filter__popover").forEach((el) => el.remove());
  document.querySelectorAll(".filter__trigger").forEach((el) => {
    el.setAttribute("aria-expanded", "false");
  });
}

function renderFilterOption(key, option) {
  const selected = state.filters[key].has(option.value);
  return `
    <button type="button" class="filter__option${selected ? " filter__option--selected" : ""}" data-filter-key="${key}" data-filter-value="${option.value}">
      <svg class="filter__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${option.label}</span>
    </button>
  `;
}

function togglePopover(key, trigger) {
  if (openFilterKey === key) {
    closeAllPopovers();
    return;
  }

  closeAllPopovers();
  openFilterKey = key;
  trigger.setAttribute("aria-expanded", "true");

  const popover = document.createElement("div");
  popover.className = "filter__popover";
  popover.setAttribute("role", "listbox");
  popover.setAttribute("aria-label", FILTER_CONFIG[key].label);
  popover.innerHTML = FILTER_CONFIG[key].options.map((opt) => renderFilterOption(key, opt)).join("");
  trigger.closest(".filter").appendChild(popover);
}

function renderFilters() {
  filtersContainer.innerHTML = Object.entries(FILTER_CONFIG)
    .map(([key, config]) => {
      const active = state.filters[key].size > 0;
      const summary = getSummary(key);
      return `
        <div class="filter" data-filter="${key}">
          <span class="filter__label">${config.label}</span>
          <div class="filter__control">
            <button type="button" class="filter__trigger${active ? " filter__trigger--active" : ""}" aria-expanded="false" aria-haspopup="listbox">
              <span class="filter__summary">${summary}</span>
              <svg class="filter__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            ${active ? `<button type="button" class="filter__clear" data-clear-filter="${key}" aria-label="Clear ${config.label}">×</button>` : ""}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderGames(games) {
  gameGrid.innerHTML = games
    .map((game, index) => {
      const tint = TINTS[index % TINTS.length];
      const subjects = game.subjects.slice(0, 2);
      const skills = game.softSkills.slice(0, 2);

      return `
        <article class="game-card">
          <div class="game-card__image game-card__image--${tint}">
            ${renderCardImage(game)}
            <span class="game-card__weight">BGG ${game.bggScore}</span>
          </div>
          <div class="game-card__body">
            <h3 class="game-card__title">${game.name}</h3>
            <p class="game-card__tagline">${game.pedagogicalTrait}</p>
            <div class="game-card__meta">
              <span class="game-card__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ${game.players}
              </span>
              <span class="game-card__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${game.duration}
              </span>
            </div>
            <div class="game-card__tags">
              ${subjects.map((s) => `<span class="tag tag--filled">${s}</span>`).join("")}
              ${skills.map((s) => `<span class="tag tag--outline">${s}</span>`).join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  attachCoverHandlers();

  const count = games.length;
  resultCount.textContent = `${count} game${count === 1 ? "" : "s"}`;
  emptyState.classList.toggle("hidden", count > 0);
  gameGrid.classList.toggle("hidden", count === 0);
}

function update() {
  renderFilters();
  renderGames(filterGames());
  resetAllBtn.classList.toggle("hidden", !hasActiveFilters());
}

function resetAll() {
  state.search = "";
  searchInput.value = "";
  Object.keys(state.filters).forEach((key) => state.filters[key].clear());
  closeAllPopovers();
  update();
}

async function loadBggImages() {
  const loaded = await preloadBggImages(GAMES);
  loaded.forEach((url, id) => bggImages.set(id, url));
  update();
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  update();
});

resetAllBtn.addEventListener("click", resetAll);

filtersContainer.addEventListener("click", (e) => {
  const clearBtn = e.target.closest("[data-clear-filter]");
  if (clearBtn) {
    e.stopPropagation();
    const key = clearBtn.dataset.clearFilter;
    state.filters[key].clear();
    closeAllPopovers();
    update();
    return;
  }

  const optionBtn = e.target.closest("[data-filter-value]");
  if (optionBtn) {
    const key = optionBtn.dataset.filterKey;
    const value = optionBtn.dataset.filterValue;
    const set = state.filters[key];
    if (set.has(value)) set.delete(value);
    else set.add(value);
    update();
    const trigger = filtersContainer.querySelector(`[data-filter="${key}"] .filter__trigger`);
    if (trigger) togglePopover(key, trigger);
    return;
  }

  const trigger = e.target.closest(".filter__trigger");
  if (trigger) {
    const key = trigger.closest(".filter").dataset.filter;
    togglePopover(key, trigger);
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".filter")) closeAllPopovers();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllPopovers();
});

update();
loadBggImages();
