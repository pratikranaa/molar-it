// Site footer — CTA band → link grid → legal bar.

const FOOTER_CALENDLY = 'https://calendly.com/pratikrana/30min';

function footerCalendlyClick(e) {
  if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: FOOTER_CALENDLY });
  }
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="frame site-footer-shell">
        <section className="site-footer-cta-band" aria-label="Get started">
          <div className="site-footer-watermark serif" aria-hidden="true">
            <em>Molar</em>
          </div>
          <div className="site-footer-cta-content">
            <p className="site-footer-cta-copy">
              Curious how Molar fits your stack — or want to talk through QA for your company?
            </p>
            <div className="site-footer-cta-actions">
              <a
                href={FOOTER_CALENDLY}
                className="btn btn-ghost"
                onClick={footerCalendlyClick}
              >
                Talk to founders →
              </a>
              <a href={window.molarPrimaryCta ? window.molarPrimaryCta() : 'https://app.molar.it'} className="btn btn-primary">
                {window.molarPrimaryCtaLabel ? window.molarPrimaryCtaLabel() : 'Get started →'}
              </a>
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
              {window.MOLAR_SITE?.showPricing ? <a href="/#pricing">Pricing</a> : null}
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
          </nav>
          <span className="site-footer-legal-by">
            Built with <span className="site-footer-heart" aria-hidden>❤️</span> in Bengaluru, India
          </span>
        </div>
      </div>
    </footer>
  );
}
