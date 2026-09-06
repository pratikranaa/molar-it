import {DOCS, esc, icon, codeBlock} from './components.mjs';
import {CARTOGRAPHER_ROUTES, CARTOGRAPHER_SCENARIOS, CARTOGRAPHER_RUN_STEPS} from './product-cartographer.js';

const routeNode = ({id,label,path,state,tone,icon:iconName}) => `<button type="button" class="cg-node cg-node-${id} cg-node-${tone}" data-cartographer-route="${id}" aria-pressed="${id==='home'}" aria-label="Inspect ${label} route, ${state}"><span class="cg-node-mark">${icon(iconName)}</span><span><strong>${esc(label)}</strong><small>${esc(path)}</small></span><em>${esc(state)}</em></button>`;
const actionRow = ([action,title,note]) => `<li><span class="cg-action-mark">${icon(action)}</span><span><strong>${esc(title)}</strong><small>${esc(note)}</small></span></li>`;

function mapWorkbench(){
  return `<section class="section cg-workbench" id="product-demo" aria-labelledby="cg-demo-title">
    <div class="wrap">
      <div class="cg-section-intro"><div><h2 id="cg-demo-title">See how someone gets from signup to a working account.</h2></div><p>Start with an authorized URL and a concrete goal. Cartographer’s agent follows the pages that matter, then leaves the route, browser action, and expected result together.</p></div>
      <div class="cg-scenario-picker" data-cartographer-demo role="tablist" aria-label="Choose an example Cartographer goal">${CARTOGRAPHER_SCENARIOS.map((scenario,index)=>`<button type="button" role="tab" id="cg-scenario-${scenario.id}" aria-controls="cg-example-panel" aria-selected="${index===0}" tabindex="${index===0?0:-1}" data-cartographer-scenario="${scenario.id}"><span>${esc(scenario.label)}</span><strong>${esc(scenario.goal)}</strong></button>`).join('')}</div>
      <p class="cg-demo-note" data-cartographer-note role="status">Illustrative map · no request is sent from this demo.</p>
      <div class="cg-map-shell" id="cg-example-panel" role="tabpanel" aria-labelledby="cg-scenario-signup">
        <div class="cg-map-top"><span><i class="cg-live-dot"></i> route map / example run</span><span>northstar.test</span><span>6 routes · 2 branches</span></div>
        <div class="cg-map-canvas" aria-label="Illustrative connected route map">
          <svg class="cg-map-lines" viewBox="0 0 900 430" preserveAspectRatio="none" aria-hidden="true"><path d="M125 210H290M360 210H520M590 210H760M325 180V92H520M560 240V350H760"/><path class="cg-map-trace" d="M125 210H290M360 210H520M590 210H760"/></svg>
          ${CARTOGRAPHER_ROUTES.map(routeNode).join('')}
          <span class="cg-map-legend"><i class="cg-legend-line"></i> observed route <i class="cg-legend-dash"></i> branch to inspect</span>
        </div>
        <aside class="cg-route-detail" data-cartographer-detail aria-live="polite">
          <div class="cg-detail-head"><div><h3 data-route-title>Landing</h3><code data-route-path>/</code></div><span class="cg-state cg-state-pass" data-route-state>Observed</span></div>
          <p data-route-summary>Public entry point is reachable.</p>
          <ol class="cg-action-list" data-route-actions>${CARTOGRAPHER_ROUTES[0].actions.map(actionRow).join('')}</ol>
          <div class="cg-assertion"><span class="cg-kicker" data-route-assertion-label>Expected result</span><strong data-route-assertion>The landing heading is visible</strong></div>
          <button type="button" class="cg-code-toggle" data-cartographer-code aria-controls="cg-example-code" aria-expanded="false">Inspect illustrative Playwright test ${icon('code')}</button>
          <pre class="cg-route-code" id="cg-example-code" data-route-code hidden><code>${esc(CARTOGRAPHER_ROUTES[0].code)}</code></pre>
        </aside>
      </div>
      <p class="cg-map-caption">Select a route to inspect the state Cartographer would carry forward. The <strong>Blocked</strong> branch makes permissions visible instead of quietly treating an inaccessible page as a success.</p>
    </div>
  </section>`;
}

