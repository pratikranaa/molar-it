import test, { after, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { chromium } from "../film/node_modules/playwright/index.mjs";
import { onRequest } from "../functions/api/instant-proof/[[path]].js";

const ROOT = new URL("..", import.meta.url);
const PROOF_ID = "11111111-1111-4111-8111-111111111111";
const PROOF_TOKEN = "molar_proof_test_token_123456789012345";
const SHARE_TOKEN = "molar_share_test_token_1234567890123456789012345678";

let server;
let baseUrl;
let browser;
let currentPage;
let reactSource;
let reactDomSource;

before(async () => {
  server = createServer(async (request, response) => {
    const file = request.url?.split("?", 1)[0];
    if (file === "/csp-check") {
      const policy = (await readFile(new URL("_headers", ROOT), "utf8")).match(/Content-Security-Policy: (.+)/)[1];
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("Content-Security-Policy", policy);
      response.end('<script src="https://static.cloudflareinsights.com/beacon.min.js/test-version"></script><script src="https://untrusted.example.test/script.js"></script>');
      return;
    }
    if (file === "/verify.html" || file === "/verify") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(await readFile(new URL("verify.html", ROOT)));
      return;
    }
    if (file === "/verify.js") {
      response.setHeader("Content-Type", "application/javascript; charset=utf-8");
      response.end(await readFile(new URL("verify.js", ROOT)));
      return;
    }
    response.statusCode = 404;
    response.end("not found");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
  reactSource = await (await fetch("https://unpkg.com/react@18.3.1/umd/react.production.min.js")).text();
  reactDomSource = await (await fetch("https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js")).text();
  browser = await chromium.launch({ headless: true });
});

beforeEach(async (t) => {
  currentPage = await browser.newPage();
  await currentPage.route("https://unpkg.com/react@18.3.1/umd/react.production.min.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: reactSource }),
  );
  await currentPage.route("https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: reactDomSource }),
  );
  await currentPage.goto(`${baseUrl}/verify.html`, { waitUntil: "domcontentloaded", timeout: 5000 });
  await currentPage.waitForSelector("#instant-proof");
  t.after(async () => currentPage?.close());
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => server?.close(resolve));
});

function proofStart() {
  return {
    proof_id: PROOF_ID,
    proof_token: PROOF_TOKEN,
    status: "running",
    expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
  };
}

function statusBody(status, extra = {}) {
  return {
    proof_id: PROOF_ID,
    status,
    result:
      status === "completed"
        ? { pass: true, rationale: "The target displayed the requested outcome.", trace_id: "trace-test", steps_used: 8 }
        : undefined,
    ...extra,
  };
}

test("renders a final frame before showing the terminal verdict", async (t) => {
  const page = currentPage;
  assert.equal(await page.locator("#instant-proof form").getAttribute("action"), "/verify");
  assert.equal(await page.locator("#instant-proof form").getAttribute("method"), "post");
  assert.equal(await page.getByLabel("Public URL", { exact: true }).inputValue(), "https://example.com");
  assert.equal(await page.getByLabel("What should be on the page?").inputValue(), "The page has a heading called Example Domain.");
  let statusCalls = 0;
  let frameRequest;
  await page.route("**/*", async (route) => {
    if (!route.request().url().includes("/api/instant-proof")) return route.continue();
    if (route.request().method() === "POST") return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify(proofStart()) });
    if (route.request().url().includes("/frame")) {
      frameRequest = route.request().url();
      return route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    statusCalls += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(statusBody("completed")) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.locator(".verdict").waitFor();
  await page.getByAltText("Latest screenshot from the browser check").waitFor();
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "completed");
  assert.equal(statusCalls, 1);
  assert.match(frameRequest, /[?&]step=7(?:&|$)/);
  assert.match(await page.locator(".verdict").innerText(), /Verified/);
});

test("production CSP loads the injected analytics beacon and blocks unrelated scripts", async () => {
  const page = currentPage;
  await page.route("https://static.cloudflareinsights.com/**", route => route.fulfill({ contentType: "application/javascript", body: "window.beaconLoaded=true" }));
  await page.route("https://untrusted.example.test/**", route => route.fulfill({ contentType: "application/javascript", body: "window.untrustedLoaded=true" }));
  await page.goto(`${baseUrl}/csp-check`);
  assert.equal(await page.evaluate(() => window.beaconLoaded), true);
  assert.notEqual(await page.evaluate(() => window.untrustedLoaded), true);
});

test("shows the first captured frame while status has no frame count", async () => {
  const page = currentPage;
  let frameStep;
  await page.route("**/api/instant-proof**", async route => {
    const request = route.request();
    if (request.method() === "POST") return route.fulfill({ status: 202, json: proofStart() });
    if (request.url().includes("/frame")) {
      frameStep = new URL(request.url()).searchParams.get("step");
      return route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    return route.fulfill({ json: { proof_id: PROOF_ID, status: "running", result: null, links: {} } });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.waitForFunction(() => document.querySelector(".frame img")?.naturalWidth > 0);
  assert.equal(frameStep, "0");
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "running");
  assert.equal(await page.locator(".verdict").count(), 0);
});

test("shares the real shared-view route when the API returns only a token", async (t) => {
  const page = currentPage;
  let sharedFrameStep;
  await page.evaluate(() => {
    window.__sharedUrl = "";
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async ({ url }) => { window.__sharedUrl = url; },
    });
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (!request.url().includes("/api/instant-proof")) return route.continue();
    if (request.method() === "POST" && request.url().endsWith("/api/instant-proof")) {
      return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify(proofStart()) });
    }
    if (request.method() === "POST" && request.url().includes("/share")) {
      sharedFrameStep = request.postDataJSON().frame_step;
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ share_token: SHARE_TOKEN, expires_at: new Date(Date.now() + 60_000).toISOString() }),
      });
    }
    if (request.url().includes("/frame")) {
      return route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(statusBody("completed")) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("button", { name: "Share result" }).waitFor();
  await page.getByRole("button", { name: "Share result" }).click();
  await page.getByRole("button", { name: "Link ready" }).waitFor();
  const sharedUrl = await page.evaluate(() => window.__sharedUrl);
  assert.equal(sharedFrameStep, 7);
  assert.match(sharedUrl, new RegExp(`/verify#${encodeURIComponent(SHARE_TOKEN)}$`));
  assert.doesNotMatch(sharedUrl, /#shared$/);
});

