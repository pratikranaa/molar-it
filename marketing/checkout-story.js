// Authored product example. All state stays in this page; no app or vendor requests.
export const checkoutChapters=['Create account','Verify email','Make payment','Follow callback','Check access','Inspect result'];
export const checkoutConditions={callback:'Callback fails',decline:'Card is declined',working:'Working checkout'};
export function checkoutFrame(phase=5,condition='callback'){
 const step=Math.max(0,Math.min(5,Math.trunc(phase)));
 const mode=Object.hasOwn(checkoutConditions,condition)?condition:'callback';
 const declined=mode==='decline',broken=mode==='callback',paid=step>=2&&!declined,delivered=step>=3&&mode==='working',access=step>=4&&delivered;
 const states=[
  {name:'Account',icon:'lock',value:step>=1?'Verified':'Created',status:step>=1?'pass':'active',phase:0},
  {name:'Email',icon:'mail',value:step>=1?'Link confirmed':'Link sent',status:step>=1?'pass':'active',phase:1},
  {name:'Payment',icon:'card',value:step<2?'Not started':declined?'Declined':'Succeeded',status:step<2?'waiting':declined?'warning':'pass',phase:2},
  {name:'Webhook',icon:'bolt',value:step<3?'Not started':declined?'Not sent':broken?'HTTP 500':'Delivered',status:step<3||declined?'waiting':broken?'fail':'pass',phase:3},
  {name:'App access',icon:'users',value:step<4?'Not checked':access?'Pro unlocked':declined?'Free, as expected':'Still on Free',status:step<4?'waiting':access||declined?'pass':'fail',phase:4},
 ];
 const titles=['Create a workspace.','Confirm the account belongs to Sam.','Check the payment result.',declined?'A declined payment sends no success callback.':'Follow the payment update into the app.',declined?'Check that a declined card grants no access.':'Check what the customer can actually use.',broken?'Found: payment passed, access failed.':declined?'Passed: the declined card is handled correctly.':'Passed: the paid customer has Pro access.'];
 const descriptions=['Sam starts with a new account and no paid features.','The verification link must open the same account that requested it.',declined?'The app shows a clear error. No payment was captured.':'A successful payment is only one part of the check.',declined?'The test should not expect an account upgrade.':broken?'The app returned an error when the payment provider sent its update.':'The app received the update and changed the account plan.',declined?'The account stays on Free, with a clear way to try another card.':access?'The account opens the features the customer paid for.':'The account is still on Free, even though the payment succeeded.',broken?'The account-update request is the first failure. The access check confirms the customer impact.':declined?'No charge, no paid access, and a visible payment error. The failure case behaves as expected.':'Email, payment, callback and account access all match the expected result.'];
 const events=[
  ['POST /api/signup','201',{account:'sam@example.test',verified:false}],
  ['POST /api/verify-email','200',{account:'sam@example.test',verified:true}],
  ['POST /api/payments',declined?'402':'200',declined?{error:'card_declined',charged:false}:{payment:'pay_example',status:'succeeded'}],
  [declined?'Payment callback':'POST /api/webhooks/payment',declined?'Not sent':broken?'500':'200',declined?{reason:'No successful payment'}:broken?{error:'account_update_failed',payment:'pay_example'}:{received:true,plan:'pro'}],
  ['GET /api/account','200',{plan:access?'pro':'free',access:access?'team_features':'basic'}],
 ];
 const event=events[step===5?(broken?3:4):step];
 return {step,condition:mode,paid,declined,delivered,access,services:states,title:titles[step],description:descriptions[step],request:event[0],status:event[1],payload:event[2],result:step<5?'in-progress':broken?'failed':'passed',screen:step===0?'signup':step===1?'email':step===2?'payment':step===3?'receipt':'workspace'};
}
export function checkoutScreen(frame){
 const field=(name,value)=>`<div class="fs-field"><span>${name}</span><strong>${value}</strong></div>`;
 const action=label=>`<div class="fs-app-action">${label}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></div>`;
 if(frame.screen==='signup')return `<div class="fs-app-content fs-form"><h3>Your next project<br>starts here.</h3><p>Create your Northstar workspace.</p>${field('Work email','sam@example.test')}${field('Workspace','Sam’s studio')}${action('Create workspace')}<span class="fs-app-note">Email verification comes next.</span></div>`;
 if(frame.screen==='email')return `<div class="fs-app-content"><div class="fs-mail-envelope"><svg viewBox="0 0 80 60" aria-hidden="true"><rect x="5" y="9" width="70" height="44" rx="5"/><path d="m5 12 35 25 35-25M5 51l22-21m48 21L53 30"/></svg></div><h3>One link.<br>The right account.</h3><div class="fs-mail"><span>Northstar <small>to sam@example.test</small></span><strong>Verify your workspace</strong><p>Your account is ready. Confirm your email to continue.</p>${action('Verify email')}</div></div>`;
 if(frame.screen==='payment')return `<div class="fs-app-content"><div class="fs-plan-line"><h3>Make room<br>for the team.</h3><span>Pro plan<strong>$24</strong><small>Example app price</small></span></div><div class="fs-credit-card"><span>Northstar / Pro</span><strong>•••• &nbsp; •••• &nbsp; •••• &nbsp; ${frame.declined?'0002':'4242'}</strong><span>Sam’s studio <small>TEST CARD</small></span></div><div class="fs-payment-message ${frame.declined?'is-fail':'is-pass'}">${frame.declined?'Card declined. Try another payment method.':'Payment confirmed. Your receipt is ready.'}</div><p class="fs-app-note">${frame.declined?'No charge was made.':'Next: check that Pro access is available.'}</p></div>`;
 if(frame.screen==='receipt')return `<div class="fs-app-content"><div class="fs-receipt-symbol ${frame.declined?'is-fail':''}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${frame.declined?'m6 6 12 12M6 18 18 6':'m5 12 4 4L19 6'}"/></svg></div><h3>${frame.declined?'Payment didn’t<br>go through.':'Thanks, Sam.<br>Payment received.'}</h3><p>${frame.declined?'Your card was not charged.':'We’re preparing your Pro workspace.'}</p><div class="fs-receipt-row"><span>Payment</span><strong>${frame.declined?'Declined':'$24.00 · paid'}</strong></div><div class="fs-receipt-row"><span>Account upgrade</span><strong>${frame.declined?'Not requested':frame.delivered?'Ready':'Waiting for update'}</strong></div><div class="fs-app-action fs-action-muted">${frame.declined?'Try another card':'Open workspace'}</div></div>`;
 return `<div class="fs-app-content"><div class="fs-workspace-title"><h3>Sam’s studio</h3><span class="fs-plan-tag ${frame.access?'is-pro':''}">${frame.access?'Pro':'Free'}</span></div><p>Your team’s next big thing.</p><div class="fs-project"><div class="fs-project-art" aria-hidden="true"><span></span><span></span><span></span></div><strong>Brand launch</strong><span>Shared team project</span></div><div class="fs-access ${frame.access?'is-pass':'is-fail'}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${frame.access?'m5 12 4 4L19 6':'M5 10h14v11H5ZM8 10V7a4 4 0 0 1 8 0v3'}"/></svg><span>${frame.access?'Team features are unlocked.':frame.declined?'Upgrade after a successful payment.':'Upgrade to Pro to open this project.'}</span></div><p class="fs-app-note">${frame.paid&&!frame.access?'Payment received. Account still on Free.':frame.access?'Sam can use the plan they paid for.':'No payment captured. The Free plan is unchanged.'}</p></div>`;
}
export function initCheckoutStory(root){
 let phase=5,condition='callback',playing=false,visible=false,manual=false,started=false,timer;
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),$=selector=>root.querySelector(selector);
 const chapters=[...root.querySelectorAll('[data-story-step]')];
 function render(announce=false){
  const frame=checkoutFrame(phase,condition);
  root.dataset.step=String(phase);root.dataset.condition=condition;root.dataset.result=frame.result;
  $('[data-story-screen]').innerHTML=checkoutScreen(frame);
  $('[data-story-title]').textContent=frame.title;$('[data-story-description]').textContent=frame.description;
  $('[data-story-request]').textContent=frame.request;$('[data-story-http]').textContent=frame.status;
  $('[data-story-json]').textContent=JSON.stringify(frame.payload,null,2);
  $('[data-story-count]').textContent=`${phase+1} / ${checkoutChapters.length}`;
  $('[data-story-panel]').setAttribute('aria-labelledby','checkout-step-'+phase);
  chapters.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===phase));button.tabIndex=i===phase?0:-1;button.classList.toggle('is-complete',i<phase);});
  root.querySelectorAll('[data-story-condition]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.storyCondition===condition)));
  frame.services.forEach((service,i)=>{const node=$(`[data-story-service="${i}"]`);node.dataset.status=service.status;node.classList.toggle('is-current',phase===service.phase);node.querySelector('strong').textContent=service.value;});
  if(announce)$('[data-story-announcement]').textContent=frame.title+' '+frame.description;
  player();
 }
 function player(){root.classList.toggle('is-playing',playing);$('[data-story-play]').setAttribute('aria-pressed',String(playing));$('[data-story-play]').querySelector('span').textContent=playing?'Pause':phase===5?'Replay':'Play';$('[data-story-play] path').setAttribute('d',playing?'M8 5v14m8-14v14':'m8 4 12 8-12 8Z');}
 function stop(){clearTimeout(timer);playing=false;player();}
 function tick(){if(!visible||document.hidden){stop();return;}if(phase===5){stop();return;}phase++;render();timer=setTimeout(tick,phase===4?3400:2900);}
 function start(){if(phase===5)phase=0;render();playing=true;player();clearTimeout(timer);timer=setTimeout(tick,2900);}
 $('[data-story-play]').addEventListener('click',()=>{manual=true;playing?stop():start();});
 $('[data-story-restart]').addEventListener('click',()=>{manual=true;stop();phase=0;render(true);if(!motion.matches)start();});
 chapters.forEach((button,i)=>{
  button.addEventListener('click',()=>{manual=true;stop();phase=i;render(true);});
  button.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?(i+1)%6:event.key==='ArrowLeft'?(i+5)%6:event.key==='Home'?0:event.key==='End'?5:null;if(next!==null){event.preventDefault();chapters[next].click();chapters[next].focus();}});
 });
 root.querySelectorAll('[data-story-condition]').forEach(button=>button.addEventListener('click',()=>{manual=true;stop();condition=button.dataset.storyCondition;phase=5;render(true);}));
 $('[data-story-details]').addEventListener('toggle',event=>{if(event.currentTarget.open){manual=true;stop();}});
 // Native visibility/reduced-motion signals; no frame polling or offscreen animation.
 // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.22;if(!visible)stop();else if(!started&&!manual&&!motion.matches&&!document.hidden){started=true;phase=0;start();}},{threshold:.22}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 motion.addEventListener('change',()=>{if(motion.matches){manual=true;stop();}});
 render();player();
}
if(typeof document!=='undefined')document.querySelectorAll('[data-checkout-story]').forEach(initCheckoutStory);
