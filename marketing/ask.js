const form=document.querySelector('#ask-form');
if(form){
 const question=document.querySelector('#ask-question'),submit=document.querySelector('#ask-submit'),cancel=document.querySelector('#ask-cancel'),progress=document.querySelector('#ask-progress'),error=document.querySelector('#ask-error'),result=document.querySelector('#ask-result'),answer=document.querySelector('#ask-answer'),sources=document.querySelector('#ask-sources'),mode=document.querySelector('#ask-mode'),copy=document.querySelector('#ask-copy');
 let active=null,copyText='';
 function busy(value){submit.disabled=value;cancel.hidden=!value;progress.hidden=!value;form.setAttribute('aria-busy',String(value));document.querySelectorAll('[data-ask-question]').forEach(b=>b.disabled=value)}
 function render(data){
  answer.replaceChildren();for(const text of data.answer.split(/\n+/).filter(Boolean)){const p=document.createElement('p');p.textContent=text;answer.append(p)}
  const list=sources.querySelector('ul');list.replaceChildren();
  for(const source of data.sources||[]){const url=new URL(source.url,location.origin);if(!['https:','http:'].includes(url.protocol))continue;const li=document.createElement('li'),a=document.createElement('a');a.href=url.href;a.textContent=source.title;li.append(a);list.append(li)}
  sources.hidden=!list.children.length;
  mode.textContent=data.mode==='generated'?'Generated from the linked sources':data.mode==='sources'?'From the published guides':'No matching guidance';
  copyText=data.answer+'\n\n'+(data.sources||[]).map(s=>s.title+': '+new URL(s.url,location.origin).href).join('\n');
  result.hidden=false;document.querySelector('#ask-result-title').focus({preventScroll:true});
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  active?.abort();const controller=new AbortController();active=controller;let timedOut=false;
  const timeout=setTimeout(()=>{timedOut=true;controller.abort()},25000);
  error.hidden=true;result.hidden=true;busy(true);
  try{const response=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:question.value.trim()}),signal:controller.signal});const data=await response.json();if(!response.ok)throw new Error(data.error||'The answer could not be loaded. Try again.');render(data)}
  catch(e){if(e.name!=='AbortError'||timedOut){error.textContent=timedOut?'The answer took too long. Try again, or open a guide alongside the form.':e.message||'The answer could not be loaded. Try again.';error.hidden=false}}
  finally{clearTimeout(timeout);if(active===controller){active=null;busy(false)}}
 });
 cancel.addEventListener('click',()=>{active?.abort();question.focus()});
 document.querySelectorAll('[data-ask-question]').forEach(button=>button.addEventListener('click',()=>{question.value=button.dataset.askQuestion;form.requestSubmit()}));
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(copyText);copy.textContent='Copied with sources'}catch{copy.textContent='Select the answer to copy'}setTimeout(()=>{copy.textContent='Copy answer'},2400)});
}
