import test from 'node:test';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '../film/node_modules/playwright/index.mjs');

const base = process.env.MOLAR_MARKETING_BASE ?? 'http://localhost:8878';
const sessionUrl = 'https://app.molar.it/api/v1/site-session';

async function openWithSessions(context, sessions, expected = 'Sign in') {
  const page = await context.newPage();
  let index = 0;
  const requests = [];
  page.on('request', request => { if (request.url() === sessionUrl) requests.push(request); });
  page.sessionRequests = requests;
  await page.route(sessionUrl, route => {
    const fixture = sessions[Math.min(index++, sessions.length - 1)];
    if (fixture === 'network-failure') return route.abort();
    return route.fulfill({
      status: fixture.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(fixture.body),
    });
  });
  await page.goto(`${base}/`);
  await page.waitForFunction(expectedText => document.querySelector('[data-site-auth-link]')?.textContent === expectedText, expected);
  return page;
}

test('shared navigation handles site sessions without exposing or storing identity data', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addCookies([{ name: 'fixture_session', value: 'present', domain: 'app.molar.it', path: '/' }]);
  await context.addInitScript(() => {
    const originalFetch = window.fetch;
    window.__siteSessionFetches = [];
    window.fetch = (input, init) => {
      if (String(input).includes('/api/v1/site-session')) {
        window.__siteSessionFetches.push({ credentials: init?.credentials, cache: init?.cache });
      }
      return originalFetch(input, init);
    };
  });

  const guest = await openWithSessions(context, [{ body: { authenticated: false } }]);
  assert.equal(await guest.locator('[data-site-auth-link]').first().textContent(), 'Sign in');
  assert.equal(await guest.locator('[data-site-auth-link]').first().getAttribute('href'), 'https://app.molar.it/login');
  assert.equal((await guest.locator('[data-site-dashboard]').first().textContent()).trim(), 'Get started');
  assert.equal(guest.sessionRequests[0].method(), 'GET');
  assert.deepEqual(await guest.evaluate(() => window.__siteSessionFetches[0]), { credentials: 'include', cache: 'no-store' });
  assert.equal(await guest.locator('.identity-hero .button-primary').getAttribute('href'), 'https://app.molar.it/signup');
  assert.equal(await guest.locator('.header-actions [data-site-dashboard]').getAttribute('data-track'), 'signup-nav');

  const authenticated = await openWithSessions(context, [{ body: { authenticated: true, displayName: '<img src=x onerror=alert(1)>' } }], '<img src=x onerror=alert(1)>');
  const authLink = authenticated.locator('[data-site-auth-link]').first();
  assert.equal(await authLink.textContent(), '<img src=x onerror=alert(1)>');
  assert.equal(await authLink.locator('img').count(), 0);
  assert.equal(await authLink.getAttribute('href'), 'https://app.molar.it/');
  assert.equal((await authenticated.locator('[data-site-dashboard]').first().textContent()).trim(), 'Dashboard');
  assert.equal(await authenticated.locator('.header-actions [data-site-dashboard]').getAttribute('data-track'), 'dashboard-nav');
  assert.equal(await authenticated.locator('.header-actions [data-site-dashboard] svg').count(), 1);

  const longName = 'A very long customer display name that should stay within the navigation width';
  const long = await openWithSessions(context, [{ body: { authenticated: true, displayName: longName } }], longName);
  const desktopAuth = long.locator('.header-actions [data-site-auth-link]');
  assert.equal(await desktopAuth.getAttribute('title'), longName);
  assert.equal(await desktopAuth.getAttribute('aria-label'), `Open dashboard for ${longName}`);
  assert.equal(await desktopAuth.evaluate(el => getComputedStyle(el).textOverflow), 'ellipsis');

  for (const width of [390, 900, 901, 1024, 1440]) {
    await long.setViewportSize({ width, height: 844 });
    assert.equal(await long.evaluate(() => document.querySelector('.header-inner').getBoundingClientRect().right <= innerWidth), true);
    if (width <= 900) {
      await long.locator('.mobile-toggle').click();
      assert.equal(await long.locator('.main-nav').isVisible(), true);
      const mobileAuth = long.locator('.mobile-auth [data-site-auth-link]');
      assert.equal(await mobileAuth.textContent(), longName);
      assert.equal(await mobileAuth.getAttribute('href'), 'https://app.molar.it/');
      assert.equal((await long.locator('.mobile-auth [data-site-dashboard]').textContent()).trim(), 'Dashboard');
      await long.locator('.mobile-toggle').click();
    }
  }

  const quickReturn = await openWithSessions(context, [
    { body: { authenticated: true, displayName: 'Ada' } },
    { body: { authenticated: false } },
  ], 'Ada');
  await quickReturn.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await quickReturn.waitForFunction(() => document.querySelector('[data-site-auth-link]')?.textContent === 'Sign in');

  const expired = await openWithSessions(context, [
    { body: { authenticated: true, displayName: 'Ada' } },
    { body: { authenticated: false } },
  ], 'Ada');
  assert.equal(await expired.locator('[data-site-auth-link]').first().textContent(), 'Ada');
  await expired.waitForTimeout(5100);
  await expired.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expired.waitForFunction(() => document.querySelector('[data-site-auth-link]')?.textContent === 'Sign in');
  assert.equal((await expired.locator('[data-site-dashboard]').first().textContent()).trim(), 'Get started');

  const failed = await openWithSessions(context, ['network-failure']);
  assert.equal(await failed.locator('[data-site-auth-link]').first().textContent(), 'Sign in');
  assert.equal((await failed.locator('[data-site-dashboard]').first().textContent()).trim(), 'Get started');

  await context.close();
  await browser.close();
});
