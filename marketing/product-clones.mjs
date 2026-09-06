import {codeBlock, icon} from './components.mjs';

import {fullCloneCatalog} from './conversion.mjs';

// These exact customer-facing snippets are exercised by scripts/check-clones-examples.mjs.
export const clonesExamples = {
  reset: `import assert from 'node:assert/strict';
import { stripe } from '@molar/clones';

const clone = await stripe.start({ seed: 'checkout' });
try {
  const initial = await clone.listCustomers();
  const before = await clone.snapshot();
  await clone.seedData({
    customers: [{ email: 'buyer@example.test' }]
  });
  assert.ok((await clone.listCustomers()).some(
    customer => customer.email === 'buyer@example.test'
  ));
  await clone.restore(before);
  assert.deepEqual(await clone.listCustomers(), initial);
} finally {
  await clone.stop();
}`,
  failure: `// On an already-started Stripe clone:
await clone.injectError({
  method: 'GET', path: '/v1/customers',
  after: 2, rate: 1, status: 503,
  body: { error: { type: 'api_error',
    message: 'Service unavailable' } }
});
// The first two matching requests succeed.
// Later matching requests return this 503.`,
  clock: `// Move the clone clock forward by five minutes.
await clone.advanceClock('5m');`,
  world: `import { world } from '@molar/clones';

// payment and inbox are started Stripe and Email clones.
// Use the same runId when starting both services.
const services = world.localRegistry([payment, inbox]);
await world.snapshot(services, payment.runId, 'before-checkout');

// Run your checkout test against both services here.

await world.restore(services, payment.runId, 'before-checkout');`
};

const workbench = `<section class="section pc-workbench-section" id="product-demo">
  <div class="wrap">
    <div class="pc-section-intro"><div><h2>See what happens after a payment.</h2><p>Follow one checkout through its payment record, webhook delivery, and resulting account access. This interactive example is local to this page; it is not connected to your app or a live vendor.</p></div></div>
    <div class="pc-workbench" data-clones-example data-clones-state="healthy">
      <div class="pc-workbench-top"><div><span class="pc-terminal-dot"></span><span class="pc-mono">clones / run_checkout / stripe</span></div><span class="pc-chip" data-pc-status>healthy</span></div>
      <div class="pc-workbench-toolbar" aria-label="Interactive example controls">
        <button type="button" data-pc-action="advance">${icon('replay')}<span>Advance 24h</span></button>
        <button type="button" aria-pressed="false" data-pc-action="decline">${icon('card')}<span>Simulate decline</span></button>
        <button type="button" aria-pressed="false" data-pc-action="callback">${icon('bolt')}<span>Break callback</span></button>
        <span class="pc-toolbar-divider"></span>
        <button type="button" data-pc-action="save">Save snapshot</button><button type="button" data-pc-action="restore" disabled>Restore</button><button type="button" data-pc-action="reset">Reset</button>
      </div>
      <div class="pc-workbench-grid">
        <aside class="pc-request-panel"><div class="pc-panel-label">REQUEST STREAM <span data-pc-count>04</span></div><div data-pc-requests>
          <button type="button" class="is-selected" aria-pressed="true" data-pc-request="payment"><span>POST</span><code>/v1/payment_intents</code><em data-pc-payment-code>201 · 22ms</em></button>
          <button type="button" aria-pressed="false" data-pc-request="customer"><span>GET</span><code>/v1/customers/cus_8q2maya</code><em>200 · 9ms</em></button>
          <button type="button" aria-pressed="false" data-pc-request="webhook"><span>POST</span><code>/hooks/stripe</code><em data-pc-webhook-code>200 · 88ms</em></button>
          <button type="button" aria-pressed="false" data-pc-request="order"><span>WRITE</span><code>orders / ord_2b7</code><em data-pc-order-code>created</em></button>
        </div><p class="pc-request-foot">Four events in this run. Select one to inspect its record.</p></aside>
        <section class="pc-record-panel" aria-live="polite"><div class="pc-panel-label"><span data-pc-record-label>PAYMENT INTENT</span><span class="pc-record-id" data-pc-record-id>pi_3f29a1</span></div><div class="pc-record-main"><div class="pc-record-status" data-pc-record-status><span class="pc-status-icon">${icon('check')}</span><span><strong data-pc-record-title>Succeeded</strong><small data-pc-record-subtitle>Amount captured · $24.00 USD</small></span></div><dl class="pc-record-fields" data-pc-fields><div><dt>customer</dt><dd>cus_8q2maya</dd></div><div><dt>payment_method</dt><dd>pm_card_4242</dd></div><div><dt>created_at</dt><dd data-pc-created>14:30:03 UTC</dd></div><div><dt>tenant</dt><dd>run_checkout</dd></div></dl></div><div class="pc-event-trail"><div class="pc-panel-label">DELIVERY TRACE</div><ol data-pc-trail><li class="is-done"><span>01</span><strong>charge.succeeded</strong><em>observed</em></li><li class="is-done"><span>02</span><strong>payment_intent.succeeded</strong><em>signed</em></li><li class="is-done"><span>03</span><strong>order.confirmed</strong><em>received</em></li></ol></div></section>
      </div>
      <div class="pc-workbench-foot"><span class="pc-mono" data-pc-clock>virtual clock · 2026-08-14 14:30 UTC</span><span data-pc-message>Snapshot ready to save before a risky path.</span></div>
    </div>
    <p class="pc-caption">Interactive example · sample Stripe state only · buttons change the local illustration. In this sample, advancing 24h delivers a queued callback retry.</p>
  </div>
</section>`;

