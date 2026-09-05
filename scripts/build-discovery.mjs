#!/usr/bin/env node
import {published} from '../content/published.mjs';
/**
 * Generate machine-readable discovery artifacts from the pages that will be
 * published. Run after every HTML builder and before the staging copy step:
 *
 *   node scripts/build-discovery.mjs
 *
 * The scanner intentionally trusts canonical HTML and its noindex directive,
 * then joins blog metadata to the rendered article pages. This keeps feeds and
 * agent maps from drifting away from the pages visitors can actually crawl.
 */
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {articles} from '../marketing/editorial.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://molar.it';

const xmlEscape = value => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const decodeEntities = value => String(value ?? '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
const text = value => decodeEntities(String(value ?? '')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, ' ')
  .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const matchOne = (html, expression) => html.match(expression)?.[1] || '';
const canonicalPath = canonical => {
  try {
    const url = new URL(canonical);
    if (url.origin !== SITE_URL) return null;
    const path = url.pathname.replace(/\.html$/i, '').replace(/\/$/, '');
    return path || '/';
  } catch { return null; }
};
const sourceFiles = directory => {
  const files = [];
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === '.site-dist' || entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(file));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(file);
  }
  return files;
};

const pagesByPath = new Map();
for (const file of sourceFiles(root)) {
  const html = readFileSync(file, 'utf8');
  // The current renderer has a stable stylesheet marker; old standalone
  // artifacts should not silently enter the discovery index.
  if (!html.includes('/marketing/site.css')) continue;
  const canonical = matchOne(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const path = canonicalPath(canonical);
  if (!path || /noindex(?:,|\s)/i.test(matchOne(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i))) continue;
  const main = matchOne(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i) || html;
  const record = {
    path,
    url: `${SITE_URL}${path}`,
    source: relative(root, file),
    title: decodeEntities(matchOne(html, /<title>([\s\S]*?)<\/title>/i)),
    description: decodeEntities(matchOne(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)),
    headings: [...main.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)].map(match => text(match[1])).filter(Boolean),
    body: html,
  };
  // A path can have an index.html and a clean route artifact. Keep the first
  // canonical source and make the choice deterministic by source path.
  const previous = pagesByPath.get(path);
  if (!previous || record.source < previous.source) pagesByPath.set(path, record);
}

const pages = [...pagesByPath.values()].sort((a, b) => a.path.localeCompare(b.path));
const articleByPath = new Map([...published,...articles].map(article => [article.path, article]));
const publishedArticles = [...published,...articles]
  .map(article => ({...article, page: pagesByPath.get(article.path)}))
  .filter(article => article.page);

const articleBody = page => {
  const html = matchOne(page.body, /<article\s+class=["'][^"']*article-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
  return (html || '').replace(/href="\/(?!\/)/g, 'href="https://molar.it/');
};
const cdata = value => `<![CDATA[${String(value ?? '').replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
const rfc822 = date => {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid article date: ${date}`);
  return parsed.toUTCString();
};

const rssItems = publishedArticles.map(article => {
  const page = article.page;
  const author = article.author || article.authorName;
  return `    <item>
      <title>${xmlEscape(article.title)}</title>
      <link>${xmlEscape(page.url)}</link>
      <guid isPermaLink="true">${xmlEscape(page.url)}</guid>
      <description>${xmlEscape(article.description || page.description)}</description>
      <pubDate>${xmlEscape(rfc822(article.date))}</pubDate>
      <category>${xmlEscape(article.category || 'Guides')}</category>${author ? `
      <dc:creator>${xmlEscape(typeof author === 'string' ? author : author.name)}</dc:creator>` : ''}
      <content:encoded>${cdata(articleBody(page))}</content:encoded>
    </item>`;
}).join('\n');
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Molar guides</title>
    <link>${SITE_URL}/blog</link>
    <description>Practical engineering guides on browser QA, integrations, release confidence, and agent workflows.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

const groupFor = path => {
  if (path === '/') return 'Start here';
  if (path.startsWith('/blog')) return 'Guides';
  if (path.startsWith('/products')) return 'Products';
  if (path.startsWith('/solutions')) return 'Solutions';
  if (path.startsWith('/platform')) return 'Platform';
  if (path.startsWith('/docs')) return 'Documentation';
  if (path.startsWith('/vs')) return 'Comparisons';
  if (path.startsWith('/integrations')) return 'Integrations';
  return 'Company and other pages';
};
const pageLink = page => `- [${page.title}](${page.url}) — ${page.description}`;
const grouped = new Map();
// Keep llms.txt token-cheap. The complete canonical inventory remains in
// agent-map.json and llms-full.txt; clone leaves are discoverable from the
// catalog page and do not need to be repeated in the short map.
const concisePages = pages.filter(page =>
  !page.path.startsWith('/docs/clones/') && page.path !== '/docs/clone');
for (const page of concisePages) {
  if (page.path === '/blog') continue;
  const group = groupFor(page.path);
  if (!grouped.has(group)) grouped.set(group, []);
  grouped.get(group).push(page);
}
const llms = `# Molar

> Molar is a beta browser automation and QA platform for web applications. Its QA workflows test customer journeys in a real browser; its platform also supports scoped browser tasks for people and AI agents.

This map is generated from crawlable canonical HTML pages. Product availability and coverage depend on the configured environment; the linked pages are the source of truth.

${[...grouped].map(([group, entries]) => `## ${group}\n${entries.map(pageLink).join('\n')}`).join('\n\n')}

## External properties
- [Documentation](https://docs.molar.it) — full product documentation on its own canonical host.
- [Create an account](https://app.molar.it/dashboard/signup) — product sign-up.
- [RSS feed](${SITE_URL}/feed.xml) — published guides.
- [Full page map](${SITE_URL}/llms-full.txt) — titles, descriptions, and headings for every canonical page.

## Interpretation
The interactive examples on the marketing site are labeled examples or controlled tests. They are not customer testimonials, reliability benchmarks, or guarantees of complete vendor parity. Read the relevant page and documentation before relying on a capability.
`;
const llmsFull = `# Molar — canonical page map

Generated from rendered, indexable canonical HTML. ${pages.length} pages are included.

${pages.map(page => {
  const article = articleByPath.get(page.path);
  const facts = article ? `\n- Published: ${article.date}` : '';
  return `## ${page.title}\nURL: ${page.url}\nDescription: ${page.description}${facts}\nHeadings: ${page.headings.join(' · ') || 'None recorded'}`;
}).join('\n\n')}
`;
const agentMap = {
  schemaVersion: 1,
  generatedFrom: 'rendered canonical HTML',
  site: SITE_URL,
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  pages: pages.map(page => {
    const article = articleByPath.get(page.path);
    return {
      path: page.path,
      url: page.url,
      title: page.title,
      description: page.description,
      headings: page.headings,
      ...(article ? {type: 'BlogPosting', datePublished: article.date, category: article.category, ...(article.author ? {author: article.author} : {})} : {}),
    };
  }),
};

writeFileSync(join(root, 'feed.xml'), feed);
writeFileSync(join(root, 'llms.txt'), llms);
writeFileSync(join(root, 'llms-full.txt'), llmsFull);
writeFileSync(join(root, 'agent-map.json'), `${JSON.stringify(agentMap, null, 2)}\n`);
console.log(`Generated feed.xml, llms.txt, llms-full.txt, and agent-map.json from ${pages.length} canonical pages (${publishedArticles.length} articles).`);
