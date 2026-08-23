import { connector, el, pill, sceneShell } from "./primitives.js";

function finish(shell, className, progress) {
  shell.classList.add(className);
  shell.style.setProperty("--scene-progress", String(Math.max(0, Math.min(1, progress))));
  return shell;
}

export function renderLaunchMemoryAgent(progress = 0) {
  const { shell, object } = sceneShell(
    "Verification Memory grows by commit and returns structured proof to a coding agent",
    "launch-memory-agent",
  );
  const memory = el("div", "launch-memory");
  memory.append(
    el("strong", "launch-memory__title", "Verification Memory"),
    el("span", "launch-memory__commit", "main · 7cf2a9"),
    pill("PASSED · signup → verify → upgrade", "proof"),
    pill("STALE · cancel subscription"),
    pill("UNTESTED · billing address"),
  );
  const result = el("div", "launch-agent-proof");
  result.append(
    el("code", "agent-command", "molar verify \"upgrade works\""),
    pill("PASS · EVIDENCE 4", "proof"),
    el("code", "agent-json", '{ "commit": "7cf2a9", "proof": "independent" }'),
  );
  object.append(memory, connector("→"), result);
  return finish(shell, "launch-memory-agent", progress);
}

export function renderLaunchClose(progress = 0) {
  const { shell, object } = sceneShell("Molar. Ship the change. Know the outcome.", "launch-close");
  const lockup = el("div", "launch-close-lockup");
  const wordmark = el("div", "film-wordmark", "Molar");
  wordmark.append(el("span", "film-wordmark__dot", "."));
  lockup.append(wordmark, el("p", "launch-close-copy", "Ship the change. Know the outcome."));
  object.append(lockup);
  return finish(shell, "launch-close", progress);
}
