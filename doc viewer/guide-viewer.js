const GUIDE_PATH = "../assets/guide.html";

const params = new URLSearchParams(window.location.search);
const searchQuery = (params.get("search") || params.get("q") || "").trim();
const sectionHint = Number.parseInt(
  params.get("page") || params.get("section") || "",
  10
);

const viewer = document.getElementById("guide-viewer");
const statusEl = document.getElementById("guide-viewer-status");

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionIdFromTitle(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `guide-${slug}` : "";
}

function setStatus(message) {
  statusEl.textContent = message;
}

function getSectionTitles(root) {
  return [...root.querySelectorAll("h2[id^='guide-'], h2")];
}

function findSectionTitle(root, query) {
  const target = normalizeText(query);
  const titles = getSectionTitles(root);
  if (!titles.length || !target) return null;

  const byId = root.querySelector(`#${sectionIdFromTitle(query)}`);
  if (byId) return byId;

  const exact = titles.find((title) => normalizeText(title.textContent) === target);
  if (exact) return exact;

  const partial = titles.find((title) => {
    const text = normalizeText(title.textContent);
    return text.includes(target) || target.includes(text);
  });
  if (partial) return partial;

  if (Number.isFinite(sectionHint) && sectionHint >= 1 && sectionHint <= titles.length) {
    return titles[sectionHint - 1];
  }

  return null;
}

function imagesBeforeElement(element, root) {
  const images = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node === element) break;
    if (node.tagName === "IMG") images.push(node);
  }

  return images;
}

function waitForImage(img) {
  if (img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

async function scrollToTitle(titleEl, root) {
  titleEl.classList.add("game-guide__title--match");

  const pending = imagesBeforeElement(titleEl, root).filter((img) => !img.complete);
  const scroll = () => titleEl.scrollIntoView({ behavior: "auto", block: "start" });

  scroll();

  if (pending.length) {
    setStatus(`Loading “${titleEl.textContent.trim()}”…`);
    await Promise.race([
      Promise.all(pending.map(waitForImage)),
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ]);
  }

  scroll();
  requestAnimationFrame(scroll);
}

async function loadGuideArticle() {
  const response = await fetch(GUIDE_PATH, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Guide fetch failed (${response.status})`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const article = doc.querySelector(".game-guide__doc") || doc.body;

  if (!article) {
    throw new Error("Guide HTML is missing .game-guide__doc");
  }

  return article.cloneNode(true);
}

async function init() {
  if (!searchQuery) {
    setStatus("No game title provided.");
    return;
  }

  document.title = `${searchQuery} — Game Guide`;

  try {
    setStatus("Loading guide…");
    const article = await loadGuideArticle();
    viewer.replaceChildren(article);

    const titleEl = findSectionTitle(article, searchQuery);
    if (!titleEl) {
      setStatus(`Could not find “${searchQuery}” in the guide.`);
      return;
    }

    await scrollToTitle(titleEl, article);
    setStatus(`“${titleEl.textContent.trim()}”`);
  } catch (error) {
    console.error(error);
    setStatus(
      String(error.message || "").includes("404")
        ? "Guide not built yet. Run: python3 scripts/build-guide-html.py"
        : "Could not load the game guide."
    );
  }
}

init();
