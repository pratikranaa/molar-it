/* molar.it/v4 — interactive demo + chrome behaviors */
(() => {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  /* ---------- nav chrome ---------- */
  const nav = document.querySelector("[data-nav]");
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuBtn?.addEventListener("click", () => {
    const open = mobileNav?.hasAttribute("hidden") ?? true;
    if (!mobileNav) return;
    if (open) {
      mobileNav.removeAttribute("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
    } else {
      mobileNav.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileNav.setAttribute("hidden", "");
      menuBtn?.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- scroll reveal ---------- */
  const reveals = [...document.querySelectorAll("[data-reveal]")];
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- accordion: one open at a time (GraspNote feel) ---------- */
  const accordion = document.querySelector("[data-accordion]");
  accordion?.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      accordion.querySelectorAll("details").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- hero interactive demo ---------- */
  const SCENES = {
    verify: {
      url: 'molar verify "login works" --url localhost:3000',
      render(root, step) {
        const steps = [
          "Launch stealth browser · viewport 1440×900",
          "Open localhost:3000/login",
          "Fill credentials · assert dashboard",
          "PASS · screenshots + Trace ready",
        ];
        root.innerHTML = `
          <div class="demo-scene">
            <span class="demo-status ${step < 3 ? "is-run" : ""}"><i></i>${step < 3 ? "Running Instant Proof" : "Verified"}</span>
            <p class="demo-claim">A user can sign in and reach the dashboard.</p>
            <ol class="demo-steps">
              ${steps
                .map((label, i) => {
                  const state = i < step ? "is-done" : i === step ? "is-on" : "";
                  return `<li class="${state}"><span class="dot" aria-hidden="true"></span><span>${label}</span></li>`;
                })
                .join("")}
            </ol>
          </div>`;
      },
      max: 4,
      dwell: 1100,
    },
    agent: {
      url: "mcp · molar_run_task → molar_live_view",
      render(root, step) {
        const bubbles = [
          { role: "user", html: "I just changed checkout rounding. Verify total is still $9.00 on the preview." },
          { role: "agent", html: "Calling <code>molar_verify</code> on the preview URL…" },
          { role: "agent", html: "Live view ready. Asserting receipt total…" },
          { role: "agent", html: "<strong>PASS</strong> · expected $9.00 · got $9.00 · Trace attached." },
        ];
        const visible = bubbles.slice(0, Math.min(bubbles.length, step + 1));
        root.innerHTML = `
          <div class="demo-scene demo-chat">
            <span class="demo-status ${step < 3 ? "is-run" : ""}"><i></i>${step < 3 ? "Agent loop" : "Evidence returned"}</span>
            ${visible
              .map((b) => `<div class="bubble bubble-${b.role}">${b.html}</div>`)
              .join("")}
          </div>`;
      },
      max: 4,
      dwell: 1200,
    },
    guard: {
      url: "github.com/acme/checkout · PR #421",
      render(root, step) {
        const rows = [
          { label: "Check run · preview URL", pill: "pill-run", text: "running", until: 0 },
          { label: "checkout total", pill: "pill-fail", text: "expected $9 · got $90", until: 1 },
          { label: "merge status", pill: "pill-block", text: "blocked", until: 2 },
          { label: "Mender", pill: "pill-pass", text: "draft fix + Trace", until: 3 },
        ];
        root.innerHTML = `
          <div class="demo-scene demo-pr">
            <span class="demo-status ${step < 2 ? "is-run" : "is-fail"}"><i></i>${step < 2 ? "Guard check running" : "Merge blocked"}</span>
            <p class="demo-claim">PR #421 · coupon discount</p>
            ${rows
              .filter((r) => step >= r.until)
              .map(
                (r) => `
              <div class="pr-line">
                <span>${r.label}</span>
                <span class="pill ${r.pill}">${r.text}</span>
              </div>`
              )
              .join("")}
          </div>`;
      },
      max: 4,
      dwell: 1150,
    },
  };

  const demoRoot = document.querySelector("[data-demo]");
  if (!demoRoot) return;

  const panel = demoRoot.querySelector("[data-demo-panel]");
  const urlEl = demoRoot.querySelector(".demo-url");
  const tabs = [...demoRoot.querySelectorAll("[data-demo-tab]")];
  let tab = "verify";
  let step = 0;
  let timer = 0;

  const paint = () => {
    const scene = SCENES[tab];
    if (!scene || !panel) return;
    if (urlEl) urlEl.textContent = scene.url;
    scene.render(panel, step);
  };

  const clearTimer = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
  };

  const advance = () => {
    clearTimer();
    const scene = SCENES[tab];
    if (!scene) return;
    if (reduced) {
      step = scene.max - 1;
      paint();
      return;
    }
    paint();
    timer = window.setTimeout(() => {
      step = (step + 1) % scene.max;
      advance();
    }, scene.dwell);
  };

  const setTab = (next) => {
    if (!SCENES[next]) return;
    tab = next;
    step = 0;
    tabs.forEach((btn) => {
      const active = btn.getAttribute("data-demo-tab") === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    advance();
  };

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.getAttribute("data-demo-tab") || "verify"));
  });

  demoRoot.addEventListener("mouseenter", clearTimer);
  demoRoot.addEventListener("mouseleave", () => {
    if (!reduced) advance();
  });

  setTab("verify");
})();
