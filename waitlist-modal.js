// Surface landings: intercept app.molar.it CTAs → animated waitlist popup (Calendly-style).
// Opt in: <body data-waitlist-surface="clones"> + load waitlist-modal.css + this script.
(function () {
  const COPY = {
    default: {
      kicker: 'Early access',
      headline: 'Join the <em>waitlist.</em>',
      lede: 'Leave your email and we will reach out when your spot opens — usually within a few days.',
    },
    clones: {
      kicker: 'Clones',
      headline: 'Clones <em>early access.</em>',
      lede: 'Stateful clones for QA are rolling out in waves. Join the waitlist and we will reach out when you can spawn your first clone.',
    },
    cartographer: {
      kicker: 'Cartographer',
      headline: 'Cartographer <em>early access.</em>',
      lede: 'Agentic app mapping is rolling out in waves. Join the waitlist and we will reach out when you can map your app.',
    },
    guard: {
      kicker: 'Guard',
      headline: 'Guard <em>early access.</em>',
      lede: 'Production guard and PR gating are rolling out in waves. Join the waitlist and we will reach out when your workspace is ready.',
    },
    trace: {
      kicker: 'Trace',
      headline: 'Trace <em>early access.</em>',
      lede: 'Trace dashboards and MCP are rolling out in waves. Join the waitlist and we will reach out when your spot opens.',
    },
    home: {
      kicker: 'Molar',
      headline: 'Molar <em>early access.</em>',
      lede: 'The autonomous QA platform is rolling out in waves. Join the waitlist and we will reach out when your workspace is ready.',
    },
  };

  let root;
  let currentRef = 'waitlist';
  let closing = false;

  function apiUrl() {
    if (window.molarWaitlistApiUrl) return window.molarWaitlistApiUrl();
    const host = location.hostname;
    const local = host === 'localhost' || host === '127.0.0.1';
    const onMain = host === 'molar.it' || host === 'www.molar.it' || local;
    return onMain ? '/api/waitlist' : 'https://molar.it/api/waitlist';
  }

  function copyForRef(ref) {
    const key = String(ref || '').split(':')[0];
    return COPY[key] || COPY.default;
  }

  function ensureModal() {
    if (root) return root;

    root = document.createElement('div');
    root.className = 'molar-wl-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'molar-wl-title');
    root.innerHTML = `
      <div class="molar-wl-backdrop" data-wl-close></div>
      <div class="molar-wl-panel">
        <button type="button" class="molar-wl-close" aria-label="Close" data-wl-close>×</button>
        <div class="molar-wl-inner">
          <p class="molar-wl-kicker" id="molar-wl-kicker"></p>
          <h2 class="molar-wl-title" id="molar-wl-title"></h2>
          <p class="molar-wl-lede" id="molar-wl-lede"></p>
          <form class="molar-wl-form" id="molar-wl-form" novalidate>
            <label>
              Work email
              <input type="email" name="email" id="molar-wl-email" autocomplete="email" placeholder="you@company.com" required />
            </label>
            <label>
              Company <span class="opt">(optional)</span>
              <input type="text" name="company" id="molar-wl-company" autocomplete="organization" placeholder="Acme Inc." />
            </label>
            <label>
              Role <span class="opt">(optional)</span>
              <select name="role" id="molar-wl-role">
                <option value="">Select…</option>
                <option value="engineer">Engineering</option>
                <option value="founder">Founder / CTO</option>
                <option value="qa">QA / Test</option>
                <option value="product">Product</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label class="molar-wl-hp" aria-hidden="true">
              Website
              <input type="text" name="website" tabindex="-1" autocomplete="off" />
            </label>
            <input type="hidden" name="source" id="molar-wl-source" value="waitlist" />
            <button type="submit" class="btn btn-primary molar-wl-submit" id="molar-wl-submit">Join waitlist →</button>
          </form>
          <p class="molar-wl-status" id="molar-wl-status" role="status" aria-live="polite"></p>
          <p class="molar-wl-note">No spam. See our <a href="https://molar.it/privacy">Privacy Policy</a>.</p>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    root.querySelectorAll('[data-wl-close]').forEach((el) => {
      el.addEventListener('click', closeWaitlist);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) closeWaitlist();
    });

    const form = root.querySelector('#molar-wl-form');
    const status = root.querySelector('#molar-wl-status');
    const submit = root.querySelector('#molar-wl-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'molar-wl-status';
      status.textContent = '';

      const email = root.querySelector('#molar-wl-email').value.trim();
      if (!email || !email.includes('@')) {
        status.className = 'molar-wl-status is-err';
        status.textContent = 'Enter a valid email address.';
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Saving…';

      try {
        const res = await fetch(apiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            company: root.querySelector('#molar-wl-company').value.trim(),
            role: root.querySelector('#molar-wl-role').value,
            source: root.querySelector('#molar-wl-source').value,
            website: form.website ? form.website.value : '',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Something went wrong.');

        status.className = 'molar-wl-status is-ok';
        status.textContent = "You're on the list — we'll reach out when your spot opens.";
        form.reset();
        root.querySelector('#molar-wl-source').value = currentRef;
      } catch (err) {
        status.className = 'molar-wl-status is-err';
        status.textContent = err.message || 'Could not save. Email pratik@molar.it instead.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Join waitlist →';
      }
    });

    return root;
  }

  function setCopy(ref) {
    const c = copyForRef(ref);
    root.querySelector('#molar-wl-kicker').textContent = c.kicker;
    root.querySelector('#molar-wl-title').innerHTML = c.headline;
    root.querySelector('#molar-wl-lede').textContent = c.lede;
    root.querySelector('#molar-wl-source').value = ref;
    root.querySelector('#molar-wl-status').textContent = '';
    root.querySelector('#molar-wl-status').className = 'molar-wl-status';
  }

  function openWaitlist(ref) {
    ensureModal();
    currentRef = ref || 'waitlist';
    setCopy(currentRef);
    closing = false;
    root.classList.remove('is-closing');
    root.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const email = root.querySelector('#molar-wl-email');
    requestAnimationFrame(() => email.focus());
  }

  function closeWaitlist() {
    if (!root || !root.classList.contains('is-open') || closing) return;
    closing = true;
    root.classList.add('is-closing');
    root.classList.remove('is-open');
    document.body.style.overflow = '';

    const panel = root.querySelector('.molar-wl-panel');
    const done = () => {
      root.classList.remove('is-closing');
      closing = false;
      panel.removeEventListener('transitionend', done);
    };
    panel.addEventListener('transitionend', done);
    setTimeout(done, 400);
  }

  function refFromLink(a, surface) {
    try {
      const u = new URL(a.href);
      const hashRef = u.hash ? u.hash.replace(/^#/, '') : '';
      return hashRef ? `${surface}:${hashRef}` : surface;
    } catch {
      return surface;
    }
  }

  function hookLink(a, surface) {
    if (a.dataset.molarWlHooked) return;
    a.dataset.molarWlHooked = '1';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openWaitlist(refFromLink(a, surface));
    });
    a.setAttribute('role', 'button');
    a.setAttribute('aria-haspopup', 'dialog');
  }

  function hookLinks(surface) {
    document.querySelectorAll('a[href^="https://app.molar.it"]').forEach((a) => {
      hookLink(a, surface);
    });
  }

  function watchLinks(surface) {
    hookLinks(surface);
    const obs = new MutationObserver(() => hookLinks(surface));
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    const surface = document.body && document.body.dataset.waitlistSurface;
    if (!surface) return;
    ensureModal();
    watchLinks(surface);
    window.molarOpenWaitlist = openWaitlist;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
