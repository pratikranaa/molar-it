import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { document } from '../marketing/document.mjs';
import { esc, icon } from '../marketing/components.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const save = (path, html) => { const target = resolve(root, path); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, html); };

function articlePage({ title, description, path, eyebrow, intro, article, toc }) {
  const links = toc.map(([href, label]) => `<a href="#${href}">${label}</a>`).join('');
  const body = `<main id="main"><section class="reading-hero article-hero"><div class="wrap"><div class="breadcrumbs"><a href="/">Molar</a>${icon('chevron')}<span>${esc(eyebrow)}</span></div><h1>${esc(title)}</h1><p class="article-description">${esc(intro)}</p></div></section><div class="wrap article-layout"><aside class="reading-sidebar"><strong>On this page</strong><nav aria-label="On this page">${links}</nav><a class="text-link" href="/resources">Browse resources ${icon('arrow')}</a></aside><article class="article-body">${article}<p><a href="/contact">Talk to the Molar team ${icon('arrow')}</a></p></article></div></main>`;
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
  title: 'The Molar QA agent', description: 'How Molar maps application journeys, runs browser checks, and returns evidence for software teams.', path: '/qa-agent', eyebrow: 'QA agent', intro: 'A grounded entry point for teams and coding agents that need to verify real application journeys.',
  article: wrapTables(sourceArticle('qa-agent.html')), toc: [['what', 'Definition'], ['capabilities', 'Capabilities'], ['different', 'Comparison'], ['start', 'Get started']],
}));
save('thesis.html', articlePage({
  title: 'The Molar thesis', description: 'Why software teams need a verification loop as AI accelerates how code is shipped.', path: '/thesis', eyebrow: 'Founding thesis', intro: 'AI can increase the pace of shipping. The durable advantage is knowing what the shipped software actually does.',
  article: wrapTables(sourceArticle('thesis.html')), toc: [['new-shape', 'The new shape of code'], ['bottleneck', 'Verification is the bottleneck'], ['guard', 'A release guard'], ['why-now', 'Why now']],
}));
save('integrations/github-actions.html', articlePage({
  title: 'Molar in GitHub Actions', description: 'Connect Molar scenarios and evidence to GitHub Actions for configured release checks.', path: '/integrations/github-actions', eyebrow: 'Integration', intro: 'Use the CLI and GitHub integration to run configured scenarios in CI and attach inspectable results to pull requests.',
  article: wrapTables(sourceArticle('integrations/github-actions.html')), toc: [['overview', 'Overview'], ['steps', 'Setup steps'], ['checks', 'Required checks']],
}));

const cloneContext = { window: {} };
vm.createContext(cloneContext);
vm.runInContext(readFileSync(resolve(root, 'clone-routes-data.js'), 'utf8'), cloneContext);
vm.runInContext(readFileSync(resolve(root, 'clone-docs-data.js'), 'utf8'), cloneContext);
const ids = cloneContext.window.listCloneDocIds();
const cloneDoc = (id) => cloneContext.window.getCloneDoc(id);
const renderValue = (value) => esc(String(value ?? '')).replace(/`([^`]+)`/g, '<code>$1</code>');

function cloneArticle(doc) {
  const toolGroups = doc.toolGroups?.length ? `<section id="tools"><h2>Available tools</h2><p>${renderValue(doc.toolsSubtitle || '')}</p>${doc.toolGroups.map((group) => `<h3>${esc(group.title)}</h3><table><thead><tr><th>Tool</th><th>Description</th></tr></thead><tbody>${group.tools.map(([name, desc]) => `<tr><td><code>${esc(name)}</code></td><td>${esc(desc)}</td></tr>`).join('')}</tbody></table>`).join('')}</section>` : '';
  return `<p class="doc-lede">${esc(doc.tagline)}</p><p><code>Clone ID: ${esc(doc.id)}</code></p><section id="start"><h2>Connect and test</h2><table><tbody><tr><th>Best for</th><td>${esc(doc.startHere.bestFor)}</td></tr><tr><th>Connect with</th><td>${renderValue(doc.startHere.connectWith)}</td></tr><tr><th>Known limits</th><td>${esc(doc.startHere.knownLimits)}</td></tr><tr><th>Seeds</th><td>${renderValue(doc.startHere.seeds)}</td></tr></tbody></table></section><section id="covers"><h2>What it covers</h2><ul>${doc.covers.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>${toolGroups}<section id="surface"><h2>Surface</h2><p>${renderValue(doc.surface)}</p></section>${doc.notes?.length ? `<section id="notes"><h2>Notes</h2><ul>${doc.notes.map((note) => `<li>${renderValue(note)}</li>`).join('')}</ul></section>` : ''}`;
}

const cloneLinks = ids.map((id) => [id, cloneDoc(id).title]);
for (const id of ids) {
  const doc = cloneDoc(id);
  const toc = [['start', 'Connect and test'], ['covers', 'What it covers'], ...(doc.toolGroups?.length ? [['tools', 'Available tools']] : []), ['surface', 'Surface'], ...(doc.notes?.length ? [['notes', 'Notes']] : [])];
  const article = wrapTables(cloneArticle(doc).replace('<p class="doc-lede">', '<p>'));
  save(`docs/clones/${id}.html`, articlePage({ title: `${doc.title} | Molar Docs`, description: doc.tagline, path: `/docs/clones/${id}`, eyebrow: `Clones / ${doc.id}`, intro: doc.summary || doc.tagline, article, toc }));
}

const coreIds = new Set(['auth', 's3', 'sendgrid', 'stripe', 'twilio']);
const catalog = `<main id="main"><section class="reading-hero"><div class="wrap"><div class="breadcrumbs"><a href="/">Molar</a>${icon('chevron')}<span>Clone docs</span></div><h1>Stateful service clones.</h1><p>Reference pages for connecting, seeding, and understanding the boundaries of each Molar clone.</p></div></section><div class="wrap article-layout"><aside class="reading-sidebar"><strong>Clone catalog</strong><nav aria-label="Clone catalog">${cloneLinks.map(([id, title]) => `<a href="/docs/clones/${id}">${esc(title)}</a>`).join('')}</nav></aside><article class="article-body"><p>Choose a clone to see its supported workflows, connection surface, seeds, tools, and known limits.</p><section><h2>Core service clones</h2><p>These five deeper clones cover the primary integration boundaries: payments, email, SMS, identity, and object storage.</p>${cloneLinks.filter(([id]) => coreIds.has(id)).map(([id, title]) => `<p><a href="/docs/clones/${id}"><strong>${esc(title)}</strong></a> — ${esc(cloneDoc(id).tagline)}</p>`).join('')}</section><section><h2>Supplementary fixture coverage</h2><p>Additional vendor shaped fixtures support focused agent and integration workflows. Their pages identify launch or architecture preview status and the routes covered.</p>${cloneLinks.filter(([id]) => !coreIds.has(id)).map(([id, title]) => `<p><a href="/docs/clones/${id}"><strong>${esc(title)}</strong></a> — ${esc(cloneDoc(id).tagline)}</p>`).join('')}</section></article></div></main>`;
save('docs/clones/index.html', document({ title: 'Clone docs | Molar', description: 'Per-clone reference for Molar stateful service clones, seeds, coverage, and tools.', path: '/docs/clones', body: catalog }));
save('docs/clone.html', document({ title: 'Clone docs | Molar', description: 'Per-clone reference for Molar stateful service clones, seeds, coverage, and tools.', path: '/docs/clone', body: catalog }));

console.log(`Built legacy routes: /qa-agent, /thesis, /integrations/github-actions, /docs/clones plus ${ids.length} clone pages.`);
