const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mark = (label, value, cls = '') => `<span class="dsim-meta ${cls}"><small>${esc(label)}</small><b>${esc(value)}</b></span>`;
const button = (label, next = false, restart = false) => `<button type="button" class="dsim-button"${next ? ' data-demo-next' : ''}${restart ? ' data-demo-restart' : ''}>${esc(label)}</button>`;
const dots = (active) => `<span class="dsim-dots" aria-label="Step ${active + 1} of 3">${[0, 1, 2].map((i) => `<i class="${i <= active ? 'is-on' : ''}"></i>`).join('')}</span>`;

const qa = [
  {
    name: 'Checkout', app: 'Acme Billing', steps: ['Payment', 'Webhook', 'Receipt'],
    browser: [
      '<div class="dsim-checkout"><div class="dsim-app-title"><span>Acme Pro</span><b>$24 / month</b></div><label>Card number<input data-sample-input inputmode="numeric" value="4242 4242 4242 4242" aria-label="Sample card number"></label><div class="dsim-inline"><label>Expiry<input data-sample-input value="12 / 28" aria-label="Sample expiry"></label><label>CVC<input data-sample-input value="123" aria-label="Sample CVC"></label></div><button type="button" class="dsim-button dsim-primary" data-demo-next>Confirm test payment</button><small class="dsim-note">Simulated checkout · no charge</small></div>',
      '<div class="dsim-order"><span class="dsim-status">Payment accepted</span><h3>Order #1042</h3><p>Acme Pro · Monthly</p><div class="dsim-rule"></div><div class="dsim-row"><span>Total</span><b>$24.00</b></div><small>Waiting for the payment webhook…</small><button type="button" class="dsim-button dsim-secondary" data-demo-next>Inspect webhook</button></div>',
      '<div class="dsim-inbox"><div class="dsim-mail-head"><span>Test inbox</span><b>1 new</b></div><article><small>billing@acme.test · just now</small><h3>Your Acme Pro receipt</h3><p>Order #1042 is confirmed. Total charged: $24.00.</p></article><span class="dsim-status">Receipt observed</span><button type="button" class="dsim-button dsim-secondary" data-demo-restart>Run again</button></div>',
    ],
    checks: ['Payment form is visible', 'Payment callback reaches the app', 'Receipt appears in the test inbox'],
  },
  {
    name: 'Signup & verify', app: 'Acme Workspace', steps: ['Signup', 'Email code', 'Workspace'],
    browser: [
      '<div class="dsim-signup"><div class="dsim-app-title"><span>Create your workspace</span><small>2 minutes to get started</small></div><label>Work email<input data-sample-input type="email" value="alex@acme.test" aria-label="Sample work email" data-sample-key="email"></label><label>Workspace name<input data-sample-input value="Acme" aria-label="Sample workspace name" data-sample-key="workspace"></label><button type="button" class="dsim-button dsim-primary" data-demo-next>Send verification code</button></div>',
      `<div class="dsim-otp"><div class="dsim-app-title"><span>Check your inbox</span><small>Code sent to alex@acme.test</small></div><div class="dsim-otp-boxes" aria-label="Verification code">${['4','8','2','1','9','0'].map((n) => `<input data-sample-input value="${n}" aria-label="Code digit">`).join('')}</div><button type="button" class="dsim-button dsim-primary" data-demo-next>Verify email</button><small class="dsim-note">Using the isolated test inbox</small></div>`,
      '<div class="dsim-workspace"><div class="dsim-app-title"><span>Welcome to Acme</span><b class="dsim-status">Verified</b></div><div class="dsim-workspace-grid"><aside>Overview<br>Members<br>Settings</aside><section><h3>Acme workspace</h3><p>Your account is ready for the next step.</p><span class="dsim-status">Member session active</span></section></div><button type="button" class="dsim-button dsim-secondary" data-demo-restart>Start another signup</button></div>',
    ], checks: ['Signup form accepts the test identity', 'Verification code arrives and is accepted', 'New workspace loads for the member'],
  },
  {
    name: 'Rename a project', app: 'Acme Projects', steps: ['Settings', 'Rename', 'Project list'],
    browser: [
      '<div class="dsim-settings"><div class="dsim-app-title"><span>Project settings</span><small>Acme Projects / Website</small></div><label>Project name<input data-sample-input value="Website" aria-label="Project name" data-sample-key="project"></label><button type="button" class="dsim-button dsim-primary" data-demo-next>Save project name</button></div>',
      '<div class="dsim-settings"><div class="dsim-app-title"><span>Project settings</span><b class="dsim-status">Saved</b></div><label>Project name<input data-sample-input value="Marketing site" aria-label="Renamed project name" data-sample-key="project"></label><div class="dsim-banner">Changes are ready to review.</div><button type="button" class="dsim-button dsim-primary" data-demo-next>Open projects</button></div>',
      '<div class="dsim-projects"><div class="dsim-app-title"><span>Projects</span><button type="button" class="dsim-button dsim-secondary" data-demo-restart>Rename again</button></div><div class="dsim-project-row"><span class="dsim-avatar">M</span><div><b>Marketing site</b><small>Updated just now · 4 members</small></div><span class="dsim-status">Saved</span></div><div class="dsim-project-row"><span class="dsim-avatar">A</span><div><b>API gateway</b><small>Updated yesterday · 2 members</small></div></div></div>',
    ], checks: ['Settings form exposes the project name', 'New name is saved', 'Project list shows the renamed item'],
  },
];

