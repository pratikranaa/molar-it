function timestamp(milliseconds, decimal = ".") {
  const safe = Math.max(0, Math.round(milliseconds));
  const hours = Math.floor(safe / 3_600_000);
  const minutes = Math.floor((safe % 3_600_000) / 60_000);
  const seconds = Math.floor((safe % 60_000) / 1000);
  const millis = safe % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}${decimal}${String(millis).padStart(3, "0")}`;
}

export function validateCaptionCues(cues, durationMs) {
  const errors = [];
  cues.forEach((cue, index) => {
    const number = index + 1;
    if (!cue.text?.trim()) errors.push(`cue ${number} is empty`);
    if (cue.endMs < cue.startMs) errors.push(`cue ${number} ends before it starts`);
    if (cue.endMs > durationMs) errors.push(`cue ${number} exceeds duration`);
    if (index > 0 && cue.startMs < cues[index - 1].endMs) errors.push(`cue ${number} overlaps cue ${index}`);
    if (index > 0 && cue.startMs > cues[index - 1].endMs) errors.push(`cue ${number} leaves a gap`);
  });
  return errors;
}

function bounded(cues, durationMs) {
  const sourceDuration = Math.max(durationMs, cues.at(-1)?.endMs || 0);
  const errors = validateCaptionCues(cues, sourceDuration);
  if (errors.length) throw new Error(`Invalid caption track: ${errors.join("; ")}`);
  return cues.filter((cue) => cue.startMs < durationMs);
}

export function renderWebVtt(cues, durationMs) {
  const blocks = bounded(cues, durationMs).map((cue, index) =>
    `${index + 1}\n${timestamp(cue.startMs)} --> ${timestamp(Math.min(cue.endMs, durationMs))}\n${cue.text.replaceAll("-->", "→")}`,
  );
  return `WEBVTT\n\n${blocks.join("\n\n")}\n`;
}

export function renderSrt(cues, durationMs) {
  const blocks = bounded(cues, durationMs).map((cue, index) =>
    `${index + 1}\n${timestamp(cue.startMs, ",")} --> ${timestamp(Math.min(cue.endMs, durationMs), ",")}\n${cue.text.replaceAll("-->", "→")}`,
  );
  return `${blocks.join("\n\n")}\n`;
}
