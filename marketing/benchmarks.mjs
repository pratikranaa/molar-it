import {APP,icon,cta,faq} from './components.mjs';

// The /benchmarks page and the homepage strip (2026-11-15). Every number is copied from the Molar repo:
// STATUS.md entries of 12-14 November 2026 and molar-cartographer/benchmarks/ (online-mind2web, webtestbench). Nothing here is rounded, estimated or invented.
// Layout patterns adopted from Browser Use (benchmarks/agents), Stagehand (stagehand.dev/evals),
// Anthropic model pages (footnoted tables) and Aside (stated skepticism, harness vs model): see the
// build report. No code or copy was taken from those pages.

const pct=(n,d)=>Math.round(n/d*1000)/10;
const bar=(value,max=100)=>`<span class="bm-bar" aria-hidden="true"><span style="width:${Math.min(100,value/max*100).toFixed(1)}%"></span></span>`;
const ext=(href,label)=>`<a class="text-link" href="${href}" rel="noopener">${label} ${icon('arrow')}</a>`;

// Where each score would sit among published results. Online-Mind2Web: the 25 entries of Steel's leaderboard
// (github.com/steel-dev/leaderboard src/data/mind2web.json, updated 2026-10-11; judges differ per entry).
// WebTestBench: the two best oracle-setting results in the benchmark's paper (arXiv 2603.25226).
const OM2W_PUBLISHED=[97.0,93.0,90.53,90.0,89.4,88.2,83.6,78.7,71.0,69.0,66.7,65.0,61.3,61.0,57.3,56.3,55.0,55.0,51.0,45.7,30.7,30.0,30.0,29.0,28.0];
export const stats=[
 {id:'online-mind2web',name:'Online-Mind2Web',value:'72.3%',sub:'217 of 300 tasks',ours:72.3,published:OM2W_PUBLISHED,domain:[20,100],board:'Steel leaderboard, 25 published agents'},
 {id:'webtestbench',name:'WebTestBench',value:'53.7',sub:'Defect F1, 100 apps',ours:53.7,published:[49.2,46.8],domain:[40,60],board:'Best results in the benchmark’s paper'},
];
const rankOf=s=>s.published.filter(v=>v>s.ours).length+1;
// A number line of the published scores with ours marked: rank first, the dots show how far ahead or behind.
const rankStrip=s=>{const [lo,hi]=s.domain,at=v=>((v-lo)/(hi-lo)*100).toFixed(2),rank=rankOf(s),of=s.published.length+1;
 return `<span class="bm-rank"><span class="bm-rank-label"><b>#${rank}</b> of ${of}</span><span class="bm-rank-line" aria-hidden="true">${s.published.map(v=>`<i style="left:${at(v)}%"></i>`).join('')}<em style="left:${at(s.ours)}%"></em></span><span class="bm-rank-board">${s.board}</span></span>`};

const statTiles=(tag='div')=>stats.map(s=>`<a class="bm-stat" href="/benchmarks#${s.id}"><span class="bm-stat-name">${s.name}</span><span class="bm-stat-value">${s.value}</span><span class="bm-stat-sub">${s.sub}</span>${rankStrip(s)}</a>`).join('');

// Compact band for the homepage, between the real-run example and the developer section.
export const benchmarkStrip=()=>`<section class="bm-strip" aria-labelledby="bm-strip-title"><div class="wrap"><div class="bm-strip-head"><div><h2 id="bm-strip-title">Benchmark results.</h2><p>Molar’s browser agent on public browser-agent benchmarks.</p></div><a class="text-link" href="/benchmarks">See all benchmarks ${icon('arrow')}</a></div><div class="bm-stats bm-stats-strip">${statTiles()}</div></div></section>`;