const capabilities = `<section class="section pc-controls-section" id="clone-controls"><div class="wrap">
  <div class="pc-section-intro"><div><h2>Choose exactly what goes wrong.</h2><p>A successful API response only tests one path. Make the service slow, return an error, or retry a webhook—and check how your app responds.</p></div></div>
  <div class="pc-control-rows">
    <article class="pc-control-row"><div><h3>Two requests work.<br>The third fails.</h3><p>Choose a method, path, error body, and when the failure starts. Test whether your app retries, explains the problem, and avoids creating a duplicate record.</p><p class="pc-note">You can also inject latency and request-rate limits. Check the resulting app state, not just the response code.</p></div><div class="pc-control-example"><div class="pc-request-sequence" aria-label="Example: two successful requests, followed by a service error"><span>Request 1<strong>200 OK</strong></span><span>Request 2<strong>200 OK</strong></span><span class="pc-sequence-error">Request 3<strong>503 Error</strong></span></div>${codeBlock(clonesExamples.failure,'Stripe clone · failure rule')}</div></article>
    <article class="pc-control-row"><div><h3>Five minutes later.<br>Without a five-minute wait.</h3><p>Advance the service clock to run scheduled behavior. Test supported billing events and delayed delivery while your test is still running.</p><p class="pc-note">This moves the clone’s clock. Your app’s clock and real security credentials keep their own time.</p></div><div class="pc-clock-example"><div class="pc-clock-dial" aria-hidden="true"><svg viewBox="0 0 180 180" fill="none"><circle cx="90" cy="90" r="71"/><path d="M90 12v15M168 90h-15M90 168v-15M12 90h15"/><path class="pc-clock-arc" d="M90 19a71 71 0 0 1 35.5 9.5"/><path class="pc-clock-hand" d="M90 90V37"/><circle class="pc-clock-center" cx="90" cy="90" r="5"/></svg><span>+5m</span></div><div><strong>Advance time. Inspect the change.</strong><p>Records and scheduled events use simulated time.</p>${codeBlock(clonesExamples.clock,'TypeScript SDK · virtual clock')}</div></div></article>
    <article class="pc-control-row"><div><h3>The payment worked.<br>Your webhook handler didn’t.</h3><p>Keep signature verification enabled. Let your test handler return an error, advance the clone clock, and inspect the next delivery attempt. Then check that repeated delivery updates the order only once.</p><a class="text-link" href="#product-demo">Try the callback example ${icon('arrow')}</a></div><figure class="pc-retry-figure"><figcaption>Example · a handler recovers on the third attempt</figcaption><ol><li><span>Payment succeeded</span><strong>Event created</strong></li><li class="pc-retry-failed"><span>Delivery 1 · handler returns 500</span><strong>Immediate retry</strong></li><li class="pc-retry-failed"><span>Delivery 2 · handler returns 500</span><strong>Wait 5s on clone clock</strong></li><li><span>Delivery 3 · handler returns 200</span><strong>Delivered</strong></li></ol><p>Supported Stripe, Twilio, Email, and S3 callbacks have clone-controlled signatures. Configure the callback target and signing secret for your test environment.</p></figure></article>
  </div>
</div></section>`;

