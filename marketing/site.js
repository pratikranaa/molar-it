(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const nav = $('#main-nav');
  const toggle = $('.mobile-toggle');
  const groups = $$('.nav-group');
  const closeGroups = except => groups.forEach(group => { if (group !== except) group.open = false; });
  const mobileQuery = matchMedia('(max-width: 900px)');
  const setMobileOpen = open => {
    nav?.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    $('path',toggle)?.setAttribute('d',open?'m6 6 12 12M18 6 6 18':'M4 6h16M4 12h16M4 18h16');
    if (!open) closeGroups();
  };
  // Clean-room interaction timing informed by NNGroup: https://www.nngroup.com/articles/timing-exposing-content/
  groups.forEach(group => {
    let hoverTimer;
    group.addEventListener('toggle', () => { if (group.open) closeGroups(group); });
    group.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || mobileQuery.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer=setTimeout(()=>{closeGroups(group);group.open=true},350);
    });
    group.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse' || mobileQuery.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer=setTimeout(()=>{if(!group.contains(document.activeElement)) group.open=false},220);
    });
  });
  toggle?.addEventListener('click', () => setMobileOpen(!nav.classList.contains('is-open')));
  mobileQuery.addEventListener('change', () => setMobileOpen(false));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) { closeGroups();setMobileOpen(false); }
    if (event.target.closest('.main-nav a')) { closeGroups();setMobileOpen(false); }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = groups.find(group => group.open);
    if (open) { open.open = false; $('summary', open).focus(); }
    else if (nav?.classList.contains('is-open')) { setMobileOpen(false);toggle.focus(); }
  });
  nav?.addEventListener('focusout', event => {
    if (event.relatedTarget && !nav.contains(event.relatedTarget) && event.relatedTarget!==toggle) {closeGroups();setMobileOpen(false);}
  });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const selectTab = (tabs, index, activate) => {
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i===index)); tab.tabIndex=i===index?0:-1; });
    activate(index);
  };
  const wireTabs = (tabs, activate) => tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => selectTab(tabs,index,activate));
    tab.addEventListener('keydown', event => {
      const direction = event.key==='ArrowRight'||event.key==='ArrowDown'?1:event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:0;
      const next = event.key==='Home'?0:event.key==='End'?tabs.length-1:direction?(index+direction+tabs.length)%tabs.length:null;
      if(next===null) return;
      event.preventDefault(); selectTab(tabs,next,activate); tabs[next].focus();
    });
  });
  $$('[data-showcase]').forEach(root => {
    const tabs=$$('[data-showcase-tab]',root);
    wireTabs(tabs,index => { $$('[role=tabpanel]',root).forEach((panel,i) => panel.hidden=i!==index); });
  });
  const shape = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{check:'<path d="m5 12 4 4L19 6"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',file:'<path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h8"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',x:'<path d="m6 6 12 12m0-12L6 18"/>',play:'<path d="m8 4 12 8-12 8Z"/>',pause:'<path d="M8 5v14m8-14v14"/>',replay:'<path d="M4 10a8 8 0 1 1 2 8M4 4v6h6"/>',card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h3"/>'}[name]||''}</svg>`;
  const result=(title,detail,code='')=>`<div class="demo-result">${shape('check')}<strong>${title}</strong><span>${detail}</span>${code?`<code>${code}</code>`:''}</div>`;
  const inbox=(title,detail,code='')=>`<div class="demo-inbox"><div class="inbox-meta">${shape('mail')}<span>Acme · Test inbox</span></div><div class="inbox-message"><strong>${title}</strong><p>${detail}</p>${code?`<code>${code}</code>`:''}</div></div>`;
  const qa=[
    {goal:'Buy a plan. Check the payment and receipt.',url:'demo.acme.test/checkout',names:['Open checkout','Confirm payment','Receive receipt'],icons:['globe','card','mail'],titles:['Checkout is ready','Payment is confirmed','The receipt arrived'],evidence:['Payment form visible. Test service connected.','Payment state changed to succeeded.','Receipt matches the test order and inbox.'],surfaces:[null,result('Payment confirmed','Acme Pro · $24.00 · USD','payment_intent.succeeded'),inbox('You’re on the Pro plan.','Your test payment of $24.00 was received.<br>Receipt and plan details are ready.')]},
    {goal:'Create an account. Verify email. Open the app.',url:'demo.acme.test/signup',names:['Create account','Read email code','Open workspace'],icons:['globe','mail','lock'],titles:['The account is created','The verification code arrived','The workspace is ready'],evidence:['Dedicated test identity created.','Code received in the controlled test inbox.','Authenticated workspace is visible.'],surfaces:[result('Account created','New member · Dedicated test identity','Email verification required'),inbox('Verify your email','Use this code to continue to Acme.','834 291'),result('Welcome to your workspace','Signed in as a test member.','Authentication verified')]},
    {goal:'Open settings. Rename the project. Verify it saved.',url:'demo.acme.test/settings',names:['Open settings','Rename project','Check result'],icons:['globe','file','check'],titles:['Project settings are visible','The new name is saved','The change survives a reload'],evidence:['Project name field is available.','Saved project name matches the requested value.','Project name still matches after reloading.'],surfaces:[result('Project settings','Current name: My project','Editable form found'),result('Project renamed','New name: Summer launch','Changes saved'),result('Summer launch','Verified after page reload.','Expected value observed')]}
  ];
  const platform=[
    {goal:'Find the invoice and download a copy.',url:'demo.acme.test/billing',names:['Open billing','Find invoice','Download file'],icons:['globe','file','check'],titles:['Billing is open','The requested invoice is visible','The document is available'],evidence:['Authenticated billing page visible.','Invoice matches the requested period.','The downloaded file has an artifact reference.'],surfaces:[result('Acme billing','Invoices and payment history.','Authorized workspace'),result('Invoice · August 2026','Acme Pro · Paid','invoice_august_2026.pdf'),result('Invoice downloaded','The file is ready for the next step.','file_ref: invoice_august_2026')]},
    {goal:'Explore the workspace and map its main flows.',url:'demo.acme.test/workspace',names:['Observe page','Follow branches','Record the map'],icons:['globe','file','check'],titles:['Workspace observed','Account and project paths found','Observed paths are recorded'],evidence:['Navigation and meaningful controls observed.','Branches visited with the configured scope.','Flow nodes link to their recorded actions.'],surfaces:[result('Workspace overview','Projects · Members · Billing','Page observed'),result('Follow the user journey','Account → Workspace → Project','Branches within scope'),result('Application map updated','Observed paths and their outcomes.','Evidence attached to each path')]},
    {goal:'Read plan names and return structured pricing.',url:'demo.acme.test/plans',names:['Open plans','Read details','Return data'],icons:['globe','file','check'],titles:['The plan page is visible','Plan details are extracted','Structured data is ready'],evidence:['Visible pricing table found.','Plan name and displayed amount read from the page.','Result follows the requested data structure.'],surfaces:[result('Acme plans','Starter · Pro · Business','Visible plan table'),result('Pro plan','Displayed price: $24 per month','Observed from the page'),'<pre class="data-result">{\n  "plan": "Pro",\n  "amount": 24,\n  "currency": "USD",\n  "interval": "month"\n}</pre>']}
  ];
  const qaActions=[
    ['Fill the checkout with a test card.','Confirm the payment in the Stripe clone.','Check the order and look for its receipt.'],
    ['Create a dedicated test account.','Read the code from the test inbox.','Enter the code and open the workspace.'],
    ['Open the project settings.','Rename the project to Summer launch.','Reload the page and check the saved name.']
  ];
  const platformActions=[
    ['Open the billing page.','Find the invoice for the requested month.','Download the matching document.'],
    ['Observe the workspace navigation.','Visit account and project branches.','Record each observed path and outcome.'],
    ['Open the plan comparison page.','Read the displayed plan and price.','Return the fields as structured data.']
  ];
  $$('[data-demo]').forEach(root=>{
    const isPlatform=root.dataset.demo==='platform';
    const examples=isPlatform?platform:qa;
    const actions=isPlatform?platformActions:qaActions;
    const surface=$('[data-inspector-surface]',root);
    const original=surface.innerHTML;
    const play=$('[data-demo-play]',root);
    const status=$('[data-demo-status]',root);
    const steps=$$('[data-step]',root);
    const inspector=$('.demo-inspector',root);
    let example=0, step=0, condition='healthy', playing=false, complete=false, timer;
    const updatePlayer=()=>{
      root.classList.toggle('is-playing',playing);
      const label=playing?'Pause demo':complete?'Replay demo':'Play demo';
      play.setAttribute('aria-label',label);
      play.innerHTML=shape(playing?'pause':complete?'replay':'play')+`<span>${label}</span>`;
      $('[data-demo-progress]',root).style.transform=`scaleX(${complete?1:step/3})`;
      $('[data-demo-progress-label]',root).textContent=complete?'Demo complete':`Step ${step+1} of 3`;
    };
    const pause=()=>{clearTimeout(timer);playing=false;updatePlayer()};
    const renderStep=(index,announce=true)=>{
      step=index;
      const current=examples[example];
      const failed=!isPlatform && example===0 && condition==='failure' && index===2;
      steps.forEach((button,i)=>{
        button.classList.toggle('is-selected',i===index);
        button.classList.toggle('is-complete',i<=index);
        button.classList.toggle('is-failed',failed&&i===2);
        button.setAttribute('aria-pressed',String(i===index));
        button.setAttribute('aria-label',`Step ${i+1}: ${current.names[i]}${failed&&i===2?' — failed':''}`);
        $('.step-check',button).innerHTML=shape(failed&&i===2?'x':'check');
      });
      inspector.classList.toggle('is-failure',failed);
      $('.observed-line > .icon',root).outerHTML=shape(failed?'x':'check');
      $('[data-inspector-title]',root).textContent=failed?'Payment received. Order still pending.':current.titles[index];
      $('.status-pass',root).innerHTML=shape(failed?'x':'check')+`<span>${failed?'Failed':'Observed'}</span>`;
      $('[data-inspector-evidence]',root).textContent=failed?'Receipt missing. The payment callback returned 500.':current.evidence[index];
      surface.innerHTML=failed?`<div class="demo-failure"><div class="failure-state-row"><span>Payment: succeeded</span><span>Order: pending</span></div><strong>The checkout stopped after payment.</strong><p>The app never applied the payment callback, so the customer has no confirmed order or receipt.</p><a href="/products/trace">See how Trace helps investigate</a></div>`:current.surfaces[index]??original;
      $('[data-demo-action]',root).textContent=failed?'Compare the payment state with the order and inbox.':actions[example][index];
      if(announce) status.textContent=`${current.names[index]}. ${failed?'Sample failure: receipt missing.':current.titles[index]+'.'}`;
      if(!reducedMotion.matches && announce){
        surface.getAnimations().forEach(animation=>animation.cancel());
        surface.animate([{opacity:.45,transform:'translateY(7px)',filter:'blur(2px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
      }
      updatePlayer();
    };
    const advance=()=>{
      timer=setTimeout(()=>{
        if(!playing) return;
        if(step<2){renderStep(step+1);advance()}
        else {complete=true;pause();status.textContent='Illustrative walkthrough complete. You can replay it or inspect any step.'}
      },2600);
    };
    const start=()=>{
      if(playing){pause();status.textContent='Demo paused.';return}
      if(complete || step===2){complete=false;renderStep(0)}
      playing=true;updatePlayer();advance();
    };
    const renderExample=index=>{
      pause();example=index;complete=false;
      const current=examples[index];
      $('[data-demo-goal]',root).textContent=current.goal;
      $('[data-demo-url]',root).textContent=current.url;
      $$('[data-step-name]',root).forEach((label,i)=>label.textContent=current.names[i]);
      $$('.step-icon',root).forEach((element,i)=>element.innerHTML=shape(current.icons[i]));
      $('#demo-panel',root).setAttribute('aria-labelledby',`demo-tab-${index}`);
      const conditions=$('[data-demo-conditions]',root);
      if(conditions) conditions.hidden=index!==0;
      renderStep(0,false);
    };
    wireTabs($$('[data-demo-tab]',root),renderExample);
    steps.forEach((button,index)=>button.addEventListener('click',()=>{pause();complete=false;renderStep(index)}));
    $$('[data-condition]',root).forEach(button=>button.addEventListener('click',()=>{
      pause();condition=button.dataset.condition;complete=false;
      $$('[data-condition]',root).forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
      renderStep(0);status.textContent=condition==='failure'?'Missing webhook scenario selected. Play the demo to see the failed order.':'Healthy checkout selected.';
    }));
    play.addEventListener('click',start);
    $$('a[href="#interactive-demo"]').forEach(link=>link.addEventListener('click',()=>{if(!playing) start()}));
    document.addEventListener('visibilitychange',()=>{if(document.hidden) pause()});
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting && playing) pause()},{threshold:0}).observe(root);
    reducedMotion.addEventListener('change',()=>{surface.getAnimations().forEach(animation=>animation.cancel())});
    renderExample(0);
  });
  $$('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const root=button.closest('.code-window');
    const text=$('code',root).textContent;
    const status=$('.copy-status',root);
    try{await navigator.clipboard.writeText(text);$('span',button).textContent='Copied';status.textContent='Command copied to clipboard.';setTimeout(()=>$('span',button).textContent='Copy',2000)}
    catch{status.textContent='Copy is unavailable in this browser. Select the command and copy it manually.';status.classList.remove('sr-only')}
  }));
  $('#contact-form')?.addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    if(!form.reportValidity()) return;
    const values=new FormData(form);
    const subject=`Molar — ${values.get('interest')}`;
    const body=`Hi Molar,\n\n${values.get('message')}\n\n${values.get('name')}\n${values.get('email')}`;
    const href=`mailto:pratik@molar.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const link=document.createElement('a');link.href=href;link.click();
    $('.form-status',form).textContent='Your email draft is ready. Send it from your mail app, or email pratik@molar.it directly. Nothing has been submitted through this page.';
  });
  const search=$('[data-blog-search]');
  const filterButtons=$$('[data-blog-filter]');
  let category='all';
  function filterBlog(){
    const query=search?.value.trim().toLowerCase()||'';let count=0;
    $$('[data-blog-entry]').forEach(entry=>{const show=(category==='all'||entry.dataset.category===category)&&entry.textContent.toLowerCase().includes(query);entry.hidden=!show;if(show)count++});
    const empty=$('[data-blog-empty]');if(empty)empty.hidden=count!==0;
    const status=$('[data-blog-count]');if(status)status.textContent=`${count} ${count===1?'article':'articles'}`;
  }
  search?.addEventListener('input',filterBlog);
  filterButtons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.blogFilter;filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterBlog()}));
})();
