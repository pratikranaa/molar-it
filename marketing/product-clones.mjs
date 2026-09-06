import {codeBlock, icon} from './components.mjs';

import {fullCloneCatalog} from './conversion.mjs';

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

const setup = `<section class="section pc-setup-section" id="product-setup"><div class="wrap"><div class="pc-section-intro"><div><h2>Connect your test to a service you control.</h2><p>Start a local clone, configure the test endpoint, and inspect the records your app creates. The SDK handles scoped state and reset controls.</p></div></div><div class="pc-setup-grid"><div><h3>Start Stripe locally</h3>${codeBlock('cd /path/to/molar-clones\nMOLAR_CLONE_ADDR=127.0.0.1:8000 \\\nMOLAR_CLONE_ADMIN_ADDR=127.0.0.1:9000 \\\ngo run ./cmd/clones-stripe','Go installed · from your Clones checkout')}<p class="pc-note">Run this command from the Clones source checkout supplied during beta setup. The other service binaries are <code>clones-twilio</code>, <code>clones-email</code>, <code>clones-auth</code>, and <code>clones-s3</code>.</p></div><div><h3>Save and restore test state</h3>${codeBlock("import { stripe } from '@molar/clones';\n\nconst clone = await stripe.start({ seed: 'checkout' });\nconst before = await clone.snapshot();\nawait clone.seedData({\n  customers: [{ email: 'buyer@example.test' }]\n});\nawait clone.restore(before);\nawait clone.stop();",'TypeScript SDK · example test fixture')}<p class="pc-note">Configure your app’s test SDK to use <code>clone.url</code> and the scoped credentials from your setup. This example restores the snapshot, removing the customer created after it.</p></div></div><div class="pc-setup-links"><a href="/docs/clones">Read the Clones setup docs ${icon('arrow')}</a><a href="/docs/clones/stripe">Check Stripe coverage ${icon('arrow')}</a></div></div></section>`;

const lifecycle = `<section class="section pc-lifecycle-section"><div class="wrap"><div class="pc-section-intro"><div><h2>Re-run the same checkout from a clean starting point.</h2><p>Each run owns its records. Save the starting point, exercise a failure, advance time, then restore the same records for a clean retry.</p></div></div><div class="pc-lifecycle" role="list"><article><span>01</span><h3>Seed</h3><p>Create a tenant with deterministic starting data for the service your scenario calls.</p></article><article><span>02</span><h3>Act</h3><p>Run the browser and API flow. Inspect requests, records, signatures, and callback attempts together.</p></article><article><span>03</span><h3>Travel</h3><p>Move the virtual clock to reach expiry, renewal, or delayed delivery without sleeping through a test.</p></article><article><span>04</span><h3>Restore</h3><p>Load the saved snapshot, or reset the run, so the next checkout starts from known records.</p></article></div></div></section>`;

const comparison = `<section class="section pc-comparison-section"><div class="wrap"><div class="pc-section-intro"><div><h2>Use service state when a fixed response isn’t enough.</h2><p>WireMock and MSW are useful for hand-written HTTP responses. Vendor sandboxes are useful for provider-specific checks. Clones keep the service record, clock, callback attempt, and reset path in view.</p></div></div><div class="pc-compare-grid"><a href="/blog/api-mocking-vs-service-clones"><span>Compare approaches</span><strong>API mocks vs service clones ${icon('arrow')}</strong><small>Compare fixed responses, stateful records, and vendor sandboxes.</small></a><a href="/docs/clones"><span>Read the docs</span><strong>Browse service coverage ${icon('arrow')}</strong><small>Review operations, known limits, seeds, and setup before relying on a path.</small></a><a href="/products/guard"><span>Use it in a release check</span><strong>Pair with Guard ${icon('arrow')}</strong><small>Run a browser scenario against the same controlled service process.</small></a></div></div></section>`;

export const faqs = [
  {q:'What does a Clones run isolate?',a:'Each run gets tenant-scoped service state, including the records created by your test. Deterministic IDs make repeated local and CI runs easier to compare.'},
  {q:'Can I test a webhook without weakening signature checks?',a:'Yes, supported webhook paths emit vendor-shaped callbacks with clone-controlled signing secrets. Your application can verify the signature and your test can inspect delivery attempts.'},
  {q:'How do I test expiry or renewal without waiting?',a:'Use the virtual clock controls exposed by the clone setup. Advance simulated time to reach supported expiry, delayed delivery, or renewal behavior, then inspect the resulting records.'},
  {q:'What is the difference between reset and restore?',a:'Restore loads a saved snapshot of a run’s records. Reset removes the run state so the clone can return to its initial state. Choose the one your scenario needs.'},
  {q:'Does the catalog implement every vendor API?',a:'No. Five stateful services implement documented operations and state transitions. Another 23 fixture packs provide predefined responses for named API operations. Neither tier implements every vendor API; check the coverage for the paths your app calls.'},
  {q:'Can I run this in CI or offline?',a:'The repository supports local processes, Docker, and on-prem deployment patterns. Configure the clone endpoint inside the test environment and keep live vendor credentials out of the run.'},
];

export function clonesStory(){return {body:workbench+setup+lifecycle+fullCloneCatalog()+comparison,faqs};}
