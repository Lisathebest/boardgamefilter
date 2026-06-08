/**
 * Global navbar config & renderer.
 *
 * Nav dropdown types:
 * - `page-dropdown` — opens a full page (optionally with section anchors). Default: hover.
 * - Filter multiselect dropdowns live in gameSelector.js (`filter__*`); those stay click-only.
 *
 * To add a new page dropdown, append a `page-dropdown` item below with `openOn: "hover"`.
 * Use `openOn: "click"` only when hover is unsuitable (e.g. touch-first or very long menus).
 */
const NAV_DROPDOWN_OPEN = {
  hover: "hover",
  click: "click",
};

const PAGE_DROPDOWN_DEFAULT_OPEN = NAV_DROPDOWN_OPEN.hover;

const NAV_LINK_BASE =
  "rounded-full px-3 py-2 text-sm font-medium transition-all sm:px-5";
const NAV_LINK_INACTIVE = `${NAV_LINK_BASE} text-slate-500 hover:bg-slate-100 hover:text-slate-800`;
const NAV_LINK_ACTIVE = `${NAV_LINK_BASE} bg-indigo-600 text-white shadow-sm`;

const NAV_ITEMS = [
  { type: "link", route: ROUTES.selector, label: "Game Selector" },
  { type: "link", route: ROUTES.inspiration, label: "Inspiration" },
  {
    type: "page-dropdown",
    route: ROUTES.resources,
    label: "Resources",
    openOn: PAGE_DROPDOWN_DEFAULT_OPEN,
    menuLabel: "Resources sections",
    items: [
      { section: "websites", label: "Websites" },
      { section: "youtubers", label: "YouTubers" },
      { section: "online-games", label: "Online Board Games" },
      { section: "articles", label: "Articles" },
    ],
  },
];

const NAV_DROPDOWN_CHEVRON = `
  <svg class="nav-dropdown__chevron ml-1 inline-block h-3.5 w-3.5 opacity-60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
  </svg>
`;

function renderNavLink(item, isActive) {
  const hash = item.route === ROUTES.selector ? "#/" : `#/${item.route}`;
  const className = isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE;

  return `
    <a
      href="${hash}"
      role="tab"
      data-route="${item.route}"
      aria-selected="${isActive ? "true" : "false"}"
      class="${className}"
    >${item.label}</a>
  `;
}

function renderPageDropdown(item, isActive) {
  const openOn = item.openOn || PAGE_DROPDOWN_DEFAULT_OPEN;
  const menuId = `${item.route}-nav-menu`;
  const triggerClass = isActive
    ? `nav-dropdown__trigger ${NAV_LINK_ACTIVE} nav-dropdown__trigger--active`
    : `nav-dropdown__trigger ${NAV_LINK_INACTIVE}`;

  return `
    <div
      class="nav-dropdown relative"
      data-nav-dropdown
      data-dropdown-open="${openOn}"
    >
      <button
        type="button"
        class="${triggerClass}"
        data-route="${item.route}"
        role="tab"
        aria-selected="${isActive ? "true" : "false"}"
        aria-haspopup="true"
        aria-controls="${menuId}"
      >
        ${item.label}
        ${NAV_DROPDOWN_CHEVRON}
      </button>
      <div id="${menuId}" class="nav-dropdown__menu absolute right-0 top-full z-50 min-w-[12rem] pt-2">
        <div
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg"
          role="menu"
          aria-label="${item.menuLabel || item.label}"
        >
          ${item.items
            .map(
              (entry) => `
            <a
              href="#/${item.route}/${entry.section}"
              class="nav-dropdown__item block px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              role="menuitem"
              data-route="${item.route}"
              data-section="${entry.section}"
            >${entry.label}</a>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderGlobalNav(activeRoute = ROUTES.selector) {
  const tablist = document.getElementById("global-nav-tabs");
  if (!tablist) return;

  tablist.innerHTML = NAV_ITEMS.map((item) => {
    const isActive = item.route === activeRoute;
    if (item.type === "page-dropdown") return renderPageDropdown(item, isActive);
    return renderNavLink(item, isActive);
  }).join("");
}

function updateNavActiveState(route) {
  const navbar = document.getElementById("global-nav");
  if (!navbar) return;

  navbar.querySelectorAll("[data-route]").forEach((el) => {
    const isActive = el.dataset.route === route;

    if (el.classList.contains("nav-dropdown__trigger")) {
      el.setAttribute("aria-selected", isActive ? "true" : "false");
      el.className = `nav-dropdown__trigger ${isActive ? `${NAV_LINK_ACTIVE} nav-dropdown__trigger--active` : NAV_LINK_INACTIVE}`;
      return;
    }

    if (el.getAttribute("role") === "tab") {
      el.setAttribute("aria-selected", isActive ? "true" : "false");
      el.className = isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE;
    }
  });
}

function closeNavDropdowns(navbar, openMode = null) {
  const selector = openMode ? `[data-dropdown-open="${openMode}"]` : "[data-nav-dropdown]";
  navbar.querySelectorAll(selector).forEach((dropdown) => {
    dropdown.classList.remove("nav-dropdown--open");
    dropdown.querySelector(".nav-dropdown__trigger")?.setAttribute("aria-expanded", "false");
  });
}

function closeClickNavDropdowns(navbar) {
  closeNavDropdowns(navbar, "click");
}

function toggleClickNavDropdown(dropdown) {
  const trigger = dropdown.querySelector(".nav-dropdown__trigger");
  const willOpen = !dropdown.classList.contains("nav-dropdown--open");
  closeClickNavDropdowns(dropdown.closest("#global-nav"));
  if (willOpen) {
    dropdown.classList.add("nav-dropdown--open");
    trigger?.setAttribute("aria-expanded", "true");
  }
}

function initNav({ onNavigate }) {
  const navbar = document.getElementById("global-nav");
  if (!navbar) return;

  renderGlobalNav(getCurrentRoute());

  navbar.addEventListener("click", (e) => {
    const clickTrigger = e.target.closest('[data-dropdown-open="click"] .nav-dropdown__trigger');
    if (clickTrigger) {
      e.preventDefault();
      toggleClickNavDropdown(clickTrigger.closest("[data-nav-dropdown]"));
      return;
    }

    const hoverTrigger = e.target.closest('[data-dropdown-open="hover"] .nav-dropdown__trigger');
    if (hoverTrigger) {
      e.preventDefault();
      const dropdown = hoverTrigger.closest("[data-nav-dropdown]");
      closeNavDropdowns(navbar);
      dropdown?.classList.add("nav-dropdown--open");
      hoverTrigger.setAttribute("aria-expanded", "true");
      return;
    }

    const menuItem = e.target.closest(".nav-dropdown__item");
    if (menuItem) {
      e.preventDefault();
      closeNavDropdowns(navbar);
      onNavigate(menuItem.dataset.route, menuItem.dataset.section || null);
      return;
    }

    const link = e.target.closest("[data-route][role='tab']");
    if (!link) return;
    e.preventDefault();
    closeNavDropdowns(navbar);
    onNavigate(link.dataset.route);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-nav-dropdown]")) {
      closeNavDropdowns(navbar);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNavDropdowns(navbar);
  });
}
