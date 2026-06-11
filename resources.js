const WEBSITE_FILTER_TAGS = [
  { id: "education", label: "Education" },
  { id: "board-game", label: "Board Game" },
  { id: "gamification", label: "Gamification" },
  { id: "reviewer", label: "Reviewer" },
  { id: "game-based-learning", label: "Game Based Learning" },
];

const ONLINE_GAMES_FILTER_TAGS = [
  { id: "game-collection", label: "Game Collection" },
  { id: "classroom-sized-games", label: "Classroom-sized Games" },
  { id: "solo-board-game", label: "Solo Board Game" },
];

const RESOURCE_CONTENT = {
  websites: {
    id: "websites",
    title: "Websites",
    subtitle: "Trusted sites for research, rules, and classroom-ready ideas.",
    layout: "filtered-links",
    filters: WEBSITE_FILTER_TAGS,
    items: [
      {
        name: "BoardGameGeek",
        url: "https://boardgamegeek.com/",
        description: "Look up components, player counts, and community rules clarifications — useful when vetting a title for your class.",
        tags: ["board-game", "reviewer"],
      },
      {
        name: "Shut Up & Sit Down",
        url: "https://www.shutupandsitdown.com/",
        description: "Accessible reviews and “how to teach” angles that help you preview tone and complexity before buying.",
        tags: ["board-game", "reviewer"],
      },
      {
        name: "Project Zero — Pedagogy of Play",
        url: "https://pz.harvard.edu/",
        description: "Harvard Graduate School of Education research on playful learning, including the Five Core Practices framework for classrooms.",
        tags: ["education", "game-based-learning"],
      },
      {
        name: "Classcraft",
        url: "https://www.classcraft.com/",
        description: "Gamified classroom management and engagement tools — useful for comparing digital reward structures with tabletop play.",
        tags: ["gamification", "education"],
      },
      {
        name: "Board Game Quest",
        url: "https://www.boardgamequest.com/",
        description: "Reviews, top-10 lists, and family-play columns — helpful for previewing tone, complexity, and classroom fit before you buy.",
        tags: ["board-game", "reviewer"],
      },
      {
        name: "Recommend.Games",
        url: "https://recommend.games/#/",
        description: "Answer a short quiz to get personalized board game suggestions — useful when building a library around your teaching goals.",
        tags: ["board-game"],
      },
      {
        name: "Map of Board Games",
        url: "https://toucan4life.github.io/map-of-boardgames/",
        description: "Interactive map of 40,000+ BGG titles — explore clusters of similar games visually when you want alternatives to a title you already know.",
        tags: ["board-game"],
      },
    ],
  },
  youtubers: {
    id: "youtubers",
    title: "YouTubers",
    subtitle: "Channels that explain rules clearly and model positive table culture.",
    layout: "youtube-channels",
    items: [
      {
        name: "Watch It Played",
        url: "https://www.youtube.com/@WatchItPlayed",
        description: "Step-by-step teach-and-play videos — ideal for learning a game before leading it with students.",
        avatar: "",
      },
      {
        name: "Actualol",
        url: "https://www.youtube.com/@Actualol",
        description: "Light, classroom-friendly rundowns of family-weight games and party titles.",
        avatar: "",
      },
      {
        name: "Before You Play",
        url: "https://www.youtube.com/@BeforeYouPlay",
        description: "Concise rules explainers and setup walkthroughs — quick previews before you teach a title in class.",
        avatar: "",
      },
      {
        name: "Vaseline Noodles",
        url: "https://www.youtube.com/@VaselineNoodles",
        description: "Comedy sketches about popular board games — useful for sparking student interest and positive table culture.",
        avatar: "",
      },
      {
        name: "The Dice Tower",
        url: "https://www.youtube.com/@thedicetower",
        description: "Long-running reviews, top-10 lists, and industry news — broad coverage when researching games for your library.",
        avatar: "",
      },
    ],
  },
  "online-games": {
    id: "online-games",
    title: "Online Board Games",
    subtitle: "Browser-based platforms for remote clubs, hybrid classes, or demo sessions.",
    layout: "filtered-cards",
    filters: ONLINE_GAMES_FILTER_TAGS,
    items: [
      {
        name: "Board Game Arena",
        url: "https://boardgamearena.com/",
        description: "Large catalog of officially licensed titles with turn enforcement — strong for structured remote play.",
        tags: ["game-collection", "solo-board-game"],
      },
      {
        name: "Tabletopia",
        url: "https://tabletopia.com/",
        description: "Sandbox 3D tables; useful when you need free movement and house rules for a lesson prototype.",
        tags: ["game-collection"],
      },
      {
        name: "Ganz Schön Clever (Brettspielwelt)",
        url: "https://m.brettspielwelt.de/ganzschoenclever/",
        description: "Browser version of the solo dice-placement hit — good for quiet practice rounds or demoing probability thinking one student at a time.",
        tags: ["solo-board-game"],
      },
      {
        name: "Royal Game of Ur Online",
        url: "https://royalgameofuronline.com/",
        description: "Play the ancient race game in the browser — short sessions work well for history units or early-finishers.",
        tags: ["solo-board-game"],
      },
      {
        name: "18xx.Games",
        url: "https://18xx.games/",
        description: "Hosted 18xx train-stock games with async turns — for advanced clubs exploring economics and long-horizon planning online.",
        tags: ["game-collection"],
      },
      {
        name: "Wavelength (Browser)",
        url: "https://mikeck1.github.io/",
        description: "Free spectrum-clue party game in the browser — project one screen for the class; teams discuss where a clue lands between two concepts.",
        tags: ["classroom-sized-games"],
      },
      {
        name: "Codenames Online",
        url: "https://codenames.game/",
        description: "Official browser Codenames with private rooms — scales to large groups over video chat for vocabulary and associative thinking.",
        tags: ["classroom-sized-games"],
      },
    ],
  },
  articles: {
    id: "articles",
    title: "Articles",
    subtitle: "Republished Chinese and English readings for educators — original sources linked.",
    layout: "article-cards",
    items: [
      {
        title: "How to Turn Play into Learning: 5 Principles of Playful Learning",
        excerpt:
          "Discover how to bridge the gap between free play and formal schooling with five core practices for educators from Project Zero.",
        url: "Articles-pages/playful-learning-principles.html",
        image: "",
        imageAlt: "Children engaged in playful learning",
        lang: "English",
        accent: "sky",
      },
      {
        title: "Process Your Own Emotions First, Before You Can Help Your Child Navigate Failure",
        excerpt:
          "When a child loses, your body speaks louder than your words. Johnny C. reflects on learning to manage his own emotions before comforting young players.",
        url: "Articles-pages/process-emotions-before-failure.html",
        image: "",
        imageAlt: "Adult and child sharing a quiet moment together",
        lang: "English",
        accent: "emerald",
      },
      {
        title: "Exploring Play Sufficiency webinar series report",
        excerpt:
          "A summary of the webinar series exploring what play sufficiency means in practice — and how schools and communities can support children's right to play.",
        url: "",
        image: "",
        imageAlt: "Children playing outdoors",
        lang: "English",
        accent: "emerald",
      },
      {
        title: "Play Sufficiency Assessment: Ludicology's Model",
        excerpt:
          "An overview of a structured model for assessing whether children have enough time, space, permission, and opportunity to play — useful for school planning.",
        url: "",
        image: "",
        imageAlt: "Play assessment framework diagram",
        lang: "English",
        accent: "sky",
      },
      {
        title: "游戏充足性：为什么课堂需要「够玩」的时间与空间",
        excerpt:
          "转载译文：探讨学校如何评估与保障学生的游戏机会，以及游戏充足性对学习动机与自我调节的潜在影响。",
        url: "",
        image: "",
        imageAlt: "学生在教室中合作游戏",
        lang: "中文",
        accent: "emerald",
      },
    ],
  },
};

