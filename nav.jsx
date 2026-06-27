// Shared site nav — loaded on the homepage and static subpages.

const PRIMARY_NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/docs', label: 'Docs' },
  { href: '/thesis', label: 'Thesis' },
];

const MORE_NAV = [
  { href: '/qa-agent', label: 'QA Agent' },
  { href: '/vs/cypress', label: 'vs Cypress' },
  { href: '/vs/playwright', label: 'vs Playwright' },
  { href: '/integrations/github-actions', label: 'GitHub Actions' },
  { href: '/blog/test-stripe-without-real-cards', label: 'Blog · Stripe testing' },
];

function isHomePath() {
  const p = window.location.pathname;
  return p === '/' || p === '/index.html' || p.endsWith('/index.html');
}

function scrollToSection(hash, behavior) {
  if (!hash || hash === '#') return false;
  const id = hash.replace(/^#/, '');
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: behavior || 'smooth', block: 'start' });
  const next = '#' + id;
  if (window.history.replaceState) {
    window.history.replaceState(null, '', next);
  } else {
    window.location.hash = id;
  }
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

function NavDropdown({ label, items, onNavigate }) {
  return (
    <div className="nav-dropdown">
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-haspopup="true"
      >
        {label}
        <span className="nav-dropdown-caret" aria-hidden>▾</span>
      </button>
      <div className="nav-dropdown-menu" role="menu">
        {items.map((item) => (
          <a
            key={item.href}
            role="menuitem"
            href={item.href}
            onClick={(e) => {
              handleHashNavClick(e, item.href, () => { onNavigate?.(); });
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const [menuOpen, setMenuOpen] = React.useState(false);

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
            {PRIMARY_NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={(e) => onNavClick(e, item.href)}>
                {item.label}
              </a>
            ))}
            <NavDropdown label="More" items={MORE_NAV} />
          </div>

          <div className="nav-end">
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
              {PRIMARY_NAV.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => onNavClick(e, item.href)}>
                  {item.label}
                </a>
              ))}
              <span className="nav-mobile-group-label">More</span>
              {MORE_NAV.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => onNavClick(e, item.href)}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="nav-cta nav-mobile-cta">
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
window.MORE_NAV = MORE_NAV;
window.scrollToSection = scrollToSection;
