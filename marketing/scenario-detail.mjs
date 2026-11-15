import { esc, icon } from './components.mjs';
import { brand } from './brands.mjs';

const tick = `<span class="sd-tick" aria-hidden="true">${icon('check')}</span>`;
const dot = '<span class="sd-dot" aria-hidden="true"></span>';
const caption = (title, note = 'Illustrative example') => `<figcaption><strong>${esc(title)}</strong><span>${esc(note)}</span></figcaption>`;
const figure = (title, body, className = '', note = 'Illustrative example') => `<figure class="scenario-detail ${className}" aria-label="${esc(title)}">${caption(title, note)}<div class="sd-board">${body}</div></figure>`;
const line = (label, value, state = '') => `<div class="sd-row"><span>${esc(label)}</span><b class="${state ? `sd-${state}` : ''}">${esc(value)}</b></div>`;
const arrow = `<span class="sd-arrow" aria-hidden="true">${icon('arrow')}</span>`;

function clones(index) {
  return figure(index ? 'Clone state reset' : 'Virtual clock and service state', `<div class="sd-columns sd-clone-columns">
    <section class="sd-card sd-clock"><span class="sd-kicker">Virtual clock</span><strong>10:14:00</strong><div class="sd-clock-track"><i></i></div><div class="sd-actions"><span>Advance one hour</span><span>Reset snapshot</span></div><small>State changes available to a test</small></section>
    <section class="sd-card"><span class="sd-kicker">Payment clone</span>${line('payment_intent', 'pi_test_042')}${line('status', index ? 'requires_action' : 'succeeded', index ? 'pending' : 'good')}${line('webhook', index ? 'queued' : 'delivered', index ? 'pending' : 'good')}</section>
    <section class="sd-card sd-state-card"><span class="sd-kicker">Snapshot</span><strong>${index ? 'Before retry' : 'After checkout'}</strong><p>${index ? 'Restore the same records, then exercise the branch again.' : 'Payment, order, and callback can be inspected together.'}</p><code>run_snapshot.json</code></section>
  </div>` , 'sd-clones');
}

function cartographer(index) {
  return figure(index ? 'Signup checks' : 'From signup to workspace', `<div class="sd-flow-head"><span class="sd-kicker">Example path</span><code>signup / verify / workspace</code><span class="sd-status">${tick} observed</span></div><div class="sd-flow-steps">
    <div class="sd-step"><i>01</i><strong>Signup</strong><span>form submitted</span></div><div class="sd-connector"></div><div class="sd-step"><i>02</i><strong>Email code</strong><span>message matched</span></div><div class="sd-connector"></div><div class="sd-step sd-step-active"><i>03</i><strong>Workspace</strong><span>assertion passed</span></div>
  </div><div class="sd-evidence"><span>${tick} Browser assertion</span><code>workspace heading is visible</code><span class="sd-muted">Screenshot · trace event · ${index ? 'step 03' : 'step 02'}</span></div>`, 'sd-cartographer');
}

function guard(index) {
  return figure(index ? 'Check the changed checkout' : 'Release check result', `<div class="sd-guard-grid"><section class="sd-card"><span class="sd-kicker">Pull request</span><strong>checkout copy update</strong><code>preview / pr-184</code><div class="sd-diff"><span>Payment complete</span><span>Payment confirmed</span></div></section><div class="sd-branch" aria-hidden="true">${arrow}</div><section class="sd-card sd-check-card"><span class="sd-kicker">Guard check</span><strong>${index ? 'Blocked' : 'Passed'}</strong><span class="sd-check-reason">${index ? 'Receipt assertion needs review' : 'Payment and order confirmed'}</span><code>${index ? 'trace_91c · review' : 'trace_91c · 3 steps'}</code></section></div><div class="sd-check-list"><span>${tick} Browser path</span><span>${index ? dot : tick} Payment callback</span><span>${index ? dot : tick} Order state</span></div>`, 'sd-guard');
}