test("does not claim sharing succeeded when no delivery channel exists", async (t) => {
  const page = currentPage;
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (!request.url().includes("/api/instant-proof")) return route.continue();
    if (request.method() === "POST" && request.url().endsWith("/api/instant-proof")) {
      return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify(proofStart()) });
    }
    if (request.method() === "POST" && request.url().includes("/share")) {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ share_token: SHARE_TOKEN, expires_at: new Date(Date.now() + 60_000).toISOString() }),
      });
    }
    if (request.url().includes("/frame")) {
      return route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(statusBody("completed")) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("button", { name: "Share result" }).click();
  await page.getByRole("button", { name: "Retry share" }).waitFor();
});

test("keeps a cancelled native share neutral", async (t) => {
  const page = currentPage;
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => { throw new DOMException("User cancelled", "AbortError"); },
    });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
  });
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (!request.url().includes("/api/instant-proof")) return route.continue();
    if (request.method() === "POST" && request.url().endsWith("/api/instant-proof")) {
      return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify(proofStart()) });
    }
    if (request.method() === "POST" && request.url().includes("/share")) {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ share_token: SHARE_TOKEN, expires_at: new Date(Date.now() + 60_000).toISOString() }),
      });
    }
    if (request.url().includes("/frame")) {
      return route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(statusBody("completed")) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("button", { name: "Share result" }).click();
  await page.getByRole("button", { name: "Share result" }).waitFor();
});

