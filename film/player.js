import { CUTS, FOUNDER_BEATS, MASTER_NARRATION, PRODUCT_SCENES } from "./scene-manifest.js";
import { buildTimeline, locateBeat, parseCaptureTime } from "./timeline.js";
import * as firstScenes from "./scenes-01-10.js";
import * as finalScenes from "./scenes-11-20.js";
import { renderAnimatedCopyBeat, renderFounderBeat } from "./founder-scenes.js";

const rendererRegistry = { ...firstScenes, ...finalScenes };
const productById = new Map(PRODUCT_SCENES.map((scene) => [scene.id, scene]));
const founderIds = new Set(FOUNDER_BEATS.map((beat) => beat.id));

function formatClock(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderBeat(beat, mode, progress) {
  if (founderIds.has(beat.id)) {
    return mode === "founder"
      ? renderFounderBeat(beat, progress)
      : renderAnimatedCopyBeat(beat, progress);
  }

  const descriptor = productById.get(beat.id);
  const renderer = rendererRegistry[descriptor.renderer];
  if (!renderer) throw new Error(`Missing renderer: ${descriptor.renderer}`);
  return renderer(progress);
}

export function createFilmPlayer({
  stage,
  caption,
  controls,
  cutName = "animated",
  mode = "animated",
  captureTime = null,
}) {
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cut = CUTS[cutName] ? cutName : "animated";
  let displayMode = mode === "founder" ? "founder" : "animated";
  let timeline = buildTimeline(cut);
  let elapsedMs = 0;
  let playing = false;
  let destroyed = false;
  let frameId = 0;
  let lastFrameAt = 0;
  let mountedIndex = -1;
  let currentNode = null;
  let wasPlayingBeforeHidden = false;
  let settleTimer = 0;

  function durationMs() {
    return timeline.at(-1)?.endMs || 0;
  }

  function updateControls() {
    if (!controls) return;
    controls.play.textContent = playing ? "Pause" : "Play";
    controls.play.setAttribute("aria-label", playing ? "Pause film" : "Play film");
    controls.range.max = String(durationMs());
    controls.range.value = String(Math.min(elapsedMs, durationMs()));
    controls.time.textContent = `${formatClock(elapsedMs)} / ${formatClock(durationMs())}`;
    controls.cut.value = cut;
    controls.mode.value = displayMode;
  }

  function mount(index, progress, immediate = false) {
    const beat = timeline[index];
    const nextNode = renderBeat(beat, displayMode, progress);
    nextNode.classList.add("is-entering");

    if (currentNode) {
      currentNode.classList.remove("is-active", "is-entering");
      currentNode.classList.add("is-leaving");
    }

    stage.append(nextNode);
    const previous = currentNode;
    currentNode = nextNode;
    mountedIndex = index;

    const activate = () => {
      nextNode.classList.add("is-active");
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => nextNode.classList.remove("is-entering"), 900);
    };

    if (immediate || reducedQuery.matches) activate();
    else requestAnimationFrame(() => requestAnimationFrame(activate));

    if (previous) window.setTimeout(() => previous.remove(), immediate ? 0 : 860);
  }

  function renderAt(milliseconds, immediate = false) {
    elapsedMs = Math.min(durationMs(), Math.max(0, milliseconds));
    const located = locateBeat(timeline, elapsedMs);
    const progress = reducedQuery.matches ? 1 : located.localMs / located.beat.durationMs;

    if (located.index !== mountedIndex || !currentNode) mount(located.index, progress, immediate);
    else currentNode.style.setProperty("--scene-progress", String(progress));

    caption.textContent = located.beat.caption || located.beat.copy;
    stage.dataset.scene = located.beat.id;
    stage.dataset.sceneIndex = String(located.index + 1);
    stage.dataset.sceneCount = String(timeline.length);
    updateControls();
  }

  function tick(now) {
    if (!playing || destroyed) return;
    if (!lastFrameAt) lastFrameAt = now;
    elapsedMs += Math.min(64, now - lastFrameAt);
    lastFrameAt = now;

    if (elapsedMs >= durationMs()) {
      renderAt(durationMs(), true);
      pause();
      return;
    }

    renderAt(elapsedMs);
    frameId = requestAnimationFrame(tick);
  }

  function play() {
    if (reducedQuery.matches || captureTime != null || playing) return;
    if (elapsedMs >= durationMs()) renderAt(0, true);
    playing = true;
    lastFrameAt = 0;
    stage.dataset.playing = "true";
    updateControls();
    frameId = requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrameAt = 0;
    stage.dataset.playing = "false";
    updateControls();
  }

  function seek(milliseconds) {
    renderAt(milliseconds, true);
  }

  function selectCut(nextCut) {
    if (!CUTS[nextCut]) return;
    pause();
    cut = nextCut;
    timeline = buildTimeline(cut);
    if (nextCut === "founder") displayMode = "founder";
    if (nextCut === "animated") displayMode = "animated";
    mountedIndex = -1;
    currentNode?.remove();
    currentNode = null;
    renderAt(0, true);
  }

  function selectMode(nextMode) {
    const normalized = nextMode === "founder" ? "founder" : "animated";
    if (normalized === displayMode) return;
    displayMode = normalized;
    mountedIndex = -1;
    currentNode?.remove();
    currentNode = null;
    renderAt(elapsedMs, true);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      wasPlayingBeforeHidden = playing;
      pause();
    } else if (wasPlayingBeforeHidden) {
      wasPlayingBeforeHidden = false;
      play();
    }
  }

  function onReducedMotionChange() {
    pause();
    renderAt(elapsedMs, true);
  }

  function destroy() {
    destroyed = true;
    pause();
    window.clearTimeout(settleTimer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    reducedQuery.removeEventListener?.("change", onReducedMotionChange);
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  reducedQuery.addEventListener?.("change", onReducedMotionChange);

  controls?.play.addEventListener("click", () => (playing ? pause() : play()));
  controls?.previous.addEventListener("click", () => {
    const { index } = locateBeat(timeline, elapsedMs);
    seek(timeline[Math.max(0, index - 1)].startMs);
  });
  controls?.next.addEventListener("click", () => {
    const { index } = locateBeat(timeline, elapsedMs);
    seek(timeline[Math.min(timeline.length - 1, index + 1)].startMs);
  });
  controls?.range.addEventListener("input", (event) => seek(Number(event.currentTarget.value)));
  controls?.cut.addEventListener("change", (event) => selectCut(event.currentTarget.value));
  controls?.mode.addEventListener("change", (event) => selectMode(event.currentTarget.value));

  stage.dataset.ready = "true";
  stage.dataset.playing = "false";
  stage.dataset.mode = displayMode;

  if (captureTime != null) {
    renderAt(captureTime, true);
    stage.dataset.captureReady = "true";
  } else {
    renderAt(0, true);
  }

  return {
    play,
    pause,
    seek,
    selectCut,
    selectMode,
    destroy,
    getState: () => ({ cut, mode: displayMode, elapsedMs, playing, durationMs: durationMs() }),
  };
}

function bootstrap() {
  const stage = document.querySelector("#film-stage");
  if (!stage) return;

  const params = new URLSearchParams(window.location.search);
  const cutName = params.get("cut") || "animated";
  const mode = params.get("mode") || (cutName === "founder" ? "founder" : "animated");
  const captureTime = parseCaptureTime(params.get("captureTime"));
  const aspect = params.get("aspect");
  if (["square", "vertical"].includes(aspect)) document.body.dataset.aspect = aspect;

  const controls = {
    play: document.querySelector("#film-play"),
    previous: document.querySelector("#film-previous"),
    next: document.querySelector("#film-next"),
    range: document.querySelector("#film-range"),
    time: document.querySelector("#film-time"),
    cut: document.querySelector("#film-cut"),
    mode: document.querySelector("#film-mode"),
  };

  const player = createFilmPlayer({
    stage,
    caption: document.querySelector("#film-caption"),
    controls,
    cutName,
    mode,
    captureTime,
  });

  const transcript = document.querySelector("#film-transcript-copy");
  MASTER_NARRATION.split(/\n\s*\n/).forEach((paragraph) => {
    const node = document.createElement("p");
    node.textContent = paragraph;
    transcript.append(node);
  });

  window.MolarFilm = player;
}

bootstrap();
