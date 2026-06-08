const selectorView = document.getElementById("view-selector");
const inspirationView = document.getElementById("view-inspiration");
const resourcesView = document.getElementById("view-resources");

function ensureResourcesRendered() {
  if (!resourcesView.dataset.rendered) {
    renderResources(resourcesView);
    resourcesView.dataset.rendered = "true";
  }
}

function showView(route, section = null) {
  const isSelector = route === ROUTES.selector;
  const isInspiration = route === ROUTES.inspiration;
  const isResources = route === ROUTES.resources;

  selectorView.classList.toggle("hidden", !isSelector);
  inspirationView.classList.toggle("hidden", !isInspiration);
  resourcesView.classList.toggle("hidden", !isResources);
  updateNavActiveState(route);

  if (isInspiration && !inspirationView.dataset.rendered) {
    renderInspiration(inspirationView);
    inspirationView.dataset.rendered = "true";
  }

  if (isResources) {
    ensureResourcesRendered();
  }

  const titles = {
    [ROUTES.selector]: "Game Selector — EduPlay Selector",
    [ROUTES.inspiration]: "Inspiration — EduPlay Selector",
    [ROUTES.resources]: "Resources — EduPlay Selector",
  };
  document.title = titles[route] || titles[ROUTES.selector];

  if (isResources && section) {
    requestAnimationFrame(() => scrollToResourceSection(section));
  } else {
    window.scrollTo(0, 0);
  }
}

initRouter(showView);

initNav({
  onNavigate: (route, section = null) => navigateTo(route, section),
});
initGameSelector();
initFooter();
