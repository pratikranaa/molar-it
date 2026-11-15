import {icon} from './components.mjs';

function workbenchScene(mode) {
 const platform=mode==='platform';
 const phases=platform?['Open billing','Find invoice','Download','Check file']:['Open checkout','Pay','Follow webhook','Check access'];
 return `<div class="app-scene" id="interactive-demo" data-app-scene="${mode}" data-frame="0" data-outcome="working">
  <div class="scene-heading"><div class="scene-goal">${icon('cursor')}<strong>${platform?'Find September’s invoice and download the PDF.':'Buy a plan. Make sure the customer gets access.'}</strong></div><div class="scene-playback"><span>Interactive example</span><button class="scene-play" data-scene-play aria-label="Pause example">${icon('pause')}<span>Pause</span></button><button class="scene-replay" data-scene-replay aria-label="Replay example">${icon('replay')}</button></div></div>
  <div class="application-stage">
   <div class="scene-browser">
    <div class="scene-browser-top"><span class="scene-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>northstar.test / ${platform?'invoices':'billing'}</span>${icon('lock')}</div>
    <div class="scene-browser-content">
     <div class="scene-workspace"><span class="northstar-symbol">${icon('layers')}</span><div><strong>Northstar</strong><span>${platform?'Invoices':'Workspace billing'}</span></div><span class="scene-user">Sam’s workspace</span></div>
     ${platform?`<div class="scene-invoice-heading"><strong>Invoices</strong><span>Billing history</span></div><div class="scene-invoices"><div data-invoice-row="latest"><span class="scene-file-icon">${icon('file')}</span><span>September invoice<small>Sep 01, 2026 · PDF</small></span><span data-invoice-status>Available</span></div><div><span class="scene-file-icon">${icon('file')}</span><span>August invoice<small>Aug 01, 2026 · PDF</small></span><span>Paid ${icon('check')}</span></div></div><button class="scene-app-action" data-scene-advance>Find September invoice ${icon('arrow')}</button>`:`<div class="scene-plan"><div><span>Your current plan</span><strong data-scene-plan>Free</strong></div><span class="scene-plan-pill" data-scene-access>Basic access</span></div><div class="scene-feature-check"><span>${icon('layers')} Unlimited projects</span><span class="scene-access-lock">${icon('lock')} Pro required</span><span class="scene-access-ready">${icon('check')} Available</span></div><div class="scene-payment-method">${icon('card')} <span>Test card ending in 4242</span><strong>$24 / month</strong></div><button class="scene-app-action" data-scene-advance>Upgrade workspace ${icon('arrow')}</button>`}
    </div>
   </div>
   <svg class="application-tracks" viewBox="0 0 120 300" fill="none" preserveAspectRatio="none" aria-hidden="true"><path class="track-base" d="M0 150H34Q60 150 60 124V45Q60 20 86 20H120M60 105V170Q60 195 86 195H120M60 170V250Q60 275 86 275H120"/><path class="track-active track-first" d="M0 150H34Q60 150 60 124V45Q60 20 86 20H120"/><path class="track-active track-second" d="M60 105V170Q60 195 86 195H120"/><path class="track-active track-return" d="M60 170V250Q60 275 86 275H120"/><circle class="track-origin" cx="2" cy="150" r="4"/></svg>
   <div class="scene-observations"><div class="scene-observer"><span class="scene-agent">${icon('cursor')}</span><strong>Molar is checking</strong><span data-scene-agent>Open checkout</span></div>
    <div class="scene-service scene-service-first"><span class="scene-service-icon">${icon(platform?'file':'card')}</span><div><span>${platform?'The requested document':'The payment'}</span><strong data-scene-first>${platform?'Looking for September':'Ready to charge'}</strong></div><i data-first-indicator></i></div>
    <div class="scene-service scene-service-second"><span class="scene-service-icon">${icon(platform?'download':'bolt')}</span><div><span>${platform?'The downloaded file':'The webhook'}</span><strong data-scene-second>${platform?'Waiting for invoice':'Waiting for payment'}</strong></div><i data-second-indicator></i></div>
    <div class="scene-result"><span class="scene-result-symbol" data-result-icon>${icon('cursor')}</span><div><strong data-scene-result>${platform?'Molar opens the billing page.':'Molar starts where your customer does.'}</strong><p data-scene-description>${platform?'Find the document that matches your request.':'A browser, a test account, and a real user goal.'}</p></div></div>
    ${platform?`<a class="scene-result-link" href="/platform/browser-agents">Explore browser tasks ${icon('arrow')}</a>`:`<button class="scene-condition" data-scene-condition aria-pressed="true"><span class="scene-switch" aria-hidden="true"></span><span>Delay the webhook</span><small>Try changing this</small></button>`}
   </div>
  </div>
  <div class="scene-bottom"><ol class="scene-timeline" aria-label="Example progress">${phases.map((p,i)=>`<li data-scene-phase="${i}"${i===0?' aria-current="step"':''}><span>${i+1}</span>${p}</li>`).join('')}</ol><details class="scene-evidence"><summary>Inspect result ${icon('arrow')}</summary><div><dl><div><dt>${platform?'Request':'Payment'}</dt><dd data-evidence-first>Not checked yet</dd></div><div><dt>${platform?'File':'Webhook'}</dt><dd data-evidence-second>Not checked yet</dd></div><div><dt>${platform?'Outcome':'Account access'}</dt><dd data-evidence-outcome>Not checked yet</dd></div></dl><a href="/products/trace">Explore Trace ${icon('arrow')}</a></div></details></div>
  <span class="sr-only" role="status" data-scene-announcement></span>
 </div>`;
}

