import { CUTS, FOUNDER_BEATS, PRODUCT_SCENES } from "./scene-manifest.js";

const beats = new Map([...PRODUCT_SCENES, ...FOUNDER_BEATS].map((beat) => [beat.id, beat]));

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
