export const githubActionsGuide = `
<section id="overview"><h2>Run a configured browser scenario in CI.</h2>
<p>Use the Molar Guard GitHub Action to run a scenario your project already defines. Start with a task you can reproduce locally, such as signing in or completing checkout in a test environment.</p>
<p>The CI runner needs access to the application URL, the Molar project, and any test accounts or services the scenario uses. Configure those before adding the command to your workflow.</p></section>
<section id="steps"><h2>Register the scenario, then add the Action.</h2>
<ol><li><strong>Write the scenario.</strong> Add a <code>.molar.md</code> file to <code>.molar/scenarios/</code> and run it locally against your test environment until it passes. Configure clones if the scenario changes payment, email or account state.</li><li><strong>Register it in Guard.</strong> Create the scenario in the Guard dashboard and copy its ID.</li><li><strong>Add the Action.</strong> Store your Molar API key as a repository secret, then add the step below after your preview deployment is ready.</li><li><strong>Make it required.</strong> Start with <code>mode: advisory</code>, which comments on the pull request. Switch to <code>mode: required</code> to fail the job on a failed check, then mark that job as required in your repository settings.</li></ol>
<pre><code># .github/workflows/guard.yml (step)
- uses: pratikranaa/guard-action@v1
  with:
    api-key: \${{ secrets.MOLAR_API_KEY }}
    scenario-id: \${{ vars.CHECKOUT_SCENARIO_ID }}
    base-url: \${{ steps.deploy.outputs.url }}
    mode: advisory</code></pre>
<p>The Action runs on <code>pull_request</code> and <code>workflow_dispatch</code> events. It starts one run of the scenario against <code>base-url</code>, waits for the result and reports it. It doesn’t write the scenario or change your branch protection. If you install the Molar GitHub App instead, Guard finds Vercel preview URLs for you.</p>
</section>
<section id="checks"><h2>Read the failure before deciding to merge.</h2>
<p>Review the scenario status and any captured steps, screenshots, or trace links. Check whether the app failed an assertion, the test environment was unavailable, or the account could not sign in. These require different fixes.</p>
<p>For example, a checkout scenario should verify the expected account access as well as the confirmation page. If the browser succeeds but the configured service check fails, investigate the payment callback or account update before treating the run as passed.</p>
<p>Guard is in beta. <a href="/products/guard">Explore Guard</a> or <a href="/contact">talk to us</a>. Automatic repair through Mender remains a preview capability.</p></section>
`;
