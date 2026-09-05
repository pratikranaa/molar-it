const svg = (name) => {
  const paths = {
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="m6 6 12 12M6 18 18 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-8Z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    file: '<path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h8"/>',
    warning: '<path d="M12 4 21 20H3L12 4Z"/><path d="M12 9v5m0 3v1"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.check}</svg>`;
};

export const SERVICE_LAB_SCENARIOS = Object.freeze({
  payments: {
    label: 'Payments',
    narrative: 'Check that a successful payment becomes a confirmed order.',
    good: {conditionAction: 'Decline the payment', conditionCopy: 'Payment clone returns a successful charge and the app receives its callback.', resultTitle: 'Payment, callback, and order confirmation agree.', resultCopy: 'The customer gets access because the test followed the state change all the way through.', status: 'passed'},
    edge: {conditionAction: 'Decline the payment', conditionCopy: 'Payment clone declines the charge before the app can create an order.', resultTitle: 'The decline stays visible to the customer.', resultCopy: 'Molar checks that no order or access is created after a declined charge.', status: 'negative'}
  },
  email: {
    label: 'Email',
    narrative: 'Check that verification links open the right account state.',
    good: {conditionAction: 'Expire the link', conditionCopy: 'Inbox clone delivers a fresh verification link that matches the account under test.', resultTitle: 'The verification link opens the workspace.', resultCopy: 'The browser follows the message, verifies the identity, and reaches the expected destination.', status: 'passed'},
    edge: {conditionAction: 'Expire the link', conditionCopy: 'Inbox clone returns an expired verification link for the same account.', resultTitle: 'An expired link is handled safely.', resultCopy: 'Molar checks that the app explains what happened and gives the user a way forward.', status: 'negative'}
  },
  sms: {
    label: 'SMS',
    narrative: 'Check that the sign-in flow responds to the OTP it receives.',
    good: {conditionAction: 'Enter the wrong code', conditionCopy: 'SMS clone sends the expected one-time code to the test phone.', resultTitle: 'The correct OTP completes sign-in.', resultCopy: 'The phone message, entered code, and authenticated browser session agree.', status: 'passed'},
    edge: {conditionAction: 'Enter the wrong code', conditionCopy: 'SMS clone sends a code that does not match the value entered in the browser.', resultTitle: 'A wrong OTP does not grant access.', resultCopy: 'Molar verifies the error state and confirms the protected page stays protected.', status: 'negative'}
  },
  signin: {
    label: 'Sign-in',
    narrative: 'Check that each signed-in role sees only what it should.',
    good: {conditionAction: 'Use the admin role', conditionCopy: 'The member session has the expected project permissions and no billing access.', resultTitle: 'Member permissions stop at the right boundary.', resultCopy: 'The browser can use the project while the restricted billing area stays locked.', status: 'boundary'},
    edge: {conditionAction: 'Use the admin role', conditionCopy: 'The admin session carries the elevated workspace permissions into the browser.', resultTitle: 'Admin access reaches the workspace controls.', resultCopy: 'Molar checks the privileged view and records which controls become available.', status: 'passed'}
  },
  storage: {
    label: 'Storage',
    narrative: 'Check that an upload finishes as a usable file record.',
    good: {conditionAction: 'Interrupt the upload', conditionCopy: 'Storage clone completes the upload and returns a readable file record to the app.', resultTitle: 'The uploaded file is ready to use.', resultCopy: 'The browser sees the completed record, its size, and the action that can use it next.', status: 'passed'},
    edge: {conditionAction: 'Interrupt the upload', conditionCopy: 'Storage clone interrupts the upload before the full file reaches the record.', resultTitle: 'An interrupted upload is recoverable.', resultCopy: 'Molar checks that the app preserves the partial state and offers a clear retry path.', status: 'negative'}
  }
});

export function scenarioState(service = 'payments', edge = false) {
  const key = SERVICE_LAB_SCENARIOS[service] ? service : 'payments';
  const scenario = SERVICE_LAB_SCENARIOS[key];
  return {service: key, label: scenario.label, edge, ...scenario[edge ? 'edge' : 'good']};
}

const stateIcon = (state) => state === 'negative' ? svg('warning') : svg('check');

function surfaceFor(state) {
  const {service, edge} = state;
  if (service === 'email') return `<div class="service-lab-surface-top"><span>northstar.test / inbox</span></div><div class="service-lab-message-view"><div class="service-lab-inbox"><div class="service-lab-inbox-head">Molar test inbox <span>1 new message</span></div><div class="service-lab-inbox-meta">From <strong>Northstar accounts</strong></div><div class="service-lab-message-body"><p>Confirm your email to finish setting up your workspace.</p><div class="service-lab-email-link ${edge ? 'is-expired' : ''}">${svg('mail')} ${edge ? 'Link expired' : 'Verify email'} </div></div></div><div class="service-lab-message-card ${edge ? 'is-negative' : ''}"><strong>${edge ? 'Message needs recovery' : 'Message matched'}</strong><p>${edge ? 'The link age is outside the allowed window.' : 'The recipient and account ID match the browser session.'}</p><div class="service-lab-message-state">${stateIcon(edge ? 'negative' : 'passed')}<span>${edge ? 'Expired' : 'Verified'} state observed</span></div></div></div>`;
  if (service === 'sms') return `<div class="service-lab-surface-top"><span>test phone / messages</span></div><div class="service-lab-sms-view"><div class="service-lab-phone"><div class="service-lab-phone-screen"><div class="service-lab-phone-top"><strong>Northstar</strong><span>now</span></div><div class="service-lab-chat"><div class="service-lab-bubble incoming">Your Northstar sign-in code is <strong>482 190</strong>.</div><div class="service-lab-bubble outgoing">${edge ? '481 190' : '482 190'}</div><div class="service-lab-otp"><span>4</span><span>8</span><span>${edge ? '1' : '2'}</span><span>1</span><span>9</span><span>0</span></div></div></div></div><div class="service-lab-sms-event ${edge ? 'is-negative' : ''}"><span>SMS clone</span><code>otp.challenge</code><p>${edge ? 'Entered code differs from the received code.' : 'Received code matches the challenge for this session.'}</p><div class="service-lab-sms-state">${stateIcon(edge ? 'negative' : 'passed')}<span>${edge ? 'Rejected' : 'Accepted'} by sign-in</span></div></div></div>`;
  if (service === 'signin') return `<div class="service-lab-surface-top"><span>northstar.test / workspace</span></div><div class="service-lab-permission-view"><div class="service-lab-permission-card"><div class="service-lab-permission-head"><strong>Project permissions</strong><span>${edge ? 'admin' : 'member'} session</span></div><div class="service-lab-person"><span class="service-lab-avatar">${edge ? 'P' : 'M'}</span><span><strong>${edge ? 'Priya · admin' : 'Maya · member'}</strong><small>Signed in account</small></span></div><div class="service-lab-permission-list"><div class="service-lab-permission-row"><span>Project dashboard</span><strong>${svg('check')} Can use</strong></div><div class="service-lab-permission-row ${edge ? '' : 'is-locked'}"><span>Billing settings</span><strong>${edge ? svg('check') + ' Can manage' : svg('lock') + ' Locked'}</strong></div></div></div><div class="service-lab-access-card"><span>Observed access</span><strong>${edge ? 'Admin controls' : 'Member access'}</strong><p>${edge ? 'Role changes and billing controls are available.' : 'Projects are usable; billing remains protected.'}</p><div class="service-lab-access-state">${stateIcon(edge ? 'passed' : 'boundary')}<span>${edge ? 'Elevated' : 'Scoped'} correctly</span></div></div></div>`;
  if (service === 'storage') return `<div class="service-lab-surface-top"><span>northstar.test / files</span></div><div class="service-lab-storage-view"><div class="service-lab-file-record"><div class="service-lab-file-top"><span class="service-lab-file-icon">${svg('file')}</span><span><strong>launch-notes.pdf</strong><small>PDF document · 4.8 MB</small></span></div><div class="service-lab-file-meta"><span>Upload status</span><strong>${edge ? '64% / interrupted' : '100% / complete'}</strong></div><div class="service-lab-upload-track ${edge ? 'is-interrupted' : ''}"><span></span></div><div class="service-lab-file-state ${edge ? 'is-interrupted' : ''}">${stateIcon(edge ? 'negative' : 'passed')}<span>${edge ? 'Retry available' : 'File record ready'}</span></div></div><div class="service-lab-storage-event ${edge ? 'is-negative' : ''}"><span>Storage clone</span><code>object.launch-notes.pdf</code><p>${edge ? 'Connection closed before the final chunk was written.' : 'All chunks received and the record is readable.'}</p><strong>${edge ? 'App shows retry' : 'App shows open file'}</strong></div></div>`;
  return `<div class="service-lab-surface-top"><span>northstar.test / checkout</span></div><div class="service-lab-payment-view"><div class="service-lab-browser-card"><div class="service-lab-browser-title"><span class="service-lab-browser-mark">N</span><span><strong>Northstar Pro</strong><small>Monthly workspace plan</small></span><strong>$24</strong></div><div class="service-lab-field-row"><span>Card ending</span><strong>4242</strong></div><div class="service-lab-field-row"><span>Billing email</span><strong>maya@example.com</strong></div><div class="service-lab-payment-state ${edge ? 'is-declined' : ''}">${stateIcon(edge ? 'negative' : 'passed')}<span><strong>${edge ? 'Payment declined' : 'Payment succeeded'}</strong><small>${edge ? 'No order created' : 'Receipt and order callback received'}</small></span></div></div><div class="service-lab-event-card"><span class="service-lab-event-label">Payment clone</span><code>${edge ? 'payment_intent.payment_failed' : 'payment_intent.succeeded'}</code><span class="service-lab-event-state ${edge ? 'is-declined' : ''}">${stateIcon(edge ? 'negative' : 'passed')} ${edge ? 'rejected' : 'observed'}</span></div></div>`;
}

function update(root, service, edge, announce = false) {
  const state = scenarioState(service, edge);
  const scenario = SERVICE_LAB_SCENARIOS[state.service];
  root.querySelectorAll('[data-service-tab]').forEach(tab => {
    const selected = tab.dataset.serviceTab === state.service;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  root.querySelector('[data-service-surface]').innerHTML = surfaceFor(state);
  root.querySelector('[data-service-surface]').setAttribute('aria-labelledby', `service-lab-tab-${state.service}`);
  root.querySelector('[data-service-narrative]').textContent = scenario.narrative;
  root.querySelector('[data-service-condition-action]').textContent = state.conditionAction;
  root.querySelector('[data-service-condition-copy]').textContent = state.conditionCopy;
  root.querySelector('[data-service-condition]').setAttribute('aria-pressed', String(edge));
  root.querySelector('[data-service-result-title]').textContent = state.resultTitle;
  root.querySelector('[data-service-result-copy]').textContent = state.resultCopy;
  root.querySelector('[data-service-result-icon]').innerHTML = svg('check');
  root.querySelector('[data-service-result]').classList.remove('is-negative');
  root.querySelector('[data-service-result]').classList.toggle('is-boundary', state.status === 'boundary');
  if (announce) {
    root.querySelector('[data-service-announcement]').textContent = `${state.label}: ${state.resultTitle}`;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) root.querySelector('[data-service-surface]').animate([{opacity:.5,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
  }
}

function init(root) {
  let service = 'payments';
  let edge = false;
  const tabs = [...root.querySelectorAll('[data-service-tab]')];
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
