// Customer changelog: one list of releases renders /changelog, /changelog.xml (RSS) and /changelog.md (for agents).
// Only changes a customer can see or use, each checked against STATUS.md, git history and npm. No internal
// implementation details (owner decision 2026-11-09). Newest first.
import {esc,icon} from './components.mjs';

const SITE='https://molar.it';
export const AREAS=['Agent runs','Exports','Guard','Trace','Dashboard','CLI & MCP','Security & privacy','Beta terms','Website & docs'];

// Published npm packages a customer installs. Dates are npm publish dates.
export const versions=[
  ['@molar/cli','0.3.12','2026-10-15','npm install -g @molar/cli'],
  ['@molar/reporter','0.3.7','2026-10-26','npm install -D @molar/reporter'],
  ['molar-agent','0.3.7','2026-08-08','npx molar-agent init']
];

// type: New | Improved | Fixed | Changed | Removed. status: Preview marks features that may still change.
export const releases=[
 {id:'2026-11-09-comparisons-and-clearer-limits',date:'2026-11-09',areas:['Website & docs','Beta terms'],type:'Improved',
  title:'Compare Molar with QA Wolf and mabl.',
  summary:'Two new comparison pages, written from each vendor’s own pricing page, and docs that describe what each feature does for you.',
  items:[['New','[Molar vs QA Wolf](/vs/qa-wolf) and [Molar vs mabl](/vs/mabl), each ending with when to choose which.'],
   ['Changed','Guard runs, on pull requests or on a schedule, don’t count toward the 25 hosted runs a day.'],
   ['Improved','Developer tools lists the fields `molar verify --json` returns and the statuses a task moves through.'],
   ['Improved','The docs are rewritten around what you do and get. Old pages about Molar’s internals redirect to the nearest page.']]},
 {id:'2026-11-08-filters-before-browsing',date:'2026-11-08',areas:['Agent runs'],type:'Improved',
  title:'The agent filters and sorts before it browses.',
  summary:'When a site has filter or sort controls, the agent now applies them before reading results, so a goal like “the cheapest plan billed yearly” needs fewer steps.',
  items:[['Improved','Searching a page for text scrolls to the match.'],
   ['New','A new step reads a whole list from the page at once.'],
   ['Improved','Before it finishes, the agent scrolls the evidence for its answer into view, so the final screenshot shows it.']]},
 {id:'2026-11-05-repeat-runs-replay-cleanly',date:'2026-11-05',areas:['Agent runs'],type:'Fixed',
  title:'Repeat runs replay cleanly.',
  summary:'A replay of an earlier run was sometimes rejected and the steps redone from scratch. Replays now go through, and each replayed step names the element it acted on.',
  items:[]},
 {id:'2026-11-04-one-agent-and-replays',date:'2026-11-04',areas:['Agent runs'],type:'Changed',
  title:'One agent for every hosted run, and repeat runs without the model.',
  summary:'Every hosted run now uses the agent introduced on October 25; the earlier agent is retired. When you repeat a goal that already passed, Molar replays the verified earlier run without calling the model, and the agent takes over only where the page has changed.',
  code:['Turn off replay for one task (HTTP API)','curl -X POST https://api.molar.it/api/v1/agent/tasks \\\n  -H "Authorization: Bearer $MOLAR_TOKEN" -H "Content-Type: application/json" \\\n  -d \'{"url": "https://staging.your-app.com", "goal": "log in and open billing",\n       "runtime": {"cache": false}}\''],
  items:[['Removed','Requests for any other `agent_version` now return HTTP 422.'],
   ['New','Put `{{email}}` in a task to get a throwaway inbox for that run, for sign-ups that email a code. It is deleted when the run ends. (Preview)'],
   ['Improved','A run restarted after a crash never repeats a change it already sent. It ends as failed with `uncertain_after_restart` instead.'],
   ['New','When a page’s own controls don’t work, the agent can read the site’s API instead. Writes through the API need `runtime.api_writes` (or MCP `api_writes`). (Preview)']],
  link:['/docs/platform/universal-automation','Run a task']},
 {id:'2026-11-04-mcp-tools-and-webhooks',date:'2026-11-04',areas:['CLI & MCP'],type:'Fixed',
  title:'28 MCP tools that failed now work, and task webhooks arrive.',
  summary:'Tools for screenshots, reading the screen, locating and filling elements, capturing network traffic, mapping a site, scenarios, skills, and running, repairing and exporting automations returned errors. They now work against hosted runs.',
  items:[['Fixed','A task’s `webhook_url` was never called. Molar now delivers it, signed, when the task ends.'],
   ['New','MCP tools for batches (one task per free browser), schedules and watches (at most every 5 minutes, 20 per organization). (Preview)'],
   ['New','MCP tools for a disposable email identity: create one, read its messages and one-time codes, and use it to sign up. One exists at a time and each lasts 24 hours. (Preview)']],
  link:['https://mcp.molar.it','Connect an MCP client']},
 {id:'2026-11-04-api-schema-private',date:'2026-11-04',areas:['Security & privacy'],type:'Changed',
  title:'The API schema is no longer public.',
  summary:'api.molar.it no longer serves its schema or interactive API pages to anyone who asks. The HTTP API itself is unchanged; the docs describe the calls you can make.',
  items:[],link:['/docs/platform/universal-automation','HTTP API guide']},
 {id:'2026-11-03-test-planning',date:'2026-11-03',areas:['Agent runs','Dashboard'],type:'New',status:'Preview',
  title:'Plan tests from one broad goal.',
  summary:'Ask for “a test plan” or “the whole site” and Molar explores without submitting anything, plans scenarios from what it saw, then runs each one as its own test. On the planning run’s page you choose which scenarios to keep.',
  items:[['New','Onboarding, Start exploration and Cartographer coverage use the planner, as do the MCP tools `molar_explore_target` and `molar_generate_scenarios_from_url`.'],
   ['Changed','Not in the npm CLI yet. In CLI 0.3.12, `molar explore` uses a retired flow; explore from the dashboard or MCP until the next CLI release.']]},
 {id:'2026-11-03-two-hosted-runs',date:'2026-11-03',areas:['Beta terms'],type:'Changed',
  title:'Two hosted runs at a time.',
  summary:'Hosted browsers now run two at a time across Molar, up from one. Further runs wait in a queue and start on their own.',
  items:[],link:['/pricing','Beta limits']},
 {id:'2026-11-03-exports-and-viewports',date:'2026-11-03',areas:['Exports','Agent runs'],type:'Improved',
  title:'Exported tests from signed-in runs sign in first.',
  summary:'A run that started from a saved profile now exports a test that signs in before it does anything else, so it passes on a fresh browser.',
  items:[['Improved','A run that typed two different passwords exports each as its own secret.'],
   ['Changed','Exported tests wait at most 30 seconds for each action and 60 seconds for each page load.'],
   ['Improved','Runs keep the viewport you ask for, such as a 390×844 phone, instead of switching to desktop.'],
   ['Fixed','A replay refused before it started no longer holds a hosted browser. It had kept other runs, including first runs, queued for up to 20 minutes.'],
   ['Fixed','The agent always reports what it found on its last step.']]},
 {id:'2026-11-02-exports-wait-on-effects',date:'2026-11-02',areas:['Exports','Dashboard'],type:'Improved',
  title:'Exported tests wait for what each action changed.',
  summary:'Instead of fixed pauses, each step in an exported test waits for the change the agent saw: a new URL, an element that appears, or a row that disappears.',
  items:[['Improved','A click that opens a new tab exports as a popup the test follows.'],
   ['Fixed','A browser error page now counts as a failed load instead of a page.'],
   ['Fixed','A new account’s first dashboard visit no longer shows errors.']]},
 {id:'2026-10-26-exports-repair-themselves',date:'2026-10-26',areas:['Exports','Agent runs'],type:'New',
  title:'Exported tests repair themselves when replay fails.',
  summary:'Molar replays every exported test without the agent. If the replay fails, it repairs the test and replays it again. A repair never removes or weakens a check.',
  items:[['New','The agent can upload files, capture downloads and drag elements.'],
   ['Improved','Exported tests use the run’s viewport, dismiss popups that block the page, and wait correctly for slow page loads.']],
  link:['/products/cartographer','Cartographer']},
 {id:'2026-10-26-replays-mask-content',date:'2026-10-26',areas:['Security & privacy'],type:'Improved',
  title:'Dashboard recordings never capture your run content.',
  summary:'Our product analytics record how the dashboard is used. Those recordings now mask all text and every input, block images and video, drop query strings from URLs, and record no console output.',
  items:[],link:['/security','Security']},
 {id:'2026-10-26-reporter-0-3-7',date:'2026-10-26',areas:['CLI & MCP','Trace'],type:'Fixed',
  title:'@molar/reporter 0.3.7 uploads to the right address.',
  summary:'In 0.3.6 the default upload address returned 404, so results from your own Playwright or Cypress suite never reached Trace. Upgrade to 0.3.7.',
  code:['Upgrade','npm install -D @molar/reporter@0.3.7'],
  items:[],link:['/docs/trace/integrations','Send results from your own suite']},
 {id:'2026-10-26-pricing-and-security-pages',date:'2026-10-26',areas:['Website & docs'],type:'Improved',
  title:'Pricing, security and setup, in plain words.',
  summary:'A Pricing page with the beta limits and how long data is kept, a Security page that says what we do and haven’t done yet, and developer pages with commands you can copy.',
  items:[['New','Hosted runs come from one static IP address, published on the Security page so you can allowlist it.'],
   ['New','`/.well-known/security.txt` and a real example run with the test it exported.'],
   ['Fixed','The docs’ login, live view, run output, extract and CLI examples now match the product.']]},
 {id:'2026-10-25-new-agent',date:'2026-10-25',areas:['Agent runs'],type:'New',
  title:'A new browser agent for hosted runs.',
  summary:'Hosted task runs use a new agent. It checks each step against your goal as it works and can export the run as a Playwright test.',
  items:[['New','Where your task says “verify”, the agent checks it during the run, and the exported test contains the same check at the same point.'],
   ['New','Saved logins (`{{username}}`, `{{password}}`, `{{totp}}`) and protected values are typed only when needed, and only on your project’s hosts.'],
   ['New','Sites behind your own bot protection: a project setting makes hosted runs and exported tests send a secret header only to your hosts.'],
   ['Improved','Runs and their recordings are named after their goal.']],
  link:['/docs/platform/bot-protection','Bot protection setup']},
 {id:'2026-10-24-debugger-failure-reason',date:'2026-10-24',areas:['Dashboard'],type:'Fixed',
  title:'The run debugger shows the real failure reason.',
  summary:'The debugger now shows the reason saved with the failed run instead of a generic message.',
  items:[]},
 {id:'2026-10-21-new-dashboard',date:'2026-10-21',areas:['Dashboard'],type:'New',
  title:'A new dashboard.',
  summary:'Home starts with one box, “What should Molar do?”, and the rest is organised around Tasks, Tests, Runs, Issues, mock services, Recordings and Releases.',
  items:[['Improved','Chat has no message cap, can create saved tests, and conversations can be deleted.'],
   ['Improved','Clearer feedback while the agent acts.']]},
 {id:'2026-10-16-test-ids-and-spend-limit',date:'2026-10-16',areas:['Exports','Beta terms'],type:'Improved',
  title:'Exports use your app’s own test IDs.',
  summary:'If your app marks elements with a test-id attribute, such as `data-test`, exported tests use it.',
  items:[['Changed','A run that reaches the daily AI spend limit ends with `spend_limit_reached`.']]},
 {id:'2026-10-15-free-beta',date:'2026-10-15',areas:['Beta terms','Website & docs'],type:'Changed',
  title:'Molar is free during the beta.',
  summary:'No card and no plan to pick. Each organization gets up to 25 hosted runs and $10 of AI model use a day, reset at 00:00 UTC. The 26th run is refused with HTTP 429 `daily_run_limit_reached`.',
  items:[['New','Privacy policy, terms of service, a data processing addendum, a subprocessors list and a security page.'],
   ['New','A public status page at [status.molar.it](https://status.molar.it), checked every 5 minutes.'],
   ['New','Docs pages for limits, ad blocking and cross-app flows.']],
  link:['/pricing','Pricing']},
 {id:'2026-10-15-cli-0-3-12',date:'2026-10-15',areas:['CLI & MCP'],type:'New',
  title:'@molar/cli 0.3.12.',
  summary:'The first CLI release since August. It brings hosted exports, saved browser profiles and the Guard commands to the terminal.',
  code:['Install or upgrade','npm install -g @molar/cli'],
  items:[['New','`molar run --execution hosted --export <dir>` downloads the replay-checked test package.'],
   ['New','`--block-ads`, `--profile` and `molar profiles`, `molar explain`.'],
   ['New','`molar guard failures`, `preflight` and `promote`; `molar mender status`; `molar requests`; `molar branches`; `molar scenarios publish`.']],
  link:['/docs/platform/cli','CLI reference']},
 {id:'2026-10-15-guard-action',date:'2026-10-15',areas:['Guard'],type:'New',
  title:'The Guard GitHub Action.',
  summary:'Add `pratikranaa/guard-action@v1` to a workflow to run a registered scenario on every pull request. Start in advisory mode, then make it a required check.',
  code:['.github/workflows/molar.yml','- uses: pratikranaa/guard-action@v1\n  with:\n    api-key: ${{ secrets.MOLAR_API_KEY }}\n    scenario-id: checkout\n    base-url: https://staging.your-app.com\n    mode: advisory'],
  items:[],link:['/integrations/github-actions','GitHub Actions guide']},
 {id:'2026-10-13-ads-and-cross-app',date:'2026-10-13',areas:['Agent runs'],type:'New',
  title:'Block ads, and follow your app to other sites.',
  summary:'Ad-heavy pages slow runs and break exported tests. `--block-ads` blocks well-known ad and consent hosts in the hosted browser and in the exported test.',
  items:[['New','The agent can follow your app to other public sites, such as an OAuth sign-in or a hosted checkout. Private addresses stay blocked.']],
  link:['/docs/platform/block-ads','Ad blocking']},
 {id:'2026-10-09-retention',date:'2026-10-09',areas:['Beta terms','Exports'],type:'Changed',
  title:'Run recordings are kept for 5 days.',
  summary:'Screenshots, video, network captures and Playwright traces are deleted automatically after 5 days. Download anything you need to keep. Exported tests stay in your account.',
  items:[['Improved','Exported tests put one statement on each line.']]},
 {id:'2026-10-07-readable-exports',date:'2026-10-07',areas:['Exports'],type:'Improved',
  title:'Exported tests read like hand-written Playwright.',
  summary:'Exports find elements by their role and label where the page provides them, so tests are easier to review and keep.',
  items:[]},
 {id:'2026-10-05-dashboard-fixes',date:'2026-10-05',areas:['Dashboard'],type:'Fixed',
  title:'Dashboard fixes.',
  summary:'Clearer error messages with a way to recover, account navigation that works on phones, and Runs filters that stay in the URL so you can share them.',
  items:[]},
 {id:'2026-10-01-mender-schedules',date:'2026-10-01',areas:['Guard'],type:'New',status:'Preview',
  title:'Scheduled-run failures go to Mender.',
  summary:'When a scheduled Guard run fails and Mender is on, the failure is passed to Mender for a fix suggestion.',
  items:[],link:['/products/mender','Mender']},
 {id:'2026-09-29-pr-evidence-links',date:'2026-09-29',areas:['Guard'],type:'Fixed',
  title:'Pull request checks link to evidence you can open.',
  summary:'Check results on a pull request linked to screenshots nobody outside Molar could open. They now link to the run’s evidence in the dashboard.',
  items:[]},
 {id:'2026-09-27-public-check-results',date:'2026-09-27',areas:['Website & docs'],type:'Improved',
  title:'The public page check explains incomplete results.',
  summary:'When [the public check](/verify) can’t finish, it now says why instead of showing an empty result.',
  items:[]},
 {id:'2026-09-07-signed-in-navigation',date:'2026-09-07',areas:['Dashboard','Website & docs'],type:'Improved',
  title:'Signed-in visitors go straight to the dashboard.',
  summary:'If you are already signed in, the sign-in and sign-up pages take you to the dashboard, and molar.it’s navigation shows that you are signed in.',
  items:[]},
 {id:'2026-09-05-new-website',date:'2026-09-05',areas:['Website & docs'],type:'New',
  title:'A new molar.it.',
  summary:'Product pages, a searchable catalog of Clones, an MCP setup page, practical QA guides, and a free check of any public page.',
  items:[],link:['/verify','Check a public page']},
 {id:'2026-09-04-hosted-runs-reopen',date:'2026-09-04',areas:['Beta terms','Dashboard'],type:'Changed',
  title:'Hosted runs reopen as a private beta.',
  summary:'Hosted runs were paused on August 13. They are back, with sign-in by email link, personal API tokens you can see and revoke, and a way to cancel a run.',
  items:[]},
 {id:'2026-08-16-one-dashboard',date:'2026-08-16',areas:['Dashboard'],type:'New',
  title:'One dashboard for every Molar product.',
  summary:'Cartographer, Clones, Guard and Trace share one dashboard at app.molar.it, with one navigation and one set of organization settings.',
  items:[]},
 {id:'2026-08-04-mcp-setup',date:'2026-08-04',areas:['CLI & MCP'],type:'New',
  title:'Connect any MCP client.',
  summary:'[mcp.molar.it](https://mcp.molar.it) has setup steps for 25 MCP clients, and the hosted server is at `https://api.molar.it/mcp`.',
  code:['Claude Code','claude mcp add --transport http molar https://api.molar.it/mcp'],
  items:[]},
 {id:'2026-08-02-cli-0-3-6',date:'2026-08-02',areas:['CLI & MCP'],type:'Improved',
  title:'@molar/cli 0.3.6 and @molar/reporter 0.3.6.',
  summary:'Clearer run output in the CLI, and the first reporter for sending results from an existing Playwright or Cypress suite.',
  items:[]}
];

