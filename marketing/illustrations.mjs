const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const icon = (name, className = '') => {
  const paths = {
    arrow: '<path d="M3 12h17m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    pointer: '<path d="m5 3 14 10-7 1-4 7Z"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
    branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M6 13h5a7 7 0 0 0 7-4"/>',
    trace: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  };
  return `<svg class="fv-icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

const dots = '<span class="fv-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
const check = `<span class="fv-state fv-state-good">${icon('check')}</span>`;
const fail = `<span class="fv-state fv-state-bad">${icon('close')}</span>`;
const cap = title => `<figcaption><strong>${esc(title)}</strong><span class="fv-example">Example</span></figcaption>`;
const fig = (kind, title, body, compact) => `<figure class="feature-visual fv-${kind}${compact ? ' is-compact' : ''}" data-motion-scene aria-label="${esc(title)}">${cap(title)}${body}</figure>`;
const stage = (kind, body) => `<div class="fv-stage fv-${kind}-stage">${body}</div>`;
const windowBar = label => `<div class="fv-window">${dots}<span>${esc(label)}</span></div>`;
const pathSvg = (paths, className = '') => `<svg class="fv-geometry ${className}" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true"><g>${paths.map(path => `<path class="${path.flow ? 'fv-flow' : ''}" d="${path.d}"${path.pathLength ? ` pathLength="${path.pathLength}"` : ''}/>`).join('')}</g></svg>`;

function checkout() {
  return fig('checkout', 'Checkout journey', stage('checkout', `${pathSvg([
    { d: 'M250 143C302 54 345 54 398 143' },
    { d: 'M602 143C655 232 700 232 750 143' },
    { d: 'M250 143C302 54 345 54 398 143', flow: true, pathLength: 1 },
    { d: 'M602 143C655 232 700 232 750 143', flow: true, pathLength: 1 }
  ])}<div class="fv-path fv-checkout-path">
    <article class="fv-node fv-browser-node" data-motion-item style="--i:0"><header><span class="fv-node-kicker">Browser</span><span class="fv-node-mark">01</span></header><div class="fv-node-content">${windowBar('checkout.northstar.test')}<strong>Northstar Pro plan</strong><span class="fv-price">$24 <small>/ month</small></span><a class="fv-scene-link" href="/solutions/checkout-testing">Explore checkout tests ${icon('arrow')}</a></div></article>
    <article class="fv-node fv-service-node" data-motion-item style="--i:1"><header><span class="fv-node-kicker">Payment provider</span><span class="fv-node-mark">02</span></header><div class="fv-node-content"><div class="fv-event-icon">${icon('trace')}</div><strong>Payment accepted</strong><code>payment_intent.succeeded</code><span class="fv-result">${check} state changed</span></div></article>
    <article class="fv-node fv-result-node" data-motion-item style="--i:2"><header><span class="fv-node-kicker">Your application</span><span class="fv-node-mark">03</span></header><div class="fv-node-content"><div class="fv-event-icon">${check}</div><strong>Order confirmed</strong><span>Receipt sent to test inbox</span><code>order_1042</code></div></article>
  </div><div class="fv-branch-note" data-motion-item style="--i:3"><span>${icon('mail')}</span><strong>Signed callback</strong><span>Webhook received and verified</span></div></div>`));
}

function identity() {
  return fig('identity', 'Identity journey', stage('identity', `${pathSvg([
    { d: 'M250 142H395' },
    { d: 'M605 142H750' },
    { d: 'M500 58V112' },
    { d: 'M500 58V112', flow: true, pathLength: 1 },
    { d: 'M250 142H395', flow: true, pathLength: 1 },
    { d: 'M605 142H750', flow: true, pathLength: 1 }
  ])}<div class="fv-path fv-identity-path">
    <article class="fv-node fv-browser-node" data-motion-item style="--i:0"><header><span class="fv-node-kicker">Browser</span><span class="fv-node-mark">01</span></header><div class="fv-node-content">${windowBar('northstar.test / sign up')}<strong>Create account</strong><label>name@example.com</label><label>••••••••</label><a class="fv-scene-link" href="/solutions/authentication-testing">Test sign-in ${icon('arrow')}</a></div></article>
    <article class="fv-node fv-service-node fv-email-node" data-motion-item style="--i:1"><header><span class="fv-node-kicker">Test inbox</span><span class="fv-node-mark">02</span></header><div class="fv-node-content"><div class="fv-event-icon">${icon('mail')}</div><strong>Verification code</strong><span>Inbox message matched</span><div class="fv-otp" aria-label="Example verification code"><b>4</b><b>8</b><b>2</b><b>1</b><b>9</b><b>0</b></div></div></article>
    <article class="fv-node fv-result-node" data-motion-item style="--i:2"><header><span class="fv-node-kicker">Application session</span><span class="fv-node-mark">03</span></header><div class="fv-node-content"><div class="fv-event-icon">${check}</div><strong>Workspace ready</strong><span>Member identity verified</span><code>session_7f24</code></div></article>
  </div><div class="fv-identity-callout" data-motion-item style="--i:3"><span>${icon('lock')}</span><strong>Verified email</strong><span>Only a verified identity opens the workspace.</span></div></div>`));
}

function collaboration() {
  return fig('collaboration', 'Workspace collaboration', stage('collaboration', `${pathSvg([
    { d: 'M225 134C310 38 395 38 480 134' },
    { d: 'M520 134C605 230 690 230 775 134' },
    { d: 'M225 134C310 38 395 38 480 134', flow: true, pathLength: 1 },
    { d: 'M520 134C605 230 690 230 775 134', flow: true, pathLength: 1 }
  ])}<div class="fv-role-map">
    <article class="fv-role-pane" data-motion-item style="--i:0"><header><span>Owner view</span><strong>Priya · owner</strong></header><div class="fv-role-body"><span class="fv-node-kicker">Invite a teammate</span><strong>sam@example.com</strong><a class="fv-scene-link" href="/solutions/team-workflows">Test invitations ${icon('arrow')}</a><p class="fv-role-state">${check} Can manage members</p></div></article>
    <div class="fv-invite-path" data-motion-item style="--i:1"><span>${icon('mail')}</span><strong>Invitation</strong><small>Member access</small></div>
    <article class="fv-role-pane" data-motion-item style="--i:2"><header><span>Member view</span><strong>Sam · member</strong></header><div class="fv-role-body"><span class="fv-node-kicker">After accepting</span><strong>Project dashboard</strong><p class="fv-role-state">${check} Projects <small>read / write</small></p><p class="fv-role-state is-muted">${icon('lock')} Billing <small>no access</small></p></div></article>
  </div><div class="fv-observation" data-motion-item style="--i:3">${check}<strong>The right permissions</strong><span>Invitation and member access checked</span></div></div>`));
}

function preview() {
  return fig('preview', 'Preview check', stage('preview', `${pathSvg([
    { d: 'M260 140H380' },
    { d: 'M620 140H740' },
    { d: 'M260 140H380', flow: true, pathLength: 1 },
    { d: 'M620 140H740', flow: true, pathLength: 1 }
  ])}<div class="fv-release-path">
    <article class="fv-release-node" data-motion-item style="--i:0"><header><span class="fv-node-kicker">Pull request</span><span class="fv-node-mark">01</span></header><div class="fv-release-body"><div class="fv-pr-title">${icon('branch')}<strong>Update checkout confirmation</strong></div><code>pull/48 · 3 files changed</code><div class="fv-diff"><span>- status: pending</span><span>+ status: confirmed</span><span>+ receipt: attached</span></div></div></article>
    <article class="fv-release-node fv-browser-release" data-motion-item style="--i:1"><header><span class="fv-node-kicker">Preview browser</span><span class="fv-node-mark">02</span></header><div class="fv-release-body">${windowBar('preview.northstar.test')}<strong>Three journeys run</strong><p>${check}<span>Signup and verification</span><b>Passed</b></p><p>${check}<span>Invite a teammate</span><b>Passed</b></p><p class="is-fail">${fail}<span>Payment confirmation</span><b>Needs review</b></p></div></article>
    <article class="fv-release-node" data-motion-item style="--i:2"><header><span class="fv-node-kicker">Result</span><span class="fv-node-mark">03</span></header><div class="fv-result-body"><div class="fv-event-icon">${fail}</div><strong>Trace attached</strong><span>One check needs review before merge.</span><code>trace_48_checkout</code><a class="fv-scene-link" href="/products/trace">Explore Trace ${icon('arrow')}</a></div></article>
  </div>`));
}

function automation() {
  return fig('automation', 'Invoice workflow', stage('automation', `${pathSvg([
    { d: 'M250 140C305 54 360 54 415 140' },
    { d: 'M585 140C640 226 695 226 750 140' },
    { d: 'M250 140C305 54 360 54 415 140', flow: true, pathLength: 1 },
    { d: 'M585 140C640 226 695 226 750 140', flow: true, pathLength: 1 }
  ])}<div class="fv-task-path">
    <article class="fv-task-node" data-motion-item style="--i:0"><header><span class="fv-node-kicker">Browser task</span><span class="fv-node-mark">01</span></header><div class="fv-task-body">${windowBar('billing.northstar.test')}<strong>Find August invoice</strong><label>${icon('search')} Search invoices</label><p><span>August 2026</span><b>Paid</b></p></div></article>
    <article class="fv-task-node fv-task-action" data-motion-item style="--i:1"><header><span class="fv-node-kicker">Page action</span><span class="fv-node-mark">02</span></header><div class="fv-task-body"><div class="fv-event-icon">${icon('pointer')}</div><strong>Open matching record</strong><span>Invoice row selected</span><code>invoice_august_2026</code></div></article>
    <article class="fv-task-node fv-task-result" data-motion-item style="--i:2"><header><span class="fv-node-kicker">File result</span><span class="fv-node-mark">03</span></header><div class="fv-task-body"><div class="fv-document-mark">PDF</div><strong>invoice_august_2026.pdf</strong><span>${icon('download')} Downloaded for the team</span></div></article>
  </div>`));
}

function data() {
  return fig('data', 'Structured extraction', stage('data', `${pathSvg([
    { d: 'M260 140H450' },
    { d: 'M550 140H740' },
    { d: 'M260 140H450', flow: true, pathLength: 1 },
    { d: 'M550 140H740', flow: true, pathLength: 1 }
  ])}<div class="fv-data-path">
    <article class="fv-data-node" data-motion-item style="--i:0"><header><span class="fv-node-kicker">Page content</span><span class="fv-node-mark">01</span></header><div class="fv-data-body"><div class="fv-page-heading"><strong>Plans</strong><span>demo.northstar.test/plans</span></div><p><span>Starter</span><b>$9</b><small>monthly</small></p><p class="is-selected"><span>Pro</span><b>$24</b><small>monthly</small></p><p><span>Business</span><b>$79</b><small>monthly</small></p></div></article>
    <article class="fv-data-node fv-data-schema" data-motion-item style="--i:1"><header><span class="fv-node-kicker">Extraction</span><span class="fv-node-mark">02</span></header><div class="fv-data-body"><div class="fv-event-icon">${icon('search')}</div><strong>Map visible fields</strong><span>Plan · amount · currency · interval</span><code>source_url retained</code></div></article>
    <article class="fv-data-node fv-data-result" data-motion-item style="--i:2"><header><span class="fv-node-kicker">Structured result</span><span class="fv-node-mark">03</span></header><pre><b>"plan"</b>: <i>"Pro"</i>,
<b>"amount"</b>: <i>24</i>,
<b>"currency"</b>: <i>"USD"</i>,
<b>"interval"</b>: <i>"month"</i></pre><div class="fv-result-line">${check} Ready for your software</div></article>
  </div>`));
}

function swarm() {
  return fig('swarm', 'Role based coverage', stage('swarm', `<div class="fv-swarm-intro" data-motion-item style="--i:0"><strong>One workspace. Three permission paths.</strong><span>Guest · member · admin</span></div>${pathSvg([
    { d: 'M500 56V100M500 100H175V165M500 100V165M500 100H825V165' },
    { d: 'M500 56V100M500 100H175V165M500 100V165M500 100H825V165', flow: true, pathLength: 1 }
  ], 'fv-swarm-geometry')}<div class="fv-role-columns">
    <article class="fv-role-browser" data-motion-item style="--i:1"><header><strong>Guest</strong><span>Public access</span></header>${windowBar('northstar.test')}<div class="fv-role-content"><strong>Browse plans</strong><p><span>Starter</span><b>$9 / month</b></p><p><span>Pro</span><b>$24 / month</b></p></div><footer>${check}<span>Private projects hidden</span></footer></article>
    <article class="fv-role-browser" data-motion-item style="--i:2"><header><strong>Member</strong><span>Project access</span></header>${windowBar('northstar.test / workspace')}<div class="fv-role-content"><strong>Project dashboard</strong><p><span>Website launch</span><b>Can edit</b></p><p><span>API gateway</span><b>Can edit</b></p></div><footer>${check}<span>Billing restricted</span></footer></article>
    <article class="fv-role-browser" data-motion-item style="--i:3"><header><strong>Admin</strong><span>Workspace access</span></header>${windowBar('northstar.test / people')}<div class="fv-role-content"><strong>People &amp; permissions</strong><p><span>Priya Rao</span><b>Owner</b></p><p><span>Sam Chen</span><b>Member</b></p></div><footer>${check}<span>Role changes observed</span></footer></article>
  </div><div class="fv-swarm-note" data-motion-item style="--i:4">Each path checks a different boundary. Choose the roles your app needs to support.</div>`));
}

function live() {
  return fig('live', 'Trace compare', stage('live', `<div class="fv-live-grid">
    <article class="fv-live-browser" data-motion-item style="--i:0"><header><span class="fv-node-kicker">Browser state</span><span class="fv-node-mark">Before</span></header>${windowBar('checkout.northstar.test / confirmation')}<div class="fv-live-screen"><nav><strong>Northstar</strong><span>Plans</span><span>Workspace</span><span>Billing</span></nav><div class="fv-live-message"><div class="fv-event-icon">${check}</div><strong>Order confirmed</strong><span>Receipt sent to test inbox</span></div></div></article>
    <article class="fv-live-trace" data-motion-item style="--i:1"><header><span class="fv-node-kicker">Run trace</span><strong>00:08 — 00:10</strong></header><div class="fv-trace-row"><b>01</b><span><strong>Open checkout</strong><small>Screenshot captured</small></span><code>200</code></div><div class="fv-trace-row"><b>02</b><span><strong>Confirm payment</strong><small>POST /webhooks/payment</small></span><code>200</code></div><div class="fv-trace-row"><b>03</b><span><strong>Receive receipt</strong><small>Test inbox matched</small></span><code>ready</code></div><footer>${icon('trace')} Network and console evidence attached</footer></article>
    <article class="fv-live-compare" data-motion-item style="--i:2"><header><span class="fv-node-kicker">Compare</span><span class="fv-node-mark">After</span></header><div class="fv-compare-row"><span>Order state</span><strong>${check} confirmed</strong></div><div class="fv-compare-row"><span>Callback</span><strong>${check} received</strong></div><div class="fv-compare-row"><span>Receipt</span><strong>${check} matched</strong></div><a class="fv-scene-link" href="/products/trace">Explore run evidence ${icon('arrow')}</a></article>
  </div>`));
}

const render = { checkout, identity, collaboration, preview, automation, data, swarm, live };

export function featureVisual(kind, { compact = false } = {}) {
  const key = render[kind] ? kind : 'checkout';
  const output = render[key]();
  return compact ? output.replace(`class="feature-visual fv-${key}"`, `class="feature-visual fv-${key} is-compact"`) : output;
}
