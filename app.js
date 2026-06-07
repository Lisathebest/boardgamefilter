const selectorView = document.getElementById("view-selector");
const inspirationView = document.getElementById("view-inspiration");
const navbar = document.getElementById("global-nav");

const NAV_LINK_BASE =
  "rounded-full px-3 py-2 text-sm font-medium transition-all sm:px-5";
const NAV_LINK_INACTIVE = `${NAV_LINK_BASE} text-slate-500 hover:bg-slate-100 hover:text-slate-800`;
const NAV_LINK_ACTIVE = `${NAV_LINK_BASE} bg-indigo-600 text-white shadow-sm`;

function updateNavActiveState(route) {
  navbar.querySelectorAll("[data-route]").forEach((link) => {
    const isActive = link.dataset.route === route;
    link.setAttribute("aria-selected", isActive ? "true" : "false");
    link.className = isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE;
  });
}

function showView(route) {
  const isSelector = route === ROUTES.selector;
  selectorView.classList.toggle("hidden", !isSelector);
  inspirationView.classList.toggle("hidden", isSelector);
  updateNavActiveState(route);

  if (!isSelector && !inspirationView.dataset.rendered) {
    renderInspiration(inspirationView);
    inspirationView.dataset.rendered = "true";
  }

  document.title = isSelector
    ? "Game Selector — EduPlay Selector"
    : "Inspiration — EduPlay Selector";

  window.scrollTo(0, 0);
}

navbar.addEventListener("click", (e) => {
  const link = e.target.closest("[data-route]");
  if (!link) return;
  e.preventDefault();
  navigateTo(link.dataset.route);
});

initRouter(showView);
initGameSelector();
initFooter();
