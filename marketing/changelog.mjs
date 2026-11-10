// Customer changelog: what a customer can now do, not what we fixed or how it works inside (owner decision
// 2026-11-09, modelled on updates.wayground.com). One card per change: a label, a title that names the new
// ability, and one paragraph that starts from the problem it removes. No fixes, error codes, internal names or
// mechanisms. Renders /changelog, /changelog.xml (RSS) and /changelog.md. Newest first.
import {esc,icon} from './components.mjs';

const SITE='https://molar.it';
export const LABELS=['New','Improvement','Announcement','Performance & security'];

// label, optional Preview flag, optional link to where to try it.
export const releases=[
 {id:'agent-gets-proof',date:'2026-11-11',label:'New',
  title:'Your coding agent gets proof, not just pass or fail',
  body:'A bare pass or fail leaves an agent guessing what to fix. One call to molar verify, molar test or molar run, or molar_verify and molar_run_task over MCP, now returns the status, the answer Molar found, the page text that proves it, the checks on the final page, a recording and a link to the run. When Molar can’t confirm something, it says so and shows what it saw.',
  link:['/platform/developer-tools','Developer tools']},
 {id:'keep-the-test',date:'2026-11-11',label:'New',
  title:'Keep a Playwright test from every passing run',
  body:'A passing run used to end at its result. It now leaves a Playwright test you own. Download it, open a pull request into your GitHub repository, or add it to your Molar tests so it runs on every pull request.',
  link:['/platform/browser-agents','Browser agents']},
 {id:'share-a-run',date:'2026-11-11',label:'New',
  title:'Share a run with a link',
  body:'Showing someone a result meant adding them to your workspace. Open a run, choose Share and pick Anyone with the link. They see the task, the result, the answer, the proof and the checks, with no sign-up, and the video if you choose to include it.',
  link:['/platform/live-view','Live view and recordings']},
 {id:'failed-run-verdict',date:'2026-11-11',label:'New',
  title:'Know why a run failed',
  body:'A failed run didn’t say whether to fix the app or the test. It now gets a verdict: Bug, Flaky or Test drift. For test drift, Molar also gives you a repaired test.',
  link:['/products/guard','Guard']},
 {id:'pull-request-comment',date:'2026-11-11',label:'New',
  title:'See the recording in your pull request',
  body:'Reviewers had to open a dashboard to find out what a check did. The Guard comment on a pull request now opens with “Verified by Molar” or “Molar found a problem” and links the recording.',
  link:['/products/guard','Guard']},
 {id:'agent-uses-site-filters',date:'2026-11-08',label:'Improvement',
  title:'Ask for the cheapest plan, and Molar uses the site’s own filters',
  body:'Finding “the cheapest plan billed yearly” used to mean reading every option on the page. Molar now sets the site’s filters and sorting first, then reads what is left, and its final screenshot shows the answer it found.'},
 {id:'repeat-checks-faster',date:'2026-11-04',label:'Performance & security',
  title:'Checks you run again finish faster',
  body:'Running the same check every morning took as long as the first time. Now a check that already passed repeats much faster, and Molar only works through the parts of the page that changed.',
  link:['/platform/browser-agents','Browser agents']},
 {id:'test-email-sign-ups',date:'2026-11-04',label:'New',preview:true,
  title:'Test sign-ups that email a verification code',
  body:'A sign-up that sends a code by email used to stop a test at the inbox. Put {{email}} in your task and Molar signs up with a fresh inbox for that run, reads the code and finishes the sign-up.',
  link:['/solutions/authentication-testing','Sign-in & onboarding']},
 {id:'task-webhooks',date:'2026-11-04',label:'New',
  title:'Get a call to your server when a task finishes',
  body:'Waiting on a long task meant checking back until it was done. Add a webhook URL to the task and Molar calls it, signed, the moment the task ends.',
  link:['/platform/developer-tools','Developer tools']},
 {id:'schedules-and-watches',date:'2026-11-04',label:'New',preview:true,
  title:'Run a task on a schedule, or watch a page for changes',
  body:'Checking the same page by hand every few hours is easy to forget. Ask your coding agent to schedule a task, or to watch a page, and Molar runs it for you as often as every 5 minutes.',
  link:['/platform/developer-tools','Developer tools']},
 {id:'test-plan-from-one-sentence',date:'2026-11-03',label:'New',preview:true,
  title:'Get a test plan for your whole app from one sentence',
  body:'Deciding what to test in an app you didn’t write takes hours of clicking around. Ask Molar for “a test plan for this site” and it explores without submitting anything, proposes the scenarios worth checking, and runs the ones you keep as tests.',
  link:['/products/cartographer','Cartographer']},
 {id:'two-runs-at-once',date:'2026-11-03',label:'Performance & security',
  title:'Two hosted runs at a time',
  body:'During the beta, hosted runs went one at a time, so a second run had to wait. Two now run side by side, and any others start on their own as soon as a browser is free.',
  link:['/pricing','Beta limits']},
 {id:'phone-sized-runs',date:'2026-11-03',label:'Improvement',
  title:'Test your app at phone size',
  body:'Checking a mobile layout meant a run at desktop size and a guess. Ask for a phone viewport, such as 390 × 844, and the run and the test it exports both stay at that size.'},
 {id:'signed-in-exports',date:'2026-11-03',label:'Improvement',
  title:'Tests from signed-in runs sign in on their own',
  body:'A test exported from a signed-in run used to fail on a fresh browser. It now signs in first, with your secrets kept out of the test file, so it passes in CI.'},
 {id:'exports-wait-for-the-page',date:'2026-11-02',label:'Improvement',
  title:'Exported tests wait for the page, not a timer',
  body:'Tests that pause for a fixed number of seconds pass on a fast day and fail on a slow one. Each step in an exported test now waits for the change it expects, such as a new page or a row that appears.'},
 {id:'tests-fix-themselves',date:'2026-10-26',label:'New',
  title:'Exported tests are checked and fixed before you get them',
  body:'A generated test that fails the first time you run it is worse than none. Molar now runs every exported test on its own before handing it over, and if it fails, fixes it and runs it again. A fix never removes or weakens a check.',
  link:['/products/cartographer','Cartographer']},
 {id:'upload-download-drag',date:'2026-10-26',label:'New',
  title:'Upload files, download files and drag items',
  body:'Flows with a file picker, a download button or a drag-and-drop board couldn’t be tested end to end. Molar can now upload a file, capture a download and drag an item, and the exported test does the same.'},
 {id:'private-dashboard-recordings',date:'2026-10-26',label:'Performance & security',
  title:'Your run content stays out of our product analytics',
  body:'We record how the dashboard is used so we can improve it. Those recordings now hide all text, inputs, images and video, so your goals, the sites you test and your results never appear in them.',
  link:['/security','Security']},
 {id:'checks-inside-a-task',date:'2026-10-25',label:'New',
  title:'Add checks in the middle of a task',
  body:'A run that only checks the last screen can miss a broken step along the way. Write “verify” anywhere in your task and Molar checks it at that point, and the exported test keeps the same check in the same place.',
  link:['/platform/browser-agents','Browser agents']},
 {id:'saved-logins',date:'2026-10-25',label:'New',
  title:'Sign in with a saved test login',
  body:'Pasting a test password into every task is tedious and easy to leak. Save a test login once, refer to it in a task, and Molar types it only on your own project’s sites.',
  link:['/security','Where saved logins are used']},
 {id:'sites-behind-bot-protection',date:'2026-10-25',label:'New',
  title:'Test sites behind your own bot protection',
  body:'Bot protection on your own site can block your tests too. Turn on the test-traffic setting in your project and add one rule to your firewall, and Molar’s runs and exported tests get through.',
  link:['https://docs.molar.it/docs/platform/bot-protection','Set it up']},
 {id:'new-dashboard',date:'2026-10-21',label:'New',
  title:'A new dashboard that starts with one question',
  body:'Finding where to start meant knowing which product did what. The dashboard now opens with one box, “What should Molar do?”, and keeps your tasks, tests, runs, issues and recordings one click away.',
  link:['https://app.molar.it','Open the dashboard']},
 {id:'exports-use-test-ids',date:'2026-10-16',label:'Improvement',
  title:'Exported tests use your app’s test IDs',
  body:'If your team already marks elements with test IDs, such as data-test, exported tests now use them, so they match the tests you write by hand.'},
 {id:'free-beta',date:'2026-10-15',label:'Announcement',
  title:'Molar is free during the beta',
  body:'No card and no plan to choose. Every organization gets up to 25 hosted runs a day, and we’ll tell you before anything about pricing changes.',
  link:['/pricing','See the beta limits']},
 {id:'github-action',date:'2026-10-15',label:'New',
  title:'Check every pull request with the Guard GitHub Action',
  body:'A broken checkout found after release costs more than one found in review. Add the Guard Action to your workflow and your key flows run on every pull request, first as advice, then as a required check.',
  link:['/integrations/github-actions','GitHub Actions guide']},
 {id:'download-tests-from-cli',date:'2026-10-15',label:'New',
  title:'Download tested Playwright files from your terminal',
  body:'Copying a test out of the dashboard breaks your flow. Add --export to a hosted run in the Molar CLI and the checked Playwright test lands in your project folder.',
  link:['/platform/developer-tools','Developer tools']},
 {id:'block-ads',date:'2026-10-13',label:'New',
  title:'Block ads while Molar runs',
  body:'Ads and cookie pop-ups slow runs down and get in the way of tests. Turn on ad blocking for a run and the exported test blocks them too.',
  link:['https://docs.molar.it/docs/platform/block-ads','How it works']},
 {id:'follow-to-other-sites',date:'2026-10-13',label:'Improvement',
  title:'Follow your app to sign-in and checkout on other sites',
  body:'Sign in with Google or a hosted checkout page used to end the run at your app’s edge. Molar now follows your app to those public sites and back, so you can test the whole flow.'},
 {id:'readable-exports',date:'2026-10-07',label:'Improvement',
  title:'Exported tests read like ones you wrote',
  body:'Generated tests full of brittle selectors are hard to review. Exported tests now find buttons and fields by their names and labels, the way your team writes Playwright.'},
 {id:'mender-for-scheduled-runs',date:'2026-10-01',label:'New',preview:true,
  title:'Get a suggested fix when a scheduled check fails',
  body:'A check that fails at 3 a.m. waits for someone to dig in. With Mender on, a failed scheduled check comes with a suggested fix you can review.',
  link:['/products/mender','Mender']},
 {id:'check-any-public-page',date:'2026-09-05',label:'New',
  title:'Check any public page for free, no account needed',
  body:'Trying Molar used to mean signing up first. Enter a public URL and something that should be true on it, and see what Molar finds, with a screenshot.',
  link:['/verify','Check a page']},
 {id:'one-dashboard',date:'2026-08-16',label:'Announcement',
  title:'One dashboard for every part of Molar',
  body:'Browser runs, test services, release checks and recordings now live in one place at app.molar.it, with one sign-in and one set of settings for your team.'},
 {id:'connect-any-mcp-client',date:'2026-08-04',label:'New',
  title:'Use Molar from Claude Code, Cursor or any MCP client',
  body:'Your coding agent can change code but can’t see the result in a browser. Connect it to Molar and it can run a check after every change and read what happened.',
  link:['https://mcp.molar.it','Connect your client']},
 {id:'send-results-from-your-suite',date:'2026-08-02',label:'New',
  title:'See your existing Playwright and Cypress runs in Molar',
  body:'Keep the tests you have. Add the Molar reporter to your Playwright or Cypress suite and every run shows up in Trace, with the steps and recordings in one place.',
  link:['https://docs.molar.it/docs/trace/integrations','Add the reporter']}
];

