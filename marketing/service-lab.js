// "Make the hard cases easy to test": pick a service, set its clone's condition, and follow the cause (what the
// clone did) through the effect (what the app showed) to the verdict (what Molar checked). Illustrative examples;
// they never call a real service.
const svg = (name) => {
  const paths = {
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="m6 6 12 12M6 18 18 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-8Z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    file: '<path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h8"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
    warning: '<path d="M12 4 21 20H3L12 4Z"/><path d="M12 9v5m0 3v1"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7m2.5 8.5a6.5 6.5 0 0 0-3-5.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    retry: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.check}</svg>`;
};

export const SERVICE_LAB_SCENARIOS = Object.freeze({
  payments: {
    label: 'Payments', clone: 'Stripe clone', icon: 'card', logo: 'stripe.svg', key: 1,
    narrative: 'Check that a payment ends in the right order and access.',
    options: ['Charge succeeds', 'Card declined'],
    good: {lines: ['POST /v1/payment_intents', 'status  succeeded', 'event   payment_intent.succeeded'], checks: ['Receipt shown to the customer', 'Order NS-2041 created', 'Workspace upgraded to Pro'], resultTitle: 'Payment, order and access agree.'},
    edge: {lines: ['POST /v1/payment_intents', 'status  card_declined', 'event   payment_intent.payment_failed'], checks: ['Decline message shown', 'No order created', 'Plan stays on Free'], resultTitle: 'The decline is handled. Nothing is charged or unlocked.'}
  },
  email: {
    label: 'Email', clone: 'Email clone', icon: 'mail', logo: 'sendgrid.svg', key: 2,
    narrative: 'Check that a verification link opens the right account state.',
    options: ['Fresh link', 'Expired link'],
    good: {lines: ['to       maya@example.test', 'subject  Confirm your email', 'link     sent 2 min ago'], checks: ['Link opens the workspace', 'Account marked verified'], resultTitle: 'The link verifies the account.'},
    edge: {lines: ['to       maya@example.test', 'subject  Confirm your email', 'link     sent 26 h ago'], checks: ['Expiry message shown', 'New link offered', 'Account stays unverified'], resultTitle: 'An old link can’t sign anyone in.'}
  },
  sms: {
    label: 'SMS', clone: 'Twilio clone', icon: 'bolt', logo: 'twilio.svg', key: 2,
    narrative: 'Check that sign-in accepts only the code that was sent.',
    options: ['Right code', 'Wrong code'],
    good: {lines: ['to       +1 555 0142', 'body     code 482 190', 'entered  482 190'], checks: ['Code accepted', 'Signed in to Northstar'], resultTitle: 'The right code signs the user in.'},
    edge: {lines: ['to       +1 555 0142', 'body     code 482 190', 'entered  481 190'], checks: ['Error shown', 'Still signed out', 'Retry allowed'], resultTitle: 'A wrong code keeps the account locked.'}
  },
  signin: {
    label: 'Sign-in', clone: 'Auth clone', icon: 'lock', key: 1, neutral: true,
    narrative: 'Check that each role sees only what it should.',
    options: ['Member', 'Admin'],
    good: {lines: ['user  maya@northstar.test', 'role  member'], checks: ['Projects open', 'Billing settings locked'], resultTitle: 'Members can work, but not manage billing.'},
    edge: {lines: ['user  priya@northstar.test', 'role  admin'], checks: ['Projects open', 'Billing settings manageable'], resultTitle: 'Admins reach the workspace controls.'}
  },
  storage: {
    label: 'Storage', clone: 'S3 clone', icon: 'file', logo: 's3.svg', key: 2,
    narrative: 'Check that an upload ends as a usable file.',
    options: ['Upload completes', 'Connection drops'],
    good: {lines: ['PUT       launch-notes.pdf', 'received  4.8 MB of 4.8 MB', 'status    complete'], checks: ['File listed and openable', 'Size matches 4.8 MB'], resultTitle: 'The file is ready to use.'},
    edge: {lines: ['PUT       launch-notes.pdf', 'received  3.1 MB of 4.8 MB', 'status    connection closed'], checks: ['Retry offered', 'No broken file listed', 'Partial upload kept'], resultTitle: 'An interrupted upload can be retried.'}
  }
});

export const SERVICE_LAB_TABS = Object.keys(SERVICE_LAB_SCENARIOS);

export function scenarioState(service = 'payments', edge = false) {
  const key = SERVICE_LAB_SCENARIOS[service] ? service : 'payments';
  const scenario = SERVICE_LAB_SCENARIOS[key];
  return {service: key, label: scenario.label, clone: scenario.clone, options: scenario.options, narrative: scenario.narrative, key: scenario.key, neutral: Boolean(scenario.neutral), edge, ...scenario[edge ? 'edge' : 'good']};
}

const bar = (url) => `<div class="sl-app-bar"><span class="sl-dots"><i></i><i></i><i></i></span><span class="sl-url">${svg('lock')}${url}</span></div>`;
const note = (bad, icon, title, copy = '', action = '') => `<div class="sl-note ${bad ? 'is-bad' : 'is-good'}">${svg(icon)}<span><strong>${title}</strong>${copy ? `<small>${copy}</small>` : ''}</span>${action ? `<em>${action}</em>` : ''}</div>`;

// What the customer's browser showed under this condition.
export function appScreen({service, edge}) {
  if (service === 'email') return `${bar('mail.test / maya@example.test')}<div class="sl-app-body"><div class="sl-mail-head"><span class="sl-avatar">N</span><span><strong>Northstar accounts</strong><small>Confirm your email</small></span><small>${edge ? '26 h ago' : '2 min ago'}</small></div><p class="sl-mail-copy">Confirm your email to finish setting up your workspace.</p><span class="sl-fake-button">${svg('mail')} Verify email</span>${edge ? note(true, 'warning', 'This link has expired.', 'Links work for 24 hours.', 'Send a new link') : note(false, 'check', 'Email verified', 'Welcome to your workspace, Maya.')}</div>`;
  if (service === 'sms') return `${bar('northstar.test / sign-in')}<div class="sl-app-body"><div class="sl-sms"><span class="sl-sms-from">Messages · Northstar</span><p>Your Northstar sign-in code is <b>482 190</b>.</p></div><span class="sl-label">Enter the 6-digit code</span><div class="sl-otp">${[...(edge ? '481190' : '482190')].map((d, i) => `<span class="${edge && i === 2 ? 'is-wrong' : ''}">${d}</span>`).join('')}</div>${edge ? note(true, 'x', 'That code is incorrect.', '2 tries left.') : note(false, 'check', 'Signed in', 'Redirecting to your workspace.')}</div>`;
  if (service === 'signin') return `${bar('northstar.test / workspace')}<div class="sl-app-body"><div class="sl-person"><span class="sl-avatar">${edge ? 'P' : 'M'}</span><span><strong>${edge ? 'Priya' : 'Maya'}</strong><small>${edge ? 'Admin' : 'Member'} · Northstar</small></span></div><ul class="sl-rows"><li>${svg('layers')}<span>Projects</span><em class="is-open">${svg('check')} Open</em></li><li>${svg('users')}<span>Members</span><em class="is-open">${svg('check')} Open</em></li><li class="${edge ? '' : 'is-locked'}">${svg('card')}<span>Billing settings</span>${edge ? `<em class="is-open">${svg('check')} Manage</em>` : `<em class="is-closed">${svg('lock')} Admins only</em>`}</li></ul></div>`;
  if (service === 'storage') return `${bar('northstar.test / files')}<div class="sl-app-body"><div class="sl-file"><span class="sl-file-icon">${svg('file')}</span><span><strong>launch-notes.pdf</strong><small>${edge ? '3.1 MB of 4.8 MB' : '4.8 MB · PDF'}</small></span></div><div class="sl-progress ${edge ? 'is-stopped' : ''}"><span style="width:${edge ? 64 : 100}%"></span></div>${edge ? note(true, 'warning', 'Upload interrupted', 'Your partial upload is saved.', 'Retry upload') : note(false, 'check', 'Uploaded', 'Ready to open and share.', 'Open')}</div>`;
  return `${bar('northstar.test / checkout')}<div class="sl-app-body"><div class="sl-product"><span class="sl-avatar">N</span><span><strong>Northstar Pro</strong><small>Monthly workspace plan</small></span><b>$24</b></div><div class="sl-field">${svg('card')}<span>•••• 4242</span><small>maya@example.test</small></div>${edge ? note(true, 'x', 'Your card was declined.', 'No charge was made.', 'Try another card') : note(false, 'check', 'Payment succeeded', 'Order NS-2041 · Pro is active.')}</div>`;
}

export const cloneLines = (state) => state.lines.map((line, i) => `<code${i === state.key ? ' class="is-key"' : ''}>${line}</code>`).join('');
export const checkItems = (state) => state.checks.map(check => `<li>${svg('check')}<span>${check}</span></li>`).join('');
export const serviceIcon = (service) => svg(SERVICE_LAB_SCENARIOS[service].icon);
// The clone's own service logo (assets/brands), or its line icon when it stands in for no one company.
export const cloneMark = (service) => { const {logo} = SERVICE_LAB_SCENARIOS[service]; return logo ? `<img src="/assets/brands/${logo}" width="22" height="22" alt="">` : serviceIcon(service); };

function update(root, service, edge, announce = false, animate = announce) {
  const state = scenarioState(service, edge);
  root.dataset.edge = String(edge);
  root.dataset.tone = state.neutral ? 'neutral' : 'fault';
  root.querySelectorAll('[data-service-tab]').forEach(tab => {
    const selected = tab.dataset.serviceTab === state.service;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const set = (sel, html) => { root.querySelector(sel).innerHTML = html; };
  set('[data-service-surface]', appScreen(state));
  root.querySelector('[data-service-surface]').setAttribute('aria-labelledby', `service-lab-tab-${state.service}`);
  set('[data-service-narrative]', state.narrative);
  set('[data-clone-icon]', cloneMark(state.service));
  set('[data-clone-name]', state.clone);
  set('[data-clone-lines]', cloneLines(state));
  set('[data-service-checks]', checkItems(state));
  set('[data-service-result-title]', state.resultTitle);
  root.querySelectorAll('[data-option]').forEach((el, i) => { el.textContent = state.options[i]; });
  const condition = root.querySelector('[data-service-condition]');
  condition.setAttribute('aria-pressed', String(edge));
  condition.setAttribute('aria-label', `Condition: ${state.options[edge ? 1 : 0]}. Switch to ${state.options[edge ? 0 : 1]}`);
  if (announce) root.querySelector('[data-service-announcement]').textContent = `${state.label}, ${state.options[edge ? 1 : 0]}: ${state.resultTitle}`;
  if (animate) {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll('.sl-clone, .sl-app, .sl-verdict').forEach((el, i) => el.animate(
        [{opacity: .35, transform: 'translateY(6px)'}, {opacity: 1, transform: 'none'}],
        {duration: 420, delay: i * 140, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'}
      ));
    }
  }
}

// Plays itself for visitors who only watch: each service's normal case, then its hard case, then the next
// service. Pauses on hover, stops for good on the first click or key press, never runs with reduced motion,
// and does not announce its own steps to screen readers.
const AUTO_STEP_MS = 3800;

function init(root) {
  let service = 'payments';
  let edge = false;
  let auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false, hovered = false, timer = 0;
  const bench = root.querySelector('.sl-bench');
  const tabs = [...root.querySelectorAll('[data-service-tab]')];
  const tick = () => {
    clearTimeout(timer);
    bench.classList.toggle('is-auto', auto);
    if (!auto || !visible || hovered || document.hidden) return;
    timer = setTimeout(() => {
      if (!edge) edge = true;
      else { service = tabs[(tabs.findIndex(t => t.dataset.serviceTab === service) + 1) % tabs.length].dataset.serviceTab; edge = false; }
      update(root, service, edge, false, true);
      restartProgress();
      tick();
    }, AUTO_STEP_MS);
  };
  const restartProgress = () => { if (edge) return; bench.classList.remove('is-cycling'); void bench.offsetWidth; bench.classList.add('is-cycling'); };
  const takeOver = () => { auto = false; bench.classList.remove('is-cycling'); tick(); };
  bench.style.setProperty('--sl-cycle', `${AUTO_STEP_MS * 2}ms`);
  bench.addEventListener('pointerenter', () => { hovered = true; bench.classList.add('is-held'); tick(); });
  bench.addEventListener('pointerleave', () => { hovered = false; bench.classList.remove('is-held'); tick(); });
  bench.addEventListener('pointerdown', takeOver);
  bench.addEventListener('keydown', takeOver);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && auto && !bench.classList.contains('is-cycling')) restartProgress(); tick(); }, {threshold: .35}).observe(bench);
  document.addEventListener('visibilitychange', tick);
  const select = (next, announce = true) => { service = next; edge = false; update(root, service, edge, announce); };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.serviceTab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== index || event.key === 'Home' || event.key === 'End') { event.preventDefault(); tabs[next].focus(); select(tabs[next].dataset.serviceTab); }
    });
  });
  root.querySelector('[data-service-condition]').addEventListener('click', () => { edge = !edge; update(root, service, edge, true); });
  update(root, service, edge);
}

if (typeof document !== 'undefined') document.querySelectorAll('[data-service-lab]').forEach(init);