const RESOURCE_NAV_ITEMS = [
  { section: "websites", label: "Websites" },
  { section: "youtubers", label: "YouTubers" },
  { section: "online-games", label: "Online Board Games" },
  { section: "articles", label: "Articles" },
];

function getTagLabel(tagId, filters) {
  return filters.find((tag) => tag.id === tagId)?.label || tagId;
}

function renderResourceTagPills(tags, filters) {
  if (!tags?.length) return "";

  return `
    <ul class="resource-card__tags" aria-label="Topics">
      ${tags
        .map(
          (tagId) => `
        <li><span class="resource-card__tag">${getTagLabel(tagId, filters)}</span></li>
      `
        )
        .join("")}
    </ul>
  `;
}

function renderResourceCardImage(item, accent = "emerald") {
  if (item.image) {
    return `<img src="${item.image}" alt="" class="resource-card__image" loading="lazy">`;
  }

  const tone = accent === "sky" ? "article-card__placeholder--sky" : "article-card__placeholder--emerald";
  return `<div class="article-card__placeholder ${tone}" role="img" aria-hidden="true"></div>`;
}

function renderFilteredResourceCard(item, _filters, index = 0) {
  const tagAttr = (item.tags || []).join(" ");
  const accent = index % 2 === 0 ? "emerald" : "sky";
  const ctaClass = accent === "sky" ? "resource-card__cta--sky" : "resource-card__cta--emerald";

  return `
    <li class="resource-card" data-resource-tags="${tagAttr}">
      <div class="resource-card__media">
        ${renderResourceCardImage(item, accent)}
      </div>
      <div class="resource-card__body">
        <h3 class="resource-card__title">${item.name}</h3>
        <p class="resource-card__excerpt">${item.description}</p>
        <a href="${item.url}" class="resource-card__cta ${ctaClass}" target="_blank" rel="noopener noreferrer">
          Visit<span class="sr-only"> ${item.name} (opens in new tab)</span>
        </a>
      </div>
    </li>
  `;
}

