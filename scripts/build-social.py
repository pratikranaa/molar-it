#!/usr/bin/env python3
"""Render one route-specific 1200x630 social card for each canonical page.

Run after the HTML builders have completed:

    python3 scripts/build-social.py

The source of truth is the rendered canonical HTML on disk. Cards use a small
local HTML/SVG document so the same Hanken font and paper/sage/coral identity
appears in every PNG. The PNGs receive source metadata for later auditing.
"""

from __future__ import annotations

import html
import re
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse

import struct
import zlib
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "social"
SITE_ORIGIN = "https://molar.it"
WIDTH, HEIGHT = 1200, 630


def html_text(value: str) -> str:
    value = re.sub(r"<script\b[^>]*>[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style\b[^>]*>[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def match_one(source: str, pattern: str) -> str:
    match = re.search(pattern, source, flags=re.I)
    return html_text(match.group(1)) if match else ""


def canonical_pages() -> list[dict[str, str]]:
    pages: dict[str, dict[str, str]] = {}
    for source_file in sorted(ROOT.rglob("*.html")):
        if ".site-dist" in source_file.parts or "node_modules" in source_file.parts:
            continue
        source = source_file.read_text(encoding="utf-8")
        if "/marketing/site.css" not in source:
            continue
        canonical = match_one(source, r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']')
        parsed = urlparse(canonical)
        if f"{parsed.scheme}://{parsed.netloc}" != SITE_ORIGIN:
            continue
        robots = match_one(source, r'<meta\s+name=["\']robots["\']\s+content=["\']([^"\']+)["\']')
        if re.search(r"\bnoindex\b", robots, flags=re.I):
            continue
        path = parsed.path.rstrip("/") or "/"
        record = {
            "path": path,
            "url": f"{SITE_ORIGIN}{path}",
            "title": match_one(source, r"<h1\b[^>]*>([\s\S]*?)</h1>")
            or match_one(source, r"<title>([\s\S]*?)</title>"),
            "source": str(source_file.relative_to(ROOT)),
        }
        # Duplicate clean/index artifacts resolve to one canonical card.
        if path not in pages or record["source"] < pages[path]["source"]:
            pages[path] = record
    return [pages[path] for path in sorted(pages)]


def route_filename(path: str) -> str:
    if path == "/":
        return "home.png"
    slug = re.sub(r"[^a-z0-9]+", "-", path.strip("/").lower()).strip("-")
    return f"{slug or 'home'}.png"


def route_label(path: str) -> str:
    if path == "/":
        return "MOLAR · AI QA FOR WEB APPS"
    parts = [part for part in path.split("/") if part]
    section = parts[0].replace("-", " ").upper()
    if section == "BLOG":
        return "MOLAR · FIELD NOTE"
    if section == "PRODUCTS":
        return "MOLAR · PRODUCT"
    if section == "SOLUTIONS":
        return "MOLAR · SOLUTION"
    if section == "PLATFORM":
        return "MOLAR · PLATFORM"
    if section == "DOCS":
        return "MOLAR · DOCUMENTATION"
    if section == "VS":
        return "MOLAR · COMPARISON"
    return f"MOLAR · {section}"


def wrapped_title(title: str) -> tuple[list[str], int]:
    title = re.sub(r"\s*\|\s*Molar\s*$", "", title, flags=re.I).strip()
    title = title or "Molar"
    # Keep the title within the left panel while adapting to long route names.
    for size, width in ((56, 25), (52, 27), (48, 29), (44, 32), (40, 36), (36, 40), (32, 46)):
        words = title.split()
        lines: list[str] = []
        line = ""
        for word in words:
            candidate = f"{line} {word}".strip()
            if line and len(candidate) > width:
                lines.append(line)
                line = word
            else:
                line = candidate
        if line:
            lines.append(line)
        if len(lines) * size * 1.05 <= 270:
            return lines, size
    return lines, 32


def card_html(route: dict[str, str]) -> str:
    lines, size = wrapped_title(route["title"])
    title_spans = "".join(f"<span>{html.escape(line)}</span>" for line in lines)
    path = html.escape(route["path"])
    label = html.escape(route_label(route["path"]))
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face {{ font-family: Hanken; src: url('file://{(ROOT / 'fonts' / 'hanken-grotesk-latin.woff2').as_posix()}') format('woff2'); font-weight: 100 900; }}
@font-face {{ font-family: Geist; src: url('file://{(ROOT / 'fonts' / 'geist-mono-latin.woff2').as_posix()}') format('woff2'); }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; width: 1200px; height: 630px; overflow: hidden; }}
body {{ background: #f7f8f2; color: #202b23; font-family: Hanken, sans-serif; }}
.card {{ width: 1200px; height: 630px; position: relative; overflow: hidden; padding: 58px 64px 46px; }}
.grain {{ position: absolute; inset: 0; opacity: .2; background: repeating-linear-gradient(0deg, transparent 0, transparent 3px, #cdd5c5 4px); pointer-events: none; }}
.brand {{ position: relative; z-index: 2; font-size: 31px; line-height: 1; letter-spacing: -.035em; font-weight: 560; }}
.brand i {{ color: #f26342; font-style: normal; }}
.label {{ position: relative; z-index: 2; margin-top: 74px; color: #22664c; font-family: Geist, monospace; font-size: 13px; letter-spacing: .12em; font-weight: 600; }}
.title {{ position: relative; z-index: 2; display: flex; flex-direction: column; margin-top: 110px; width: 600px; font-size: {size}px; line-height: 1.01; letter-spacing: -.035em; font-weight: 560; }}
.title span {{ display: block; }}
.path {{ position: absolute; z-index: 2; left: 64px; bottom: 48px; color: #56614f; font-family: Geist, monospace; font-size: 13px; letter-spacing: .03em; }}
.diagram {{ position: absolute; right: 0; top: 0; width: 540px; height: 630px; }}
</style></head><body><div class="card">
<div class="brand">Molar<i>.</i></div>

<div class="title">{title_spans}</div>
<div class="path">molar.it{path}</div>
<svg class="diagram" viewBox="0 0 540 630" fill="none" aria-hidden="true">
  <rect x="74" y="98" width="384" height="414" rx="20" fill="#e8eddf" stroke="#cdd5c5"/>
  <path d="M118 282H193C211 282 220 271 220 253V214H302" stroke="#cdd5c5" stroke-width="3"/>
  <path d="M302 214H384C407 214 418 227 418 250V282H447" stroke="#cdd5c5" stroke-width="3"/>
  <path d="M118 282H193C211 282 220 271 220 253V214H302M302 214H384C407 214 418 227 418 250V282H447" stroke="#f26342" stroke-width="4" stroke-linecap="round"/>
  <path d="M118 282H193C211 282 220 294 220 311V350H302M302 350H384C407 350 418 338 418 315V282H447" stroke="#cdd5c5" stroke-width="3"/>
  <circle cx="118" cy="282" r="13" fill="#22664c"/>
  <circle cx="302" cy="214" r="13" fill="#f26342"/>
  <circle cx="447" cy="282" r="13" fill="#202b23"/>
  <rect x="184" y="170" width="236" height="196" rx="12" fill="#f7f8f2" stroke="#cdd5c5"/>
  <rect x="184" y="170" width="236" height="30" rx="12" fill="#202b23"/>
  <circle cx="205" cy="185" r="4" fill="#f26342"/><circle cx="219" cy="185" r="4" fill="#cdd5c5"/><circle cx="233" cy="185" r="4" fill="#cdd5c5"/>
  <path d="M208 237H332M208 259H366M208 281H307M208 320H350" stroke="#cdd5c5" stroke-width="8" stroke-linecap="round"/>
  <path d="M208 237H294" stroke="#22664c" stroke-width="8" stroke-linecap="round"/>
  <rect x="74" y="536" width="112" height="5" rx="2.5" fill="#f26342"/><rect x="194" y="536" width="264" height="5" rx="2.5" fill="#cdd5c5"/>
</svg></div></body></html>"""


def add_png_metadata(png_bytes: bytes, route: dict[str, str], destination: Path) -> None:
    metadata = {"CanonicalURL": route["url"], "SourceHTML": route["source"], "Title": route["title"], "NativePNGOrigin": "Playwright screenshot of local HTML/SVG"}
    chunks = b""
    for key, value in metadata.items():
        data = key.encode("latin1") + b"\0\0\0\0\0" + value.encode("utf-8")
        kind = b"iTXt"
        chunks += struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)
    destination.write_bytes(png_bytes[:-12] + chunks + png_bytes[-12:])


def main() -> int:
    pages = canonical_pages()
    if not pages:
        print("No indexable canonical HTML pages found.", file=sys.stderr)
        return 1
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for old in OUTPUT.glob("*.png"):
        old.unlink()
    with tempfile.TemporaryDirectory(prefix="molar-social-") as temp_dir, sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT}, device_scale_factor=1)
        for route in pages:
            source = Path(temp_dir) / "card.html"
            source.write_text(card_html(route), encoding="utf-8")
            page.goto(source.as_uri(), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            png = page.screenshot(type="png", animations="disabled")
            add_png_metadata(png, route, OUTPUT / route_filename(route["path"]))
        browser.close()
    print(f"Rendered {len(pages)} route-specific social cards in {OUTPUT.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
