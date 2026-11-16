import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { mkdir, writeFile, stat, rename } from "node:fs/promises";
import { spawn, execFileSync } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import {
  scenes,
  cuts,
  timeline,
  locate,
  subtitleFile,
  timecode,
} from "./story.mjs";
import { draw, C } from "./draw.mjs";
import { writeScore } from "./music.mjs";

const root = fileURLToPath(new URL(".", import.meta.url)),
  out = join(root, "renders");
GlobalFonts.registerFromPath(
  join(root, "../fonts/instrument-sans-latin.woff2"),
  "Instrument",
);
GlobalFonts.registerFromPath(
  join(root, "../fonts/geist-mono-latin.woff2"),
  "Geist Mono",
);
const arg = (name) => {
  const i = process.argv.indexOf("--" + name);
  return i < 0 ? null : process.argv[i + 1];
};
const only = arg("cut"),
  limit = Number(arg("limit") || 0),
  fps = 60;
await mkdir(join(out, "scenes"), { recursive: true });
const musicPath = join(out, "music-bed.wav");
try {
  await stat(musicPath);
} catch {
  console.log("Composing original temporary music");
  await writeScore(musicPath, 240);
}

async function render(
  name,
  source,
  { mode = "animated", vertical = false, clean = false } = {},
) {
  const beats = timeline(source),
    full = beats.at(-1).end,
    seconds = limit ? Math.min(full, limit) : full;
  const width = vertical ? 1080 : 1920,
    height = vertical ? 1920 : 1080,
    canvas = createCanvas(width, height),
    ctx = canvas.getContext("2d");
  const basename = name + (limit ? "-excerpt" : ""),
    finalPath = join(out, basename + ".mp4"),
    path = join(out, basename + ".rendering.mp4");
  // Keep the previous playable edit until its replacement is fully encoded.
  const args = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "rawvideo",
    "-pixel_format",
    "rgba",
    "-video_size",
    `${width}x${height}`,
    "-framerate",
    String(fps),
    "-i",
    "pipe:0",
  ];
  if (!clean) args.push("-i", musicPath);
  args.push(
    "-map",
    "0:v:0",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-threads",
    "2",
    "-r",
    String(fps),
  );
  if (!clean)
    args.push(
      "-map",
      "1:a:0",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-af",
      `afade=t=in:d=1,afade=t=out:st=${Math.max(0, seconds - 1.5)}:d=1.5`,
    );
  args.push("-t", String(seconds), "-movflags", "+faststart", path);
  const proc = spawn("ffmpeg", args, { stdio: ["pipe", "ignore", "pipe"] });
  let errors = "";
  proc.stderr.on("data", (b) => (errors += b));
  let broken = null;
  proc.stdin.on("error", (e) => (broken = e));
  const done = new Promise((resolve, reject) => {
    proc.on("error", reject);
    proc.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${name}: ffmpeg ${code}: ${errors}`)),
    );
  });
  done.catch(() => {});
  const frameCount = Math.round(seconds * fps),
    started = Date.now();
  console.log(
    `Rendering ${basename}: ${seconds.toFixed(1)}s / ${width}×${height} / ${frameCount} frames`,
  );
  for (let i = 0; i < frameCount; i++) {
    const time = i / fps,
      b = locate(beats, time);
    draw(ctx, b, time - b.start, { width, height, mode, captions: !clean });
    const buffer = canvas.data();
    if (broken) throw broken;
    if (!proc.stdin.write(buffer)) await once(proc.stdin, "drain");
    if (i && i % 1800 === 0)
      console.log(
        `${basename}: ${Math.round((i / frameCount) * 100)}% (${((Date.now() - started) / 1000).toFixed(0)}s)`,
      );
  }
  proc.stdin.end();
  await done;
  await writeFile(join(out, basename + ".srt"), subtitleFile(beats, "srt"));
  await writeFile(join(out, basename + ".vtt"), subtitleFile(beats, "vtt"));
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
  const video = probe.streams.find((s) => s.codec_type === "video");
  if (
    video.width !== width ||
    video.height !== height ||
    video.avg_frame_rate !== "60/1" ||
    Math.abs(Number(probe.format.duration) - seconds) > 0.1
  )
    throw new Error(`Invalid output geometry, rate or duration: ${name}`);
  await rename(path, finalPath);
  const evidence = {
    name: basename,
    duration: seconds,
    width,
    height,
    fps,
    frames: frameCount,
    audio: !clean,
    mode,
    bytes: Number(probe.format.size),
    renderSeconds: (Date.now() - started) / 1000,
    placeholderFounder: mode === "founder",
    placeholderNarration: true,
    illustrative: true,
  };
  await writeFile(
    join(out, basename + ".json"),
    JSON.stringify(evidence, null, 2),
  );
  console.log(`Verified ${basename}: ${(evidence.bytes / 1e6).toFixed(1)} MB`);
  return evidence;
}

function drawSheet(items, path) {
  const cols = 4,
    cellW = 480,
    cellH = 304,
    rows = Math.ceil(items.length / cols);
  const canvas = createCanvas(cols * cellW, rows * cellH),
    ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f5f5ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  items.forEach((beat, i) => {
    const x = (i % cols) * cellW,
      y = Math.floor(i / cols) * cellH;
    ctx.save();
    ctx.translate(x, y);
    draw(ctx, beat, Math.min(3.5, beat.duration - 0.7), {
      width: cellW,
      height: 270,
      captions: false,
      branding: false,
    });
    ctx.fillStyle = C.ink;
    ctx.font = "16px Instrument";
    ctx.fillText(`${String(i + 1).padStart(2, "0")}  ${beat.title}`, 18, 289);
    ctx.restore();
  });
  return writeFile(path, canvas.toBuffer("image/png"));
}

const results = [];
if (!only || only === "all") {
  for (const key of ["launch", "founder", "demo", "short"])
    results.push(
      await render("molar-" + key, cuts[key].beats, { mode: cuts[key].mode }),
    );
  results.push(
    await render("molar-short-vertical", cuts.short.beats, { vertical: true }),
  );
  for (const s of scenes)
    results.push(
      await render(`scenes/${String(s.index).padStart(2, "0")}-${s.id}`, [s], {
        clean: true,
      }),
    );
} else if (only === "scenes") {
  for (const s of scenes)
    results.push(
      await render(`scenes/${String(s.index).padStart(2, "0")}-${s.id}`, [s], {
        clean: true,
      }),
    );
} else if (only === "vertical")
  results.push(
    await render("molar-short-vertical", cuts.short.beats, { vertical: true }),
  );
else if (cuts[only])
  results.push(
    await render("molar-" + only, cuts[only].beats, { mode: cuts[only].mode }),
  );
else throw new Error(`Unknown cut: ${only}`);
await drawSheet(scenes, join(out, "scene-contact-sheet.png"));
await drawSheet(
  cuts.founder.beats
    .filter((b) => b.kind === "founder")
    .map((b) => ({ ...b, kind: "title" })),
  join(out, "founder-lines.png"),
);
const launchBeats = timeline("launch");
await writeFile(
  join(out, "narration-and-shotlist.md"),
  "# Molar / narration and shotlist\n\nFounder footage and spoken narration pending. All product visuals are illustrations.\n\n" +
    launchBeats
      .map(
        (b) =>
          `## ${timecode(b.start)} — ${b.title} (${b.duration}s)\n\n${b.line}\n\nVisual: ${b.direction}\n\n${b.framing || ""}`,
      )
      .join("\n\n") +
    "\n\n# Extended product demo\n\n" +
    scenes
      .map(
        (s) =>
          `## ${s.index}. ${s.title}\n\n${s.line}\n\nMotion: ${s.direction}`,
      )
      .join("\n\n"),
);
await writeFile(
  join(out, "render-session.json"),
  JSON.stringify({ date: new Date().toISOString(), results }, null, 2),
);
console.log("Finished selected exports.");