function trace(index) {
  return figure('Four steps from a recorded check', `<div class="sd-trace-layout"><div class="sd-screenshot"><img src="/assets/browser-check/final.jpg" width="1280" height="720" alt="Final state of the controlled public browser check after the element was removed"><small>Actual screenshot · controlled public run · final state</small></div><ol class="sd-timeline"><li class="sd-timeline-good"><b>01</b><span>Add the element</span><small>clicked Add Element</small></li><li class="sd-timeline-good"><b>02</b><span>Check it appeared</span><small>Delete button present</small></li><li class="sd-timeline-good"><b>03</b><span>Remove the element</span><small>clicked Delete</small></li><li class="sd-timeline-focus"><b>04</b><span>Check it is gone</span><small>Delete button absent</small></li></ol></div><p class="sd-controlled-note">Controlled public run; this example demonstrates captured evidence and is not a customer case study or reliability benchmark.</p><a class="text-link" href="/examples/autonomous-browser-check">Watch the recorded run ${icon('arrow')}</a>`, 'sd-trace', 'Actual browser capture');
}

function mender() {
  return figure('Candidate patch review', `<div class="sd-review-banner"><span class="sd-preview">Preview</span><strong>Candidate application repair</strong><span>human review required</span></div><div class="sd-review-grid"><section><span class="sd-kicker">Failure evidence</span><strong>receipt state not updated</strong><code>trace_91c · checkout flow</code><p>Review the failed check alongside the relevant application code.</p></section><div class="sd-review-arrow">${arrow}</div><section><span class="sd-kicker">Proposed application change</span><strong>handle payment callback</strong><div class="sd-diff"><span>Order remains pending</span><span>Callback updates order status</span></div><a href="/contact" class="sd-review-button">Ask about the Mender preview ${icon('arrow')}</a></section></div>`, 'sd-mender');
}

function auth(index) {
  return figure('Role and permission matrix', `<div class="sd-auth-top"><span class="sd-kicker">Workspace access</span><code>example.acme.test</code><span class="sd-status">${tick} site-specific account</span></div><table class="sd-permissions"><thead><tr><th>Role</th><th>Projects</th><th>Billing</th><th>Members</th></tr></thead><tbody><tr><th>Owner</th><td>${tick} edit</td><td>${tick} manage</td><td>${tick} invite</td></tr><tr><th>Member</th><td>${tick} edit</td><td><span class="sd-lock">—</span> none</td><td><span class="sd-lock">—</span> view</td></tr><tr><th>Invitee</th><td><span class="sd-lock">—</span> pending</td><td><span class="sd-lock">—</span> none</td><td><span class="sd-lock">—</span> none</td></tr></tbody></table><div class="sd-auth-foot">${index ? 'Expired code: access remains blocked' : 'Verification code: member workspace opens'}</div>`, 'sd-auth');
}

function checkout(index) {
  return figure('Payment and access state', `<div class="sd-checkout-stage"><section class="sd-card"><span class="sd-kicker">Browser</span><strong>Pro plan · $24</strong><span>Test card ending 4242</span><span class="sd-mini-button">Payment step</span></section><div class="sd-branch">${arrow}</div><section class="sd-card"><span class="sd-kicker">Clone state</span><strong>${index ? '3DS required' : 'Payment accepted'}</strong><code>${index ? 'payment_intent.requires_action' : 'payment_intent.succeeded'}</code><span class="sd-check-reason">Callback ${index ? 'waiting' : 'received'}</span></section><div class="sd-order-state"><span class="sd-kicker">Application</span><strong>${index ? 'Order pending' : 'Order confirmed'}</strong><span>${index ? 'Awaiting provider callback' : 'Receipt visible in test inbox'}</span></div></div>`, 'sd-checkout');
}

