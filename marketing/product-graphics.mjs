const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const attrs = values => Object.entries(values)
  .filter(([, value]) => value !== undefined && value !== null)
  .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
  .join(' ');

const el = (tag, values, content = '') => `<${tag} ${attrs(values)}>${content}</${tag}>`;
const rect = (x, y, width, height, className, extra = {}) => el('rect', { x, y, width, height, class: className, ...extra });
const line = (x1, y1, x2, y2, className = 'pg-line', extra = {}) => el('line', { x1, y1, x2, y2, class: className, ...extra });
const circle = (cx, cy, r, className, extra = {}) => el('circle', { cx, cy, r, class: className, ...extra });
const path = (d, className = 'pg-line', extra = {}) => el('path', { d, class: className, ...extra });
const text = (x, y, value, className = 'pg-label', extra = {}) => el('text', { x, y, class: className, ...extra }, escapeHtml(value));
const group = (className, content, extra = {}) => el('g', { class: className, ...extra }, content);

const browserFrame = (x, y, width, height, label, content, className = 'pg-panel') => `${rect(x, y, width, height, `${className} pg-node`, { rx: 9 })}${line(x, y + 25, x + width, y + 25, 'pg-line')}${circle(x + 15, y + 13, 3, 'pg-dot')}${circle(x + 26, y + 13, 3, 'pg-dot')}${circle(x + 37, y + 13, 3, 'pg-dot')}${text(x + 50, y + 17, label, 'pg-mono pg-muted')}${content}`;
const panelHeader = (x, y, width, label, kind = 'pg-mono pg-muted') => `${text(x + 14, y + 19, label, kind)}${line(x + 12, y + 29, x + width - 12, y + 29, 'pg-line')}`;
const statusMark = (cx, cy, state = 'good') => `${circle(cx, cy, 8, `pg-mark pg-mark-${state}`)}${state === 'good' ? path(`M${cx - 3} ${cy}l2 2 4-5`, 'pg-mark-stroke') : state === 'bad' ? path(`M${cx - 3} ${cy - 3}l6 6M${cx + 3} ${cy - 3}l-6 6`, 'pg-mark-stroke') : circle(cx, cy, 2, 'pg-mark-stroke')}`;

function cartographer() {
  const routes = [
    path('M109 124H157C172 124 176 62 198 62H220', 'pg-route'),
    path('M109 124H220', 'pg-route'),
    path('M109 124H157C172 124 176 187 198 187H220', 'pg-route'),
    path('M109 124H157C172 124 176 62 198 62H220', 'pg-flow pg-route-flow'),
    path('M109 124H220', 'pg-flow pg-route-flow'),
    path('M109 124H157C172 124 176 187 198 187H220', 'pg-flow pg-route-flow')
  ].join('');
  const terminals = [
    `${rect(274, 35, 142, 54, 'pg-panel pg-node', { rx: 8 })}${statusMark(291, 54, 'good')}${text(307, 54, 'Account path', 'pg-label')}${text(307, 72, 'workspace found', 'pg-mono pg-muted')}`,
    `${rect(274, 97, 142, 54, 'pg-panel pg-node', { rx: 8 })}${statusMark(291, 116, 'good')}${text(307, 116, 'Checkout path', 'pg-label')}${text(307, 134, 'receipt observed', 'pg-mono pg-muted')}`,
    `${rect(274, 159, 142, 54, 'pg-panel pg-node', { rx: 8 })}${statusMark(291, 178, 'pending')}${text(307, 178, 'Edge path', 'pg-label')}${text(307, 196, 'needs inspection', 'pg-mono pg-muted')}`
  ].join('');
  return `${rect(1, 1, 438, 238, 'pg-surface', { rx: 13 })}${text(24, 25, 'DISCOVERED ROUTES', 'pg-mono pg-muted')}${routes}${browserFrame(20, 88, 89, 72, 'seed', `${text(34, 127, 'app.test', 'pg-label')}${text(34, 147, 'start here', 'pg-mono pg-muted')}`)}${rect(157, 93, 65, 62, 'pg-sage pg-node', { rx: 10 })}${circle(189, 124, 16, 'pg-coral-ring')}${circle(189, 124, 5, 'pg-coral-fill')}${text(172, 149, 'map', 'pg-mono pg-muted')}${terminals}${text(274, 228, 'branch changes', 'pg-mono pg-muted')}`;
}

