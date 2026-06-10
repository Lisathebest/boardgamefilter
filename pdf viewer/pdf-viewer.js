const PDF_PATH = "../assets/Final_Board_Game_Report_V3.pdf";
const RENDER_SCALE = 1.35;

const params = new URLSearchParams(window.location.search);
const searchQuery = (params.get("search") || params.get("q") || "").trim();
const pageHint = Number.parseInt(params.get("page") || "", 10);

const viewer = document.getElementById("pdf-viewer");
const statusEl = document.getElementById("pdf-viewer-status");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function groupItemsIntoLines(items) {
  const lines = [];
  const tolerance = 2;

  for (const item of items) {
    const text = item.str.trim();
    if (!text) continue;

    const y = item.transform[5];
    let line = lines.find((entry) => Math.abs(entry.y - y) <= tolerance);

    if (!line) {
      line = { y, parts: [] };
      lines.push(line);
    }

    line.parts.push(item);
  }

  lines.sort((a, b) => b.y - a.y);

  return lines.map((line) => {
    line.parts.sort((a, b) => a.transform[4] - b.transform[4]);
    return {
      y: line.y,
      text: line.parts.map((part) => part.str).join("").trim(),
      parts: line.parts,
    };
  });
}

function getLineBounds(line, viewport) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const part of line.parts) {
    const [x1, y1] = viewport.convertToViewportPoint(part.transform[4], part.transform[5]);
    const width = part.width * viewport.scale;
    const height = part.height * viewport.scale;
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1 - height);
    maxX = Math.max(maxX, x1 + width);
    maxY = Math.max(maxY, y1);
  }

  return { minX, minY, maxX, maxY };
}

async function findSearchMatch(pdfDoc, query) {
  const target = normalizeText(query);
  const pageOrder = [];

  if (Number.isFinite(pageHint) && pageHint >= 1 && pageHint <= pdfDoc.numPages) {
    pageOrder.push(pageHint);
  }

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum += 1) {
    if (!pageOrder.includes(pageNum)) pageOrder.push(pageNum);
  }

  for (const pageNum of pageOrder) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = groupItemsIntoLines(content.items);

    for (const line of lines) {
      if (normalizeText(line.text) === target) {
        return { pageNum, line };
      }
    }
  }

  for (const pageNum of pageOrder) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = groupItemsIntoLines(content.items);

    for (const line of lines) {
      if (normalizeText(line.text).includes(target)) {
        return { pageNum, line };
      }
    }
  }

  return null;
}

async function renderPage(pdfDoc, pageNum, container, matchLine) {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: RENDER_SCALE });
  const wrapper = document.createElement("section");
  wrapper.className = "pdf-viewer__page";
  wrapper.dataset.page = String(pageNum);

  const canvas = document.createElement("canvas");
  canvas.className = "pdf-viewer__canvas";
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  wrapper.appendChild(canvas);

  await page.render({ canvasContext: context, viewport }).promise;

  if (matchLine) {
    const bounds = getLineBounds(matchLine, viewport);
    const highlight = document.createElement("span");
    highlight.className = "pdf-viewer__highlight";
    highlight.style.left = `${bounds.minX}px`;
    highlight.style.top = `${bounds.minY}px`;
    highlight.style.width = `${Math.max(bounds.maxX - bounds.minX, 8)}px`;
    highlight.style.height = `${Math.max(bounds.maxY - bounds.minY, 12)}px`;
    wrapper.appendChild(highlight);
  }

  container.replaceChildren(wrapper);
  return wrapper;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function scrollToMatch(matchSlot) {
  const page = matchSlot.querySelector(".pdf-viewer__page");
  const highlight = matchSlot.querySelector(".pdf-viewer__highlight");

  if (!page) {
    matchSlot.scrollIntoView({ behavior: "auto", block: "center" });
    return;
  }

  if (!highlight) {
    page.scrollIntoView({ behavior: "auto", block: "center" });
    return;
  }

  const pageRect = page.getBoundingClientRect();
  const highlightTop = Number.parseFloat(highlight.style.top) || 0;
  const highlightHeight = Number.parseFloat(highlight.style.height) || 0;
  const targetY =
    window.scrollY + pageRect.top + highlightTop + highlightHeight / 2 - window.innerHeight * 0.4;

  window.scrollTo({ top: Math.max(targetY, 0), behavior: "auto" });
}

async function init() {
  if (!searchQuery) {
    setStatus("No search text provided.");
    return;
  }

  document.title = `${searchQuery} — Game Guide`;

  try {
    const pdfDoc = await pdfjsLib.getDocument(PDF_PATH).promise;
    setStatus(`Searching for “${searchQuery}”…`);

    const match = await findSearchMatch(pdfDoc, searchQuery);

    if (!match) {
      setStatus(`Could not find “${searchQuery}” in the guide.`);
      return;
    }

    setStatus(`Found “${searchQuery}” on page ${match.pageNum}. Loading…`);

    const slots = [];
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum += 1) {
      const slot = document.createElement("div");
      slot.className = "pdf-viewer__slot";
      slot.dataset.page = String(pageNum);
      viewer.appendChild(slot);
      slots.push(slot);
    }

    // Render pages 1…target first so layout height is stable before scrolling.
    for (let pageNum = 1; pageNum <= match.pageNum; pageNum += 1) {
      await renderPage(
        pdfDoc,
        pageNum,
        slots[pageNum - 1],
        pageNum === match.pageNum ? match.line : null
      );
    }

    scrollToMatch(slots[match.pageNum - 1]);
    setStatus(`Found “${searchQuery}” on page ${match.pageNum}.`);

    for (let pageNum = match.pageNum + 1; pageNum <= pdfDoc.numPages; pageNum += 1) {
      await renderPage(pdfDoc, pageNum, slots[pageNum - 1], null);
    }
  } catch (error) {
    console.error(error);
    setStatus("Could not load the game guide PDF.");
  }
}

init();
