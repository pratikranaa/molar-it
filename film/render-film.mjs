#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

import { renderSrt, renderWebVtt } from "./caption-export.js";
import { createFrameEncoder } from "./frame-encoder.mjs";
import {
  probeMedia,
  validateProbe,
  writeContactSheet,
  writeRenderManifest,
} from "./media-evidence.mjs";
import { CUTS } from "./scene-manifest.js";
import { buildTimeline, captionTrackForCut } from "./timeline.js";

const DELIVERIES = {
  landscape: {
    "1080": { width: 1920, height: 1080 },
    "4k": { width: 3840, height: 2160 },
  },
  square: {
    "1080": { width: 1080, height: 1080 },
    "4k": { width: 2160, height: 2160 },
  },
  vertical: {
    "1080": { width: 1080, height: 1920 },
    "4k": { width: 2160, height: 3840 },
  },
};

function argumentValue(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function help() {
  console.log(`Render a deterministic Molar film with caption and evidence sidecars.

Usage:
  npm run render -- --base-url http://127.0.0.1:8080 [options]

Options:
  --cut animated|founder|customer|investor|launch  (default: animated)
  --mode animated|founder                            (default: animated)
  --aspect landscape|square|vertical                (default: landscape)
  --resolution 1080|4k                              (default: 1080)
  --codec h264|prores                               (default: h264)
  --fps 24|30|60                                    (default: 60)
  --music path/to/music.wav                         optional music bed
  --output path/to/film.mp4                         generated from cut/mode/aspect
  --max-seconds N                                   render a validation excerpt
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
  const resolution = argumentValue("resolution", "1080");
  const codec = argumentValue("codec", "h264");
  const fps = Number(argumentValue("fps", "60"));
  const baseUrl = argumentValue("base-url", "http://127.0.0.1:8080").replace(/\/$/, "");
  const defaultExtension = codec === "prores" ? "mov" : "mp4";
  const output = resolve(argumentValue(
    "output",
    `renders/molar-${cut}-${mode}-${aspect}-${resolution}.${defaultExtension}`,
  ));
  const musicArgument = argumentValue("music");
  const musicPath = musicArgument ? resolve(musicArgument) : null;
  const maxSeconds = Number(argumentValue("max-seconds", "0"));

  if (!CUTS[cut]) throw new Error(`Unknown cut: ${cut}`);
  if (!["animated", "founder"].includes(mode)) throw new Error(`Unknown mode: ${mode}`);
  if (!DELIVERIES[aspect]) throw new Error(`Unknown aspect: ${aspect}`);
  if (!DELIVERIES[aspect][resolution]) throw new Error(`Unknown resolution: ${resolution}`);
  if (!["h264", "prores"].includes(codec)) throw new Error(`Unknown codec: ${codec}`);
  if (!Number.isFinite(fps) || fps < 1 || fps > 120) throw new Error(`Invalid fps: ${fps}`);
  if (!Number.isFinite(maxSeconds) || maxSeconds < 0) throw new Error(`Invalid max-seconds: ${maxSeconds}`);

  const timeline = buildTimeline(cut);
  const fullDurationMs = timeline.at(-1).endMs;
  const durationMs = maxSeconds > 0
    ? Math.min(fullDurationMs, Math.round(maxSeconds * 1000))
    : fullDurationMs;
  const frameCount = Math.max(1, Math.ceil((durationMs / 1000) * fps));
  const viewport = DELIVERIES[aspect][resolution];
  const captionTrack = captionTrackForCut(cut, timeline);
  const captionsBase = output.slice(0, -extname(output).length);
  const captionsPath = `${captionsBase}.vtt`;
  const srtPath = `${captionsBase}.srt`;
  const contactSheetPath = `${captionsBase}.contact-sheet.png`;

  await mkdir(dirname(output), { recursive: true });
  await writeFile(captionsPath, renderWebVtt(captionTrack, durationMs));
  await writeFile(srtPath, renderSrt(captionTrack, durationMs));

  let browser;
  const contactFrames = [];
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
    const encoder = createFrameEncoder({
      output,
      fps,
      codec,
      durationSeconds: durationMs / 1000,
      musicPath,
    });
    const capturedBeatIds = new Set();
    for (let index = 0; index < frameCount; index += 1) {
      const captureTime = Math.min(durationMs, Math.round((index * 1000) / fps));
      await page.evaluate(async (milliseconds) => {
        window.MolarFilm.seek(milliseconds);
        await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
      }, captureTime);
      const buffer = await stage.screenshot({ type: "png", animations: "disabled" });
      await encoder.write(buffer);
      const beat = await stage.getAttribute("data-scene");
      if (!capturedBeatIds.has(beat)) {
        capturedBeatIds.add(beat);
        contactFrames.push({ beat, captureTime, buffer });
      }
      if (index % fps === 0) process.stdout.write(`Rendered ${index + 1}/${frameCount} frames\r`);
    }
    await encoder.close();
    process.stdout.write(`Rendered ${frameCount}/${frameCount} frames\n`);
  } finally {
    await browser?.close();
  }

  await writeContactSheet(contactFrames, contactSheetPath);
  const probe = await probeMedia(output);
  const expectedProbe = {
    codec: codec === "prores" ? "prores" : "h264",
    width: viewport.width,
    height: viewport.height,
    pixFmt: codec === "prores" ? "yuv422p10le" : "yuv420p",
    fps,
    durationSeconds: durationMs / 1000,
  };
  const probeErrors = validateProbe(probe, expectedProbe);
  if (probeErrors.length) throw new Error(`Invalid media output: ${probeErrors.join("; ")}`);
  await writeRenderManifest(`${output}.render.json`, {
    cut,
    mode,
    aspect,
    resolution,
    fps,
    duration_ms: durationMs,
    source_revision: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "local",
    music: musicPath,
    captions: { vtt: captionsPath, srt: srtPath },
    contact_sheet: contactSheetPath,
    media: probe,
  });

  console.log(`Video: ${output}`);
  console.log(`WebVTT: ${captionsPath}`);
  console.log(`SRT: ${srtPath}`);
  console.log(`Contact sheet: ${contactSheetPath}`);
  console.log(`Render manifest: ${output}.render.json`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