const rows=[
 {id:'online-mind2web',name:'Online-Mind2Web',score:'72.3%',tasks:'300',judge:'WebJudge (OSU prompts unchanged), GPT-6 Luna',date:'12 Nov 2026',agent:'414dbb79d',cmp:'Not submitted to the leaderboard. Auto-graded, no human review.'},
 {id:'webtestbench',name:'WebTestBench',score:'53.7 F1',tasks:'100 apps',judge:'The benchmark’s own scorer, unmodified',date:'14 Nov 2026',agent:'fa7a92cd8',cmp:'Not directly. Different harness; oracle-checklist setting.'},
];

const resultsTable=()=>`<div class="bm-table-wrap"><table class="bm-table"><caption class="bm-sr">Molar v2 results by benchmark</caption><thead><tr><th scope="col">Benchmark</th><th scope="col">Score</th><th scope="col">Tasks</th><th scope="col">Judge</th><th scope="col">Run</th><th scope="col">Agent build</th><th scope="col">Same as the public leaderboard?</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row" data-label="Benchmark"><a href="#${r.id}">${r.name}</a></th><td data-label="Score" class="bm-num">${r.score}</td><td data-label="Tasks">${r.tasks}</td><td data-label="Judge">${r.judge}</td><td data-label="Run">${r.date}</td><td data-label="Agent build">${r.agent?`<code>${r.agent}</code>`:'Not recorded'}</td><td data-label="Leaderboard">${r.cmp}</td></tr>`).join('')}</tbody></table></div><p class="bm-foot">Scores are tasks passed out of tasks run, unless noted. A task with no result counts as a failure. The agent is Molar v2 on GPT-6 Luna in every row. “Agent build” is the commit that ran the benchmark.</p>`;

const facts=list=>`<dl class="bm-facts">${list.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const note=(title,body)=>`<div class="bm-note"><h4>${title}</h4>${body}</div>`;
const miniBars=items=>`<ul class="bm-mini">${items.map(([label,n,d,text])=>`<li><span class="bm-mini-label">${label}</span>${bar(d?pct(n,d):n)}<span class="bm-mini-value">${text||`${n}/${d}`}</span></li>`).join('')}</ul>`;


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
 card({id:'webtestbench',eyebrow:'QA · bug finding',name:'WebTestBench',
  measures:'Whether an agent that tests a web app finds the bugs in it. 100 small generated apps with 1,750 checklist items, 448 of them real defects.',
  score:'53.7',scoreNote:'Defect F1, benchmark scorer unmodified',
  visual:miniBars([['Precision',45.7,0,'45.7'],['Recall',75.0,0,'75.0'],['F1',53.7,0,'53.7']]),
  factsList:[['Scorer','The benchmark’s own scorer, unmodified. In this setting it aligns items by order, so no model grades the result.'],['Run','14 November 2026'],['Agent build','<code>fa7a92cd8</code>, Molar v2 on GPT-6 Luna'],['Apps','100. One returned no result and counts as a failure; over the 99 scored, F1 is 54.3.']],
  caveat:note('Read before comparing','<p>We ran the oracle-checklist setting, where the agent is given the benchmark’s checklist. The end-to-end setting, where the agent writes its own checklist, has not been run in full.</p><p>The paper reports a best oracle F1 of 49.2 (Claude Sonnet 4.5) and 46.8 (GPT-5.1). That used a different harness, so treat the two as context, not a head-to-head.</p>'),
  method:'<p>One agent run per checklist item, each in a fresh browser, with 15 steps and 240 seconds per item. The agent sees screenshots; the paper’s baseline reads the page structure only. It finds more problems than the gold labels list, which costs precision.</p>',
  links:ext('https://arxiv.org/abs/2603.25226','Paper')+ext('https://github.com/friedrichor/WebTestBench','Benchmark repository')+ext('https://huggingface.co/datasets/friedrichor/WebTestBench','Dataset')}),
].join('');