const setup = `<section class="section pc-setup-section" id="product-setup"><div class="wrap"><div class="pc-section-intro"><div><h2>Put Clones inside your test suite.</h2><p>Start a service, point your test app at it, and reset its state between scenarios. Keep your existing browser tests and assertions.</p></div></div><div class="pc-setup-grid"><div><h3>Start, change, and restore Stripe</h3>${codeBlock(clonesExamples.reset,'TypeScript SDK · checkout-state.ts')}<p class="pc-note">Use the SDK and local clone binaries supplied during beta setup. The SDK starts a local process and configures its test credentials. This example checks that restoring removes the customer created after the snapshot.</p></div><div class="pc-connect"><h3>Connect the app you’re testing</h3><div class="pc-endpoint-path" aria-label="Your test runs your app, which calls a Clones endpoint"><span>Test runner</span>${icon('arrow')}<span>Your app</span>${icon('arrow')}<strong>Clones</strong></div><ol><li><h4>Set the service endpoint</h4><p>Configure your app’s HTTP client or vendor SDK to call the clone. <code>clone.apiPath('/v1/customers')</code> gives the full, run-specific customer URL, including <code>/t/{runId}</code>.</p></li><li><h4>Use the test credentials and certificate</h4><p>Keep vendor test credentials separate from the run token used for clone controls. For a local SDK-started process, trust the certificate in <code>clone.tlsCAPEM</code> when connecting through your own HTTP client.</p></li><li><h4>Keep each test’s state separate</h4><p>Give concurrent scenarios separate runs. Restore the service snapshot before repeating a scenario, reset your app’s own database separately, and stop local clones in <code>finally</code>.</p></li></ol><p class="pc-note">Your client must support a custom endpoint. The exact configuration differs by SDK; setting an environment variable alone does not redirect its requests.</p></div></div><div class="pc-setup-links"><a href="/docs/clones">Get the setup instructions ${icon('arrow')}</a><a href="/docs/clones/stripe">Check Stripe operations ${icon('arrow')}</a></div></div></section>`;

const snapshots = `<section class="section pc-world-section" id="clone-snapshots"><div class="wrap"><div class="pc-world-head"><h2>Restore the payment.<br>And the receipt.</h2><p>A checkout changes more than one service. Save the selected clones together, exercise your scenario, and restore their saved records before trying the next branch.</p></div><div class="pc-world-layout"><figure class="pc-world-figure"><figcaption>Example · one saved starting point, two service states</figcaption><div class="pc-world-map"><div class="pc-world-save">${icon('replay')}<strong>before-checkout</strong><span>Saved service state</span></div><svg aria-hidden="true" viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M200 0v25Q200 45 175 45H110Q90 45 90 65V100M200 25Q200 45 225 45H290Q310 45 310 65V100"/></svg><div class="pc-world-services"><div>${icon('card')}<strong>Stripe</strong><span>Customer records<br>Payment state</span></div><div>${icon('mail')}<strong>Email</strong><span>Receipt messages<br>Delivery state</span></div></div><div class="pc-world-return"><svg aria-hidden="true" viewBox="0 0 400 70" preserveAspectRatio="none"><path d="M90 0v15Q90 35 110 35H290Q310 35 310 15V0M200 35v35"/></svg><strong>Restore both, then run the next scenario</strong></div></div></figure><div>${codeBlock(clonesExamples.world,'TypeScript SDK · multiple services')}<p class="pc-note">Start both clones with the same <code>runId</code> and register the services you want to include. Local world snapshots stay in the SDK process; use the control-plane snapshot API when you need a stored manifest and a tracked restore job.</p><p class="pc-note">Snapshots restore clone state. They do not rewind your application database, browser, or real vendor account.</p></div></div></div></section>`;

