/**
 * React custom hook for live BGG cover image fetching.
 *
 * Usage:
 *   import { useBggImage } from "./useBggImage.js";
 *   const { imageUrl, loading, error } = useBggImage(game.bggId);
 *
 * Requires React 18+. For vanilla JS, use fetchBggImageUrl from bggApi.js.
 */

import { useEffect, useState } from "react";
import { fetchBggImageUrl } from "./bggApi.js";

/**
 * @param {string | number | null | undefined} bggId
 * @param {{ token?: string }} [options]
 * @returns {{ imageUrl: string | null, loading: boolean, error: Error | null }}
 */
export function useBggImage(bggId, options = {}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(Boolean(bggId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bggId) {
      setImageUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchBggImageUrl(bggId, { ...options, signal: controller.signal })
      .then((url) => {
        if (!cancelled) {
          setImageUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          setError(err);
          setImageUrl(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [bggId, options.token]);

  return { imageUrl, loading, error };
}