const others=[
 ['Online-Mind2Web','Navigator (Yutori)','78.7%','Human evaluation; 64.7% with WebJudge, the grader we used.','https://yutori.com/blog/introducing-navigator','Their post'],
 ['Online-Mind2Web','ChatGPT Atlas agent mode (OpenAI)','71.0%','Reported by OpenAI; judge and run data not published.','https://openai.com/index/introducing-gpt-5-4/','Their post'],
 ['Online-Mind2Web','OpenAI Operator','61.3%','From the benchmark paper.','https://arxiv.org/abs/2504.01382','The paper'],
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
 ['Online-Mind2Web',[['https://arxiv.org/abs/2504.01382','Paper'],['https://github.com/OSU-NLP-Group/Online-Mind2Web','Repository'],['https://huggingface.co/datasets/osunlp/Online-Mind2Web','Dataset (gated)']],'Grade with WebJudge from the repository.'],
 ['WebTestBench',[['https://arxiv.org/abs/2603.25226','Paper'],['https://github.com/friedrichor/WebTestBench','Repository and scorer'],['https://huggingface.co/datasets/friedrichor/WebTestBench','Dataset']],'We used their scorer at commit 0487306 and dataset revision 2feeec3.'],
];
const reproduce=()=>`<section class="section bm-repro" id="reproduce"><div class="wrap"><div class="section-heading"><h2>Reproduce it.</h2><p>Every benchmark here is public. Run your own agent, or ours, through the same grader.</p></div><div class="bm-repro-grid">${repro.map(([n,links,t])=>`<article><h3>${n}</h3><p>${t}</p><div class="bm-links">${links.map(([h,l])=>ext(h,l)).join('')}</div></article>`).join('')}</div><p class="bm-foot">Our harnesses are not public, and we have not published per-task traces from these runs.</p></div></section>`;

const faqs=[
 {q:'How do you rank against other agents?',a:'Ninth of 26 on Online-Mind2Web, counting the 25 agents on Steel’s leaderboard, and first of three on WebTestBench against the best results in its paper. Published scores use different judges and some are self-reported, so treat a rank as a placement, not a head-to-head result.'},
 {q:'Why GPT-6 Luna as the judge?',a:'Online-Mind2Web’s repository now points to GPT-6 Luna for WebJudge. We kept its prompts unchanged and changed only the model.'},
 {q:'Do these scores predict how Molar does on my app?',a:'Not directly. They measure a general browser agent on public tasks. The best check is a run on your app.'},
 {q:'How often does this page change?',a:'When we rerun a benchmark. Each row shows the date of its run and the agent build.'},
];

export const benchmarksBody=({actions})=>`<main id="main" class="benchmarks-page"><section class="detail-hero identity-detail"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Molar</a>${icon('chevron')}<span>Benchmarks</span></nav><div class="bm-hero"><h1>How Molar’s agent scores on public benchmarks.</h1><p>Molar’s browser agent on public benchmarks, and where it ranks among published results.</p>${actions('Get started free',APP,'How we run evals','#how-we-run')}<p class="bm-asof">Molar v2 on GPT-6 Luna. Results from 12 to 14 November 2026.</p></div></div></section><section class="section bm-stats-section" aria-label="Headline results"><div class="wrap"><div class="bm-stats">${statTiles()}</div></div></section><section class="section run-results bm-results" id="results"><div class="wrap"><div class="section-heading"><h2>All results.</h2><p>One row per benchmark. Select a name for details.</p></div>${resultsTable()}</div></section><section class="section bm-cards" id="benchmark-details"><div class="wrap"><div class="section-heading"><h2>Benchmark by benchmark.</h2><p>What each one measures and how we ran it.</p></div>${cards()}</div></section><section class="section muted-section bm-others-section" id="published-by-others"><div class="wrap"><div class="section-heading"><h2>Published by others.</h2><p>For context only. Judges, task sets, time limits and harnesses differ, so don’t read these as head-to-head results.</p></div>${othersTable()}</div></section>${howWeRun()}${reproduce()}${faq(faqs)}${cta('See what Molar finds in your app.','Create a free workspace and describe the first flow to test. The agent runs in a real browser and shows you what it saw.')}</main>`;

export const faqList=faqs;
export const description='How Molar’s browser agent scores on Online-Mind2Web and WebTestBench, and where it ranks among published results.';
export const title='Benchmarks: How Molar’s Browser Agent Scores | Molar';