const platform = [
  { name: 'Find and download an invoice', app: 'Acme Finance', steps: ['Invoice list', 'Invoice', 'Download'], browser: [
    '<div class="dsim-invoice"><div class="dsim-app-title"><span>Invoices</span><button type="button" class="dsim-button dsim-secondary" data-demo-next>Open latest</button></div><div class="dsim-table"><div><b>INV-1042</b><span>Aug 24, 2026</span><strong>$240.00</strong></div><div><b>INV-1039</b><span>Jul 24, 2026</span><strong>$240.00</strong></div></div></div>',
    '<div class="dsim-invoice"><div class="dsim-app-title"><span>INV-1042</span><b class="dsim-status">Paid</b></div><p>Acme workspace · Aug 24, 2026</p><div class="dsim-total">$240.00</div><button type="button" class="dsim-button dsim-primary" data-demo-next>Download PDF</button></div>',
    '<div class="dsim-file"><span class="dsim-file-mark">PDF</span><div><b>invoice-1042.pdf</b><small>Downloaded to run artifacts · 84 KB</small></div><button type="button" class="dsim-button dsim-secondary" data-demo-restart>Run again</button></div>',
  ] },
  { name: 'Explore an application', app: 'Acme Workspace', steps: ['Workspace', 'Flow map', 'Observed map'], browser: [
    '<div class="dsim-workspace"><div class="dsim-app-title"><span>Acme workspace</span><b>Explore</b></div><div class="dsim-workspace-grid"><aside>Home<br>Projects<br>People</aside><section><h3>What should we inspect?</h3><p>Start from the workspace and follow meaningful routes.</p><button type="button" class="dsim-button dsim-primary" data-demo-next>Map this workspace</button></section></div></div>',
    '<div class="dsim-map"><div class="dsim-map-label">Application flow</div><svg viewBox="0 0 420 90" aria-label="Branch map"><path d="M70 45h90m40 0h90m40 0h50"/><circle cx="50" cy="45" r="18"/><circle cx="180" cy="45" r="18"/><circle cx="310" cy="45" r="18"/><text x="38" y="49">Home</text><text x="164" y="49">Projects</text><text x="298" y="49">People</text></svg><button type="button" class="dsim-button dsim-primary" data-demo-next>Inspect observed paths</button></div>',
    '<div class="dsim-map"><div class="dsim-app-title"><span>Observed map</span><b class="dsim-status">3 routes</b></div><svg viewBox="0 0 420 90" aria-label="Observed application map"><path class="is-observed" d="M70 45h90m40 0h90m40 0h50"/><circle class="is-observed" cx="50" cy="45" r="18"/><circle class="is-observed" cx="180" cy="45" r="18"/><circle class="is-observed" cx="310" cy="45" r="18"/></svg><button type="button" class="dsim-button dsim-secondary" data-demo-restart>Explore again</button></div>',
  ] },
  { name: 'Extract pricing data', app: 'Acme Plans', steps: ['Pricing table', 'Selected row', 'Structured result'], browser: [
    '<div class="dsim-pricing"><div class="dsim-app-title"><span>Plans</span><small>Choose a plan to inspect</small></div><div class="dsim-price-row"><b>Starter</b><span>$12 / mo</span><button type="button" class="dsim-button dsim-secondary" data-demo-next>Inspect Pro</button></div><div class="dsim-price-row"><b>Pro</b><span>$24 / mo</span></div></div>',
    '<div class="dsim-pricing"><div class="dsim-app-title"><span>Selected plan</span><b class="dsim-status">Pro</b></div><div class="dsim-price-row is-selected"><b>Pro</b><span>$24 / mo</span></div><p>Includes unlimited projects, team access, and priority support.</p><button type="button" class="dsim-button dsim-primary" data-demo-next>Extract plan</button></div>',
    '<div class="dsim-json"><div class="dsim-app-title"><span>Structured result</span><b class="dsim-status">Schema valid</b></div><pre>{\n  "name": "Pro",\n  "price": 24,\n  "interval": "month"\n}</pre><button type="button" class="dsim-button dsim-secondary" data-demo-restart>Extract again</button></div>',
  ] },
];

