import { card, connector, el, line, pill, sceneShell } from "./primitives.js";

function finish(shell, sceneId, progress) {
  shell.classList.add(sceneId);
  shell.style.setProperty("--scene-progress", String(Math.max(0, Math.min(1, progress))));
  return shell;
}

function row(...children) {
  const node = el("div", "film-row");
  node.append(...children);
  return node;
}

export function renderScene11(progress = 0) {
  const { shell, object } = sceneShell("The payment amount, event, and customer agree", "scene-11");
  const receipt = el("div", "payment-receipt");
  receipt.append(
    row(pill("PAYMENT · RECORDED", "proof"), el("span", "receipt-time", "just now")),
    el("strong", "receipt-amount", "$99.00"),
    row(el("span", "receipt-key", "event"), el("span", "receipt-value", "checkout.completed")),
    row(el("span", "receipt-key", "customer"), el("span", "receipt-value", "pratik+film@acme.test")),
  );
  object.append(receipt);
  return finish(shell, "scene-11", progress);
}

export function renderScene12(progress = 0) {
  const { shell, object } = sceneShell("The webhook returns HTTP 500", "scene-12");
  const event = el("div", "webhook-card");
  event.append(
    row(pill("WEBHOOK · 500", "fail"), el("span", "receipt-time", "312 ms")),
    el("strong", "webhook-event", "checkout.completed"),
    line("100%", "fail"),
    el("span", "webhook-error", "Subscription update failed"),
  );
  object.append(event);
  return finish(shell, "scene-12", progress);
}

export function renderScene13(progress = 0) {
  const { shell, object } = sceneShell(
    "Browser says Pro while the subscription record disagrees and says Free",
    "scene-13",
  );
  object.append(
    card("BROWSER · PRO", "VISIBLE SUCCESS", "pass"),
    connector("≠"),
    card("SUBSCRIPTION · FREE", "BUSINESS FAILURE", "fail"),
  );
  return finish(shell, "scene-13", progress);
}

export function renderScene14(progress = 0) {
  const { shell, object } = sceneShell("Molar returns one failed verdict backed by evidence", "scene-14");
  const verdict = el("div", "verdict-card");
  verdict.append(
    el("span", "verdict-mark", "!"),
    pill("VERDICT · FAILED", "fail"),
    el("strong", "verdict-title", "The visible and service outcomes disagree."),
    el("span", "verdict-detail", "Browser: Pro  ·  Subscription: Free"),
  );
  object.append(verdict);
  return finish(shell, "scene-14", progress);
}

export function renderScene15(progress = 0) {
  const { shell, object } = sceneShell("Recording, trace, HAR, and screenshots file into the run", "scene-15");
  const bundle = el("div", "evidence-bundle");
  bundle.append(
    card("RECORDING", "02:13"),
    card("TRACE", "184 EVENTS"),
    card("HAR", "31 REQUESTS"),
    card("SCREENSHOTS", "8 FRAMES"),
  );
  const file = el("div", "run-file");
  file.append(pill("RUN 7CF2", "proof"), el("strong", "run-file__title", "Evidence filed together"));
  object.append(bundle, file);
  return finish(shell, "scene-15", progress);
}

export function renderScene16(progress = 0) {
  const { shell, object } = sceneShell("The pull request is blocked before a customer finds the bug", "scene-16");
  const check = el("div", "pull-check");
  check.append(
    row(el("strong", "pull-check__title", "Molar · critical flow"), pill("FAILED", "fail")),
    el("span", "pull-check__copy", "Browser and subscription outcomes disagree"),
    el("span", "pull-check__rule", ""),
    row(el("span", "pull-check__merge", "Merge blocked"), el("span", "pull-check__icon", "⊘")),
  );
  object.append(check);
  return finish(shell, "scene-16", progress);
}

export function renderScene17(progress = 0) {
  const { shell, object } = sceneShell("A one-line fix lands and the same journey restarts", "scene-17");
  const diff = el("div", "fix-card");
  diff.append(
    pill("subscription.ts · 1 LINE", "proof"),
    el("code", "fix-line fix-line--old", "− return res.status(500).end()"),
    el("code", "fix-line fix-line--new", "+ await subscriptions.activate(customer)"),
  );
  object.append(diff, connector("→"), card("SAME FLOW", "RERUNNING", "pass"));
  return finish(shell, "scene-17", progress);
}

export function renderScene18(progress = 0) {
  const { shell, object } = sceneShell(
    "Browser, payment, webhook, and application state all agree",
    "scene-18",
  );
  const chain = el("div", "proof-chain");
  chain.append(
    card("BROWSER", "PRO", "pass"),
    connector(),
    card("PAYMENT", "$99", "pass"),
    connector(),
    card("WEBHOOK", "200", "pass"),
    connector(),
    card("APP STATE", "PRO", "pass"),
  );
  chain.append(el("span", "proof-chain__fill", ""));
  object.append(chain);
  return finish(shell, "scene-18", progress);
}

export function renderScene19(progress = 0) {
  const { shell, object } = sceneShell("Release evidence is remembered against exact commits", "scene-19");
  const memory = el("div", "memory-card");
  memory.append(
    row(el("strong", "memory-card__title", "Verification Memory"), pill("main · 7cf2a9", "proof")),
    row(pill("PASSED", "proof"), el("span", "memory-flow", "Signup → verify → upgrade")),
    row(pill("STALE"), el("span", "memory-flow", "Cancel subscription")),
    row(pill("UNTESTED"), el("span", "memory-flow", "Update billing address")),
  );
  object.append(memory);
  return finish(shell, "scene-19", progress);
}

export function renderScene20(progress = 0) {
  const { shell, object } = sceneShell("A coding agent invokes Molar and receives structured proof", "scene-20");
  const result = el("div", "agent-result");
  result.append(
    el("code", "agent-command", "molar verify \"upgrade works\""),
    row(pill("PASS", "proof"), el("span", "agent-result__meta", "run_7cf2 · commit 7cf2a9")),
    el("code", "agent-json", '{ "browser": "pro", "subscription": "pro", "evidence": 4 }'),
  );
  object.append(card("CODING AGENT", "CHANGE READY"), connector("→"), result);
  return finish(shell, "scene-20", progress);
}
