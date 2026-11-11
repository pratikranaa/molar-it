import {published} from '../content/published.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {articles} from '../marketing/editorial.mjs';
import {document} from '../marketing/document.mjs';
import {structuredData} from '../marketing/seo.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = file => readFileSync(resolve(root, file), 'utf8');

test('document emits linked Organization, WebSite, WebPage and breadcrumbs', () => {
  const html = document({
    title: 'Example & page',
    description: 'A useful description.',
    path: '/products/example',
    body: '<main id="main"><h1>Example</h1></main>',
    breadcrumbs: [{name: 'Molar', item: '/'}, {name: 'Products', item: '/products'}, {name: 'Example', item: '/products/example'}],
  });
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const types = json['@graph'].map(node => node['@type']);
  assert.deepEqual(types, ['Organization', 'WebPage', 'BreadcrumbList']);
  assert.match(html, /<meta property="og:title" content="Example &amp; page">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/molar\.it\/assets\/social\/products-example\.png">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/molar\.it\/products\/example">/);
});

test('article graph carries supplied publication facts without inventing authors', () => {
  const graph = structuredData({
    title: 'A guide', description: 'Useful guide', path: '/blog/a-guide',
    type: 'BlogPosting', date: '2026-09-01', dateModified: '2026-09-02',
    author: {name: 'Pratik Rana', url: '/company'}, section: 'Engineering',
  })['@graph'];
  const article = graph.find(node => node['@type'] === 'BlogPosting');
  assert.ok(graph.some(node => node['@type'] === 'WebPage'));
  assert.equal(article.datePublished, '2026-09-01');
  assert.equal(article.dateModified, '2026-09-02');
  assert.deepEqual(article.author, {'@type': 'Person', name: 'Pratik Rana', url: 'https://molar.it/company'});
  assert.equal(article.articleSection, 'Engineering');
  assert.equal(Object.hasOwn(article, 'author'), true);
  const noAuthor = structuredData({title: 'A guide', description: 'Useful guide', path: '/blog/a-guide', type: 'BlogPosting', date: '2026-09-01'})['@graph'].find(node => node['@type'] === 'BlogPosting');
  assert.equal(Object.hasOwn(noAuthor, 'author'), false);
});

test('generated RSS contains every rendered article exactly once', () => {
  const feed = read('feed.xml');
  assert.match(feed, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.equal((feed.match(/<item>/g) || []).length, articles.length + published.length);
  for (const article of articles) {
    assert.equal((feed.match(new RegExp(`<link>https://molar\\.it${article.path}</link>`, 'g')) || []).length, 1, article.path);
    assert.match(feed, new RegExp(`<pubDate>[^<]+<\\/pubDate>`));
  }
});

test('RSS keeps the complete article after its inline illustration', () => {
  const feed=read('feed.xml');
  for(const article of [...articles,...published]){
    const item=feed.split('<item>').find(item=>item.includes(`<link>https://molar.it${article.path}</link>`));
    const headings=[...article.body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
    assert.ok(item.includes(headings.at(-1)[1]),article.path+' lost its last section');
    assert.ok(item.includes('data-article-graphic'),article.path+' lost its illustration');
  }
});

test('agent map only contains canonical molar.it pages and includes all articles', () => {
  const map = JSON.parse(read('agent-map.json'));
  assert.equal(map.generatedFrom, 'rendered canonical HTML');
  assert.equal(map.pageCount, map.pages.length);
  assert.ok(map.pageCount > articles.length);
  const urls = new Set(map.pages.map(page => page.url));
  assert.equal(urls.size, map.pages.length);
  for (const page of map.pages) assert.match(page.url, /^https:\/\/molar\.it(?:\/|$)/);
  for (const article of articles) assert.ok(urls.has(`https://molar.it${article.path}`), article.path);
});

test('homepage graph names the entity and the software, with only real profile links', () => {
  const html = document({title: 'Molar', description: 'Test.', path: '/', body: '<main id="main"><h1>Molar</h1></main>'});
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const org = graph.find(node => node['@type'] === 'Organization');
  assert.equal(org.name, 'Molar');
  assert.ok(org.alternateName.includes('Molar QA'));
  assert.equal(org.founder, undefined);
  for (const url of org.sameAs) assert.match(url, /^https:\/\/(docs\.molar\.it|github\.com\/pratikranaa)/);
  const software = graph.find(node => node['@type'] === 'SoftwareApplication');
  assert.equal(software.applicationCategory, 'DeveloperApplication');
  assert.equal(software.offers.price, '0');
  assert.equal(graph.find(node => node['@type'] === 'WebPage').about['@id'], software['@id']);
});

test('every rendered page has one parseable JSON-LD graph, a canonical URL and a unique title', () => {
  const manifest = JSON.parse(read('marketing/build-manifest.json'));
  const titles = new Map();
  for (const file of manifest.html) {
    const html = read(`.site-dist/${file}`);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(blocks.length, 1, file);
    assert.ok(Array.isArray(JSON.parse(blocks[0][1])['@graph']), file);
    assert.match(html, /<link rel="canonical" href="https:\/\/molar\.it[^"]*">/, file);
    const title = html.match(/<title>([\s\S]*?)<\/title>/)[1];
    // blog.html and blog/index.html are the same canonical page.
    if (file !== 'blog/index.html') assert.equal(titles.has(title), false, `${file} repeats the title of ${titles.get(title)}`);
    titles.set(title, file);
  }
});

test('llms.txt opens with a category definition that separates Molar from the tooth and the chemistry unit', () => {
  const llms = read('llms.txt');
  assert.match(llms, /^# Molar\n\n> Molar \(also called Molar QA, at molar\.it\) is an AI QA and browser automation platform/);
  assert.match(llms, /unrelated to dental molars/);
  assert.match(read('llms-full.txt'), /AI QA and browser automation platform/);
});
