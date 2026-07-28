import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";

const root = new URL("./", import.meta.url);
const read = (name) => readFile(new URL(name, root), "utf8");
const digest = (text) => createHash("sha256").update(text).digest("hex");

test("page ships the complete evidence-first narrative", async () => {
  const html = await read("index.html");
  for (const copy of [
    "The browser agent that",
    "proves your software works.",
    "Send a QA team, not a single happy-path bot.",
    "Test the parts ordinary suites are afraid to touch.",
    "Evidence for your team, structured results for your agent.",
    "Give every release evidence that compounds.",
  ]) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const id of ["how", "evidence", "swarm", "integrations", "plans", "faq"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("primary actions point to the live Molar app", async () => {
  const html = await read("index.html");
  const actions = [...html.matchAll(/<a[^>]+data-primary-cta[^>]+href="([^"]+)"/g)];
  assert.ok(actions.length >= 3);
  assert.ok(actions.every((match) => match[1] === "https://app.molar.it"));
});

test("page exposes keyboard and screen-reader contracts", async () => {
  const html = await read("index.html");
  assert.match(
    html,
    /<link rel="icon" href="\.\/assets\/brand\/favicon\.svg" type="image\/svg\+xml">/,
  );
  assert.match(html, /<button[^>]+data-menu-toggle[^>]+aria-expanded="false"/);
  assert.match(html, /<nav[^>]+data-mobile-menu[^>]+aria-label="Mobile"/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<details class="faq-item">/);
  assert.match(html, /aria-live="polite"[^>]+data-copy-status/);
  assert.match(html, /class="skip-link"/);
});

test("copy stays inside the approved truth boundary", async () => {
  const html = (await read("index.html")).toLowerCase();
  for (const forbidden of [
    "tests every corner",
    "tests everything",
    "100% coverage",
    "zero bugs",
    "10,000 runs",
    "thousands of browsers",
  ]) {
    assert.equal(html.includes(forbidden), false, `forbidden claim: ${forbidden}`);
  }
  assert.match(
    html,
    /what it covered, what failed, what was denied, what it skipped, and where uncertainty remains/,
  );
  assert.match(html, /proposed swarm experience/);
});

test("visual and interaction files contain required safeguards", async () => {
  const [css, js] = await Promise.all([read("concept.css"), read("concept.js")]);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(css, /--font-sans:\s*"Host Grotesk"/);
  assert.match(css, /--font-serif:\s*"Aleo"/);
  assert.match(css, /--font-mono:\s*"Azeret Mono"/);
  assert.match(css, /\.browser-body,\s*\n\s*\.receipt-step-rail,\s*\n\s*\.receipt-result\s*\{\s*\n\s*min-width:\s*0;/);
  assert.match(css, /\.copy-button\s*\{\s*\n\s*min-height:\s*44px;/);
  assert.match(css, /\.menu-toggle\s*\{\s*\n\s*min-height:\s*44px;/);
  assert.match(js, /data-menu-toggle/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /prefers-reduced-motion/);
});

test("the current homepage remains byte-for-byte untouched", async () => {
  const homeJsx = await readFile(new URL("../../home.jsx", root), "utf8");
  const homeCss = await readFile(new URL("../../home.css", root), "utf8");
  assert.equal(
    digest(homeJsx),
    "ea90e5aa8cb57591692635ebb5ed96b64db96815e52212b8ac982f26d2c3f361",
  );
  assert.equal(
    digest(homeCss),
    "f454b6956ecb46828a2f2f02893b49182853e4572343b650a5f54517e740d27d",
  );
});
