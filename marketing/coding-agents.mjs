import {APP,icon,codeBlock,faq,cta,DOCS} from './components.mjs';
import {quickCommand,agentHandoff} from './conversion.mjs';

// The /solutions/coding-agents page (2026-11-11; moved from /coding-agents, absorbs the retired /solutions/ai-agents). Everything described here is live:
// molar verify / test / run, MCP molar_verify / molar_run_task, live view, the run page, the Playwright test
// every passing run leaves, opt-in public share links, and the Guard pull request comment.

const loop=[
 ['Your agent writes it','A coding agent changes the code.'],
 ['Molar checks it','It uses the app in a real browser.'],
 ['A result with proof','Pass or fail, the answer, the checks and a recording.'],
 ['The agent fixes it','It reads the failure and changes the code.'],
 ['It passes','The check runs again and passes.'],
];

const agentLoop=()=>`<ol class="agent-loop" aria-label="How a coding agent uses Molar">${loop.map(([title,detail],i)=>`<li><span class="agent-loop-number" aria-hidden="true">${i+1}</span><strong>${title}</strong><small>${detail}</small></li>`).join('')}</ol>`;

const results=[
 ['search','The answer and its proof','The answer Molar found, and the text on the page that backs it up.'],
 ['check','Checks on the final page','Each check is marked passed or failed, so you can see what was confirmed.'],
 ['play','A recording','A video of the whole run. Watch it live while it runs, or replay it afterward.'],
 ['code','A Playwright test you keep','Every passing run leaves a test. Download it, open a pull request into your GitHub repo, or add it to your Molar tests to run on every pull request.'],
 ['globe','A link to share','Public links are opt-in. Choose Anyone with the link and the person you send it to sees the task, the result, the answer, the proof and the checks, with no sign-up. Including the video is optional.'],
 ['shield','A verdict when it fails','A failed run is labelled Bug, Flaky or Test drift. For test drift, Molar also gives you a repaired test.'],
];

const runResults=()=>`<section class="section run-results" id="run-results"><div class="wrap"><div class="section-heading"><h2>What you get back<br>from every run.</h2><p>The proof comes with the result: to your coding agent in one call, and to you on the run page.</p></div><div class="run-results-grid">${results.map(([name,title,body])=>`<article>${icon(name)}<h3>${title}</h3><p>${body}</p></article>`).join('')}</div><p class="run-results-trust">${icon('lock')}<span>When Molar can’t confirm something, it says so and shows you what it saw.</span></p></div></section>`;

const failedRun=`$ molar verify "a new customer can sign up and reach the dashboard" \\
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

const passedRun=`{
  "ok": true,
  "status": "passed",
  "answer": "The dashboard opens with “Welcome, Sam”.",
  "checks": [
    { "code": "dashboard_heading_visible", "ok": true },
    { "code": "no_error_banner", "ok": true }
  ],
  "run_url": "https://app.molar.it/runs/tr_c41d90"
}`;

const mcpCall=`molar_verify
  target: { "url": "http://localhost:3000" }
  claim:  "a new customer can sign up and reach the dashboard"`;

const oneCall=()=>`<section class="section developer-section" id="one-call"><div class="wrap developer-grid"><div><h2>One call.<br>A result your agent can act on.</h2><p><strong>Check after every code change.</strong> Edit the login form, check it on localhost, read the result, and run the same check again after the fix. Ask for something you can see, such as “the dashboard shows Welcome, Sam” or “the order says paid”.</p><p>The agent runs <code>molar verify</code> with a statement to check and a URL. Molar does the work in a real browser and returns the status, the answer, the checks and a link to the run. If the check failed, <code>error.hint</code> says where to look, and the agent fixes the code and runs it again.</p><p>Over MCP, the same check is the <code>molar_verify</code> tool. For a task instead of a statement, such as “find the latest invoice”, use <code>molar run</code> or the <code>molar_run_task</code> tool.</p><a class="text-link" href="/platform/developer-tools">Developer tools ${icon('arrow')}</a></div><div class="developer-results">${codeBlock(failedRun,'First run: the agent finds a bug')}${codeBlock(passedRun,'After the fix: the same check passes')}${codeBlock(mcpCall,'The same check as an MCP tool call')}</div></div></section>`;

const prComments=()=>`<div class="pr-comments"><article class="pr-comment is-fail"><header><span>Pull request #52</span><small>First push</small></header><h4>${icon('x')}Molar found a problem</h4><p class="pr-comment-summary">1 scenario failed · 2 passed · 3 total</p><p class="pr-comment-link">${icon('play')}Watch the recording</p><div class="pr-comment-detail"><strong>Invite a teammate</strong><span><b>Bug</b> · The invitation email never arrived in the test inbox.</span></div></article><article class="pr-comment is-pass"><header><span>Pull request #52</span><small>After the fix</small></header><h4>${icon('check')}Verified by Molar</h4><p class="pr-comment-summary">3 scenarios passed · 3 total</p><p class="pr-comment-link">${icon('play')}Watch the recording</p></article></div>`;

