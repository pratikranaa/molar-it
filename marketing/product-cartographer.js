export const CARTOGRAPHER_ROUTES = Object.freeze([
  {id:'home', label:'Landing', path:'/', state:'Observed', tone:'start', icon:'globe', summary:'Public entry point is reachable.', actions:[['open','Load the landing page','HTTP response and visible heading observed.'],['scan','Find the sign-in path','Primary navigation exposes the account route.']], assertion:'The landing heading is visible', code:`await page.goto(baseURL);\nawait expect(page.getByRole('heading', { name: /Northstar/ })).toBeVisible();`},
  {id:'login', label:'Create account', path:'/signup', state:'Observed', tone:'ready', icon:'lock', summary:'Create an account using the supplied test identity.', actions:[['cursor','Fill email and password','Browser action uses the supplied test profile.'],['play','Submit the form','The app opens email verification for the new account.']], assertion:'The new account reaches email verification', code:`await page.getByLabel('Email').fill('qa@example.test');\nawait page.getByLabel('Password').fill(process.env.TEST_PASSWORD ?? '');\nawait page.getByRole('button', { name: 'Create account' }).click();\nawait expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();`},
  {id:'verify', label:'Verify email', path:'/verify', state:'Observed', tone:'ready', icon:'mail', summary:'A verification step connects identity to access.', actions:[['mail','Open the verification message','Email Clone or configured inbox supplies the code.'],['check','Confirm the account','The browser checks the verified state before continuing.']], assertion:'Verification opens the correct account', code:`await page.getByLabel('Verification code').fill(code);\nawait page.getByRole('button', { name: 'Verify' }).click();\nawait expect(page).toHaveURL(/workspace/);`},
  {id:'workspace', label:'Workspace', path:'/workspace', state:'Passed', tone:'pass', icon:'users', summary:'Authenticated destination is reachable.', actions:[['open','Follow the redirect','The signed-in browser reaches the workspace.'],['check','Check the heading','The requested account state is visible.']], assertion:'The workspace heading is visible', code:`await expect(page).toHaveURL(/workspace/);\nawait expect(page.getByRole('heading', { name: 'Workspace' })).toBeVisible();`},
  {id:'billing', label:'Billing', path:'/settings/billing', state:'Inspect', tone:'branch', icon:'card', summary:'The workspace owner can inspect plan and billing details.', actions:[['card','Open billing settings','Compare the route with the role supplied for this run.'],['shield','Check permission state','Keep the observed role boundary with the run.']], assertion:'The workspace owner can view billing details', code:`await page.goto(new URL('/settings/billing', baseURL));\nawait expect(page.getByText('Billing')).toBeVisible();`},
  {id:'blocked', label:'Protected route', path:'/admin', state:'Blocked', tone:'blocked', icon:'lock', summary:'Admin route cannot be tested yet.', setupNotice:'No authorized admin profile was supplied for this example. The branch is blocked before inspection; there is no assertion or export to trust.', actions:[['lock','Check supplied profiles','The available member profile cannot authorize an admin inspection.'],['shield','Stop before the route','Add an authorized admin test profile before running this branch.']], assertion:'No export until setup is complete.', code:'', noExport:true}
]);

export const CARTOGRAPHER_SCENARIOS = Object.freeze([
  {id:'signup', label:'Signup → workspace', goal:'Sign up, verify email, and reach the workspace', startRoute:'login'},
  {id:'account', label:'Account access', goal:'Check billing access for the supplied account role', startRoute:'billing'}
]);


