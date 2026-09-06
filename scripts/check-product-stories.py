#!/usr/bin/env python3
"""Inspect four product workflows, responsive layouts, and browser-only examples."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://localhost:8878')
parser.add_argument('--out',default='/tmp/molar-product-stories')
args=parser.parse_args();out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
report={'base':args.base,'checks':[],'errors':[],'contrast':[],'small_text':[],'captures':[]}
contrast_js=r'''() => {
 const rgb=s=>{const n=s.match(/[\d.]+/g);return n?n.map(Number):[0,0,0,0]};
 const mix=(a,b)=>{const alpha=a[3]??1;return a.slice(0,3).map((v,i)=>v*alpha+b[i]*(1-alpha))};
 const luminance=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0);
 const rows=[];
 for(const el of document.querySelectorAll('.product-story *')){
  if(el.tagName==='VIDEO')continue;
  if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||el.closest('[hidden]'))continue;
  const style=getComputedStyle(el),parents=[];for(let p=el;p;p=p.parentElement)parents.unshift(p);
  let bg=[255,255,255];for(const p of parents)bg=mix(rgb(getComputedStyle(p).backgroundColor),bg);
  const fg=mix(rgb(style.color),bg),a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  const size=parseFloat(style.fontSize),large=size>=24||(size>=18.66&&Number(style.fontWeight)>=700);
  if(ratio<(large?3:4.5))rows.push({text:el.textContent.trim().slice(0,90),class:el.className,ratio:+ratio.toFixed(2),size,fg:style.color,bg});
 }return rows;
}'''
with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
 page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
 requests=[];page.on('request',lambda r:requests.append(r.url) if '/api/' in r.url else None)
 page.goto(args.base+'/products/trace');page.locator('[data-trace-example]').scroll_into_view_if_needed()
 assert page.locator('[data-trace-example]').get_attribute('data-trace-index')=='3'
 page.locator('[data-trace-step="2"]').click();assert '500' in page.locator('[data-trace-panel]').inner_text()
 page.locator('[data-trace-compare]').click();assert '200' in page.locator('[data-trace-baseline]').inner_text()
 page.locator('[data-trace-view="network"]').focus();page.keyboard.press('ArrowRight')
 assert page.locator('[data-trace-view="console"]').get_attribute('aria-selected')=='true'
 assert 'Account update failed' in page.locator('[data-trace-panel]').inner_text()
 page.keyboard.press('End');assert page.locator('[data-trace-view="state"]').get_attribute('aria-selected')=='true'
 assert 'Pro' in page.locator('[data-trace-baseline]').inner_text()
 page.locator('[data-trace-step="1"]').click();assert 'Free' in page.locator('[data-trace-baseline]').inner_text()
 page.locator('[data-trace-jump]').click();assert page.locator('[data-trace-step="3"]').evaluate('(e)=>e===document.activeElement')
 page.locator('[data-trace-play]').click();assert page.locator('[data-trace-example]').get_attribute('data-trace-index')=='0'
 page.locator('[data-trace-play]').click();page.wait_for_timeout(1800)
 assert page.locator('[data-trace-example]').get_attribute('data-trace-index')=='0'
 report['checks'].append('Trace: selected step, request/console/state, same-step passing comparison, keyboard tabs, failed-check focus and persistent pause')
 page.goto(args.base+'/products/clones')
 page.locator('[data-pc-action="decline"]').click()
 assert page.locator('[data-pc-action="callback"]').is_disabled()
 page.locator('[data-pc-request="order"]').click()
 assert 'not_created' in page.locator('[data-pc-fields]').inner_text()
 assert 'held' in page.locator('[data-pc-fields]').inner_text()
 assert page.locator('[data-pc-request="order"]').get_attribute('aria-pressed')=='true'
 page.locator('[data-pc-action="reset"]').click()
 page.locator('[data-pc-action="callback"]').click()
 page.locator('[data-pc-request="webhook"]').click()
 page.locator('[data-pc-action="save"]').click()
 clock=page.locator('[data-pc-clock]').inner_text()
 page.locator('[data-pc-action="advance"]').click()
 assert page.locator('[data-pc-record-title]').inner_text()=='Delivered'
 assert 'attempt 3' in page.locator('[data-pc-record-subtitle]').inner_text()
 page.locator('[data-pc-action="restore"]').click()
 assert page.locator('[data-pc-clock]').inner_text()==clock
 assert page.locator('[data-pc-record-title]').inner_text()=='Retry queued'
 report['checks'].append('Clones: decline prevents access, callback failure queues retry, clock delivers it, snapshot restores service/time, selected records synchronize')
 page.goto(args.base+'/products/cartographer')
 page.locator('button[data-cartographer-scenario="account"]').click()
 assert page.locator('[data-route-title]').inner_text()=='Billing'
 assert page.locator('#cg-example-panel').get_attribute('aria-labelledby')=='cg-scenario-account'
 page.locator('[data-cartographer-code]').click()
 assert 'settings/billing' in page.locator('[data-route-code]').inner_text()
 page.locator('[data-cartographer-route="blocked"]').click()
 assert page.locator('[data-cartographer-code]').is_hidden()
 assert 'admin profile' in page.locator('[data-route-summary]').inner_text()
 page.locator('button[data-cartographer-scenario="account"]').focus();page.keyboard.press('Home')
 assert page.locator('[data-route-title]').inner_text()=='Create account'
 assert page.locator('button[data-cartographer-scenario="signup"]').get_attribute('aria-selected')=='true'
 assert page.locator('.cg-map-lines path').count()==5
 report['checks'].append('Cartographer: scenario selection and keyboard tabs change route, code opens, inaccessible route explains missing setup and hides export, SVG connects real node positions')
 page.goto(args.base+'/products/guard')
 page.locator('[data-test-key="signin"]').click()
 assert 'credentials accepted' in page.locator('[data-evidence]').inner_text()
 assert 'payment' not in page.locator('[data-evidence]').inner_text()
 assert 'is-fail' in page.locator('[data-test-key="checkout"] [data-test-state]').get_attribute('class')
 page.locator('[data-test-key="checkout"]').click()
 page.locator('[data-fixed-example]').click()
 assert 'PASSED' in page.locator('[data-run-result]').inner_text()
 page.locator('[data-fixed-example]').click()
 assert page.locator('[data-run-result]').inner_text()=='FAILED'
 page.locator('[data-guard-mode="before"]').focus();page.keyboard.press('ArrowRight')
 assert page.locator('[data-guard-panel]').get_attribute('aria-labelledby')=='pgd-tab-after'
 assert page.locator('[data-run-result]').inner_text()=='PASSED'
 assert 'absent' not in page.locator('[data-replay-note]').inner_text()
 page.locator('[data-rationale]').click();assert page.locator('[data-rationale-panel]').is_visible()
 report['checks'].append('Guard: independent scenario verdicts, relevant evidence, explicit fixed-state comparison, keyboard release modes, selection policy disclosure')
 for width in (1440,833,390):
  page.set_viewport_size({'width':width,'height':1000})
  for product in ('clones','cartographer','guard','trace'):
   page.goto(args.base+'/products/'+product);page.evaluate('document.fonts.ready')
   assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),(product,width)
   assert page.locator('h1').count()==1
   assert page.locator('.product-story #product-demo').count()==1
   assert page.locator('.product-story #product-setup').count()==1
   assert page.locator('.product-story #product-capabilities').count()==1
   assert page.locator('#product-questions details').count()>=6
   report['contrast'].extend(dict(product=product,width=width,**row) for row in page.evaluate(contrast_js))
   small=page.locator('.product-story').evaluate("e=>[...e.querySelectorAll('*')].filter(n=>n.children.length===0&&n.textContent.trim()&&n.checkVisibility({checkVisibilityCSS:true})&&parseFloat(getComputedStyle(n).fontSize)<12).map(n=>({text:n.textContent.trim().slice(0,60),size:getComputedStyle(n).fontSize}))")
   report['small_text'].extend(dict(product=product,width=width,**row) for row in small)
   target=page.locator('#product-demo');target.screenshot(path=str(out/f'{product}-demo-{width}.png'),animations='disabled')
   if width in (1440,390):
    page.screenshot(path=str(out/f'{product}-page-{width}.png'),full_page=True,animations='disabled')
   report['captures'].append(f'{product}-demo-{width}.png')
   page.locator('.product-section-nav a[href="#product-setup"]').click()
   top=page.locator('#product-setup').bounding_box()['y'];assert top>=120,(product,width,top)
  report['checks'].append(f'Four product routes at {width}px: no page overflow, complete sections, readable anchors')
 # Automatic playback starts only when the sample is visible, and stops on manual input.
 motion_context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
 motion_context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
 motion_page=motion_context.new_page();motion_page.goto(args.base+'/products/trace')
 motion_page.locator('[data-trace-example]').scroll_into_view_if_needed()
 motion_page.wait_for_function("document.querySelector('[data-trace-play]').getAttribute('aria-pressed')==='true'")
 motion_page.locator('[data-trace-step="2"]').click();motion_page.wait_for_timeout(1850)
 assert motion_page.locator('[data-trace-example]').get_attribute('data-trace-index')=='2'
 assert motion_page.locator('[data-trace-play]').get_attribute('aria-pressed')=='false'
 motion_context.close()
 report['checks'].append('Visible Trace sample plays automatically; manual selection persists; reduced-motion context starts static')
 assert not requests,requests
 report['checks'].append('Examples make no product API calls')
 assert not report['errors'],report['errors']
 context.close();browser.close()
(out/'product-stories.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({**report,'contrast':len(report['contrast']),'small_text':len(report['small_text'])},indent=2))

assert not report['contrast'], report['contrast']
assert not report['small_text'], report['small_text']