const fmt=(d,opts)=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',...opts});
const longDate=d=>fmt(d,{month:'long',day:'numeric',year:'numeric'});
const shortDate=d=>fmt(d,{month:'short',day:'numeric'});
const monthOf=d=>fmt(d,{month:'long',year:'numeric'});
const slug=a=>a.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// Inline markup: `code` and [label](href). Everything else is escaped.
const inline=t=>esc(t).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
const plain=t=>t.replace(/`([^`]+)`/g,'$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1');

function entryHtml(r){
  const areas=r.areas.map(a=>`<span class="cl-area">${esc(a)}</span>`).join('');
  return `<article class="cl-entry" id="${r.id}" data-areas="${r.areas.map(slug).join(' ')}">
  <div class="cl-when"><a class="cl-date" href="#${r.id}" aria-label="Link to this update"><time datetime="${r.date}">${shortDate(r.date)}</time></a></div>
  <div class="cl-body">
    <p class="cl-tags"><span class="cl-type cl-type-${r.type.toLowerCase()}">${r.type}</span>${r.status?`<span class="cl-status">${r.status}</span>`:''}${areas}</p>
    <h3>${inline(r.title)}</h3>
    <p class="cl-summary">${inline(r.summary)}</p>
    ${r.code?`<div class="cl-code"><span>${esc(r.code[0])}</span><pre><code>${esc(r.code[1])}</code></pre></div>`:''}
    ${r.items.length?`<ul class="cl-items">${r.items.map(([t,x])=>`<li><span class="cl-item-type">${t}</span><span>${inline(x)}</span></li>`).join('')}</ul>`:''}
    ${r.link?`<a class="text-link" href="${r.link[0].startsWith('/docs')?'https://docs.molar.it'+r.link[0]:r.link[0]}">${esc(r.link[1])} ${icon('arrow')}</a>`:''}
  </div>
