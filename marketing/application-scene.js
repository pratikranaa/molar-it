// The example is deterministic; it never submits a real payment or starts a hosted run.
export function sceneFrame(mode, step, delayed=false) {
 const phase=Math.max(0,Math.min(3,step));
 if(mode==='platform') return [
  {first:'Looking for September',second:'Waiting for invoice',result:'Molar opens the billing page.',description:'Find the document that matches your request.',agent:'Open billing',action:'Find September invoice',outcome:'working',evidence:['Not checked yet','Not checked yet','Not checked yet']},
  {first:'September found',second:'Ready to download',result:'The right invoice. Not just the first link.',description:'Molar checks the month and opens the matching document.',agent:'Read invoice',action:'Download invoice',outcome:'working',evidence:['September invoice found','PDF link found','Download pending']},
  {first:'September found',second:'Invoice downloaded',result:'Your invoice is ready.',description:'The browser task returns a file you can use.',agent:'Check file',action:'Check downloaded file',outcome:'passed',evidence:['September invoice found','PDF downloaded','File available']},
  {first:'September found',second:'Invoice downloaded',result:'A finished task, with the evidence attached.',description:'See the browser steps and the downloaded document together.',agent:'Task complete',action:'Run it again',outcome:'passed',evidence:['September invoice found','PDF downloaded','File verified']}
 ][phase];
 const paid=phase>0, callback=phase>1, complete=phase>2, failed=callback&&delayed;
 return {
  first:paid?'Payment succeeded':'Ready to charge',
  second:callback?(delayed?'Delivery delayed':'Delivered to the app'):'Waiting for payment',
  result:failed?'Payment received. Upgrade missing.':complete?'The payment works. So does the upgrade.':callback?'The app received the payment update.':paid?'The payment passed. There’s more to check.':'Molar starts where your customer does.',
  description:failed?'Molar catches the gap between a successful charge and the access your customer gets.':complete?'Payment, webhook and account access checked together.':callback?'Now check that the customer can use the plan they paid for.':paid?'A successful charge does not prove the account was upgraded.':'Follow the customer from checkout to their new plan.',
  agent:failed?'Gap found':complete?'Check complete':callback?'Check access':paid?'Follow payment':'Open checkout',
  action:complete?'Run it again':callback?'Check account access':paid?'Follow payment update':'Upgrade workspace',
  outcome:failed?'failed':complete?'passed':'working',
  plan:callback&&!delayed?'Pro':'Free',
  access:callback&&!delayed?'Full access':'Basic access',
  evidence:[paid?'Succeeded':'Not checked yet',callback?(delayed?'Delayed — app not updated':'Delivered'):'Not checked yet',callback?(delayed?'Still on Free':'Upgraded to Pro'):'Not checked yet']
 };
}

if(typeof document!=='undefined') document.querySelectorAll('[data-app-scene]').forEach(root=>{
 const $=s=>root.querySelector(s), mode=root.dataset.appScene;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let step=0, delayed=mode==='qa', userPaused=motion.matches, visible=false, playing=false, timer;
 const canPlay=()=>visible&&!document.hidden&&!userPaused;
 const render=(announce=false)=>{
  const frame=sceneFrame(mode,step,delayed);
  root.dataset.frame=String(step);root.dataset.outcome=frame.outcome;root.dataset.delayed=String(delayed);
  root.querySelectorAll('[data-scene-phase]').forEach((el,i)=>{if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');el.classList.toggle('is-complete',i<step)});
  for(const [key,selector] of Object.entries({first:'[data-scene-first]',second:'[data-scene-second]',result:'[data-scene-result]',description:'[data-scene-description]',agent:'[data-scene-agent]',plan:'[data-scene-plan]',access:'[data-scene-access]'})) if($(selector))$(selector).textContent=frame[key];
  $('[data-scene-advance]').innerHTML=frame.action+' <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  ['first','second','outcome'].forEach((name,i)=>$('[data-evidence-'+name+']').textContent=frame.evidence[i]);
  if(mode==='platform')$('[data-invoice-status]').textContent=step>1?'Downloaded':step?'Selected':'Available';
  $('[data-result-icon]').innerHTML='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(frame.outcome==='passed'?'<path d="m5 12 4 4L19 6"/>':frame.outcome==='failed'?'<path d="M12 5v9m0 4v1"/>':'<path d="m5 3 14 10-7 1-4 7Z"/>')+'</svg>';
  if(announce)$('[data-scene-announcement]').textContent=frame.result+' '+frame.description;
 };
 const player=()=>{
  root.classList.toggle('is-playing',playing);
  $('[data-scene-play]').setAttribute('aria-label',playing?'Pause example':'Play example');
  $('[data-scene-play]').querySelector('span').textContent=playing?'Pause':'Play';
  $('[data-scene-play] svg').innerHTML=playing?'<path d="M8 5v14m8-14v14"/>':'<path d="m8 4 12 8-12 8Z"/>';
 };
 const stop=()=>{clearTimeout(timer);playing=false;player()};
 const schedule=()=>{clearTimeout(timer);if(!canPlay())return;playing=true;player();timer=setTimeout(()=>{step=(step+1)%4;render();schedule()},step===3?6200:3000)};
 $('[data-scene-play]').addEventListener('click',()=>{userPaused=playing;if(userPaused)stop();else schedule()});
 $('[data-scene-replay]').addEventListener('click',()=>{step=0;render(true);userPaused=motion.matches;if(userPaused)stop();else schedule()});
 $('[data-scene-condition]')?.addEventListener('click',event=>{
  delayed=!delayed;event.currentTarget.setAttribute('aria-pressed',String(delayed));
  step=3;userPaused=true;stop();render(true);
 });
 $('[data-scene-advance]').addEventListener('click',()=>{step=(step+1)%4;userPaused=true;stop();render(true)});
 $('.scene-evidence').addEventListener('toggle',event=>{if(event.currentTarget.open){userPaused=true;stop()}});
 // Observe visibility without scroll polling. Clean-room use of the platform API:
 // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(canPlay())schedule();else stop()},{threshold:.15}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(canPlay())schedule();else stop()});
 motion.addEventListener('change',()=>{if(motion.matches){userPaused=true;stop()}});
 render();player();
});
