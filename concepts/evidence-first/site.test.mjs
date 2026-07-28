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

test("platform, about, and docs explain the evidence system", async () => {
  const platform = await read("platform/index.html");
  for (const name of ["Cartographer", "Guard", "Clones", "Trace", "Plumbing"]) {
    assert.match(platform, new RegExp(name));
  }
  assert.match(platform, /one verified run/i);
  assert.match(platform, /Limited/);

  const about = await read("about/index.html");
  assert.match(about, /Evidence should outlive the run/);
  assert.match(about, /uncertainty/i);

  const docs = await read("docs/index.html");
  for (const task of ["First verification", "CLI", "MCP", "Scenarios", "Traces"]) {
    assert.match(docs, new RegExp(task));
  }
  assert.match(docs, /https:\/\/docs\.molar\.it/);
});

test("swarm exposes personas, budgets, and honest coverage states", async () => {
  const html = await read("swarm/index.html");
  for (const copy of [
    "One goal. Several isolated points of view.",
    "New customer",
    "Returning buyer",
    "Workspace admin",
    "Read-only member",
    "Passed",
    "Denied as expected",
    "Skipped",
    "Uncertain",
    "Safety budget",
    "Current",
    "Limited",
    "Proposed",
  ]) {
    assert.match(html, new RegExp(copy));
  }
  assert.equal(/tests every corner|100% coverage/i.test(html), false);
});

test("integrations explain controlled cross-system verification", async () => {
  const html = await read("integrations/index.html");
  for (const copy of [
    "Test the system around your product.",
    "Payment",
    "OTP",
    "Permissions",
    "Webhook",
    "Files",
    "eventual consistency",
    "deliberate failure",
    "What Molar controls",
    "What Molar observes",
    "What Molar verifies",
    "Deployment-dependent",
  ]) {
    assert.match(html, new RegExp(copy, "i"));
  }
  assert.match(html, /Coverage depends on the configured environment/);
});

test("audience routes show distinct workflows and availability", async () => {
  const agents = await read("coding-agents/index.html");
  for (const copy of [
    "Give your coding agent a real release check.",
    "molar verify",
    "MCP",
    "error.hint",
    "fix",
    "re-verify",
    "Current",
    "Limited",
  ]) {
    assert.match(agents, new RegExp(copy, "i"));
  }

  const qa = await read("qa-teams/index.html");
  for (const copy of [
    "A QA teammate that leaves receipts.",
    "plain-English",
    "pull request",
    "scheduled",
    "Playwright",
    "adjudication",
    "Deployment-dependent",
  ]) {
    assert.match(qa, new RegExp(copy, "i"));
  }
});

test("security explains controls without unsupported certification claims", async () => {
  const html = await read("security/index.html");
  for (const copy of [
    "Verification within explicit boundaries.",
    "Credentials",
    "Action approval",
    "Tenant",
    "Retention",
    "Redaction",
    "Audit",
    "Current",
    "Limited",
    "Deployment-dependent",
  ]) {
    assert.match(html, new RegExp(copy, "i"));
  }
  assert.equal(/SOC 2 certified|HIPAA compliant|zero trust certified/i.test(html), false);
});
