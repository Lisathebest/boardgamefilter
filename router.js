const ROUTES = {
  selector: "selector",
  inspiration: "inspiration",
  resources: "resources",
};

const RESOURCE_SECTION_IDS = ["websites", "youtubers", "online-games", "articles"];

const DEFAULT_ROUTE = ROUTES.selector;

let currentRoute = DEFAULT_ROUTE;
let currentSection = null;
let onRouteChange = null;

function parseHash(hash) {
  const path = (hash || "").replace(/^#/, "").replace(/^\//, "").toLowerCase();
  const [base, section] = path.split("/").filter(Boolean);

  if (base === ROUTES.inspiration) {
    return { route: ROUTES.inspiration, section: null };
  }

  if (base === ROUTES.resources) {
    const validSection = RESOURCE_SECTION_IDS.includes(section) ? section : null;
    return { route: ROUTES.resources, section: validSection };
  }

  return { route: ROUTES.selector, section: null };
}

/** Query params for cross-page links (file:// cannot use index.html#/route in Safari). */
function parseQuery(search = window.location.search) {
  const params = new URLSearchParams(search);
  const view = (params.get("view") || "").toLowerCase();
  if (!view) return null;

  if (view === ROUTES.inspiration) {
    return { route: ROUTES.inspiration, section: null };
  }

  if (view === ROUTES.resources) {
    const section = (params.get("section") || "").toLowerCase();
    const validSection = RESOURCE_SECTION_IDS.includes(section) ? section : null;
    return { route: ROUTES.resources, section: validSection };
  }

  if (view === ROUTES.selector) {
    return { route: ROUTES.selector, section: null };
  }

  return null;
}

function parseLocation() {
  return parseQuery() || parseHash(window.location.hash);
}

function buildAppLink(route, section = null, indexPath = "index.html") {
  if (route === ROUTES.selector && !section) return indexPath;
  const params = new URLSearchParams({ view: route });
  if (route === ROUTES.resources && section && RESOURCE_SECTION_IDS.includes(section)) {
    params.set("section", section);
  }
  return `${indexPath}?${params.toString()}`;
}

function syncUrlFromRoute(route, section = null) {
  const hash = buildHash(route, section);
  try {
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  } catch {
    // file:// may block replaceState in some browsers
  }
}

function normalizeRoute(hash) {
  return parseHash(hash).route;
}

function getCurrentRoute() {
  return currentRoute;
}

function getCurrentSection() {
  return currentSection;
}

function buildHash(route, section = null) {
  if (route === ROUTES.selector) return "#/";
  if (route === ROUTES.inspiration) return "#/inspiration";
  if (route === ROUTES.resources) {
    return section ? `#/resources/${section}` : "#/resources";
  }
  return "#/";
}

function navigateTo(route, section = null) {
  const nextRoute =
    route === ROUTES.inspiration
      ? ROUTES.inspiration
      : route === ROUTES.resources
        ? ROUTES.resources
        : ROUTES.selector;

  const nextSection =
    nextRoute === ROUTES.resources && RESOURCE_SECTION_IDS.includes(section) ? section : null;

  const hash = buildHash(nextRoute, nextSection);

  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    applyRoute(nextRoute, nextSection);
  }
}

function applyRoute(route, section = null) {
  const routeChanged = currentRoute !== route;
  const sectionChanged = currentSection !== section;

  if (!routeChanged && !sectionChanged) return;

  currentRoute = route;
  currentSection = section;
  onRouteChange?.(route, section);
}

function handleHashChange() {
  const { route, section } = parseHash(window.location.hash);
  applyRoute(route, section);
}

function initRouter(callback) {
  onRouteChange = callback;
  const fromQuery = parseQuery();
  const { route, section } = parseLocation();
  currentRoute = route;
  currentSection = section;

  if (fromQuery) {
    syncUrlFromRoute(route, section);
  }

  window.addEventListener("hashchange", handleHashChange);
  callback(route, section);
}
