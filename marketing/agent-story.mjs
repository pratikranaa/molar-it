import {icon} from './components.mjs';

// The agent loop and run-result copy on the homepage (2026-11-11). Everything described here is live:
// molar verify / test / run, MCP molar_verify / molar_run_task, run page, share link, Guard PR comment.

const loop=[
 ['Your agent writes it','A coding agent changes the code.'],
 ['Molar checks it','It uses the app in a real browser.'],
 ['A result with proof','Pass or fail, the answer, the checks and a recording.'],
 ['The agent fixes it','It reads the failure and changes the code.'],
 ['It passes','The check runs again and passes.'],
];

export function agentLoop(){
 return `<ol class="agent-loop" aria-label="How a coding agent uses Molar">${loop.map(([title,detail],i)=>`<li><span class="agent-loop-number" aria-hidden="true">${i+1}</span><strong>${title}</strong><small>${detail}</small></li>`).join('')}</ol>`;
}

const results=[
 ['search','The answer and its proof','The answer Molar found, and the text on the page that backs it up.'],
 ['check','Checks on the final page','Each check is marked passed or failed, so you can see what was confirmed.'],
 ['play','A recording','A video of the whole run. Watch it live while it runs, or replay it afterward.'],
 ['code','A Playwright test you keep','Every passing run leaves a test. Download it, open a pull request into your GitHub repo, or add it to your Molar tests to run on every pull request.'],
 ['globe','A link to share','Share a run publicly and anyone with the link sees the task, the result, the answer, the proof and the checks, with no sign-up. You choose whether to include the video.'],
 ['shield','A verdict when it fails','A failed run is labelled Bug, Flaky or Test drift. For test drift, Molar also gives you a repaired test.'],
];

export function runResults(){
 return `<section class="section run-results" id="run-results"><div class="wrap"><div class="section-heading"><h2>What you get back<br>from every run.</h2><p>The proof comes with the result: to your coding agent in one call, and to you on the run page.</p></div><div class="run-results-grid">${results.map(([name,title,body])=>`<article>${icon(name)}<h3>${title}</h3><p>${body}</p></article>`).join('')}</div><p class="run-results-trust">${icon('lock')}<span>When Molar can’t confirm something, it says so and shows you what it saw. It doesn’t guess.</span></p></div></section>`;
}

// What reviewers see in the pull request: the same headline words Guard posts.
export function prComments(){
 return `<div class="pr-comments"><article class="pr-comment is-fail"><header><span>Pull request #52</span><small>First push</small></header><h4>${icon('x')}Molar found a problem</h4><p class="pr-comment-summary">1 scenario failed · 2 passed · 3 total</p><p class="pr-comment-link">${icon('play')}Watch the recording</p><div class="pr-comment-detail"><strong>Invite a teammate</strong><span><b>Bug</b> · The invitation email never arrived in the test inbox.</span></div></article><article class="pr-comment is-pass"><header><span>Pull request #52</span><small>After the fix</small></header><h4>${icon('check')}Verified by Molar</h4><p class="pr-comment-summary">3 scenarios passed · 3 total</p><p class="pr-comment-link">${icon('play')}Watch the recording</p></article></div>`;
}

export const failedRun=`$ molar verify "a new customer can sign up and reach the dashboard" \\
    --url http://localhost:3000 --json
{
  "ok": false,
  "status": "failed",
  "answer": "After Create account the page shows “Something went wrong”.",
  "checks": [
    { "code": "dashboard_heading_visible", "ok": false }
  ],
  "run_url": "https://app.molar.it/runs/tr_8f3a2c",
  "error": {
    "code": "assertion_failed",
    "hint": "Open run_url to see what the browser did."
  }
}`;

export const passedRun=`{
  "ok": true,
  "status": "passed",
  "answer": "The dashboard opens with “Welcome, Sam”.",
  "checks": [
    { "code": "dashboard_heading_visible", "ok": true },
    { "code": "no_error_banner", "ok": true }
  ],
  "run_url": "https://app.molar.it/runs/tr_c41d90"
}`;
