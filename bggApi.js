const BGG_API_BASE = "https://boardgamegeek.com/xmlapi2";
const imageCache = new Map();

/**
 * Parse a BGG XML API2 <thing> response and extract cover image URLs.
 * Prefers <image> over <thumbnail> when both are present.
 *
 * @param {string} xmlText - Raw XML from /thing?id=
 * @returns {{ image: string | null, thumbnail: string | null }}
 */
export function parseBggThingXml(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");

  if (doc.querySelector("parsererror")) {
    throw new Error("Failed to parse BGG XML response");
  }

  const item = doc.querySelector("item");
  if (!item) {
    return { image: null, thumbnail: null };
  }

  const image = item.querySelector("image")?.textContent?.trim() || null;
  const thumbnail = item.querySelector("thumbnail")?.textContent?.trim() || null;

  return { image, thumbnail };
}

/**
 * Fetch board game metadata from the BGG XML API2.
 *
 * BGG requires a Bearer token as of July 2025. Pass `token` via options or
 * set `window.BGG_API_TOKEN` before calling (e.g. from a server-injected config).
 * Do not commit tokens to source control.
 *
 * @param {string | number} bggId
 * @param {{ token?: string, signal?: AbortSignal }} [options]
 * @returns {Promise<{ image: string | null, thumbnail: string | null, imageUrl: string | null }>}
 */
export async function fetchBggThing(bggId, options = {}) {
  const id = String(bggId);
  const cached = imageCache.get(id);
  if (cached) return cached;

  const token = options.token ?? (typeof window !== "undefined" ? window.BGG_API_TOKEN : undefined);
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${BGG_API_BASE}/thing?id=${encodeURIComponent(id)}`, {
    headers,
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`BGG API error: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();
  const { image, thumbnail } = parseBggThingXml(xmlText);
  const imageUrl = image || thumbnail || null;

  const result = { image, thumbnail, imageUrl };
  if (imageUrl) imageCache.set(id, result);

  return result;
}

/**
 * Convenience helper — returns the best available cover URL for a bggId.
 *
 * @param {string | number} bggId
 * @param {{ token?: string, signal?: AbortSignal }} [options]
 * @returns {Promise<string | null>}
 */
export async function fetchBggImageUrl(bggId, options = {}) {
  const { imageUrl } = await fetchBggThing(bggId, options);
  return imageUrl;
}

/**
 * Preload cover images for a list of games. Failures are swallowed per game.
 *
 * @param {Array<{ bggId?: string | number }>} games
 * @param {{ token?: string }} [options]
 * @returns {Promise<Map<string, string>>}
 */
export async function preloadBggImages(games, options = {}) {
  const results = new Map();

  await Promise.all(
    games.map(async (game) => {
      if (!game.bggId) return;
      const id = String(game.bggId);
      try {
        const url = await fetchBggImageUrl(id, options);
        if (url) results.set(id, url);
      } catch {
        // Individual fetch failures fall back to emoji in the UI.
      }
    })
  );

  return results;
}
