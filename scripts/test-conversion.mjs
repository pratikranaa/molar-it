import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {cloneCatalog} from '../marketing/clone-catalog.mjs';
import {setupCommand,agentPrompt} from '../marketing/conversion.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'../film/node_modules/playwright/index.mjs');
const base=process.env.MOLAR_SITE_URL||'http://localhost:8882';
const checks=[];
const pass=name=>{checks.push(name);console.log(`PASS ${name}`)};
const canonical=resolve(root,'../clones-catalog.json');
if(existsSync(canonical)){
  const source=JSON.parse(readFileSync(canonical));
  for(const [tier,key] of [['stateful','deep'],['fixture','fixtures']])assert.deepEqual(cloneCatalog.filter(x=>x.tier===tier).map(x=>x.id).sort(),source[key].sort());
  pass('catalog matches the authoritative stateful and fixture inventory');
}
const brands=JSON.parse(readFileSync(resolve(root,'assets/brands/source-manifest.json'))).assets;
assert.equal(cloneCatalog.length,28);
for(const item of cloneCatalog)assert.ok(existsSync(resolve(root,'assets/brands',brands[item.id].file)),item.id);
pass('every catalog service has a sourced local mark');
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('molar.analytics.consent.v1','denied'));
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let proofRequests=0;page.on('request',r=>{if(r.url().includes('/api/instant-proof'))proofRequests++});
  for(const route of ['/','/platform']){
    await page.goto(base+route,{waitUntil:'networkidle'});
    await page.locator('.quick-command [data-copy]').click();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),setupCommand);
    assert.match(await page.locator('.quick-command .copy-status').textContent(),/copied/);
    await page.locator('.agent-handoff>summary').click();
    await page.locator('[data-copy-agent]').click();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),agentPrompt);
    assert.equal(await page.locator('.startup-programs li').count(),4);
    assert.equal(await page.locator('.startup-programs').getByText('Backed by',{exact:false}).count(),0);
    const events=await page.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event'));
    assert.equal(events.length,0,'copy events must respect denied analytics');
  }
  pass('both entry pages copy the exact command and prompt without analytics consent leakage');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('Denied'))},configurable:true}));
  await page.locator('[data-copy-agent]').click();
  assert.equal(await page.locator('.agent-prompt-preview').getAttribute('open'),'');
  assert.match(await page.locator('.agent-copy-status').textContent(),/copy it manually/);
  await page.locator('.quick-command [data-copy]').click();
  assert.match(await page.locator('.quick-command .copy-status').textContent(),/copy it manually/);
  pass('clipboard denial exposes readable content and manual-copy guidance');
  await page.goto(base+'/');
  await page.getByRole('link',{name:'Browse all 28 services'}).click();
  await page.waitForURL('**/products/clones#clone-catalog');
  const visible=()=>page.locator('[data-catalog-entry]:visible').count();
  assert.equal(await visible(),28);
  const heading=await page.locator('.catalog-heading').boundingBox();
  const nav=await page.locator('.product-section-nav').boundingBox();
  assert.ok(heading.y>=nav.y+nav.height-1,'anchor heading clears both sticky navigations');
  await page.getByRole('button',{name:'Stateful 5',exact:true}).focus();
  await page.keyboard.press('Enter');
  assert.equal(await visible(),5);
  await page.getByRole('searchbox').fill('stripe');
  assert.equal(await visible(),1);
  await page.getByRole('button',{name:'Fixture packs 23',exact:true}).click();
  assert.equal(await visible(),0);
  assert.ok(await page.getByRole('heading',{name:'No matching services.'}).isVisible());
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  assert.equal(await visible(),28);
  assert.ok(await page.getByRole('searchbox').evaluate(e=>document.activeElement===e));
  await page.getByRole('searchbox').fill('  LINKEDIN  ');
  assert.equal(await visible(),1);
  assert.match(await page.locator('[data-catalog-entry]:visible').textContent(),/Unipile/);
  await page.locator('[data-catalog-entry]:visible a').click();
  await page.waitForURL('**/docs/clones/unipile');
  assert.equal(await page.locator('h1').count(),1);
  pass('homepage catalog path, keyboard filtering, empty recovery, operation search and service docs work');
  for(const width of [390,768,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto(base+'/products/clones#clone-catalog',{waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    for(const img of await page.locator('[data-clone-catalog] img').all()){
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(e=>e.decode());
      assert.ok(await img.evaluate(e=>e.naturalWidth>0));
    }
  }
  pass('all 28 marks load at mobile, tablet and desktop widths without page overflow');
  const nojs=await browser.newContext({javaScriptEnabled:false});
  const plain=await nojs.newPage();
  await plain.goto(base+'/products/clones');
  assert.equal(await plain.locator('[data-catalog-entry]:visible').count(),28);
  assert.equal(await plain.locator('.catalog-controls').isVisible(),false);
  await nojs.close();
  pass('all services and documentation links remain available without JavaScript');
  const measured=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
  await measured.addInitScript(()=>localStorage.setItem('molar.analytics.consent.v1','granted'));
  // Exercise the consented event contract without sending test traffic to Google.
  await measured.route('**/*googletagmanager.com/**',route=>route.fulfill({contentType:'application/javascript',body:''}));
  await measured.route('**/*google-analytics.com/**',route=>route.fulfill({status:204}));
  const tracked=await measured.newPage();
  await tracked.goto(base+'/',{waitUntil:'networkidle'});
  await tracked.locator('.quick-command [data-copy]').click();
  await tracked.locator('.agent-handoff>summary').click();
  await tracked.locator('[data-copy-agent]').click();
  await tracked.waitForFunction(()=>document.querySelector('.agent-copy-status').textContent.startsWith('Prompt copied.'));
  const copies=await tracked.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='cta_click').map(x=>x[2]));
  assert.deepEqual(copies.map(x=>x.cta),['setup_command_copied','agent_prompt_copied']);
  assert.ok(copies.every(x=>!JSON.stringify(x).includes('npx')&&!JSON.stringify(x).includes('credentials')));
  await measured.close();
  pass('consented copy events contain fixed action names without copied content');
  assert.deepEqual(errors,[]);assert.equal(proofRequests,0);
  pass('no page errors or public browser-check requests');
  await context.close();
}finally{await browser.close()}
console.log(JSON.stringify({ok:true,base,checks},null,2));
