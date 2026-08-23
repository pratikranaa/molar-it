#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

import { renderSrt, renderWebVtt } from "./caption-export.js";
import { CUTS } from "./scene-manifest.js";
import { buildTimeline, captionTrackForCut } from "./timeline.js";

const ASPECTS = {
  landscape: { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 },
  vertical: { width: 1080, height: 1920 },
};

function argumentValue(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function help() {
  console.log(`Render the Molar film to a silent H.264 MP4 plus WebVTT captions.

Usage:
  npm run render -- --base-url http://127.0.0.1:8080 [options]

Options:
  --cut animated|founder|customer|investor|launch  (default: animated)
  --mode animated|founder                            (default: animated)
  --aspect landscape|square|vertical                (default: landscape)
  --fps 24|30|60                                    (default: 60)
  --output path/to/film.mp4                         (default: renders/molar-<cut>-<aspect>.mp4)
  --max-seconds N                                   render a short validation excerpt
  --keep-frames                                     preserve the numbered PNG sequence
`);
}

async function main() {
  if (hasFlag("help")) {
    help();
    return;
  }

  const cut = argumentValue("cut", "animated");
  const mode = argumentValue("mode", cut === "founder" ? "founder" : "animated");
  const aspect = argumentValue("aspect", "landscape");
  const fps = Number(argumentValue("fps", "60"));
  const baseUrl = argumentValue("base-url", "http://127.0.0.1:8080").replace(/\/$/, "");
  const output = resolve(
    argumentValue("output", `renders/molar-${cut}-${aspect}.mp4`),
  );
  const maxSeconds = Number(argumentValue("max-seconds", "0"));
  const keepFrames = hasFlag("keep-frames");

  if (!CUTS[cut]) throw new Error(`Unknown cut: ${cut}`);
  if (!["animated", "founder"].includes(mode)) throw new Error(`Unknown mode: ${mode}`);
  if (!ASPECTS[aspect]) throw new Error(`Unknown aspect: ${aspect}`);
  if (!Number.isFinite(fps) || fps < 1 || fps > 120) throw new Error(`Invalid fps: ${fps}`);

  const timeline = buildTimeline(cut);
  const fullDurationMs = timeline.at(-1).endMs;
  const durationMs = maxSeconds > 0
    ? Math.min(fullDurationMs, Math.round(maxSeconds * 1000))
    : fullDurationMs;
  const frameCount = Math.max(1, Math.ceil((durationMs / 1000) * fps));
  const viewport = ASPECTS[aspect];
  const framesDirectory = await mkdtemp(join(tmpdir(), "molar-film-frames-"));
  const framePattern = join(framesDirectory, "frame-%06d.png");
  const captionTrack = captionTrackForCut(cut, timeline);
  const captionsBase = output.slice(0, -extname(output).length);
  const captionsPath = `${captionsBase}.vtt`;
  const srtPath = `${captionsBase}.srt`;

  await mkdir(dirname(output), { recursive: true });
  await writeFile(captionsPath, renderWebVtt(captionTrack, durationMs));
  await writeFile(srtPath, renderSrt(captionTrack, durationMs));

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport });
    const query = new URLSearchParams({ cut, mode, captureTime: "0" });
    if (aspect !== "landscape") query.set("aspect", aspect);
    await page.goto(`${baseUrl}/film.html?${query}`, { waitUntil: "networkidle" });
    await page.locator("#film-stage[data-capture-ready='true']").waitFor();
    await page.addStyleTag({ content: `
      html, body, .film-body, .film-page { width: 100%; height: 100%; min-height: 100%; }
      .film-nav, .film-heading, .film-controls, .film-after, .film-footer { display: none !important; }
      .film-page { margin: 0; }
      .film-frame, .film-stage { width: 100%; height: 100%; border: 0; border-radius: 0; box-shadow: none; aspect-ratio: auto; }
    ` });

    const stage = page.locator("#film-stage");
    for (let index = 0; index < frameCount; index += 1) {
      const captureTime = Math.min(durationMs, Math.round((index * 1000) / fps));
      await page.evaluate(async (milliseconds) => {
        window.MolarFilm.seek(milliseconds);
        await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
      }, captureTime);
      await stage.screenshot({
        path: join(framesDirectory, `frame-${String(index).padStart(6, "0")}.png`),
        animations: "disabled",
      });
      if (index % fps === 0) process.stdout.write(`Rendered ${index + 1}/${frameCount} frames\r`);
    }
    process.stdout.write(`Rendered ${frameCount}/${frameCount} frames\n`);
  } finally {
    await browser?.close();
  }

  const ffmpeg = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-framerate", String(fps),
      "-i", framePattern,
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "18",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      output,
    ],
    { stdio: "inherit" },
  );

  if (ffmpeg.error) throw new Error(`Unable to run ffmpeg: ${ffmpeg.error.message}`);
  if (ffmpeg.status !== 0) throw new Error(`ffmpeg exited with status ${ffmpeg.status}`);

  if (keepFrames) {
    const keptAt = resolve(dirname(output), `${basename(output, extname(output))}-frames`);
    await mkdir(keptAt, { recursive: true });
    console.log(`Frames remain at ${framesDirectory}; move them to ${keptAt} if needed.`);
  } else {
    await rm(framesDirectory, { recursive: true, force: true });
  }

  console.log(`Video: ${output}`);
  console.log(`WebVTT: ${captionsPath}`);
  console.log(`SRT: ${srtPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
