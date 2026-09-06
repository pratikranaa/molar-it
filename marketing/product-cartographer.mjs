import {DOCS, esc, icon} from './components.mjs';
import {CARTOGRAPHER_ROUTES, CARTOGRAPHER_SCENARIOS} from './product-cartographer.js';

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

function setupSection(){
  return `<section class="section cg-setup" id="product-setup" aria-labelledby="cg-setup-title"><div class="wrap"><div class="cg-section-intro"><div><h2 id="cg-setup-title">Choose the app, task, and test account.</h2></div><p>A useful crawl is specific about where it may go, who it may be, and what “done” looks like. Keep production credentials out of exploratory work.</p></div><div class="cg-setup-grid">
    <article>${icon('globe')}<h3>URL + environment</h3><p>Point to a local, preview, or hosted app you own or are authorized to access. The target determines the routes Cartographer can observe.</p></article>
    <article>${icon('cursor')}<h3>Goal + scope</h3><p>Name a user outcome: “verify email, then reach the workspace.” Add a route or task limit when a broad crawl would create noise.</p></article>
    <article>${icon('lock')}<h3>Credentials + role</h3><p>Use a saved test profile or credential reference tied to that site. A member profile can reveal a protected route an owner account would hide.</p></article>
    <article>${icon('shield')}<h3>Evidence + access</h3><p>Runs can return completed, failed, or cancelled status with task and Trace references, screenshots, and a live view for supported workflows.</p></article>
  </div></div></section>`;
}

function capabilitySection(){
  const runCode='molar run "sign in and reach the dashboard" --url http://localhost:3000 --json';
  const verifyCode='molar verify "the login form is visible" --url http://localhost:3000 --json';
  return `<section class="section cg-capabilities" id="product-capabilities" aria-labelledby="cg-capabilities-title"><div class="wrap"><div class="cg-section-intro"><div><h2 id="cg-capabilities-title">Check what happened after the click.</h2></div><p>Submitting a form is one step. Confirming the right account can open the workspace is the check that makes the test useful.</p></div>
    <div class="cg-action-assertion"><div class="cg-recipe"><span class="cg-recipe-number">A</span><div><h3>Browser action</h3><p>Submit the verification form with the configured test identity.</p></div></div><span class="cg-recipe-arrow">${icon('arrow')}</span><div class="cg-recipe"><span class="cg-recipe-number">B</span><div><h3>Assertion</h3><p>Confirm the browser reached the workspace for that account.</p></div></div><span class="cg-recipe-arrow">${icon('arrow')}</span><div class="cg-recipe cg-recipe-code"><span class="cg-recipe-number">C</span><div><h3>Illustrative test code</h3><code>expect(page).toHaveURL(/workspace/)</code></div></div></div>
    <div class="cg-cli-grid"><article class="cg-cli-card"><h3><code>molar run</code></h3><p>Use a URL and a freeform task when the browser should complete an approved workflow.</p><pre><code>${esc(runCode)}</code></pre></article><article class="cg-cli-card cg-cli-card-light"><h3><code>molar verify</code></h3><p>Use a URL and a claim when you want to check a page state without asking the agent to complete a task.</p><pre><code>${esc(verifyCode)}</code></pre></article></div>
    <div class="cg-reuse"><div><h3>Fit the map into the tests you already review.</h3></div><p>Use Cartographer to discover and inspect a flow, keep the route evidence with the run, and continue using your existing Playwright tests where they are the right home. Generated Playwright export and clean replay are being validated in beta, so treat generated code as an illustrative starting point until your own environment proves it.</p><a class="text-link" href="${DOCS}">Read the Cartographer docs ${icon('arrow')}</a></div>
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
  {q:'What happens when access or setup blocks a run?',a:'The run can return a blocked status with the available task, Trace, screenshot, and artifact references. Review the missing access or input before trying again.'}
];

export function cartographerStory(){
  return {body:`${mapWorkbench()}${setupSection()}${capabilitySection()}${recordingSection()}`,faqs:cartographerFaqs};
}
