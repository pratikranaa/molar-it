import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const surfaceFiles = [
  'cartographer/index.html',
  'clones/index.html',
  'guard/index.html',
  'trace/index.html',
];

const sources = await Promise.all(
  surfaceFiles.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), 'utf8')]),
);

const waitlistModal = await readFile(new URL('../waitlist-modal.js', import.meta.url), 'utf8');
const marketingChromeUrl = new URL('../marketing-chrome.jsx', import.meta.url);
assert.ok(existsSync(marketingChromeUrl), 'the homepage and changelog must share the current marketing chrome');
const nav = await readFile(marketingChromeUrl, 'utf8');
const changelogData = await readFile(new URL('../changelog-data.js', import.meta.url), 'utf8');
const changelogHtml = await readFile(new URL('../changelog.html', import.meta.url), 'utf8');
const homepageHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const changelogView = await readFile(new URL('../changelog.jsx', import.meta.url), 'utf8');
assert.match(
  waitlistModal,
  /MOLAR_SITE\?\.appLive[^\n]*return/,
  'waitlist modal must not intercept live app links when appLive is enabled',
);

for (const [file, source] of sources) {
  assert.doesNotMatch(source, /href=["']#["']/, `${file} publishes a placeholder link`);
  assert.doesNotMatch(
    source,
    /https:\/\/app\.molar\.it#[^"'\s<]*/,
    `${file} publishes a legacy app fragment instead of a real route`,
  );
}

for (const surface of ['cartographer', 'clones', 'guard', 'trace']) {
  const source = sources.find(([file]) => file === `${surface}/index.html`)[1];
  assert.match(
    source,
    new RegExp(`https://app\\.molar\\.it/dashboard/${surface}`),
    `${surface}/index.html must deep-link to its dashboard`,
  );
  assert.match(
    nav,
    new RegExp(`href: 'https://${surface}\\.molar\\.it'`),
    `navbar must link to the ${surface} subdomain landing`,
  );
}

const changelogContext = { window: {} };
vm.runInNewContext(changelogData, changelogContext);
const changelogProducts = changelogContext.window.CHANGELOG_PRODUCTS;
const changelogEntries = changelogContext.window.CHANGELOG_ENTRIES;
const expectedProducts = ['all', 'molar', 'cartographer', 'clones', 'guard', 'trace'];

assert.deepEqual(
  Array.from(changelogProducts, (product) => product.id),
  expectedProducts,
  'changelog must retain every customer product filter',
);
assert.ok(changelogEntries.length >= 7, 'changelog must include the recent customer release set');
assert.deepEqual(
  Array.from(changelogEntries, (entry) => entry.date),
  Array.from(changelogEntries, (entry) => entry.date).sort().reverse(),
  'changelog source must keep newest releases first',
);

const forbiddenChangelogJargon = /\b(?:BFF|CDP|commit|deployment|Redis|Postgres|SSE|SHA|systemd|Vercel|worker)\b/i;
for (const entry of changelogEntries) {
  assert.ok(['Available now', 'Preview'].includes(entry.availability), `${entry.id} has an invalid availability`);
  assert.ok(entry.summary && entry.summary.length >= 40, `${entry.id} needs a useful customer summary`);
  assert.ok(entry.items.length >= 2 && entry.items.length <= 4, `${entry.id} needs two to four customer benefits`);
  assert.ok(new Date(entry.date) >= new Date('2026-07-01'), `${entry.id} is stale`);
  assert.doesNotMatch(
    [entry.title, entry.summary, ...entry.items].join(' '),
    forbiddenChangelogJargon,
    `${entry.id} exposes internal engineering jargon`,
  );
}

for (const product of expectedProducts.filter((product) => product !== 'all')) {
  assert.ok(changelogEntries.some((entry) => entry.product === product), `${product} needs a current release`);
}

assert.match(homepageHtml, /marketing-chrome\.jsx/, 'homepage must load the shared current marketing chrome');
assert.match(changelogHtml, /marketing-chrome\.jsx/, 'changelog must load the shared current marketing chrome');
assert.doesNotMatch(changelogHtml, /\/(?:nav|footer)\.jsx/, 'changelog must not load legacy marketing chrome');
assert.match(changelogView, /timeZone:\s*'UTC'/, 'changelog dates must render consistently in UTC');

console.log(`Published link contract passed for ${surfaceFiles.length} product surfaces.`);