function data() {
  return figure('Structured field mapping', `<div class="sd-data-layout"><section class="sd-card sd-page-card"><span class="sd-kicker">Visible page</span><strong>Plans</strong><div class="sd-data-row"><span>Starter</span><b>$9</b></div><div class="sd-data-row sd-data-selected"><span>Pro</span><b>$24</b></div><div class="sd-data-row"><span>Business</span><b>$79</b></div></section><div class="sd-map-arrow">${arrow}</div><section class="sd-card sd-json-card"><span class="sd-kicker">Requested fields</span><code>name → Pro</code><code>price → 24</code><code>currency → USD</code><span class="sd-status">${tick} source row retained</span></section></div>`, 'sd-data');
}

function workflow() {
  return figure('Download an invoice', `<div class="sd-workflow-grid"><section class="sd-card"><span class="sd-kicker">Task</span><strong>Download latest invoice</strong><div class="sd-task-line">${tick}<span>Open billing portal · done</span></div><div class="sd-task-line">${tick}<span>Find invoice row · done</span></div><div class="sd-task-line"><span class="sd-dot"></span><span>Save PDF · next</span></div></section><div class="sd-map-arrow">${arrow}</div><section class="sd-card sd-file-card"><span class="sd-file-mark">PDF</span><strong>invoice-download</strong><span>Requested file</span><code>status · pending</code></section></div>`, 'sd-workflow');
}

function swarm() {
  const roles=[['Guest',['Create an account','Buy a plan']],['Member',['Accept an invitation','Open a project']],['Owner',['Invite a member','Review billing']]];
  return figure('Plan a check for each role', `<div class="sd-swarm-grid">${roles.map(([role,tasks])=>`<section class="sd-card"><div class="sd-persona"><span>${icon('users')}</span><strong>${role}</strong></div>${tasks.map(task=>`<span>${dot} ${task}</span>`).join('')}<p>Separate browser and identity</p></section>`).join('')}</div><div class="sd-preview-note"><span class="sd-preview">Preview</span> Planned checks only. No run results are shown here.</div>`, 'sd-swarm');
}

function developer() {
  return figure('Run, read the result, fix, run again', `<div class="sd-code-flow"><section class="sd-card"><span class="sd-kicker">Terminal</span><code>$ molar verify "login works"</code><code>  --url http://localhost:3000</code><code>  --json</code></section><div class="sd-map-arrow">${arrow}</div><section class="sd-card"><span class="sd-kicker">Run output</span><span class="sd-check-reason">What --json returns</span><code>ok · pass · rationale</code><code>live_view_url · artifact_manifest_url</code><span class="sd-status">${tick} inspect and rerun</span></section></div>`, 'sd-developer');
}

