// Shared current marketing chrome for the homepage and customer-facing subpages.
(function () {
  const CALENDLY_URL = 'https://calendly.com/pratikrana/30min';
  const PRODUCTS = [
    { href: 'https://cartographer.molar.it', name: 'Cartographer', detail: 'Explore journeys and create tests' },
    { href: 'https://clones.molar.it', name: 'Clones', detail: 'Test services without real side effects' },
    { href: 'https://guard.molar.it', name: 'Guard', detail: 'Protect pull requests and production' },
    { href: 'https://trace.molar.it', name: 'Trace', detail: 'Replay and understand every run' },
  ];

  function openCalendly(event) {
    if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
      event.preventDefault();
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  }

  function MarketingNav() {
    const [scrolled, setScrolled] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [productsOpen, setProductsOpen] = React.useState(false);
    const closeTimer = React.useRef(null);

    React.useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 20);
      const onKey = (event) => {
        if (event.key === 'Escape') {
          setMenuOpen(false);
          setProductsOpen(false);
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('keydown', onKey);
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
      };
    }, []);

    const openProducts = () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      setProductsOpen(true);
    };
    const closeProductsSoon = () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(() => setProductsOpen(false), 220);
    };

    return (
      <header className={`nv${scrolled ? ' nv-scrolled' : ''}`}>
        <div className="nv-inner">
          <a className="nv-brand" href="/">Molar<span className="dot">.</span></a>
          <nav className="nv-links" aria-label="Primary">
            <a href="/#how">How it works</a>
            <div className={`nv-products${productsOpen ? ' is-open' : ''}`} onMouseEnter={openProducts} onMouseLeave={closeProductsSoon} onFocusCapture={openProducts} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeProductsSoon(); }}>
              <button className="nv-products-trigger" type="button" aria-haspopup="true" aria-expanded={productsOpen} onClick={() => setProductsOpen((value) => !value)}>
                Products <span aria-hidden="true">⌄</span>
              </button>
              <div className="nv-products-menu" role="menu">
                {PRODUCTS.map((product) => (
                  <a key={product.name} href={product.href} role="menuitem"><span>{product.name}</span><small>{product.detail}</small></a>
                ))}
              </div>
            </div>
            <a href="https://docs.molar.it">Docs</a>
            <a href="/changelog">Changelog</a>
          </nav>
          <div className="nv-cta-row">
            <a className="nv-ghost" href={CALENDLY_URL} onClick={openCalendly}>Book a demo</a>
            <a className="btn btn-primary btn-sm" href="/verify#instant-proof">Verify a URL <span className="arr">→</span></a>
            <button className="nv-burger" type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">{menuOpen ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4.5h12M2 8h12M2 11.5h12" />}</svg>
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="nv-menu" aria-label="Mobile">
            <a href="/#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <span className="nv-menu-label">Products</span>
            {PRODUCTS.map((product) => <a key={product.name} href={product.href} onClick={() => setMenuOpen(false)}>{product.name}</a>)}
            <a href="https://docs.molar.it" onClick={() => setMenuOpen(false)}>Docs</a>
            <a href="/changelog" onClick={() => setMenuOpen(false)}>Changelog</a>
            <a href={CALENDLY_URL} onClick={(event) => { setMenuOpen(false); openCalendly(event); }}>Book a demo</a>
          </nav>
        ) : null}
      </header>
    );
  }

  function MarketingFooter() {
    const primaryCta = window.molarPrimaryCta ? window.molarPrimaryCta() : 'https://app.molar.it';
    const primaryLabel = window.molarPrimaryCtaLabel ? window.molarPrimaryCtaLabel() : 'Get started →';
    return (
      <footer className="site-footer">
        <div className="content-wrap site-footer-shell">
          <section className="site-footer-cta-band" aria-label="Get started">
            <div className="site-footer-watermark" aria-hidden="true">Molar<span className="dot">.</span></div>
            <div className="site-footer-cta-content"><p className="site-footer-cta-copy">Curious how Molar fits your stack — or want to talk through QA for your company?</p><div className="site-footer-cta-actions"><a href={CALENDLY_URL} className="btn btn-ghost" onClick={openCalendly}>Talk to founders →</a><a href={primaryCta} className="btn btn-primary">{primaryLabel}</a></div></div>
          </section>
          <div className="site-footer-nav">
            <div className="site-footer-brand"><p className="site-footer-tagline">The autonomous QA framework.</p><p className="site-footer-desc">Maps your app, guards production, and safely mirrors the services you depend on.</p><a className="site-footer-status" href="https://app.molar.it/dashboard/status"><span className="site-footer-status-dot" aria-hidden="true" />System status</a></div>
            <div className="site-footer-col"><h2 className="site-footer-col-title">Platform</h2><nav className="site-footer-links" aria-label="Platform"><a href="/">Home</a><a href="/#how">How it works</a><a href="/#faq">FAQ</a></nav></div>
            <div className="site-footer-col"><h2 className="site-footer-col-title">Resources</h2><nav className="site-footer-links" aria-label="Resources"><a href="https://docs.molar.it">Docs</a><a href="/thesis">Thesis</a><a href="/blog">Blog</a><a href="/changelog">Changelog</a></nav></div>
            <div className="site-footer-col"><h2 className="site-footer-col-title">Products</h2><nav className="site-footer-links" aria-label="Products">{PRODUCTS.map((product) => <a key={product.name} href={product.href}>{product.name}</a>)}</nav></div>
          </div>
          <div className="site-footer-divider-line" aria-hidden="true" />
          <div className="site-footer-legal"><span className="site-footer-legal-copy">© 2026 Molar Labs</span><nav className="site-footer-legal-links" aria-label="Legal"><a href="mailto:pratik@molar.it">pratik@molar.it</a><span className="site-footer-legal-sep" aria-hidden="true">·</span><a href="/privacy">Privacy</a><span className="site-footer-legal-sep" aria-hidden="true">·</span><a href="/terms">Terms</a></nav><span className="site-footer-legal-by">Built in Bengaluru, India</span></div>
        </div>
      </footer>
    );
  }

  window.MolarMarketingChrome = { MarketingNav, MarketingFooter };
})();