test("stops polling when a proof is missing instead of retrying forever", async (t) => {
  const page = currentPage;
  let statusCalls = 0;
  await page.route("**/*", (route) =>
    route.request().url().includes("/api/instant-proof")
      ? route.request().method() === "POST"
        ? route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify(proofStart()) })
        : (statusCalls++, route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ error: "proof_not_found" }),
        }))
      : route.continue(),
  );
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("alert").waitFor();
  await page.waitForTimeout(2200);
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "failed");
  assert.equal(statusCalls, 1);
  assert.match(await page.getByRole("alert").innerText(), /expired|no longer available/i);
  assert.equal(await page.locator(".verdict").count(), 0);
  assert.equal(await page.getByRole("button", { name: /Share result|Save result/ }).count(), 0);
});

test("keeps proxy configuration details out of customer error copy", async (t) => {
  const page = currentPage;
  const secretHint = "Configure INSTANT_PROOF_PROXY_SECRET and Cloudflare Pages.";
  await page.route("**/api/instant-proof", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "instant_proof_unavailable",
        message: "Instant Proof is temporarily unavailable.",
        hint: secretHint,
      }),
    }),
  );
  await page.getByRole("button", { name: "Run check" }).click();
  const alert = page.getByRole("alert");
  await alert.waitFor();
  const copy = await alert.innerText();
  assert.match(copy, /temporarily unavailable|try again/i);
  assert.doesNotMatch(copy, /INSTANT_PROOF_PROXY_SECRET|Cloudflare Pages/);
  assert.equal(await page.locator(".verdict").count(), 0);
  assert.equal(await page.getByRole("button", { name: /Share result|Save result/ }).count(), 0);
});

test("shared links load real read-only evidence and scrub the bearer fragment", async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route("https://unpkg.com/react@18.3.1/umd/react.production.min.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: reactSource }),
  );
  await page.route("https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: reactDomSource }),
  );
  let sharedAuth;
  await page.route("**/*", async (route) => {
    if (!route.request().url().includes("/api/instant-proof/shared")) return route.continue();
    sharedAuth = route.request().headers().authorization;
    if (route.request().url().includes("/frame")) {
      return route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        proof_id: PROOF_ID,
        target_url: "https://example.com",
        claim: "The page explains what this product does",
        status: "completed",
        result: { pass: true, rationale: "Shared evidence is available." },
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        links: { frame: "/api/v1/instant-proof/shared/frame?step=7" },
      }),
    });
  });
  await page.goto(`${baseUrl}/verify.html#${encodeURIComponent(SHARE_TOKEN)}`, { waitUntil: "domcontentloaded" });
  await page.locator(".instrument-head b", { hasText: "Shared result" }).waitFor();
  await page.getByAltText("Screenshot from the shared browser check").waitFor();
  assert.equal(await page.evaluate(() => location.hash), "");
  assert.equal(sharedAuth, `Bearer ${SHARE_TOKEN}`);
  assert.match(await page.locator("#instant-proof").innerText(), /Shared evidence is available/);
  assert.equal(await page.locator("#instant-proof").getAttribute("class"), "instrument shared-proof");
  assert.equal(await page.getByRole("heading", { name: "Shared result" }).count(), 1);
  assert.equal(await page.getByRole("button", { name: /Save result|Run check/ }).count(), 0);
  await context.close();
});

