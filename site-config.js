// Shared site flags — load before nav.jsx on any page that uses the React nav.
(function () {
  const defaults = {
    showPricing: false,
    /** Main Molar app at app.molar.it (homepage, nav, footer). */
    appLive: true,
    waitlistUrl: '/waitlist',
    waitlistOrigin: 'https://molar.it',
  };

  window.MOLAR_SITE = Object.assign(defaults, window.MOLAR_SITE || {});

  if (!window.MOLAR_SITE.showPricing) {
    document.documentElement.classList.add('pricing-off');
  }

  window.molarWaitlistUrl = function molarWaitlistUrl(ref) {
    const s = window.MOLAR_SITE || {};
    const onMain =
      typeof location !== 'undefined' &&
      (location.hostname === 'molar.it' || location.hostname === 'www.molar.it');
    const path = s.waitlistUrl || '/waitlist';
    const base = onMain ? path : `${s.waitlistOrigin || 'https://molar.it'}${path}`;
    const source =
      ref ||
      s.waitlistRef ||
      (document.body && document.body.dataset.waitlistSurface) ||
      '';
    return source ? `${base}?ref=${encodeURIComponent(source)}` : base;
  };

  window.molarWaitlistApiUrl = function molarWaitlistApiUrl() {
    const host = typeof location !== 'undefined' ? location.hostname : '';
    const local = host === 'localhost' || host === '127.0.0.1';
    const onMain = host === 'molar.it' || host === 'www.molar.it' || local;
    return onMain ? '/api/waitlist' : 'https://molar.it/api/waitlist';
  };

  /** Primary CTA on molar.it — goes to the live app when appLive. */
  window.molarPrimaryCta = function molarPrimaryCta() {
    const s = window.MOLAR_SITE || {};
    return s.appLive ? 'https://app.molar.it' : window.molarWaitlistUrl('home');
  };

  window.molarPrimaryCtaLabel = function molarPrimaryCtaLabel() {
    const s = window.MOLAR_SITE || {};
    return s.appLive ? 'Get started →' : 'Join waitlist →';
  };
})();
