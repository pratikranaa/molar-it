import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { document } from '../marketing/document.mjs';
import { esc, icon } from '../marketing/components.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const save = (path, html) => { const target = resolve(root, path); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, html); };

function nextStep(path) {
  if (path === '/qa-agent') return '<a href="/verify">Try a browser check '+icon('arrow')+'</a>';
  if (path === '/thesis') return '<a href="/qa-agent">Read how the QA agent works '+icon('arrow')+'</a>';
  if (path === '/integrations/github-actions') return '<a href="/contact">Discuss your CI setup '+icon('arrow')+'</a>';
  return '<a href="/contact">Discuss your integration setup '+icon('arrow')+'</a>';
}

function articlePage({ title, description, path, eyebrow, intro, article, toc }) {
  const links = toc.map(([href, label]) => `<a href="#${href}">${label}</a>`).join('');
  const body = `<main id="main"><section class="reading-hero article-hero"><div class="wrap"><div class="breadcrumbs"><a href="/">Molar</a>${icon('chevron')}<span>${esc(eyebrow)}</span></div><h1>${esc(title)}</h1><p class="article-description">${esc(intro)}</p></div></section><div class="wrap article-layout"><aside class="reading-sidebar"><strong>On this page</strong><nav aria-label="On this page">${links}</nav><a class="text-link" href="/resources">Browse resources ${icon('arrow')}</a></aside><article class="article-body">${article}<p>${nextStep(path)}</p></article></div></main>`;
  return document({ title, description, path, body });
}

const legacySources = JSON.parse(readFileSync(resolve(root, 'marketing/legacy-content.json'), 'utf8'));
function sourceArticle(file) {
  // Keep original content separate from generated HTML so builds work after commits and in shallow clones.
  let html = legacySources[file];
  const match = html.match(/<article class="doc-article">([\s\S]*?)<\/article>/);
  if (!match) throw new Error(`Could not find article in ${file}`);
  return match[1]
    .replace(/<header>[\s\S]*?<\/header>/, '')
    .replace(/<div class="doc-cta">[\s\S]*?<\/div>/g, '')
    .replace(/<a class="doc-back"[\s\S]*?<\/a>/g, '')
    .replace(/\s(?:style|class)="[^"]*"/g, (value) => value.includes('doc-') ? value : '')
    .replace(/href="(?:\.\/|)docs(?:\.html)?"/g, 'href="https://docs.molar.it"')
    .replace(/href="(?:\.\/|)index\.html"/g, 'href="/"')
    .replace(/href="(?:\.\/|)qa-agent\.html"/g, 'href="/qa-agent"')
    .replace(/href="(?:\.\/|)thesis\.html"/g, 'href="/thesis"')
    .replace(/href="https:\/\/app\.molar\.it"/g, 'href="https://app.molar.it/dashboard/signup"')
    .replace(/The Molar QA agent writes tests and guards production\./g, 'Molar explores your app, runs browser checks, and returns evidence your team can inspect.')
    .replace(/replaces manual test authoring and brittle Playwright maintenance/g, 'helps reduce manual test authoring and brittle Playwright maintenance')
    .replace(/maintains a living suite of critical-path end-to-end tests/g, 'turns important user journeys into repeatable end-to-end checks')
    .replace(/Stateful third-party clones — Stripe, SendGrid, S3, Twilio, GitHub, Slack and ~28 more, with no real charges or emails\./g, 'Stateful third-party clones for supported payment, email, SMS, identity, and storage paths.')
    .replace(/Auto-fix \(Mender\) — opens a fix PR on confirmed regressions\./g, 'Repair proposals (Mender) — prepares a proposed change for review when available.')
    .replace(/Molar is an autonomous QA agent that owns the full loop: discover flows, write tests, gate PRs, shadow deploys, and watch production/g, 'Molar connects flow discovery, browser checks, release checks, and run evidence')
    .replace(/with destruction-safe clones so checkout tests never charge a real card/g, 'with isolated service clones for checkout and integration tests')
    .replace(/If you searched for "Molar QA agent"[\s\S]*?this is the product at molar\.it\./g, '')
    .replace(/Install in under a minute\. Paste your app URL, connect GitHub, and Molar starts authoring and guarding critical paths\./g, 'Start with the documented CLI setup, point Molar at an authorized app, and choose the first journey you want to check.')
    .replace(/AI ships code 10× faster than humans verify it\. Molar is a release-lifecycle QA agent for AI-native teams\. We close the gap between what AI ships and what production can handle\./g, 'AI can increase the pace of shipping. Molar helps teams close the gap between what code changes and what customers experience.')
    .replace(/In 2026, almost half of the code in Copilot-using companies is AI-generated\. Cursor crossed \$2B ARR in 36 months\. Lovable, v0, and a long tail of agentic builders push more diffs per day than most teams can read, let alone test\./g, 'AI coding tools are changing how quickly teams can create and ship software. That pace makes it harder to verify the complete user journey.')
    .replace(/Molar runs across the release lifecycle\. Before merge it reads the diff and blocks PRs that break critical paths\. During deploy it shadows the rollout against cloned third-parties\. After ship it keeps testing live production and ties every regression back to the diff and the author who introduced it\./g, 'Molar connects browser checks to the release workflow. Depending on the setup, teams can run scenarios before merge and scheduled checks after release, with evidence attached to the result.')
    .replace(/Same endpoints, same error shapes, zero real-customer side effects\./g, 'The supported clone paths preserve the service behavior your integration tests need without using live customer traffic.')
    .replace(/Molar is a release-lifecycle QA agent for AI-native teams/g, 'Molar is a browser verification platform for teams building with AI')
    .replace(/Molar integrates with GitHub Actions via the CLI and GitHub App\. Run molar-agent init, author scenarios against your preview URL, then molar-agent ci install to add a workflow that posts a required check — blocking merges when a critical-path scenario fails, with a full trace attached\./g, 'Molar integrates with GitHub Actions through the CLI and GitHub App. Set up a scenario against your preview URL, then connect the workflow so configured checks attach status and evidence to pull requests.')
    .replace(/Traditional CI runs the same brittle suite on every PR\./g, 'Traditional CI often runs the same suite on every pull request, even when the change affects a small part of the product.')
    .replace(/Molar reads recent diffs, maps affected flows, and runs critical-path checks against stateful clones of Stripe, email, and storage — so checkout and signup tests never touch production services\./g, 'Molar can map affected flows and run selected checks against stateful clones of payment, email, and storage services, so checkout and signup tests stay separate from live vendor traffic.')
    .replace(/Confirmed regressions can open a fix PR via Mender\./g, 'When available, Mender can prepare a proposed fix for review.')
    .replace(/enterprise QA platforms bill five figures and onboard in four months\./g, 'Some enterprise QA platforms can be costly and slow to adopt.')
    .replace(/Install in under a minute\./g, 'Install the CLI and configure your project.')
    .replace(/so checkout tests never charge a real card\./g, 'so checkout tests can run against isolated service state.')
    .replace(/npx molar-agent init/g, 'molar agent init')
    .replace(/molar-agent (?:scan|run) [^<]+/g, 'molar verify "login works" --url http://localhost:3000 --json')
    .replace(/molar-agent ci install/g, 'molar verify "login works" --url http://localhost:3000 --json')
    .replace(/class="doc-article"/g, '');
}

