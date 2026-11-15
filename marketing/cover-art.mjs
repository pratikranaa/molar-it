// Cover art for guides: a cropped slice of a believable product screen per topic (event log, check list,
// diff, run history...), drawn at 480x270 with the same tokens as the product pages. Data is illustrative:
// Northstar fixture names only, no metrics. Used by the blog index, the guide shelf and the Resources menu.
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const t = (x, y, value, cls = 'ca-t', anchor) => `<text x="${x}" y="${y}" class="${cls}"${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(value)}</text>`;
const r = (x, y, w, h, cls, rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
const ln = (x1, y1, x2, y2, cls = 'ca-rule') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
const dot = (x, y, state) => `<circle cx="${x}" cy="${y}" r="8" class="ca-dot ca-${state}"/>${state === 'ok' ? `<path d="M${x - 3.5} ${y}l2.5 2.5 4.5-5" class="ca-tick ca-tick-ok"/>` : state === 'bad' ? `<path d="M${x - 3} ${y - 3}l6 6M${x + 3} ${y - 3}l-6 6" class="ca-tick ca-tick-bad"/>` : `<circle cx="${x}" cy="${y}" r="2.2" class="ca-pending-dot"/>`}`;
const chip = (x, y, w, label, state = 'quiet') => `${r(x, y, w, 22, `ca-chip ca-chip-${state}`, 11)}${t(x + w / 2, y + 15, label, `ca-m ca-chip-text-${state}`, 'middle')}`;
const panel = (x, y, w, h, title, dark = false) => `${r(x, y, w, h, dark ? 'ca-panel ca-panel-dark' : 'ca-panel', 10)}${r(x, y, w, 30, dark ? 'ca-head ca-head-dark' : 'ca-head', 10)}${r(x, y + 20, w, 10, dark ? 'ca-head ca-head-dark' : 'ca-head', 0)}${ln(x, y + 30, x + w, y + 30, dark ? 'ca-rule ca-rule-dark' : 'ca-rule')}${t(x + 14, y + 19.5, title, dark ? 'ca-m ca-m-dark' : 'ca-m')}`;
const arrow = (x1, y, x2, active = true) => `<path d="M${x1} ${y}H${x2}" class="${active ? 'ca-flow' : 'ca-route'}"/><path d="M${x2 - 6} ${y - 5}l6 5-6 5" class="${active ? 'ca-flow ca-arrowhead' : 'ca-route ca-arrowhead'}"/>`;

const kinds = {
  payments: v => `${panel(36, 34, 408, 202, v.title || 'payment events')}
${[['charge.succeeded', '200', 'ok'], ['payment_intent.succeeded', '200', 'ok'], [v.row || 'order.confirmed', v.state || 'waiting', 'pending']].map(([name, state, s], i) => `${dot(60, 82 + i * 38, s)}${t(78, 86 + i * 38, name, 'ca-t ca-mono')}${t(424, 86 + i * 38, state, 'ca-m', 'end')}${i < 2 ? ln(52, 100 + i * 38, 428, 100 + i * 38) : ''}`).join('')}
${r(52, 186, 376, 36, 'ca-note', 8)}${t(66, 208, v.note || 'Browser shows success. Access waits for the callback.', 'ca-t ca-small')}`,

  otp: v => `${r(36, 40, 120, 190, 'ca-panel', 18)}${r(52, 58, 88, 22, 'ca-head', 11)}${r(52, 94, 88, 62, 'ca-bubble', 10)}${t(62, 116, v.msg || 'Your code is', 'ca-m')}${t(62, 138, '482190', 'ca-t ca-code')}${r(52, 170, 88, 40, 'ca-chip ca-chip-quiet', 8)}${t(96, 195, 'Resend', 'ca-m', 'middle')}
${panel(176, 40, 268, 190, v.title || 'verification attempts')}
${[['Fresh code', 'accepted', 'ok'], ['Expired code', 'rejected', 'bad'], ['Resend', 'new code only', 'ok']].map(([n, s, st], i) => `${dot(200, 92 + i * 44, st)}${t(218, 96 + i * 44, n, 'ca-t')}${t(428, 96 + i * 44, s, 'ca-m', 'end')}${i < 2 ? ln(192, 112 + i * 44, 428, 112 + i * 44) : ''}`).join('')}`,

  gate: v => `${panel(36, 34, 408, 202, v.title || 'required checks')}
${[[v.a || 'signup', 'passed', 'ok'], [v.b || 'checkout', 'failed', 'bad'], [v.c || 'invite-member', 'passed', 'ok']].map(([n, s, st], i) => `${dot(60, 82 + i * 36, st)}${t(78, 86 + i * 36, n, 'ca-t ca-mono')}${t(424, 86 + i * 36, s, st === 'bad' ? 'ca-m ca-bad-text' : 'ca-m', 'end')}${ln(52, 98 + i * 36, 428, 98 + i * 36)}`).join('')}
${r(52, 192, 150, 30, 'ca-btn-off', 6)}${t(127, 212, v.button || 'Merge blocked', 'ca-t ca-small ca-off-text', 'middle')}${t(424, 212, v.foot || 'one required check failed', 'ca-m', 'end')}`,

  agent: v => `${panel(36, 34, 408, 202, v.file || 'tests/checkout.spec.ts', true)}
${(v.del ?? "- page.locator('#buy')") ? t(54, 84, v.del ?? "- page.locator('#buy')", 'ca-mono ca-diff-del') : ''}${t(54, 108, v.add ?? "+ page.getByRole('button', { name: 'Buy' })", 'ca-mono ca-diff-add')}${t(54, 136, v.ctx ?? '  .click();', 'ca-mono ca-diff-ctx')}
${ln(52, 154, 428, 154, 'ca-rule ca-rule-dark')}${chip(52, 178, 84, 'Approve', 'ok')}${chip(146, 178, 56, 'Edit', 'dark')}${chip(212, 178, 68, 'Reject', 'dark')}${t(428, 193, v.foot || 'a person decides', 'ca-m ca-m-dark', 'end')}`,

  flaky: v => `${panel(36, 34, 408, 202, v.title || 'run history')}
${Array.from({ length: 2 }, (_, row) => Array.from({ length: 12 }, (_, col) => { const idx = row * 12 + col; const bad = (v.bad || [7, 15]).includes(idx); return `<rect x="${54 + col * 31}" y="${64 + row * 30}" width="22" height="22" rx="5" class="${bad ? 'ca-cell-bad' : 'ca-cell-ok'}"/>`; }).join('')).join('')}
${r(52, 134, 376, 86, 'ca-note', 8)}${dot(70, 158, 'bad')}${t(88, 162, v.step || 'Expected state missing', 'ca-t')}${t(70, 188, v.line1 || 'assertion  account access present', 'ca-m')}${t(70, 206, v.line2 || 'request    POST /webhooks/payment  200', 'ca-m')}`,

  data: v => `${r(36, 78, 128, 114, 'ca-panel', 10)}${t(52, 106, 'baseline', 'ca-t')}${t(52, 126, v.base || 'snapshot_01', 'ca-m')}${chip(52, 150, 96, 'known state', 'ok')}
${arrow(164, 106, 244)}${arrow(164, 164, 244)}
${panel(250, 34, 194, 86, v.a || 'worker A')}${t(266, 92, 'uses its own records', 'ca-m')}${t(266, 108, v.ida || 'run_a41', 'ca-t ca-mono ca-small')}
${panel(250, 150, 194, 86, v.b || 'worker B')}${t(266, 208, 'uses its own records', 'ca-m')}${t(266, 224, v.idb || 'run_b17', 'ca-t ca-mono ca-small')}`,

  download: v => `${panel(36, 34, 408, 202, v.title || 'browser run')}
${r(56, 74, 44, 56, 'ca-file', 6)}${t(78, 108, 'PDF', 'ca-m ca-coral-text', 'middle')}${t(116, 96, 'invoice_august_2026.pdf', 'ca-t ca-mono')}${t(116, 118, 'download event received', 'ca-m')}${r(116, 130, 296, 6, 'ca-bar-bg', 3)}${r(116, 130, 296, 6, 'ca-bar', 3)}
${ln(52, 154, 428, 154)}${dot(64, 182, 'ok')}${t(82, 186, 'filename matches', 'ca-t ca-small')}${dot(64, 210, 'ok')}${t(82, 214, 'type is application/pdf', 'ca-t ca-small')}`,

  decision: v => `${panel(36, 34, 194, 202, v.a || 'Option A')}${panel(250, 34, 194, 202, v.b || 'Option B')}
${[0, 1].map(i => ['open the app', 'sign in', 'assert result'].map((s, k) => `${r(52 + i * 214, 78 + k * 36, 162, 28, 'ca-step', 6)}${t(66 + i * 214, 96 + k * 36, s, 'ca-t ca-small')}`).join('')).join('')}
${chip(52, 198, 112, 'same task', 'quiet')}${chip(266, 198, 112, 'same task', 'quiet')}`,

  visual: v => `${panel(36, 34, 196, 202, 'baseline')}${panel(248, 34, 196, 202, 'actual')}
${[0, 1].map(i => `${r(52 + i * 212, 76, 164, 112, 'ca-shot', 6)}${r(60 + i * 212, 86, 96, 10, 'ca-shot-line', 3)}${r(60 + i * 212, 106, 148, 26, 'ca-shot-block', 4)}${r(60 + i * 212, 142, 70, 24, 'ca-shot-btn', 4)}`).join('')}
${r(244, 138, 94, 36, 'ca-diff', 4)}${chip(52, 198, 74, 'approved', 'ok')}${chip(264, 198, 96, 'diff to review', 'bad')}`,

  cli: v => `${panel(36, 34, 408, 202, 'terminal', true)}
${t(54, 80, '$ molar verify "login works" \\', 'ca-mono ca-term')}${t(54, 100, '    --url localhost:3000 --json', 'ca-mono ca-term')}${ln(52, 116, 428, 116, 'ca-rule ca-rule-dark')}
${t(54, 142, '{ "pass": true,', 'ca-mono ca-term-dim')}${t(54, 162, '  "evidence": { … },', 'ca-mono ca-term-dim')}${t(54, 182, '  "live_view_url": "…" }', 'ca-mono ca-term-dim')}${chip(52, 202, 70, 'pass', 'ok')}`,

  api: v => `${panel(36, 54, 168, 162, v.a || 'your app')}${t(52, 106, 'POST', 'ca-m')}${t(52, 124, '/v1/payment_intents', 'ca-m')}${t(52, 150, 'base URL', 'ca-m')}${t(52, 168, v.url || 'clone.local', 'ca-t ca-mono ca-small')}
${arrow(204, 124, 276)}${chip(214, 92, 52, 'test', 'quiet')}
${panel(276, 54, 168, 162, v.b || 'service clone')}${t(292, 106, '201 Created', 'ca-t ca-small')}${t(292, 126, 'requires_payment_', 'ca-m')}${t(292, 140, 'method', 'ca-m')}${chip(292, 160, 90, 'state kept', 'ok')}${chip(292, 188, 112, 'webhook queued', 'quiet')}`,

  pipeline: v => `${panel(36, 34, 408, 202, v.title || 'release')}
${(v.stages || ['change', 'checks', 'review', 'ship']).map((s, i, a) => { const x = 52 + i * 96; const st = i === 1 ? (v.fail ? 'bad' : 'ok') : i === 3 ? 'pending' : 'ok'; return `${r(x, 74, 80, 56, 'ca-step', 8)}${dot(x + 18, 96, st)}${t(x + 12, 120, s, 'ca-t ca-small')}${i < a.length - 1 ? `<path d="M${x + 80} 102h16" class="ca-route"/>` : ''}`; }).join('')}
${ln(52, 150, 428, 150)}${t(54, 178, v.l1 || 'scope: files changed in this pull request', 'ca-m')}${t(54, 198, v.l2 || 'run: signup, checkout, invite', 'ca-m')}${t(54, 218, v.l3 || 'result: one check to look at', 'ca-m')}`
};

// Slug -> cover. A few repeated kinds carry their own strings so neighbouring covers do not look identical.
const bySlug = {
  'ai-agents-future-software-testing': ['cli', {}],
  'ai-playwright-test-generation': ['agent', { file: 'tests/signup.spec.ts', del: '', add: "+ await expect(page).toHaveURL('/workspace');", ctx: '  // generated from a plain-English task', foot: 'review before CI' }],
  'api-mocking-vs-service-clones': ['api', {}],
  'continuous-testing-ci-cd-pipeline': ['pipeline', { title: 'pipeline', stages: ['commit', 'checks', 'deploy', 'monitor'], l1: 'on every commit: signup and checkout', l2: 'after deploy: scheduled check on the live site', l3: 'result: step and screenshot attached' }],
  'e2e-testing-best-practices': ['data', { a: 'test 1', b: 'test 2', base: 'seed_state', ida: 'user_a41', idb: 'user_b17' }],
  'email-workflow-testing-otp': ['otp', { msg: 'Confirm email', title: 'email cases' }],
  'flaky-tests-causes-and-fixes': ['flaky', {}],
  'github-actions-playwright-ci': ['gate', { title: 'workflow run · guard.yml', a: 'install', b: 'playwright test', c: 'upload trace', button: 'Check failed', foot: 'trace attached' }],
  'playwright-vs-cypress-comparison': ['decision', { a: 'Playwright', b: 'Cypress' }],
  'regression-testing-strategies': ['pipeline', { title: 'affected paths', stages: ['change', 'select', 'run', 'report'], l1: 'changed: src/billing/access.ts', l2: 'selected: checkout', l3: 'skipped: sign-in, invitations' }],
  'required-status-checks-merge-gate': ['gate', {}],
  'self-healing-test-automation': ['agent', { file: 'tests/checkout.spec.ts', del: "- page.locator('#buy-btn')", add: "+ page.getByRole('button', { name: 'Buy' })", ctx: '  // assertion unchanged', foot: 'a person decides' }],
  'shift-left-testing-explained': ['pipeline', { title: 'plan first', stages: ['plan', 'build', 'test', 'ship'], fail: false, l1: 'plan: the flow this change touches', l2: 'build: with its checks next to the code', l3: 'ship: after the check has run' }],
  'staging-environment-alternatives': ['data', { a: 'preview 1', b: 'preview 2', base: 'staging_seed', ida: 'env_pr_52', idb: 'env_pr_53' }],
  'startup-qa-without-qa-team': ['decision', { a: 'Today', b: 'With checks' }],
  'synthetic-monitoring-production': ['flaky', { title: 'scheduled checks', bad: [19], step: 'Checkout regressed', line1: 'target     northstar.test', line2: 'trace      attached to the alert' }],
  'test-data-management-best-practices': ['data', {}],
  'test-stripe-without-real-cards': ['payments', { title: 'test payment events' }],
  'test-twilio-sms-otp-flows': ['otp', { msg: 'Your code is', title: 'sms cases' }],
  'testing-delayed-payment-webhooks-and-account-access': ['payments', { title: 'delayed webhook', row: 'access.granted', state: 'delayed', note: 'The page says paid. The account is still Free.' }],
  'testing-third-party-apis-safely': ['api', { a: 'your app', b: 'vendor clone', url: 'clone.local:4010' }],
  'verify-downloaded-invoice-browser-test': ['download', {}],
  'visual-regression-testing-guide': ['visual', {}]
};
const byGuideKind = { clones: ['payments', {}], guard: ['gate', {}], platform: ['cli', {}], trace: ['flaky', {}] };

export const coverTint = slug => ({ payments: 'sage', otp: 'mist', gate: 'cream', agent: 'sand', flaky: 'mist', data: 'sage', download: 'cream', decision: 'sand', visual: 'mist', cli: 'sage', api: 'cream', pipeline: 'sand' })[(bySlug[slug] || ['pipeline'])[0]];

// coverArt('test-stripe-without-real-cards') or coverArt(null, 'clones') for guide shelves keyed by product.
export function coverArt(slug, guideKind) {
  const [kind, vars] = bySlug[slug] || byGuideKind[guideKind] || ['pipeline', {}];
  return `<svg class="cover-art" viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${kinds[kind](vars)}</svg>`;
}
