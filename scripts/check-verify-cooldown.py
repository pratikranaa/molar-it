#!/usr/bin/env python3
"""Exercise the published UI with the captured 429 contract; consumes no real runs."""
import argparse, json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:8882')
parser.add_argument('--out',default='/tmp/molar-verify-cooldown')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
report={'base':args.base,'backend':'Recorded 429 response fixture; no real browser check requested.','checks':[]}
with sync_playwright() as p:
    browser=p.chromium.launch()
    for width in (1440,390):
        context=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce')
        context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied');window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push({directive:e.effectiveDirective,uri:e.blockedURI.startsWith('data:')?'data:':e.blockedURI}))")
        page=context.new_page();page.set_default_timeout(8000)
        calls=[];errors=[]
        def rejected(route):
            calls.append(route.request.method)
            route.fulfill(status=429,headers={'Retry-After':'3600'},json={'error':'Too Many Requests','retryAfter':3600})
        page.route('**/api/instant-proof',rejected)
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.clock.install()
        response=page.goto(args.base+'/verify')
        assert response.status==200
        page.get_by_label('Public URL',exact=True).fill('https://example.org')
        page.get_by_role('button',name='Run check',exact=True).click()
        page.get_by_role('alert').wait_for()
        assert page.locator('#instant-proof').get_attribute('data-state')=='limited'
        copy=page.locator('#instant-proof').inner_text()
        assert not any(text in copy for text in ('FAILED','Incomplete','Preview unavailable','Link expires','No result received'))
        assert page.get_by_role('button',name='Try again in',exact=False).is_disabled()
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
        assert page.get_by_role('link',name='Explore the interactive example').get_attribute('href')=='/#checkout-story'
        page.get_by_label('What should be on the page?').focus()
        page.keyboard.press('Tab')
        focus=page.evaluate("()=>({text:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineStyle})")
        assert focus['text']=='Explore the interactive example' and focus['outline']!='none',focus
        page.evaluate('document.fonts.ready')
        fonts=page.evaluate('()=>[...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family)')
        assert 'Hanken' in fonts
        if width < 640:
            page.evaluate('window.scrollTo(0,0)')
            page.screenshot(path=str(out/f'limited-{width}.png'),full_page=True)
        else:
            page.locator('#instant-proof').screenshot(path=str(out/f'limited-{width}.png'))
        await_copy=page.get_by_role('button',name='Try again in',exact=False).inner_text()
        assert page.get_by_label('Public URL',exact=True).input_value()=='https://example.org'
        page.reload()
        page.get_by_role('button',name='Try again in',exact=False).wait_for()
        assert calls==['POST'],calls
        page.clock.fast_forward(3601000)
        page.get_by_role('button',name='Run check',exact=True).wait_for()
        assert calls==['POST'],calls
        assert page.locator('#instant-proof').get_attribute('data-state')=='idle'
        assert not page.evaluate('window.__csp')
        assert not errors,errors
        report['checks'].append({'width':width,'cooldown':await_copy,'calls_to_fixture':calls,'reload_retained_cooldown':True,'expiry_requires_manual_run':True,'horizontal_overflow':False,'fonts':fonts,'focus':focus,'csp':[],'page_errors':[]})
        context.close()
    browser.close()
(out/'cooldown.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
