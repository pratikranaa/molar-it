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


// Authored examples match packages/affected/src/select.ts. These never run tests.
export const GUARD_SELECTION_CASES = [
  {id:'mapped', label:'Billing change', file:'src/billing/access.ts', mapping:'Billing access → checkout', selected:['checkout'], title:'1 of 3 scenarios selected', detail:'The dependency map connects this file to checkout. Sign-in and invitations have no matching dependency in this example.', fallback:false},
  {id:'scenario', label:'Scenario edit', file:'scenarios/invite-member.molar.md', mapping:'Scenario file → invite-member', selected:['invite-member'], title:'The edited scenario is selected', detail:'Changing a scenario definition selects that scenario directly, even without a matching source-file dependency.', fallback:false},
  {id:'large', label:'Large unmapped change', file:'11 changed files · no mapped dependencies', mapping:'No graph match → full-suite fallback', selected:['checkout','signin-and-dashboard','invite-member'], title:'Run the full configured suite', detail:'This change has no graph matches and exceeds the file-count threshold. Guard selects all three configured scenarios. They still need to execute.', fallback:true},
  {id:'unmapped', label:'New unmapped file', file:'src/billing/new-rule.ts · 18 changed lines', mapping:'No graph match · no automatic fallback', selected:[], title:'No tests selected. Review the scope.', detail:'A small unmapped change can return an empty selection. Add the missing dependency or explicitly run the relevant tests before relying on the check.', fallback:false}
];
export const GUARD_SCENARIOS = ['checkout','signin-and-dashboard','invite-member'];
export function guardSelectionMarkup(example) {
  return `<div class="pgd-selection-diagram"><div class="pgd-change-file"><span>Changed in this pull request</span><code>${example.file}</code><div class="pgd-map-label">${example.mapping}</div></div><svg class="pgd-connector" viewBox="0 0 60 160" fill="none" aria-hidden="true"><path d="M0 80H20Q30 80 30 70V30Q30 20 40 20H60M30 80H60M30 80V130Q30 140 40 140H60" stroke="currentColor" stroke-width="1.5"/></svg><ul class="pgd-selection-list">${GUARD_SCENARIOS.map(name=>`<li class="${example.selected.includes(name)?'is-selected':''}"><code>${name}</code><span>${example.selected.includes(name)?'Selected':'Not selected'}</span></li>`).join('')}</ul></div><div class="pgd-selection-summary"><h3>${example.title}</h3><p>${example.detail}</p><span>Selection only · no execution result</span></div>`;
}

export const GUARD_MONITOR_RUNS = [
  {scenario:'checkout', time:'09:00', status:'Passed', expected:'Pro access after test payment', observed:'Pro plan visible; project creation enabled.', next:'Keep this result as a reference for later runs.'},
  {scenario:'checkout', time:'09:15', status:'Failed', expected:'Pro access after test payment', observed:'Payment completed. Account still shows Free.', next:'Inspect the callback and account-access assertion in the failed run.'},
  {scenario:'checkout', time:'09:30', status:'Queued', next:'Wait for the worker to start. This slot has no browser result yet.'},
  {scenario:'signin-and-dashboard', time:'09:00', status:'Passed', expected:'Workspace visible after sign-in', observed:'The dedicated test account opened its workspace.', next:'Keep the result with the target URL and run time.'},
  {scenario:'signin-and-dashboard', time:'09:15', status:'Passed', expected:'Workspace visible after sign-in', observed:'The dedicated test account opened its workspace.', next:'This result covers sign-in; the separate checkout failure remains open.'},
  {scenario:'signin-and-dashboard', time:'09:30', status:'Queued', next:'No assertion has executed for this slot. Inspect the run when it starts.'},
  {scenario:'invite-member', time:'09:00', status:'Passed', expected:'Invited member can open the workspace', observed:'Invitation accepted with the expected member role.', next:'Keep the invitation and membership assertions with this run.'},
  {scenario:'invite-member', time:'09:15', status:'Not run', next:'Test credentials were unavailable. Restore the configured test identity before running again.'},
  {scenario:'invite-member', time:'09:30', status:'Paused', next:'This example schedule is paused. Resume it after reviewing the test-account setup.'}
];
export function guardMonitorMarkup(run) {
  return `<div class="pgd-monitor-result-head"><div><span>${run.time} UTC · northstar.test</span><h3>${run.scenario}</h3></div><strong class="pgd-history-status is-${run.status.toLowerCase().replace(' ','-')}">${run.status}</strong></div>${run.expected?`<dl class="pgd-monitor-assertion"><div><dt>Expected</dt><dd>${run.expected}</dd></div><div><dt>Observed</dt><dd>${run.observed}</dd></div></dl>`:'<p class="pgd-no-result">No assertion result. No captured browser steps for this slot.</p>'}<p class="pgd-monitor-next">${run.next}</p>`;
}
if (typeof document !== 'undefined') {
  function animatePanel(panel) {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.animate([{opacity:.5,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
  }
  const selection = document.querySelector('[data-guard-selection]');
  if (selection) selection.querySelectorAll('[data-selection-case]').forEach(button=>button.addEventListener('click',()=>{
    const example = GUARD_SELECTION_CASES.find(item=>item.id===button.dataset.selectionCase);
    selection.querySelectorAll('[data-selection-case]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const panel=selection.querySelector('[data-selection-panel]');
    panel.innerHTML=guardSelectionMarkup(example);
    selection.dataset.selectedCase=example.id;
    animatePanel(panel);
  }));
  const monitor = document.querySelector('[data-guard-monitor]');
  if (monitor) monitor.querySelectorAll('[data-monitor-run]').forEach(button=>button.addEventListener('click',()=>{
    monitor.querySelectorAll('[data-monitor-run]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const panel=monitor.querySelector('[data-monitor-panel]');
    panel.innerHTML=guardMonitorMarkup(GUARD_MONITOR_RUNS[Number(button.dataset.monitorRun)]);
    animatePanel(panel);
  }));
}
