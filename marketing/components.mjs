import {featureVisual} from './illustrations.mjs';
import {productGraphic} from './product-graphics.mjs';
import {featuredGuides,guidePreview} from './guide-previews.mjs';
export const APP = 'https://app.molar.it/dashboard/signup';
export const DOCS = 'https://docs.molar.it';
export const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const icon = (name, cls='') => {
  const paths = {
    arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>', chevron:'<path d="m7 10 5 5 5-5"/>', check:'<path d="m5 12 4 4L19 6"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
    map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16m6-14v16"/>',
    layers:'<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 17l10 5 10-5"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6ZM8 11l3 3 5-5"/>',
    trace:'<path d="M3 12h4l3-8 4 16 3-8h4"/>', code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h3"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    cursor:'<path d="m5 3 14 10-7 1-3 7Z"/>', bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-8Z"/>',
    branch:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><path d="M6 7v10m0-6h6a6 6 0 0 0 6-4"/>',
    file:'<path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h8"/>',
    copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>', terminal:'<path d="m4 6 6 6-6 6m10 0h6"/>',
    replay:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>', download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    play:'<path d="m8 4 12 8-12 8Z"/>', pause:'<path d="M8 5v14m8-14v14"/>', x:'<path d="m6 6 12 12M6 18 18 6"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', users:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 4c3 0 4 2 4 5v2"/>',
  };
  return `<svg class="icon ${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.globe}</svg>`;
};
export const logo = `<span>Molar<span class="brand-dot">.</span></span>`;
const menus = [
  ['Platform',[
    ['/platform','Platform overview','Automate work across the web.','globe'],
    ['/platform/browser-agents','Browser agents','Complete tasks across websites.','cursor'],
    ['/platform/live-view','Live browser & recordings','Watch the browser. Inspect the result.','trace'],
    ['/platform/swarm','Swarm','Test different users and scenarios.','users'],
    ['/platform/developer-tools','Developer tools','Connect your CLI, API, or MCP client.','code'],
  ]],
  ['Products',[
    ['/products/cartographer','Cartographer','Explore your app and inspect its routes.','map'],
    ['/products/clones','Clones','Test with services you can reset.','layers'],
    ['/products/clones#clone-catalog','Clone catalog','Find a service and check its API coverage.','search'],
    ['/products/guard','Guard','Check changes before and after release.','shield'],
    ['/products/trace','Trace','Find the step and request behind a failure.','trace'],
    ['/products/mender','Mender','Review a proposed fix for a failure.','bolt']
  ]],
  ['Solutions',[
    ['/solutions/checkout-testing','Checkout & payments','From a payment to a confirmed order.','card'],
    ['/solutions/authentication-testing','Sign-in & onboarding','Accounts, email codes, and access.','lock'],
    ['/solutions/team-workflows','Team workflows','Invites, roles, and permissions.','users'],
    ['/solutions/preview-deployments','Preview deployments','Check the change before you merge.','branch'],
    ['/solutions/workflow-automation','Browser automation','Forms, portals, files, and repeat work.','cursor'],
    ['/solutions/web-data-extraction','Web data extraction','Turn page content into usable data.','file'],
    ['/solutions/integration-testing','Integration-heavy apps','Payments, auth, messaging, webhooks.','layers'],
    ['/solutions/ai-agents','Coding agents','Let your agent test its changes.','code'],
    ['/solutions/startups','Startups & small teams','Keep shipping with repeatable QA.','bolt']
  ]],
  ['Resources',[
    ['/ask','Ask Molar','Find an answer with sources.','search'],
    [DOCS,'Documentation','Get from setup to your first run.','file'],
    ['https://mcp.molar.it','MCP setup','Connect Claude Code, Codex, Cursor, and more.','code'],
    ['/blog','Guides & field notes','Practical lessons in software QA.','file'],
    ['/resources','Developer resources','CLI, API, MCP, and Playwright.','terminal'],
    ['/company','Company','Why we are building Molar.','users'],
    ['/changelog','Changelog','See what is new in Molar.','branch'],
    ['/contact','Talk to the team','Find the right setup for your app.','mail']
  ]]
];
const menuLink = ([href,title,desc,i],active,graphic=false) => `<a href="${href}"${href===active?' aria-current="page"':''}${graphic?' class="nav-product"':''}>${graphic?productGraphic(href.split('/').pop(),{compact:true}):`<span class="nav-icon">${icon(i)}</span>`}<span class="nav-link-copy"><strong>${title}${(title==='Mender'||title==='Swarm')?'<small class="preview-label">Preview</small>':''}</strong><span>${desc}</span></span>${icon('arrow','nav-arrow')}</a>`;
function menuBody(label,items,active){
  if(label==='Products')return `<div class="dropdown-links product-menu-links" aria-label="Products">${items.filter(item=>item[1]!=='Clone catalog').map(item=>menuLink(item,active,true)).join('')}</div><div class="dropdown-bottom"><a href="/products/clones#clone-catalog">${icon('layers')} Explore the clone catalog <span class="menu-link-note">Payments, email, sign-in and more</span>${icon('arrow')}</a><a href="/#products">How the products work together ${icon('arrow')}</a></div>`;
  if(label==='Platform')return `<a class="menu-platform-feature" href="/platform">${productGraphic('platform',{compact:true})}<strong>Give a browser the task.</strong><span>Bring back the file, the data and a record of what happened.</span><span class="text-link">Explore the platform ${icon('arrow')}</span></a><div class="dropdown-links" aria-label="Platform">${items.map(item=>menuLink(item,active)).join('')}</div><div class="dropdown-bottom"><span>From one browser task to your coding workflow.</span><a href="https://mcp.molar.it">Connect through MCP ${icon('arrow')}</a></div>`;
  if(label==='Resources')return `<div class="menu-guides">${featuredGuides.slice(0,2).map(guide=>guidePreview(guide,{compact:true})).join('')}</div><div class="dropdown-links" aria-label="Resources">${items.map(item=>menuLink(item,active)).join('')}</div><div class="dropdown-bottom"><a href="/docs">Start with the quickstart ${icon('arrow')}</a><a href="/examples/autonomous-browser-check">Watch an actual browser recording ${icon('arrow')}</a></div>`;
  const groups=[['Test customer actions',items.filter((_,i)=>[0,1,2,6].includes(i))],['Build and release',items.filter((_,i)=>[3,7,8].includes(i))],['Automate browser work',items.filter((_,i)=>[4,5].includes(i))]];
  return `<div class="solution-menu-groups">${groups.map(([title,links])=>`<div><p class="menu-group-title">${title}</p><div class="dropdown-links">${links.map(item=>menuLink(item,active)).join('')}</div></div>`).join('')}</div><div class="dropdown-bottom"><a href="/solutions">Find the setup for your task ${icon('arrow')}</a><a href="/contact">Talk through your app ${icon('arrow')}</a></div>`;
}
export function header(active='') {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Molar home">${logo}</a><button class="mobile-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">${icon('menu')}</button><nav id="main-nav" class="main-nav" aria-label="Main navigation">${menus.map(([label,items])=>{
    return `<details class="nav-group nav-${label.toLowerCase()}"><summary aria-controls="menu-${label.toLowerCase()}">${label}${icon('chevron')}</summary><div id="menu-${label.toLowerCase()}" class="nav-dropdown"><div class="dropdown-inner">${menuBody(label,items,active)}</div></div></details>`;
  }).join('')}<div class="mobile-auth"><a href="https://app.molar.it/dashboard/login">Sign in</a><a class="button button-primary" href="${APP}">Get started ${icon('arrow')}</a></div></nav><div class="header-actions"><a class="sign-in" href="https://app.molar.it/dashboard/login">Sign in</a><a class="button button-small button-primary" data-track="signup-nav" href="${APP}">Get started ${icon('arrow')}</a></div></div></header><div class="nav-scrim" aria-hidden="true"></div>`;
}
export function footer(){return `<footer class="site-footer"><div class="wrap footer-grid"><div class="footer-brand"><a class="brand" href="/" aria-label="Molar home">${logo}</a><p>Catch broken flows<br>before your customers do.</p><a class="text-link" href="mailto:pratik@molar.it">Talk to the team ${icon('arrow')}</a></div>${menus.map(([title,items])=>`<div class="footer-column"><h2>${title}</h2>${items.map(([href,t])=>`<a href="${href}">${t}</a>`).join('')}</div>`).join('')}</div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Molar Labs</span><span>Browser testing and automation.</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/security">Security</a><a href="/pricing">Pricing</a></div></div><div class="footer-wordmark" aria-hidden="true">Molar.</div></footer>`}
export function cta(title='See what your next check finds.',description='Create your workspace and choose the first task to test.',{href=APP,label='Get started'}={}){return `<section class="closing"><div class="wrap closing-inner"><h2>${title}</h2><div><p>${description}</p><div class="actions"><a class="button button-primary" href="${href}" data-track="${href===APP?'signup-footer':href==='/verify'?'trial-footer':'contact-footer'}">${label} ${icon('arrow')}</a><a class="button button-outline" href="${href===APP||href==='/contact'?'/verify':'/contact'}">${href===APP||href==='/contact'?'Check a public page':'Talk through your setup'} ${icon('arrow')}</a></div></div></div></section>`}
export function faq(items){return `<section class="section faq-section"><div class="wrap faq-layout"><div><h2>Questions,<br>answered.</h2><p>Have a specific workflow in mind?<br><a class="text-link" href="mailto:pratik@molar.it">Let’s talk it through ${icon('arrow')}</a></p></div><div class="faq-list">${items.map(({q,a})=>`<details class="faq"><summary>${esc(q)}<span class="faq-plus" aria-hidden="true"></span></summary><p>${esc(a).replace(/`([^`]+)`/g,'<code>$1</code>')}</p></details>`).join('')}</div></div></section>`}
export const faqsQA = [
  {q:'What does Molar test?',a:'Molar opens your app in a real browser and checks tasks such as signing in, submitting a form, or completing checkout. Clones provide test versions of payment, email, SMS, authentication, and storage services for the supported integrations behind those tasks.'},
  {q:'Is Molar only for apps with lots of integrations?',a:'You can start with a simple form or page check. Add Clones when you need to test what happens after a payment, verification email, or file upload.'},
  {q:'How are Clones different from API mocks?',a:'A mock usually returns a prepared response. A clone remembers the records your test creates. For example, create a subscription, advance its clock, and inspect the renewal event. Each clone supports a documented set of service behavior.'},
  {q:'Can I keep using Playwright?',a:'Yes. Keep your existing Playwright tests and run Molar browser checks alongside them. Generated test export and clean replay are still being validated in beta.'},
  {q:'Can my coding agent use Molar?',a:'Yes. Molar exposes CLI commands and MCP tools for browser tasks, verification, extraction, and trace inspection. Your agent can read the run status, captured screenshots, and trace details before trying again.'},
  {q:'How do I get started?',a:'Create a workspace and choose the first flow to test. We’ll help connect your authenticated app and its services during beta. For a quick preview, try a read-only public page check without an account.'}
];
export function codeBlock(code,label='Terminal'){return `<div class="code-window"><div class="code-top"><span>${icon('terminal')}${label}</span><button class="copy-button" data-copy aria-label="Copy command">${icon('copy')}<span>Copy</span></button></div><pre><code>${esc(code)}</code></pre><span class="copy-status sr-only" role="status"></span></div>`}
export function visual(kind='explore'){
 if(kind==='explore')return `<figure class="application-map" data-motion-scene aria-label="Application flow map"><figcaption><strong>Your app, mapped out.</strong><span>Example</span></figcaption><div class="application-map-stage"><svg viewBox="0 0 900 390" fill="none" aria-hidden="true"><path d="M80 175H235Q270 175 270 110V88H410M270 175V275Q270 305 310 305H410M570 88H675Q715 88 715 133V175H825M570 305H675Q715 305 715 260V175"/><path class="map-route-active" d="M80 175H235Q270 175 270 110V88H410M570 88H675Q715 88 715 133V175H825"/></svg><div class="application-map-origin">${icon('globe')}<strong>Your app</strong><span>Start here</span></div><div class="application-map-node map-signup">${icon('users')}<strong>Create an account</strong><span>Email verified</span></div><div class="application-map-node map-purchase">${icon('card')}<strong>Buy a plan</strong><span>Payment received</span></div><div class="application-map-finish">${icon('check')}<strong>Workspace ready</strong><span>Access checked</span></div></div><div class="application-map-foot"><span>Follow signup, payment, and account access in this example.</span><a href="/products/cartographer">Explore the app map ${icon('arrow')}</a></div></figure>`;
 return featureVisual(({clones:'checkout',guard:'preview',trace:'live',agent:'automation'})[kind]||kind)
}
