/**
 * Sets back-links from article pages to the main app.
 * Uses query params because Safari file:// cannot open index.html#/route from another page.
 */
(function initArticleNavLinks() {
  const INDEX = "../index.html";

  document.querySelectorAll("[data-app-route]").forEach((link) => {
    const route = link.dataset.appRoute;
    const section = link.dataset.appSection || null;
    link.href = typeof buildAppLink === "function"
      ? buildAppLink(route, section, INDEX)
      : section
        ? `${INDEX}?view=${encodeURIComponent(route)}&section=${encodeURIComponent(section)}`
        : route === "selector"
          ? INDEX
          : `${INDEX}?view=${encodeURIComponent(route)}`;
  });
})();
