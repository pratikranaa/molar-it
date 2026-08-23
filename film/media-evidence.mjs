import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function probeMedia(path) {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_name,width,height,pix_fmt,r_frame_rate:format=duration",
    "-of", "json",
    path,
  ], { encoding: "utf8" });
  if (result.error) throw new Error(`Unable to run ffprobe: ${result.error.message}`);
  if (result.status !== 0) throw new Error(result.stderr.trim() || `ffprobe exited with status ${result.status}`);
  const parsed = JSON.parse(result.stdout);
  return { ...parsed.streams[0], duration: parsed.format.duration };
}

export function validateProbe(actual, expected) {
  const errors = [];
  if (actual.codec_name !== expected.codec) errors.push(`codec ${actual.codec_name} != ${expected.codec}`);
  if (actual.width !== expected.width || actual.height !== expected.height) {
    errors.push(`size ${actual.width}x${actual.height} != ${expected.width}x${expected.height}`);
  }
  if (actual.pix_fmt !== expected.pixFmt) errors.push(`pixel format ${actual.pix_fmt} != ${expected.pixFmt}`);
  const [numerator, denominator] = actual.r_frame_rate.split("/").map(Number);
  if (numerator / denominator !== expected.fps) errors.push(`fps ${actual.r_frame_rate} != ${expected.fps}`);
  if (Math.abs(Number(actual.duration) - expected.durationSeconds) > 1 / expected.fps) {
    errors.push(`duration ${actual.duration} != ${expected.durationSeconds}`);
  }
  return errors;
}

export async function writeRenderManifest(path, data) {
  await writeFile(path, `${JSON.stringify({ schema: "molar.film.render.v1", ...data }, null, 2)}\n`);
}

export async function writeContactSheet(frames, output) {
  if (!frames.length) throw new Error("Cannot write a contact sheet without frames");
  const directory = await mkdtemp(join(tmpdir(), "molar-film-contact-"));
  try {
    await mkdir(directory, { recursive: true });
    for (let index = 0; index < frames.length; index += 1) {
      await writeFile(
        join(directory, `key-${String(index).padStart(3, "0")}.png`),
        frames[index].buffer,
      );
    }
    const result = spawnSync("ffmpeg", [
      "-y",
      "-framerate", "1",
      "-i", join(directory, "key-%03d.png"),
      "-vf", "scale=320:-1,tile=5x6:padding=8:margin=8:color=0xf4f4ef",
      "-frames:v", "1",
      "-update", "1",
      output,
    ], { stdio: "inherit" });
    if (result.error) throw new Error(`Unable to run ffmpeg: ${result.error.message}`);
    if (result.status !== 0) throw new Error(`contact-sheet ffmpeg exited with status ${result.status}`);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
