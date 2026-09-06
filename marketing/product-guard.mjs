import {icon} from './components.mjs';
export function guardStory() {
  const body = String.raw`<section class="section pgd-workbench-section" id="product-demo">
  <div class="wrap">
    <div class="section-heading pgd-section-heading">
      <div><h2>Run the checks your release depends on.</h2></div>
      <p>Choose a release moment, inspect the configured tests, and open the assertion that decides the result. This interactive example uses sample data.</p>
    </div>
    <div class="pgd-workbench" data-guard-example>
      <div class="pgd-example-bar"><span><i class="pgd-live-dot"></i>Guard workbench</span><span>configured checkout policy</span></div>
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
          <div class="pgd-run-actions"><button class="button button-primary pgd-fixed-example" type="button" data-fixed-example>Compare fixed example</button><button class="button button-outline" type="button" data-rationale aria-expanded="false" aria-controls="pgd-rationale">Why this test?</button><a class="text-link" href="/products/trace">Open Trace example ${icon('arrow')}</a></div>
          <div class="pgd-rationale" id="pgd-rationale" data-rationale-panel hidden><strong>Example policy rationale</strong><p>Checkout is selected because this team marks purchase and access as a critical path. The repository policy names the scenarios used at each release moment.</p></div>
          <p class="pgd-replay-note" data-replay-note aria-live="polite">Sample state: callback processed, entitlement write absent.</p>
        </article>
      </div>
    </div>
  </div>
</section>

<section class="section pgd-setup-section" id="product-setup">
  <div class="wrap">
    <div class="section-heading pgd-section-heading"><div><h2>Add a check to each<br>stage of your release.</h2></div><p>Guard becomes useful when its target, credentials, scenario, and merge policy are explicit. Configure them once, then inspect the result for each pull request and deployment.</p></div>
    <div class="pgd-release-stages">
      <article><span class="pgd-stage-number">01</span><h3>Prepare</h3><p>Install and authenticate the CLI. Connect the repository and preview environment. Give the scenario a dedicated test account and only the service endpoints it needs.</p></article>
      <article><span class="pgd-stage-number">02</span><h3>Gate</h3><p>Run the configured scenario in CI and mark the chosen GitHub job as required in repository settings. Guard reports the result; your branch protection policy decides whether a merge is allowed.</p></article>
      <article><span class="pgd-stage-number">03</span><h3>Observe</h3><p>After deployment, schedule an authorized login, checkout, or account check against the selected URL. Use marked identities and keep side effects inside the probe-owned data.</p></article>
      <article><span class="pgd-stage-number">04</span><h3>Investigate</h3><p>Open the failed assertion, browser steps, screenshots, and available Trace reference. Mender can prepare a repair preview for review; a human still decides what enters the repository.</p></article>
    </div>
    <div class="pgd-ci-grid">
      <div class="pgd-ci-copy"><h3>One command in the job.<br>One result reviewers can read.</h3><p>Install Molar and the Guard runner in the job, define the checkout scenario, and configure its target URL and test credentials before this step runs. Keep tokens in your CI secret store; set the repository’s required status check separately.</p><a class="text-link" href="https://docs.molar.it">Read Guard setup docs ${icon('arrow')}</a></div>
      <div class="pgd-code-card"><div class="pgd-code-head"><span>.github/workflows/guard.yml</span><span>CI step excerpt</span></div><pre><code># Job step after CLI installation and test setup
- name: Check checkout and account access
  run: molar run checkout --ci --json</code></pre><div class="pgd-job-result"><span class="pgd-job-icon">${icon('x')}</span><span><strong>molar / checkout</strong><small>failed · account access assertion</small></span><a href="/products/trace">trace ${icon('arrow')}</a></div></div>
    </div>
  </div>
</section>

<section class="section pgd-capabilities-section" id="product-capabilities">
  <div class="wrap">
    <div class="section-heading pgd-section-heading"><div><h2>Know what the check<br>actually proved.</h2></div><p>Guard connects a configured scenario to the decision your team makes. Check the scope of each environment and integration before you depend on it.</p></div>
    <div class="pgd-monitor-strip"><div><h3>login → workspace loads</h3><p>Example schedule · every 15 minutes · test account</p></div><div class="pgd-monitor-cells"><span class="is-pass">northstar.test · 09:15 ${icon('check')}</span><span class="is-warn">northstar.test · 09:00 delayed</span><span class="is-pass">northstar.test · 08:45 ${icon('check')}</span></div><a class="text-link" href="/blog/synthetic-monitoring-production">Monitoring guidance ${icon('arrow')}</a></div>
    <div class="pgd-capability-table-wrap"><table class="pgd-capability-table"><caption>Guard capability and setup status</caption><thead><tr><th scope="col">Capability</th><th scope="col">What your team configures</th><th scope="col">Evidence to inspect</th></tr></thead><tbody><tr><th scope="row">CI release check</th><td>Scenario, preview URL, credentials, required job</td><td>JSON result, failed assertion, run identity</td></tr><tr><th scope="row">Post-deploy smoke</th><td>Release URL and the configured critical path</td><td>Browser steps, screenshots, available Trace link</td></tr><tr><th scope="row">Production schedule</th><td>Cadence, target permissions, marked test identity</td><td>Run status, incident context, target result</td></tr><tr><th scope="row">Mender preview</th><td>Allowed paths, reviewer access, repair mode</td><td>Proposed diff and validation context before review</td></tr></tbody></table></div>
    <div class="pgd-bottom-grid"><div><h3>Compare the decision,<br>then test your own flow.</h3><p>Guard can sit beside an existing Playwright suite. Compare how you define scenarios, wire CI, and inspect a failed checkout or invitation.</p><div class="pgd-compare-links"><a href="/vs/playwright">Guard vs Playwright ${icon('arrow')}</a><a href="/vs/checkly">Guard vs Checkly ${icon('arrow')}</a><a href="/vs/cypress">Guard vs Cypress ${icon('arrow')}</a></div></div><aside class="pgd-mender-card"><h3>A repair proposal<br>still needs a reviewer.</h3><p>Mender can use the failed scenario context to prepare a proposed change. Mender is in preview. Review its proposed diff and validation results before applying a change.</p><span class="pgd-mender-state">review required · human approval</span></aside></div>
  </div>
</section>`;

  const faqs = [
    {q:'What does Guard run?',a:'Guard runs configured scenarios in CI, after deployment, or on a schedule. A scenario can follow a browser journey and check the resulting application state; supported Clones can provide isolated payment, email, identity, SMS, or storage behavior where the workflow needs it.'},
    {q:'How does Guard choose tests?',a:'Your repository policy names the scenarios and release moments to run. A diff or changed area can be one input to that policy. Confirm the configured scenario set before making a job required.'},
    {q:'What do I need before adding the CI job?',a:'Install and authenticate the CLI, connect the repository and target environment, define the scenario and its assertions, and prepare dedicated test credentials or Clones. Keep secrets in your CI secret store and make the selected GitHub job required in repository settings.'},
    {q:'Can Guard check a preview or production URL?',a:'Yes, for an authorized workflow. Use the preview URL for a release check and a scheduled, permission-scoped target for production monitoring. Production probes should use marked identities and side effects confined to probe-owned data.'},
    {q:'What does a failed run show?',a:'The result keeps the scenario and run identity with the failed assertion and available browser steps, screenshots, artifacts, and Trace reference. Check whether the failure is an application assertion, missing access, or environment setup issue before rerunning.'},
    {q:'Does Guard replace Playwright?',a:'No. Guard can complement an existing Playwright suite. Evaluate the configured scenario, environment setup, evidence, and maintenance work on a flow that matters to your team.'},
    {q:'Will Mender merge or deploy a fix?',a:'No. Mender is a preview workflow that prepares a proposed repair for review. A human reviews the diff and repository policy remains in control of approval, merge, and deployment.'}
  ];
  return {body, faqs};
}
