// molar.it homepage v3 — self-contained (pairs with home.css).
// Other pages keep nav.jsx/sections.jsx/styles.css; do not load those here.

const CALENDLY_URL = 'https://calendly.com/pratikrana/30min';

function openCalendly(e) {
  if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

/* ---------- reveal-on-scroll ---------- */
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`rv${seen ? ' rv-in' : ''} ${className}`}
      style={{ '--rv-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- nav ---------- */
function HomeNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = [
    ['#product', 'Product'],
    ['#how', 'How it works'],
    ['#clones', 'Clones'],
    ['/docs', 'Docs'],
    ['/changelog', 'Changelog'],
  ];
  return (
    <header className={`nv${scrolled ? ' nv-scrolled' : ''}`}>
      <div className="nv-inner">
        <a className="nv-brand" href="/">Molar<span className="dot">.</span></a>
        <nav className="nv-links" aria-label="Primary">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className="nv-cta-row">
          <a className="nv-ghost" href={CALENDLY_URL} onClick={openCalendly}>Book a demo</a>
          <a className="btn btn-primary btn-sm" href="https://app.molar.it">
            Get started <span className="arr">→</span>
          </a>
          <button className="nv-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4.5h12M2 8h12M2 11.5h12" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="nv-menu" aria-label="Mobile">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href={CALENDLY_URL} onClick={(e) => { setOpen(false); openCalendly(e); }}>Book a demo</a>
        </nav>
      )}
    </header>
  );
}

/* ---------- install command ---------- */
function InstallCmd() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText('npx molar-agent init'); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="hero-install">
      <span><span className="pp">$ </span>npx <span className="em">molar-agent</span> init</span>
      <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copy} aria-label="Copy install command">
        {copied ? (
          <><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7" /></svg>Copied</>
        ) : (
          <><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M3 11V3a1 1 0 0 1 1-1h7" /></svg>Copy</>
        )}
      </button>
    </div>
  );
}

/* ---------- hero interactive demo ---------- */
const DEMO_TABS = [
  { id: 'test', label: 'Test a flow', sub: 'Checkout, safely', icon: 'test' },
  { id: 'explore', label: 'Explore your app', sub: 'Map every path', icon: 'explore' },
  { id: 'guard', label: 'Guard releases', sub: 'Block bad deploys', icon: 'guard' },
  { id: 'debug', label: 'Debug failures', sub: 'Replay what broke', icon: 'debug' },
];

const TEST_STEPS = [
  { say: 'Opening the pricing page…', scene: 'pricing', action: 'nav', cursor: { x: 50, y: 55 } },
  { say: 'Typing a throwaway test email.', scene: 'email', action: 'type', cursor: { x: 50, y: 58 }, highlight: 'email' },
  { say: 'Clicking Continue to checkout…', scene: 'email', action: 'click', cursor: { x: 50, y: 73 }, highlight: 'cta' },
  { say: 'Opening the test inbox…', scene: 'confirm', action: 'nav', cursor: { x: 54, y: 35 }, safe: 'No real email sent' },
  { say: 'Clicking the confirm link.', scene: 'confirm', action: 'click', cursor: { x: 54, y: 35 }, highlight: 'inbox' },
  { say: 'Loading checkout…', scene: 'pay', action: 'nav', cursor: { x: 30, y: 38 } },
  { say: 'Entering a test card number.', scene: 'pay', action: 'type', cursor: { x: 30, y: 46 }, highlight: 'card', safe: 'No real card charged' },
  { say: 'Checking the receipt shows $99.00.', scene: 'receipt', action: 'nav', cursor: { x: 52, y: 52 }, highlight: 'total' },
  { say: 'Passed — saved as a Playwright test you own.', scene: 'done', cursor: { x: 50, y: 65 } },
];

const EXPLORE_STEPS = [
  { say: 'Starting at staging.acme.dev like a first-time visitor.', scene: 'home', cursor: { x: 50, y: 40 } },
  { say: 'Clicking through pages and filling forms…', scene: 'crawl', cursor: { x: 65, y: 55 } },
  { say: 'Found checkout, signup, billing — 12 flows total.', scene: 'flows', cursor: { x: 45, y: 35 } },
  { say: 'Turning each flow into a plain-English scenario.', scene: 'scenarios', cursor: { x: 55, y: 50 } },
  { say: 'Exported 6 Playwright tests ready for your CI pipeline.', scene: 'export', cursor: { x: 58, y: 65 } },
];

const GUARD_STEPS = [
  { say: 'New pull request: coupon discount feature.', scene: 'pr', cursor: { x: 40, y: 30 } },
  { say: 'Running checkout against the preview deploy…', scene: 'running', cursor: { x: 50, y: 50 } },
  { say: 'Price mismatch — expected $9.00, got $90.00.', scene: 'fail', cursor: { x: 55, y: 58 }, highlight: 'price' },
  { say: 'Merge blocked. Opening a fix PR automatically.', scene: 'block', cursor: { x: 48, y: 72 } },
];

const DEBUG_STEPS = [
  { say: 'Checkout failed on production. Opening the recording…', scene: 'fail', cursor: { x: 50, y: 35 } },
  { say: 'Rewinding to the moment before it broke.', scene: 'replay', cursor: { x: 42, y: 55 } },
  { say: 'Payment API errored — the page still looked fine.', scene: 'diff', cursor: { x: 58, y: 48 }, highlight: 'api' },
  { say: 'Root cause: coupon rounding bug in discount.ts.', scene: 'cause', cursor: { x: 52, y: 62 } },
];

const DEMO_STEPS = {
  test: TEST_STEPS,
  explore: EXPLORE_STEPS,
  guard: GUARD_STEPS,
  debug: DEBUG_STEPS,
};

const DEMO_GOALS = {
  test: '“Sign up, buy Pro, expect a receipt.”',
  explore: 'Map every critical user path on staging.acme.dev',
  guard: 'Block PR #421 if checkout breaks',
  debug: 'Find why checkout failed in production',
};

const DEMO_URLS = {
  test: (scene) => {
    if (scene === 'confirm') return '/mail/u/0/#inbox';
    if (scene === 'receipt' || scene === 'done') return '/receipt';
    if (scene === 'pay') return '/checkout/pay';
    return '/checkout';
  },
  explore: () => '/',
  guard: () => '/acme/checkout/pull/421',
  debug: () => '/runs/4821',
};

function demoBrowserHost(tab, scene) {
  if (tab === 'guard') return 'github.com';
  if (tab === 'debug') return 'app.molar.it';
  if (tab === 'test' && scene === 'confirm') return 'mail.google.com';
  return 'staging.acme.dev';
}

const DEMO_OUTCOMES = {
  test: { ok: true, label: 'Flow passed', sub: 'Test saved · no real users touched' },
  explore: { ok: true, label: '12 flows mapped', sub: '6 Playwright specs exported' },
  guard: { ok: false, label: 'Merge blocked', sub: 'Bug caught before production' },
  debug: { ok: true, label: 'Bug found', sub: 'discount.ts:42 · coupon rounding' },
};

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

const DEMO_SWAP_MS = 360;

function useDemoTabTransition(defaultTab = 'test') {
  const reduced = useReducedMotion();
  const [tab, setTab] = React.useState(defaultTab);
  const [swapPhase, setSwapPhase] = React.useState('idle');
  const timerRef = React.useRef(0);
  const tabRef = React.useRef(tab);
  tabRef.current = tab;

  React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const changeTab = React.useCallback((next) => {
    if (next === tabRef.current) return;
    window.clearTimeout(timerRef.current);
    if (reduced) {
      setTab(next);
      setSwapPhase('idle');
      return;
    }
    setSwapPhase('leaving');
    timerRef.current = window.setTimeout(() => {
      setTab(next);
      setSwapPhase('entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSwapPhase('idle'));
      });
    }, DEMO_SWAP_MS);
  }, [reduced]);

  return { tab, changeTab, swapPhase, isSwapping: swapPhase !== 'idle' };
}

const SCENE_LAYOUT = {
  test: { pricing: 'form', email: 'form', confirm: 'confirm', pay: 'pay', receipt: 'receipt', done: 'receipt' },
  explore: { home: 'home', crawl: 'crawl', flows: 'list', scenarios: 'list', export: 'export' },
  guard: { pr: 'pr', running: 'running', fail: 'fail', block: 'fail' },
  debug: { fail: 'runfail', replay: 'replay', diff: 'diff', cause: 'diff' },
};

function sceneLayoutKey(tab, scene) {
  return `${tab}-${SCENE_LAYOUT[tab]?.[scene] || scene}`;
}

