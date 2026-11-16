import assert from "node:assert/strict";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import {
  scenes,
  cuts,
  timeline,
  captions,
  subtitleFile,
  locate,
} from "./story.mjs";
import { draw, C } from "./draw.mjs";

const dir = fileURLToPath(new URL(".", import.meta.url)),
  review = join(dir, "review");
await mkdir(review, { recursive: true });
GlobalFonts.registerFromPath(
  join(dir, "../fonts/instrument-sans-latin.woff2"),
  "Instrument",
);
GlobalFonts.registerFromPath(
  join(dir, "../fonts/geist-mono-latin.woff2"),
  "Geist Mono",
);
const report = [];
check("Captions hold a complete thought long enough to read", () => {
  for (const id of Object.keys(cuts)) {
    for (const cue of captions(timeline(id))) {
      assert.ok(
        cue.end - cue.start >= 1.5,
        `Caption disappears too quickly: ${cue.text}`,
      );
    }
  }
});
function check(name, fn) {
  fn();
  report.push({ name, pass: true });
  console.log("PASS", name);
}
function observed(beat, t, vertical = false) {
  const canvas = createCanvas(vertical ? 900 : 1600, vertical ? 1600 : 900),
    c = canvas.getContext("2d"),
    text = [];
  const original = c.fillText.bind(c);
  c.fillText = (s, x, y) => {
    const m = c.measureText(s),
      tr = c.getTransform(),
      left =
        c.textAlign === "center"
          ? x - m.width / 2
          : c.textAlign === "right"
            ? x - m.width
            : x;
    const right = left + m.width;
    text.push({
      s,
      alpha: c.globalAlpha,
      color: c.fillStyle,
      left: left * tr.a + tr.e,
      right: right * tr.a + tr.e,
      y: y * tr.d + tr.f,
    });
    original(s, x, y);
  };
  draw(c, beat, t, { width: canvas.width, height: canvas.height });
  return { canvas, text };
}

check(
  "28 unique illustrations, continuous edits, captions no faster than 22 chars/sec",
  () => {
    assert.equal(scenes.length, 28);
    assert.equal(new Set(scenes.map((s) => s.id)).size, 28);
    for (const id of Object.keys(cuts)) {
      const beats = timeline(id);
      for (let i = 1; i < beats.length; i++)
        assert.equal(beats[i - 1].end, beats[i].start);
      for (const c of captions(beats)) {
        assert.ok(c.end > c.start);
        assert.ok(c.text.length / (c.end - c.start) <= 22, `${id}: ${c.text}`);
      }
      assert.match(subtitleFile(beats, "vtt"), /^WEBVTT/);
      assert.equal(locate(beats, beats.at(-1).end).id, beats.at(-1).id);
    }
  },
);
check(
  "Founder and animated launch use exactly the same narration and timing",
  () => {
    assert.deepEqual(timeline("launch"), timeline("founder"));
    assert.equal(
      cuts.founder.beats.filter((b) => b.kind === "founder").length,
      8,
    );
  },
);
check("The founder launch itself contains at least 20 product cutaways", () => {
  assert.ok(
    cuts.founder.beats.filter((b) => b.kind === "product").length >= 20,
  );
});
check("First frame has a readable title, not an almost-blank poster", () => {
  const data = observed(cuts.launch.beats[0], 0);
  assert.ok(
    data.text.find((t) => t.s === "The page looked fine.").alpha >= 0.8,
  );
});
check("Failed access is not shown with a green success marker in Trace", () => {
  const { text } = observed(
    scenes.find((s) => s.id === "trace"),
    3.5,
  );
  assert.equal(text.find((t) => t.s === "Check access").color, C.amber);
});
check(
  "Every scene renders deterministically and changes during its illustrative action",
  () => {
    for (const s of scenes) {
      const first = observed(s, 0.35).canvas.data(),
        end = observed(s, 3.1).canvas.data();
      assert.ok(!first.equals(end), s.id);
      assert.ok(
        end.equals(observed(s, 3.1).canvas.data()),
        `${s.id} is not deterministic`,
      );
    }
  },
);
check("Visible text stays within landscape and portrait artboards", () => {
  for (const beat of [
    ...scenes,
    ...cuts.launch.beats.filter((b) => b.kind !== "product"),
  ])
    for (const vertical of [false, true])
      for (const t of [0.1, 1.5, 3.3]) {
        const { text } = observed(beat, t, vertical);
        for (const item of text.filter((r) => r.alpha > 0.1)) {
          assert.ok(
            item.left >= 20 && item.right <= (vertical ? 880 : 1580),
            `${beat.id}: ${item.s} [${item.left}, ${item.right}]`,
          );
          assert.ok(item.y > 10 && item.y < (vertical ? 1590 : 890), beat.id);
        }
      }
});

