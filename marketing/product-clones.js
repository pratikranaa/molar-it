const mark = ok => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="${ok?'m5 12 4 4L19 6':'m6 6 12 12M6 18 18 6'}"/></svg>`;

export const initialClonesState = Object.freeze({day:0,payment:'succeeded',callback:'delivered',attempts:1,order:'confirmed',access:'granted',selected:'payment',snapshot:null,message:'Snapshot ready to save before a risky path.'});

export function reduceClonesState(state, action){
  const next={...state};
  if(action==='advance'){
    next.day+=1;
    if(next.payment==='succeeded'&&next.callback==='failed'){next.callback='delivered';next.attempts=3;next.order='confirmed';next.access='granted';next.message='24 hours advanced; the queued callback delivered on attempt 03.';}
    else next.message=next.payment==='declined'?'24 hours advanced; the callback remains blocked by the declined payment.':'Virtual clock advanced 24 hours.';
  }
  if(action==='decline'){
    if(next.payment==='declined'){next.payment='succeeded';next.callback='delivered';next.attempts=1;next.order='confirmed';next.access='granted';next.message='Payment returned to the seeded success path.';}
    else {next.payment='declined';next.callback='blocked';next.attempts=0;next.order='not_created';next.access='held';next.message='Payment declined; callback is blocked and access stays held.';}
  }
  if(action==='callback'&&next.payment!=='declined'){
    if(next.callback==='failed'){next.callback='delivered';next.attempts=3;next.order='confirmed';next.access='granted';next.message='Queued callback delivered on attempt 03.';}
    else {next.callback='failed';next.attempts=2;next.order='pending';next.access='held';next.message='Callback failed; retry is queued for the next clock advance.';}
  }
  if(action==='save') next.snapshot={day:next.day,payment:next.payment,callback:next.callback,attempts:next.attempts,order:next.order,access:next.access,selected:next.selected};
  if(action==='restore'&&next.snapshot){Object.assign(next,next.snapshot);next.message='Saved records restored from the snapshot.';}
  if(action==='reset'){Object.assign(next,initialClonesState);next.snapshot=null;}
  if(action.startsWith('select:')) next.selected=action.slice(7);
  if(action==='save') next.message='Snapshot saved at this point in the run.';
  if(action==='callback'&&next.payment==='declined') next.message='Payment decline blocks callback delivery in this sample.';
  return next;
}

export function clonesRecordFrame(state){
  const declined=state.payment==='declined', failed=state.callback==='failed';
  const frames={
    payment:{label:'PAYMENT INTENT',id:'pi_3f29a1',title:declined?'Declined':failed?'Captured · awaiting callback':'Succeeded',subtitle:declined?'Payment method refused · no order created':failed?'Amount captured · callback retry queued':'Amount captured · $24.00 USD',fields:[['customer','cus_8q2maya'],['payment_method','pm_card_4242'],['created_at','14:30:03 UTC'],['tenant','run_checkout']]},
    customer:{label:'CUSTOMER',id:'cus_8q2maya',title:'Active',subtitle:'maya@example.com · checkout buyer',fields:[['email','maya@example.com'],['created_at','14:29:58 UTC'],['livemode','false'],['tenant','run_checkout']]},
    webhook:{label:'WEBHOOK ATTEMPT',id:'evt_7c4',title:declined?'Blocked':failed?'Retry queued':'Delivered',subtitle:declined?'No attempt · payment declined':failed?'Retrying · attempt 02 of 03':`Signed · delivered on attempt ${state.attempts}`,fields:[['event','payment_intent.succeeded'],['attempts',String(state.attempts)],['signature',declined?'not sent':'whsec_clone'],['destination','/hooks/stripe']]},
    order:{label:'ORDER RECORD',id:'ord_2b7',title:declined?'Not created':failed?'Pending callback':'Confirmed',subtitle:declined?'Access held · payment required':failed?'Access held · awaiting webhook':'Pro plan · access granted',fields:[['status',state.order],['amount','$24.00 USD'],['access',state.access],['tenant','run_checkout']]},
  }[state.selected]||null;
  const negative=(state.selected==='payment'&&(declined||failed))||(state.selected==='webhook'&&(declined||failed))||(state.selected==='order'&&(declined||failed));
  return {...frames,negative,trail:[['charge.succeeded',declined?'blocked':'observed'],['payment_intent.succeeded',declined?'declined':'signed'],['order.confirmed',declined?'skipped':failed?'pending':'received']]};
}

const q=(root,selector)=>root.querySelector(selector);
const clockLabel=day=>new Date(Date.UTC(2026,7,14+day,14,30)).toISOString().slice(0,16).replace('T',' ')+' UTC';
export function initClonesStory(root=document){
  const example=root.querySelector('[data-clones-example]'); if(!example||example.dataset.clonesReady)return;
  example.dataset.clonesReady='true'; let state={...initialClonesState};
  const draw=()=>{const frame=clonesRecordFrame(state); example.dataset.clonesState=state.payment==='declined'?'declined':state.callback==='failed'?'callback-failed':'healthy';
    q(example,'[data-pc-status]').textContent=state.payment==='declined'?'payment declined':state.callback==='failed'?'callback failing':'healthy'; q(example,'[data-pc-clock]').textContent=`virtual clock · ${clockLabel(state.day)}`; q(example,'[data-pc-message]').textContent=state.message;
    q(example,'[data-pc-payment-code]').textContent=state.payment==='declined'?'402 · 18ms':'201 · 22ms'; q(example,'[data-pc-webhook-code]').textContent=state.payment==='declined'?'blocked':state.callback==='failed'?'retry 02/03':'200 · 88ms'; q(example,'[data-pc-order-code]').textContent=state.payment==='declined'?'not created':state.callback==='failed'?'pending':'created'; q(example,'[data-pc-record-label]').textContent=frame.label; q(example,'[data-pc-record-id]').textContent=frame.id; q(example,'[data-pc-record-title]').textContent=frame.title; q(example,'[data-pc-record-subtitle]').textContent=frame.subtitle; q(example,'[data-pc-fields]').innerHTML=frame.fields.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join(''); q(example,'[data-pc-record-status]').classList.toggle('is-negative',frame.negative); q(example,'[data-pc-record-status] .pc-status-icon').innerHTML=mark(!frame.negative);
    q(example,'[data-pc-trail]').innerHTML=frame.trail.map(([label,status],i)=>`<li class="${['received','observed','signed'].includes(status)?'is-done':'is-warn'}"><span>0${i+1}</span><strong>${label}</strong><em>${status}</em></li>`).join(''); q(example,'[data-pc-action="decline"]').setAttribute('aria-pressed',String(state.payment==='declined')); const callback=q(example,'[data-pc-action="callback"]'); callback.setAttribute('aria-pressed',String(state.callback==='failed')); callback.disabled=state.payment==='declined'; q(example,'[data-pc-action="restore"]').disabled=!state.snapshot; example.querySelectorAll('[data-pc-request]').forEach(button=>{const selected=button.dataset.pcRequest===state.selected;button.setAttribute('aria-pressed',String(selected));button.classList.toggle('is-selected',selected);});
  };
  example.addEventListener('click',event=>{const control=event.target.closest('[data-pc-action],[data-pc-request]');if(!control)return;state=reduceClonesState(state,control.dataset.pcAction||`select:${control.dataset.pcRequest}`);draw();if(control.dataset.pcRequest&&event.detail>0&&matchMedia('(max-width:640px)').matches)q(example,'.pc-record-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}); draw();
}
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>initClonesStory());