function catalog() {
  return figure('Five services. One controlled environment.', `<div class="sd-catalog">${[['card','Payments','Payments, subscriptions and callbacks'],['mail','SMS & voice','Messages and verification codes'],['mail','Email','Inboxes and delivery'],['lock','Auth','Identities and sessions'],['file','Storage','Buckets and objects']].map(([i,n,d])=>`<div>${icon(i)}<strong>${n}</strong><span>${d}</span></div>`).join('')}</div><p class="sd-controlled-note">Each Clone implements specific service behavior. Confirm the API paths your app uses.</p>`, 'sd-catalog-scene', 'Core Clone catalog');
}
function outcomes() {
  return figure('Know what the result means', `<dl class="sd-outcomes"><div><dt>${icon('check')} Completed</dt><dd>The requested result was observed.</dd></div><div><dt>${icon('x')} Failed</dt><dd>The expected page state was not reached.</dd></div><div><dt>${icon('lock')} Cancelled</dt><dd>The run was stopped before it finished.</dd></div></dl><p class="sd-controlled-note">While it works, a run’s status is “running”. Review the recorded steps and screenshots to see where it stopped.</p>`, 'sd-outcome-scene', 'Run status');
}
function repairFlow() {
  return figure('Review the repair before applying it', `<ol class="sd-review-path">${[['trace','Start with the failure','Keep the failed check and captured browser steps.'],['code','Propose an application change','Attach the candidate patch for review.'],['users','Review the proposal','Confirm the change and its scope.'],['replay','Check the repair','Rerun the original check; keep the result.']].map(([i,n,d])=>`<li>${icon(i)}<div><strong>${n}</strong><p>${d}</p></div></li>`).join('')}</ol>`, 'sd-repair-path', 'Mender preview workflow');
}
function paymentBranches() {
  return figure('The branches behind the Pay button', `<div class="sd-branch-table">${[['Card declined','No paid order; show a useful retry.'],['Authentication required','Keep the order pending until authentication finishes.'],['Callback delayed','Do not grant access before confirmation.'],['Callback delivered twice','One payment should create one order.']].map(([n,d])=>`<div>${icon('branch')}<strong>${n}</strong><p>${d}</p></div>`).join('')}</div>`, 'sd-payment-branches', 'Example checks to include');
}
// Security visuals describe the enforced rules: navigation and saved logins stay on project hosts.
const hostRows = (rows) => `<div class="sd-hosts">${rows.map(([host, kind, result, ok]) => `<div class="${ok ? 'is-allowed' : 'is-blocked'}"><code>${esc(host)}</code><span>${esc(kind)}</span><strong>${icon(ok ? 'check' : 'x')}${esc(result)}</strong></div>`).join('')}</div>`;
function egress() {
  return figure('What a hosted run can reach', hostRows([
    ['app.yourcompany.com', 'Project base URL', 'Can open pages', true],
    ['staging.yourcompany.com', 'Allowed host you added', 'Can open pages', true],
    ['cdn.example.net', 'Image or script on a page', 'Loads, can’t be opened', false],
    ['10.0.0.12', 'Private network', 'Blocked', false],
    ['169.254.169.254', 'Cloud metadata', 'Blocked', false]
  ]), 'sd-hosts-scene', 'Example');
}
function savedLogins() {
  return figure('Where a saved login is typed', hostRows([
    ['app.yourcompany.com/login', 'Project base URL', 'Typed', true],
    ['sso.yourcompany.com', 'Allowed host you added', 'Typed', true],
    ['login.othersite.com', 'Not in the project', 'Never typed', false]
  ]), 'sd-hosts-scene', 'Example');
}
function scope() {
  return figure('Define the access for a run', `<div class="sd-scope">${[['globe','Target','The app and environment to use.'],['lock','Identity','The account and permissions for this task.'],['cursor','Task','The actions and result you authorize.']].map(([i,n,d])=>`<div>${icon(i)}<strong>${n}</strong><p>${d}</p></div>`).join('')}</div>`, 'sd-scope-scene', 'Your setup');
}
function dataSource() {
  return figure('Keep an extracted value tied to its source', `<div class="sd-source-record"><span>Requested field</span><strong>Plan price</strong><div class="sd-source-value"><b>24</b><span>USD / month</span></div><dl><div><dt>Source</dt><dd>Pro plan row on the pricing page</dd></div><div><dt>If it is missing</dt><dd>Report a missing value; do not invent a price.</dd></div></dl></div>`, 'sd-source-scene');
}
function invitation() {
  return figure('An invitation across two browsers', `<div class="sd-invitation"><img src="/assets/invitation/admin-final.png" width="1440" height="900" loading="lazy" alt="Admin browser confirming an invitation was created"><ol><li>Admin created the invitation.</li><li>The Email Clone delivered its link.</li><li>A separate member browser accepted.</li></ol></div><a class="text-link" href="/examples/team-invitation">Watch both recordings ${icon('arrow')}</a>`, 'sd-invitation-scene', 'Scripted test recording, not an AI agent run');
}


