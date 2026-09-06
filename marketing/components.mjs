import {featureVisual} from './illustrations.mjs';
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
    ['/platform/live-view','Live view & evidence','Watch the browser. Inspect the result.','trace'],
    ['/platform/swarm','Swarm','Test different users and scenarios.','users'],
    ['/platform/developer-tools','Developer tools','Connect your CLI, API, or MCP client.','code'],
  ]],
  ['Products',[
    ['/products/cartographer','Cartographer','Explore your app. Map its flows.','map'],
    ['/products/clones','Clones','Test payments, email and sign-in.','layers'],
    ['/products/guard','Guard','Put your critical paths under watch.','shield'],
    ['/products/trace','Trace','Follow the evidence behind a run.','trace'],
    ['/products/mender','Mender','Investigate failures. Propose a repair.','bolt']
  ]],
  ['Solutions',[
    ['/solutions/checkout-testing','Checkout & payments','From a payment to a confirmed order.','card'],
    ['/solutions/authentication-testing','Sign-in & onboarding','Accounts, email codes, and access.','lock'],
    ['/solutions/team-workflows','Team workflows','Invites, roles, and permissions.','users'],
    ['/solutions/preview-deployments','Preview deployments','Check the change before you merge.','branch'],
    ['/solutions/workflow-automation','Browser automation','Forms, portals, files, and repeat work.','cursor'],
    ['/solutions/web-data-extraction','Web data extraction','Turn page content into usable data.','file'],
    ['/solutions/integration-testing','Integration-heavy apps','Payments, auth, messaging, webhooks.','layers'],
    ['/solutions/ai-agents','Coding agents','Give your agent a verification loop.','code'],
    ['/solutions/startups','Startups & small teams','Keep shipping with repeatable QA.','bolt']
  ]],
  ['Resources',[
    ['/ask','Ask Molar','Find an answer with sources.','search'],
    [DOCS,'Documentation','Get from setup to your first run.','file'],
    ['/blog','Guides & field notes','Practical lessons in software QA.','file'],
    ['/resources','Developer resources','CLI, API, MCP, and Playwright.','terminal'],
    ['/company','Company','Why we are building Molar.','users'],
    ['/changelog','Changelog','See what is new in Molar.','branch'],
    ['/contact','Talk to the team','Find the right setup for your app.','mail']
  ]]
];
const menuFeatures = {
  Platform: ['A browser that does the work.', 'Test your app, automate a workflow, or give your coding agent a way to use the web.', '/platform', 'Explore the platform', 'globe'],
  Products: ['From a user journey to an answer.', 'Explore the app. Control its dependencies. Test the release. Follow the evidence.', '/#products', 'Meet the Molar products', 'map'],
  Solutions: ['Find your first workflow.', 'Test a checkout. Verify an invitation. Download a report. Start with the job you need done.', '/solutions', 'Explore all solutions', 'layers'],
  Resources: ['Your next good starting point.', 'Practical guides, working commands, and a team that knows your integration problems.', '/docs', 'Open the quickstart', 'terminal']
};
export function header(active='') {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Molar home">${logo}</a><button class="mobile-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">${icon('menu')}</button><nav id="main-nav" class="main-nav" aria-label="Main navigation">${menus.map(([label,items])=>{
    const [title,description,href,link,i]=menuFeatures[label];
    return `<details class="nav-group"><summary>${label}${icon('chevron')}</summary><div class="nav-dropdown"><div class="dropdown-inner"><div class="dropdown-feature"><span class="menu-feature-icon">${icon(i)}</span><p>${title}</p><span>${description}</span><a href="${href}" class="text-link">${link} ${icon('arrow')}</a></div><div class="dropdown-links" aria-label="${label}">${items.map(([href,title,desc,i])=>`<a href="${href}"${href===active?' aria-current="page"':''}><span class="nav-icon">${icon(i)}</span><span><strong>${title}${(title==='Mender'||title==='Swarm')?'<small class="preview-label">Preview</small>':''}</strong><span>${desc}</span></span>${icon('arrow','nav-arrow')}</a>`).join('')}</div><div class="dropdown-bottom"><span>Start with the flow your customers depend on.</span><a href="/">Explore Molar for QA ${icon('arrow')}</a><a href="/contact">Talk to us ${icon('arrow')}</a></div></div></div></details>`;
  }).join('')}<div class="mobile-auth"><a href="https://app.molar.it/dashboard/login">Sign in</a><a class="button button-primary" href="/verify">Try Molar ${icon('arrow')}</a></div></nav><div class="header-actions"><a class="sign-in" href="https://app.molar.it/dashboard/login">Sign in</a><a class="button button-small button-primary" data-track="trial-nav" href="/verify">Try Molar ${icon('arrow')}</a></div></div></header><div class="nav-scrim" aria-hidden="true"></div>`;
}
export function footer(){return `<footer class="site-footer"><div class="wrap footer-grid"><div class="footer-brand"><a class="brand" href="/" aria-label="Molar home">${logo}</a><p>Catch broken flows<br>before your customers do.</p><a class="text-link" href="mailto:pratik@molar.it">Talk to the team ${icon('arrow')}</a></div>${menus.map(([title,items])=>`<div class="footer-column"><h2>${title}</h2>${items.map(([href,t])=>`<a href="${href}">${t}</a>`).join('')}</div>`).join('')}</div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Molar Labs</span><span>Every action. A clear outcome.</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/security">Security</a><a href="/pricing">Pricing</a></div></div><div class="footer-wordmark" aria-hidden="true">Molar.</div></footer>`}
export function cta(title='See what your next check finds.',description='Start with a public page, or talk through setup for your app.',{href='/verify',label='Try a browser check'}={}){return `<section class="closing"><div class="wrap closing-inner"><h2>${title}</h2><div><p>${description}</p><div class="actions"><a class="button button-primary" href="${href}" data-track="${href==='/verify'?'trial-footer':'contact-footer'}">${label} ${icon('arrow')}</a><a class="button button-outline" href="${href==='/contact'?'/verify':'/contact'}">${href==='/contact'?'Try a public check':'Talk through your setup'} ${icon('arrow')}</a></div></div></div></section>`}
export function faq(items){return `<section class="section faq-section"><div class="wrap faq-layout"><div><h2>A few things<br>you might be wondering.</h2><p>Have a specific workflow in mind?<br><a class="text-link" href="mailto:pratik@molar.it">Let’s talk it through ${icon('arrow')}</a></p></div><div class="faq-list">${items.map(({q,a})=>`<details class="faq"><summary>${q}<span class="faq-plus" aria-hidden="true"></span></summary><p>${a}</p></details>`).join('')}</div></div></section>`}
export const faqsQA = [
  {q:'What does Molar test?',a:'Molar tests web application journeys in a real browser: navigation, forms, authenticated flows, checkout, and the outcomes users expect. For apps with external dependencies, stateful Clones provide controlled payment, email, SMS, auth, and storage behavior.'},
  {q:'Is Molar only for apps with lots of integrations?',a:'Molar is a general-purpose web QA platform. You can start with a simple form or navigation flow. Clones add a deeper testing environment when your journey crosses third-party services.'},
  {q:'How are Clones different from API mocks?',a:'A mock usually returns a prepared response. A stateful clone keeps records, advances time, and produces events for supported service behavior. That lets the next step in a journey depend on what actually happened in the previous one.'},
  {q:'Can I keep using Playwright?',a:'Yes. Playwright is part of the workflow. Use readable, editable tests and your existing engineering practices. Ask us about bringing your existing suite into Molar.'},
  {q:'Can my coding agent use Molar?',a:'Yes. Molar exposes CLI commands and MCP tools for browser tasks, verification, extraction, and trace inspection. Your agent gets a result, screenshots and a trace it can inspect.'},
  {q:'How do I get started?',a:'Try a read-only check on a public page without an account. To test your own authenticated app or connect its services, create a workspace and talk with us about beta setup.'}
];
export function codeBlock(code,label='Terminal'){return `<div class="code-window"><div class="code-top"><span>${icon('terminal')}${label}</span><button class="copy-button" data-copy aria-label="Copy command">${icon('copy')}<span>Copy</span></button></div><pre><code>${esc(code)}</code></pre><span class="copy-status sr-only" role="status"></span></div>`}
export function visual(kind='explore'){
 if(kind==='explore')return `<figure class="application-map" data-motion-scene aria-label="Application flow map"><figcaption><strong>Your app, mapped out.</strong><span>Example</span></figcaption><div class="application-map-stage"><svg viewBox="0 0 900 390" fill="none" aria-hidden="true"><path d="M80 175H235Q270 175 270 110V88H410M270 175V275Q270 305 310 305H410M570 88H675Q715 88 715 133V175H825M570 305H675Q715 305 715 260V175"/><path class="map-route-active" d="M80 175H235Q270 175 270 110V88H410M570 88H675Q715 88 715 133V175H825"/></svg><div class="application-map-origin">${icon('globe')}<strong>Your app</strong><span>Start here</span></div><div class="application-map-node map-signup">${icon('users')}<strong>Create an account</strong><span>Email verified</span></div><div class="application-map-node map-purchase">${icon('card')}<strong>Buy a plan</strong><span>Payment received</span></div><div class="application-map-finish">${icon('check')}<strong>Workspace ready</strong><span>Access checked</span></div></div><div class="application-map-foot"><span>Every path connects to its browser steps.</span><a href="/products/cartographer">Explore the app map ${icon('arrow')}</a></div></figure>`;
 return featureVisual(({clones:'checkout',guard:'preview',trace:'live',agent:'automation'})[kind]||kind)
}