function wrapTables(html) {
  return html.replace(/<table[\s\S]*?<\/table>/g, (table) => `<div class="table-scroll">${table}</div>`);
}

save('qa-agent.html', articlePage({
  title: 'The Molar QA agent', description: 'How Molar browser agents test app tasks, check connected services, and show where a run stopped.', path: '/qa-agent', eyebrow: 'QA agent', intro: 'Point Molar at an authorized app, choose a flow such as signup or checkout, and inspect the browser result.',
  article: wrapTables(sourceArticle('qa-agent.html')), toc: [['what', 'How it checks a browser flow'], ['capabilities', 'What it checks'], ['different', 'How it fits with a test runner'], ['start', 'Run a browser check']],
}));
save('thesis.html', articlePage({
  title: 'The Molar thesis', description: 'Why software teams need a verification loop as AI accelerates how code is shipped.', path: '/thesis', eyebrow: 'Founding thesis', intro: 'AI can increase the pace of shipping. The durable advantage is knowing what the shipped software actually does after a change.',
  article: wrapTables(sourceArticle('thesis.html')), toc: [['new-shape', 'How code changes reach users'], ['bottleneck', 'Why verification waits'], ['guard', 'Repeatable release checks'], ['why-now', 'Why this matters now']],
}));
save('integrations/github-actions.html', articlePage({
  title: 'Molar in GitHub Actions', description: 'Run configured Molar scenarios in GitHub Actions and inspect their results before merging.', path: '/integrations/github-actions', eyebrow: 'Integration', intro: 'Run a configured signup, checkout, or invitation scenario in CI and attach its status and trace to the pull request.',
  article: wrapTables(sourceArticle('integrations/github-actions.html')), toc: [['overview', 'Run critical browser flows'], ['steps', 'Connect the workflow'], ['checks', 'Read the pull-request result']],
}));

console.log('Built legacy routes: /qa-agent, /thesis and /integrations/github-actions. Clone docs redirect to docs.molar.it.');
