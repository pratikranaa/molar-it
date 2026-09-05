import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, before, after } from 'node:test';
import { chromium } from '../film/node_modules/playwright/index.mjs';

const siteRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const googleScript = 'https://www.googletagmanager.com/gtag/js?id=G-2YL3J3PX8R';
let server;
let baseURL;

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function publicFile(pathname) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, '');
  const candidate = cleanPath === '' ? 'index.html' : cleanPath;
  const withExtension = extname(candidate) ? candidate : `${candidate}.html`;
  const filePath = normalize(join(siteRoot, withExtension));
  if (filePath !== siteRoot && !filePath.startsWith(`${siteRoot}/`)) throw new Error('Path escaped test server root');
  return filePath;
}

async function serve(request, response) {
  try {
    const filePath = publicFile(new URL(request.url, baseURL || 'http://127.0.0.1').pathname);
    const body = await readFile(filePath);
    response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}

function gtagTestDouble() {
  return `(() => {
    window.__molarGtagLoads = (window.__molarGtagLoads || 0) + 1;
    const queue = window.dataLayer || [];
    const send = (args) => {
      if (args[0] !== 'event' && args[0] !== 'config') return;
      const data = args[2] || args[1] || {};
      navigator.sendBeacon('https://www.google-analytics.com/g/collect', JSON.stringify({ command: args[0], ...data }));
    };
    const previous = window.gtag;
    window.gtag = (...args) => { queue.push(args); send(args); };
    window.dataLayer = queue;
    window.gtag('js', new Date());
  })();`;
}

async function newPage({ gpc = false } = {}) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: 'block' });
  if (gpc) {
    await context.addInitScript(() => Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: true }));
  }
  const requests = [];
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.on('request', request => {
    if (/google-analytics|googletagmanager/.test(request.url())) requests.push(request);
  });
  await page.route(googleScript, route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: gtagTestDouble(),
  }));
  await page.goto(baseURL);
  return { browser, context, page, requests };
}

