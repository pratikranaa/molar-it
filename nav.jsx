// Shared site nav — loaded on the homepage and static subpages.

const PRIMARY_NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/thesis', label: 'Thesis' },
  { href: '/docs', label: 'Docs' },
];

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

  return (
    <>
      <nav className="nav" aria-label="Primary">
        <div className="frame nav-inner">
          <div className="brand">
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="brand-mark"><em style={{ fontStyle: 'italic' }}>Molar</em></span>
            </a>
          </div>
          <div className="nav-cluster">
            <div className="nav-links">
              {PRIMARY_NAV.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
            </div>
            <div className="nav-cta">
              <a href="https://app.molar.it" className="btn btn-primary">Get started →</a>
            </div>
          </div>
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
                <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
              ))}
            </div>
            <div className="nav-cta nav-mobile-cta">
              <a href="https://app.molar.it" className="btn btn-primary" onClick={closeMenu}>Get started →</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

window.Nav = Nav;
window.PRIMARY_NAV = PRIMARY_NAV;
