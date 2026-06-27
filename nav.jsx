// Shared site nav — loaded on the homepage and static subpages.

const CALENDLY_URL = 'https://calendly.com/pratikrana/30min';
const SHOW_PRICING = Boolean(window.MOLAR_SITE?.showPricing);

function handleCalendlyClick(e) {
  if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

function useCalendlyAssets() {
  React.useEffect(() => {
    if (!document.querySelector('link[data-molar-calendly]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.dataset.molarCalendly = '1';
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-molar-calendly]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.dataset.molarCalendly = '1';
      document.body.appendChild(script);
    }
  }, []);
}

const PRIMARY_NAV = [
  { href: '/#how', label: 'How it works' },
  ...(SHOW_PRICING ? [{ href: '/#pricing', label: 'Pricing' }] : []),
  { href: '/blog', label: 'Blog' },
];

const MORE_NAV = [
  { href: '/changelog', label: 'Changelog' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/docs', label: 'Docs' },
  { href: '/thesis', label: 'Thesis' },
  { href: '/qa-agent', label: 'QA Agent' },
  { href: '/vs/cypress', label: 'vs Cypress' },
  { href: '/vs/playwright', label: 'vs Playwright' },
  { href: '/integrations/github-actions', label: 'GitHub Actions' },
];

const PRODUCTS_NAV = [
  {
    href: 'https://cartographer.molar.it',
    label: 'Cartographer',
    tag: '01 / Agent',
    desc: 'Map your app and author critical-path tests from live traces.',
  },
  {
    href: 'https://clones.molar.it',
    label: 'Clones',
    tag: '02 / Sandbox',
    desc: 'Stateful mirrors of Stripe, email, S3, and ~28 more services.',
  },
  {
    href: 'https://guard.molar.it',
    label: 'Guard',
    tag: '03 / Runtime',
    desc: 'PR gates and continuous production checks before users report bugs.',
  },
  {
    href: 'https://trace.molar.it',
    label: 'Trace',
    tag: '04 / Debugger',
    desc: 'Replay any failed run and diff against the last green trace.',
  },
];

function isHomePath() {
  const p = window.location.pathname;
  return p === '/' || p === '/index.html' || p.endsWith('/index.html');
}

function findSectionEl(id) {
  const root = document.getElementById('root');
  if (root) {
    const inRoot = root.querySelector('#' + CSS.escape(id));
    if (inRoot) return inRoot;
  }
  return document.getElementById(id);
}

function scrollToSection(hash, behavior) {
  if (!hash || hash === '#') return false;
  const id = hash.replace(/^#/, '');
  const doScroll = (el) => {
    if (!el) return false;
    el.scrollIntoView({ behavior: behavior || 'smooth', block: 'start' });
    const next = '#' + id;
    if (window.history.replaceState) {
      window.history.replaceState(null, '', next);
    } else {
      window.location.hash = id;
    }
    return true;
  };

  const el = findSectionEl(id);
  if (el) return doScroll(el);

  // Homepage: React sections may not be mounted yet when nav is clicked early.
  let tries = 0;
  const attempt = () => {
    const target = findSectionEl(id);
    if (target) {
      doScroll(target);
      return;
    }
    if (tries++ < 40) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
  return true;
}

function handleHashNavClick(e, href, onAfter) {
  const hashIdx = href.indexOf('#');
  if (hashIdx === -1) {
    onAfter?.();
    return;
  }
  const pathPart = href.slice(0, hashIdx);
  const hash = href.slice(hashIdx);
  const homeLink = !pathPart || pathPart === '/';
  if (homeLink && isHomePath() && hash.length > 1) {
    e.preventDefault();
    scrollToSection(hash);
    onAfter?.();
  } else {
    onAfter?.();
  }
}

function NavDropdown({ label, items, onNavigate, rich }) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef(null);
  // 200–300ms is the usual hover-menu grace period — enough to reach a link, not sluggish.
  const CLOSE_DELAY_MS = 280;
  const menuClass = 'nav-dropdown-menu' + (rich ? ' nav-dropdown-menu--rich' : '');

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  React.useEffect(() => () => clearCloseTimer(), []);

  const rootClass =
    'nav-dropdown' +
    (rich ? ' nav-dropdown--rich' : '') +
    (open ? ' nav-dropdown--open' : '');

  return (
    <div
      className={rootClass}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocusCapture={openMenu}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) scheduleClose();
      }}
    >
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-haspopup="true"
      >
        {label}
        <span className="nav-dropdown-caret" aria-hidden>▾</span>
      </button>
      <div className={menuClass} role="menu">
        {items.map((item) => (
          <a
            key={item.href}
            role="menuitem"
            href={item.href}
            className={'nav-dropdown-item' + (rich ? ' nav-dropdown-item--rich' : '')}
            onClick={(e) => {
              handleHashNavClick(e, item.href, () => { onNavigate?.(); });
            }}
          >
            {rich ? (
              <>
                <span className="nav-dropdown-item-tag">{item.tag}</span>
                <span className="nav-dropdown-item-label">{item.label}</span>
                <span className="nav-dropdown-item-desc">{item.desc}</span>
              </>
            ) : (
              item.label
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  useCalendlyAssets();

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const onMq = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const onNavClick = (e, href) => handleHashNavClick(e, href, closeMenu);

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <div className="frame nav-inner">
          <div className="brand">
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="brand-mark"><em style={{ fontStyle: 'italic' }}>Molar</em></span>
            </a>
          </div>

          <div className="nav-links nav-links--desktop">
            <a href="/#how" onClick={(e) => onNavClick(e, '/#how')}>How it works</a>
            <NavDropdown label="Products" items={PRODUCTS_NAV} rich />
            {SHOW_PRICING ? <a href="/#pricing" onClick={(e) => onNavClick(e, '/#pricing')}>Pricing</a> : null}
            <a href="/blog" onClick={(e) => onNavClick(e, '/blog')}>Blog</a>
            <NavDropdown label="More" items={MORE_NAV} />
          </div>

          <div className="nav-end">
            <a
              href={CALENDLY_URL}
              className="btn btn-ghost nav-demo-btn"
              onClick={handleCalendlyClick}
            >
              Book a demo
            </a>
            <a href="https://app.molar.it" className="btn btn-primary nav-cta-btn">Get started →</a>
            <button
              type="button"
              className="nav-menu-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="nav-menu-toggle-icon" aria-hidden>
                {menuOpen ? (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 5l12 12M17 5L5 17" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 6.5h14M4 11h14M4 15.5h14" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        id="site-menu"
        className={'nav-mobile' + (menuOpen ? ' nav-mobile--open' : '')}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="nav-mobile-backdrop"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close menu"
        />
        <div className="nav-mobile-sheet">
          <div className="nav-mobile-inner">
            <div className="nav-links nav-mobile-links">
              <a href="/#how" onClick={(e) => onNavClick(e, '/#how')}>How it works</a>
              <span className="nav-mobile-group-label">Products</span>
              {PRODUCTS_NAV.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => onNavClick(e, item.href)} className="nav-mobile-product-link">
                  <span className="nav-mobile-product-tag">{item.tag}</span>
                  <span>{item.label}</span>
                </a>
              ))}
              {SHOW_PRICING ? <a href="/#pricing" onClick={(e) => onNavClick(e, '/#pricing')}>Pricing</a> : null}
              <a href="/blog" onClick={(e) => onNavClick(e, '/blog')}>Blog</a>
              <span className="nav-mobile-group-label">More</span>
              {MORE_NAV.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => onNavClick(e, item.href)}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="nav-cta nav-mobile-cta">
              <a
                href={CALENDLY_URL}
                className="btn btn-ghost"
                onClick={(e) => { handleCalendlyClick(e); closeMenu(); }}
              >
                Book a demo
              </a>
              <a href="https://app.molar.it" className="btn btn-primary" onClick={closeMenu}>
                Get started →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

window.Nav = Nav;
window.PRIMARY_NAV = PRIMARY_NAV;
window.PRODUCTS_NAV = PRODUCTS_NAV;
window.MORE_NAV = MORE_NAV;
window.scrollToSection = scrollToSection;
window.handleCalendlyClick = handleCalendlyClick;
window.CALENDLY_URL = CALENDLY_URL;