before(async () => {
  server = createServer(serve);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseURL = `http://127.0.0.1:${server.address().port}/`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('accept loads GA once and sends a sanitized page view and CTA event', async () => {
  const { browser, context, page, requests } = await newPage();
  try {
    await page.getByRole('button', { name: 'Accept analytics' }).click();
    await page.waitForTimeout(100);
    assert.equal(requests.filter(request => request.url() === googleScript).length, 1);
    assert.equal(await page.locator(`script[src="${googleScript}"]`).count(), 1);
    assert.equal(await page.evaluate(() => document.cookie.includes('_ga')), false);

    const dataLayer = await page.evaluate(() => window.dataLayer.map(entry => [...entry]));
    const defaultConsent = dataLayer.find(([command, kind]) => command === 'consent' && kind === 'default');
    const updatedConsent = dataLayer.find(([command, kind]) => command === 'consent' && kind === 'update');
    assert.deepEqual(defaultConsent[2], {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500,
    });
    assert.deepEqual(updatedConsent[2], {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted',
    });
    const pageViews = dataLayer.filter(([command, name]) => command === 'event' && name === 'page_view');
    assert.equal(pageViews.length, 1);
    assert.equal(pageViews[0][2].page_location, `${baseURL.slice(0, -1)}/`);
    assert.equal(pageViews[0][2].page_referrer, undefined);

    await page.locator('[data-track="signup-nav"]').evaluate(element => {
      element.addEventListener('click', event => event.preventDefault(), { once: true });
      element.click();
    });
    await page.waitForTimeout(100);
    const events = await page.evaluate(() => window.dataLayer.map(entry => [...entry]));
    assert.equal(events.filter(([command, name]) => command === 'event' && name === 'cta_click').length, 1);
    await page.evaluate(() => {
      const source = document.createElement('div');
      source.id = 'ask-sources';
      source.innerHTML = '<a href="https://private.example/article?token=secret">Source</a>';
      document.body.append(source);
      const anchor = source.querySelector('a');
      anchor.addEventListener('click', event => event.preventDefault());
      anchor.click();
    });
    const sourceEvent = await page.evaluate(() => window.dataLayer.map(entry => [...entry]).find(([command, name, params]) => command === 'event' && name === 'navigation_click' && params?.source === 'ask_sources'));
    assert.deepEqual(sourceEvent[2], { source: 'ask_sources', destination: 'source' });
    assert.equal(await page.locator(`script[src="${googleScript}"]`).count(), 1);
  } finally {
    await context.close();
    await browser.close();
  }
});

test('decline keeps Google silent and creates no analytics cookie', async () => {
  const { browser, context, page, requests } = await newPage();
  try {
    await page.getByRole('button', { name: 'Decline analytics' }).click();
    await page.waitForTimeout(100);
    assert.equal(requests.length, 0);
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
    assert.equal(await page.evaluate(() => document.cookie.includes('_ga')), false);
  } finally {
    await context.close();
    await browser.close();
  }
});

test('withdrawal in another tab disables future collection', async () => {
  const { browser, context, page } = await newPage();
  try {
    await page.getByRole('button', { name: 'Accept analytics' }).click();
    await page.waitForTimeout(100);
    const other = await context.newPage();
    await other.goto(baseURL);
    await other.evaluate(() => localStorage.setItem('molar.analytics.consent.v1', 'denied'));
    await page.waitForFunction(() => window.MolarAnalytics.getConsent() === 'denied');
    assert.equal(await page.evaluate(() => window['ga-disable-G-2YL3J3PX8R']), true);
    const before = await page.evaluate(() => window.dataLayer.length);
    await page.evaluate(() => window.MolarAnalytics.track('demo_interaction', { action: 'replay' }));
    assert.equal(await page.evaluate(() => window.dataLayer.length), before);
  } finally { await context.close(); await browser.close(); }
});

test('Global Privacy Control keeps analytics off even when a visitor tries to accept', async () => {
  const { browser, context, page, requests } = await newPage({ gpc: true });
  try {
    assert.equal(await page.locator('[data-molar-consent]').count(), 1);
    await page.getByRole('button', { name: 'Privacy choices' }).click();
    await page.getByRole('button', { name: 'Accept analytics' }).click();
    await page.waitForTimeout(100);
    assert.equal(requests.length, 0);
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
    assert.equal(await page.evaluate(() => localStorage.getItem('molar.analytics.consent.v1')), 'denied');
  } finally {
    await context.close();
    await browser.close();
  }
});

test('revoke stops future events and removes the known GA cookies', async () => {
  const { browser, context, page, requests } = await newPage();
  try {
    await page.getByRole('button', { name: 'Accept analytics' }).click();
    await page.waitForTimeout(100);
    const beforeRevoke = requests.length;
    await page.getByRole('button', { name: 'Privacy choices' }).click();
    await page.getByRole('button', { name: 'Decline analytics' }).click();
    await page.locator('[data-track="signup-nav"]').evaluate(element => {
      element.addEventListener('click', event => event.preventDefault(), { once: true });
      element.click();
    });
    await page.waitForTimeout(100);
    assert.equal(requests.length, beforeRevoke);
    assert.equal(await page.evaluate(() => document.cookie.split(';').some(cookie => cookie.trim().startsWith('_ga'))), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('molar.analytics.consent.v1')), 'denied');
  } finally {
    await context.close();
    await browser.close();
  }
});

test('verify query strings and claim text never enter analytics payloads', async () => {
  const { browser, context, page, requests } = await newPage();
  try {
    await page.goto(`${baseURL}verify?url=https%3A%2F%2Fprivate.example%2Freset%3Ftoken%3Dsecret&claim=private%20question`);
    await page.getByRole('button', { name: 'Accept analytics' }).click();
    await page.waitForTimeout(100);
    const serialized = await page.evaluate(() => JSON.stringify(window.dataLayer));
    const networkPayloads = requests.map(request => `${request.url()} ${request.postData() || ''}`).join('\n');
    assert.equal(networkPayloads.includes('private.example'), false);
    assert.equal(networkPayloads.includes('token'), false);
    assert.equal(networkPayloads.includes('private question'), false);
    assert.equal(networkPayloads.includes('?url='), false);
    assert.equal(serialized.includes('private.example'), false);
    assert.equal(serialized.includes('token'), false);
    assert.equal(serialized.includes('private question'), false);
    assert.equal(serialized.includes('?url='), false);
    const pageViews = await page.evaluate(() => window.dataLayer.filter(([command, name]) => command === 'event' && name === 'page_view'));
    assert.equal(pageViews[0][2].page_location, `${baseURL.slice(0, -1)}/verify`);
  } finally {
    await context.close();
    await browser.close();
  }
});