export const CARTOGRAPHER_CRAWL_EXAMPLE = {
  base_url: 'https://preview.example.test',
  depth: 3,
  max_pages: 40,
  max_per_pattern: 4,
  scope_allowlist: ['preview.example.test'],
  crawl_focus_prompt: 'Explore signup and account settings',
  auth_context: {mode:'browser_profile',browser_profile:'qa-member'}
};

export const CARTOGRAPHER_COMMANDS = {
  explore: 'molar explore https://preview.example.test --intent "cover signup and settings" --max-pages 40 --mode preview --json',
  run: 'molar run "sign in and reach the dashboard" --url http://localhost:3000 --json',
  verify: 'molar verify "the login form is visible" --url http://localhost:3000 --json'
};

function runInspector(){
 const step=CARTOGRAPHER_RUN_STEPS[3];
 return `<section class="section cgr-section" id="cartographer-run"><div class="wrap"><div class="cg-section-intro"><div><h2>Read the action.<br>Then check the result.</h2></div><p>A click can work while the checkout is still wrong. Inspect the selected element, the browser action, and the result that made the check fail.</p></div>
 <div class="cgr-shell" data-cg-run data-cg-selected="3"><div class="cgr-head"><span>Interactive example · checkout total</span><strong>Failed at the receipt check</strong></div><div class="cgr-goal"><span>Goal</span><p>Buy Pro for $24 and confirm the account has Pro access.</p></div><div class="cgr-layout"><div class="cgr-steps" role="tablist" aria-label="Inspect an example browser step" aria-orientation="vertical">${CARTOGRAPHER_RUN_STEPS.map((item,index)=>`<button type="button" id="cg-step-${index}" data-cg-step="${index}" role="tab" aria-controls="cg-run-detail" aria-selected="${index===3}" tabindex="${index===3?0:-1}"><span>${String(index+1).padStart(2,'0')}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.status)}</small></span>${icon(item.status==='Failed'?'x':item.status==='Not run'?'pause':'check')}</button>`).join('')}</div><div class="cgr-panel" id="cg-run-detail" data-cg-step-panel data-step-status="Failed" role="tabpanel" aria-labelledby="cg-step-3" tabindex="0"><div class="cgr-detail-head"><h3 data-cg-title>${esc(step.title)}</h3><span data-cg-status>${esc(step.status)}</span></div><dl class="cgr-observation"><div><dt>Selected element</dt><dd><code data-cg-target>${esc(step.target)}</code></dd></div><div><dt>Browser action</dt><dd data-cg-action>${esc(step.action)}</dd></div></dl><div class="cgr-result"><div class="cgr-page"><span data-cg-view>${esc(step.view)}</span><div><small data-cg-label>${esc(step.label)}</small><strong data-cg-value>${esc(step.value)}</strong></div><p data-cg-note>${esc(step.note)}</p></div><dl class="cgr-check"><div><dt>Expected</dt><dd data-cg-expected>${esc(step.expected)}</dd></div><div><dt>Observed</dt><dd data-cg-observed>${esc(step.observed)}</dd></div></dl></div></div></div></div><p class="cgr-caption">Sample data · select a step to inspect it. The failed amount check remains failed when you review earlier actions.</p></div></section>`;
}

function setupSection(){
 return `<section class="section cg-setup" id="product-setup"><div class="wrap"><div class="cg-section-intro"><div><h2>Give the exploration a useful boundary.</h2></div><p>Choose a starting page, the account role, and the part of the app you want to understand. The map reflects what the run observed within those limits.</p></div><div class="cg-discovery-layout"><div class="cg-discovery-copy"><ol><li><h3>Start with the right environment</h3><p>Use a preview or test app for flows that create accounts, submit forms, or change data. Connect its test services before exploring payment or messaging paths.</p></li><li><h3>Choose the account’s point of view</h3><p>A saved member profile and an admin profile reveal different routes. Profiles must belong to the same project and website as the exploration.</p></li><li><h3>Set the area and size of the map</h3><p>Limit allowed hosts, link depth, total pages, and repeated URL patterns. State a focus such as signup and settings so the run has a useful starting point.</p></li><li><h3>Read the limits with the results</h3><p>Check which pages and transitions were observed, where access was missing, and whether a limit stopped discovery. An unexplored route is not a passing check.</p></li></ol></div><div class="cg-discovery-config">${codeBlock(JSON.stringify(CARTOGRAPHER_CRAWL_EXAMPLE,null,2),'Project crawl API · example request body')}<p>Send this body to <code>POST /v1/projects/{project_id}/crawls</code> on your configured Cartographer API. Replace the URL and use an existing <code>qa-member</code> profile for that project and origin.</p><a class="text-link" href="${DOCS}">Read the API setup docs ${icon('arrow')}</a></div></div><div class="cg-map-meaning"><div>${icon('map')}<strong>Pages and transitions</strong><span>What the browser reached</span></div>${icon('arrow')}<div>${icon('cursor')}<strong>Controls and actions</strong><span>What it could inspect or use</span></div>${icon('arrow')}<div>${icon('trace')}<strong>Results and limits</strong><span>What passed, failed, or remains unknown</span></div></div></div></section>`;
}

