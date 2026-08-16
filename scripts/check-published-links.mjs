import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
const nav = await readFile(new URL('../nav.jsx', import.meta.url), 'utf8');
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

console.log(`Published link contract passed for ${surfaceFiles.length} product surfaces.`);