const fmt=(d,opts)=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',...opts});
const longDate=d=>fmt(d,{month:'long',day:'numeric',year:'numeric'});
const monthOf=d=>fmt(d,{month:'long',year:'numeric'});
const slug=a=>a.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const anchor=r=>`${r.date}-${r.id}`;

const dayOf=d=>fmt(d,{day:'2-digit'});
const monthYear=d=>fmt(d,{month:'short',year:'numeric'});

// One update per screen: the big day number and month on the left, the update on the right.
function slide(r,i){
  return `<article class="cl-slide" id="${anchor(r)}" data-label="${slug(r.label)}" data-label-text="${esc(r.label)}" data-date="${longDate(r.date)}">
  <div class="wrap cl-slide-inner">
    <a class="cl-day" href="#${anchor(r)}" aria-label="Link to this update"><span>${dayOf(r.date)}</span><time datetime="${r.date}">${monthYear(r.date)}</time></a>
    <div class="cl-slide-body">
      <p class="cl-meta"><span class="cl-label cl-label-${slug(r.label)}">${esc(r.label)}</span>${r.preview?'<span class="cl-preview">Preview</span>':''}<time class="cl-meta-date" datetime="${r.date}">${longDate(r.date)}</time></p>
      <h2>${esc(r.title)}</h2>
      <p class="cl-text">${esc(r.body)}</p>
      ${r.link?`<a class="text-link" href="${r.link[0]}">${esc(r.link[1])} ${icon('arrow')}</a>`:''}
    </div>
  </div>
</article>`;
}

