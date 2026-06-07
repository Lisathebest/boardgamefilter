const ROUTES = {
  selector: "selector",
  inspiration: "inspiration",
};

const DEFAULT_ROUTE = ROUTES.selector;

let currentRoute = DEFAULT_ROUTE;
let onRouteChange = null;

function normalizeRoute(hash) {
  const path = (hash || "").replace(/^#/, "").replace(/^\//, "").toLowerCase();
  if (path === ROUTES.inspiration) return ROUTES.inspiration;
  return ROUTES.selector;
}

function getCurrentRoute() {
  return currentRoute;
}

function navigateTo(route) {
  const next = route === ROUTES.inspiration ? ROUTES.inspiration : ROUTES.selector;
  const hash = next === ROUTES.selector ? "#/" : `#/${next}`;
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    applyRoute(next);
  }
}

function applyRoute(route) {
  if (currentRoute === route) return;
  currentRoute = route;
  onRouteChange?.(route);
}

function handleHashChange() {
  applyRoute(normalizeRoute(window.location.hash));
}

function initRouter(callback) {
  onRouteChange = callback;
  currentRoute = normalizeRoute(window.location.hash);
  window.addEventListener("hashchange", handleHashChange);
  callback(currentRoute);
}