function capabilitySection(){
 return `<section class="section cg-capabilities" id="product-capabilities"><div class="wrap"><div class="cg-section-intro"><div><h2>A generated file still has to pass.</h2></div><p>Keep the browser observation, the assertion, and the replay result separate. That is how you judge whether a generated test belongs in your suite.</p></div><div class="cg-export-path"><article><span>01</span><h3>Capture the flow</h3><p>Use the recorded actions and observed page states to identify what the test should do.</p>${icon('cursor')}</article><article><span>02</span><h3>Inspect the code</h3><p>Review the selected elements, setup, and assertions. A click is not proof of the expected result.</p>${icon('code')}</article><article><span>03</span><h3>Replay from a clean start</h3><p>Run the generated test with fresh fixtures. Check the actual assertion results and retained artifacts.</p>${icon('replay')}</article><article><span>04</span><h3>Add it to your suite</h3><p>Review the verified test in your repository and configure when it should run.</p>${icon('branch')}</article></div><div class="cg-export-example"><div><h3>Make the assertion name the bug.</h3><p>“The receipt appeared” would miss this example’s price error. Check the receipt total against the amount the customer selected.</p>${codeBlock("await expect(page.getByTestId('receipt-total'))\n  .toHaveText('$24.00');",'Illustrative Playwright assertion')}</div><aside class="cg-export-status"><h3>Generated tests are in beta.</h3><p>Export, clean replay, and repository delivery depend on your environment and are still being validated. A completed browser task does not by itself mean its generated test is ready.</p><a class="text-link" href="/contact">Discuss test export for your app ${icon('arrow')}</a></aside></div><div class="cg-codegen-comparison"><h3>Already using Playwright codegen?</h3><p>Codegen records your browser interactions and can generate visibility, text, and value assertions. Cartographer adds goal-driven exploration and a map of the routes it observes. Keep existing tests and review new generated tests alongside them.</p><a href="https://playwright.dev/docs/codegen">How Playwright codegen works ${icon('arrow')}</a></div></div></section>`;
}

function toolsAndFindings(){
 return `<section class="section cg-tools-section"><div class="wrap"><div class="cg-section-intro"><div><h2>Start from your terminal.<br>Bring the result to your team.</h2></div><p>Explore routes, run a specific task, or verify a page state. Choose the command that matches the job.</p></div><div class="cg-command-list">${[['explore','Explore signup and settings','Preview exploration prioritizes the named flows. Preview output is not a verified test export.'],['run','Complete a browser task','Use a configured test account and a local app for a workflow that may change state.'],['verify','Check what is on a page','Check a claim against the URL without asking for a state-changing workflow.']].map(([key,title,note])=>`<article><div><h3>${title}</h3><p>${note}</p></div>${codeBlock(CARTOGRAPHER_COMMANDS[key],`Molar CLI · ${key}`)}</article>`).join('')}</div><div class="cg-tools-links"><p>Examples require the configured Molar CLI and access to your target. The preview URL is a placeholder; replace it with your own.</p><a class="text-link" href="https://mcp.molar.it/">Connect your coding agent through MCP ${icon('arrow')}</a></div>
 <div class="cg-findings"><div><h2>Look beyond the broken click.</h2><p>During beta setup, configure the additional checks you want on visited pages. Review the reported issue and its page context.</p></div><div class="cg-finding-list"><article>${icon('users')}<div><h3>Accessibility findings</h3><p>Automated rules can flag issues such as missing form labels. They support accessibility work; they do not replace a complete audit.</p></div></article><article>${icon('layers')}<div><h3>Visual changes</h3><p>Compare captured pages with a configured baseline to inspect layout or appearance changes.</p></div></article><article>${icon('search')}<div><h3>Additional visual review</h3><p>Optional sampled checks can flag potential UI problems for review. Sampling and its budget limit what gets examined.</p></div></article></div></div>
 <div class="cg-product-handoff"><h2>Use the map in your wider QA workflow.</h2><div><a href="/products/clones">${icon('layers')}<span><strong>Clones supplies the test services</strong><small>Configure payments, email, and sign-in before running the flow.</small></span>${icon('arrow')}</a><a href="/products/guard">${icon('shield')}<span><strong>Guard runs configured release checks</strong><small>Choose the reviewed scenarios, environment, and trigger.</small></span>${icon('arrow')}</a><a href="/products/trace">${icon('trace')}<span><strong>Trace helps investigate a failure</strong><small>Inspect the browser steps and artifacts captured for the run.</small></span>${icon('arrow')}</a></div></div>
 </div></section>`;
}