if(typeof document !== 'undefined') (() => {
  const root=document.querySelector('[data-cartographer-demo]')?.closest('.cg-workbench');
  if(!root)return;
  const $=(s)=>root.querySelector(s);
  const nodes=[...root.querySelectorAll('[data-cartographer-route]')];
  const scenarios=[...root.querySelectorAll('[data-cartographer-scenario]')];
  const detail={title: $('[data-route-title]'),path:$('[data-route-path]'),state:$('[data-route-state]'),summary:$('[data-route-summary]'),actions:$('[data-route-actions]'),assertion:$('[data-route-assertion]'),assertionLabel:$('[data-route-assertion-label]'),code:$('[data-route-code]'),codeToggle:$('[data-cartographer-code]')};
  const routeMap=new Map(CARTOGRAPHER_ROUTES.map(route=>[route.id,route]));
  const render=(id)=>{
    const route=routeMap.get(id)||CARTOGRAPHER_ROUTES[0];
    nodes.forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.cartographerRoute===route.id)));
    detail.title.textContent=route.label; detail.path.textContent=route.path; detail.summary.textContent=route.noExport?route.setupNotice:route.summary; detail.assertion.textContent=route.assertion; detail.assertionLabel.textContent=route.noExport?'Export status':'Expected result'; detail.actions.innerHTML=route.actions.map(([,title,note],index)=>`<li><span class="cg-action-mark"><span class="cg-action-glyph" aria-hidden="true">${index+1}</span></span><span><strong>${title}</strong><small>${note}</small></span></li>`).join('');
    detail.state.textContent=route.state; detail.state.className=`cg-state cg-state-${route.tone==='blocked'?'blocked':route.tone==='branch'?'branch':route.tone==='pass'?'pass':'ready'}`; detail.code.querySelector('code').textContent=route.code; detail.code.hidden=true; detail.codeToggle.setAttribute('aria-expanded','false'); detail.codeToggle.hidden=Boolean(route.noExport); detail.assertion.closest('.cg-assertion').classList.toggle('cg-assertion-blocked',Boolean(route.noExport));
  };
  const chooseScenario=(scenarioId)=>{const scenario=CARTOGRAPHER_SCENARIOS.find(item=>item.id===scenarioId)||CARTOGRAPHER_SCENARIOS[0];scenarios.forEach(tab=>{const selected=tab.dataset.cartographerScenario===scenario.id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});root.dataset.cartographerScenario=scenario.id;$('[role=tabpanel]').setAttribute('aria-labelledby','cg-scenario-'+scenario.id);const note=$('[data-cartographer-note]');note.textContent=`Interactive example · ${scenario.goal} · sample data`;render(scenario.startRoute);};
  nodes.forEach(node=>node.addEventListener('click',event=>{render(node.dataset.cartographerRoute);if(event.detail>0&&matchMedia('(max-width:700px)').matches)$('.cg-route-detail').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
  scenarios.forEach((tab,index)=>{tab.addEventListener('click',()=>chooseScenario(tab.dataset.cartographerScenario));tab.addEventListener('keydown',(event)=>{const direction=event.key==='ArrowRight'||event.key==='ArrowDown'?1:event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:0;const next=event.key==='Home'?0:event.key==='End'?scenarios.length-1:direction?(index+direction+scenarios.length)%scenarios.length:null;if(next===null)return;event.preventDefault();scenarios[next].click();scenarios[next].focus();});});
  detail.codeToggle.addEventListener('click',()=>{const open=detail.code.hidden;detail.code.hidden=!open;detail.codeToggle.setAttribute('aria-expanded',String(open));});
  const canvas=$('.cg-map-canvas'),svg=$('.cg-map-lines');
  function connectRoutes(){
    if(!canvas.clientWidth)return;
    const rect=canvas.getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
    const edges=[['home','login'],['login','verify'],['verify','workspace'],['workspace','billing'],['billing','blocked']];
    svg.innerHTML=edges.map(([from,to],index)=>{
      const a=$(`[data-cartographer-route="${from}"]`).getBoundingClientRect(),b=$(`[data-cartographer-route="${to}"]`).getBoundingClientRect();
      const x=a.x-rect.x+a.width/2,y=a.y-rect.y+a.height/2,u=b.x-rect.x+b.width/2,v=b.y-rect.y+b.height/2;
      return `<path${index>2?' stroke-dasharray="5 6"':''} d="M${x} ${y}H${(x+u)/2}V${v}H${u}"/>`;
    }).join('');
  }
  new ResizeObserver(connectRoutes).observe(canvas);
  document.fonts.ready.then(connectRoutes);
  chooseScenario('signup');
})();
