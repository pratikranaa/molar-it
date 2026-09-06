// Progressive enhancement: the full service catalog and prompt remain readable without JS.
document.querySelectorAll('[data-clone-catalog]').forEach(root=>{
  const controls=root.querySelector('.catalog-controls');
  const search=root.querySelector('[data-catalog-search]');
  const buttons=[...root.querySelectorAll('[data-catalog-tier]')];
  const entries=[...root.querySelectorAll('[data-catalog-entry]')];
  let tier='all';
  const update=()=>{
    const query=search.value.trim().toLocaleLowerCase();
    let count=0;
    entries.forEach(entry=>{
      const visible=(tier==='all'||entry.dataset.tier===tier)&&entry.textContent.toLocaleLowerCase().includes(query);
      entry.hidden=!visible;
      if(visible)count++;
    });
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.catalogTier===tier)));
    root.querySelector('[data-catalog-count]').textContent=`${count} ${count===1?'service':'services'}${query?' matching your search':''}`;
    root.querySelector('.catalog-empty').hidden=count!==0;
  };
  buttons.forEach(button=>button.addEventListener('click',()=>{tier=button.dataset.catalogTier;update()}));
  search.addEventListener('input',update);
  root.querySelector('[data-catalog-reset]').addEventListener('click',()=>{tier='all';search.value='';update();search.focus()});
  controls.hidden=false;
});

document.querySelectorAll('[data-copy-agent]').forEach(button=>button.addEventListener('click',async()=>{
  const root=button.closest('.agent-handoff');
  const prompt=root.querySelector('[data-agent-prompt]');
  const status=root.querySelector('.agent-copy-status');
  try{
    await navigator.clipboard.writeText(prompt.textContent);
    status.textContent='Prompt copied. Paste it into your coding agent.';
    window.MolarAnalytics?.track('cta_click',{cta:'agent-prompt-copied'});
  }catch{
    root.querySelector('.agent-prompt-preview').open=true;
    status.textContent='Copy is unavailable. Select the prompt below and copy it manually.';
  }
}));