function clones() {
  const stateLine = path('M207 75V190', 'pg-route');
  const stateFlow = path('M207 75V190', 'pg-flow pg-route-flow');
  return `${rect(1, 1, 438, 238, 'pg-surface-dark', { rx: 13 })}${text(22, 24, 'SERVICE STATE', 'pg-mono pg-light-muted')}${browserFrame(20, 42, 162, 158, 'checkout clone', `${text(36, 87, 'payment_intent', 'pg-label pg-light')}${text(36, 106, 'pi_4b91', 'pg-mono pg-light-muted')}${line(35, 118, 167, 118, 'pg-dark-line')}${text(36, 143, 'status', 'pg-mono pg-light-muted')}${text(115, 143, 'pending', 'pg-mono pg-coral')}${text(36, 170, 'test inbox', 'pg-mono pg-light-muted')}${text(115, 170, 'empty', 'pg-mono pg-light')}${statusMark(47, 188, 'pending')}`, 'pg-panel-dark')}${stateLine}${stateFlow}${circle(207, 75, 6, 'pg-coral-fill')}${circle(207, 132, 6, 'pg-green-fill')}${circle(207, 190, 6, 'pg-coral-fill')}${rect(230, 42, 186, 49, 'pg-panel-dark pg-node', { rx: 8 })}${circle(247, 66, 9, 'pg-coral-ring')}${text(265, 62, 'Snapshot', 'pg-label pg-light')}${text(265, 77, 'state_014', 'pg-mono pg-light-muted')}${rect(230, 105, 186, 49, 'pg-panel-dark pg-node', { rx: 8 })}${circle(247, 129, 9, 'pg-green-ring')}${text(265, 125, 'Run a failure', 'pg-label pg-light')}${text(265, 140, 'webhook delayed', 'pg-mono pg-light-muted')}${rect(230, 168, 186, 49, 'pg-panel-dark pg-node', { rx: 8 })}${circle(247, 192, 9, 'pg-coral-ring')}${text(265, 188, 'Restore', 'pg-label pg-light')}${text(265, 203, 'back to state_014', 'pg-mono pg-light-muted')}`;
}

function guard() {
  const rails = `${path('M118 120H156', 'pg-route')}${path('M258 120H303', 'pg-route')}${path('M258 120C278 120 278 66 303 66', 'pg-route')}${path('M258 120C278 120 278 176 303 176', 'pg-route')}${path('M258 120C278 120 278 66 303 66', 'pg-flow pg-route-flow')}${path('M258 120H303', 'pg-flow pg-route-flow')}${path('M258 120C278 120 278 176 303 176', 'pg-flow pg-route-flow')}`;
  return `${rect(1, 1, 438, 238, 'pg-surface-dark', { rx: 13 })}${text(22, 24, 'RELEASE CHECK', 'pg-mono pg-light-muted')}${browserFrame(20, 70, 99, 102, 'pull/48', `${text(34, 110, 'checkout copy', 'pg-label pg-light')}${text(34, 130, '+ 3 files', 'pg-mono pg-light-muted')}${text(34, 152, 'preview', 'pg-mono pg-coral')}`, 'pg-panel-dark')}${rails}${rect(156, 71, 103, 99, 'pg-panel-dark pg-node', { rx: 8 })}${panelHeader(156, 71, 103, 'checks', 'pg-mono pg-light-muted')}${statusMark(171, 116, 'good')}${text(184, 120, 'signup', 'pg-mono pg-light')}${statusMark(171, 141, 'good')}${text(184, 145, 'access', 'pg-mono pg-light')}${statusMark(171, 166, 'bad')}${text(184, 170, 'payment', 'pg-mono pg-coral')}${rect(303, 42, 113, 49, 'pg-panel-dark pg-node', { rx: 8 })}${statusMark(320, 66, 'good')}${text(336, 62, 'ready', 'pg-label pg-light')}${text(336, 77, '2 checks', 'pg-mono pg-light-muted')}${rect(303, 97, 113, 49, 'pg-panel-dark pg-node', { rx: 8 })}${statusMark(320, 121, 'bad')}${text(336, 117, 'blocked', 'pg-label pg-coral')}${text(336, 132, 'payment', 'pg-mono pg-light-muted')}${rect(303, 152, 113, 49, 'pg-panel-dark pg-node', { rx: 8 })}${statusMark(320, 176, 'pending')}${text(336, 172, 'review', 'pg-label pg-light')}${text(336, 187, 'trace', 'pg-mono pg-light-muted')}${text(303, 222, 'route stops here', 'pg-mono pg-light-muted')}`;
}

