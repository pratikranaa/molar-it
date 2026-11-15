import {APP,icon,cta,faq} from './components.mjs';

// The /benchmarks page and the homepage strip (2026-11-15). Every number is copied from the Molar repo:
// STATUS.md entries of 12-14 November 2026 and molar-cartographer/benchmarks/ (webvoyager, online-mind2web,
// webtestbench, bu-bench, v2-eval/results/README.md). Nothing here is rounded, estimated or invented.
// Layout patterns adopted from Browser Use (benchmarks/agents), Stagehand (stagehand.dev/evals),
// Anthropic model pages (footnoted tables) and Aside (stated skepticism, harness vs model): see the
// build report. No code or copy was taken from those pages.

const pct=(n,d)=>Math.round(n/d*1000)/10;
const bar=(value,max=100)=>`<span class="bm-bar" aria-hidden="true"><span style="width:${Math.min(100,value/max*100).toFixed(1)}%"></span></span>`;
const ext=(href,label)=>`<a class="text-link" href="${href}" rel="noopener">${label} ${icon('arrow')}</a>`;

export const stats=[
 {id:'online-mind2web',name:'Online-Mind2Web',value:'72.3%',sub:'217 of 300 tasks',judge:'Judge: WebJudge, GPT-6 Luna'},
 {id:'webvoyager',name:'WebVoyager',value:'69.7%',sub:'411 of 590 tasks',judge:'Judge: its own prompt, GPT-6 Luna'},
 {id:'webtestbench',name:'WebTestBench',value:'53.7',sub:'Defect F1, 100 apps',judge:'Scored by the benchmark’s own scorer'},
];

const statTiles=(tag='div')=>stats.map(s=>`<a class="bm-stat" href="/benchmarks#${s.id}"><span class="bm-stat-name">${s.name}</span><span class="bm-stat-value">${s.value}</span><span class="bm-stat-sub">${s.sub}</span></a>`).join('');

// Compact band for the homepage, between the real-run example and the developer section.
export const benchmarkStrip=()=>`<section class="bm-strip" aria-labelledby="bm-strip-title"><div class="wrap"><div class="bm-strip-head"><div><h2 id="bm-strip-title">Benchmark results.</h2><p>Molar’s browser agent on public browser-agent benchmarks.</p></div><a class="text-link" href="/benchmarks">See all benchmarks ${icon('arrow')}</a></div><div class="bm-stats bm-stats-strip">${statTiles()}</div></div></section>`;

const rows=[
 {id:'online-mind2web',name:'Online-Mind2Web',score:'72.3%',tasks:'300',judge:'WebJudge (OSU prompts unchanged), GPT-6 Luna',date:'12 Nov 2026',agent:'414dbb79d',cmp:'Not submitted to the leaderboard. Auto-graded, no human review.'},
 {id:'webvoyager',name:'WebVoyager',score:'69.7%',tasks:'590',judge:'WebVoyager’s auto-eval prompt, GPT-6 Luna',date:'14 Nov 2026',agent:'ec5c0d044',cmp:'Not directly. Published scores use other judges.'},
 {id:'webtestbench',name:'WebTestBench',score:'53.7 F1',tasks:'100 apps',judge:'The benchmark’s own scorer, unmodified',date:'14 Nov 2026',agent:'fa7a92cd8',cmp:'Not directly. Different harness; oracle-checklist setting.'},
 {id:'browser-use-bench',name:'Browser Use Bench V2.1',score:'30.4 / 100',tasks:'200',judge:'Browser Use’s findings judge, GPT-5.6 Luna (xhigh)',date:'13 Nov 2026',agent:'',cmp:'Partly. Same grader, shorter time budget.'},
];

