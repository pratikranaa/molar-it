import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("./", import.meta.url);
const routes = [
  ["home", "index.html", "Molar Evidence"],
  ["platform", "platform/index.html", "Molar Platform"],
  ["swarm", "swarm/index.html", "Molar Swarm"],
  ["integrations", "integrations/index.html", "Molar Integrations"],
  ["coding-agents", "coding-agents/index.html", "Molar for Coding Agents"],
  ["qa-teams", "qa-teams/index.html", "Molar for QA Teams"],
  ["security", "security/index.html", "Molar Security"],
  ["pricing", "pricing/index.html", "Molar Pricing"],
  ["docs", "docs/index.html", "Molar Docs"],
  ["about", "about/index.html", "About Molar"],
  ["contact", "contact/index.html", "Contact Molar"],
];
const brandAssets = [
  "observer.svg",
  "living-loop.svg",
  "scout.svg",
  "portal.svg",
  "monogram.svg",
  "sentinel.svg",
  "molar-lockup.svg",
  "favicon.svg",
];
const read = (path) => readFile(new URL(path, root), "utf8");

test("all approved routes ship unique metadata and noindex", async () => {
  const titles = new Set();
  const headings = new Set();
  for (const [name, path, titlePrefix] of routes) {
    const html = await read(path);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
      .replace(/<[^>]+>/g, "")
      .trim();
    assert.ok(title?.startsWith(titlePrefix), `${name} title`);
    assert.equal(titles.has(title), false, `${name} unique title`);
    titles.add(title);
    assert.ok(heading, `${name} heading`);
    assert.equal(headings.has(heading), false, `${name} unique heading`);
    headings.add(heading);
    assert.match(html, /<meta name="description" content="[^"]+">/);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(html, /<main id="main-content">/);
    assert.match(html, /class="skip-link"/);
  }
});

test("every detail route exposes the shared buyer journey", async () => {
  for (const [, path] of routes.slice(1)) {
    const html = await read(path);
    for (const href of [
      "../platform/",
      "../swarm/",
      "../integrations/",
      "../coding-agents/",
      "../qa-teams/",
      "../pricing/",
      "../contact/",
    ]) {
      assert.match(html, new RegExp(`href="${href.replaceAll("/", "\\/")}"`));
    }
    assert.match(html, /href="https:\/\/app\.molar\.it"/);
  }
});

test("the approved logo family ships as clean local SVG", async () => {
  for (const name of brandAssets) {
    const path = `assets/brand/${name}`;
    await access(new URL(path, root));
    const svg = await read(path);
    const withoutNamespace = svg.replace(
      'xmlns="http://www.w3.org/2000/svg"',
      "",
    );
    assert.match(svg, /^<svg[\s>]/);
    assert.equal(
      /<image|linearGradient|radialGradient|https?:\/\//.test(withoutNamespace),
      false,
      path,
    );
    assert.match(svg, /#1c1c1c|currentColor/);
  }
});

test("shared detail assets provide type and resilience contracts", async () => {
  const css = await read("pages.css");
  assert.match(css, /--page-hero:/);
  assert.match(css, /--section-display:/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("approved plan amounts appear only on the pricing route", async () => {
  const home = await read("index.html");
  assert.equal(/\$99|\$399|\$948|\$3,828/.test(home), false);

  const pricing = await read("pricing/index.html");
  for (const amount of ["$99", "$399", "$948", "$3,828"]) {
    assert.match(pricing, new RegExp(amount.replace("$", "\\$")));
  }
});