// The QA hero: one checkout, followed through every system it touches. The browser on the left moves through
// the customer's screens; the chain on the right is what Molar observed at each hop. With the webhook delayed,
// the chain breaks before "Account access" and the browser shows the plan that never changed.
function checkoutChain() {
 const node=(key,iconName,label,line)=>`<li class="chain-node" data-chain-node="${key}"><span class="chain-dot" aria-hidden="true">${icon(iconName)}</span><div class="chain-copy"><span>${label}</span><strong data-chain-state="${key}">Not checked yet</strong><code data-chain-event="${key}">${line}</code></div></li>`;
 return `<div class="app-scene checkout-chain" id="interactive-demo" data-app-scene="qa" data-frame="0" data-outcome="working">
  <div class="scene-heading"><div class="scene-goal">${icon('cursor')}<strong>Buy a plan. Make sure the customer gets access.</strong></div><div class="chain-condition"><span>Webhook</span><button class="chain-switch" type="button" data-scene-condition aria-pressed="true" aria-label="Webhook delayed. Switch to on time"><span class="chain-switch-thumb" aria-hidden="true"></span><span class="chain-switch-option">On time</span><span class="chain-switch-option">Delayed</span></button></div><div class="scene-playback"><span>Interactive example</span><button class="scene-play" data-scene-play aria-label="Pause example">${icon('pause')}<span>Pause</span></button><button class="scene-replay" data-scene-replay aria-label="Replay example">${icon('replay')}</button></div></div>
  <div class="chain-stage">
   <div class="chain-browser" aria-label="The customer’s browser">
    <div class="chain-browser-bar"><span class="scene-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="chain-address">${icon('lock')}<span data-scene-url>northstar.test/billing</span></span><span class="chain-tab" data-scene-tab>Northstar</span></div>
    <div class="chain-viewport">
     <section class="chain-screen" data-screen="billing" aria-hidden="false">
      <div class="nb-head"><span class="northstar-symbol">${icon('layers')}</span><strong>Northstar</strong><span class="nb-user">Sam’s workspace</span></div>
      <div class="nb-plan"><div><span>Current plan</span><strong data-scene-plan>Free</strong></div><span class="nb-badge" data-scene-access>Basic access</span></div>
      <div class="nb-offer"><div class="nb-offer-head"><strong>Pro</strong><span><b>$24</b> / month</span></div><ul><li class="nb-feature" data-feature>${icon('lock')}<span>Unlimited projects</span><em class="nb-locked">Pro required</em><em class="nb-open">${icon('check')} Available</em></li><li>${icon('users')}<span>Up to 25 members</span></li></ul></div>
      <div class="nb-flag" aria-hidden="true">${icon('x')}<span>Charged $24. Still on Free.</span></div>
     </section>
     <section class="chain-screen" data-screen="checkout" aria-hidden="true">
      <div class="co-head"><span>Checkout</span><span class="co-test">Test mode</span></div>
      <div class="co-line"><span>Northstar Pro, monthly</span><strong>$24.00</strong></div>
      <div class="co-card">${icon('card')}<span>•••• 4242</span><small>12 / 34</small></div>
      <div class="co-paid">${icon('check')}<span>Payment succeeded</span></div>
     </section>
     <section class="chain-screen" data-screen="return" aria-hidden="true">
      <span class="rt-mark">${icon('check')}</span>
      <strong>Thanks, Sam. Your payment went through.</strong>
      <p class="rt-waiting"><i aria-hidden="true"></i>Updating your workspace</p>
      <p class="rt-ready">${icon('check')} Pro is active</p>
     </section>
     <button class="chain-action" data-scene-advance>Upgrade to Pro ${icon('arrow')}</button>
     <span class="chain-cursor" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 3l14 10-6.5 1.2L9 21z"/></svg><i></i></span>
    </div>
   </div>
   <div class="chain-observed">
    <div class="scene-observer"><span class="scene-agent">${icon('cursor')}</span><strong>What Molar observed</strong><span data-scene-agent>Open checkout</span></div>
    <ol class="chain-track">
     ${node('customer','cursor','Customer','click “Upgrade to Pro”')}
     ${node('payment','card','Payment','charge.succeeded  $24.00')}
     ${node('webhook','bolt','Webhook','POST /api/billing/webhook')}
     ${node('access','lock','Account access','GET /billing  plan=?')}
    </ol>
    <div class="scene-result"><span class="scene-result-symbol" data-result-icon>${icon('cursor')}</span><div><strong data-scene-result>Molar starts where your customer does.</strong></div></div>
   </div>
  </div>
  <span class="sr-only" role="status" data-scene-announcement></span>
 </div>`;
}

export function applicationScene(mode='qa') {
 return mode==='platform'?workbenchScene(mode):checkoutChain();
}
