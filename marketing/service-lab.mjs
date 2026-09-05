import {icon} from './components.mjs';

const serviceTabs = [
  ['payments', 'Payments', 'card'],
  ['email', 'Email', 'mail'],
  ['sms', 'SMS', 'bolt'],
  ['signin', 'Sign-in', 'lock'],
  ['storage', 'Storage', 'file']
];

export function serviceLab() {
  return `<section class="service-lab section" data-service-lab aria-labelledby="service-lab-title">
  <div class="wrap">
    <div class="service-lab-heading">
      <h2 id="service-lab-title">Make the hard cases easy to test.</h2>
      <p>A declined card. A wrong code. An interrupted upload. See what your app should do when a service behaves differently.</p>
    </div>
    <div class="service-lab-workbench">
      <div class="service-lab-tabs" role="tablist" aria-label="Choose a service clone">
        ${serviceTabs.map(([key, label, iconName], index) => `<button class="service-lab-tab" type="button" role="tab" id="service-lab-tab-${key}" aria-selected="${index === 0}" aria-controls="service-lab-surface" tabindex="${index === 0 ? 0 : -1}" data-service-tab="${key}">${icon(iconName)}<span>${label}</span></button>`).join('')}
      </div>
      <div class="service-lab-columns">
        <aside class="service-lab-controls" aria-label="Interactive example controls">
          <div class="service-lab-example-label"><span>Interactive example</span></div>
          <p class="service-lab-narrative" data-service-narrative>Check that a successful payment becomes a confirmed order.</p>
          <div class="service-lab-condition">
            <span class="service-lab-condition-label">Set the condition</span>
            <button class="service-lab-toggle" type="button" aria-pressed="false" data-service-condition>
              <span class="service-lab-toggle-knob" aria-hidden="true"></span>
              <span data-service-condition-action>Decline the payment</span>
            </button>
            <p data-service-condition-copy>Payment clone returns a successful charge and the app receives its callback.</p>
          </div>
          <div class="service-lab-route" aria-hidden="true"><span></span><span></span><span></span></div>
          <p class="service-lab-footnote">Molar checks the browser step, service state, and customer-facing outcome together.</p>
        </aside>
        <div class="service-lab-surface-wrap">
          <div class="service-lab-surface" id="service-lab-surface" role="tabpanel" aria-labelledby="service-lab-tab-payments" data-service-surface>
            <div class="service-lab-surface-top"><span>northstar.test / checkout</span></div>
            <div class="service-lab-payment-view">
              <div class="service-lab-browser-card">
                <div class="service-lab-browser-title"><span class="service-lab-browser-mark">N</span><span><strong>Northstar Pro</strong><small>Monthly workspace plan</small></span><strong>$24</strong></div>
                <div class="service-lab-field-row"><span>Card ending</span><strong>4242</strong></div>
                <div class="service-lab-field-row"><span>Billing email</span><strong>maya@example.com</strong></div>
                <div class="service-lab-payment-state" data-surface-status>${icon('check')}<span><strong>Payment succeeded</strong><small>Receipt and order callback received</small></span></div>
              </div>
              <div class="service-lab-event-card"><span class="service-lab-event-label">Payment clone</span><code data-surface-code>payment_intent.succeeded</code><span class="service-lab-event-state" data-surface-event-state>${icon('check')} observed</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="service-lab-result" data-service-result>
        <span class="service-lab-result-icon" data-service-result-icon>${icon('check')}</span>
        <div><span class="service-lab-result-label">Observed result</span><strong data-service-result-title>Payment, callback, and order confirmation agree.</strong><p data-service-result-copy>The customer gets access because the test followed the state change all the way through.</p></div>
      </div>
    </div>
    <p class="service-lab-disclaimer">Explore the examples, then <a href="/products/clones">set up Clones for your own app</a>.</p>
    <span class="service-lab-announcement" role="status" aria-live="polite" data-service-announcement></span>
  </div>
</section>`;
}
