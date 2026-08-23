import { card, connector, el, line, pill, sceneShell } from "./primitives.js";

function finish(shell, sceneId, progress) {
  shell.classList.add(sceneId);
  shell.style.setProperty("--scene-progress", String(Math.max(0, Math.min(1, progress))));
  return shell;
}

function stack(...children) {
  const node = el("div", "film-stack");
  node.append(...children);
  return node;
}

function browserShell(pathname) {
  const browser = el("div", "mini-browser");
  const chrome = el("div", "mini-browser__chrome");
  const dots = el("span", "mini-browser__dots", "●  ●  ●");
  const address = el("span", "mini-browser__address", pathname);
  const page = el("div", "mini-browser__page");
  chrome.append(dots, address);
  browser.append(chrome, page);
  return { browser, page };
}

function field(labelText, value, className = "") {
  const node = el("div", `film-field ${className}`.trim());
  node.append(el("span", "film-field__label", labelText), el("span", "film-field__value", value));
  return node;
}

export function renderScene01(progress = 0) {
  const { shell, object } = sceneShell(
    "15 million users; 500,000 daily operations; reliability improves from 92 percent to 99.8 percent",
    "scene-01",
  );
  const panel = el("div", "metric-panel");
  const scale = el("div", "metric-panel__scale");
  scale.append(
    stack(pill("PLATFORM REACH"), el("strong", "metric-number", "15M"), el("span", "metric-copy", "people")),
    stack(pill("DAILY SYNC LOAD"), el("strong", "metric-number", "500K+"), el("span", "metric-copy", "operations")),
  );
  const reliability = el("div", "reliability");
  reliability.append(
    el("div", "reliability__labels", "92%                                  99.8%"),
    el("div", "reliability__track"),
    el("div", "reliability__fill"),
  );
  panel.append(scale, reliability);
  object.append(panel);
  return finish(shell, "scene-01", progress);
}

export function renderScene02(progress = 0) {
  const { shell, object } = sceneShell(
    "Browser passes while the downstream LMS record disagrees",
    "scene-02",
  );
  object.append(
    card("BROWSER", "PASS", "pass"),
    connector("≠"),
    card("LMS RECORD", "WRONG", "fail"),
  );
  return finish(shell, "scene-02", progress);
}

export function renderScene03(progress = 0) {
  const { shell, object } = sceneShell("Molar. QA for integration-heavy web apps.", "scene-03");
  const lockup = el("div", "film-lockup");
  const wordmark = el("div", "film-wordmark", "Molar");
  wordmark.append(el("span", "film-wordmark__dot", "."));
  lockup.append(wordmark, el("p", "film-lockup__category", "QA for integration-heavy web apps."));
  object.append(lockup);
  return finish(shell, "scene-03", progress);
}

export function renderScene04(progress = 0) {
  const { shell, object } = sceneShell("A URL is entered into Molar", "scene-04");
  const input = field("URL", "https://staging.acme.dev", "film-field--url");
  input.append(el("span", "typing-caret", ""));
  object.append(input);
  return finish(shell, "scene-04", progress);
}

export function renderScene05(progress = 0) {
  const { shell, object } = sceneShell("The intended signup and upgrade outcome is described", "scene-05");
  const input = field(
    "OUTCOME",
    "Sign up, verify the email, and upgrade to Pro.",
    "film-field--outcome",
  );
  input.append(el("span", "typing-caret", ""));
  object.append(input);
  return finish(shell, "scene-05", progress);
}

export function renderScene06(progress = 0) {
  const { shell, object } = sceneShell("The signup form completes and the account is created", "scene-06");
  const { browser, page } = browserShell("staging.acme.dev/signup");
  const form = el("div", "signup-form");
  form.append(
    el("strong", "mini-heading", "Create your account"),
    field("WORK EMAIL", "pratik+film@acme.test"),
    field("PASSWORD", "••••••••••••"),
    el("span", "mini-button", "Create account"),
    pill("ACCOUNT CREATED", "proof"),
  );
  page.append(form);
  object.append(browser);
  return finish(shell, "scene-06", progress);
}

export function renderScene07(progress = 0) {
  const { shell, object } = sceneShell("A verification email arrives and its link opens", "scene-07");
  const inbox = el("div", "inbox-card");
  const header = el("div", "inbox-card__header");
  header.append(el("span", "inbox-card__title", "Inbox"), pill("1 NEW", "proof"));
  const message = el("div", "inbox-message");
  message.append(
    el("span", "inbox-message__from", "Acme"),
    el("strong", "inbox-message__subject", "Verify your email"),
    el("span", "inbox-message__preview", "One click and you're ready to go."),
    el("span", "verify-link", "Verify email  →"),
  );
  inbox.append(header, message);
  object.append(inbox);
  return finish(shell, "scene-07", progress);
}

export function renderScene08(progress = 0) {
  const { shell, object } = sceneShell("Checkout completes against a safe stateful service", "scene-08");
  const checkout = el("div", "checkout-card");
  checkout.append(
    el("div", "checkout-card__top", "Upgrade to Pro"),
    stack(el("span", "checkout-price", "$99"), el("span", "checkout-cycle", "per month")),
    field("CARD", "4242 4242 4242 4242"),
    el("span", "mini-button mini-button--wide", "Upgrade"),
    pill("SAFE SERVICE WORLD", "proof"),
  );
  object.append(checkout);
  return finish(shell, "scene-08", progress);
}

export function renderScene09(progress = 0) {
  const { shell, object } = sceneShell("The browser displays Welcome to Pro", "scene-09");
  const success = el("div", "success-card evidence-anchor");
  success.append(
    el("span", "success-mark", "✓"),
    el("strong", "success-title", "Welcome to Pro"),
    el("span", "success-copy", "Your upgrade is complete."),
    pill("BROWSER · PASS", "proof"),
  );
  object.append(success);
  return finish(shell, "scene-09", progress);
}

export function renderScene10(progress = 0) {
  const { shell, object } = sceneShell(
    "Visible success unfolds into payment, webhook, and application state",
    "scene-10",
  );
  const chain = el("div", "evidence-chain");
  chain.append(
    card("BROWSER", "PRO", "pass"),
    connector(),
    card("PAYMENT", "RECORDED", "pass"),
    connector(),
    card("WEBHOOK", "DELIVERING"),
    connector(),
    card("APP STATE", "CHECKING"),
  );
  object.append(chain);
  return finish(shell, "scene-10", progress);
}