const reviewers=()=>`<section class="section muted-section coding-agents-prs" id="pull-requests"><div class="wrap developer-grid"><div><h2>Reviewers see the result<br>in the pull request.</h2><p>Guard runs your Molar tests on every pull request and posts one comment: <strong>Molar found a problem</strong> or <strong>Verified by Molar</strong>, with a link to the recording. A failure is labelled Bug, Flaky or Test drift, so a reviewer knows whether to fix the app or the test.</p><p>Every passing agent run can leave a Playwright test, and you can add it to your Molar tests so it runs on every pull request from then on.</p><a class="text-link" href="/products/guard">How Guard works ${icon('arrow')}</a></div><div>${prComments()}</div></div></section>`;

const setup=()=>`<section class="section developer-section" id="setup"><div class="wrap developer-grid"><div><h2>Connect your coding agent.</h2><p>Install the CLI, sign in once, and your agent can call <code>molar verify</code> from your project. Or connect Molar over MCP from Claude Code, Codex, Cursor and other MCP clients.</p>${quickCommand()}<p class="agent-setup-note"><a class="text-link" href="/platform/developer-tools">Set up the CLI and MCP ${icon('arrow')}</a></p></div><div>${codeBlock('molar verify "login works" --url http://localhost:3000 --json','After npm install -g @molar/cli and molar login')}<a class="text-link" href="${DOCS}/docs/getting-started/install">Set up Molar ${icon('arrow')}</a>${agentHandoff()}</div></div></section>`;

const testAccounts=()=>`<section class="section muted-section coding-agents-accounts" id="test-accounts"><div class="wrap developer-grid"><div><h2>Use test accounts.</h2><p>Runs open pages only on your project’s hosts. The agent doesn’t pause before a payment or a delete in the browser, so give it accounts and data you can afford to change.</p></div><div><ul class="check-bullets"><li>${icon('check')}A saved test account or credential reference for the site</li><li>${icon('check')}Stripe test mode, or the Stripe clone, for payments</li><li>${icon('check')}Supported email and SMS connections for verification codes, not a customer’s inbox</li></ul></div></div></section>`;

export const faqs=[
 {q:'Can my agent check an app running on localhost?',a:'Yes. The CLI can run the browser on your machine, so it reaches `http://localhost:3000`. Public URLs can run on Molar’s hosted browsers.'},
 {q:'What does my agent get when a check fails?',a:'The failed checks, the answer Molar found on the page, an `error.hint` that says where to look, and a link to the run with the recording. The run page labels the failure Bug, Flaky or Test drift.'},
 {q:'Who can see a run?',a:'Members of your workspace can open it. A run is public only if you choose Anyone with the link on the run page. Including the video in a shared run is optional.'},
 {q:'Can my agent use a real user’s login?',a:'Use a saved test account or credential reference for the site. Supported email and SMS connections provide verification codes, so the agent doesn’t need a customer’s personal inbox.'},
 {q:'Does the agent need test accounts?',a:'Yes. The agent doesn’t pause before a payment or a delete in the browser, so give it test accounts and Stripe test mode, or the Stripe clone.'},
];

export const codingAgentsBody=({actions})=>`<main id="main" class="coding-agents-page"><section class="detail-hero identity-detail"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Molar</a>${icon('chevron')}<span>Coding agents</span></nav><div class="coding-agents-hero"><h1>Your agent writes the change.<br>Molar checks it in a browser.</h1><p>Molar opens the app your coding agent just changed, uses it in a real browser, and sends back a result with proof. The agent fixes what failed and checks again. You get the recording.</p>${actions('Get started free',APP,'Set up your coding agent','#setup')}</div></div></section><section class="section coding-agents-loop" id="loop"><div class="wrap">${agentLoop()}</div></section>${runResults()}${oneCall()}${reviewers()}${setup()}${testAccounts()}${faq(faqs)}${cta('Let your agent test its changes.','Create a free workspace, connect your coding agent and run the first check.')}</main>`;

export const description='Your coding agent changes the app, Molar uses it in a real browser and returns pass or fail with the answer, the checks, a recording and a Playwright test.';
export const title='QA for Coding Agents: Check Changes in a Real Browser | Molar';