check("Delivered captions fit at most two lines", () => {
  for (const beat of [...scenes, ...cuts.launch.beats]) {
    const { text } = observed(beat, 2);
    assert.ok(
      text.filter((t) => t.color === "#fffefa" && t.y > 730).length <= 2,
      beat.id,
    );
  }
  for (const beat of cuts.short.beats) {
    const { text } = observed(beat, 2, true);
    assert.ok(
      text.filter((t) => t.color === "#fffefa" && t.y > 1400).length <= 2,
      beat.id,
    );
  }
});
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:8893/studio.html", {
    waitUntil: "networkidle",
  });
  await page.waitForFunction(() => window.MolarStudio);
  assert.equal(
    await page.evaluate(() => window.MolarStudio.state.playing),
    false,
  );
  assert.equal(await page.locator(".scene-card").count(), 28);
  await page.getByRole("button", { name: "Product demo", exact: true }).click();
  assert.equal(await page.evaluate(() => window.MolarStudio.state.cut), "demo");
  await page.locator("#play").click();
  await page.waitForFunction(() => window.MolarStudio.state.time > 0.3);
  await page.locator("#play").click();
  assert.equal(
    await page.evaluate(() => window.MolarStudio.state.playing),
    false,
  );
  await page.locator("#seek").fill("75");
  assert.equal(await page.evaluate(() => window.MolarStudio.state.time), 75);
  await page.locator("#captions").click();
  assert.equal(await page.evaluate(() => window.MolarStudio.state.cc), false);
  await page
    .getByRole("button", {
      name: "Play scene 14: Find the broken handoff",
      exact: true,
    })
    .click();
  assert.equal(
    await page.evaluate(() => window.MolarStudio.state.scene),
    "trace",
  );
  await page.evaluate(() => {
    window.MolarStudio.pause();
    window.MolarStudio.seek(3);
  });
  await page.screenshot({ path: join(review, "desktop.png"), fullPage: true });
  await page.locator("#stage").screenshot({ path: join(review, "trace.png") });
  await page
    .getByRole("button", { name: "Founder intercut", exact: true })
    .click();
  await page.evaluate(() => window.MolarStudio.seek(2));
  assert.equal(await page.locator(".take").count(), 8);
  await page
    .locator("#stage")
    .screenshot({ path: join(review, "founder.png") });
  // A real local video is auditioned in a founder slot; no server upload route exists.
  const fixture = join(review, "footage-fixture.mp4");
  execFileSync("ffmpeg", [
    "-hide_banner",
    "-v",
    "error",
    "-y",
    "-f",
    "lavfi",
    "-i",
    "color=c=0xadc2cc:s=640x360:r=30:d=1",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    fixture,
  ]);
  await page.locator("input[type=file]").first().setInputFiles(fixture);
  await page.waitForFunction(
    () =>
      document
        .querySelector(".take .label")
        .textContent.includes("LOCAL TAKE LOADED"),
    {},
    { timeout: 5000 },
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({ path: join(review, "mobile.png"), fullPage: true });
  await page
    .getByRole("button", { name: "30-second introduction", exact: true })
    .click();
  await page.evaluate(() => {
    window.MolarStudio.seek(30);
    window.MolarStudio.play();
  });
  await page.waitForFunction(
    () =>
      window.MolarStudio.state.time > 0 && window.MolarStudio.state.time < 5,
  );
  await page.evaluate(() => window.MolarStudio.pause());
  assert.deepEqual(errors, []);
  report.push({
    name: "Browser: edit selection, playback, pause, seek, captions, scene library, founder preview, local footage input, mobile overflow, replay, reduced-motion initial state, no runtime errors",
    pass: true,
  });
  console.log("PASS browser interaction flow");
} finally {
  await browser.close();
}
await writeFile(
  join(review, "verification.json"),
  JSON.stringify({ date: new Date().toISOString(), checks: report }, null, 2),
);
console.log(`${report.length} checks passed.`);