</article>`;
}

export function changelogBody(cta){
  const months=[...new Set(releases.map(r=>monthOf(r.date)))];
  const latest=releases[0].date;
  return `<main id="main"><section class="reading-hero cl-hero"><div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/resources">Resources</a>${icon('chevron')}<span>Changelog</span></nav>
  <div class="cl-hero-grid"><div>
    <h1>Changelog</h1>
    <p class="cl-lead">Every change to Molar you can see or use, newest first. Molar is in beta; anything marked Preview may still change. Last updated <time datetime="${latest}">${longDate(latest)}</time>.</p>
    <p class="cl-subscribe"><a href="/changelog.xml">${icon('arrow')} RSS feed</a><a href="/changelog.md">${icon('arrow')} Markdown for agents</a><a href="https://status.molar.it">${icon('arrow')} Service status</a></p>
  </div>
  <aside class="cl-versions" aria-label="Current package versions"><h2>Current versions</h2><dl>${versions.map(([name,v,d,cmd])=>`<div><dt><code>${esc(name)}</code></dt><dd><strong>${v}</strong> · ${longDate(d)}</dd><dd class="cl-cmd"><code>${esc(cmd)}</code></dd></div>`).join('')}</dl></aside>
  </div></div></section>
<section class="section cl-section"><div class="wrap">
  <div class="cl-filters" role="group" aria-label="Filter updates by area"><button type="button" data-cl-filter="all" aria-pressed="true">All</button>${AREAS.map(a=>`<button type="button" data-cl-filter="${slug(a)}" aria-pressed="false">${esc(a)}</button>`).join('')}</div>
  <p class="cl-count" data-cl-count role="status" aria-live="polite">${releases.length} updates</p>
  ${months.map(m=>`<section class="cl-month" data-cl-month><h2>${m}</h2>${releases.filter(r=>monthOf(r.date)===m).map(entryHtml).join('')}</section>`).join('')}
