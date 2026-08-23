import { el, sceneShell } from "./primitives.js";

function progressValue(progress) {
  return String(Math.max(0, Math.min(1, progress)));
}

export function renderFounderBeat(beat, progress = 0) {
  const { shell, object } = sceneShell(beat.copy, beat.id);
  shell.classList.add("founder-beat");
  const media = el("div", "founder-media");
  media.dataset.founderBeat = beat.id;
  media.append(
    el("span", "founder-media__label", "FOUNDER FOOTAGE"),
    el("span", "founder-media__direction", "Bright outdoor location · direct to camera"),
  );
  object.append(media);
  shell.style.setProperty("--scene-progress", progressValue(progress));
  return shell;
}

export function renderAnimatedCopyBeat(beat, progress = 0) {
  const { shell, object } = sceneShell(beat.copy, beat.id);
  shell.classList.add("copy-beat");
  object.append(el("p", "copy-beat__text", beat.copy));
  shell.style.setProperty("--scene-progress", progressValue(progress));
  return shell;
}
