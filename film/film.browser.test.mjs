import { test, expect } from "@playwright/test";
import { buildTimeline } from "./timeline.js";

function captureTimeFor(cut, sceneId, progress = 0.88) {
  const beat = buildTimeline(cut).find((entry) => entry.id === sceneId);
  if (!beat) throw new Error(`Scene ${sceneId} is not in cut ${cut}`);
  return Math.round(beat.startMs + beat.durationMs * progress);
}

test("animated cut boots paused and advances after explicit play", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/film.html?cut=animated");
  await expect(page.locator("#film-stage")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#film-stage")).toHaveAttribute("data-playing", "false");
  await expect(page.locator(".film-scene.is-active")).toHaveCount(1);
  await expect(page.locator("#film-caption")).not.toBeEmpty();

  const firstScene = await page.locator("#film-stage").getAttribute("data-scene");
  await page.getByRole("button", { name: "Play film" }).click();
  await page.waitForTimeout(6600);
  await expect(page.locator("#film-stage")).toHaveAttribute("data-playing", "true");
  expect(await page.locator("#film-stage").getAttribute("data-scene")).not.toBe(firstScene);
  expect(consoleErrors).toEqual([]);
});

test("reduced motion renders a final state without autoplay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/film.html?cut=launch");
  await expect(page.locator("#film-stage")).toHaveAttribute("data-playing", "false");
  await expect(page.locator(".film-scene.is-active")).toHaveCSS("transform", "none");
});

test("failure is textual and relational, not color-only", async ({ page }) => {
  const captureTime = captureTimeFor("animated", "scene-13");
  await page.goto(`/film.html?cut=animated&captureTime=${captureTime}`);
  await expect(page.getByText("BROWSER · PRO")).toBeVisible();
  await expect(page.getByText("SUBSCRIPTION · FREE")).toBeVisible();
  await expect(page.locator("[aria-label*='disagrees']")).toBeVisible();
  await expect(page.locator(".film-connector")).toHaveText("≠");
});

test("vertical layout keeps the primary object above the caption", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const captureTime = captureTimeFor("animated", "scene-04");
  await page.goto(`/film.html?aspect=vertical&captureTime=${captureTime}`);
  const object = await page.locator(".film-object").boundingBox();
  const caption = await page.locator("#film-caption").boundingBox();
  expect(object).not.toBeNull();
  expect(caption).not.toBeNull();
  expect(object.y + object.height).toBeLessThan(caption.y);
});

test("cut and founder-frame controls change the rendered sequence", async ({ page }) => {
  await page.goto("/film.html");
  await page.locator("#film-cut").selectOption("founder");
  await expect(page.locator("#film-stage")).toHaveAttribute("data-scene", "founder-open");
  await expect(page.getByText("FOUNDER FOOTAGE")).toBeVisible();
  await page.locator("#film-mode").selectOption("animated");
  await expect(page.locator(".copy-beat__text")).toBeVisible();
});

test("launch playback creates no main-thread task longer than 50 ms", async ({ page }) => {
  await page.addInitScript(() => {
    window.__filmLongTasks = [];
    new PerformanceObserver((list) => {
      window.__filmLongTasks.push(...list.getEntries().map((entry) => entry.duration));
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto("/film.html?cut=launch");
  await page.getByRole("button", { name: "Play film" }).click();
  await page.waitForTimeout(10_000);
  expect(await page.evaluate(() => window.__filmLongTasks.filter((duration) => duration > 50))).toEqual([]);
});