function renderYoutubeChannel(item, index = 0) {
  const tones = ["rose", "sky", "amber"];
  const tone = tones[index % tones.length];
  const initials = item.name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatar = item.avatar
    ? `<img src="${item.avatar}" alt="" class="yt-channel__avatar" loading="lazy">`
    : `<div class="yt-channel__avatar yt-channel__avatar--placeholder yt-channel__avatar--${tone}" aria-hidden="true">${initials}</div>`;

  return `
    <li class="yt-channel">
      <a href="${item.url}" class="yt-channel__link" target="_blank" rel="noopener noreferrer">
        <div class="yt-channel__icon-wrap">
          ${avatar}
          <span class="yt-channel__badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" class="yt-channel__badge-icon">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/>
              <path fill="#fff" d="M9.75 15.02l6.5-3.52-6.5-3.52v7.04z"/>
            </svg>
          </span>
        </div>
        <span class="yt-channel__name">${item.name}</span>
        <p class="yt-channel__desc">${item.description}</p>
        <span class="sr-only"> (opens in new tab)</span>
      </a>
    </li>
  `;
}

function renderResourceCard(item, filters) {
  const tagAttr = (item.tags || []).join(" ");

  return `
    <li class="resource-link-card rounded-xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm transition-shadow hover:shadow-md md:p-6" data-resource-tags="${tagAttr}">
      <a
        href="${item.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="font-display text-lg font-semibold text-indigo-700 transition-colors hover:text-indigo-900"
      >${item.name}<span class="sr-only"> (opens in new tab)</span></a>
      <p class="mt-2 text-slate-600 leading-relaxed">${item.description}</p>
      ${renderResourceTagPills(item.tags, filters)}
    </li>
  `;
}

function renderResourceFilters(section) {
  const filters = section.filters || [];

  return `
    <div class="resource-filters" role="group" aria-label="Filter ${section.title} by topic">
      ${filters
        .map(
          (tag) => `
        <button
          type="button"
          class="resource-filter-pill"
          data-resource-filter="${tag.id}"
          aria-pressed="false"
        >${tag.label}</button>
      `
        )
        .join("")}
      <button type="button" class="resource-filter-pill resource-filter-pill--clear hidden" data-resource-filter-clear aria-label="Clear ${section.title} filters">
        Clear
      </button>
    </div>
  `;
}

function applyResourceFilters(sectionRoot, activeTags) {
  const cards = sectionRoot.querySelectorAll("[data-resource-tags]");
  const clearBtn = sectionRoot.querySelector("[data-resource-filter-clear]");
  const hasActive = activeTags.size > 0;

  clearBtn?.classList.toggle("hidden", !hasActive);

  cards.forEach((card) => {
    const cardTags = (card.dataset.resourceTags || "").split(" ").filter(Boolean);
    const visible = !hasActive || cardTags.some((tag) => activeTags.has(tag));
    card.classList.toggle("hidden", !visible);
  });

  const emptyState = sectionRoot.querySelector("[data-resource-empty]");
  if (emptyState) {
    const anyVisible = [...cards].some((card) => !card.classList.contains("hidden"));
    emptyState.classList.toggle("hidden", anyVisible);
  }
}

function initResourceFilters(section) {
  const sectionRoot = document.getElementById(section.id);
  if (!sectionRoot || sectionRoot.dataset.filtersInit) return;

  const activeTags = new Set();
  const pills = sectionRoot.querySelectorAll("[data-resource-filter]");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const tagId = pill.dataset.resourceFilter;
      if (activeTags.has(tagId)) {
        activeTags.delete(tagId);
        pill.setAttribute("aria-pressed", "false");
        pill.classList.remove("resource-filter-pill--active");
      } else {
        activeTags.add(tagId);
        pill.setAttribute("aria-pressed", "true");
        pill.classList.add("resource-filter-pill--active");
      }
      applyResourceFilters(sectionRoot, activeTags);
    });
  });

  sectionRoot.querySelector("[data-resource-filter-clear]")?.addEventListener("click", () => {
    activeTags.clear();
    pills.forEach((pill) => {
      pill.setAttribute("aria-pressed", "false");
      pill.classList.remove("resource-filter-pill--active");
    });
    applyResourceFilters(sectionRoot, activeTags);
  });

  sectionRoot.dataset.filtersInit = "true";
}

