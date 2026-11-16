import { scenes, cuts, timeline, locate } from "./story.mjs";
import { draw } from "./draw.mjs";

const $ = (s) => document.querySelector(s),
  stage = $("#stage"),
  ctx = stage.getContext("2d");
let cut = "launch",
  beats = timeline(cut),
  duration = beats.at(-1).end,
  time = 0,
  playing = false,
  cc = true,
  last = 0,
  lastId = "",
  musicOn = false;
const media = new Map();
const audio = new Audio("studio/renders/music-bed.wav");
audio.loop = true;
audio.volume = 0.55;
const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const buttons = {
  play: $("#play"),
  music: $("#music"),
  cc: $("#captions"),
  seek: $("#seek"),
};

await Promise.all([
  document.fonts.load("400 28px Instrument"),
  document.fonts.load("500 24px Instrument"),
  document.fonts.load('400 20px "Geist Mono"'),
]);
function render() {
  const beat = locate(beats, time),
    local = time - beat.start,
    video = media.get(beat.id);
  if (video && cuts[cut]?.mode === "founder") {
    const target = Math.min(
      Math.max(0, local),
      Math.max(0, video.duration - 0.05),
    );
    if (Number.isFinite(target) && Math.abs(video.currentTime - target) > 0.2)
      video.currentTime = target;
    if (playing && video.paused && target < video.duration - 0.1)
      video.play().catch(() => {});
  }
  for (const [id, v] of media) if (id !== beat.id || !playing) v.pause();
  draw(ctx, beat, local, {
    mode: cuts[cut]?.mode || "animated",
    captions: cc,
    footage: video?.readyState >= 2 ? video : null,
  });
  stage.setAttribute("aria-label", `${beat.title}. ${beat.line}`);
  buttons.seek.value = time;
  $("#clock").textContent = `${fmt(time)} / ${fmt(duration)}`;
  if (lastId !== beat.id) {
    lastId = beat.id;
    $("#scene-number").textContent =
      beat.kind === "product"
        ? `${String(beat.index).padStart(2, "0")} / ${beat.chapter}`
        : beat.kind === "founder" && cut === "founder"
          ? `${beat.id.toUpperCase()} / YOUR FOOTAGE`
          : "MOLAR / THE STORY";
    $("#scene-title").textContent = beat.title;
    $("#scene-line").textContent = beat.line;
    document
      .querySelectorAll(".chapter-rail button")
      .forEach((b) =>
        b.setAttribute(
          "aria-current",
          b.dataset.id === beat.id ? "true" : "false",
        ),
      );
  }
}
function pause() {
  playing = false;
  buttons.play.textContent = "▶";
  buttons.play.setAttribute("aria-label", "Play");
  audio.pause();
  for (const v of media.values()) v.pause();
}
function play() {
  if (time >= duration) seek(0);
  playing = true;
  last = performance.now();
  buttons.play.textContent = "Ⅱ";
  buttons.play.setAttribute("aria-label", "Pause");
  $("#big-play").hidden = true;
  if (musicOn) syncAudio();
}
function syncAudio() {
  if (Number.isFinite(audio.duration))
    audio.currentTime = time % audio.duration;
  if (playing && musicOn)
    audio.play().catch(() => {
      musicOn = false;
      buttons.music.textContent = "Music unavailable";
      buttons.music.setAttribute("aria-pressed", "false");
    });
}
function seek(t) {
  time = Math.max(0, Math.min(duration, t));
  syncAudio();
  render();
}
function setCut(next, single = null) {
  pause();
  cut = next;
  beats = timeline(single ? [single] : next);
  duration = beats.at(-1).end;
  buttons.seek.max = duration;
  time = 0;
  lastId = "";
  $("#big-play").hidden = false;
  document
    .querySelectorAll(".cut-tabs button")
    .forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.cut === next ? "true" : "false"),
    );
  buildRail();
  buildTranscript();
  render();
}
function buildRail() {
  const rail = $(".chapter-rail");
  rail.replaceChildren();
  beats.forEach((beat) => {
    const b = document.createElement("button");
    b.dataset.id = beat.id;
    b.title = `${fmt(beat.start)} · ${beat.title}`;
    b.setAttribute("aria-label", b.title);
    b.style.flexGrow = beat.duration;
    b.onclick = () => seek(beat.start);
    rail.append(b);
  });
}
function buildTranscript() {
  const target = $("#transcript");
  target.replaceChildren();
  beats.forEach((beat) => {
    const row = document.createElement("div");
    row.className = "script-row";
    const b = document.createElement("button");
    b.textContent = fmt(beat.start);
    b.onclick = () => {
      seek(beat.start);
      $("#stage-wrap").scrollIntoView({ block: "center" });
    };
    const p = document.createElement("p");
    p.textContent = beat.line;
    const small = document.createElement("small");
    small.textContent = `${beat.title} · ${beat.duration}s · ${beat.kind === "founder" ? "Founder / animated copy replacement" : beat.kind}`;
    p.append(small);
    row.append(b, p);
    target.append(row);
  });
}
for (const [id, c] of Object.entries(cuts)) {
  const b = document.createElement("button");
  b.dataset.cut = id;
  b.textContent = c.name;
  b.setAttribute("aria-pressed", id === cut ? "true" : "false");
  b.onclick = () => setCut(id);
  $(".cut-tabs").append(b);
}
for (const s of scenes) {
  const b = document.createElement("button");
  b.className = "scene-card";
  b.setAttribute("aria-label", `Play scene ${s.index}: ${s.title}`);
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  draw(canvas.getContext("2d"), s, Math.min(s.duration - 1, 3.4), {
    width: 640,
    height: 360,
    captions: false,
    branding: false,
  });
  thumb.append(canvas);
  const meta = document.createElement("div");
  meta.className = "meta";
  const n = document.createElement("span");
  n.textContent = String(s.index).padStart(2, "0");
  meta.append(n, document.createTextNode(s.title));
  const sub = document.createElement("span");
  sub.className = "chapter";
  sub.textContent = `${s.chapter} · ${s.duration}s`;
  b.append(thumb, meta, sub);
  b.onclick = () => {
    setCut("scene", s);
    play();
    $("#stage-wrap").scrollIntoView({ block: "center" });
  };
  $(".scene-grid").append(b);
}
for (const s of cuts.founder.beats.filter((b) => b.kind === "founder")) {
  const el = document.createElement("article");
  el.className = "take";
  const head = document.createElement("div");
  head.className = "take-head";
  const label = document.createElement("span");
  label.className = "label";
  label.textContent = `${s.id.toUpperCase()} / ${s.duration} SECONDS`;
  const preview = document.createElement("button");
  preview.textContent = "Preview shot ↗";
  preview.onclick = () => {
    setCut("founder");
    seek(beats.find((b) => b.id === s.id).start);
    $("#stage-wrap").scrollIntoView({ block: "center" });
  };
  head.append(label, preview);
  const quote = document.createElement("blockquote");
  quote.textContent = s.line;
  const upload = document.createElement("label");
  upload.className = "upload-label";
  upload.textContent = "Your take";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "video/*";
  input.setAttribute("aria-label", `Choose footage for ${s.id}`);
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;
    const old = media.get(s.id);
    if (old) {
      old.pause();
      URL.revokeObjectURL(old.src);
    }
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.src = URL.createObjectURL(file);
    v.onloadeddata = () => {
      media.set(s.id, v);
      label.textContent = `${s.id.toUpperCase()} / LOCAL TAKE LOADED`;
      setCut("founder");
      seek(beats.find((b) => b.id === s.id).start);
    };
    v.onerror = () => {
      label.textContent = `${s.id.toUpperCase()} / Could not open this video`;
    };
  };
  upload.append(input);
  el.append(head, quote, upload);
  $(".founder-grid").append(el);
}
buttons.play.onclick = () => (playing ? pause() : play());
$("#big-play").onclick = play;
buttons.seek.oninput = () => seek(Number(buttons.seek.value));
buttons.cc.onclick = () => {
  cc = !cc;
  buttons.cc.setAttribute("aria-pressed", String(cc));
  render();
};
buttons.music.onclick = () => {
  musicOn = !musicOn;
  buttons.music.textContent = musicOn ? "Music on" : "Music off";
  buttons.music.setAttribute("aria-pressed", String(musicOn));
  if (musicOn) syncAudio();
  else audio.pause();
};
$("#fullscreen").onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $("#stage-wrap").requestFullscreen?.();
};
document.addEventListener("keydown", (e) => {
  if (
    /INPUT|TEXTAREA|BUTTON|SUMMARY/.test(e.target.tagName) ||
    e.metaKey ||
    e.ctrlKey ||
    e.altKey
  )
    return;
  if (e.code === "Space") {
    e.preventDefault();
    playing ? pause() : play();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    seek(time + 5);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    seek(time - 5);
  }
  if (e.key.toLowerCase() === "c") buttons.cc.click();
  if (e.key.toLowerCase() === "m") buttons.music.click();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
function frame(now) {
  if (playing) {
    time = Math.min(duration, time + (now - last) / 1000);
    render();
    if (time >= duration) pause();
  }
  last = now;
  requestAnimationFrame(frame);
}
setCut(
  new URLSearchParams(location.search).get("cut") in cuts
    ? new URLSearchParams(location.search).get("cut")
    : "launch",
);
requestAnimationFrame(frame);
// Deterministic review interface used by verification and frame inspection.
window.MolarStudio = {
  seek,
  setCut,
  pause,
  play,
  get state() {
    return {
      cut,
      time,
      duration,
      playing,
      scene: locate(beats, time).id,
      cc,
      musicOn,
    };
  },
};
