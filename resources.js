const WEBSITE_FILTER_TAGS = [
  { id: "education", label: "Education" },
  { id: "board-game", label: "Board Game" },
  { id: "gamification", label: "Gamification" },
  { id: "reviewer", label: "Reviewer" },
  { id: "game-based-learning", label: "Game Based Learning" },
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
        name: "Games for Educators (Ludicology)",
        url: "https://www.ludicology.com/",
        description: "Articles and frameworks connecting game mechanics to learning outcomes.",
        tags: ["education", "game-based-learning"],
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
    ],
  },
  youtubers: {
    id: "youtubers",
    title: "YouTubers",
    subtitle: "Channels that explain rules clearly and model positive table culture.",
    items: [
      {
        name: "Watch It Played",
        url: "https://www.youtube.com/@WatchItPlayed",
        description: "Step-by-step teach-and-play videos — ideal for learning a game before leading it with students.",
      },
      {
        name: "Actualol",
        url: "https://www.youtube.com/@Actualol",
        description: "Light, classroom-friendly rundowns of family-weight games and party titles.",
      },
      {
        name: "Board Game Teacher",
        url: "https://www.youtube.com/results?search_query=board+game+classroom+teacher",
        description: "Search curated classroom-play playlists and educator walkthroughs on YouTube.",
      },
    ],
  },
  "online-games": {
    id: "online-games",
    title: "Online Board Games",
    subtitle: "Browser-based platforms for remote clubs, hybrid classes, or demo sessions.",
    layout: "links",
    items: [
      {
        name: "Board Game Arena",
        url: "https://boardgamearena.com/",
        description: "Large catalog of officially licensed titles with turn enforcement — strong for structured remote play.",
      },
      {
        name: "Tabletopia",
        url: "https://tabletopia.com/",
        description: "Sandbox 3D tables; useful when you need free movement and house rules for a lesson prototype.",
      },
      {
        name: "Boiteajeux",
        url: "https://www.boiteajeux.net/",
        description: "Lightweight classics (e.g. Colt Express, Hanabi) with low setup — good for quick digital warm-ups.",
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

function getTagLabel(tagId, filters = WEBSITE_FILTER_TAGS) {
  return filters.find((tag) => tag.id === tagId)?.label || tagId;
}

function renderResourceTagPills(tags, filters = WEBSITE_FILTER_TAGS) {
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

function renderResourceCard(item, filters = WEBSITE_FILTER_TAGS) {
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

function renderWebsiteFilters(section) {
  const filters = section.filters || WEBSITE_FILTER_TAGS;

  return `
    <div class="resource-filters" role="group" aria-label="Filter websites by topic">
      ${filters
        .map(
          (tag) => `
        <button
          type="button"
          class="resource-filter-pill"
          data-website-filter="${tag.id}"
          aria-pressed="false"
        >${tag.label}</button>
      `
        )
        .join("")}
      <button type="button" class="resource-filter-pill resource-filter-pill--clear hidden" data-website-filter-clear aria-label="Clear website filters">
        Clear
      </button>
    </div>
  `;
}

function applyWebsiteFilters(sectionRoot, activeTags) {
  const cards = sectionRoot.querySelectorAll("[data-resource-tags]");
  const clearBtn = sectionRoot.querySelector("[data-website-filter-clear]");
  const hasActive = activeTags.size > 0;

  clearBtn?.classList.toggle("hidden", !hasActive);

  cards.forEach((card) => {
    const cardTags = (card.dataset.resourceTags || "").split(" ").filter(Boolean);
    const visible = !hasActive || cardTags.some((tag) => activeTags.has(tag));
    card.classList.toggle("hidden", !visible);
  });

  const emptyState = sectionRoot.querySelector("[data-website-empty]");
  if (emptyState) {
    const anyVisible = [...cards].some((card) => !card.classList.contains("hidden"));
    emptyState.classList.toggle("hidden", anyVisible);
  }
}

function initWebsiteFilters(section) {
  const sectionRoot = document.getElementById(section.id);
  if (!sectionRoot || sectionRoot.dataset.filtersInit) return;

  const activeTags = new Set();
  const pills = sectionRoot.querySelectorAll("[data-website-filter]");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const tagId = pill.dataset.websiteFilter;
      if (activeTags.has(tagId)) {
        activeTags.delete(tagId);
        pill.setAttribute("aria-pressed", "false");
        pill.classList.remove("resource-filter-pill--active");
      } else {
        activeTags.add(tagId);
        pill.setAttribute("aria-pressed", "true");
        pill.classList.add("resource-filter-pill--active");
      }
      applyWebsiteFilters(sectionRoot, activeTags);
    });
  });

  sectionRoot.querySelector("[data-website-filter-clear]")?.addEventListener("click", () => {
    activeTags.clear();
    pills.forEach((pill) => {
      pill.setAttribute("aria-pressed", "false");
      pill.classList.remove("resource-filter-pill--active");
    });
    applyWebsiteFilters(sectionRoot, activeTags);
  });

  sectionRoot.dataset.filtersInit = "true";
}

const ARTICLE_DOC_ICON = `
  <svg class="article-card__doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
`;

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
    : `<span class="article-card__cta ${accent} article-card__cta--soon" aria-disabled="true">Coming Soon</span>`;

  return `
    <li class="article-card">
      <div class="article-card__media">
        ${renderArticleCardImage(item)}
        <span class="article-card__doc-badge" aria-hidden="true">${ARTICLE_DOC_ICON}</span>
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
  const filters = section.filters || WEBSITE_FILTER_TAGS;

  let body = `<ul class="space-y-4">${section.items.map((item) => renderResourceCard(item, filters)).join("")}</ul>`;

  if (isArticleGrid) {
    body = `<ul class="article-card-grid">${section.items.map(renderArticleCard).join("")}</ul>`;
  }

  if (isFilteredLinks) {
    body = `
      ${renderWebsiteFilters(section)}
      <ul class="resource-link-list space-y-4">${section.items.map((item) => renderResourceCard(item, filters)).join("")}</ul>
      <p class="resource-empty hidden text-center text-sm text-slate-500" data-website-empty>No websites match these filters — try clearing a tag.</p>
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
    <div class="resources-page mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-14">
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
    </div>
  `;

  initWebsiteFilters(RESOURCE_CONTENT.websites);
}

function scrollToResourceSection(sectionId) {
  if (!sectionId) return;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
