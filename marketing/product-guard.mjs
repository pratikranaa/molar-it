import {icon,codeBlock} from './components.mjs';
import {GUARD_SELECTION_CASES,GUARD_SCENARIOS,GUARD_MONITOR_RUNS,guardSelectionMarkup,guardMonitorMarkup} from './product-guard.js';
export function guardStory() {
  const body = String.raw`<section class="section pgd-workbench-section" id="product-demo">
  <div class="wrap">
    <div class="section-heading pgd-section-heading">
      <div><h2>Run the checks your release depends on.</h2></div>
      <p>Pick when the check runs, see the tests it includes, and open the check that decides the result. This interactive example uses sample data.</p>
    </div>
    <div class="pgd-workbench" data-guard-example>
      <div class="pgd-example-bar"><span><i class="pgd-live-dot"></i>Release checks</span><span>checkout scenario</span></div>
      <div class="pgd-mode-tabs" role="tablist" aria-label="Guard release moment">
        <button type="button" role="tab" id="pgd-tab-before" aria-selected="true" aria-controls="pgd-panel-before" data-guard-mode="before">Before merge <small>pull request</small></button>
        <button type="button" role="tab" id="pgd-tab-after" aria-selected="false" aria-controls="pgd-panel-before" tabindex="-1" data-guard-mode="after">After deploy <small>release smoke</small></button>
        <button type="button" role="tab" id="pgd-tab-scheduled" aria-selected="false" aria-controls="pgd-panel-before" tabindex="-1" data-guard-mode="scheduled">Scheduled <small>production check</small></button>
      </div>
      <div class="pgd-console-grid">
        <aside class="pgd-test-list" aria-label="Configured tests">
          <div class="pgd-panel-label"><span>Configured tests</span><span data-test-count>3 configured</span></div>
          <div data-test-list>
            <button class="pgd-test-row is-selected" type="button" data-test-key="checkout" aria-pressed="true"><span class="pgd-test-state is-fail" data-test-state>${icon('x')}</span><span><strong>checkout</strong><small>4 assertions · selected</small></span><span class="pgd-test-arrow">→</span></button>
            <button class="pgd-test-row" type="button" data-test-key="signin" aria-pressed="false"><span class="pgd-test-state is-pass" data-test-state>${icon('check')}</span><span><strong>signin-and-dashboard</strong><small>3 assertions · configured</small></span><span class="pgd-test-arrow">→</span></button>
            <button class="pgd-test-row" type="button" data-test-key="invite" aria-pressed="false"><span class="pgd-test-state is-pass" data-test-state>${icon('check')}</span><span><strong>invite-member</strong><small>5 assertions · configured</small></span><span class="pgd-test-arrow">→</span></button>
          </div>
          <p class="pgd-list-note">Your release policy names the scenarios to run. This example shows a checkout policy.</p>
        </aside>
        <article class="pgd-run-panel" id="pgd-panel-before" role="tabpanel" aria-labelledby="pgd-tab-before" data-guard-panel>
          <div class="pgd-run-head"><div><span class="pgd-run-kicker" data-run-kicker>Required check · PR #184</span><h3 data-run-title>checkout</h3></div><span class="pgd-result is-fail" data-run-result>FAILED</span></div>
          <div class="pgd-run-meta"><span data-run-env>preview · pr-184</span><span data-run-id>run_7f2c · 4 assertions</span></div>
          <div class="pgd-assertion-card" data-assertion-card>
            <div class="pgd-assertion-top"><span class="pgd-assertion-index" data-assertion-index>03</span><span class="pgd-assertion-label" data-assertion-label>Assertion failed</span><span class="pgd-assertion-time" data-assertion-time>12.4s</span></div>
            <h4 data-assertion-title>Payment succeeded, account access missing</h4>
            <p data-assertion-copy>Payment record <code>pi_sample_184</code> is complete. The signed-in customer still has no <code>pro</code> entitlement after the callback.</p>
            <div class="pgd-assertion-evidence" data-evidence></div>
          </div>
          <div class="pgd-run-actions"><button class="button button-outline pgd-fixed-example" type="button" data-fixed-example>Compare fixed example</button><button class="button button-outline" type="button" data-rationale aria-expanded="false" aria-controls="pgd-rationale">Why this test?</button><a class="text-link" href="/products/trace">Open Trace example ${icon('arrow')}</a></div>
          <div class="pgd-rationale" id="pgd-rationale" data-rationale-panel hidden><strong>Example policy rationale</strong><p>Checkout is selected because this team marks purchase and access as a critical path. The repository policy names the scenarios used at each release moment.</p></div>
          <p class="pgd-replay-note" data-replay-note aria-live="polite">Sample state: the payment callback arrived, but the account never got Pro.</p>
        </article>
      </div>
    </div>
  </div>
</section>

<section class="section pgd-selection-section" id="guard-selection">
  <div class="wrap">
    <div class="pgd-section-heading"><h2>See why a change<br>selects a test.</h2><p>A billing change should bring checkout into focus. Guard picks the scenarios connected to the files a pull request changed, plus any scenario file it edits. Test selection is in beta, so check the reason before trusting the scope.</p></div>
    <div class="pgd-selection-workbench" data-guard-selection data-selected-case="mapped">
      <div class="pgd-example-bar"><span>Pull request → test selection</span><span>Interactive example · 3 configured scenarios</span></div>
      <div class="pgd-case-controls" role="group" aria-label="Example pull request changes">${GUARD_SELECTION_CASES.map((item,i)=>`<button type="button" data-selection-case="${item.id}" aria-pressed="${i===0}" aria-controls="guard-selection-panel">${item.label}</button>`).join('')}</div>
      <div id="guard-selection-panel" data-selection-panel aria-live="polite" aria-atomic="true">${guardSelectionMarkup(GUARD_SELECTION_CASES[0])}</div>
    </div>
    <div class="pgd-selection-notes"><div><h3>Skip a rerun when nothing changed.</h3><p>If nothing a test depends on has changed since an earlier commit where it passed, Guard can reuse that pass and label it “cached.” It compares the scenario, its source files, the runner version, dependency files and the clones it uses. This works for pull requests checked through the GitHub App.</p><p>A cached check is not a fresh browser run. Remote services and deployed environments can change independently of a commit.</p></div><div><h3>Make missing coverage visible.</h3><p>A large change that matches no mapped dependency runs every scenario. A small unmapped change can select nothing. Review the selection and update the map or choose the relevant tests explicitly.</p><p>Selection, a cached result and a newly passed assertion answer different questions. Keep all three visible to the reviewer.</p></div></div>
  </div>
</section>

<section class="section pgd-setup-section" id="product-setup">
  <div class="wrap">
    <div class="section-heading pgd-section-heading"><div><h2>Add a check to each<br>stage of your release.</h2></div><p>Set the URL, test account, scenario and merge rule once. Then read the result for each pull request and deployment.</p></div>
    <div class="pgd-release-stages">
      <article><span class="pgd-stage-number">01</span><h3>Prepare</h3><p>Install and authenticate the CLI. Connect the repository and preview environment. Give the scenario a dedicated test account and only the service endpoints it needs.</p></article>
      <article><span class="pgd-stage-number">02</span><h3>Gate</h3><p>Run the configured scenario in CI and mark the chosen GitHub job as required in repository settings. Guard reports the result; your branch protection policy decides whether a merge is allowed.</p></article>
      <article><span class="pgd-stage-number">03</span><h3>Observe</h3><p>After deployment, schedule an authorized login, checkout, or account check against the selected URL. Use dedicated test accounts so scheduled checks never touch real customer data.</p></article>
      <article><span class="pgd-stage-number">04</span><h3>Investigate</h3><p>Open the failed assertion, browser steps, screenshots, and available Trace reference. Mender can prepare a repair preview for review; a human still decides what enters the repository.</p></article>
    </div>
    <div class="pgd-ci-grid">
      <div class="pgd-ci-copy"><h3>A scenario file and one step in CI.</h3><p>A scenario is a <code>.molar.md</code> file in <code>.molar/scenarios/</code>: a short header naming the clones it uses, then plain-English steps and checks. Molar compiles it into a Playwright test, so no AI agent decides pass or fail in CI. Register the scenario in Guard, then add the GitHub Action with its scenario ID. Keep your API key in your CI secret store.</p><a class="text-link" href="https://docs.molar.it/docs/guard/quick-start">Read Guard setup docs ${icon('arrow')}</a></div>
      <div class="pgd-ci-example">${codeBlock('# .molar/scenarios/checkout.molar.md\n---\nslug: checkout\nclones:\n  - { kind: stripe }\n  - { kind: email }\n---\n1. Navigate to /pricing\n2. Click \"Subscribe Pro\"\n3. Fill the card with 4242424242424242\n4. Wait for webhook stripe.checkout.session.completed\n5. Assert Email Clone outbox contains 1 email\n6. Assert text \"Welcome to Pro\" is visible\n\n# .github/workflows/guard.yml (step)\n- uses: pratikranaa/guard-action@v1\n  with:\n    api-key: ${{ secrets.MOLAR_API_KEY }}\n    scenario-id: ${{ vars.CHECKOUT_SCENARIO_ID }}\n    base-url: ${{ steps.deploy.outputs.url }}\n    mode: required','Scenario and CI step')}<div class="pgd-job-result"><span class="pgd-job-icon">${icon('x')}</span><span><strong>molar / checkout</strong><small>Example failed job · account access assertion</small></span><a href="/products/trace">Inspect failure ${icon('arrow')}</a></div></div>
    </div>
  </div>
</section>

<section class="section pgd-capabilities-section" id="product-capabilities">
  <div class="wrap">
    <div class="pgd-section-heading"><h2>Follow the same check<br>after deployment.</h2><p>A checkout that passed at midnight can fail by morning. Open each scheduled run’s target, check and captured result to see what changed. Each scheduled run counts toward your 25 hosted runs a day.</p></div>
    <div class="pgd-monitor" data-guard-monitor>
      <div class="pgd-example-bar"><span>Scheduled checks · sample history</span><span>Every 6 hours · one target</span></div>
      <div class="pgd-history-table-wrap"><table class="pgd-history-table"><caption class="sr-only">Select a scheduled run to inspect its result. All times are UTC.</caption><thead><tr><th scope="col">Scenario</th><th scope="col">00:00</th><th scope="col">06:00</th><th scope="col">12:00</th></tr></thead><tbody>${GUARD_SCENARIOS.map((name,row)=>`<tr><th scope="row">${name}</th>${GUARD_MONITOR_RUNS.slice(row*3,row*3+3).map((run,col)=>`<td><button type="button" class="pgd-history-status is-${run.status.toLowerCase().replace(' ','-')}" data-monitor-run="${row*3+col}" aria-pressed="${row===0&&col===1}" aria-label="${run.scenario}, ${run.time} UTC, ${run.status}" aria-controls="guard-monitor-panel">${run.status}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="pgd-monitor-panel" id="guard-monitor-panel" data-monitor-panel aria-live="polite" aria-atomic="true">${guardMonitorMarkup(GUARD_MONITOR_RUNS[1])}</div>
    </div>
    <div class="pgd-monitor-setup"><div><h3>Define what the schedule may touch.</h3><p>Choose the target URL, scenario, cadence, available region, dedicated credentials and alert destination. Validate the production safety setup before creating a schedule, then inspect its first completed run.</p><p>Clones isolate supported vendor calls only when your app uses their endpoints. Your production database, analytics and other integrations still need explicit test-data boundaries.</p><a class="text-link" href="/blog/synthetic-monitoring-production">Plan a production check ${icon('arrow')}</a></div><div><h3>Read results from your terminal.</h3>${codeBlock('molar guard status --pattern "checkout*" --json\nmolar guard failures --pattern "checkout*" --limit 10 --json','Molar CLI · current status and recent failures')}<p class="pgd-code-note">Use the configured Molar CLI after sign-in with workspace access. These commands read existing checks; they do not create a schedule or start a browser.</p></div></div>
  </div>
</section>

<section class="section pgd-repair-section" id="guard-repair">
  <div class="wrap">
    <div class="pgd-section-heading"><h2>A failed checkout.<br>A fix you can review.</h2><p>Mender can use a failing run and repository context to prepare a repair proposal. Review the change, its regression test and fresh validation before approving it. Mender is in preview.</p></div>
    <div class="pgd-repair-workbench"><div class="pgd-repair-path"><div><h3>Payment completed.<br>Pro access did not.</h3><p>Keep the original assertion and callback details. The payment record alone does not prove that the customer received access.</p><a class="text-link" href="/products/trace">Inspect the Trace example ${icon('arrow')}</a></div><div><h3>Check the code that grants access.</h3><p>Review how the callback updates the account. Keep the proposed diff within allowed paths and check it against the captured failure.</p></div><div><h3>Prove the customer can use the plan.</h3><p>Run from prepared test state. Check both the purchased plan and the action it should unlock. Keep the new result separate from the original failure.</p></div></div><div class="pgd-repair-review"><h3>Receiving payment is only half the check.</h3>${codeBlock("await expect(page.getByTestId('account-plan'))\n  .toHaveText('Pro');\nawait expect(page.getByRole('button', {\n  name: 'New shared project'\n})).toBeEnabled();",'Playwright · example assertion excerpt')}<p class="pgd-code-note">Illustrative assertions after a test payment and return to the account page. Adapt the locators, fixtures and setup to your app. This excerpt is not an executed repair.</p><div class="pgd-review-checklist"><strong>Before approval</strong><ul><li>Review the source change and regression test.</li><li>Check that relevant tests ran against the proposed fix.</li><li>Keep Mender’s path limits and permissions in place.</li><li>Apply your repository’s review and merge policy.</li></ul></div><a class="text-link" href="/products/mender">Explore the Mender review process ${icon('arrow')}</a></div></div>
    <div class="pgd-suite-links"><a href="/products/cartographer"><strong>Cartographer</strong><span>Explore your app and develop the scenarios to check.</span>${icon('arrow')}</a><a href="/products/clones"><strong>Clones</strong><span>Prepare supported test services and restore their state.</span>${icon('arrow')}</a><a href="/products/trace"><strong>Trace</strong><span>Inspect the browser steps and captured service events.</span>${icon('arrow')}</a></div>
    <div class="pgd-compare-note"><h3>Compare with the tools you already use.</h3><p>Playwright provides browser tests; tools such as Checkly also run checks in CI and on schedules. Evaluate Guard’s scenario selection, test-service setup and failure investigation on a flow from your own app.</p><div class="pgd-compare-links"><a href="/vs/playwright">Molar and Playwright ${icon('arrow')}</a><a href="/vs/checkly">Compare with Checkly ${icon('arrow')}</a></div></div>
  </div>
</section>`;

  const faqs = [
    {q:'What does Guard run?',a:'Guard runs configured scenarios in CI, after deployment, or on a schedule. A scenario can follow a browser journey and check the resulting application state; supported Clones can provide isolated payment, email, identity, SMS, or storage behavior where the workflow needs it.'},
    {q:'What is a scenario?',a:'A .molar.md file in .molar/scenarios/ with a short YAML header (its name and the clones it uses) and plain-English steps and checks. Molar compiles it into a Playwright test.'},
    {q:'Does an AI agent decide pass or fail in CI?',a:'No. Guard runs Playwright tests: ones compiled from your scenarios, or your existing Playwright specs through the GitHub App or the CLI. AI only helps after a failure: Guard can suggest a fix for a broken locator, and Mender, when you turn it on, can propose a code fix.'},
    {q:'How does Guard handle flaky runs?',a:'A failing check fails the run. Guard doesn’t retry automatically or mark a later pass as flaky yet. If Mender is on, it reruns a failure three times and reports a flake instead of a bug when most reruns pass.'},
    {q:'How does Guard choose tests?',a:'Where dependency mapping is configured, Guard selects scenarios connected to changed files and directly edited .molar.md scenarios. Broad selections and large unmapped changes can trigger full-suite fallback. A small unmapped change can select nothing, so inspect the reason and choose an explicit test set where coverage is missing.'},
    {q:'What do I need before adding the CI job?',a:'Install and authenticate the CLI, connect the repository and target environment, define the scenario and its assertions, and prepare dedicated test credentials or Clones. Keep secrets in your CI secret store and make the selected GitHub job required in repository settings.'},
    {q:'Can Guard check a preview or production URL?',a:'Yes, for an authorized workflow. Use the preview URL for a release check and a scheduled, permission-scoped target for production monitoring. Use dedicated test accounts for production checks so they never touch real customer data.'},
    {q:'What does a failed run show?',a:'The result keeps the scenario and run identity with the failed assertion and available browser steps, screenshots, artifacts, and Trace reference. Check whether the failure is an application assertion, missing access, or environment setup issue before rerunning.'},
    {q:'Does Guard replace Playwright?',a:'No. Guard can complement an existing Playwright suite. Evaluate the configured scenario, environment setup, evidence, and maintenance work on a flow that matters to your team.'},
    {q:'Does a cached result mean the browser ran again?',a:'No. A cached result reuses an earlier pass because nothing the test depends on changed. It doesn’t run the browser again or prove that a remote environment stayed the same, so Guard labels it “cached.”'},
    {q:'Does a change with no mapped dependency run every scenario?',a:'Only a large one. Guard runs every scenario when more than 50 are affected, or when an unmapped change touches more than 10 files or 500 lines. A smaller unmapped change can select nothing, so review coverage and run the relevant tests yourself.'},
    {q:'Can I monitor from multiple regions?',a:'Not yet. During the beta, scheduled runs come from Molar’s hosted browser in Azure Central India. This page’s history illustrates a single target; it is not a live monitoring report.'},
    {q:'Do Clones prevent all production side effects?',a:'Clones isolate supported vendor operations when your app is configured to call them. They do not automatically intercept every outgoing request or isolate your production database. Use dedicated test identities, scoped data, configured endpoints and a validated safety setup.'},
    {q:'Will Mender merge or deploy a fix?',a:'No. Mender is a preview workflow that prepares a proposed repair for review. A human reviews the diff and repository policy remains in control of approval, merge, and deployment.'}
  ];
  return {body, faqs};
}
