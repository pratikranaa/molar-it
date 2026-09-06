// Authored sample data for the marketing debugger. It never calls a product API.
export const traceSteps = [
  {label:'Open billing',time:'0.0s',action:'Open the workspace billing page',request:'GET /api/account',status:200,body:{plan:'free',access:false},console:'Billing page loaded.',payment:'Not created',delivery:'Not sent',plan:'Free'},
  {label:'Confirm payment',time:'1.8s',action:'Confirm the Pro plan purchase',request:'POST /api/checkout',status:200,body:{payment:'pay_example',status:'succeeded'},console:'Payment confirmed. Waiting for account update.',payment:'Succeeded',delivery:'Queued',plan:'Free'},
  {label:'Receive callback',time:'2.4s',action:'Process the payment callback',request:'POST /api/webhooks/payment',status:500,body:{error:'account_update_failed',payment:'pay_example'},console:'Account update failed. Callback will need to be retried.',payment:'Succeeded',delivery:'Failed · HTTP 500',plan:'Free'},
  {label:'Check account access',time:'4.1s',action:'Check that the account can use Pro features',request:'GET /api/account',status:200,body:{plan:'free',access:false},console:'Assertion failed: expected Pro access, received Free.',payment:'Succeeded',delivery:'Failed · HTTP 500',plan:'Free'},
];

export function traceFrame(index,passing=false){
  index=Math.max(0,Math.min(3,index));
  const step=traceSteps[index];
  if(!passing||index<2)return {...step,verdict:index===3?'Failed':'Recorded'};
  return {...step,status:200,body:index===2?{received:true,account_updated:true}:{plan:'pro',access:true},console:index===2?'Payment callback processed. Pro access granted.':'Assertion passed: Pro access is available.',delivery:'Delivered · HTTP 200',plan:'Pro',verdict:index===3?'Passed':'Recorded'};
}

const escapeText=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const json=value=>escapeText(JSON.stringify(value,null,2));
const record=(label,value,changed=false)=>`<div class="pt-field${changed?' is-changed':''}"><dt>${label}</dt><dd>${escapeText(value)}</dd></div>`;

export function tracePanel(index,view='network',passing=false){
  const step=traceFrame(index,passing);
  if(view==='network')return `<div class="pt-request"><span class="pt-status ${step.status>=400?'is-failed':''}">${step.status}</span><code>${step.request}</code></div><p class="pt-panel-label">Response body</p><pre>${json(step.body)}</pre>`;
  if(view==='console')return `<p class="pt-panel-label">Message at ${step.time}</p><div class="pt-console ${!passing&&index>=2?'is-failed':''}"><span>${!passing&&index>=2?'Error':'Info'}</span><p>${step.console}</p></div>`;
  return `<dl class="pt-fields">${record('Payment',step.payment)}${record('Callback',step.delivery,index>=2)}${record('Account plan',step.plan,index>=2)}${record('Pro access',step.plan==='Pro'?'Available':'Unavailable',index>=2)}</dl>`;
}

export function initTraceExample(root){
  let index=3,view='network',compare=false,timer=null,manual=false;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const stepButtons=[...root.querySelectorAll('[data-trace-step]')];
  const viewButtons=[...root.querySelectorAll('[data-trace-view]')];
  const play=root.querySelector('[data-trace-play]');
  const set=(selector,text)=>{root.querySelector(selector).textContent=text;};
  function stop(){clearTimeout(timer);timer=null;play.textContent='Replay example';play.setAttribute('aria-pressed','false');}
  function render(announce=true){
    const step=traceFrame(index);
    stepButtons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.classList.toggle('is-selected',i===index);});
    viewButtons.forEach(button=>{const active=button.dataset.traceView===view;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    root.querySelector('[data-trace-panel]').setAttribute('aria-labelledby','trace-tab-'+view);
    root.querySelector('[data-trace-panel]').innerHTML=tracePanel(index,view);
    root.querySelector('[data-trace-baseline]').innerHTML=tracePanel(index,view,true);
    root.querySelector('[data-trace-compare-panel]').hidden=!compare;
    root.querySelector('[data-trace-compare]').setAttribute('aria-pressed',String(compare));
    set('[data-trace-current-step]',step.action);
    set('[data-trace-screen-title]',index===0?'Workspace billing':index===1?'Payment confirmed':'Your workspace');
    set('[data-trace-screen-message]',index===0?'Choose a plan for your workspace.':index===1?'Your payment was received. We’re updating your account.':'Your account is still on the Free plan.');
    set('[data-trace-finding]',index===0?'The account starts without Pro access.':index===1?'Payment succeeded. Account access is still pending.':index===2?'The payment callback failed while updating the account.':'The payment passed, but the access check failed.');
    set('[data-trace-time]',step.time);
    root.dataset.traceIndex=String(index);
    if(announce)set('[data-trace-announcement]',`${step.label}. ${view} details shown.${compare?' Passing example comparison open.':''}`);
  }
  function tick(){
    if(document.hidden){stop();return;}
    if(index===3){stop();return;}
    index+=1;render(false);timer=setTimeout(tick,1700);
  }
  function start(){stop();index=0;render();play.textContent='Pause example';play.setAttribute('aria-pressed','true');timer=setTimeout(tick,1700);}
  stepButtons.forEach((button,i)=>button.addEventListener('click',()=>{manual=true;stop();index=i;render();}));
  viewButtons.forEach((button,i)=>{
    button.addEventListener('click',()=>{manual=true;stop();view=button.dataset.traceView;render();});
    button.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(i+1)%viewButtons.length;
      else if(event.key==='ArrowLeft')next=(i+viewButtons.length-1)%viewButtons.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=viewButtons.length-1;
      if(next!==undefined){event.preventDefault();viewButtons[next].click();viewButtons[next].focus();}
    });
  });
  root.querySelector('[data-trace-compare]').addEventListener('click',()=>{manual=true;stop();compare=!compare;render();});
  root.querySelector('[data-trace-jump]').addEventListener('click',()=>{manual=true;stop();index=3;render();stepButtons[3].focus();});
  play.addEventListener('click',()=>{manual=true;timer?stop():start();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  motion.addEventListener('change',()=>{if(motion.matches)stop();});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting){stop();return;}
    if(!manual&&!motion.matches){manual=true;start();}
  }),{threshold:.4});
  observer.observe(root);render(false);
}
if(typeof document!=='undefined')document.querySelectorAll('[data-trace-example]').forEach(initTraceExample);