function renderArticleCardImage(item) {
  if (item.image) {
    return `<img src="${item.image}" alt="${item.imageAlt || ""}" class="article-card__image" loading="lazy">`;
  }

  const accent = item.accent === "sky" ? "article-card__placeholder--sky" : "article-card__placeholder--emerald";
  return `<div class="article-card__placeholder ${accent}" role="img" aria-label="${item.imageAlt || item.title}"></div>`;
}

function renderArticleCard(item) {
  const accent = item.accent === "sky" ? "article-card__cta--sky" : "article-card__cta--emerald";
  const cta = item.url
    ? `<a href="${item.url}" class="article-card__cta ${accent}" target="_blank" rel="noopener noreferrer">Read More<span class="sr-only">: ${item.title} (opens in new tab)</span></a>`
    : `<span class="article-card__cta article-card__cta--soon" aria-disabled="true">Coming Soon</span>`;

  return `
    <li class="article-card">
      <div class="article-card__media">
        ${renderArticleCardImage(item)}
        ${item.lang ? `<span class="article-card__lang">${item.lang}</span>` : ""}
      </div>
      <div class="article-card__body">
        <h3 class="article-card__title">${item.title}</h3>
        <p class="article-card__excerpt">${item.excerpt}</p>
        ${cta}
      </div>
    </li>
  `;
}

function renderResourceSection(key) {
  const section = RESOURCE_CONTENT[key];
  if (!section) return "";

  const isArticleGrid = section.layout === "article-cards";
  const isFilteredLinks = section.layout === "filtered-links";
  const isFilteredCards = section.layout === "filtered-cards";
  const isYoutubeChannels = section.layout === "youtube-channels";
  const filters = section.filters || [];

  let body = `<ul class="space-y-4">${section.items.map((item) => renderResourceCard(item, filters)).join("")}</ul>`;

  if (isYoutubeChannels) {
    body = `<ul class="yt-channel-grid">${section.items.map(renderYoutubeChannel).join("")}</ul>`;
  }

  if (isArticleGrid) {
    body = `<ul class="article-card-grid">${section.items.map(renderArticleCard).join("")}</ul>`;
  }

  if (isFilteredLinks) {
    body = `
      ${renderResourceFilters(section)}
      <ul class="resource-link-list space-y-4">${section.items.map((item) => renderResourceCard(item, filters)).join("")}</ul>
      <p class="resource-empty hidden text-center text-sm text-slate-500" data-resource-empty>No items match these filters — try clearing a tag.</p>
    `;
  }

  if (isFilteredCards) {
    body = `
      ${renderResourceFilters(section)}
      <ul class="resource-card-grid">${section.items.map((item, index) => renderFilteredResourceCard(item, filters, index)).join("")}</ul>
      <p class="resource-empty hidden text-center text-sm text-slate-500" data-resource-empty>No items match these filters — try clearing a tag.</p>
    `;
  }

  return `
    <section id="${section.id}" class="scroll-mt-28" aria-labelledby="resources-${section.id}-heading">
      <header class="mb-6">
        <h2 id="resources-${section.id}-heading" class="font-display text-2xl font-bold text-slate-900 md:text-3xl">${section.title}</h2>
        <p class="mt-2 text-slate-500">${section.subtitle}</p>
      </header>
      ${body}
    </section>
  `;
}

function renderResources(container) {
  container.innerHTML = `
    <div class="resources-page mx-auto max-w-6xl px-6 pb-6 pt-10 md:pt-14">
      <header class="mb-12 text-center md:mb-16">
        <span class="mb-4 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">Curated Links</span>
        <h1 class="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">Resources</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-500">Hand-picked websites, channels, online platforms, and republished articles to support your classroom game library.</p>
      </header>

      <nav class="mb-12 flex flex-wrap justify-center gap-2" aria-label="Resources sections">
        ${RESOURCE_NAV_ITEMS.map(
          (item) => `
          <a
            href="#/resources/${item.section}"
            data-route="resources"
            data-section="${item.section}"
            class="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >${item.label}</a>
        `
        ).join("")}
      </nav>

      <article class="space-y-16">
        ${Object.keys(RESOURCE_CONTENT).map(renderResourceSection).join("")}
      </article>

      <div id="newsletter-signup-resources"></div>
    </div>
  `;

  mountNewsletter("newsletter-signup-resources", "newsletter-resources");

  Object.values(RESOURCE_CONTENT)
    .filter((section) => section.layout === "filtered-links" || section.layout === "filtered-cards")
    .forEach(initResourceFilters);
}

function scrollToResourceSection(sectionId) {
  if (!sectionId) return;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