function trace() {
  const cursor = `${line(250, 26, 250, 217, 'pg-cursor')}${path('M242 40l8-14 8 14z', 'pg-cursor-fill')}${text(260, 42, 'failure', 'pg-mono pg-coral')}`;
  const lane = (y, label, values, state = 'good') => `${line(21, y, 418, y, 'pg-dark-line')}${text(23, y + 17, label, 'pg-mono pg-light-muted')}${values.map((value, index) => `${rect(106 + index * 60, y + 7, 58, 25, state === 'bad' && index === 2 ? 'pg-lane-bad' : 'pg-lane', { rx: 5 })}${text(113 + index * 60, y + 23, value, 'pg-mono pg-light')}`).join('')}`;
  return `${rect(1, 1, 438, 238, 'pg-surface-dark', { rx: 13 })}${text(22, 24, 'TRACE / RUN 0048', 'pg-mono pg-light-muted')}${browserFrame(20, 38, 205, 57, 'checkout / confirmation', `${rect(35, 63, 92, 17, 'pg-sage', { rx: 3 })}${text(42, 75, 'Order confirmed', 'pg-mono pg-ink')}${rect(134, 63, 74, 17, 'pg-panel-dark-2', { rx: 3 })}${text(144, 75, 'receipt?', 'pg-mono pg-light-muted')}`, 'pg-panel-dark')}${lane(105, 'browser', ['click', 'submit', 'assert'], 'good')}${lane(147, 'network', ['POST 200', 'GET 200', 'POST 500'], 'bad')}${lane(189, 'console', ['quiet', 'quiet', 'error'], 'bad')}${cursor}${rect(291, 38, 125, 166, 'pg-panel-dark pg-node', { rx: 9 })}${panelHeader(291, 38, 125, 'failure cursor', 'pg-mono pg-light-muted')}${statusMark(309, 82, 'bad')}${text(324, 86, 'receipt', 'pg-label pg-coral')}${text(305, 111, 'POST /receipt', 'pg-mono pg-light')}${text(305, 130, '500', 'pg-mono pg-coral')}${line(305, 143, 408, 143, 'pg-dark-line')}${text(305, 164, 'browser + net', 'pg-mono pg-light-muted')}${text(305, 181, '+ console', 'pg-mono pg-light-muted')}`;
}

function mender() {
  const diffLines = `${text(38, 94, '- status: pending', 'pg-mono pg-danger')}${text(38, 119, '+ status: confirmed', 'pg-mono pg-green')}${text(38, 144, '+ receipt: attached', 'pg-mono pg-green')}${line(34, 157, 195, 157, 'pg-line')}${text(38, 179, 'proposed patch', 'pg-mono pg-muted')}`;
  return `${rect(1, 1, 438, 238, 'pg-surface', { rx: 13 })}${text(22, 24, 'REVIEWABLE REPAIR', 'pg-mono pg-muted')}${path('M207 119H257', 'pg-route')}${path('M207 119H257', 'pg-flow pg-route-flow')}${rect(20, 48, 188, 153, 'pg-panel pg-node', { rx: 9 })}${panelHeader(20, 48, 188, 'proposed diff')}${text(36, 79, 'checkout confirmation', 'pg-label')}${diffLines}${rect(257, 48, 159, 153, 'pg-panel pg-node', { rx: 9 })}${panelHeader(257, 48, 159, 'review before apply')}${statusMark(276, 87, 'good')}${text(291, 91, 'scope checked', 'pg-label')}${statusMark(276, 114, 'pending')}${text(291, 118, 'human approval', 'pg-label')}${rect(273, 143, 127, 35, 'pg-outline-button', { rx: 6 })}${text(286, 165, 'Review patch', 'pg-label')}${text(273, 190, 'merge stays with you', 'pg-mono pg-muted')}`;
}