// The four capability pages (launch a browser, saved tests, coverage, scheduled checks).
function launchBrowser(index) {
  if (index === 'hero') return figure('Your code, driving a cloud browser', `<div class="sd-live-browser"><div class="sd-live-bar"><span class="sd-live-badge"><i></i>Live</span><code>pricing.example.com</code><span>1440×900</span></div><div class="sd-live-page"><strong>Pricing</strong><div class="sd-live-plans"><span>Starter</span><span class="is-picked">Pro</span><span>Team</span></div></div></div><div class="sd-tools"><span>Connect with</span><span>${brand('playwright')} Playwright</span><span>${brand('puppeteer')} Puppeteer</span><span class="sd-tools-gap">or from</span><span>${brand('claude')} Claude Code</span><span>${brand('cursor')} Cursor</span></div>`, 'sd-launch', 'Live view');
  if (index) return figure('Watch it, keep the recording', `<div class="sd-columns"><section class="sd-card"><span class="sd-kicker">Browser</span><strong>Running · 1440×900</strong>${line('Live view', 'Open in dashboard', 'good')}${line('Recording', 'On')}${line('Stops', 'after 10 idle minutes')}</section><section class="sd-card"><span class="sd-kicker">After it stops</span><strong>Session video</strong>${line('Length', '4 min 12 s')}${line('Video', 'Download', 'good')}<small>Recording works for sessions up to 30 minutes.</small></section></div>`, 'sd-launch');
  return figure('Start a browser, connect your code', `<div class="sd-code-flow"><section class="sd-card"><span class="sd-kicker">New browser</span><strong>Ready</strong>${line('Starts on', 'example.com')}${line('Time limit', '15 minutes')}${line('Address', 'wss://…/cdp', 'good')}</section><div class="sd-map-arrow">${arrow}</div><section class="sd-card"><span class="sd-kicker">Your code</span><code>const browser = await chromium</code><code>  .connectOverCDP(address);</code><code>await page.goto('/pricing');</code><span class="sd-status">${tick} connected</span></section></div>`, 'sd-launch');
}
function savedTests(index) {
  if (index === 'hero') return figure('Tests in your repository', `<section class="sd-card"><span class="sd-kicker sd-repo">${brand('github')} your-team / shop-tests</span>${line('checkout', '2 files', 'good')}${line('signup and welcome email', '2 files', 'good')}${line('invite a teammate', '2 files', 'good')}${line('cancel the plan', '2 files', 'good')}<span class="sd-status">${tick} Last push: 9 of 9 passed</span></section>`, 'sd-saved');
  if (index) return figure('Every push runs the saved tests', `<section class="sd-card"><span class="sd-kicker sd-repo">${brand('github')} Push to main · “Update pricing copy”</span><strong>9 of 9 tests passed</strong>${line('checkout', 'passed · 18 s', 'good')}${line('signup and welcome email', 'passed · 24 s', 'good')}${line('invite a teammate', 'passed · 31 s', 'good')}${line('cancel the plan', 'passed · 12 s', 'good')}</section>`, 'sd-saved');
  return figure('One test, two files', `<div class="sd-columns"><section class="sd-card"><span class="sd-kicker">The instruction</span><strong>checkout</strong><p>Sign in, choose the Pro plan, pay with the test card, then check that Pro is active.</p></section><section class="sd-card"><span class="sd-kicker">The Playwright test</span><code>test('checkout', async ({ page }) => {</code><code>  await page.getByRole('button',</code><code>    { name: 'Choose Pro' }).click();</code><code>  …</code><span class="sd-status">${tick} replayed before saving</span></section></div>`, 'sd-saved');
}
function covGrid() {
  // 26 weeks × 7 days, like the dashboard: mostly passed, a few mixed and failed days, quiet weekends.
  const tone = i => i > 176 ? 'none' : i % 7 > 4 && i % 3 ? 'none' : [23, 61, 118, 150].includes(i) ? 'mixed' : [88, 140].includes(i) ? 'fail' : 'pass';
  return `<div class="sd-cov-grid" aria-hidden="true">${Array.from({length: 182}, (_, i) => `<i class="sd-cov-${tone(i)}"></i>`).join('')}</div>`;
}
function coverage(index) {
  if (index === 'hero') return figure('9 tests cover 7 pages on 3 sites', `<div class="sd-columns"><section class="sd-card"><span class="sd-kicker">shop.example</span><strong>4 of 5 pages</strong>${line('/settings/billing', 'No test', 'pending')}</section><section class="sd-card"><span class="sd-kicker">docs.example</span><strong>2 of 2 pages</strong>${line('Last run', 'Passed', 'good')}</section></div>${covGrid()}`, 'sd-coverage');
  if (index) return figure('Runs by day', `${covGrid()}<div class="sd-cov-key"><span><i class="sd-cov-pass"></i> Passed</span><span><i class="sd-cov-mixed"></i> Some failed</span><span><i class="sd-cov-fail"></i> Mostly failed</span></div>`, 'sd-coverage');
  return figure('Pages your tests reach', `<section class="sd-card"><span class="sd-kicker">shop.example</span>${line('/cart', '3 tests', 'good')}${line('/checkout', '2 tests', 'good')}${line('/account', '1 test', 'good')}${line('/settings/billing', 'No test · add one', 'pending')}</section>`, 'sd-coverage');
}
function scheduled(index) {
  if (index === 'hero') return figure('Checks on the live site', `<section class="sd-card"><span class="sd-kicker">Scheduled checks · shop.example</span>${line('Checkout still works', 'Every 15 min · passed', 'good')}${line('Sign up and get the email', 'Every 30 min · passed', 'good')}${line('Invite a teammate', 'Every hour · failed 14:02', 'pending')}${line('Cancel the plan', 'Every hour · passed', 'good')}</section>`, 'sd-scheduled');
  if (index) return figure('When a check fails', `<section class="sd-card"><span class="sd-kicker">Incident · 14:02</span><strong>Checkout failed at step 4</strong><p>The payment page did not finish loading.</p>${line('Step 4', 'Pay with the test card', 'pending')}${line('Screenshot', 'Attached')}${line('Network', 'POST /api/pay · 504', 'pending')}${line('Fix', 'Suggested', 'good')}</section>`, 'sd-scheduled');
  return figure('A check on the live site', `<section class="sd-card"><span class="sd-kicker">Scheduled check</span><strong>Checkout still works</strong>${line('Site', 'shop.example')}${line('Runs', 'Every 15 minutes')}${line('Last run', 'Passed · 4 min ago', 'good')}${line('When it breaks', 'Suggest a fix')}</section>`, 'sd-scheduled');
}

