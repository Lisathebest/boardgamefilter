/**
 * Global Footer — link configuration
 *
 * Brand blurb: FOOTER_BRAND (left column)
 *
 * About column:
 *   - "F.A.Q." → FAQ page URL
 *
 * Contribute column — add href values when ready:
 *   - Suggest a Game, Submit a Lesson Plan, Report a Bug, Support Our Research
 *
 * Contact: email + WeChat QR in renderFooterContact()
 * WeChat image: WECHAT_QR_SRC from wechatQrData.js (load before footer.js)
 */

const FOOTER_BRAND = {
  title: "What is LudoMind?",
  description:
    "LudoMind fuses Ludology (the study of games) and the Mind. We decode board game mechanics to train cognitive soft skills. Board games are powerful microworlds for soft skills—yet many educators struggle with which games to use and how to integrate them. This selector offers research-backed matchmaking, turning classroom play into intentional learning.",
};

const FOOTER_COLUMNS = [
  {
    title: "About",
    links: [
      { label: "The Pedagogy of Play", href: "#/inspiration" },
      { label: "F.A.Q.", href: "" },
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

function renderFooterBrand() {
  return `
    <div class="footer-brand">
      <div class="footer-brand__heading">
        <span class="footer-brand__dot" aria-hidden="true"></span>
        <h2 class="footer-brand__title">${FOOTER_BRAND.title}</h2>
      </div>
      <p class="footer-brand__description">${FOOTER_BRAND.description}</p>
    </div>
  `;
}

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

function renderFooterBggAttribution() {
  return `
    <a
      href="https://boardgamegeek.com/"
      class="footer-bgg"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Powered by BoardGameGeek — opens in new tab"
    >
      <span class="footer-bgg__badge">
        <img
          src="assets/BGGAPIlogo.jpg"
          alt="Powered by BoardGameGeek"
          class="footer-bgg__logo"
          width="180"
          height="45"
          loading="lazy"
        />
      </span>
    </a>
  `;
}

function renderFooterContact() {
  return `
    <div id="contact">
      <h3 class="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h3>
      <p class="text-sm text-slate-300">
        Email:
        <a
          href="mailto:lisa.feng_28@tsinglan.org"
          class="text-slate-200 transition-colors hover:text-emerald-400"
        >lisa.feng_28@tsinglan.org</a>
      </p>
      <p class="mt-3 text-sm text-slate-300">Club WeChat Official Account:</p>
      <img
        src="${typeof WECHAT_QR_SRC !== "undefined" ? WECHAT_QR_SRC : "assets/wechat-official-account.jpg"}"
        alt="Club WeChat Official Account QR code"
        class="footer-contact__qr mt-2"
        width="112"
        height="112"
        loading="lazy"
      />
    </div>
  `;
}

function renderFooter() {
  const footer = document.getElementById("global-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="h-1 bg-gradient-to-r from-emerald-400 via-sky-400 via-50% to-indigo-400" aria-hidden="true"></div>
    <div class="bg-slate-900 px-6 py-12">
      <div class="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div class="grid flex-1 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          ${renderFooterBrand()}
          ${FOOTER_COLUMNS.map(renderFooterColumn).join("")}
          ${renderFooterContact()}
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
      <div class="footer-bottom mx-auto mt-10 flex max-w-6xl flex-col items-center gap-4">
        ${renderFooterBggAttribution()}
        <p class="text-center text-xs text-slate-400">LudoMind</p>
      </div>
    </div>
  `;
}

function initFooter() {
  renderFooter();

  document.getElementById("footer-back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
