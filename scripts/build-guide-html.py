#!/usr/bin/env python3
"""Build a lightweight HTML guide from the Word document (run after editing the .docx)."""

from __future__ import annotations

import html
import re
import shutil
import struct
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOCX_PATH = ROOT / "assets" / "Final_Board_Game_Report_V3.docx"
HTML_PATH = ROOT / "assets" / "guide.html"
MEDIA_DIR = ROOT / "assets" / "guide-media"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"


def load_relationships(archive: zipfile.ZipFile) -> dict[str, str]:
    rels_root = ET.fromstring(archive.read("word/_rels/document.xml.rels"))
    relationships: dict[str, str] = {}
    for rel in rels_root:
        rel_id = rel.get("Id")
        target = rel.get("Target")
        if rel_id and target:
            relationships[rel_id] = target
    return relationships


def paragraph_style(paragraph: ET.Element) -> str:
    props = paragraph.find(f"{{{W_NS}}}pPr")
    if props is None:
        return ""
    style = props.find(f"{{{W_NS}}}pStyle")
    if style is None:
        return ""
    return style.get(f"{{{W_NS}}}val") or ""


def paragraph_text(paragraph: ET.Element) -> str:
    return "".join(node.text or "" for node in paragraph.findall(f".//{{{W_NS}}}t")).strip()


def paragraph_images(paragraph: ET.Element, relationships: dict[str, str]) -> list[str]:
    paths: list[str] = []
    for blip in paragraph.findall(f".//{{{A_NS}}}blip"):
        rel_id = blip.get(f"{{{R_NS}}}embed")
        if not rel_id:
            continue
        target = relationships.get(rel_id, "")
        if target.startswith("media/"):
            paths.append(target.replace("media/", "", 1))
    return paths


TITLE_STYLES = {"Heading1", "2"}
SUBTITLE_STYLES = {"Heading2", "3"}
REPORT_TITLE_STYLES = {"Title", "5"}


def tag_for_style(style: str) -> str:
    if style in TITLE_STYLES:
        return "h2"
    if style in SUBTITLE_STYLES:
        return "h3"
    return "p"


def section_id(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return f"guide-{slug}" if slug else "guide-section"


def image_dimensions(path: Path) -> tuple[int, int] | None:
    data = path.read_bytes()
    if data.startswith(b"\x89PNG\r\n\x1a\n") and len(data) >= 24:
        width, height = struct.unpack(">II", data[16:24])
        return width, height

    if data.startswith(b"\xff\xd8"):
        index = 2
        while index < len(data) - 8:
            if data[index] != 0xFF:
                break
            marker = data[index + 1]
            if marker in (
                0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF,
            ):
                height, width = struct.unpack(">HH", data[index + 5 : index + 9])
                return width, height
            length = struct.unpack(">H", data[index + 2 : index + 4])[0]
            index += 2 + length

    return None


def image_tag(image_name: str) -> str:
    src = f"../assets/guide-media/{html.escape(image_name, quote=True)}"
    dimensions = image_dimensions(MEDIA_DIR / image_name)
    if dimensions:
        width, height = dimensions
        return (
            f'<img src="{src}" alt="" width="{width}" height="{height}" '
            f'loading="lazy" decoding="async">'
        )
    return f'<img src="{src}" alt="" loading="lazy" decoding="async">'


def extract_media(archive: zipfile.ZipFile) -> None:
    if MEDIA_DIR.exists():
        shutil.rmtree(MEDIA_DIR)
    MEDIA_DIR.mkdir(parents=True)

    for name in archive.namelist():
        if not name.startswith("word/media/"):
            continue
        filename = name.split("/")[-1]
        if not filename:
            continue
        target = MEDIA_DIR / filename
        target.write_bytes(archive.read(name))


def build_html(archive: zipfile.ZipFile) -> str:
    root = ET.fromstring(archive.read("word/document.xml"))
    relationships = load_relationships(archive)
    chunks: list[str] = [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '<meta charset="UTF-8">',
        "<title>Board Game Collection Guide</title>",
        "</head>",
        "<body>",
        '<article class="game-guide__doc">',
    ]

    for paragraph in root.findall(f".//{{{W_NS}}}p"):
        text = paragraph_text(paragraph)
        images = paragraph_images(paragraph, relationships)
        if not text and not images:
            continue

        style = paragraph_style(paragraph)
        tag = tag_for_style(style)

        if style in REPORT_TITLE_STYLES and "Board Game Collection Report" in text:
            chunks.append(f'<h1 class="game-guide__report-title">{html.escape(text)}</h1>')
            continue

        if text:
            if tag == "h2":
                chunks.append(f'<h2 id="{section_id(text)}">{html.escape(text)}</h2>')
            elif tag == "p":
                chunks.append(f"<p>{html.escape(text)}</p>")
            else:
                chunks.append(f"<{tag}>{html.escape(text)}</{tag}>")

        for image_name in images:
            chunks.append(image_tag(image_name))

    chunks.extend(["</article>", "</body>", "</html>"])
    return "\n".join(chunks)


def main() -> int:
    if not DOCX_PATH.exists():
        print(f"Missing Word guide: {DOCX_PATH}", file=sys.stderr)
        return 1

    with zipfile.ZipFile(DOCX_PATH) as archive:
        print("Extracting images…")
        extract_media(archive)
        print("Building HTML…")
        html_content = build_html(archive)

    HTML_PATH.write_text(html_content, encoding="utf-8")
    print(f"Wrote {HTML_PATH.relative_to(ROOT)} ({HTML_PATH.stat().st_size // 1024} KB)")
    print(f"Media folder: {MEDIA_DIR.relative_to(ROOT)} ({len(list(MEDIA_DIR.glob('*')))} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
