(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-2YL3J3PX8R';
  const STORAGE_KEY = 'molar.analytics.consent.v1';
  const GOOGLE_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  const CONSENT_VALUES = granted => ({
    // This site asks only for analytics. Advertising storage and signals stay off.
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
  const CTA_NAMES = new Map([
    ['trial-nav', 'trial_navigation'],
    ['trial-hero', 'trial_hero'],
    ['trial-footer', 'trial_footer'],
    ['contact-hero', 'contact_hero'],
    ['contact-footer', 'contact_footer'],
    ['signup-nav', 'signup_navigation'],
    ['signup-hero', 'signup_hero'],
    ['signup-footer', 'signup_footer'],
    ['setup-command-copied', 'setup_command_copied'],
    ['agent-prompt-copied', 'agent_prompt_copied'],
    ['setup-docs', 'setup_docs'],
    ['agent-docs', 'agent_docs'],
    ['clone-catalog', 'clone_catalog'],
    ['clone-request', 'clone_request'],
  ]);
  const DEMO_ACTIONS = new Map([
    ['[data-scene-play]', 'playback'],
    ['[data-scene-replay]', 'replay'],
    ['[data-scene-advance]', 'advance'],
    ['[data-scene-condition]', 'condition'],
    ['[data-service-tab]', 'service_tab'],
    ['[data-service-condition]', 'service_condition'],
    ['[data-recording-start]', 'recording'],
    ['[data-showcase-tab]', 'product_tab'],
  ]);
  const DESTINATIONS = new Map([
    ['/', 'home'],
    ['/platform', 'platform'],
    ['/platform/browser-agents', 'browser_agents'],
    ['/platform/live-view', 'live_view'],
    ['/platform/swarm', 'swarm'],
    ['/platform/developer-tools', 'developer_tools'],
    ['/products/cartographer', 'cartographer'],
    ['/products/clones', 'clones'],
    ['/products/guard', 'guard'],
    ['/products/trace', 'trace'],
    ['/products/mender', 'mender'],
    ['/solutions', 'solutions'],
    ['/solutions/checkout-testing', 'checkout'],
    ['/solutions/authentication-testing', 'authentication'],
    ['/solutions/team-workflows', 'team_workflows'],
    ['/solutions/preview-deployments', 'preview_deployments'],
    ['/solutions/workflow-automation', 'workflow_automation'],
    ['/solutions/web-data-extraction', 'web_data_extraction'],
    ['/solutions/integration-testing', 'integration_testing'],
    ['/solutions/ai-agents', 'coding_agents'],
    ['/solutions/startups', 'startups'],
    ['/resources', 'resources'],
    ['/blog', 'blog'],
    ['/company', 'company'],
    ['/changelog', 'changelog'],
    ['/contact', 'contact'],
    ['/pricing', 'pricing'],
    ['/privacy', 'privacy'],
    ['/terms', 'terms'],
    ['/security', 'security'],
    ['/verify', 'verify'],
    ['/waitlist', 'waitlist'],
    ['/ask', 'ask'],
  ]);
  const state = {
    consent: null,
    gpc: false,
    scriptLoaded: false,
    scriptLoading: null,
    pageViewSent: false,
    queuedEvents: [],
    panel: null,
    preferencesButton: null,
    returnFocus: null,
    clickBound: false,
  };

  if (window.MolarAnalytics?.initialized) return;

  function readConsent() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // A blocked storage area should not block a consent choice for this page.
    }
  }

  function hasGpc() {
    return navigator.globalPrivacyControl === true;
  }

  // GA's automatic search/form events read the document URL independently of
  // page_location. Keep the tag off parameterized URLs and private proof views.
  function measurablePage() {
    const proofPage = /^\/verify(?:\.html)?\/?$/.test(window.location.pathname);
    return !proofPage && !window.location.search && !window.location.hash;
  }

  function sanitizePath() {
    const path = window.location.pathname || '/';
    return (`/${path.replace(/^\/+/, '').replace(/[\u0000-\u001f\u007f]/g, '')}`).slice(0, 256) || '/';
  }

  function sanitizeReferrerOrigin() {
    if (!document.referrer) return undefined;
    try {
      const referrer = new URL(document.referrer);
      return referrer.protocol === 'http:' || referrer.protocol === 'https:' ? referrer.origin.slice(0, 128) : undefined;
    } catch {
      return undefined;
    }
  }

  function sanitizeTitle() {
    return (document.title || 'Molar').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 160) || 'Molar';
  }

  function sanitizedPageParams() {
    const params = { page_location: `${window.location.origin}${sanitizePath()}`, page_title: sanitizeTitle() };
    const referrerOrigin = sanitizeReferrerOrigin();
    if (referrerOrigin) params.page_referrer = referrerOrigin;
    return params;
  }

  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      ...CONSENT_VALUES(false),
      wait_for_update: 500,
    });
  }

  function expireCookie(name, domain) {
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
  }

  function clearGoogleCookies() {
    const names = new Set(['_ga', `_ga_${MEASUREMENT_ID.replace(/[^A-Za-z0-9]/g, '')}`]);
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (name === '_ga' || name.startsWith('_ga_')) names.add(name);
    });
    names.forEach(name => {
      expireCookie(name);
      if (location.hostname === 'molar.it' || location.hostname.endsWith('.molar.it')) expireCookie(name, '.molar.it');
    });
  }

  function sendEvent(name, params = {}) {
    if (state.consent !== 'granted' || state.gpc || !measurablePage() || typeof window.gtag !== 'function') return;
    if (!state.scriptLoaded) {
      state.queuedEvents.push([name, params]);
      loadAnalytics();
      return;
    }
    window.gtag('event', name, params);
  }

  function sendPageView() {
    if (state.pageViewSent || state.consent !== 'granted' || state.gpc) return;
    window.gtag('event', 'page_view', sanitizedPageParams());
    state.pageViewSent = true;
  }

  function flushEvents() {
    const queued = state.queuedEvents.splice(0);
    queued.forEach(([name, params]) => sendEvent(name, params));
  }

  function loadAnalytics() {
    if (state.consent !== 'granted' || state.gpc || !measurablePage()) return Promise.resolve(false);
    if (state.scriptLoaded) return Promise.resolve(true);
    if (state.scriptLoading) return state.scriptLoading;

    state.scriptLoading = new Promise(resolve => {
      const existing = [...document.scripts].find(script => script.src === GOOGLE_SCRIPT_SRC || script.dataset.molarAnalytics === 'true');
      const script = existing || document.createElement('script');
      const finish = () => {
        if (state.consent !== 'granted' || state.gpc) {
          state.queuedEvents = [];
          state.scriptLoading = null;
          if (script.dataset.molarAnalytics === 'true') script.remove();
          resolve(false);
          return;
        }
        window.gtag('js', new Date());
        window.gtag('set', sanitizedPageParams());
        window.gtag('config', MEASUREMENT_ID, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          ...sanitizedPageParams(),
        });
        state.scriptLoaded = true;
        state.scriptLoading = null;
        sendPageView();
        flushEvents();
        resolve(true);
      };
      const fail = () => {
        state.scriptLoading = null;
        if (!existing || script.dataset.molarAnalytics === 'true') script.remove();
        resolve(false);
      };
      script.addEventListener('load', finish, { once: true });
      script.addEventListener('error', fail, { once: true });
      if (existing) {
        if (window.google_tag_data || window.gtag.loaded) finish();
      } else {
        script.async = true;
        script.src = GOOGLE_SCRIPT_SRC;
        script.dataset.molarAnalytics = 'true';
        (document.head || document.documentElement).append(script);
      }
    });
    return state.scriptLoading;
  }

  function panelCopy() {
    if (state.gpc) return 'Your browser has Global Privacy Control on, so optional analytics stay off.';
    if (state.consent === 'granted') return 'Optional analytics are on. You can change this choice any time.';
    if (state.consent === 'denied') return 'Optional analytics are off. You can change this choice any time.';
    return 'Optional analytics help us see which pages and product examples are useful. Choose whether to allow them.';
  }

  function updatePanel() {
    if (!state.panel) return;
    state.panel.querySelector('[data-molar-consent-copy]').textContent = panelCopy();
  }

  function closePanel() {
    if (!state.panel) return;
    state.panel.hidden = true;
    state.panel.removeAttribute('data-open');
    const focusTarget = state.returnFocus;
    state.returnFocus = null;
    focusTarget?.focus?.({ preventScroll: true });
  }

  function openPanel(returnFocus = null) {
    if (!state.panel) return;
    state.returnFocus = returnFocus;
    updatePanel();
    state.panel.hidden = false;
    state.panel.setAttribute('data-open', 'true');
    state.panel.querySelector('[data-molar-consent-action="declined"]')?.focus();
  }

  function setConsent(requestedValue) {
    const next = requestedValue === 'granted' && !hasGpc() ? 'granted' : 'denied';
    state.gpc = hasGpc();
    state.consent = next;
    window[`ga-disable-${MEASUREMENT_ID}`] = next !== 'granted';
    writeConsent(next);
    window.gtag('consent', 'update', CONSENT_VALUES(next === 'granted'));
    if (next === 'granted') {
      loadAnalytics();
    } else {
      state.queuedEvents = [];
      clearGoogleCookies();
    }
    updatePanel();
    closePanel();
    window.dispatchEvent(new CustomEvent('molar:consent', { detail: { consent: next } }));
  }

  function createPanel() {
    if (state.panel || !document.body) return;
    const panel = document.createElement('aside');
    panel.className = 'molar-consent';
    panel.dataset.molarConsent = 'true';
    panel.hidden = true;
    panel.setAttribute('aria-labelledby', 'molar-consent-title');
    panel.innerHTML = `<div class="molar-consent-inner"><div><h2 id="molar-consent-title">Optional analytics</h2><p data-molar-consent-copy></p></div><div class="molar-consent-actions"><button type="button" class="molar-consent-action" data-molar-consent-action="declined">Decline analytics</button><button type="button" class="molar-consent-action" data-molar-consent-action="granted">Accept analytics</button></div></div>`;
    panel.addEventListener('click', event => {
      const button = event.target.closest('[data-molar-consent-action]');
      if (button) setConsent(button.dataset.molarConsentAction);
    });
    document.body.append(panel);
    state.panel = panel;
    updatePanel();
  }

  function addPreferencesButton() {
    if (state.preferencesButton || !document.body) return;
    const footerLinks = document.querySelector('.site-footer .footer-bottom > div');
    if (!footerLinks) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'molar-preferences';
    button.dataset.molarPreferences = 'true';
    button.textContent = 'Privacy choices';
    button.addEventListener('click', () => openPanel(button));
    footerLinks.append(button);
    state.preferencesButton = button;
  }

  function navigationSource(anchor) {
    if (anchor.closest('.site-header')) {
      const group = anchor.closest('.nav-group');
      if (group) {
        const label = group.querySelector('summary')?.firstChild?.textContent?.trim().toLowerCase();
        if (label && ['platform', 'products', 'solutions', 'resources'].includes(label)) return `header_${label}`;
      }
      return 'header';
    }
    if (anchor.closest('.site-footer')) return 'footer';
    if (anchor.closest('.breadcrumbs')) return 'breadcrumb';
    return 'content';
  }

  function trackNavigation(anchor) {
    if (anchor.closest('#ask-sources')) {
      sendEvent('navigation_click', { source: 'ask_sources', destination: 'source' });
      return;
    }
    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    const destination = DESTINATIONS.get(url.pathname.replace(/\/$/, '') || '/');
    if (!destination) return;
    sendEvent('navigation_click', { source: navigationSource(anchor), destination });
  }

  function bindInteractions() {
    if (state.clickBound) return;
    state.clickBound = true;
    document.addEventListener('click', event => {
      const target = event.target.closest?.('a,button');
      if (!target) return;
      const cta = target.dataset.track && CTA_NAMES.get(target.dataset.track);
      if (cta) sendEvent('cta_click', { cta });
      for (const [selector, action] of DEMO_ACTIONS) {
        if (target.matches(selector)) {
          sendEvent('demo_interaction', { action });
          break;
        }
      }
      if (target.tagName === 'A') trackNavigation(target);
    });
  }

  function init() {
    ensureGtag();
    state.gpc = hasGpc();
    state.consent = state.gpc ? 'denied' : readConsent();
    window[`ga-disable-${MEASUREMENT_ID}`] = state.consent !== 'granted';
    createPanel();
    addPreferencesButton();
    bindInteractions();
    if (!state.consent && !state.gpc) { updatePanel(); state.panel.hidden = false; state.panel.setAttribute('data-open', 'true'); }
    if (state.consent === 'granted' && !state.gpc) {
      window.gtag('consent', 'update', CONSENT_VALUES(true));
      loadAnalytics();
    }
    if (state.gpc) clearGoogleCookies();
  }

  window.MolarAnalytics = {
    initialized: true,
    getConsent: () => state.consent,
    openPreferences: () => openPanel(state.preferencesButton),
    revoke: () => setConsent('denied'),
    track: (name, params = {}) => {
      if (name === 'cta_click' && CTA_NAMES.has(params.cta)) sendEvent(name, { cta: CTA_NAMES.get(params.cta) });
      if (name === 'demo_interaction' && [...DEMO_ACTIONS.values()].includes(params.action)) sendEvent(name, { action: params.action });
      if (name === 'navigation_click' && ['header', 'header_platform', 'header_products', 'header_solutions', 'header_resources', 'footer', 'breadcrumb', 'content', 'ask_sources'].includes(params.source) && (params.destination === 'source' || [...DESTINATIONS.values()].includes(params.destination))) {
        sendEvent(name, { source: params.source, destination: params.destination });
      }
    },
  };

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY && event.newValue !== state.consent) {
      setConsent(event.newValue === 'granted' ? 'granted' : 'denied');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
