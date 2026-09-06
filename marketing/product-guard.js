const statusIcon=pass=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="${pass?'m5 12 4 4L19 6':'m6 6 12 12M6 18 18 6'}"/></svg>`;
const MODES = Object.freeze({
  before: Object.freeze({tabId:'pgd-tab-before', kicker:'Required check · PR #184', env:'preview · pr-184', runId:'run_7f2c'}),
  after: Object.freeze({tabId:'pgd-tab-after', kicker:'Release smoke · revision 9f31', env:'deployed · release target', runId:'run_80a1'}),
  scheduled: Object.freeze({tabId:'pgd-tab-scheduled', kicker:'Production probe · every 15 min', env:'production · probe target', runId:'run_81d4'})
});

const TESTS = Object.freeze({
  checkout: Object.freeze({
    title:'checkout', assertionCount:4, index:'03', time:'12.4s',
    heading:'Payment succeeded, account access missing',
    copy:'Payment record <code>pi_sample_184</code> is complete. The signed-in customer still has no <code>pro</code> entitlement after the callback.',
    fixedCopy:'Payment record <code>pi_sample_184</code> is complete and the customer now has the expected <code>pro</code> entitlement.',
    evidence:['browser confirmation visible','payment callback received','account access present'],
    failureEvidence:['pass','pass','fail'],
    note:'Sample state: callback processed, entitlement write absent.',
    fixedNote:'Fixed example state: the authored entitlement write is present after the callback.'
  }),
  signin: Object.freeze({
    title:'signin-and-dashboard', assertionCount:3, index:'03', time:'5.8s',
    heading:'Authenticated session reached the dashboard',
    copy:'The test account signed in, reloaded the protected route, and found the expected workspace heading.',
    evidence:['credentials accepted','session persisted after reload','workspace heading visible'],
    failureEvidence:['pass','pass','pass'],
    note:'Sample state: protected route available after reload.'
  }),
  invite: Object.freeze({
    title:'invite-member', assertionCount:5, index:'05', time:'8.1s',
    heading:'Invited member received the intended role',
    copy:'The invitation link opened in the member session and the workspace showed the expected member permissions.',
    evidence:['invitation link opened','membership recorded','member permissions visible'],
    failureEvidence:['pass','pass','pass'],
    note:'Sample state: invitation accepted in the separate test session.'
  })
});

const VALID_MODES = new Set(Object.keys(MODES));
const VALID_TESTS = new Set(Object.keys(TESTS));

export function guardFrame(mode = 'before', selected = 'checkout', fixed = false) {
  const safeMode = VALID_MODES.has(mode) ? mode : 'before';
  const safeSelected = VALID_TESTS.has(selected) ? selected : 'checkout';
  const test = TESTS[safeSelected];
  const isFixed = safeSelected === 'checkout' && Boolean(fixed);
  const failed = safeMode === 'before' && safeSelected === 'checkout' && !isFixed;
  const status = failed ? 'FAILED' : isFixed ? 'PASSED · FIXED EXAMPLE' : 'PASSED';
  const evidenceState = failed ? test.failureEvidence : test.failureEvidence.map(() => 'pass');
  const tests = Object.fromEntries(Object.keys(TESTS).map(key => [key, {
    state: safeMode === 'before' && key === 'checkout' && !isFixed ? 'fail' : 'pass',
    selected: key === safeSelected
  }]));
  return Object.freeze({
    mode:safeMode, selected:safeSelected, fixed:isFixed, failed, status,
    tabId:MODES[safeMode].tabId, kicker:MODES[safeMode].kicker, env:MODES[safeMode].env,
    runId:MODES[safeMode].runId + ' · ' + test.assertionCount + ' assertions',
    title:test.title, index:test.index, time:test.time,
    assertionLabel:failed ? 'Assertion failed' : 'Assertion passed',
    assertionTitle:failed ? test.heading : safeSelected === 'checkout' ? 'Payment and account access confirmed' : test.heading,
    assertionCopy:failed ? test.copy : safeSelected === 'checkout' ? test.fixedCopy : test.copy,
    evidence:test.evidence.map((label, index) => ({label, state:evidenceState[index]})),
    note:failed ? test.note : safeSelected==='checkout' ? test.fixedNote : test.note,
    tests
  });
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-guard-example]');
  if (root) {
    const $ = selector => root.querySelector(selector);
    const rows = [...root.querySelectorAll('[data-test-key]')];
    const tabs = [...root.querySelectorAll('[data-guard-mode]')];
    let mode = 'before';
    let selected = 'checkout';
    let fixed = false;

    function render() {
      const frame = guardFrame(mode, selected, fixed);
      $('[data-run-kicker]').textContent = frame.kicker;
      $('[data-run-env]').textContent = frame.env;
      $('[data-run-id]').textContent = frame.runId;
      $('[data-run-title]').textContent = frame.title;
      $('[data-assertion-index]').textContent = frame.index;
      $('[data-assertion-time]').textContent = frame.time;
      $('[data-assertion-label]').textContent = frame.assertionLabel;
      $('[data-assertion-title]').textContent = frame.assertionTitle;
      $('[data-assertion-copy]').innerHTML = frame.assertionCopy;
      $('[data-run-result]').textContent = frame.status;
      $('[data-run-result]').className = 'pgd-result ' + (frame.failed ? 'is-fail' : 'is-pass');
      $('[data-evidence]').innerHTML = frame.evidence.map(item => '<span class="is-' + item.state + '">' + statusIcon(item.state === 'pass') + item.label + '</span>').join('');
      $('[data-replay-note]').textContent = frame.note;
      $('[data-fixed-example]').textContent = frame.fixed ? 'Reset comparison' : 'Compare fixed example';
      $('[data-fixed-example]').disabled = selected !== 'checkout' || mode !== 'before';$('[data-fixed-example]').setAttribute('aria-pressed',String(frame.fixed));
      $('[data-fixed-example]').setAttribute('aria-label', selected === 'checkout' ? frame.fixed ? 'Reset fixed checkout comparison' : 'Compare the fixed checkout example' : 'Fixed comparison is available for checkout');
      $('[data-rationale-panel]').hidden = true;
      $('[data-rationale]').setAttribute('aria-expanded','false');
      root.querySelector('[data-guard-panel]').setAttribute('aria-labelledby', frame.tabId);
      rows.forEach(row => {
        const rowFrame = frame.tests[row.dataset.testKey];
        row.classList.toggle('is-selected', rowFrame.selected);
        row.setAttribute('aria-pressed', String(rowFrame.selected));
        const state = row.querySelector('[data-test-state]');
        state.innerHTML = statusIcon(rowFrame.state === 'pass');
        state.className = 'pgd-test-state ' + (rowFrame.state === 'fail' ? 'is-fail' : 'is-pass');
      });
      tabs.forEach(tab => {
        const active = tab.dataset.guardMode === frame.mode;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => { mode = tab.dataset.guardMode; fixed = false; render(); });
      tab.addEventListener('keydown', event => {
        const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : direction ? (index + direction + tabs.length) % tabs.length : null;
        if (next === null) return;
        event.preventDefault();
        mode = tabs[next].dataset.guardMode;
        fixed = false;
        render();
        tabs[next].focus();
      });
    });

    rows.forEach(row => row.addEventListener('click', () => { selected = row.dataset.testKey; fixed = false; render(); }));
    $('[data-fixed-example]').addEventListener('click', () => { if (selected === 'checkout') { fixed = !fixed; render(); } });
    $('[data-rationale]').addEventListener('click', event => {
      const button = event.currentTarget;
      const panel = $('[data-rationale-panel]');
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    render();
  }
}
