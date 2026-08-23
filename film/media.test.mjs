import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { probeMedia, validateProbe } from "./media-evidence.mjs";

test("renderer streams frames instead of retaining a 4K PNG sequence", async () => {
  const source = await readFile(new URL("./render-film.mjs", import.meta.url), "utf8");
  assert.match(source, /createFrameEncoder/);
  assert.doesNotMatch(source, /frame-%06d\.png/);
});

test("contact sheet declares a single updating image output", async () => {
  const source = await readFile(new URL("./media-evidence.mjs", import.meta.url), "utf8");
  assert.match(source, /"-update", "1"/);
});

test("audio muxing is capped to the immutable film duration", async () => {
  const encoder = await readFile(new URL("./frame-encoder.mjs", import.meta.url), "utf8");
  const renderer = await readFile(new URL("./render-film.mjs", import.meta.url), "utf8");
  assert.match(encoder, /"-t", String\(durationSeconds\)/);
  assert.match(renderer, /durationSeconds: durationMs \/ 1000/);
});

test("probe validation checks delivery metadata", () => {
  const errors = validateProbe({
    codec_name: "h264",
    width: 1920,
    height: 1080,
    pix_fmt: "yuv420p",
    r_frame_rate: "60/1",
    duration: "75.000000",
  }, {
    codec: "h264",
    width: 1920,
    height: 1080,
    pixFmt: "yuv420p",
    fps: 60,
    durationSeconds: 75,
  });
  assert.deepEqual(errors, []);
});

test("ffprobe parser returns one normalized record", async () => {
  const output = "/tmp/molar-launch-probe-test.mp4";
  const result = spawnSync("ffmpeg", [
    "-y", "-f", "lavfi", "-i", "color=c=black:s=64x64:r=60",
    "-t", "0.1", "-c:v", "libx264", "-pix_fmt", "yuv420p", output,
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const probe = await probeMedia(output);
  assert.equal(probe.codec_name, "h264");
  assert.equal(probe.width, 64);
  assert.equal(probe.height, 64);
  await rm(output, { force: true });
});