</div></section>
<script>
(()=>{const buttons=[...document.querySelectorAll('[data-cl-filter]')],count=document.querySelector('[data-cl-count]');
const apply=f=>{let shown=0;document.querySelectorAll('.cl-entry').forEach(e=>{const on=f==='all'||e.dataset.areas.split(' ').includes(f);e.hidden=!on;if(on)shown++});
document.querySelectorAll('[data-cl-month]').forEach(m=>{m.hidden=!m.querySelector('.cl-entry:not([hidden])')});
buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clFilter===f)));count.textContent=shown+(shown===1?' update':' updates')};
buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.clFilter)));})();
</script>
${cta}</main>`;
}

const xml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const absolute=h=>h.replace(/href="\//g,`href="${SITE}/`);
export function changelogRss(){
  const items=releases.map(r=>{const link=`${SITE}/changelog#${r.id}`;
    const html=absolute(`<p>${inline(r.summary)}</p>${r.code?`<pre><code>${esc(r.code[1])}</code></pre>`:''}${r.items.length?`<ul>${r.items.map(([t,x])=>`<li><strong>${t}:</strong> ${inline(x)}</li>`).join('')}</ul>`:''}`);
    return `    <item>
      <title>${xml(plain(r.title))}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(r.date+'T12:00:00Z').toUTCString()}</pubDate>
${[r.type,...r.areas,...(r.status?[r.status]:[])].map(c=>`      <category>${xml(c)}</category>`).join('\n')}
      <description>${xml(plain(r.summary))}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`}).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Molar changelog</title>
    <link>${SITE}/changelog</link>
    <description>Every change to Molar you can see or use.</description>
    <language>en</language>
    <lastBuildDate>${new Date(releases[0].date+'T12:00:00Z').toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/changelog.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export function changelogMarkdown(){
  const md=t=>t.replace(/\]\(\//g,`](${SITE}/`);
  const months=[...new Set(releases.map(r=>monthOf(r.date)))];
  return `# Molar changelog

> For AI agents: this is every customer-visible change to Molar, newest first, regenerated on every deploy. Site index: ${SITE}/llms.txt. RSS: ${SITE}/changelog.xml. Web page: ${SITE}/changelog.

## Current versions

${versions.map(([n,v,d,cmd])=>`- \`${n}\` ${v} (${d}): \`${cmd}\``).join('\n')}

${months.map(m=>`## ${m}\n\n${releases.filter(r=>monthOf(r.date)===m).map(r=>`### ${r.date} · ${plain(r.title)}\n\n${r.type}${r.status?` · ${r.status}`:''} · ${r.areas.join(', ')} · ${SITE}/changelog#${r.id}\n\n${md(r.summary)}\n${r.code?`\n\`\`\`\n${r.code[1]}\n\`\`\`\n`:''}${r.items.length?`\n${r.items.map(([t,x])=>`- **${t}:** ${md(x)}`).join('\n')}\n`:''}`).join('\n')}`).join('\n')}`;
}
