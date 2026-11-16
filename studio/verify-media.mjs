import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { scenes, cuts, timeline, subtitleFile } from "./story.mjs";

const root = fileURLToPath(new URL(".", import.meta.url)),
  out = join(root, "renders"),
  review = join(root, "review");
await mkdir(review, { recursive: true });
GlobalFonts.registerFromPath(
  join(root, "../fonts/instrument-sans-latin.woff2"),
  "Instrument",
);
const targets = [
  ...Object.entries(cuts).map(([id, c]) => ({
    name: "molar-" + id,
    beats: timeline(c.beats),
    width: 1920,
    height: 1080,
    audio: true,
  })),
  {
    name: "molar-short-vertical",
    beats: timeline("short"),
    width: 1080,
    height: 1920,
    audio: true,
  },
  ...scenes.map((s) => ({
    name: `scenes/${String(s.index).padStart(2, "0")}-${s.id}`,
    beats: timeline([s]),
    width: 1920,
    height: 1080,
    audio: false,
  })),
];
const report = [];
for (const target of targets) {
  const path = join(out, target.name + ".mp4");
  const probe = JSON.parse(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        path,
      ],
      { encoding: "utf8" },
    ),
  );
  const v = probe.streams.find((s) => s.codec_type === "video"),
    a = probe.streams.find((s) => s.codec_type === "audio"),
    duration = target.beats.at(-1).end;
  assert.equal(v.codec_name, "h264");
  assert.equal(v.width, target.width);
  assert.equal(v.height, target.height);
  assert.equal(v.avg_frame_rate, "60/1");
  assert.equal(Number(v.nb_frames), Math.round(duration * 60));
  assert.ok(Math.abs(Number(probe.format.duration) - duration) < 0.1);
  assert.equal(Boolean(a), target.audio);
  if (a) {
    assert.equal(a.codec_name, "aac");
    assert.equal(a.channels, 2);
  }
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-v",
      "error",
      "-xerror",
      "-threads",
      "2",
      "-i",
      path,
      "-f",
      "null",
      "-",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const srt = await readFile(join(out, target.name + ".srt"), "utf8");
  assert.equal(srt, subtitleFile(target.beats, 'srt'));
  // Sample the encoded file after muxing, rather than re-rendering source art.
  const sample = execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-ss",
      String(Math.min(3, duration - 1)),
      "-i",
      path,
      "-frames:v",
      "1",
      "-f",
      "image2pipe",
      "-vcodec",
      "png",
      "pipe:1",
    ],
    { maxBuffer: 20e6 },
  );
  await writeFile(
    join(review, target.name.replaceAll("/", "-") + "-encoded.png"),
    sample,
  );
  report.push({
    name: target.name,
    duration,
    width: v.width,
    height: v.height,
    frames: Number(v.nb_frames),
    fps: 60,
    audio: Boolean(a),
    decode: "passed",
    captions: "sidecars present",
    bytes: Number(probe.format.size),
  });
  console.log("PASS media", target.name);
}
const cards = targets.filter((t) => t.name.startsWith("scenes/")),
  canvas = createCanvas(1920, 7 * 300),
  c = canvas.getContext("2d");
c.fillStyle = "#f5f5ef";
c.fillRect(0, 0, canvas.width, canvas.height);
for (let i = 0; i < cards.length; i++) {
  const x = (i % 4) * 480,
    y = Math.floor(i / 4) * 300;
  const img = await loadImage(
    join(review, cards[i].name.replaceAll("/", "-") + "-encoded.png"),
  );
  c.drawImage(img, x, y, 480, 270);
  c.font = "16px Instrument";
  c.fillStyle = "#26342e";
  c.fillText(
    `${String(i + 1).padStart(2, "0")} ${scenes[i].title}`,
    x + 14,
    y + 289,
  );
}
await writeFile(
  join(out, "encoded-scene-contact-sheet.png"),
  canvas.toBuffer("image/png"),
);
await writeFile(
  join(review, "media-verification.json"),
  JSON.stringify({ date: new Date().toISOString(), outputs: report }, null, 2),
);
console.log(
  `Verified ${report.length} MP4 outputs, including full decode checks.`,
);
