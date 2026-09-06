import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';
import {chromium} from '../film/node_modules/playwright/index.mjs';

const base = process.env.MOLAR_SITE_URL || 'http://localhost:8882';
const out = process.env.MOLAR_MOTION_EVIDENCE || '.impeccable/review/motion';
mkdirSync(out, {recursive: true});
const report = {base, checks: [], profiles: [], errors: []};
const pass = name => { report.checks.push(name); console.log(`PASS ${name}`); };
const browser = await chromium.launch();
const context = await browser.newContext({viewport: {width:1440,height:1000}});
await context.addInitScript(() => localStorage.setItem('molar.analytics.consent.v1', 'denied'));
const page = await context.newPage();
page.on('pageerror', error => report.errors.push(error.message));
let proofRequests = 0;
page.on('request', request => { if (request.url().includes('/api/instant-proof')) proofRequests++; });
const activeChapter = () => page.locator('.process-chapter.is-active').getAttribute('id');
const chapterIds = ['discover', 'services', 'release', 'debug'];
const open = async path => { await page.goto(base + path, {waitUntil:'networkidle'}); await page.evaluate(() => document.fonts.ready); };
try {
  await open('/');
  assert.ok(await page.locator('.has-process-motion').count());
  for (const i of [0,1,2,3,2,1,0]) {
    await page.locator('.process-copy').nth(i).evaluate(element => element.scrollIntoView({block:'start',behavior:'instant'}));
    await page.waitForTimeout(520);
    assert.equal(await activeChapter(), `product-${chapterIds[i]}`);
    const visibility = await page.locator('.process-visual').evaluateAll(elements => elements.map(element => getComputedStyle(element).visibility));
    assert.equal(visibility.filter(value => value === 'visible').length, 1);
    assert.equal(await page.locator('.process-nav [aria-current="step"]').textContent(), ['Cartographer','Clones','Guard','Trace'][i]);
    const box = await page.locator('.is-active .process-visual').boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    assert.ok(box.y >= header.height && box.y + box.height < 1000, JSON.stringify(box));
    if (i > 0) assert.equal(Math.round(box.y), 145);
  }
  pass('Forward and reverse scrolling select the matching pinned view, with readable text and one exposed illustration');
  await page.locator('.process-nav a').nth(3).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1100);
  assert.equal(await activeChapter(), 'product-debug');
  assert.equal(await page.evaluate(() => location.hash), '#product-debug');
  assert.ok(await page.locator('.process-nav a').nth(3).evaluate(element => element === document.activeElement));
  await page.reload({waitUntil:'networkidle'});
  await page.waitForTimeout(550);
  assert.equal(await activeChapter(), 'product-debug');
  assert.ok((await page.locator('.process-copy').nth(3).boundingBox()).y < 400);
  pass('Keyboard chapter links retain focus, update the URL, and reopen the correct chapter');

  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(60);
  assert.equal(await page.locator('.has-process-motion').count(), 0);
  assert.equal(await page.locator('.process-visual[aria-hidden]').count(), 0);
  assert.deepEqual(await page.locator('.process-visual').evaluateAll(elements => elements.map(element => getComputedStyle(element).visibility)), Array(4).fill('visible'));
  assert.equal(await page.locator('.process-visual').first().evaluate(element => getComputedStyle(element).position), 'static');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('.process-copy').nth(1).evaluate(element => element.scrollIntoView({block:'start',behavior:'instant'}));
  await page.waitForTimeout(550);
  assert.equal(await activeChapter(), 'product-services');
  pass('Changing reduced motion removes pinning and exposes all chapters; motion can be restored');

  // Profile real scroll work after startup. These are lab frame samples, not field INP/FPS claims.
  const client = await context.newCDPSession(page);
  for (const rate of [1,4]) {
    await client.send('Emulation.setCPUThrottlingRate', {rate});
    await open('/');
    await page.locator('.process-copy').first().evaluate(element => element.scrollIntoView({block:'start',behavior:'instant'}));
    await page.waitForTimeout(600);
    const profile = await page.evaluate(async () => {
      const tasks = [], frames = [], startY = scrollY;
      const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => +entry.duration.toFixed(1))));
      observer.observe({type:'longtask'});
      await new Promise(resolve => {
        let start, last;
        const sample = time => {
          start ??= time;
          if (last) frames.push(time - last);
          last = time;
          scrollTo({top:startY + Math.min(1,(time-start)/2400)*1150,behavior:'instant'});
          if (time-start < 2400) requestAnimationFrame(sample); else resolve();
        };
        requestAnimationFrame(sample);
      });
      observer.disconnect();
      frames.sort((a,b) => a-b);
      return {frames:frames.length, p95_ms:+frames[Math.floor(frames.length*.95)].toFixed(1), over_34_ms:frames.filter(value => value>34).length, long_tasks:tasks};
    });
    report.profiles.push({cpu_slowdown:rate,...profile});
    assert.ok(profile.p95_ms < 50, JSON.stringify(profile));
    assert.ok(profile.long_tasks.every(value => value < 150), JSON.stringify(profile));
  }
  await client.send('Emulation.setCPUThrottlingRate', {rate:1});
  pass('Scroll frame pacing stays within the lab budget at normal and 4× CPU slowdown');

  for (const [width,height] of [[390,844],[768,1024],[1440,640]]) {
    await page.setViewportSize({width,height});
    await open('/');
    assert.equal(await page.locator('.has-process-motion').count(), 0);
    assert.equal(await page.locator('.process-visual[aria-hidden]').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    const pairs = await page.locator('.process-chapter').evaluateAll(chapters => chapters.map(chapter => {
      const copy=chapter.querySelector('.process-copy').getBoundingClientRect(), figure=chapter.querySelector('.process-visual').getBoundingClientRect();
      return {copy:{y:copy.y,bottom:copy.bottom},figure:{y:figure.y,bottom:figure.bottom}};
    }));
    if (width<1050) assert.ok(pairs.every(pair => pair.figure.y>=pair.copy.bottom));
  }
  pass('Phones, tablets, and short/zoomed viewports keep ordinary document flow without overflow');

  const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
  const fallback = await noJS.newPage();
  await fallback.goto(base+'/');
  assert.equal(await fallback.locator('.process-visual').count(), 4);
  assert.equal(await fallback.locator('.process-visual').first().evaluate(element => getComputedStyle(element).visibility), 'visible');
  assert.equal(await fallback.locator('.process-copy a').count(), 4);
  await noJS.close();
  pass('No-JavaScript visitors retain every chapter, illustration, and product link');

  await page.setViewportSize({width:1440,height:1000});
  await open('/platform');
  await page.locator('.foundation-output').scrollIntoViewIfNeeded();
  assert.notEqual(await page.locator('.foundation-connector .icon').evaluate(element => getComputedStyle(element).animationTimeline), 'auto');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.foundation-connector .icon').evaluate(element => getComputedStyle(element).animationName), 'none');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.identity-hero h1').evaluate(element => element.getAnimations().length), 0);
  pass('Platform scroll effect and hero entrance stop when reduced motion is requested');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  await page.evaluate(() => {
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal(await page.locator('.identity-hero h1').evaluate(element => element.getAnimations().length), 0);
  pass('Document-hidden signal cancels entrance work immediately');
  assert.equal(proofRequests, 0);
  assert.deepEqual(report.errors, []);
  pass('Motion creates no browser errors or public-check requests');
} finally {
  writeFileSync(`${out}/motion-checks.json`, JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
