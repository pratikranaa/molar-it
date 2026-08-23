import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  CUTS,
  FOUNDER_BEATS,
  MASTER_NARRATION,
  PRODUCT_SCENES,
} from "./scene-manifest.js";
import { buildTimeline, locateBeat, parseCaptureTime } from "./timeline.js";

test("the master contains twenty reusable product scenes", () => {
  assert.equal(PRODUCT_SCENES.length, 20);
  assert.deepEqual(
    PRODUCT_SCENES.map((scene) => scene.id),
    Array.from({ length: 20 }, (_, index) => `scene-${String(index + 1).padStart(2, "0")}`),
  );
  assert.ok(PRODUCT_SCENES.every((scene) => scene.durationMs >= 2400));
  assert.ok(PRODUCT_SCENES.every((scene) => scene.caption.length > 0));
  assert.ok(PRODUCT_SCENES.every((scene) => scene.reducedMotionLabel.length > 0));
});

test("founder and animated cuts share all product tableaux in story order", () => {
  const ids = PRODUCT_SCENES.map((scene) => scene.id);
  assert.deepEqual(CUTS.founder.filter((id) => id.startsWith("scene-")), ids);
  assert.deepEqual(CUTS.animated.filter((id) => id.startsWith("scene-")), ids);
  assert.equal(FOUNDER_BEATS.length, 7);
  assert.equal(CUTS.founder.at(-1), "founder-close");
  assert.equal(CUTS.animated.at(-1), "founder-close");
});

test("customer, investor, and launch edits reference real beats", () => {
  const valid = new Set([...PRODUCT_SCENES.map((scene) => scene.id), ...FOUNDER_BEATS.map((beat) => beat.id)]);
  for (const name of ["customer", "investor", "launch"]) {
    assert.ok(CUTS[name].length >= 5);
    assert.ok(CUTS[name].every((id) => valid.has(id)));
  }
});

test("the approved claims and close remain in the narration", () => {
  assert.match(MASTER_NARRATION, /15 million/i);
  assert.match(MASTER_NARRATION, /500,000/);
  assert.match(MASTER_NARRATION, /92% to 99\.8%/);
  assert.match(MASTER_NARRATION, /Ship the change\. Know the outcome\./);
});

test("timeline assigns contiguous start and end times", () => {
  const timeline = buildTimeline("launch");
  assert.equal(timeline[0].startMs, 0);
  for (let index = 1; index < timeline.length; index += 1) {
    assert.equal(timeline[index].startMs, timeline[index - 1].endMs);
  }
});

test("locateBeat clamps before and after the cut", () => {
  const timeline = buildTimeline("launch");
  assert.equal(locateBeat(timeline, -1).index, 0);
  assert.equal(locateBeat(timeline, Number.POSITIVE_INFINITY).index, timeline.length - 1);
});

test("capture time accepts milliseconds and seconds", () => {
  assert.equal(parseCaptureTime("1250"), 1250);
  assert.equal(parseCaptureTime("1.25s"), 1250);
  assert.equal(parseCaptureTime(null), null);
});

test("motion tokens encode the approved smoothness constraints", async () => {
  const css = await readFile(new URL("./film.css", import.meta.url), "utf8");
  assert.match(css, /--ease-settle:\s*cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
  assert.match(css, /--move-ms:\s*800ms/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.is-entering[\s\S]*will-change:\s*transform, opacity/);
  assert.doesNotMatch(css, /bounce|animation:\s*[^;]*infinite/i);
});

test("all twenty product renderers are exported", async () => {
  const first = await import("./scenes-01-10.js");
  const second = await import("./scenes-11-20.js");
  const renderers = { ...first, ...second };

  for (let number = 1; number <= 20; number += 1) {
    assert.equal(
      typeof renderers[`renderScene${String(number).padStart(2, "0")}`],
      "function",
      `scene ${number} must have a renderer`,
    );
  }
});

test("founder and animated-copy renderers are exported", async () => {
  const founder = await import("./founder-scenes.js");
  assert.equal(typeof founder.renderFounderBeat, "function");
  assert.equal(typeof founder.renderAnimatedCopyBeat, "function");
});

test("failure semantics remain textual and relational in source", async () => {
  const source = await readFile(new URL("./scenes-11-20.js", import.meta.url), "utf8");
  assert.match(source, /WEBHOOK · 500/);
  assert.match(source, /BROWSER · PRO/);
  assert.match(source, /SUBSCRIPTION · FREE/);
  assert.match(source, /connector\("≠"\)/);
});

test("player handles reduced motion, visibility, capture, and animation frames", async () => {
  const source = await readFile(new URL("./player.js", import.meta.url), "utf8");
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /captureTime/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /remove\("is-entering"\)/);
});

test("film page has one stage, captions, controls, and a transcript", async () => {
  const html = await readFile(new URL("../film.html", import.meta.url), "utf8");
  assert.match(html, /id="film-stage"/);
  assert.match(html, /id="film-caption"/);
  assert.match(html, /aria-label="Film playback"/);
  assert.match(html, /<details[^>]*id="film-transcript"/);
  assert.match(html, /type="module" src="\/film\/player\.js"/);
  assert.match(html, /Ship the change\. Know the outcome\./);
});

test("public routing exposes the clean film URL", async () => {
  const vercel = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.ok(vercel.routes.some((rule) => rule.source === "/film" && rule.destination === "/film.html"));
});

test("renderer exports deterministic frames, MP4, and WebVTT captions", async () => {
  const source = await readFile(new URL("./render-film.mjs", import.meta.url), "utf8");
  assert.match(source, /captureTime/);
  assert.match(source, /frame-%06d\.png/);
  assert.match(source, /libx264/);
  assert.match(source, /WEBVTT/);
  assert.match(source, /window\.MolarFilm\.seek/);
});
