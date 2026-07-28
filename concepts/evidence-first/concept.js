const root = document.documentElement;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuLabel = menuToggle?.querySelector(".sr-only");

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuToggle || !mobileMenu) return;

  const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.hidden = true;
  if (menuLabel) menuLabel.textContent = "Open navigation";
  if (restoreFocus && wasOpen) menuToggle.focus();
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
      return;
    }

    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.hidden = false;
    if (menuLabel) menuLabel.textContent = "Close navigation";
    mobileMenu.querySelector("a")?.focus();
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu({ restoreFocus: true });
  });
}

for (const copyButton of document.querySelectorAll("[data-copy-target]")) {
  const originalLabel = copyButton.textContent;
  const copyStatus =
    copyButton.closest("[data-copy-group]")?.querySelector("[data-copy-status]") ??
    document.querySelector("[data-copy-status]");

  copyButton.addEventListener("click", async () => {
    const targetId = copyButton.dataset.copyTarget;
    const target = targetId ? document.getElementById(targetId) : null;
    const text = target?.textContent?.trim() ?? "";

    try {
      if (!text || !navigator.clipboard?.writeText) throw new Error("Copy unavailable");
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Copied";
      if (copyStatus) copyStatus.textContent = "Content copied to clipboard.";
    } catch {
      if (copyStatus) {
        copyStatus.textContent = "Copy unavailable. Select the content manually.";
      }
    }

    window.setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1600);
  });
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = [...document.querySelectorAll("[data-reveal]")];

if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  reveals.forEach((element) => observer.observe(element));
}

root.classList.add("concept-ready");
