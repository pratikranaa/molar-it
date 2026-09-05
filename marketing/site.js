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
    document.addEventListener('keydown', event => { if (event.key === 'Escape') clearTimeout(hoverTimer); });
    group.addEventListener('toggle', () => { if (group.open) closeGroups(group); });
    group.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || (mobileQuery.matches && !nav.classList.contains('is-open'))) return;
      clearTimeout(hoverTimer);
      hoverTimer=setTimeout(()=>{closeGroups(group);group.open=true},350);
    });
    group.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse' || (mobileQuery.matches && !nav.classList.contains('is-open'))) return;
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
  const scenes=$$('[data-motion-scene]');
  const sceneObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('is-in-view',entry.isIntersecting&&!document.hidden&&!reducedMotion.matches));
  },{threshold:.18});
  scenes.forEach(scene=>sceneObserver.observe(scene));
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)scenes.forEach(scene=>scene.classList.remove('is-in-view'));
    else scenes.forEach(scene=>{sceneObserver.unobserve(scene);sceneObserver.observe(scene)});
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
    $('.form-status',form).textContent='Your email draft is ready. Send it from your mail app, or email pratik@molar.it directly.';
  });
  // Retain the actual captured poster until playback starts, including on a slow connection.
  $$('[data-recording]').forEach(root=>{
    const video=$('video',root), button=$('[data-recording-start]',root), label=$('[data-recording-label]',root);
    button.hidden=false;video.controls=false;
    video.addEventListener('playing',()=>{button.hidden=true;video.controls=true;video.tabIndex=0;video.focus({preventScroll:true})});
    button.addEventListener('click',async()=>{
      button.disabled=true;button.setAttribute('aria-busy','true');label.textContent='Loading recording…';
      try{if(video.error)video.load();await video.play()}
      catch{label.textContent='Try playback again';button.setAttribute('aria-label','Try playback again')}
      finally{button.disabled=false;button.removeAttribute('aria-busy')}
    });
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
