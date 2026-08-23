import { CUTS, FOUNDER_BEATS, PRODUCT_SCENES } from "./scene-manifest.js";
import {
  LAUNCH_CAPTION_CUES,
  LAUNCH_CLOSE_BEAT,
  LAUNCH_FOUNDER_BEATS,
  LAUNCH_PRODUCT_BEATS,
} from "./launch-manifest.js";

const beats = new Map([
  ...PRODUCT_SCENES,
  ...FOUNDER_BEATS,
  ...LAUNCH_PRODUCT_BEATS,
  ...LAUNCH_FOUNDER_BEATS,
  LAUNCH_CLOSE_BEAT,
].map((beat) => [beat.id, beat]));

export function buildTimeline(cutName = "animated") {
  const ids = CUTS[cutName] || CUTS.animated;
  let cursor = 0;

  return ids.map((id, index) => {
    const beat = beats.get(id);
    if (!beat) throw new Error(`Unknown film beat: ${id}`);
    const entry = {
      ...beat,
      index,
      startMs: cursor,
      endMs: cursor + beat.durationMs,
    };
    cursor = entry.endMs;
    return entry;
  });
}

export function locateBeat(timeline, elapsedMs) {
  if (!timeline.length) throw new Error("Cannot locate a beat in an empty timeline");

  const last = timeline.at(-1);
  const safe = Number.isFinite(elapsedMs)
    ? Math.min(last.endMs, Math.max(0, elapsedMs))
    : last.endMs;
  const found = timeline.findIndex((beat) => safe < beat.endMs);
  const index = found === -1 ? timeline.length - 1 : found;
  const beat = timeline[index];

  return {
    beat,
    index,
    localMs: Math.min(beat.durationMs, Math.max(0, safe - beat.startMs)),
  };
}

export function parseCaptureTime(value) {
  if (value == null || value === "") return null;
  const text = String(value).trim();
  const amount = text.endsWith("s") ? Number.parseFloat(text) * 1000 : Number.parseInt(text, 10);
  return Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : null;
}

export function captionAt(cues, elapsedMs) {
  if (!cues.length) return null;
  const safe = Math.max(0, Number.isFinite(elapsedMs) ? elapsedMs : 0);
  return cues.find((cue) => safe >= cue.startMs && safe < cue.endMs) || cues.at(-1);
}

export function captionTrackForCut(cutName, timeline) {
  if (cutName === "launch") return LAUNCH_CAPTION_CUES;
  return timeline.map((beat) => ({
    startMs: beat.startMs,
    endMs: beat.endMs,
    text: beat.caption || beat.copy,
  }));
}
