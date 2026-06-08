/**
 * Global Footer — link configuration
 *
 * Add href values as pages become available. Leave href as "" until ready.
 *
 * About column:
 *   - "What is LudoMind?" → about/landing page URL
 *   - "F.A.Q. for Educators"       → FAQ page URL
 *   - "Contact Us"                 → contact URL or mailto: lisa.feng_28@tsinglan.org 
 *                                        Our Wechat Channel QR code: 
 *
 * Contribute column:
 *   - "Suggest a Game"             → add note:"Feel free to suggest any game to add to the library and we will share it on here" game suggestion form URL:
 *   - "Submit a Lesson Plan"       → as hovered extend display:"Submit a Lesson Plan you wanna share with others" lesson plan submission URL
 *   - "Report a Bug"               → issue tracker or bug report URL
 *   - "Support Our Research"       → donation or support page URL
 */
const FOOTER_COLUMNS = [
  {
    title: "About",
    links: [
      { label: "What is LudoMind?", href: "" },
      { label: "The Pedagogy of Play", href: "#/inspiration" },
      { label: "F.A.Q.", href: "" },
      { label: "Contact Us", href: "" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { label: "Suggest a Game", href: "" },
      { label: "Submit a Lesson Plan", href: "" },
      { label: "Report a Bug", href: "" },
      { label: "Support Our Research", href: "" },
    ],
  },
];

function renderFooterLink(link) {
  if (!link.href) {
    return `<li><span class="text-sm text-slate-400">${link.label}</span></li>`;
  }

  return `
    <li>
      <a
        href="${link.href}"
        class="text-sm text-slate-200 transition-colors hover:text-emerald-400"
      >${link.label}</a>
    </li>
  `;
}

function renderFooterColumn(column) {
  return `
    <div>
      <h3 class="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">${column.title}</h3>
      <ul class="space-y-2.5">
        ${column.links.map(renderFooterLink).join("")}
      </ul>
    </div>
  `;
}

function renderFooter() {
  const footer = document.getElementById("global-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="h-1 bg-gradient-to-r from-emerald-400 via-sky-400 via-50% to-indigo-400" aria-hidden="true"></div>
    <div class="bg-slate-900 px-6 py-12">
      <div class="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div class="grid flex-1 grid-cols-1 gap-10 md:max-w-3xl md:grid-cols-2 md:gap-12">
          ${FOOTER_COLUMNS.map(renderFooterColumn).join("")}
        </div>
        <button
          type="button"
          id="footer-back-to-top"
          class="shrink-0 self-end rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400 md:self-start"
          aria-label="Back to top"
        >
          TOP ⬆
        </button>
      </div>
      <p class="mx-auto mt-10 max-w-5xl text-center text-xs text-slate-400">
        LudoMind
      </p>
    </div>
  `;
}

function initFooter() {
  renderFooter();

  document.getElementById("footer-back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