const comparison = `<section class="section pc-comparison-section"><div class="wrap"><div class="pc-section-intro"><div><h2>Choose the right service for the test.</h2><p>Use Clones for repeatable application tests against supported service behavior. Keep provider sandboxes for checking your integration against the provider itself.</p></div></div><div class="pc-approaches"><article><h3>HTTP mocks</h3><p>Good for precise responses and scenarios you define. WireMock also supports stateful scenarios; the distinction is who builds and maintains the service behavior.</p><a href="https://wiremock.org/docs/stateful-behaviour/">WireMock stateful scenarios ${icon('arrow')}</a></article><article><h3>Vendor sandboxes</h3><p>Good for provider-specific API and integration checks. Stripe also offers test clocks for Billing subscriptions and lifecycle webhooks.</p><a href="https://docs.stripe.com/billing/testing/test-clocks">Stripe test clocks ${icon('arrow')}</a></article><article><h3>Molar Clones</h3><p>Use implemented vendor operations with records, failure controls, and snapshots in your test environment. Check the catalog’s coverage before depending on an API path.</p><a href="#clone-catalog">Browse supported operations ${icon('arrow')}</a></article></div><div class="pc-runtime"><div><h3>Run it where your tests run.</h3><p>Start local processes from the SDK, or connect to an existing clone service from CI. Docker files and Helm packaging support self-hosted setup; plan cluster installation with the team.</p><a class="text-link" href="/contact">Discuss your test environment ${icon('arrow')}</a></div><div><h3>Keep real accounts out of the run.</h3><p>The Clones SDK checks known live vendor hosts and credential patterns before sending a request. Keep test credentials in your app too: calls made outside the SDK need their own configuration and network controls.</p><a class="text-link" href="/platform/developer-tools">Use Clones with CLI and MCP ${icon('arrow')}</a></div></div></div></section>`;

export const faqs = [
  {q:'What does a Clones run isolate?',a:'Each run gets tenant-scoped service state, including the records created by your test. Deterministic IDs make repeated local and CI runs easier to compare.'},
  {q:'Can I test a webhook without weakening signature checks?',a:'Yes, supported webhook paths emit vendor-shaped callbacks with clone-controlled signing secrets. Your application can verify the signature and your test can inspect delivery attempts.'},
  {q:'How do I test expiry or renewal without waiting?',a:'Use the virtual clock controls exposed by the clone setup. Advance simulated time to reach supported expiry, delayed delivery, or renewal behavior, then inspect the resulting records.'},
  {q:'What is the difference between reset and restore?',a:'Restore loads a saved snapshot of a run’s records. Reset removes the run state so the clone can return to its initial state. Choose the one your scenario needs.'},
  {q:'Does the catalog implement every vendor API?',a:'No. Five stateful services implement documented operations and state transitions. Another 23 fixture packs provide predefined responses for named API operations. Neither tier implements every vendor API; check the coverage for the paths your app calls.'},
  {q:'Can I run this in CI or offline?',a:'Yes, local clones can run in a CI job. An offline job needs its binaries, SDK, and other dependencies available in advance, and any webhook targets reachable within that environment. Docker and Helm packaging are available for self-hosted setup; confirm the requirements for your cluster during beta onboarding.'},
  {q:'Does a snapshot also reset my app?',a:'No. Snapshots restore the selected clone services. Reset your application database, browser storage, and other test fixtures separately before repeating the scenario.'},
  {q:'Do I need to rewrite my Playwright tests?',a:'You can keep the browser actions and assertions in your suite. Add a fixture that starts the clones, configure your app’s vendor clients to use their endpoints, and restore or stop the clones during cleanup.'},
];

export function clonesStory(){return {body:workbench+capabilities+setup+snapshots+fullCloneCatalog()+comparison,faqs};}
