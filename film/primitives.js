export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function card(label, value, state = "neutral") {
  const node = el("div", `film-card film-card--${state}`);
  node.append(
    el("span", "film-card__label", label),
    el("strong", "film-card__value", value),
  );
  return node;
}

export function pill(text, state = "neutral") {
  return el("span", `film-pill film-pill--${state}`, text);
}

export function connector(symbol = "→") {
  const node = el("span", "film-connector", symbol);
  node.setAttribute("aria-hidden", "true");
  return node;
}

export function line(width = "100%", state = "neutral") {
  const node = el("span", `film-line film-line--${state}`);
  node.style.setProperty("--line-width", width);
  return node;
}

export function sceneShell(label, sceneId) {
  const shell = el("section", "film-scene");
  shell.setAttribute("aria-label", label);
  if (sceneId) shell.dataset.scene = sceneId;
  const object = el("div", "film-object");
  shell.append(object);
  return { shell, object };
}