function platform() {
  return `${rect(1, 1, 438, 238, 'pg-surface', { rx: 13 })}${text(22, 24, 'BROWSER → RESULT', 'pg-mono pg-muted')}${browserFrame(20, 55, 145, 131, 'billing portal', `${text(36, 92, 'Find invoice', 'pg-label')}${rect(35, 108, 115, 25, 'pg-input', { rx: 4 })}${text(43, 125, 'August 2026', 'pg-mono pg-muted')}${rect(35, 145, 72, 25, 'pg-coral-fill', { rx: 4 })}${text(48, 162, 'Open', 'pg-label pg-ink')}`)}${path('M166 120H276', 'pg-route')}${path('M166 120H276', 'pg-flow pg-route-flow')}${circle(220, 120, 18, 'pg-sage pg-node')}${path('M212 120h16m-6-6 6 6-6 6', 'pg-route-arrow')}${text(200, 153, 'action', 'pg-mono pg-muted')}${rect(276, 47, 140, 146, 'pg-panel pg-node', { rx: 9 })}${panelHeader(276, 47, 140, 'file / data result')}${rect(294, 83, 28, 37, 'pg-coral-soft', { rx: 3 })}${text(300, 106, 'PDF', 'pg-mono pg-coral')}${text(335, 96, 'invoice', 'pg-label')}${text(335, 114, 'august_2026', 'pg-mono pg-muted')}${line(294, 131, 398, 131, 'pg-line')}${text(294, 153, 'downloaded', 'pg-mono pg-green')}${statusMark(388, 178, 'good')}${text(294, 181, 'app ready', 'pg-mono pg-muted')}`;
}

function swarm() {
  const sessions = [
    { y: 35, label: 'guest', detail: 'browse plans', state: 'good' },
    { y: 96, label: 'member', detail: 'edit project', state: 'good' },
    { y: 157, label: 'admin', detail: 'invite user', state: 'pending' }
  ];
  const cards = sessions.map(({ y, label, detail, state }, index) => `${browserFrame(20, y, 118, 47, `${label} session`, `${text(32, y + 38, detail, 'pg-mono pg-light')}`, 'pg-panel-dark')}${statusMark(151, y + 23, state)}${path(`M159 ${y + 23}H198`, 'pg-route')}${path(`M159 ${y + 23}H198`, index === 1 ? 'pg-flow pg-route-flow' : 'pg-route')}`).join('');
  return `${rect(1, 1, 438, 238, 'pg-surface-dark', { rx: 13 })}${text(22, 24, 'INDEPENDENT SESSIONS', 'pg-mono pg-light-muted')}${cards}${rect(198, 87, 93, 72, 'pg-panel-dark pg-node', { rx: 9 })}${circle(216, 110, 9, 'pg-coral-ring')}${text(233, 114, 'invitation', 'pg-label pg-light')}${text(214, 134, 'team_7d2', 'pg-mono pg-light-muted')}${path('M291 123H317', 'pg-route')}${path('M291 123H317', 'pg-flow pg-route-flow')}${rect(317, 64, 99, 118, 'pg-panel-dark pg-node', { rx: 9 })}${panelHeader(317, 64, 99, 'workspace', 'pg-mono pg-light-muted')}${statusMark(333, 103, 'good')}${text(348, 107, 'joined', 'pg-label pg-light')}${text(333, 130, 'three paths', 'pg-mono pg-light-muted')}${text(333, 149, 'one invitation', 'pg-mono pg-coral')}${text(333, 169, 'permissions kept', 'pg-mono pg-light-muted')}`;
}

const scenes = { cartographer, clones, guard, trace, mender, platform, swarm };
const sceneMeta = {
  cartographer: ['Cartographer route map', 'A seed page branches into discovered account, checkout, and edge paths.'],
  clones: ['Clones state and restore', 'A service state is captured, changed by a test, and restored for the next run.'],
  guard: ['Guard release check', 'A release moves through checks and stops at a blocked payment route.'],
  trace: ['Trace synchronized failure', 'Browser, network, and console tracks align at the failed receipt request.'],
  mender: ['Mender proposed diff', 'A proposed repair is shown for review before anyone applies it.'],
  platform: ['Platform browser result', 'A browser action produces a file or structured data result.'],
  swarm: ['Swarm invitation sessions', 'Independent user sessions meet at one invitation before entering a shared workspace.']
};

export function productGraphic(kind, { compact = false } = {}) {
  const key = scenes[kind] ? kind : 'platform';
  const [title, description] = sceneMeta[key];
  const content = scenes[key]();
  const compactAttrs = compact ? ' aria-hidden="true"' : '';
  const svgAttrs = compact
    ? 'aria-hidden="true" focusable="false"'
    : `role="img" aria-label="${escapeHtml(title)}" focusable="false"`;
  return `<div class="molar-product-graphic pg-${key}${compact ? ' is-compact' : ''}" data-motion-scene${compactAttrs}><svg class="molar-product-graphic__svg" viewBox="0 0 440 240" preserveAspectRatio="xMidYMid meet" ${svgAttrs}><title>${escapeHtml(title)}</title><desc>${escapeHtml(description)}</desc>${content}</svg></div>`;
}