const resultsTable=()=>`<div class="bm-table-wrap"><table class="bm-table"><caption class="bm-sr">Molar v2 results by benchmark</caption><thead><tr><th scope="col">Benchmark</th><th scope="col">Score</th><th scope="col">Tasks</th><th scope="col">Judge</th><th scope="col">Run</th><th scope="col">Agent build</th><th scope="col">Same as the public leaderboard?</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row" data-label="Benchmark"><a href="#${r.id}">${r.name}</a></th><td data-label="Score" class="bm-num">${r.score}</td><td data-label="Tasks">${r.tasks}</td><td data-label="Judge">${r.judge}</td><td data-label="Run">${r.date}</td><td data-label="Agent build">${r.agent?`<code>${r.agent}</code>`:'Not recorded'}</td><td data-label="Leaderboard">${r.cmp}</td></tr>`).join('')}</tbody></table></div><p class="bm-foot">Scores are tasks passed out of tasks run, unless noted. A task with no result counts as a failure. The agent is Molar v2 on GPT-6 Luna in every row. “Agent build” is the commit that ran the benchmark; the Browser Use run does not record one.</p>`;

const facts=list=>`<dl class="bm-facts">${list.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const note=(title,body)=>`<div class="bm-note"><h4>${title}</h4>${body}</div>`;
const miniBars=items=>`<ul class="bm-mini">${items.map(([label,n,d,text])=>`<li><span class="bm-mini-label">${label}</span>${bar(d?pct(n,d):n)}<span class="bm-mini-value">${text||`${n}/${d}`}</span></li>`).join('')}</ul>`;

const sites=[['Allrecipes',36,40],['Amazon',28,38],['Apple',30,34],['ArXiv',32,42],['BBC News',22,34],['Booking',13,40],['Cambridge Dictionary',1,43],['Coursera',36,40],['ESPN',35,41],['GitHub',31,39],['Google Flights',9,39],['Google Map',31,38],['Google Search',33,40],['Hugging Face',31,36],['Wolfram Alpha',43,46]].sort((a,b)=>b[1]/b[2]-a[1]/a[2]);
const siteList=`<ul class="bm-sites">${sites.map(([n,p,d])=>`<li><span class="bm-mini-label">${n}</span>${bar(pct(p,d))}<span class="bm-mini-value">${p}/${d}</span></li>`).join('')}</ul>`;

const card=({id,eyebrow,name,measures,score,scoreNote,visual,factsList,caveat,method,links})=>`<article class="bm-card" id="${id}"><div class="bm-card-main"><p class="bm-eyebrow">${eyebrow}</p><h3>${name}</h3><p class="bm-measures">${measures}</p><div class="bm-score"><strong>${score}</strong><span>${scoreNote}</span></div>${visual}</div><div class="bm-card-side">${facts(factsList)}${caveat}<div class="bm-method"><h4>How it was run</h4>${method}</div><div class="bm-links">${links}</div></div></article>`;

const cards=()=>[
 card({id:'online-mind2web',eyebrow:'Web tasks · graded by a model',name:'Online-Mind2Web',
  measures:'Whether an agent can finish tasks that people do on live websites. 300 tasks, split into easy, medium and hard.',
  score:'72.3%',scoreNote:'217 of 300 tasks',
  visual:miniBars([['Easy',70,80],['Medium',106,141],['Hard',41,79]]),
  factsList:[['Judge','WebJudge from the benchmark’s repository, prompts unchanged, with GPT-6 Luna'],['Run','Graded 12 November 2026'],['Agent build','<code>414dbb79d</code>, Molar v2 on GPT-6 Luna'],['Tasks','300, three at a time']],
  caveat:note('Read before comparing','<p>This is not a leaderboard result. We have not submitted it, and no human graded it. The leaderboard’s own grading is a different method from the one we ran.</p><p>27 of the 300 runs ended on a bug in the agent’s final check, since fixed; they count as failures. Molar’s own verdict was 210 of 300 and disagreed with WebJudge on 59 tasks. The agent has changed since this build.</p>'),
  method:'<p>Each task starts on its own website, in a fresh 1440×900 browser (CloakBrowser) with a 900 second budget. The judge sees the actions and screenshots, not the agent’s final answer.</p>',
  links:ext('https://arxiv.org/abs/2504.01382','Paper')+ext('https://github.com/OSU-NLP-Group/Online-Mind2Web','Benchmark repository')}),
 card({id:'webvoyager',eyebrow:'Web tasks · graded by a model',name:'WebVoyager',
  measures:'Whether an agent can complete tasks on 15 popular live websites, such as Amazon, GitHub and Google Flights.',
  score:'69.7%',scoreNote:'411 of 590 tasks',
  visual:siteList,
  factsList:[['Judge','WebVoyager’s own auto-eval prompt, with GPT-6 Luna instead of their GPT-4V, which is retired. It sees the last 15 screenshots.'],['Run','14 November 2026'],['Agent build','<code>ec5c0d044</code>, Molar v2 on GPT-6 Luna (medium), CloakBrowser'],['Tasks','590: the original 643 as patched by Magnitude (53 removed, 68 re-dated or reworded)'],['Typical task','Median 160 seconds and 13 steps. About $12.7 in model cost for all 590.']],
  caveat:note('Read before comparing','<p>Other published runs used other judge models, so the scores are not directly comparable.</p><p><strong>Where it fails.</strong> Cambridge Dictionary scored 1 of 43: a Cloudflare challenge that the agent never cleared. 97 tasks name a date that is now in the past, mostly on Google Flights and Booking, and they pass 30 of 97. Without those 97 the score is 381 of 493 (77.3%).</p><p><strong>Reruns.</strong> 44 tasks first failed on infrastructure and were rerun on the same agent: 13 on the benchmark machine after its disk filled, and 31 Wolfram Alpha tasks on a Mac with a residential IP, because the cloud machine’s IP cannot open wolframalpha.com. Before the reruns the score was 378 of 590 (64.1%).</p>'),
  method:'<p>The tasks ran on the same harness and browser as Online-Mind2Web. A task with no result counts as a failure.</p>',
  links:ext('https://arxiv.org/abs/2401.13919','Paper')+ext('https://github.com/MinorJerry/WebVoyager','Benchmark repository')+ext('https://github.com/magnitudedev/webvoyager','Patched task list (Magnitude)')}),
 card({id:'webtestbench',eyebrow:'QA · bug finding',name:'WebTestBench',
  measures:'Whether an agent that tests a web app finds the bugs in it. 100 small generated apps with 1,750 checklist items, 448 of them real defects.',
  score:'53.7',scoreNote:'Defect F1, benchmark scorer unmodified',
  visual:miniBars([['Precision',45.7,0,'45.7'],['Recall',75.0,0,'75.0'],['F1',53.7,0,'53.7']]),
  factsList:[['Scorer','The benchmark’s own scorer, unmodified. In this setting it aligns items by order, so no model grades the result.'],['Run','14 November 2026'],['Agent build','<code>fa7a92cd8</code>, Molar v2 on GPT-6 Luna'],['Apps','100. One returned no result and counts as a failure; over the 99 scored, F1 is 54.3.']],
  caveat:note('Read before comparing','<p>We ran the oracle-checklist setting, where the agent is given the benchmark’s checklist. The end-to-end setting, where the agent writes its own checklist, has not been run in full.</p><p>The paper reports a best oracle F1 of 49.2 (Claude Sonnet 4.5) and 46.8 (GPT-5.1). That used a different harness, so treat the two as context, not a head-to-head.</p>'),
  method:'<p>One agent run per checklist item, each in a fresh browser, with 15 steps and 240 seconds per item. The agent sees screenshots; the paper’s baseline reads the page structure only. It finds more problems than the gold labels list, which costs precision.</p>',
  links:ext('https://arxiv.org/abs/2603.25226','Paper')+ext('https://github.com/friedrichor/WebTestBench','Benchmark repository')+ext('https://huggingface.co/datasets/friedrichor/WebTestBench','Dataset')}),
 card({id:'browser-use-bench',eyebrow:'Long web tasks · partial credit',name:'Browser Use Bench V2.1',
  measures:'Long, multi-part tasks on the open web, graded against a weighted rubric, so a partial answer earns partial credit.',
  score:'30.4',scoreNote:'out of 100, 200 tasks',
  visual:miniBars([['Score',30.4,100,'30.4 / 100']]),
  factsList:[['Judge','Browser Use’s own findings judge, unchanged, with GPT-5.6 Luna at xhigh reasoning'],['Run','13 November 2026'],['Agent','Molar v2 on GPT-6 Luna (medium), open-web mode, CloakBrowser, no fetch service'],['Cost and time','$0.065 a task in model cost; median 16.7 minutes']],
  caveat:note('Read before comparing','<p>This is our lowest score. Browser Use publishes much higher results for its own agent and for models in its own harness. We ran a general-purpose agent with a 30 minute budget per task; Browser Use’s own runs allow 60. The agent build for this run was not recorded.</p>'),
  method:'<p>Tasks are decrypted in memory only, as the benchmark asks, and each starts on DuckDuckGo. Deliverables go in the final answer because Molar has no file output.</p>',
  links:ext('https://github.com/browser-use/benchmark','Benchmark repository')+ext('https://browser-use.com/benchmarks/agents','Browser Use leaderboard')}),
].join('');


const others=[
 ['WebVoyager','Magnitude','93.9% (554 of 590)','Same patched task list. The judge is an unnamed LLM judge, and the authors note false positives and negatives.','https://github.com/magnitudedev/webvoyager','Their repository'],
 ['WebVoyager','Browser Use','89.1%','Their own task set of 586, GPT-4o as the agent, and results reviewed by hand.','https://browser-use.com/posts/sota-technical-report','Their report'],
 ['WebTestBench','The benchmark’s paper','49.2 F1 (Claude Sonnet 4.5), 46.8 F1 (GPT-5.1)','Oracle-checklist setting like ours, but one agent session per app and page structure only.','https://arxiv.org/abs/2603.25226','The paper'],
];
const othersTable=()=>`<div class="bm-table-wrap"><table class="bm-table bm-others"><caption class="bm-sr">Scores published by others</caption><thead><tr><th scope="col">Benchmark</th><th scope="col">Who</th><th scope="col">Their score</th><th scope="col">What differs from our run</th><th scope="col">Source</th></tr></thead><tbody>${others.map(([b,who,score,diff,href,label])=>`<tr><th scope="row" data-label="Benchmark">${b}</th><td data-label="Who">${who}</td><td data-label="Their score" class="bm-num">${score}</td><td data-label="What differs from our run">${diff}</td><td data-label="Source"><a class="text-link" href="${href}" rel="noopener">${label}</a></td></tr>`).join('')}</tbody></table></div>`;

const principles=[
 ['globe','Real browsers','Runs drive a real browser through Playwright. Public-site tasks run on the live sites, so they change as the sites change.'],
 ['replay','A fresh session for every task','Each task starts in a new browser context, so one task can’t leave state behind for the next.'],
 ['code','No per-site rules','The agent gets the task and the page. When a site beats it, we change how the agent works, not add a rule for that site.'],
 ['shield','The judge is separate','A grader that is not the agent decides pass or fail, with each benchmark’s own method where it has one. The agent’s own verdict is recorded but does not count.'],
 ['x','False passes are the worst outcome','A false pass is a run where the agent says it succeeded and an independent check says it did not. A QA tool that does this can’t be trusted, so the release gate allows none.'],
 ['bolt','Every deploy is gated','Before an agent build goes live it runs the 39-task hosted eval. It needs at least 90% and zero false passes.'],
];
const howWeRun=()=>`<section class="section run-results bm-method-section" id="how-we-run"><div class="wrap"><div class="section-heading"><h2>How we run evals.</h2><p>The same rules apply to every number on this page.</p></div><div class="run-results-grid">${principles.map(([i,t,b])=>`<article>${icon(i)}<h3>${t}</h3><p>${b}</p></article>`).join('')}</div><p class="run-results-trust">${icon('lock')}<span>A task with no result counts as a failure. When we rerun tasks that failed on infrastructure, we show the score from before the rerun.</span></p></div></section>`;

const repro=[
 ['WebVoyager',[['https://arxiv.org/abs/2401.13919','Paper'],['https://github.com/MinorJerry/WebVoyager','Original repository'],['https://github.com/magnitudedev/webvoyager','Patched tasks (590)']],'Grade with the auto-eval prompt from the original repository.'],
 ['Online-Mind2Web',[['https://arxiv.org/abs/2504.01382','Paper'],['https://github.com/OSU-NLP-Group/Online-Mind2Web','Repository'],['https://huggingface.co/datasets/osunlp/Online-Mind2Web','Dataset (gated)']],'Grade with WebJudge from the repository.'],
 ['WebTestBench',[['https://arxiv.org/abs/2603.25226','Paper'],['https://github.com/friedrichor/WebTestBench','Repository and scorer'],['https://huggingface.co/datasets/friedrichor/WebTestBench','Dataset']],'We used their scorer at commit 0487306 and dataset revision 2feeec3.'],
 ['Browser Use Bench',[['https://github.com/browser-use/benchmark','Repository'],['https://browser-use.com/benchmarks/agents','Leaderboard']],'We used V2.1 at commit 77b4df339fe8 and its own judge.'],
];
const reproduce=()=>`<section class="section bm-repro" id="reproduce"><div class="wrap"><div class="section-heading"><h2>Reproduce it.</h2><p>Every benchmark here is public. Run your own agent, or ours, through the same grader.</p></div><div class="bm-repro-grid">${repro.map(([n,links,t])=>`<article><h3>${n}</h3><p>${t}</p><div class="bm-links">${links.map(([h,l])=>ext(h,l)).join('')}</div></article>`).join('')}</div><p class="bm-foot">Our harnesses are not public, and we have not published per-task traces from these runs.</p></div></section>`;

const faqs=[
 {q:'Why are your scores lower than the ones other companies publish?',a:'Some are, and we show them. Published scores often use a different judge, a patched task list or a longer time budget, and some are self-reported. We use the benchmark’s own grading where it still works, and say where we could not.'},
 {q:'Why GPT-6 Luna as the judge?',a:'WebVoyager’s original judge, GPT-4V, is retired, and Online-Mind2Web’s repository now points to GPT-6 Luna for WebJudge. We kept each benchmark’s prompts unchanged and changed only the model.'},
 {q:'Do these scores predict how Molar does on my app?',a:'Not directly. They measure a general browser agent on public tasks. The hosted regression eval is closer to what Molar does for you, but it is also our own test set. The best check is a run on your app.'},
 {q:'How often does this page change?',a:'When we rerun a benchmark. Each row shows the date of its run and the agent build.'},
];

export const benchmarksBody=({actions})=>`<main id="main" class="benchmarks-page"><section class="detail-hero identity-detail"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Molar</a>${icon('chevron')}<span>Benchmarks</span></nav><div class="bm-hero"><h1>How Molar’s agent scores on public benchmarks.</h1><p>Molar’s browser agent on four public benchmarks.</p>${actions('Get started free',APP,'How we run evals','#how-we-run')}<p class="bm-asof">Molar v2 on GPT-6 Luna. Results from 12 to 14 November 2026.</p></div></div></section><section class="section bm-stats-section" aria-label="Headline results"><div class="wrap"><div class="bm-stats">${statTiles()}</div></div></section><section class="section run-results bm-results" id="results"><div class="wrap"><div class="section-heading"><h2>All results.</h2><p>One row per benchmark. Select a name for details.</p></div>${resultsTable()}</div></section><section class="section bm-cards" id="benchmark-details"><div class="wrap"><div class="section-heading"><h2>Benchmark by benchmark.</h2><p>What each one measures and how we ran it.</p></div>${cards()}</div></section><section class="section muted-section bm-others-section" id="published-by-others"><div class="wrap"><div class="section-heading"><h2>Published by others.</h2><p>For context only. Judges, task sets, time limits and harnesses differ, so don’t read these as head-to-head results.</p></div>${othersTable()}</div></section>${howWeRun()}${reproduce()}${faq(faqs)}${cta('See what Molar finds in your app.','Create a free workspace and describe the first flow to test. The agent runs in a real browser and shows you what it saw.')}</main>`;

export const faqList=faqs;
export const description='How Molar’s browser agent scores on Online-Mind2Web, WebVoyager, WebTestBench and Browser Use Bench, with the judge, task count, date and caveats for each result.';
export const title='Benchmarks: How Molar’s Browser Agent Scores | Molar';