/** Each supporting section explains a different part of its page's workflow. */
export function detailVisual(page, index = 0) {
  const path = page?.path || '';
  if (path.includes('launch-browser')) return launchBrowser(index);
  if (path.includes('saved-tests')) return savedTests(index);
  if (path.includes('/coverage')) return coverage(index);
  if (path.includes('scheduled-checks')) return scheduled(index);
  if (path.includes('clones') || path.includes('integration-testing')) return index ? catalog() : clones(0);
  if (path.includes('cartographer')) return index ? developer() : cartographer(0);
  if (path.includes('mender')) return index ? repairFlow() : mender();
  if (path.includes('checkout')) return index ? paymentBranches() : checkout(0);
  if (path.includes('authentication')) return index ? auth(1) : cartographer(0);
  if (path === '/security') return index ? savedLogins() : egress();
  if (path.includes('web-data-extraction')) return index ? dataSource() : data();
  if (path.includes('workflow-automation')) return index ? outcomes() : workflow();
  if (path.includes('browser-agents')) return index ? developer() : workflow();
  if (path.includes('swarm')) return index ? auth(0) : swarm();
  if (path.includes('developer-tools')) return index ? outcomes() : developer();
  if (path.includes('guard')) return index ? outcomes() : guard(0);
  if (path.includes('preview-deployments')) return index ? paymentBranches() : guard(0);
  if (path.includes('startups')) return index ? scope() : checkout(0);
  if (path.includes('trace') || path.includes('live-view')) return index ? outcomes() : trace(0);
  if (path.includes('team-workflows')) return index ? auth(0) : invitation();
  if (path.includes('web-app-testing')) return index ? developer() : cartographer(0);
  return index ? catalog() : developer();
}