test("proxy keeps the configured control-plane path prefix", async () => {
  const originalFetch = globalThis.fetch;
  let target;
  globalThis.fetch = async (url) => {
    target = String(url);
    return new Response(JSON.stringify({ status: "running" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  try {
    const request = new Request("https://molar.it/api/instant-proof", { method: "GET" });
    const response = await onRequest({
      request,
      env: {
        INSTANT_PROOF_PROXY_SECRET: "x".repeat(32),
        MOLAR_CONTROL_PLANE_URL: "https://api.molar.it/plumbing-api",
      },
      params: { path: [] },
    });
    assert.equal(response.status, 200);
    assert.equal(target, "https://api.molar.it/plumbing-api/api/v1/instant-proof");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("proxy generic failures expose a plain recovery hint", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("upstream unavailable");
  };
  try {
    const response = await onRequest({
      request: new Request("https://molar.it/api/instant-proof"),
      env: { INSTANT_PROOF_PROXY_SECRET: "x".repeat(32) },
      params: { path: [] },
    });
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.hint, "Try again in a moment.");
    assert.doesNotMatch(JSON.stringify(body), /INSTANT_PROOF_PROXY_SECRET|Cloudflare/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("a not-yet-captured frame is pending, while missing proof access stays an error", async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const [error, expected] of [["proof_resource_not_ready", 204], ["proof_not_found", 404]]) {
      globalThis.fetch = async () => Response.json({ error }, { status: 404 });
      const response = await onRequest({
        request: new Request(`https://molar.it/api/instant-proof/${PROOF_ID}/frame?step=0`),
        env: { INSTANT_PROOF_PROXY_SECRET: "x".repeat(32) },
        params: { path: [PROOF_ID, "frame"] },
      });
      assert.equal(response.status, expected);
      if (expected === 204) {
        assert.equal(await response.text(), "");
        assert.equal(response.headers.get("Retry-After"), "3");
        assert.match(response.headers.get("Cache-Control"), /no-store/);
      } else assert.equal((await response.json()).error, error);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("pending frames back off without creating empty images or delaying the final screenshot", async () => {
  const page = currentPage;
  await page.clock.install();
  let finished = false, frameCalls = 0, statusCalls = 0;
  await page.route("**/api/instant-proof**", async route => {
    if (route.request().method() === "POST") return route.fulfill({ status: 202, json: proofStart() });
    if (route.request().url().includes("/frame")) {
      frameCalls++;
      return finished
        ? route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") })
        : route.fulfill({ status: 204, headers: { "Retry-After": "3" } });
    }
    statusCalls++;
    return route.fulfill({ json: finished ? statusBody("completed", { frame_step: 0 }) : statusBody("running") });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.waitForResponse(r => r.url().includes("/frame"));
  await page.clock.runFor(1600);
  assert.equal(await page.locator(".frame img").count(), 0, "204 is not image data");
  assert.equal(frameCalls, 1, "status polls must not hammer a pending frame");
  assert.ok(statusCalls >= 2, "status polling continues independently");
  finished = true;
  await page.clock.runFor(1600);
  await page.locator(".verdict").waitFor();
  assert.equal(await page.getByAltText("Latest screenshot from the browser check").count(), 1);
  assert.equal(frameCalls, 2, "completion bypasses pending-frame backoff");
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "completed");
});

test("waits for a delayed final verification after the browser execution window", async () => {
  const page = currentPage;
  await page.clock.install();
  let ready = false;
  await page.route("**/api/instant-proof**", async route => {
    if (route.request().method() === "POST") return route.fulfill({ status: 202, json: proofStart() });
    if (route.request().url().includes("/frame")) return ready
      ? route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") })
      : route.fulfill({ status: 204 });
    return route.fulfill({ json: ready ? statusBody("completed", { frame_step: 1 }) : statusBody("running") });
  });
  const pending = page.waitForResponse(r => r.url().includes("/frame"));
  await page.getByRole("button", { name: "Run check" }).click();
  await pending;
  await page.clock.fastForward(131000);
  await page.clock.runFor(100);
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "running");
  ready = true;
  await page.clock.fastForward(39000);
  await page.getByRole("button", { name: "Share result" }).waitFor();
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "completed");
  assert.equal(await page.getByAltText("Latest screenshot from the browser check").count(), 1);
});

test("the total result wait stays bounded and does not offer to save a missing result", async () => {
  const page = currentPage;
  await page.clock.install();
  await page.route("**/api/instant-proof**", async route => {
    if (route.request().method() === "POST") return route.fulfill({ status: 202, json: proofStart() });
    if (route.request().url().includes("/frame")) return route.fulfill({ status: 204 });
    return route.fulfill({ json: statusBody("running") });
  });
  const pending = page.waitForResponse(r => r.url().includes("/frame"));
  await page.getByRole("button", { name: "Run check" }).click();
  await pending;
  await page.clock.fastForward(251000);
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /four minutes/);
  assert.doesNotMatch(await page.locator(".frame").innerText(), /save the result/);
  assert.equal(await page.getByRole("button", { name: /Save result|Share result/ }).count(), 0);
});

test("proxy rejects credentialed or query-bearing control-plane bases", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response("unexpected", { status: 200 });
  };
  try {
    const response = await onRequest({
      request: new Request("https://molar.it/api/instant-proof"),
      env: {
        INSTANT_PROOF_PROXY_SECRET: "x".repeat(32),
        MOLAR_CONTROL_PLANE_URL: "https://user:password@api.molar.it/plumbing-api?wrong=1#fragment",
      },
      params: { path: [] },
    });
    assert.equal(response.status, 503);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// Regression: the live service returned an hour-long wait, not a momentary outage.
test("shows the service retry window when a new proof is rate limited", async () => {
  const page = currentPage;
  await page.route("**/api/instant-proof", (route) => route.fulfill({
    status: 429, contentType: "application/json",
    body: JSON.stringify({ error: "Too Many Requests", retryAfter: 3600 }),
  }));
  await page.getByRole("button", { name: "Run check", exact: true }).click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /try again in 60 minutes/i);
});


test("a missing preview keeps the completed result without denying the browser run", async () => {
  const page = currentPage;
  await page.route("**/api/instant-proof**", async (route) => {
    if (route.request().url().includes("/frame")) return route.fulfill({ status: 404 });
    const body = route.request().method() === "POST" ? proofStart() : statusBody("completed");
    return route.fulfill({ status: route.request().method() === "POST" ? 202 : 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("button", { name: "Share result" }).waitFor();
  assert.match(await page.locator(".frame").innerText(), /preview unavailable/i);
  assert.doesNotMatch(await page.locator(".frame").innerText(), /no browser session|simulated/i);
  assert.match(await page.locator(".verdict").innerText(), /Verified/);
  assert.equal(await page.getByRole("button", { name: "Save result" }).count(), 1);
});

test("a shared proof does not call an absent frame expired", async () => {
  const page = currentPage;
  await page.route("**/api/instant-proof/shared**", async (route) => {
    if (route.request().url().includes("/frame")) return route.fulfill({ status: 404 });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ...statusBody("completed"), target_url: "https://example.com", claim: "The homepage has a heading", expires_at: new Date(Date.now() + 60_000).toISOString(), links: { frame: "/api/v1/instant-proof/shared/frame?step=0" } }) });
  });
  await page.goto(`${baseUrl}/verify.html#${SHARE_TOKEN}`);
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /screenshot is unavailable/i);
  assert.doesNotMatch(await page.getByRole("alert").innerText(), /expired/i);
  assert.match(await page.locator(".verdict").innerText(), /Verified/);
});


for (const missingStatus of [404, 204]) {
test(`finds the last captured frame when final steps return ${missingStatus}`, async () => {
  const page = currentPage;
  const requested = [];
  await page.route("**/api/instant-proof**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/frame")) {
      const step = Number(url.searchParams.get("step")); requested.push(step);
      if (step !== 1) return route.fulfill({ status: missingStatus });
      return route.fulfill({ status: 200, contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
    }
    const body = route.request().method() === "POST" ? proofStart() : statusBody("completed", { result: { pass: true, steps_used: 4, rationale: "The heading was observed." } });
    return route.fulfill({ status: route.request().method() === "POST" ? 202 : 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("button", { name: "Share result" }).waitFor();
  assert.equal(await page.getByAltText("Latest screenshot from the browser check").count(), 1);
  assert.deepEqual(requested, [3, 2, 1]);
});
}


test("a verified proof stays completed after it has been claimed", async () => {
  const page = currentPage;
  await page.route("**/api/instant-proof**", async (route) => {
    if (route.request().url().includes("/frame")) return route.fulfill({ status: 404 });
    const body = route.request().method() === "POST" ? proofStart() : statusBody("claimed", { result: { pass: true, rationale: "The heading was observed." } });
    return route.fulfill({ status: route.request().method() === "POST" ? 202 : 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.getByRole("button", { name: "Run check" }).click();
  await page.getByRole("button", { name: "Share result" }).waitFor();
  assert.equal(await page.locator("#instant-proof").getAttribute("data-state"), "completed");
  assert.match(await page.locator(".verdict").innerText(), /Verified/);
});
