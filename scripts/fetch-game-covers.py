#!/usr/bin/env python3
"""Download board game cover images for LudoMind game cards."""

from __future__ import annotations

import http.client
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAMES_DATA = ROOT / "gamesData.js"
COVERS_DIR = ROOT / "assets" / "covers"
COVERS_JS = ROOT / "gameCovers.js"
REPORT_PATH = ROOT / "scripts" / "cover-fetch-report.json"

GEEKDO_API = "https://api.geekdo.com/api/geekitems?objectid={bgg_id}&objecttype=thing&nosession=1"

# Direct image URLs for games not on BGG or without reliable BGG entries.
MANUAL_IMAGE_URLS = {
    "24-hour-doctor": "https://www.zhiyanjia.com/wp-content/uploads/2023/05/IMG_5287.jpg",
    "cake-stack": "https://i.ebayimg.com/images/g/SEkAAOSwN3Bmq9G9/s-l500.jpg",
}

USER_AGENT = "LudoMindCoverBot/1.0 (+https://github.com/ludomind)"


def parse_games() -> list[dict]:
    content = GAMES_DATA.read_text(encoding="utf-8")
    games = []
    for block in re.findall(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", content):
        id_match = re.search(r'"id":\s*"([^"]+)"', block)
        name_match = re.search(r'"name":\s*"([^"]+)"', block)
        bgg_match = re.search(r'"bggId":\s*"([^"]*)"', block)
        if not id_match or not name_match:
            continue
        games.append(
            {
                "id": id_match.group(1),
                "name": name_match.group(1),
                "bggId": bgg_match.group(1) if bgg_match else "",
            }
        )
    return games


def fetch_json(url: str) -> dict | None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            return json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, json.JSONDecodeError, TimeoutError, OSError, http.client.IncompleteRead):
        return None


def pick_image_url(item: dict) -> str | None:
    if item.get("imageurl"):
        return item["imageurl"]
    image_sets = item.get("imageSets") or {}
    for key in ("itemrep", "mediacard", "square100"):
        entry = image_sets.get(key)
        if isinstance(entry, dict) and entry.get("src"):
            return entry["src"]
    return (item.get("images") or {}).get("thumb")


def fetch_bgg_image_url(bgg_id: str) -> str | None:
    payload = fetch_json(GEEKDO_API.format(bgg_id=bgg_id))
    if not payload:
        return None
    item = payload.get("item") or {}
    return pick_image_url(item)


def scrape_og_image(url: str) -> str | None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            html = response.read().decode("utf-8", errors="ignore")
    except (urllib.error.URLError, TimeoutError, OSError, http.client.IncompleteRead):
        return None

    for pattern in (
        r'property="og:image"\s+content="([^"]+)"',
        r'content="([^"]+)"\s+property="og:image"',
        r'<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"',
    ):
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            return match.group(1)
    return None


def download_image(url: str, dest: Path) -> bool:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read()
    except (urllib.error.URLError, TimeoutError, OSError, http.client.IncompleteRead):
        return False

    if len(data) < 500:
        return False

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return True


def resolve_image_url(game: dict) -> tuple[str | None, str]:
    game_id = game["id"]

    if game_id in MANUAL_IMAGE_URLS:
        return MANUAL_IMAGE_URLS[game_id], "manual"

    bgg_id = game.get("bggId") or ""
    if bgg_id:
        image_url = fetch_bgg_image_url(bgg_id)
        if image_url:
            return image_url, f"bgg:{bgg_id}"
        return None, f"bgg:{bgg_id}"

    link_match = re.search(
        rf'"id":\s*"{re.escape(game_id)}"[\s\S]*?"link":\s*"([^"]+)"',
        GAMES_DATA.read_text(encoding="utf-8"),
    )
    if link_match:
        og_image = scrape_og_image(link_match.group(1))
        if og_image:
            return og_image, "link-og"

    return None, "none"


def write_covers_js(game_ids: list[str]) -> dict[str, str]:
    covers: dict[str, str] = {}
    for game_id in game_ids:
        dest = COVERS_DIR / f"{game_id}.jpg"
        if dest.exists() and dest.stat().st_size > 500:
            covers[game_id] = f"assets/covers/{game_id}.jpg"

    lines = ["const GAME_COVERS = {"]
    for game_id in sorted(covers):
        lines.append(f'  "{game_id}": "{covers[game_id]}",')
    lines.append("};")
    COVERS_JS.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return covers


def main() -> None:
    force_all = "--force" in sys.argv
    games = parse_games()
    report = {"found": [], "missing": []}

    for index, game in enumerate(games):
        game_id = game["id"]
        dest = COVERS_DIR / f"{game_id}.jpg"
        cover_path = f"assets/covers/{game_id}.jpg"

        if (
            not force_all
            and dest.exists()
            and dest.stat().st_size > 500
        ):
            report["found"].append({"id": game_id, "name": game["name"], "source": "cached"})
            print(f"[cached] {game_id}")
            continue

        image_url, source = resolve_image_url(game)

        if image_url and download_image(image_url, dest):
            report["found"].append(
                {"id": game_id, "name": game["name"], "source": source, "url": image_url}
            )
            print(f"[ok] {game_id} <- {source}")
        else:
            report["missing"].append(
                {"id": game_id, "name": game["name"], "source": source}
            )
            print(f"[miss] {game_id} ({game['name']})")

        if index < len(games) - 1:
            time.sleep(0.35)

    covers = write_covers_js([g["id"] for g in games])
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nCovers on disk: {len(covers)} / {len(games)}")
    print(f"Report: {REPORT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