function recordingSection(){
  return `<section class="section cg-recording" aria-labelledby="cg-recording-title"><div class="wrap"><div class="cg-recording-grid"><div><h2 id="cg-recording-title">Watch Molar complete a real browser task.</h2><p>This recording is an actual controlled public browser check: four observed actions, a final screenshot, and a result record. Watch it add an element, confirm it appeared, remove it, and check its absence. This recording is separate from the illustrated route map above.</p><a class="text-link" href="/examples/autonomous-browser-check">Open the recorded run details ${icon('arrow')}</a></div><figure class="cg-video-figure"><div class="cg-video-frame"><video controls preload="none" playsinline width="1280" height="720" poster="/assets/browser-check/final.jpg"><source src="/assets/browser-check/video.webm" type="video/webm" />Your browser does not support video playback.</video></div><figcaption><strong>Controlled public check</strong><span>Actual capture · final state</span></figcaption></figure></div><ol class="cg-observed-actions"><li><b>01</b><span>Add the element</span></li><li><b>02</b><span>Check it appeared</span></li><li><b>03</b><span>Remove the element</span></li><li><b>04</b><span>Check it is gone</span></li></ol></div></section>`;
}

export const cartographerFaqs = [
  {q:'What should I give Cartographer first?',a:'Give it an authorized URL and one concrete goal, such as reaching a dashboard after email verification or showing an order receipt after checkout.'},
  {q:'Can Cartographer run against localhost?',a:'Yes. Local browser verification is a supported path. Hosted runs use the target and credentials you configure.'},
  {q:'What does the route map represent?',a:'It represents pages and transitions observed during an exploration or task. Select a route to inspect its browser actions, expected result, and illustrative assertion.'},
  {q:'Can I use a logged-in test account?',a:'Use an authorized saved profile or credential reference for the application. Saved sign-in state stays tied to the website it belongs to.'},
  {q:'What is the difference between molar run and molar verify?',a:'molar run starts a goal-directed browser task and may change state. molar verify checks a claim against a URL or prior task result and is intended for read-only verification.'},
  {q:'Can I keep my Playwright suite?',a:'Yes. Keep existing Playwright tests alongside Cartographer checks. Generated export and clean replay are being validated in beta for the environments that support them.'},
  {q:'Does reaching a page mean the flow passed?',a:'No. A discovered page or a completed click is not an assertion. Check that the requested result was observed, and review blocked or unvisited branches separately.'},
  {q:'Can I record a flow with the browser extension?',a:'Recording support is being developed and validated in beta. Ask the team about your browser and authentication setup; it is not yet offered as a universal self-serve record-and-replay workflow.'},
  {q:'What happens when access or setup blocks a run?',a:'The run can return a blocked status with the available task, Trace, screenshot, and artifact references. Review the missing access or input before trying again.'}
];

export function cartographerStory(){
  return {body:`${mapWorkbench()}${runInspector()}${setupSection()}${capabilitySection()}${toolsAndFindings()}${recordingSection()}`,faqs:cartographerFaqs};
}