function useTypedText(text, active, speed = 42) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState(active && reduced ? text : '');

  React.useEffect(() => {
    if (!active) {
      setDisplay('');
      return;
    }
    if (reduced) {
      setDisplay(text);
      return;
    }
    setDisplay('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed, reduced]);

  return display;
}

function useTypedTextProgress(text, active, progress) {
  const reduced = useReducedMotion();
  if (!active) return '';
  if (reduced) return text;
  const typeStart = 0.3;
  if (progress < typeStart) return '';
  const t = (progress - typeStart) / (1 - typeStart);
  const chars = Math.min(text.length, Math.ceil(text.length * Math.min(1, t * 1.02)));
  return text.slice(0, chars);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computeDemoCursor(steps, activeIdx, step, stepFrac) {
  const target = step?.cursor || { x: 50, y: 50 };
  const prev = activeIdx > 0 ? steps[activeIdx - 1]?.cursor : { x: 12, y: 18 };
  const travelEnd = step?.action === 'type' ? 0.3 : step?.action === 'click' ? 0.35 : 0.45;
  const travelT = Math.min(1, stepFrac / travelEnd);
  const eased = easeInOutCubic(travelT);
  const midX = (prev.x + target.x) / 2;
  const midY = Math.min(prev.y, target.y) - Math.abs(target.x - prev.x) * 0.03 - 1.5;

  if (stepFrac < travelEnd) {
    const t = eased;
    return {
      x: (1 - t) * (1 - t) * prev.x + 2 * (1 - t) * t * midX + t * t * target.x,
      y: (1 - t) * (1 - t) * prev.y + 2 * (1 - t) * t * midY + t * t * target.y,
    };
  }

  if (step?.action === 'nav') {
    return { x: target.x, y: target.y };
  }

  if (step?.action === 'type') {
    return { x: target.x, y: target.y };
  }

  if (step?.action === 'click') {
    return { x: target.x, y: target.y };
  }

  const hoverT = stepFrac - travelEnd;
  return {
    x: target.x + Math.sin(hoverT * 9) * 0.15,
    y: target.y + Math.cos(hoverT * 8) * 0.12,
  };
}

function usePageNav(scene, layoutKey, reduced) {
  const [displayScene, setDisplayScene] = React.useState(scene);
  const [navPhase, setNavPhase] = React.useState('idle');
  const prevKeyRef = React.useRef(layoutKey);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prevKeyRef.current = layoutKey;
      setDisplayScene(scene);
      return;
    }
    if (layoutKey === prevKeyRef.current) {
      setDisplayScene(scene);
      return;
    }
    prevKeyRef.current = layoutKey;
    if (reduced) {
      setDisplayScene(scene);
      setNavPhase('idle');
      return;
    }
    setNavPhase('loading');
    const t1 = window.setTimeout(() => {
      setDisplayScene(scene);
      setNavPhase('entering');
    }, 320);
    const t2 = window.setTimeout(() => setNavPhase('idle'), 620);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [scene, layoutKey, reduced]);

  return {
    displayScene,
    navPhase,
    isNavigating: navPhase === 'loading',
  };
}
const DEMO_TIMING = {
  test: { stepMs: 3000, pauseMs: 2800 },
  explore: { stepMs: 2800, pauseMs: 2600 },
  guard: { stepMs: 2900, pauseMs: 2700 },
  debug: { stepMs: 2900, pauseMs: 2700 },
};

function useDemoPlayback(tab, onCycleComplete) {
  const reduced = useReducedMotion();
  const steps = DEMO_STEPS[tab] || DEMO_STEPS.test;
  const total = steps.length;
  const timing = DEMO_TIMING[tab] || { stepMs: 2300, pauseMs: 2500 };
  const cycleMs = Math.max(total * timing.stepMs + timing.pauseMs, 1);
  const [playhead, setPlayhead] = React.useState(reduced ? total : 0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [offscreen, setOffscreen] = React.useState(false);
  const paused = userPaused || offscreen;
  const shellRef = React.useRef(null);
  const tabGen = React.useRef(0);
  const cycleDoneRef = React.useRef(false);
  const elapsedMsRef = React.useRef(0);
  const segmentStartRef = React.useRef(0);

  React.useEffect(() => {
    tabGen.current += 1;
    cycleDoneRef.current = false;
    elapsedMsRef.current = 0;
    setPlayhead(reduced ? total : 0);
    setUserPaused(false);
  }, [tab, reduced, total]);

  React.useEffect(() => {
    const el = shellRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  React.useEffect(() => {
    if (reduced) {
      if (!onCycleComplete || paused) return;
      const remaining = Math.max(cycleMs - elapsedMsRef.current, 0);
      const id = window.setTimeout(() => {
        if (!cycleDoneRef.current) {
          cycleDoneRef.current = true;
          onCycleComplete();
        }
      }, remaining);
      return () => window.clearTimeout(id);
    }
    if (paused) return;

    const gen = tabGen.current;
    segmentStartRef.current = performance.now();
    let raf = 0;

    const tick = (now) => {
      if (tabGen.current !== gen) return;
      const elapsed = elapsedMsRef.current + (now - segmentStartRef.current);
      const stepsPhaseMs = total * timing.stepMs;

      if (elapsed >= cycleMs) {
        elapsedMsRef.current = cycleMs;
        setPlayhead(total + timing.pauseMs / timing.stepMs);
        if (!cycleDoneRef.current && onCycleComplete) {
          cycleDoneRef.current = true;
          onCycleComplete();
        }
        return;
      }

      if (elapsed >= stepsPhaseMs) {
        setPlayhead(total + (elapsed - stepsPhaseMs) / timing.stepMs);
        raf = requestAnimationFrame(tick);
        return;
      }

      setPlayhead(elapsed / timing.stepMs);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      elapsedMsRef.current += performance.now() - segmentStartRef.current;
    };
  }, [tab, reduced, paused, cycleMs, timing.stepMs, timing.pauseMs, total, onCycleComplete]);

  const safePlayhead = Number.isFinite(playhead) ? Math.max(0, playhead) : 0;
  const done = total > 0 && safePlayhead >= total;
  const isPlaying = !paused && !reduced && !done;

  const togglePlay = React.useCallback(() => {
    if (!userPaused && isPlaying) {
      setUserPaused(true);
      return;
    }
    if (safePlayhead >= total) {
      elapsedMsRef.current = 0;
      cycleDoneRef.current = false;
      setPlayhead(0);
    }
    setUserPaused(false);
  }, [userPaused, isPlaying, safePlayhead, total]);

  const activeIdx = total === 0 ? 0 : Math.max(0, Math.min(done ? total - 1 : Math.floor(safePlayhead), total - 1));
  const stepFrac = done ? 1 : safePlayhead - activeIdx;
  const current = steps[activeIdx] || steps[0];
  const next = steps[Math.min(activeIdx + 1, total - 1)] || current;
  const cursor = computeDemoCursor(steps, activeIdx, current, stepFrac);
  const progress = total > 0 ? Math.min(100, (Math.min(safePlayhead, total) / total) * 100) : 0;
  const elapsedSec = Math.floor(Math.min(safePlayhead, total) * (timing.stepMs / 1000));
  const scene = current?.scene || 'pricing';
  const layoutKey = sceneLayoutKey(tab, scene);
  const cursorDown = current.action === 'click' && stepFrac > 0.42 && stepFrac < 0.56;
  const cursorClick = current.action === 'click' && stepFrac > 0.44 && stepFrac < 0.52;
  const isTyping = current.action === 'type' && stepFrac > 0.3 && stepFrac < 0.92;

  return {
    step: activeIdx,
    done,
    steps,
    current,
    activeIdx,
    scene,
    layoutKey,
    shellRef,
    progress,
    cursorClick,
    cursorDown,
    isTyping,
    cursor,
    stepFrac,
    elapsedSec,
    isPlaying,
    userPaused,
    togglePlay,
    reduced,
  };
}

function fmtElapsed(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const DEMO_TAB_TITLES = {
  test: 'Checkout — Acme',
  explore: 'Acme · Dashboard',
  guard: 'PR #421 · acme/checkout',
  debug: 'Run #4821 · Trace',
};

const BROWSER_GHOST_TABS = {
  test: [
    { title: 'Dashboard · Acme', icon: 'site' },
    { title: 'Acme Docs', icon: 'site' },
  ],
  explore: [
    { title: 'Pricing · Acme', icon: 'site' },
    { title: 'Settings · Acme', icon: 'site' },
  ],
  guard: [
    { title: 'acme/checkout', icon: 'gh' },
    { title: 'Actions · acme', icon: 'gh' },
  ],
  debug: [
    { title: 'Runs · Molar', icon: 'molar' },
    { title: 'checkout.spec.ts', icon: 'site' },
  ],
};

const BROWSER_FAVICONS = {
  site: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#e04a2f"/><path d="M9 22V10h5.2c3 0 4.8 1.5 4.8 4s-1.4 3.4-3.5 3.8L20 22h-3.2l-3.6-3.8H12.2V22H9zm3.2-6.6h1.9c1.1 0 1.7-.5 1.7-1.3s-.6-1.3-1.7-1.3h-1.9v2.6z" fill="#fff"/></svg>'),
  gh: 'https://github.githubassets.com/favicons/favicon.png',
  molar: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#e04a2f"/><text x="16" y="21" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">M</text></svg>'),
  gmail: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#fff"/><path fill="#ea4335" d="M6 10h20v12H6z"/><path fill="#34a853" d="M6 22l8-6 8 6"/><path fill="#4285f4" d="M6 10l8 6 8-6"/><path fill="#fbbc04" d="M14 16l-8 6V10l8 6z"/><path fill="#c5221f" d="M18 16l8 6V10l-8 6z"/></svg>'),
};

function browserIconKind(tab, override, scene) {
  if (override) return override;
  if (tab === 'test' && scene === 'confirm') return 'gmail';
  if (tab === 'guard') return 'gh';
  if (tab === 'debug') return 'molar';
  return 'site';
}

function BrowserFavicon({ tab, kind, scene }) {
  const icon = browserIconKind(tab, kind, scene);
  const src = BROWSER_FAVICONS[icon] || BROWSER_FAVICONS.site;
  return (
    <img
      className="browser-tab-favicon"
      src={src}
      width="16"
      height="16"
      alt=""
      aria-hidden
      draggable={false}
    />
  );
}

function demoTabTitle(tab, scene) {
  if (tab === 'test' && scene === 'confirm') return 'Inbox (1) - Gmail';
  if (tab === 'test' && scene === 'pay') return 'Checkout — Acme';
  return DEMO_TAB_TITLES[tab];
}

function DemoBrowserFrame({ tab, scene, title, host, path, children, cursor, isNavigating, navPhase }) {
  const pathDisplay = path || '/';
  const ghosts = BROWSER_GHOST_TABS[tab] || [];
  return (
    <div className={`browser-frame browser-frame--chrome${isNavigating ? ' is-navigating' : ''}`}>
      <div className="browser-chrome-top">
        <div className="browser-dots" aria-hidden><i /><i /><i /></div>
        <div className="browser-tabstrip">
          {ghosts.map((g) => (
            <div key={g.title} className="browser-tab ghost">
              <BrowserFavicon tab={tab} kind={g.icon} />
              <span className="browser-tab-title">{g.title}</span>
            </div>
          ))}
          <div className="browser-tab on">
            <BrowserFavicon tab={tab} scene={scene} />
            <span className="browser-tab-title">{title}</span>
            <span className="browser-tab-close" aria-hidden>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <span className="browser-tab-new" aria-hidden>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className="browser-window-spacer" aria-hidden />
      </div>

      <div className="browser-toolbar">
        <div className="browser-nav" aria-hidden>
          <span className="browser-nav-btn disabled">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10.5 3.5L5.5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="browser-nav-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5.5 3.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={`browser-nav-btn reload${isNavigating ? ' spinning' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.2 8A5.2 5.2 0 1 1 9.8 3.2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
              <path d="M9.5 1.8v2.4h2.4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="browser-nav-btn home">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 7.2 8 3l5 4.2V13H3V7.2z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className={`browser-omnibox${isNavigating ? ' loading' : ''}`}>
          <span className="browser-site-info" aria-hidden title="Connection is secure">
            <svg className="browser-lock" width="13" height="13" viewBox="0 0 12 12" fill="none">
              <path d="M3.5 5V3.75a2.25 2.25 0 0 1 4.5 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="2.25" y="5" width="7.5" height="5.25" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
          <span className="browser-url">
            <span className="browser-url-host">{host}</span>
            <span className="browser-url-path">{pathDisplay}</span>
          </span>
        </div>

        <div className="browser-toolbar-actions" aria-hidden>
          <span className="browser-star">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.4l1.5 3.05 3.35.48-2.42 2.36.57 3.33L8 10.1l-3 1.52.57-3.33-2.42-2.36 3.35-.48L8 2.4z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="browser-ext">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.2a2.8 2.8 0 0 0-2.7 2.1 2.4 2.4 0 0 0-1.5 4.3A2.8 2.8 0 0 0 8 13.8a2.8 2.8 0 0 0 4.2-5.2 2.4 2.4 0 0 0-1.5-4.3A2.8 2.8 0 0 0 8 2.2z" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
          <span className="browser-sidepanel">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 3v10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
          <span className="browser-avatar">P</span>
          <span className="browser-menu">
            <i /><i /><i />
          </span>
        </div>
      </div>
      {isNavigating && <div className="browser-nav-progress" aria-hidden><i /></div>}

      <div className="browser-viewport">
        <div className={`browser-page browser-nav-${navPhase || 'idle'}`}>
          {children}
          {cursor}
        </div>
        {isNavigating && <div className="browser-page-loader" aria-hidden />}
        <div className="browser-scrollbar" aria-hidden>
          <div className="browser-scrollbar-thumb" />
        </div>
      </div>
    </div>
  );
}

function AbSiteHeader({ active }) {
  return (
    <div className="sut-header">
      <span className="sut-logo"><i aria-hidden />acme</span>
      <nav className="sut-nav" aria-hidden>
        <span className={active === 'home' ? 'on' : ''}>Dashboard</span>
        <span className={active === 'pricing' ? 'on' : ''}>Pricing</span>
        <span>Settings</span>
      </nav>
      <span className="sut-env">staging</span>
    </div>
  );
}

function DemoActionLog({ steps, activeIdx, done }) {
  return (
    <ol className="demo-action-log">
      {steps.map((s, i) => {
        const state = done || i < activeIdx ? 'done' : i === activeIdx ? 'on' : '';
        const kind = s.highlight ? (s.safe ? 'clone' : 'click') : i === 0 ? 'nav' : 'act';
        return (
          <li key={i} className={`demo-action${state ? ` ${state}` : ''}`}>
            <span className={`demo-action-kind kind-${kind}`} aria-hidden>
              {kind === 'nav' ? '→' : kind === 'click' ? '◉' : kind === 'clone' ? '⛨' : '·'}
            </span>
            <span className="demo-action-text">{s.say}</span>
            {(state === 'done' || (done && i === steps.length - 1)) && (
              <span className="demo-action-check" aria-hidden>✓</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function DemoTabIcon({ type }) {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'test') {
    return (
      <svg {...common} aria-hidden>
        <path d="M4 3.5v9l7-4.5-7-4.5z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === 'explore') {
    return (
      <svg {...common} aria-hidden>
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
    );
  }
  if (type === 'guard') {
    return (
      <svg {...common} aria-hidden>
        <path d="M8 2.5L3 5v4c0 3.2 2.2 5.5 5 6.5 2.8-1 5-3.3 5-6.5V5L8 2.5z" />
        <path d="M6 8l1.5 1.5L10.5 6" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M3 4h10v8H3z" />
      <path d="M6 7.5h4M6 10h2.5" />
      <circle cx="11.5" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DemoSurfaceTabs({ active, onChange }) {
  return (
    <div className="demo-surface-strip">
      <div className="demo-surface-tabs" role="tablist" aria-label="Product demos">
        {DEMO_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={`demo-surface-tab${active === t.id ? ' on' : ''}`}
            onClick={() => { if (active !== t.id) onChange(t.id); }}
          >
            <span className="demo-surface-tab-icon" aria-hidden>
              <DemoTabIcon type={t.icon} />
            </span>
            <span className="demo-surface-tab-text">
              <span className="demo-surface-tab-name">{t.label}</span>
              <span className="demo-surface-tab-sub">{t.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoChapterProgress({ activeTab, progress }) {
  const activeIdx = DEMO_TABS.findIndex((t) => t.id === activeTab);
  return (
    <div className="demo-chapters" aria-hidden>
      {DEMO_TABS.map((t, i) => (
        <div
          key={t.id}
          className={`demo-chapter${i === activeIdx ? ' on' : ''}${i < activeIdx ? ' done' : ''}`}
        >
          <div
            className="demo-chapter-fill"
            style={{
              width: i < activeIdx ? '100%' : i === activeIdx ? `${progress}%` : '0%',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DemoPlayPause({ playing, onToggle }) {
  return (
    <button
      type="button"
      className="demo-play-btn"
      onClick={onToggle}
      aria-label={playing ? 'Pause demo' : 'Play demo'}
      aria-pressed={playing}
    >
      {playing ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
          <rect x="2.5" y="2" width="3.5" height="10" rx="1" />
          <rect x="8" y="2" width="3.5" height="10" rx="1" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
          <path d="M4 2.5v9l8-4.5-8-4.5z" />
        </svg>
      )}
    </button>
  );
}

function AgentBrowser({ tab, onTabChange, swapPhase, current, done, step, steps, scene, layoutKey, progress, cursorClick, cursorDown, isTyping, cursor, stepFrac, activeIdx, elapsedSec, isPlaying, userPaused, togglePlay, reduced, isSwapping }) {
  const hl = current.highlight;
  const cur = cursor || current.cursor || { x: 50, y: 50 };
  const urlFn = DEMO_URLS[tab];
  const path = typeof urlFn === 'function' ? urlFn(scene) : '';
  const host = demoBrowserHost(tab, scene);
  const { displayScene, navPhase, isNavigating } = usePageNav(scene, layoutKey, reduced);
  const pageScene = displayScene;
  const outcome = DEMO_OUTCOMES[tab];
  const emailFull = 'qa-test@safe.mail';
  const cardFull = '4242 4242 4242 4242';
  const isEmailTyping = tab === 'test' && current.action === 'type' && scene === 'email';
  const isCardTyping = tab === 'test' && current.action === 'type' && scene === 'pay';
  const typedEmail = useTypedTextProgress(emailFull, isEmailTyping, stepFrac);
  const typedCard = useTypedTextProgress(cardFull, isCardTyping, stepFrac);
  const showEmail = scene !== 'email'
    ? 'you@company.com'
    : isEmailTyping
      ? (stepFrac < 0.3 ? 'you@company.com' : typedEmail)
      : emailFull;
  const showCard = isCardTyping
    ? (stepFrac < 0.3 ? '1234 1234 1234 1234' : (typedCard || '1234 1234 1234 1234'))
    : '1234 1234 1234 1234';
  const runId = tab === 'debug' ? '4821' : tab === 'guard' ? 'pr-421' : 'sess-7f2a';
  const pressHl = cursorDown && hl;

  const cursorEl = !done && (
    <>
      {cursorClick && (
        <span
          key={`ripple-${activeIdx}`}
          className="browser-click-ripple"
          style={{ left: `${cur.x}%`, top: `${cur.y}%` }}
          aria-hidden
        />
      )}
      <div
        className={`agent-cursor${cursorClick ? ' click' : ''}${cursorDown ? ' down' : ''}${isTyping ? ' typing' : ''}`}
        style={{ left: `${cur.x}%`, top: `${cur.y}%` }}
        aria-hidden
      >
        <svg width="20" height="24" viewBox="0 0 18 22" fill="none">
          <path d="M1 1L1 16L5.5 12L9 20L11.5 19L8 11.5L14 11L1 1Z" fill="#17150f" stroke="#fff" strokeWidth="1.4"/>
        </svg>
      </div>
    </>
  );

  const statusChip = userPaused && !done ? (
    <span className="demo-pause-chip">Paused</span>
  ) : !done ? (
    <span className="demo-rec"><i className="rec-dot" aria-hidden /> Recording</span>
  ) : (
    <span className={`demo-outcome-chip${outcome.ok ? ' ok' : ' fail'}`}>
      {outcome.ok ? 'Passed' : 'Blocked'}
    </span>
  );

  return (
    <div className={`demo-video${!isPlaying ? ' is-paused' : ''}`} aria-label="Product demo">
      <header className="demo-run-bar">
        <div className="demo-run-left">
          {!reduced && (
            <DemoPlayPause playing={isPlaying} onToggle={togglePlay} />
          )}
          <span className="demo-run-live" aria-hidden>Live</span>
          <span className="demo-run-brand">Molar</span>
          <span className="demo-run-id">run · {runId}</span>
          <span className="demo-run-sep" aria-hidden>·</span>
          <span className="demo-run-timer">{fmtElapsed(elapsedSec)}</span>
        </div>
        <div className="demo-run-right">{statusChip}</div>
      </header>

      <div className={`demo-surface-swap demo-swap-${swapPhase || 'idle'}`}>
      {onTabChange && (
        <DemoSurfaceTabs
          active={tab}
          onChange={(id) => { if (!isSwapping) onTabChange(id); }}
        />
      )}
      <DemoChapterProgress activeTab={tab} progress={progress} />

      <div className="demo-video-main">
        <div className="demo-video-stage">
          <div className="demo-scene-grid" aria-hidden />
          <div className="demo-stage-glow" aria-hidden />
          <div className="demo-stage-tilt">
          <div className={`demo-browser-wrap${done ? (outcome.ok ? ' is-pass' : ' is-fail') : ''}`}>
            <DemoBrowserFrame
              tab={tab}
              scene={scene}
              title={demoTabTitle(tab, scene)}
              host={host}
              path={path}
              isNavigating={isNavigating}
              navPhase={navPhase}
              cursor={cursorEl}
            >
              <div className={`sut-app${
                tab === 'guard' ? ' sut-app--gh' : ''
              }${
                tab === 'debug' ? ' sut-app--trace' : ''
              }${
                tab === 'test' && pageScene === 'confirm' ? ' sut-app--gmail' : ''
              }${
                tab === 'test' && pageScene === 'pay' ? ' sut-app--stripe' : ''
              }`}>
          {tab === 'test' && (
            <>
              {(pageScene === 'pricing' || pageScene === 'email') && (
                <>
                  <AbSiteHeader active="pricing" />
                  <div className="sut-plan-card">
                    <span className="sut-plan-badge">Pro</span>
                    <div className="sut-h">Upgrade to Pro</div>
                    <div className="ab-price">$99<span>/mo</span></div>
                    <ul className="sut-features">
                      <li>Unlimited projects</li>
                      <li>Priority support</li>
                    </ul>
                  </div>
                  <div className={`ab-field${hl === 'email' ? ' hl' : ''}${pressHl === 'email' ? ' pressed' : ''}`}>
                    <label>Work email</label>
                    <div className={`ab-input${isEmailTyping && typedEmail.length < emailFull.length ? ' typing' : ''}`}>
                      {showEmail}
                    </div>
                  </div>
                  <div className={`ab-btn${hl === 'cta' ? ' hl' : ''}${pressHl === 'cta' ? ' pressed' : ''}`}>Continue to checkout</div>
                </>
              )}
              {pageScene === 'confirm' && (
                <div className="gmail-shell">
                  <div className="gmail-top" aria-hidden>
                    <img className="gmail-logo" src={BROWSER_FAVICONS.gmail} width="28" height="28" alt="" />
                    <div className="gmail-search">Search mail</div>
                    <span className="gmail-avatar">Q</span>
                  </div>
                  <div className="gmail-body">
                    <aside className="gmail-rail" aria-hidden>
                      <span className="gmail-compose">Compose</span>
                      <span className="on">Inbox</span>
                      <span>Starred</span>
                      <span>Sent</span>
                    </aside>
                    <div className="gmail-inbox">
                      <div className="gmail-inbox-head">
                        <span>Inbox</span>
                        <span className="sut-mail-badge">1</span>
                      </div>
                      <div className={`gmail-row unread${hl === 'inbox' ? ' hl' : ''}${pressHl === 'inbox' ? ' pressed' : ''}`}>
                        <span className="gmail-row-check" aria-hidden />
                        <span className="gmail-row-star" aria-hidden>☆</span>
                        <span className="gmail-row-from">Acme</span>
                        <span className="gmail-row-subj">Confirm your account</span>
                        <span className="gmail-row-preview">— Click the link to verify your email address…</span>
                        <span className="gmail-row-time">12:04</span>
                      </div>
                      <div className="gmail-row dim">
                        <span className="gmail-row-check" aria-hidden />
                        <span className="gmail-row-star" aria-hidden>☆</span>
                        <span className="gmail-row-from">GitHub</span>
                        <span className="gmail-row-subj">[acme] PR merged</span>
                        <span className="gmail-row-preview">— feat: coupon discount was merged…</span>
                        <span className="gmail-row-time">Mon</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {pageScene === 'pay' && (
                <div className="stripe-shell">
                  <div className="stripe-left">
                    <div className="stripe-brand"><i aria-hidden />acme</div>
                    <div className="stripe-summary">
                      <span className="stripe-label">Subscribe to Pro</span>
                      <div className="stripe-amount">$99.00 <span>/ month</span></div>
                    </div>
                    <div className={`stripe-field${hl === 'card' ? ' hl' : ''}${pressHl === 'card' ? ' pressed' : ''}`}>
                      <label>Card information</label>
                      <div className={`stripe-input stripe-card${isCardTyping && typedCard.length < cardFull.length ? ' typing' : ''}`}>
                        {showCard}
                      </div>
                      <div className="stripe-card-row">
                        <div className="stripe-input">MM / YY</div>
                        <div className="stripe-input">CVC</div>
                      </div>
                      <div className="stripe-card-brands" aria-hidden>
                        <span>VISA</span><span>MC</span><span>AMEX</span>
                      </div>
                    </div>
                    <div className="stripe-field">
                      <label>Name on card</label>
                      <div className="stripe-input">QA Test User</div>
                    </div>
                    <button type="button" className="stripe-pay">Subscribe</button>
                    <p className="stripe-foot">Powered by <strong>Stripe</strong> · Test mode</p>
                  </div>
                  <div className="stripe-right" aria-hidden>
                    <div className="stripe-right-inner">
                      <span className="stripe-right-label">Order summary</span>
                      <div className="stripe-right-line"><span>Pro plan</span><span>$99.00</span></div>
                      <div className="stripe-right-total"><span>Total due today</span><strong>$99.00</strong></div>
                    </div>
                  </div>
                </div>
              )}
              {(pageScene === 'receipt' || pageScene === 'done') && (
                <>
                  <div className="ab-success">✓ Payment successful</div>
                  <div className="sut-receipt">
                    <div className="sut-h">Receipt #INV-20481</div>
                    <div className={`ab-row${hl === 'total' ? ' hl' : ''}${pressHl === 'total' ? ' pressed' : ''}`}>
                      <span>Pro plan · monthly</span><strong>$99.00</strong>
                    </div>
                    <div className="sut-receipt-meta">Paid with test card · clone sandbox</div>
                  </div>
                </>
              )}
            </>
          )}
          {tab === 'explore' && (
            <>
              {pageScene === 'home' && (
                <>
                  <AbSiteHeader active="home" />
                  <div className="sut-dash">
                    <div className="sut-h">Good morning</div>
                    <div className="sut-dash-chart" aria-hidden>
                      <span style={{ height: '42%' }} /><span style={{ height: '68%' }} /><span style={{ height: '55%' }} /><span style={{ height: '80%' }} />
                    </div>
                    <div className="ab-navfake">
                      <span className="on">Home</span><span>Projects</span><span>Settings</span>
                    </div>
                  </div>
                </>
              )}
              {pageScene === 'crawl' && (
                <>
                  <AbSiteHeader active="home" />
                  <div className="sut-crawl">
                    <div className="sut-h">Mapping routes…</div>
                    <div className="ab-scan">
                      <span className="on" /><span className="on" /><span className="on" /><span /><span />
                    </div>
                    <p className="ab-p dim">/pricing · /signup · /billing · /settings</p>
                  </div>
                </>
              )}
              {(pageScene === 'flows' || pageScene === 'scenarios') && (
                <>
                  <div className="sut-h">Discovered flows</div>
                  <ul className="ab-list">
                    {['Checkout', 'Sign up', 'Billing', 'Settings'].map((f, i) => (
                      <li key={f} className={i < (pageScene === 'flows' ? 3 : 4) ? 'on' : ''}>
                        <span className="sut-flow-path">/{f.toLowerCase().replace(' ', '-')}</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {pageScene === 'export' && (
                <>
                  <div className="sut-h">Exported tests</div>
                  <div className="sut-files">
                    <div className="ab-file on"><span className="sut-file-icon">TS</span>checkout.spec.ts</div>
                    <div className="ab-file on"><span className="sut-file-icon">TS</span>signup.spec.ts</div>
                    <div className="ab-file dim">+4 specs in ./tests/e2e/</div>
                  </div>
                </>
              )}
            </>
          )}
          {tab === 'guard' && (
            <div className="gh-shell">
              <div className="gh-header" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path fill="#24292f" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                <span className="gh-repo">acme / <strong>checkout</strong></span>
              </div>
              <div className="gh-pr-tabs" aria-hidden>
                <span className="on">Conversation</span>
                <span>Commits</span>
                <span>Checks</span>
                <span>Files changed</span>
              </div>
              <div className="gh-pr-content">
              {pageScene === 'pr' && (
                <div className="gh-pr">
                  <div className="gh-pr-head">
                    <span className="gh-state">Open</span>
                    <h3 className="gh-pr-title">feat/coupon-discount</h3>
                  </div>
                  <p className="gh-pr-meta">#421 opened by <strong>devon</strong> wants to merge into <code>main</code></p>
                  <div className="gh-diff-stats"><span>+128</span><span>−12</span></div>
                </div>
              )}
              {pageScene === 'running' && (
                <div className="gh-checks">
                  <div className="ab-check run"><i className="spin" /> Molar · checkout flow</div>
                  <div className="ab-check run"><i className="spin" /> Molar · signup flow</div>
                  <div className="gh-check-pending">Waiting for status checks to complete…</div>
                </div>
              )}
              {(pageScene === 'fail' || pageScene === 'block') && (
                <div className="gh-checks">
                  <div className="ab-check fail">✗ checkout.spec.ts — total mismatch</div>
                  <div className={`gh-diff-row${hl === 'price' ? ' hl' : ''}${pressHl === 'price' ? ' pressed' : ''}`}>
                    <span>Expected total</span><code>$9.00</code>
                  </div>
                  <div className="gh-diff-row bad">
                    <span>Preview deploy</span><code>$90.00</code>
                  </div>
                  {pageScene === 'block' && <div className="ab-blocked">All checks have failed — merge blocked</div>}
                </div>
              )}
              </div>
            </div>
          )}
          {tab === 'debug' && (
            <>
              {pageScene === 'fail' && (
                <div className="trace-run">
                  <div className="trace-run-head">
                    <span className="trace-run-id">Run #4821</span>
                    <span className="trace-run-fail">Failed</span>
                  </div>
                  <div className="ab-blocked">checkout.spec.ts · payment step</div>
                </div>
              )}
              {pageScene === 'replay' && (
                <div className="trace-replay">
                  <div className="trace-scrubber"><div className="trace-scrubber-fill" style={{ width: '72%' }} /></div>
                  <div className="ab-timeline">
                    {['Navigate /checkout', 'Fill email', 'Submit payment', 'Assert receipt'].map((s, i) => (
                      <div key={s} className={`ab-tl${i < 3 ? ' on' : ''}${i === 3 ? ' fail' : ''}`}>{s}</div>
                    ))}
                  </div>
                </div>
              )}
              {(pageScene === 'diff' || pageScene === 'cause') && (
                <div className="trace-split">
                  <div className="trace-pane">
                    <span className="trace-pane-label">Browser</span>
                    <div className="trace-pane-ok">Page rendered OK</div>
                  </div>
                  <div className="trace-pane">
                    <span className="trace-pane-label">Network</span>
                    <div className={`ab-alert${hl === 'api' ? ' hl' : ''}${pressHl === 'api' ? ' pressed' : ''}`}>POST /api/charge → 500</div>
                  </div>
                  {pageScene === 'cause' && (
                    <div className="ab-cause">discount.ts:42 — coupon rounding</div>
                  )}
                </div>
              )}
            </>
          )}
              </div>
            </DemoBrowserFrame>
          </div>
          </div>
        </div>

        <aside className="demo-agent-panel" aria-live="polite">
          <div className="demo-agent-head">
            <div className="demo-caption-avatar" aria-hidden>M</div>
            <div className="demo-agent-meta">
              <span className="demo-caption-kicker">Agent</span>
              <span className="demo-agent-step">
                {done ? outcome.label : `Step ${activeIdx + 1} / ${steps.length}`}
              </span>
            </div>
          </div>

          <p className="demo-agent-say">{done ? outcome.sub : current.say}</p>

          {current.safe && !done && (
            <span className="demo-caption-safe">Clone · {current.safe}</span>
          )}

          <DemoActionLog steps={steps} activeIdx={activeIdx} done={done} />

          <div className="demo-agent-track" aria-hidden>
            <div className="demo-progress">
              <div className="demo-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="demo-scenario-card">
            <span className="demo-scenario-label">Scenario</span>
            <p className="demo-scenario-text">{DEMO_GOALS[tab]}</p>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
}

function HeroDemoShell({ tab, onTabChange, onCycleComplete, swapPhase, isSwapping }) {
  const playback = useDemoPlayback(tab, onCycleComplete);
  const meta = DEMO_TABS.find((t) => t.id === tab);

  return (
    <div className="hdemo-shell" ref={playback.shellRef} aria-label={`${meta.label} demo`}>
      <AgentBrowser
        tab={tab}
        onTabChange={onTabChange}
        swapPhase={swapPhase}
        isSwapping={isSwapping}
        {...playback}
      />
    </div>
  );
}

function Hero() {
  const { tab, changeTab, swapPhase, isSwapping } = useDemoTabTransition('test');
  const swappingRef = React.useRef(isSwapping);
  swappingRef.current = isSwapping;
  const advanceDemoTab = React.useCallback(() => {
    if (swappingRef.current) return;
    const i = DEMO_TABS.findIndex((t) => t.id === tab);
    changeTab(DEMO_TABS[(i + 1) % DEMO_TABS.length].id);
  }, [tab, changeTab]);

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden></div>
      <div className="frame hero-copy">
        <Reveal as="h1" delay={0}>
          Your users shouldn't be your <span className="hl">QA team.</span>
        </Reveal>
        <Reveal delay={80}>
          <p className="hero-sub">
            Molar reads your app, writes end-to-end tests, and guards production —
            <strong> without real cards, emails, or user accounts.</strong>
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="hero-cta-row">
            <a className="btn btn-signal" href="https://app.molar.it">Start testing free <span className="arr">→</span></a>
            <a className="btn btn-outline" href="/docs">Read documentation</a>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <div className="hero-trust">
            <span><span className="check">✓</span>60-second setup</span>
            <span><span className="check">✓</span>Safe on production</span>
            <span><span className="check">✓</span>Bring your own LLM key</span>
          </div>
        </Reveal>
      </div>
      <div className="hero-demo-wrap">
        <div className="hero-demo-stage">
          <div className="frame">
            <HeroDemoShell
              tab={tab}
              swapPhase={swapPhase}
              isSwapping={isSwapping}
              onTabChange={changeTab}
              onCycleComplete={advanceDemoTab}
            />
          </div>
        </div>
        <div className="frame hero-install-row">
          <InstallCmd />
          <section className="hero-entry-rail" aria-label="Ways to use Molar">
            <div className="hero-entry-intro">
              <span>One execution graph</span>
              <strong>Four ways in.</strong>
            </div>
            {[
              ['MCP', 'Coding agents'],
              ['CLI', 'Terminal workflows'],
              ['GitHub', 'Release gates'],
              ['Dashboard', 'Live evidence'],
            ].map(([label, detail], index) => (
              <div className="hero-entry" key={label}>
                <span>0{index + 1}</span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}

/* ---------- problem (Linear-style scroll story) ---------- */
const PROBLEM_LEDE = 'Every team shipping software in 2026 stitches together the same broken safety net — a monitor that fires too late, a test suite nobody trusts, and a customer who finds the bug first.';

const PROBLEM_FIGURES = [
  {
    id: 'monitor',
    fig: '1.0',
    nav: 'Monitor',
    title: 'Fires after the damage is done.',
    body: 'By the time an alert wakes you up, a real user has already hit the broken flow. The first bug report comes from a customer, not a system.',
    visual: 'alert',
  },
  {
    id: 'e2e',
    fig: '2.0',
    nav: 'Test',
    title: 'Cover 5% of flows. Rot in weeks.',
    body: 'Engineers write happy-path tests for the feature they just built. Selectors break on the next refactor. The suite gets disabled in CI within a quarter.',
    visual: 'test',
  },
  {
    id: 'users',
    fig: '3.0',
    nav: 'Inbox',
    title: 'Your bug tracker is your inbox.',
    body: 'Most production bugs are reported by paying customers. By the time a ticket lands, the regression is days old and someone is angry.',
    visual: 'inbox',
  },
  {
    id: 'ai',
    fig: '4.0',
    nav: 'Ship',
    title: 'Ships 10× faster than you can verify.',
    body: 'Agents write code that compiles, types, and looks correct — and silently breaks paths nobody thought to test. Reviewers approve. Production discovers.',
    caption: '46% of new code is AI-generated at Copilot-using companies — GitHub, 2026',
    visual: 'ship',
  },
];

function ProblemFigureVisual({ type }) {
  if (type === 'alert') {
    return (
      <div className="pf-ui">
        <div className="pf-ui-bar">
          <div className="pf-ui-dots" aria-hidden><i /><i /><i /></div>
          <span className="pf-ui-app">Sentry · production</span>
          <span className="pf-ui-time">47m late</span>
        </div>
        <div className="pf-ui-body">
          <div className="pf-ui-row">
            <span className="pf-ui-sev">P1</span>
            <span>CheckoutError spike</span>
          </div>
          <div className="pf-ui-timeline" aria-hidden>
            <div className="pf-ui-tl"><span>14:02</span><i className="on user" />First user hits broken checkout</div>
            <div className="pf-ui-tl"><span>14:49</span><i className="on alert" />Alert fires</div>
          </div>
        </div>
      </div>
    );
  }
  if (type === 'test') {
    return (
      <div className="pf-ui pf-ui--terminal">
        <div className="pf-ui-bar">
          <div className="pf-ui-dots" aria-hidden><i /><i /><i /></div>
          <span className="pf-ui-app">CI · checkout.spec.ts</span>
        </div>
        <div className="pf-ui-code">
          <div className="pf-line ok"><span className="pf-glyph">✓</span> opens pricing page</div>
          <div className="pf-line fail"><span className="pf-glyph">✗</span> clicks continue — timeout</div>
          <div className="pf-line dim">locator: getByRole('button', {'{'} name: 'Continue' {'}'})</div>
          <div className="pf-line dim pf-line-gap">1 failed · workflow skipped next run</div>
        </div>
      </div>
    );
  }
  if (type === 'inbox') {
    return (
      <div className="pf-ui">
        <div className="pf-ui-bar">
          <div className="pf-ui-dots" aria-hidden><i /><i /><i /></div>
          <span className="pf-ui-app">Intercom</span>
          <span className="pf-ui-badge">P0</span>
        </div>
        <div className="pf-ui-ticket">
          <div className="pf-ui-ticket-head">
            <span className="pf-ui-avatar" aria-hidden>C</span>
            <div>
              <span className="pf-ui-from">Customer</span>
              <span className="pf-ui-when">2 hours ago</span>
            </div>
          </div>
          <strong>Charged twice after your deploy</strong>
          <p>We were billed $198 instead of $99. This started right after you shipped yesterday.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="pf-ui pf-ui--ship">
      <div className="pf-ui-bar">
        <div className="pf-ui-dots" aria-hidden><i /><i /><i /></div>
        <span className="pf-ui-app">PR #421</span>
        <span className="pf-ui-agent">Agent</span>
      </div>
      <div className="pf-ui-diff">
        <div className="pf-ui-file">discount.ts</div>
        <div className="pf-ui-diff-line add">+ applyCoupon(total, code)</div>
        <div className="pf-ui-diff-line del">− total = round(total * 0.9)</div>
      </div>
      <div className="pf-ui-foot">
        <span className="pf-ui-stat-num">46%</span>
        <span className="pf-ui-stat-label">AI-generated code · merged without flow coverage</span>
      </div>
    </div>
  );
}

const PROBLEM_TILE_SLOTS = [
  { left: 0.5, top: 0.5, w: 49, h: 49.5 },
  { left: 50.5, top: 0.5, w: 49, h: 49.5 },
  { left: 0.5, top: 50, w: 49, h: 49.5 },
  { left: 50.5, top: 50, w: 49, h: 49.5 },
];
const PROBLEM_HERO = { left: 50, top: 50, w: 90, h: 84 };
const PROBLEM_ASSEMBLY_END = 0.88;
const PROBLEM_SEG_HERO = 0.30;
const PROBLEM_SEG_SETTLE = 0.42;
const PROBLEM_MORPH_EASE = (t) => (t < 0.5
  ? 4 * t * t * t
  : 1 - ((-2 * t + 2) ** 3) / 2);
const PROBLEM_SPRING_BASE = { type: 'spring', damping: 26, mass: 1.25, restDelta: 0.00015 };

const FM = typeof window !== 'undefined' ? window.Motion : null;
const motion = FM ? FM.motion : 'div';

function useProblemSmoothProgress(source) {
  const smooth = FM.useMotionValue(0);
  const lastV = React.useRef(0);
  const lastT = React.useRef(performance.now());

  React.useLayoutEffect(() => {
    smooth.set(source.get());
    lastV.current = source.get();
  }, [source, smooth]);

  FM.useMotionValueEvent(source, 'change', (v) => {
    const now = performance.now();
    const dt = Math.max(10, now - lastT.current);
    lastT.current = now;
    const vel = Math.abs(v - lastV.current) / dt;
    lastV.current = v;
    const stiffness = Math.min(200, 38 + vel * 140);
    FM.animate(smooth, v, { ...PROBLEM_SPRING_BASE, stiffness });
  });

  return smooth;
}

function useProblemSmoothProgressLite(trackRef) {
  const [progress, setProgress] = React.useState(0);
  const current = React.useRef(0);
  const lastTarget = React.useRef(0);
  const lastTime = React.useRef(performance.now());

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const target = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));
      const now = performance.now();
      const dt = Math.max(10, now - lastTime.current);
      lastTime.current = now;
      const velocity = Math.abs(target - lastTarget.current) / dt;
      lastTarget.current = target;
      const ease = Math.min(0.45, 0.04 + velocity * 2.4);
      current.current += (target - current.current) * ease;
      setProgress(current.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trackRef]);

  return progress;
}

function getProblemMorph(local) {
  if (local < PROBLEM_SEG_HERO) return 1;
  if (local < PROBLEM_SEG_HERO + PROBLEM_SEG_SETTLE) {
    return 1 - PROBLEM_MORPH_EASE((local - PROBLEM_SEG_HERO) / PROBLEM_SEG_SETTLE);
  }
  return 0;
}

function getProblemScrollState(progress, total) {
  const assemblyP = Math.min(1, progress / PROBLEM_ASSEMBLY_END);
  const inHold = progress >= PROBLEM_ASSEMBLY_END;
  const p = assemblyP * total;
  const active = Math.min(total - 1, Math.floor(p));
  const local = p - active;
  const activeMorph = inHold ? 0 : getProblemMorph(local);
  return { active, local, activeMorph, inHold, p };
}

function getProblemTileBlur(index, progress, total) {
  const { active, activeMorph, inHold } = getProblemScrollState(progress, total);
  if (inHold || active === 0 || index >= active || activeMorph < 0.04) return 0;
  return 7 * activeMorph;
}

function getProblemTileLayout(index, progress, total) {
  const { active, activeMorph, inHold } = getProblemScrollState(progress, total);
  const slot = PROBLEM_TILE_SLOTS[index];
  const hidden = { visible: false, opacity: 0, leftPct: 0, topPct: 0, widthPct: 0, heightPct: 0, blurPx: 0 };

  if (index > active && !inHold) return hidden;

  const blurPx = getProblemTileBlur(index, progress, total);

  if (index < active || inHold) {
    return {
      visible: true,
      opacity: blurPx > 0 ? Math.max(0.55, 1 - blurPx * 0.04) : 1,
      leftPct: slot.left,
      topPct: slot.top,
      widthPct: slot.w,
      heightPct: slot.h,
      zIndex: 10 + index,
      blurPx,
    };
  }

  if (activeMorph > 0.96) return hidden;

  const t = 1 - activeMorph;
  return {
    visible: true,
    opacity: Math.min(1, (1 - activeMorph) * 1.4),
    leftPct: PROBLEM_HERO.left * activeMorph + slot.left * t,
    topPct: PROBLEM_HERO.top * activeMorph + slot.top * t,
    widthPct: PROBLEM_HERO.w * activeMorph + slot.w * t,
    heightPct: PROBLEM_HERO.h * activeMorph + slot.h * t,
    zIndex: 10 + index,
    blurPx: 0,
  };
}

function getProblemHeroLayer(progress, total) {
  const { active, activeMorph, inHold } = getProblemScrollState(progress, total);
  if (inHold || activeMorph < 0.02) return { visible: false, morph: 0, index: active };
  return { visible: true, morph: activeMorph, index: active };
}

function getProblemScrimOpacity(progress, total) {
  const { active, activeMorph, inHold } = getProblemScrollState(progress, total);
  if (inHold || active === 0 || activeMorph < 0.04) return 0;
  return Math.min(0.98, 0.94 * activeMorph);
}

function ProblemFigureHero({ figure, flip }) {
  return (
    <div className={`problem-scroll-hero${flip ? ' flip' : ''}`}>
      <div className="problem-fig-copy">
        <div className="problem-fig-nav">
          <span className="problem-fig-num">{figure.fig}</span>
          <span className="problem-fig-nav-label">{figure.nav}</span>
          <span className="problem-fig-arrow" aria-hidden>→</span>
        </div>
        <h3 className="problem-fig-title">{figure.title}</h3>
        <p className="problem-fig-body">{figure.body}</p>
        {figure.caption && <p className="problem-fig-caption">{figure.caption}</p>}
      </div>
      <div className="problem-fig-visual">
        <div className="problem-fig-stage">
          <span className="problem-fig-label">FIG {figure.fig}</span>
          <div className="problem-fig-scene">
            <ProblemFigureVisual type={figure.visual} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemFigureTile({ figure }) {
  return (
    <>
      <div className="problem-tile-stage">
        <ProblemFigureVisual type={figure.visual} />
      </div>
      <div className="problem-tile-copy">
        <div className="problem-tile-meta">
          <span className="problem-fig-num">{figure.fig}</span>
          <span className="problem-fig-nav-label">{figure.nav}</span>
        </div>
        <h4 className="problem-tile-title">{figure.title}</h4>
      </div>
    </>
  );
}

function ProblemScrollTileMotion({ figure, index, progress, total }) {
  const cacheRef = React.useRef({ p: NaN, data: null });
  const readLayout = React.useCallback((p) => {
    if (cacheRef.current.p === p) return cacheRef.current.data;
    const data = getProblemTileLayout(index, p, total);
    cacheRef.current = { p, data };
    return data;
  }, [index, total]);
  const leftPct = FM.useTransform(progress, (p) => readLayout(p).leftPct);
  const topPct = FM.useTransform(progress, (p) => readLayout(p).topPct);
  const widthPct = FM.useTransform(progress, (p) => readLayout(p).widthPct);
  const heightPct = FM.useTransform(progress, (p) => readLayout(p).heightPct);
  const opacity = FM.useTransform(progress, (p) => readLayout(p).opacity);
  const zIndex = FM.useTransform(progress, (p) => readLayout(p).zIndex);
  const blurPx = FM.useTransform(progress, (p) => readLayout(p).blurPx);
  const filter = FM.useTransform(blurPx, (b) => (b > 0 ? `blur(${b}px) saturate(0.82)` : 'none'));
  const left = FM.useMotionTemplate`${leftPct}%`;
  const top = FM.useMotionTemplate`${topPct}%`;
  const width = FM.useMotionTemplate`${widthPct}%`;
  const height = FM.useMotionTemplate`${heightPct}%`;
  const pointerEvents = FM.useTransform(opacity, (o) => (o < 0.04 ? 'none' : 'auto'));

  return (
    <motion.article
      className="problem-scroll-card problem-scroll-card--tile"
      id={`problem-${figure.id}`}
      style={{ left, top, width, height, opacity, zIndex, pointerEvents, filter }}
    >
      <div className="problem-scroll-tile">
        <ProblemFigureTile figure={figure} />
      </div>
    </motion.article>
  );
}

function ProblemScrollHeroItem({ figure, index, progress, total }) {
  const opacity = FM.useTransform(progress, (p) => {
    const h = getProblemHeroLayer(p, total);
    return h.visible && h.index === index ? h.morph : 0;
  });
  const pointerEvents = FM.useTransform(opacity, (o) => (o < 0.04 ? 'none' : 'auto'));

  return (
    <motion.div
      className="problem-scroll-hero-slot"
      style={{ opacity, zIndex: 30 + index, pointerEvents }}
      aria-hidden
    >
      <ProblemFigureHero figure={figure} flip={false} />
    </motion.div>
  );
}

function ProblemScrollHeroItemLite({ figure, index, progress, total }) {
  const hero = getProblemHeroLayer(progress, total);
  if (!hero.visible || hero.index !== index) return null;

  return (
    <div className="problem-scroll-hero-slot" style={{ opacity: hero.morph, zIndex: 30 + index }}>
      <ProblemFigureHero figure={figure} flip={false} />
    </div>
  );
}

function ProblemScrollTileLite({ figure, index, progress, total }) {
  const layout = getProblemTileLayout(index, progress, total);
  if (!layout.visible) return null;

  return (
    <article
      className="problem-scroll-card problem-scroll-card--tile"
      id={`problem-${figure.id}`}
      style={{
        left: `${layout.leftPct}%`,
        top: `${layout.topPct}%`,
        width: `${layout.widthPct}%`,
        height: `${layout.heightPct}%`,
        opacity: layout.opacity,
        zIndex: layout.zIndex,
        filter: layout.blurPx > 0 ? `blur(${layout.blurPx}px) saturate(0.82)` : 'none',
      }}
    >
      <div className="problem-scroll-tile">
        <ProblemFigureTile figure={figure} />
      </div>
    </article>
  );
}

function ProblemFigure({ figure, flip, index }) {
  return (
    <article className={`problem-fig${flip ? ' problem-fig--flip' : ''}`} id={`problem-${figure.id}`}>
      <Reveal delay={index * 24}>
        <div className="problem-fig-inner">
          <ProblemFigureHero figure={figure} flip={flip} />
        </div>
      </Reveal>
    </article>
  );
}

function ProblemScrollBentoMotion() {
  const trackRef = React.useRef(null);
  const { scrollYProgress } = FM.useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  const progress = useProblemSmoothProgress(scrollYProgress);
  const total = PROBLEM_FIGURES.length;

  const holdT = FM.useTransform(progress, (p) => (
    p >= PROBLEM_ASSEMBLY_END
      ? Math.min(1, (p - PROBLEM_ASSEMBLY_END) / (1 - PROBLEM_ASSEMBLY_END))
      : 0
  ));
  const headerY = FM.useTransform(holdT, (o) => (1 - o) * 16);
  const scrimOpacity = FM.useTransform(progress, (p) => getProblemScrimOpacity(p, total));

  return (
    <div className="problem-scroll-track" ref={trackRef} aria-label="Problem breakdown">
      <div className="problem-scroll-sticky">
        <div className="problem-scroll-canvas">
          <motion.div
            className="problem-bento-header"
            style={{ opacity: holdT, y: headerY }}
          >
            <span className="sec-eyebrow">The problem</span>
            <p className="problem-bento-thesis">
              Observability watches · Test runners react · <span className="dim">Nothing guards.</span>
            </p>
          </motion.div>
          {PROBLEM_FIGURES.map((f, i) => (
            <ProblemScrollTileMotion key={`tile-${f.id}`} figure={f} index={i} progress={progress} total={total} />
          ))}
          <motion.div className="problem-scroll-scrim" style={{ opacity: scrimOpacity }} aria-hidden />
          {PROBLEM_FIGURES.map((f, i) => (
            <ProblemScrollHeroItem key={`hero-${f.id}`} figure={f} index={i} progress={progress} total={total} />
          ))}
        </div>
      </div>
      <div className="problem-scroll-settle" aria-hidden />
    </div>
  );
}

function ProblemScrollBentoLite() {
  const trackRef = React.useRef(null);
  const progress = useProblemSmoothProgressLite(trackRef);
  const total = PROBLEM_FIGURES.length;
  const holdT = progress >= PROBLEM_ASSEMBLY_END
    ? Math.min(1, (progress - PROBLEM_ASSEMBLY_END) / (1 - PROBLEM_ASSEMBLY_END))
    : 0;
  const scrimOpacity = getProblemScrimOpacity(progress, total);

  return (
    <div className="problem-scroll-track" ref={trackRef} aria-label="Problem breakdown">
      <div className="problem-scroll-sticky">
        <div className="problem-scroll-canvas">
          <div
            className="problem-bento-header"
            style={{ opacity: holdT, transform: `translateY(${(1 - holdT) * 16}px)` }}
          >
            <span className="sec-eyebrow">The problem</span>
            <p className="problem-bento-thesis">
              Observability watches · Test runners react · <span className="dim">Nothing guards.</span>
            </p>
          </div>
          {PROBLEM_FIGURES.map((f, i) => (
            <ProblemScrollTileLite key={`tile-${f.id}`} figure={f} index={i} progress={progress} total={total} />
          ))}
          <div className="problem-scroll-scrim" style={{ opacity: scrimOpacity }} aria-hidden />
          {PROBLEM_FIGURES.map((f, i) => (
            <ProblemScrollHeroItemLite key={`hero-${f.id}`} figure={f} index={i} progress={progress} total={total} />
          ))}
        </div>
      </div>
      <div className="problem-scroll-settle" aria-hidden />
    </div>
  );
}

function ProblemScrollBento() {
  return (
    <div className="problem-figures problem-figures--static">
      {PROBLEM_FIGURES.map((f, i) => (
        <ProblemFigure key={f.id} figure={f} flip={i % 2 === 1} index={i} />
      ))}
    </div>
  );
}

function Problem() {
  return (
    <section className="section problem-section" id="problem">
      <div className="frame problem-intro">
        <Reveal><span className="sec-eyebrow">The problem</span></Reveal>
        <Reveal as="h2" delay={60} className="problem-thesis">
          <span>Observability watches.</span>
          <span>Test runners react.</span>
          <span className="dim">Nothing guards.</span>
        </Reveal>
        <Reveal delay={120}>
          <p className="sec-lede problem-lede">{PROBLEM_LEDE}</p>
        </Reveal>
      </div>
      <div className="problem-divider" aria-hidden />
      <ProblemScrollBento />
      <div className="problem-outro">
        <div className="frame problem-outro-inner">
          <Reveal className="problem-outro-copy">
            <p className="problem-bridge">Molar guards production flows.</p>
          </Reveal>
          <Reveal delay={80}>
            <a className="problem-bridge-link" href="#product">See how it works <span aria-hidden>→</span></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- four surfaces (sticky scroll stack) ---------- */
function SurfaceStackCard({ row, index, total, progress }) {
  const flip = index % 2 === 1;
  const targetScale = 1 - (total - index) * 0.05;
  const start = index / total;
  const end = (index + 1) / total;
  let scale = 1;
  if (progress >= end) scale = targetScale;
  else if (progress > start) {
    const t = (progress - start) / (end - start);
    scale = 1 - t * (1 - targetScale);
  }
  const activeIndex = Math.min(Math.floor(progress * total + 1e-6), total - 1);
  const scrollComplete = progress >= 1 - 1e-4;
  const isStacked = index < activeIndex || (scrollComplete && index === total - 1);

  return (
    <div className="surface-stack-slot" style={{ '--si': index, '--st': total }}>
      <article
        className={`surface-card${flip ? ' flip' : ''}${isStacked ? ' stacked' : ''}`}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="surface-card-tab" aria-hidden={!isStacked} aria-label={row.tag}>
          <span className="surface-tab-dot" aria-hidden></span>
          <span className="surface-tab-name">{row.tag}</span>
        </div>
        <div className="surface-card-grid">
          <div className="surface-copy">
            <span className="surface-tag"><i></i>{row.tag}</span>
            <h3>{row.title}</h3>
            <p>{row.body}</p>
            <a className="surface-link" href={row.link[0]}>{row.link[1]} →</a>
          </div>
          <div className="surface-stage">
            <div className="surface-stage-canvas">
              <div className="surface-visual">
                <div className="surface-visual-body">{row.visual}</div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function Surfaces() {
  const rows = [
    {
      tag: 'Cartographer',
      title: 'Point it at a URL. Get a mapped, tested app.',
      body: 'The agent crawls your live app, discovers every user flow, and authors critical-path scenarios in plain English — then exports them as production-grade Playwright specs you own.',
      link: ['/qa-agent', 'Explore the QA agent'],
      visual: (
        <>
          <div className="c">$ molar map https://staging.acme.dev</div>
          <div>flows discovered <span className="g">12</span> · forms <span className="g">38</span></div>
          <div>auth walls handled <span className="g">2</span> · iframes <span className="g">3</span></div>
          <div className="c">$ molar export</div>
          <div><span className="g">✓</span> checkout.spec.ts · signup.spec.ts · +4</div>
          <div className="c">// runnable Playwright — no lock-in</div>
        </>
      ),
    },
    {
      tag: 'Clones',
      title: 'Real integrations. Zero side effects.',
      body: 'Stateful, destruction-safe clones of Stripe, email, Twilio, S3, auth, and more. Same endpoints, same error semantics, controllable state — a real environment that happens to not be production.',
      link: ['/docs#clones', 'Browse the clone catalog'],
      visual: (
        <>
          {[
            ['stripe.charges', 'cloned'],
            ['email.send', 'cloned'],
            ['twilio.sms', 'cloned'],
            ['auth.session', 'cloned'],
            ['s3.bucket', 'shadow'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{k}</span><span className="g">● {v}</span>
            </div>
          ))}
          <div className="c" style={{ marginTop: 8 }}>// no real cards, emails, or users</div>
        </>
      ),
    },
    {
      tag: 'Guard',
      title: 'Every PR gated. Production watched.',
      body: 'A required GitHub check blocks merges when a critical path fails. After ship, Guard keeps running the same flows against live production on a schedule — and can open the fix PR itself.',
      link: ['/vs/checkly', 'See how Guard compares'],
      visual: (
        <>
          <div className="c">// pr #421 — agent-authored</div>
          <div><span className="r">✗</span> checkout.coupon</div>
          <div style={{ paddingLeft: 14 }} className="c">expected $9.00 · received $90.00</div>
          <div style={{ marginTop: 8 }}><span className="g">↳</span> blocked merge</div>
          <div><span className="g">↳</span> opened fix PR #422</div>
        </>
      ),
    },
    {
      tag: 'Trace',
      title: 'Replay any failed run like a debugger.',
      body: 'Every run captures DOM, network, console, and clone activity for deterministic replay. Diff a failing run against the last green one, or ask the built-in debugger chat what changed.',
      link: ['/vs/playwright-trace', 'Compare with Playwright traces'],
      visual: (
        <>
          <div className="c">$ molar trace run-4821 --diff run-4790</div>
          <div>DOM <span className="y">3 nodes changed</span></div>
          <div>network <span className="r">POST /v1/charges 422</span></div>
          <div>clone <span className="g">stripe.charge missing</span></div>
          <div style={{ marginTop: 8 }} className="c">&gt; “why did step 6 fail?”</div>
          <div><span className="g">›</span> coupon rounding diff in discount.ts:42</div>
        </>
      ),
    },
  ];
  const stackRef = React.useRef(null);
  const [stackProgress, setStackProgress] = React.useState(0);

  React.useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 960px)').matches;
    if (reduced || mobile) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) { setStackProgress(0); return; }
      setStackProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section className="section surface-section" id="product">
      <div className="content-wrap">
        <div className="sec-center surface-intro">
          <Reveal><span className="sec-eyebrow">The platform</span></Reveal>
          <Reveal as="h2" delay={60} className="sec-title">One QA agent. Four surfaces.</Reveal>
          <Reveal delay={120}>
            <p className="sec-lede">
              Adopt one surface or all four — they compound. Run on Molar Cloud, or self-host
              inside your VPC so your codebase never leaves.
            </p>
          </Reveal>
        </div>
      </div>
      <div className="surface-stack" ref={stackRef} aria-label="Molar platform surfaces">
        {rows.map((r, i) => (
          <SurfaceStackCard key={r.tag} row={r} index={i} total={rows.length} progress={stackProgress} />
        ))}
        <div className="surface-stack-settle" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ---------- page loader ---------- */
function PageLoader() {
  const [phase, setPhase] = React.useState(() => {
    try { return sessionStorage.getItem('molar:loader-seen') ? 'gone' : 'in'; }
    catch { return 'in'; }
  });
  const letters = ['M', 'o', 'l', 'a', 'r'];

  React.useEffect(() => {
    if (phase === 'gone') return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try { sessionStorage.setItem('molar:loader-seen', '1'); } catch {}
    document.body.classList.add('is-loading');
    const outDelay = reduced ? 0 : 260;
    const goneDelay = reduced ? 0 : 680;
    const outT = window.setTimeout(() => setPhase('out'), outDelay);
    const goneT = window.setTimeout(() => {
      setPhase('gone');
      document.body.classList.remove('is-loading');
    }, goneDelay);
    return () => {
      window.clearTimeout(outT);
      window.clearTimeout(goneT);
      document.body.classList.remove('is-loading');
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`page-loader${phase === 'out' ? ' is-done' : ''}`} aria-hidden="true">
      <p className="loader-word">
        {letters.map((ch, i) => (
          <span
            key={ch + i}
            className="loader-char"
            style={{ '--li': i }}
          >
            {ch}
          </span>
        ))}
        <span className="loader-char loader-dot" style={{ '--li': letters.length }}>.</span>
      </p>
    </div>
  );
}

function LoopPanelVisual({ tone, active }) {
  if (tone === 'pre') {
    return (
      <div className={`loop-terminal${active ? ' is-live' : ''}`}>
        <div className="loop-terminal-bar"><span />PR #421 · agent-authored check</div>
        <div className="loop-terminal-body">
          <div className="ln dim">// before merge</div>
          <div className="ln"><span className="ok">✓</span> signup.flow</div>
          <div className="ln"><span className="ok">✓</span> checkout.coupon</div>
          <div className="ln"><span className="bad">✗</span> billing.proration</div>
          <div className="ln indent dim">expected $9.00 · received $90.00</div>
          <div className="ln gap"><span className="warn">↳</span> merge blocked</div>
          <div className="ln"><span className="ok">↳</span> fix PR #422 opened</div>
        </div>
      </div>
    );
  }
  if (tone === 'deploy') {
    return (
      <div className={`loop-terminal${active ? ' is-live' : ''}`}>
        <div className="loop-terminal-bar"><span />Shadow deploy · canary 12%</div>
        <div className="loop-terminal-body">
          <div className="ln dim">// during deploy</div>
          <div className="ln">prod <span className="ok">88%</span> · shadow <span className="warn">12%</span></div>
          <div className="loop-meter"><i style={{ width: '12%' }} /></div>
          <div className="ln">checkout.coupon <span className="ok">pass</span></div>
          <div className="ln">billing.proration <span className="ok">pass</span></div>
          <div className="ln gap">clone stripe <span className="ok">● live</span> · email <span className="ok">● live</span></div>
          <div className="ln dim">no real cards or inboxes touched</div>
        </div>
      </div>
    );
  }
  return (
    <div className={`loop-terminal${active ? ' is-live' : ''}`}>
      <div className="loop-terminal-bar"><span />Production guard · every 15 min</div>
      <div className="loop-terminal-body">
        <div className="ln dim">// after ship</div>
        <div className="ln">checkout.coupon <span className="ok">green</span></div>
        <div className="ln">billing.proration <span className="ok">green</span></div>
        <div className="ln">signup.oauth <span className="warn">amber</span></div>
        <div className="ln gap">last failure <span className="dim">run-4821 · 2d ago</span></div>
        <div className="ln">trace diff <span className="ok">DOM 3 nodes · charge 422</span></div>
        <div className="ln dim">every failure ties back to a diff</div>
      </div>
    </div>
  );
}

/* ---------- release loop (full-page horizontal scroll) ---------- */
function ReleaseLoop() {
  const moments = [
    {
      phase: '01',
      when: 'Before merge',
      short: 'Before',
      tone: 'pre',
      title: 'Catch regressions before they land.',
      body: 'Molar reads the diff, runs critical flows against cloned services, and blocks broken PRs before they reach production.',
    },
    {
      phase: '02',
      when: 'During deploy',
      short: 'During',
      tone: 'deploy',
      title: 'Shadow the release while it rolls out.',
      body: 'The paths most likely to break get checked with safe test identities and cloned third parties — verification never touches real customers.',
    },
    {
      phase: '03',
      when: 'After ship',
      short: 'After',
      tone: 'ship',
      title: 'Keep testing production, continuously.',
      body: 'Critical-path checks run against live production on a schedule, and every failure ties back to the diff, agent, or human who introduced it.',
    },
  ];

  const sectionRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const total = moments.length;
  const activeIndex = Math.min(Math.floor(progress * total + 1e-6), total - 1);
  const translateVw = progress * (total - 1) * 100;

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia && window.matchMedia('(max-width: 960px)').matches;
    if (reduced || mobile) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section
      className="loop-section"
      id="how"
      ref={sectionRef}
      style={{ '--loop-count': total }}
    >
      <div className="loop-pin">
        <header className="loop-hud">
          <div className="loop-hud-brand">
            <span className="sec-eyebrow">The release loop</span>
            <p className="loop-hud-title">Not a test suite you remember to run.</p>
          </div>
          <div className="loop-hud-meta" aria-live="polite">
            <span className="loop-hud-count">{moments[activeIndex].phase}</span>
            <span className="loop-hud-slash">/</span>
            <span className="loop-hud-total">03</span>
          </div>
        </header>

        <div className="loop-viewport">
          <div
            className="loop-track"
            style={{ transform: `translate3d(-${translateVw}vw, 0, 0)` }}
          >
            {moments.map((m, i) => {
              const local = Math.min(1, Math.max(0, progress * total - i));
              return (
                <article
                  key={m.when}
                  className={`loop-panel loop-panel-${m.tone}${i === activeIndex ? ' is-active' : ''}`}
                  style={{ '--lp': local }}
                  aria-label={m.when}
                >
                  <div className="loop-panel-bg" aria-hidden>{m.phase}</div>
                  <div className="loop-panel-grid">
                    <div className="loop-panel-copy">
                      <span className="loop-when">{m.when}</span>
                      <h3>{m.title}</h3>
                      <p>{m.body}</p>
                    </div>
                    <div className="loop-panel-visual">
                      <LoopPanelVisual tone={m.tone} active={i === activeIndex} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <nav className="loop-nav" aria-label="Release phases">
          {moments.map((m, i) => (
            <span
              key={m.phase}
              className={`loop-nav-item${i === activeIndex ? ' is-active' : ''}${i < activeIndex ? ' is-past' : ''}`}
            >
              <i aria-hidden />
              {m.short}
            </span>
          ))}
          <div className="loop-nav-fill" style={{ width: `${progress * 100}%` }} aria-hidden />
        </nav>
      </div>
      <div className="loop-scroll-spacer" aria-hidden="true" />
    </section>
  );
}

/* ---------- clones band ---------- */
const VENDOR_BRAND_COLORS = {
  auth: '#6C47FF',
  s3: '#FF9900',
  sendgrid: '#51A9E3',
  stripe: '#635BFF',
  twilio: '#F22F46',
  apify: '#97D700',
  calcom: '#292929',
  clickup: '#7B68EE',
  discord: '#5865F2',
  firecrawl: '#FA6B1E',
  github: '#24292F',
  gitlab: '#FC6D26',
  'google-workspace': '#4285F4',
  hubspot: '#FF7A59',
  jira: '#0052CC',
  linear: '#5E6AD2',
  ownerrez: '#2563EB',
  pricelabs: '#00A651',
  ramp: '#1A1919',
  sentry: '#362D59',
  slack: '#4A154B',
  supabase: '#3FCF8E',
  tavily: '#0EA5E9',
  telegram: '#26A5E4',
  typeform: '#262627',
  unipile: '#6366F1',
  webflow: '#146EF5',
  woocommerce: '#96588A',
};

const VENDOR_LABELS = {
  auth: 'Auth',
  s3: 'S3',
  sendgrid: 'SendGrid',
  stripe: 'Stripe',
  twilio: 'Twilio',
  apify: 'Apify',
  calcom: 'Cal.com',
  clickup: 'ClickUp',
  discord: 'Discord',
  firecrawl: 'Firecrawl',
  github: 'GitHub',
  gitlab: 'GitLab',
  'google-workspace': 'Google',
  hubspot: 'HubSpot',
  jira: 'Jira',
  linear: 'Linear',
  ownerrez: 'OwnerRez',
  pricelabs: 'PriceLabs',
  ramp: 'Ramp',
  sentry: 'Sentry',
  slack: 'Slack',
  supabase: 'Supabase',
  tavily: 'Tavily',
  telegram: 'Telegram',
  typeform: 'Typeform',
  unipile: 'Unipile',
  webflow: 'Webflow',
  woocommerce: 'WooCommerce',
};

function CloneVendorIcon({ vendor, size = 'md', framed = false }) {
  const src = `/icons/vendors/${vendor}.svg`;
  const label = VENDOR_LABELS[vendor] || vendor;
  const img = (
    <img
      className={`clone-icon-img clone-icon-img--${size}`}
      src={src}
      alt=""
      title={label}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
  if (!framed) return img;
  return <span className={`clone-icon-frame clone-icon-frame--${size}`}>{img}</span>;
}

const CLONES_INTEGRATIONS = /*CLONES-REGISTRY-BEGIN*/[
  ['auth', 'cloned'], ['s3', 'shadow'], ['sendgrid', 'cloned'], ['stripe', 'cloned'],
  ['twilio', 'cloned'], ['apify', 'fixtured'], ['calcom', 'fixtured'], ['clickup', 'fixtured'],
  ['discord', 'fixtured'], ['firecrawl', 'fixtured'], ['github', 'fixtured'], ['gitlab', 'fixtured'],
  ['google-workspace', 'fixtured'], ['hubspot', 'fixtured'], ['jira', 'fixtured'], ['linear', 'fixtured'],
  ['ownerrez', 'fixtured'], ['pricelabs', 'fixtured'], ['ramp', 'fixtured'], ['sentry', 'fixtured'],
  ['slack', 'fixtured'], ['supabase', 'fixtured'], ['tavily', 'fixtured'], ['telegram', 'fixtured'],
  ['typeform', 'fixtured'], ['unipile', 'fixtured'], ['webflow', 'fixtured'], ['woocommerce', 'fixtured'],
]/*CLONES-REGISTRY-END*/;

const CLONE_WORKFLOW = [
  { id: 'app', label: 'Your app', sub: 'POST /checkout', icon: null, kind: 'app' },
  { id: 'stripe', label: 'Stripe', sub: 'Charge $99 recorded', icon: 'stripe', kind: 'clone' },
  { id: 'sendgrid', label: 'SendGrid', sub: 'Verify email sent', icon: 'sendgrid', kind: 'clone' },
  { id: 'webhook', label: 'Your webhook', sub: 'POST /webhooks/stripe', icon: null, kind: 'app' },
  { id: 'guard', label: 'Guard', sub: 'Flow verified', icon: null, kind: 'molar' },
];

const CLONE_WORKFLOW_KIND_LABEL = {
  app: 'Your code',
  clone: 'Clone',
  molar: 'Molar',
};

function ClonesWorkflowStepIcon({ step }) {
  if (step.icon) return <CloneVendorIcon vendor={step.icon} size="md" framed />;
  if (step.id === 'guard') {
    return (
      <span className="clones-flow-glyph clones-flow-glyph--guard" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    );
  }
  if (step.id === 'webhook') {
    return (
      <span className="clones-flow-glyph clones-flow-glyph--webhook" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </span>
    );
  }
  return (
    <span className="clones-flow-glyph clones-flow-glyph--app" aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
      </svg>
    </span>
  );
}

function ClonesWorkflowStrip() {
  return (
    <div className="clones-flow-wrap">
      <span className="clones-flow-eyebrow">How it works</span>
      <ol className="clones-flow-track" aria-label="Example checkout test flow">
        {CLONE_WORKFLOW.map((step, i) => (
          <li key={step.id} className={`clones-flow-step clones-flow-step--${step.kind}`}>
            <span className="clones-flow-step-num">{i + 1}</span>
            <div className="clones-flow-step-card">
              <div className="clones-flow-step-top">
                <ClonesWorkflowStepIcon step={step} />
                <span className="clones-flow-kind">{CLONE_WORKFLOW_KIND_LABEL[step.kind]}</span>
              </div>
              <div className="clones-flow-step-copy">
                <span className="clones-flow-step-label">{step.label}</span>
                <span className="clones-flow-step-sub">{step.sub}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Clones() {
  const count = CLONES_INTEGRATIONS.length;
  return (
    <section className="section clones-band" id="clones">
      <div className="frame clones-layout">
        <div className="clones-hero-row">
          <header className="clones-intro">
            <Reveal><span className="sec-eyebrow">Stateful clones</span></Reveal>
            <Reveal as="h2" delay={60} className="sec-title clones-intro-title">
              Test against real APIs without hitting them.
            </Reveal>
            <Reveal delay={120}>
              <p className="sec-lede clones-intro-lede">
                Each test run gets a stateful mirror of the services your app depends on. Same endpoints,
                same failure shapes, controllable state — and no production blast radius.
              </p>
            </Reveal>
          </header>
          <Reveal delay={160} className="clones-flow-col">
            <ClonesWorkflowStrip />
          </Reveal>
        </div>
        <Reveal delay={220} className="clones-directory-panel">
          <div className="clones-directory-head">
            <div className="clones-directory-head-main">
              <span className="clones-directory-eyebrow">Clone directory</span>
              <h3 className="clones-directory-title">{count} supported vendors</h3>
            </div>
            <p className="clones-directory-lede">
              Stripe, Twilio, GitHub, Slack, and more — mirrored with the same API shapes your app already calls.
            </p>
          </div>
          <div className="clones-grid" role="list" aria-label="Supported vendor clones">
            {CLONES_INTEGRATIONS.map(([name], i) => (
              <span key={name} className="clone-chip" role="listitem" style={{ '--chip-i': i }}>
                <CloneVendorIcon vendor={name} size="sm" framed />
                <span className="clone-chip-name">{VENDOR_LABELS[name] || name}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- scenario ↔ Playwright export ---------- */
function CodeLine({
  lineId, syncKey, activeSync, onSync, tone, syncMode = 'hover', reveal = 'shown', syncDimmed = false, className = '', children,
}) {
  const lit = syncKey && activeSync === syncKey;
  const dimmed = syncDimmed && syncKey && !lit;
  const syncReady = reveal !== 'hidden';
  const hoverHandlers = syncMode === 'hover' && syncReady ? {
    onMouseEnter: () => syncKey && onSync(syncKey),
    onMouseLeave: () => syncKey && onSync(null),
  } : {};
  const clickHandler = syncMode === 'click' ? {
    onClick: () => syncKey && onSync(activeSync === syncKey ? null : syncKey),
  } : {};
  const isGap = String(lineId).includes('gap');
  return (
    <div
      className={[
        'codepair-line',
        `codepair-line-${tone}`,
        lit ? ' is-lit' : '',
        syncKey ? ' is-sync' : '',
        reveal === 'hidden' ? ' is-hidden' : '',
        reveal === 'typing' && !isGap ? ' is-typing' : '',
        reveal === 'shown' ? ' is-shown' : '',
        syncDimmed ? ' is-dimmed' : '',
        className,
      ].filter(Boolean).join(' ')}
      data-line={lineId}
      {...hoverHandlers}
      {...clickHandler}
    >
      <span className="codepair-line-inner">{children}</span>
      {reveal === 'typing' && !isGap ? <span className="codepair-cursor" aria-hidden /> : null}
    </div>
  );
}

function ExportPane({ tone, path, children, className = '' }) {
  return (
    <div className={`codepair-pane codepair-pane-${tone}${className ? ` ${className}` : ''}`}>
      <div className="codepair-pane-head">
        <span className={`codepair-dot${tone === 'ts' ? ' ts' : ''}`} />
        {path}
      </div>
      <div className="codepair-body">{children}</div>
    </div>
  );
}

function ExportMdContent({ activeSync, onSync, syncMode = 'hover', getReveal, syncEnabled = true }) {
  const p = { activeSync, onSync, syncMode, getReveal, syncDimmed: syncEnabled && !!activeSync };
  const r = (id) => (getReveal ? getReveal(id) : 'shown');
  return (
    <>
      <CodeLine tone="md" lineId="md-h" syncKey={null} reveal={r('md-h')} {...p}>
        <span className="c"># checkout · Pro plan + clone providers</span>
      </CodeLine>
      <CodeLine tone="md" lineId="md-1" syncKey="s1" reveal={r('md-1')} {...p}>
        <span className="n">1.</span> Visit <span className="k">/checkout</span>
      </CodeLine>
      <CodeLine tone="md" lineId="md-2" syncKey="s2" reveal={r('md-2')} {...p}>
        <span className="n">2.</span> Fill email + plan = <span className="g">Pro</span>
      </CodeLine>
      <CodeLine tone="md" lineId="md-3" syncKey="s3" reveal={r('md-3')} {...p}>
        <span className="n">3.</span> Submit checkout form
      </CodeLine>
      <CodeLine tone="md" lineId="md-4" syncKey="s4" reveal={r('md-4')} {...p}>
        <span className="n">4.</span> Clone email receives <span className="g">&quot;verify&quot;</span>
      </CodeLine>
      <CodeLine tone="md" lineId="md-5" syncKey="s5" reveal={r('md-5')} {...p}>
        <span className="n">5.</span> Click verify link back into app
      </CodeLine>
      <CodeLine tone="md" lineId="md-6" syncKey="s6" reveal={r('md-6')} {...p}>
        <span className="n">6.</span> Clone Stripe records charge <span className="g">$99</span>
      </CodeLine>
      <CodeLine tone="md" lineId="md-7" syncKey="s7" reveal={r('md-7')} {...p}>
        <span className="n">7.</span> <span className="k">/webhooks/stripe</span> updates DB row
      </CodeLine>
      <CodeLine tone="md" lineId="md-8" syncKey="s8" reveal={r('md-8')} {...p}>
        <span className="n">8.</span> Expect receipt page + <span className="g">no real customer touched</span>
      </CodeLine>
    </>
  );
}

function ExportTsContent({ activeSync, onSync, syncMode = 'hover', getReveal, syncEnabled = true }) {
  const p = { activeSync, onSync, syncMode, getReveal, syncDimmed: syncEnabled && !!activeSync };
  const r = (id) => (getReveal ? getReveal(id) : 'shown');
  return (
    <>
      <CodeLine tone="ts" lineId="ts-h" syncKey={null} reveal={r('ts-h')} {...p}>
        <span className="c">// exported by Cartographer</span>
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-import" syncKey={null} reveal={r('ts-import')} {...p}>
        <span className="b">import</span> {'{ test, expect }'} <span className="b">from</span> <span className="g">&apos;@playwright/test&apos;</span>;
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-gap-1" syncKey={null} reveal={r('ts-gap-1')} className="codepair-gap" {...p} />
      <CodeLine tone="ts" lineId="ts-clones" syncKey={null} reveal={r('ts-clones')} {...p}>
        <span className="b">await</span> molar.useClones([<span className="g">&apos;stripe&apos;</span>, <span className="g">&apos;email&apos;</span>]);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-gap-2" syncKey={null} reveal={r('ts-gap-2')} className="codepair-gap" {...p} />
      <CodeLine tone="ts" lineId="ts-goto" syncKey="s1" reveal={r('ts-goto')} {...p}>
        <span className="b">await</span> page.goto(<span className="g">&apos;/checkout&apos;</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-fill" syncKey="s2" reveal={r('ts-fill')} {...p}>
        <span className="b">await</span> page.fill(<span className="g">&apos;#email&apos;</span>, <span className="g">&apos;qa+pro@acme.dev&apos;</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-plan" syncKey="s2" reveal={r('ts-plan')} {...p}>
        <span className="b">await</span> page.selectOption(<span className="g">&apos;[name=plan]&apos;</span>, <span className="g">&apos;pro&apos;</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-submit" syncKey="s3" reveal={r('ts-submit')} {...p}>
        <span className="b">await</span> page.click(<span className="g">&apos;[data-testid=submit-checkout]&apos;</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-gap-3" syncKey={null} reveal={r('ts-gap-3')} className="codepair-gap" {...p} />
      <CodeLine tone="ts" lineId="ts-email" syncKey="s4" reveal={r('ts-email')} {...p}>
        <span className="b">const</span> msg = <span className="b">await</span> molar.clone(<span className="g">&apos;email&apos;</span>).lastMessage();
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-verify" syncKey="s4" reveal={r('ts-verify')} {...p}>
        expect(msg.body).toContain(<span className="g">&apos;verify&apos;</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-link" syncKey="s5" reveal={r('ts-link')} {...p}>
        <span className="b">await</span> page.goto(msg.link);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-gap-4" syncKey={null} reveal={r('ts-gap-4')} className="codepair-gap" {...p} />
      <CodeLine tone="ts" lineId="ts-charge" syncKey="s6" reveal={r('ts-charge')} {...p}>
        <span className="b">const</span> charge = <span className="b">await</span> molar.clone(<span className="g">&apos;stripe&apos;</span>).lastCharge();
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-amount" syncKey="s6" reveal={r('ts-amount')} {...p}>
        expect(charge.amount).toBe(<span className="y">9900</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-gap-5" syncKey={null} reveal={r('ts-gap-5')} className="codepair-gap" {...p} />
      <CodeLine tone="ts" lineId="ts-webhook" syncKey="s7" reveal={r('ts-webhook')} {...p}>
        <span className="b">await</span> molar.waitForWebhook(<span className="g">&apos;/webhooks/stripe&apos;</span>);
      </CodeLine>
      <CodeLine tone="ts" lineId="ts-receipt" syncKey="s8" reveal={r('ts-receipt')} {...p}>
        <span className="b">await</span> expect(page.getByTestId(<span className="g">&apos;receipt&apos;</span>)).toBeVisible();
      </CodeLine>
    </>
  );
}

function ExportPair({ activeSync, onSync, mobilePane, setMobilePane }) {
  return (
    <div className="export-compile">
      <p className="export-hint">Hover a numbered step to see the matching Playwright line.</p>

      <div className="codepair-mobile-tabs" role="tablist" aria-label="Source and export">
        <button type="button" role="tab" aria-selected={mobilePane === 'md'} className={`codepair-mobile-tab${mobilePane === 'md' ? ' active' : ''}`} onClick={() => setMobilePane('md')}>scenario.molar.md</button>
        <button type="button" role="tab" aria-selected={mobilePane === 'ts'} className={`codepair-mobile-tab${mobilePane === 'ts' ? ' active' : ''}`} onClick={() => setMobilePane('ts')}>checkout.spec.ts</button>
      </div>

      <div className={`export-compile-stage${activeSync ? ' is-syncing' : ''}`}>
        <div className={`export-compile-pane export-compile-pane-md${mobilePane === 'md' ? ' show-mobile' : ''}`}>
          <ExportPane tone="md" path="scenarios/checkout.molar.md">
            <ExportMdContent activeSync={activeSync} onSync={onSync} syncEnabled={!!activeSync} />
          </ExportPane>
        </div>

        <div className={`export-compile-pane export-compile-pane-ts${mobilePane === 'ts' ? ' show-mobile' : ''}`}>
          <ExportPane tone="ts" path="tests/checkout.spec.ts">
            <ExportTsContent activeSync={activeSync} onSync={onSync} syncEnabled={!!activeSync} />
          </ExportPane>
        </div>
      </div>
    </div>
  );
}

function CodePair() {
  const [activeSync, setActiveSync] = React.useState(null);
  const [mobilePane, setMobilePane] = React.useState('md');

  return (
    <section className="export-section" id="export">
      <div className="content-wrap export-inner">
        <header className="export-head sec-center">
          <Reveal>
            <span className="export-badge">
              <i aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </i>
              You own the output
            </span>
          </Reveal>
          <Reveal as="h2" delay={60} className="sec-title">
            Plain-English scenarios in. Real Playwright out.
          </Reveal>
          <Reveal delay={120}>
            <p className="sec-lede">
              Scenarios live in your repo as markdown — version-controlled, diff-able, no DSL.
              Exports are standard Playwright specs you can run without Molar.
            </p>
          </Reveal>
        </header>

        <div className="codepair-shell">
          <ExportPair
            activeSync={activeSync}
            onSync={setActiveSync}
            mobilePane={mobilePane}
            setMobilePane={setMobilePane}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- agents / MCP ---------- */
function Agents() {
  return (
    <section className="section-tight" id="agents">
      <div className="frame">
        <Reveal>
          <div className="agents-strip">
            <div>
              <h3>Built for humans. <span className="hl">Usable by agents.</span></h3>
              <p>
                Molar is software-for-agents: every capability — run tests, drive service clones,
                read traces — is exposed over the Model Context Protocol. Your coding agent can
                verify its own work before you ever see the PR.
              </p>
            </div>
            <div className="agents-code">
              <span className="c">// claude, cursor, windsurf, …</span>{'\n'}
              &gt; use molar to test the checkout flow{'\n\n'}
              <span className="g">✓</span> cartographer_run_test(goal=…){'\n'}
              <span className="g">✓</span> clone_stripe.last_charge(){'\n'}
              <span className="g">✓</span> trace.diff(run_4821, run_4790){'\n'}
              <span className="g">✓</span> exported checkout.spec.ts
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQ_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'testing', label: 'Testing & clones' },
  { id: 'guard', label: 'Production guard' },
  { id: 'agents', label: 'Agents & setup' },
];

const FAQ_ITEMS = [
  // General
  {
    category: 'general',
    q: 'What is Molar?',
    a: 'Molar is a continuous QA platform for software teams. It maps your application from a URL, authors critical-path scenarios in plain language, runs them with stateful clones of third-party services, and guards production on a schedule — so tests do not charge real cards, email real users, or write to production storage.',
  },
  {
    category: 'general',
    q: 'How is Molar different from Playwright or Cypress alone?',
    a: 'Playwright and Cypress are excellent test runners. Molar adds an autonomous layer on top: it discovers flows from your live app, writes scenarios in markdown, provisions safe clones of Stripe, email, auth, and other vendors, exports standard Playwright specs, and can gate PRs and monitor production without replacing your existing toolchain.',
  },
  {
    category: 'general',
    q: 'Who is Molar built for?',
    a: 'Teams shipping web apps with real integrations — payments, email, auth, webhooks — who need end-to-end coverage without maintaining brittle scripts or risking production side effects. It fits startups without a dedicated QA function and larger teams that want agent-authored tests with human review.',
  },
  {
    category: 'general',
    q: 'Is it safe to point Molar at production?',
    a: 'Yes, when configured for guard and crawl modes Molar uses ephemeral test identities, virtual cards, sandboxed inboxes, and cloned third-party endpoints. Production URLs can be monitored read-only on a schedule; destructive flows run against clones, not live customer data.',
  },
  {
    category: 'general',
    q: 'How long does setup take?',
    a: 'Most teams connect a project at app.molar.it and run npx molar-agent init in under a minute. Mapping a staging URL, compiling the first scenario, and installing the GitHub App for PR checks typically completes in one working session.',
  },

  // Testing & clones
  {
    category: 'testing',
    q: 'How do I test flows that hit Stripe, email, SMS, or S3 without side effects?',
    a: 'Molar runs your app against stateful clones of the services it depends on — same API shapes and error semantics, controllable state, no outbound production traffic. A checkout test records a charge on stripe.clone, not your live Stripe account.',
  },
  {
    category: 'testing',
    q: 'What is the difference between deep clones and fixture-backed vendors?',
    a: 'Deep clones (Stripe, Twilio, SendGrid, S3, auth, and others) maintain mutable state across steps — charges, messages, and buckets behave like production. Fixture-backed vendors return deterministic canned responses for less stateful APIs. Both keep tests hermetic.',
  },
  {
    category: 'testing',
    q: 'What format are Molar scenarios written in?',
    a: 'Scenarios are .molar.md files in your repository: YAML frontmatter plus numbered Markdown steps. The compiler exports standard Playwright .spec.ts files. There is no proprietary runtime DSL — the markdown is the source of truth your team reviews in pull requests.',
  },
  {
    category: 'testing',
    q: 'Do I own the tests Molar generates?',
    a: 'Yes. Exported Playwright specs and scenario markdown live in your repo under your version control. You can edit, delete, or run them with npx playwright test without Molar online. Leaving the platform does not brick your test suite.',
  },
  {
    category: 'testing',
    q: 'Can Molar run in CI or GitHub Actions?',
    a: 'Yes. Compile scenarios locally or in CI, run with the Molar CLI or plain Playwright, and optionally wire the GitHub App so Guard posts a required check on every pull request. Service tokens are supported for headless pipelines.',
  },

  // Production guard
  {
    category: 'guard',
    q: 'Can Molar monitor production on a schedule?',
    a: 'Guard runs your critical-path scenarios against live production URLs on a cadence you define. Failures surface in the dashboard, Slack, and as GitHub checks so regressions are caught before customers report them.',
  },
  {
    category: 'guard',
    q: 'How does Molar gate pull requests?',
    a: 'Install the Molar GitHub App and mark the Molar check as required. On each PR, Guard compiles affected scenarios, runs them against cloned services or your staging target, and blocks merge when a critical path fails — with a trace link in the check output.',
  },
  {
    category: 'guard',
    q: 'What happens when a Molar test fails?',
    a: 'Every run captures a full Trace: DOM snapshots, network, console, and clone activity for step-by-step replay. You can diff against the last green run, ask the built-in debugger what changed, and on confirmed regressions Mender can draft a fix pull request for human review.',
  },
  {
    category: 'guard',
    q: 'Does Molar support deploy-time or shadow checks?',
    a: 'Yes. During rollout, Guard can shadow critical paths against the new release with safe identities while production traffic continues. The same scenarios used for PR gating are reused post-ship so verification stays consistent across the release loop.',
  },
  {
    category: 'guard',
    q: 'Can Molar open a fix pull request automatically?',
    a: 'When a failure is confirmed as a regression, Mender analyzes the trace and proposed diff, then opens a fix PR with context and a regression test. A human always approves the merge — Molar does not auto-ship code to production.',
  },

  // Agents & setup
  {
    category: 'agents',
    q: 'Can autonomous coding agents use Molar?',
    a: 'Yes. Molar exposes run, clone, trace, and export capabilities over the Model Context Protocol (MCP). Agents in Cursor, Claude Code, Windsurf, and similar tools can invoke Molar to verify their own changes before opening a pull request.',
  },
  {
    category: 'agents',
    q: 'Do I need a specific LLM provider or API key?',
    a: 'No. Molar is provider-agnostic. Use Molar Cloud with hosted models, or bring your own key (BYOK) for OpenAI, Anthropic, Azure OpenAI, or other supported gateways. Cartographer and the debugger honor your org key policy.',
  },
  {
    category: 'agents',
    q: 'Can we self-host Molar in our VPC?',
    a: 'Enterprise plans support self-hosted clones, private networking, and deployment inside your VPC so application code and traces never leave your boundary. Contact the team for Helm charts and air-gapped options.',
  },
  {
    category: 'agents',
    q: 'What does pricing look like?',
    a: 'A free tier includes one project and 500 test runs per month. Pro is $99/month with unlimited projects, 10,000 runs, production guard, and stateful clones. Enterprise adds self-hosted clones, SSO, audit logs, and dedicated support.',
  },
  {
    category: 'agents',
    q: 'What does npx molar-agent init do?',
    a: 'It links your local repository to your Molar organization, writes config files, installs the Playwright export toolchain, and prints the commands to map a URL, compile scenarios, and run your first guarded check.',
  },
];

function FAQ() {
  const [activeCat, setActiveCat] = React.useState('general');
  const [openQ, setOpenQ] = React.useState(FAQ_ITEMS[0].q);
  const shellRef = React.useRef(null);

  const visibleItems = React.useMemo(
    () => FAQ_ITEMS.filter((item) => item.category === activeCat),
    [activeCat]
  );

  const selectCategory = (id) => {
    if (id === activeCat) return;
    setActiveCat(id);
    const first = FAQ_ITEMS.find((item) => item.category === id);
    setOpenQ(first ? first.q : null);

    const shell = shellRef.current;
    if (!shell) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
    const top = shell.getBoundingClientRect().top + window.scrollY - navH - 24;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const toggleQuestion = (q) => {
    setOpenQ((prev) => (prev === q ? null : q));
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-inner">
        <header className="faq-header">
          <Reveal>
            <span className="faq-badge">
              <i aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9.2a2.6 2.6 0 0 1 4.5 1.4c0 1.7-2.1 2.5-2.1 2.5" />
                  <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
                </svg>
              </i>
              FAQ
            </span>
          </Reveal>
          <Reveal as="h2" delay={60} className="faq-title">
            We have the <span className="faq-hl">answers</span>
          </Reveal>
          <Reveal delay={120}>
            <p className="faq-sub">
              Product, safety, production guard, and setup — the questions teams ask
              before adopting autonomous QA.
            </p>
          </Reveal>
        </header>

        <div className="faq-shell" ref={shellRef}>
          <aside className="faq-aside" aria-label="FAQ categories">
            <nav className="faq-tabs">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`faq-tab${activeCat === cat.id ? ' is-active' : ''}`}
                  onClick={() => selectCategory(cat.id)}
                  aria-current={activeCat === cat.id ? 'true' : undefined}
                >
                  <span className="faq-tab-icon" aria-hidden>
                    {cat.id === 'general' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
                    )}
                    {cat.id === 'testing' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg>
                    )}
                    {cat.id === 'guard' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /></svg>
                    )}
                    {cat.id === 'agents' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a7 7 0 0 1 7 7v1h2v8H3v-8h2v-1a7 7 0 0 1 7-7z" /><path d="M9 14h6" /></svg>
                    )}
                  </span>
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="faq-main" key={activeCat}>
            <div className="faq-list">
              {visibleItems.map((item, i) => {
                const isOpen = openQ === item.q;
                return (
                  <article
                    key={item.q}
                    className={`faq-item${isOpen ? ' open' : ''}`}
                    style={{ '--fi': i }}
                  >
                    <button
                      type="button"
                      className="faq-q"
                      aria-expanded={isOpen}
                      onClick={() => toggleQuestion(item.q)}
                    >
                      <span>{item.q}</span>
                      <span className="faq-icon" aria-hidden>+</span>
                    </button>
                    <div className="faq-a">
                      <div className="faq-a-inner"><p>{item.a}</p></div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA + footer ---------- */
function CTA() {
  return (
    <Reveal as="section" className="cta">
      <h2>Ship faster. Break <span className="hl">nothing.</span></h2>
      <p>Sixty seconds from one command to a QA agent guarding your production. No real cards, no real emails, no real customers harmed.</p>
      <div className="cta-row">
        <a className="btn btn-signal" href="https://app.molar.it">Get started free <span className="arr">→</span></a>
        <a className="btn btn-outline" href={CALENDLY_URL} onClick={openCalendly}>Talk to the founder</a>
      </div>
      <div className="cta-hint">
        or run <a href="/docs">npx molar-agent init</a> — free tier, no card required
      </div>
    </Reveal>
  );
}

function SiteFooter() {
  const showPricing = typeof window !== 'undefined' && window.MOLAR_SITE?.showPricing;
  const primaryCta = typeof window !== 'undefined' && window.molarPrimaryCta
    ? window.molarPrimaryCta()
    : 'https://app.molar.it';
  const primaryLabel = typeof window !== 'undefined' && window.molarPrimaryCtaLabel
    ? window.molarPrimaryCtaLabel()
    : 'Get started →';

  return (
    <footer className="site-footer">
      <div className="content-wrap site-footer-shell">
        <section className="site-footer-cta-band" aria-label="Get started">
          <div className="site-footer-watermark" aria-hidden="true">
            Molar<span className="dot">.</span>
          </div>
          <div className="site-footer-cta-content">
            <p className="site-footer-cta-copy">
              Curious how Molar fits your stack — or want to talk through QA for your company?
            </p>
            <div className="site-footer-cta-actions">
              <a href={CALENDLY_URL} className="btn btn-ghost" onClick={openCalendly}>
                Talk to founders →
              </a>
              <a href={primaryCta} className="btn btn-primary">{primaryLabel}</a>
            </div>
          </div>
        </section>

        <div className="site-footer-nav">
          <div className="site-footer-brand">
            <p className="site-footer-tagline">The autonomous QA framework.</p>
            <p className="site-footer-desc">
              Maps your app, guards production, and clones the APIs you depend on —
              without real cards, emails, or customers in tests.
            </p>
            <p className="site-footer-status">
              <span className="site-footer-status-dot" aria-hidden="true" />
              All systems operational
            </p>
          </div>

          <div className="site-footer-col">
            <h2 className="site-footer-col-title">Platform</h2>
            <nav className="site-footer-links" aria-label="Platform">
              <a href="/">Home</a>
              <a href="/#how">How it works</a>
              {showPricing ? <a href="/#pricing">Pricing</a> : null}
              <a href="/#faq">FAQ</a>
            </nav>
          </div>

          <div className="site-footer-col">
            <h2 className="site-footer-col-title">Resources</h2>
            <nav className="site-footer-links" aria-label="Resources">
              <a href="/docs">Docs</a>
              <a href="/thesis">Thesis</a>
              <a href="https://github.com/pratikranaa/molar-it">GitHub</a>
              <a href="/blog">Blog</a>
              <a href="/changelog">Changelog</a>
            </nav>
          </div>

          <div className="site-footer-col">
            <h2 className="site-footer-col-title">Product suite</h2>
            <nav className="site-footer-links" aria-label="Product suite">
              <a href="https://cartographer.molar.it">Cartographer</a>
              <a href="https://clones.molar.it">Clones</a>
              <a href="https://guard.molar.it">Guard</a>
              <a href="https://trace.molar.it">Trace</a>
            </nav>
          </div>
        </div>

        <div className="site-footer-divider" aria-hidden="true">
          <div className="site-footer-divider-line" />
        </div>

        <div className="site-footer-legal">
          <span className="site-footer-legal-copy">© 2026 Molar Labs</span>
          <nav className="site-footer-legal-links" aria-label="Legal">
            <a href="mailto:pratik@molar.it">pratik@molar.it</a>
            <span className="site-footer-legal-sep" aria-hidden>·</span>
            <a href="/privacy">Privacy</a>
            <span className="site-footer-legal-sep" aria-hidden>·</span>
            <a href="/terms">Terms</a>
            <span className="site-footer-legal-sep" aria-hidden>·</span>
            <a href="/llms.txt">llms.txt</a>
          </nav>
          <span className="site-footer-legal-by">
            Built with <span className="site-footer-heart" aria-hidden>❤️</span> in Bengaluru, India
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- app ---------- */
function App() {
  React.useEffect(() => {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    const scrollFromHash = () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      const id = hash.slice(1);
      let tries = 0;
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) { el.scrollIntoView({ behavior: tries === 0 ? 'auto' : 'smooth', block: 'start' }); return; }
        if (tries++ < 40) requestAnimationFrame(attempt);
      };
      requestAnimationFrame(attempt);
    };
    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);
    return () => window.removeEventListener('hashchange', scrollFromHash);
  }, []);

  return (
    <>
      <PageLoader />
      <HomeNav />
      <main>
        <Hero />
        <Problem />
        <Surfaces />
        <ReleaseLoop />
        <Clones />
        <CodePair />
        <Agents />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