function chrome(app, steps, step) {
  return `<div class="dsim-chrome"><div class="dsim-chrome-bar"><span class="dsim-window-dots"><i></i><i></i><i></i></span><code>${esc(app.toLowerCase().replace(/\s+/g, '.'))}.test</code><span class="dsim-live-dot">Simulated</span></div><div class="dsim-chrome-body"><aside class="dsim-sidebar"><b>${esc(app)}</b><span>Home</span><span>Activity</span><span>Settings</span></aside><div class="dsim-viewport"><div class="dsim-stepbar">${steps.map((name, i) => `<span class="${i === step ? 'is-active' : i < step ? 'is-done' : ''}">${i + 1} ${esc(name)}</span>`).join('')}</div></div></div></div>`;
}

export function browserSurface(mode = 'qa', example = 0, step = 0, sample = {}) {
  const set = mode === 'platform' ? platform : qa;
  const item = set[Number(example)] || set[0];
  const current = Math.max(0, Math.min(2, Number(step)));
  return `<div class="dsim-surface dsim-browser-surface" data-demo-surface="browser" data-demo-mode="${esc(mode)}" data-demo-example="${Number(example)}" data-demo-step="${current}">${chrome(item.app, item.steps, current)}<div class="dsim-view-content">${item.browser[current].replaceAll('Marketing site', esc(sample.project || 'Marketing site')).replaceAll('Website', esc(sample.project || 'Marketing site')).replaceAll('alex@acme.test', esc(sample.email || 'alex@acme.test')).replaceAll('Welcome to Acme', `Welcome to ${esc(sample.workspace || 'Acme')}`).replaceAll('Acme workspace</h3>', `${esc(sample.workspace || 'Acme')} workspace</h3>`)}</div>${dots(current)}</div>`;
}

export function checksSurface(mode = 'qa', example = 0, step = 0, failed = false) {
  const set = mode === 'platform' ? platform : qa;
  const item = set[Number(example)] || set[0];
  const current = Math.max(0, Math.min(2, Number(step)));
  const checks = item.checks || ['Task target is reachable', 'Requested path is observable', 'Structured result is ready'];
  return `<div class="dsim-surface dsim-checks-surface" data-demo-surface="checks" data-demo-step="${current}"><div class="dsim-panel-head"><span>What Molar checks</span>${mark('step', `${current + 1} / 3`)}</div><ol>${checks.map((check, i) => `<li class="${i < current || (i === current && !failed && current === 2) ? 'is-complete' : ''}${failed && i === current ? ' is-failed' : ''}"><span class="dsim-check-mark"></span><div><b>${esc(check)}</b><small>${i < current || (i === current && current === 2 && !failed) ? 'Observed' : failed && i === current ? 'Needs review' : i === current ? 'In progress' : 'Pending'}</small></div></li>`).join('')}</ol><div class="dsim-check-note">${failed ? 'The order is still pending; receipt not observed.' : current === 2 ? 'All three expected outcomes are visible in this illustrative run.' : 'Checks update as the browser reaches each step.'}</div></div>`;
}

export function resultSurface(mode = 'qa', example = 0, step = 0, failed = false) {
  const set = mode === 'platform' ? platform : qa;
  const item = set[Number(example)] || set[0];
  const current = Math.max(0, Math.min(2, Number(step)));
  const done = current === 2;
  const failure = failed && mode === 'qa' && Number(example) === 0;
  return `<div class="dsim-surface dsim-result-surface ${failure ? 'is-failed' : ''}" data-demo-surface="result" data-demo-step="${current}"><div class="dsim-panel-head"><span>Run result</span><span class="dsim-result-state">${failure ? 'Needs review' : done ? 'Observed' : 'Waiting'}</span></div><h3>${failure ? 'Payment callback not observed' : done ? `${esc(item.name)} complete` : `Following ${esc(item.steps[current])}`}</h3><p>${failure ? 'The payment was accepted, but the order remains pending and no receipt is present in the test inbox.' : done ? 'The sample task finished. Review the checks to see what happened.' : 'Follow the remaining steps to see the result.'}</p><div class="dsim-result-meta">${mark('Surface', mode === 'platform' ? 'Browser task' : 'QA journey')}${mark('Evidence', done ? 'Screenshot + trace' : 'Collecting')}${mark('State', failure ? 'Pending' : done ? 'Complete' : 'Active')}</div>${done || failure ? button('Run again', false, true) : ''}</div>`;
}