export function changelogBody(cta){
  const first=releases[0];
  return `<main id="main"><section class="reading-hero cl-hero"><div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/resources">Resources</a>${icon('chevron')}<span>Changelog</span></nav>
  <h1>What’s new in Molar</h1>
  <p class="cl-lead">New things you can do with Molar, one at a time, newest first. Features marked Preview are still being shaped with beta users.</p>
  <div class="cl-filters" role="group" aria-label="Show updates by label"><button type="button" data-cl-filter="all" aria-pressed="true">All updates</button>${LABELS.map(l=>`<button type="button" data-cl-filter="${slug(l)}" aria-pressed="false">${esc(l)}</button>`).join('')}<a class="cl-rss" href="/changelog.xml">${icon('arrow')} RSS</a></div>
</div></section>
<div class="cl-bar"><div class="wrap cl-bar-inner">
  <p class="cl-now" aria-live="polite"><time data-cl-now-date>${longDate(first.date)}</time><span class="cl-label cl-label-${slug(first.label)}" data-cl-now-label>${esc(first.label)}</span></p>
  <div class="cl-nav"><span data-cl-pos>1 of ${releases.length}</span><button type="button" data-cl-step="-1" aria-label="Previous update">${icon('arrow')}</button><button type="button" data-cl-step="1" aria-label="Next update">${icon('arrow')}</button></div>
</div></div>
<div class="cl-slides">${releases.map(slide).join('')}</div>
<script>
(()=>{const slides=[...document.querySelectorAll('.cl-slide')],buttons=[...document.querySelectorAll('[data-cl-filter]')];
const date=document.querySelector('[data-cl-now-date]'),label=document.querySelector('[data-cl-now-label]'),pos=document.querySelector('[data-cl-pos]');
let current=slides[0];
const visible=()=>slides.filter(s=>!s.hidden);
const show=s=>{if(!s)return;current=s;const list=visible();date.textContent=s.dataset.date;label.textContent=s.dataset.labelText;label.className='cl-label cl-label-'+s.dataset.label;pos.textContent=(list.indexOf(s)+1)+' of '+list.length;};
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)show(e.target)})},{rootMargin:'-45% 0px -45% 0px'});
slides.forEach(s=>io.observe(s));
document.querySelectorAll('[data-cl-step]').forEach(b=>b.addEventListener('click',()=>{const list=visible(),next=list[list.indexOf(current)+Number(b.dataset.clStep)];if(next)next.scrollIntoView({block:'start'})}));
const apply=f=>{slides.forEach(s=>{s.hidden=!(f==='all'||s.dataset.label===f)});buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clFilter===f)));const first=visible()[0];show(first);if(first)first.scrollIntoView({block:'start'})};
buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.clFilter)));})();
</script>
${cta}</main>`;
}

const xml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const abs=h=>h.startsWith('/')?SITE+h:h;
export function changelogRss(){
  const items=releases.map(r=>{const link=`${SITE}/changelog#${anchor(r)}`;
    return `    <item>
      <title>${xml(r.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(r.date+'T12:00:00Z').toUTCString()}</pubDate>
      <category>${xml(r.label)}</category>
      <description>${xml(r.body+(r.link?` ${abs(r.link[0])}`:''))}</description>
    </item>`}).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>What’s new in Molar</title>
    <link>${SITE}/changelog</link>
    <description>New things you can do with Molar.</description>
    <language>en</language>
    <lastBuildDate>${new Date(releases[0].date+'T12:00:00Z').toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/changelog.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export function changelogMarkdown(){
  return `# What’s new in Molar

New things you can do with Molar, newest first. Web page: ${SITE}/changelog. RSS: ${SITE}/changelog.xml.

${releases.map(r=>`## ${r.title}\n\n${r.date} · ${r.label}${r.preview?' · Preview':''}\n\n${r.body}${r.link?`\n\n${abs(r.link[0])}`:''}\n`).join('\n')}`;
}
