#!/usr/bin/env python3
"""Check the first-visit entry, evidence playback and distinct supporting sections."""
import argparse, json
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://localhost:8878')
parser.add_argument('--out',default='/tmp/molar-final-pass')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
report={'base':args.base,'checks':[],'errors':[]}
shots=[('/', '.identity-hero','home'),('/', '.checkout-story','checkout-story'),('/', '.first-step','first-step'),('/platform','.platform-work','platform-work'),('/company','.company-hero','company'),('/company','.company-origin','company-origin'),('/company','.company-founder','founder'),('/pricing','.pricing-choices','pricing'),('/products/clones','#product-demo','clones'),('/products/trace','#product-demo','trace'),('/products/clones','#product-setup','clones-depth'),('/products/guard','#product-setup','guard-depth'),('/platform/swarm','.detail-section','swarm'),('/solutions/authentication-testing','.detail-section.muted-section','roles')]
with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
    page=context.new_page()
    page.on('pageerror',lambda e: report['errors'].append(str(e)))
    for route in ('/','/platform'):
        response=page.goto(args.base+route)
        assert response.status==200,(route,response.status)
        header_surface=page.locator('.site-header').evaluate('(el)=>getComputedStyle(el).backgroundColor')
        assert page.locator('.identity-hero .button-primary').get_attribute('href')=='https://app.molar.it/dashboard/signup'
        assert page.locator('.identity-hero .button-outline').get_attribute('href')==('#checkout-story' if route=='/' else '#how-it-works')
        assert page.locator('[data-checkout-story]').count()==1
        assert page.locator('.first-step').count()==1
        assert page.locator('.header-actions .button-primary').get_attribute('href')=='https://app.molar.it/dashboard/signup'
        report['checks'].append(route+' signup entry, public-page preview and interactive checkout story')
    page.goto(args.base+'/')
    page.locator('.identity-hero .entry-note a').click()
    page.locator('#instant-proof').wait_for()
    assert page.locator('.site-header').evaluate('(el)=>getComputedStyle(el).backgroundColor')==header_surface, 'Public check lost the shared website identity'
    assert page.get_by_label('Public URL',exact=True).input_value()=='https://example.com'
    assert page.get_by_label('What should be on the page?').input_value()=='The page has a heading called Example Domain.'
    assert page.get_by_role('button',name='Run check',exact=True).is_enabled()
    report['checks'].append('Homepage secondary preview reaches a usable sample check')
    page.goto(args.base+'/examples/autonomous-browser-check')
    page.locator('[data-recording-start]').click()
    page.wait_for_function("() => document.querySelector('.browser-check-example video').currentTime>1")
    video=page.locator('.browser-check-example video')
    report['video']=video.evaluate('(v)=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,currentTime:v.currentTime,error:v.error?.code||null})')
    assert 42<report['video']['duration']<45 and not report['video']['error']
    video.evaluate('(v)=>v.pause()')
    report['checks'].append('Native recorded evidence plays')
    for route in ('/products/mender','/platform/swarm','/platform/browser-agents','/platform/live-view','/platform/developer-tools','/solutions/integration-testing','/solutions/checkout-testing','/solutions/authentication-testing','/solutions/team-workflows','/solutions/preview-deployments','/solutions/workflow-automation','/solutions/web-data-extraction','/solutions/ai-agents','/solutions/startups','/solutions/web-app-testing','/resources','/security'):
        page.goto(args.base+route)
        figures=page.locator('.detail-section .scenario-detail')
        assert figures.count()==2,(route,figures.count())
        assert figures.nth(0).get_attribute('class')!=figures.nth(1).get_attribute('class'),route
        assert figures.locator('button').count()==0,route
        small=figures.evaluate_all("els=>els.flatMap(e=>[...e.querySelectorAll('*')]).filter(e=>e.children.length===0&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>e.textContent)")
        assert not small,(route,small)
    report['checks'].append('17 supporting pages have distinct section scenes, readable labels and no fake buttons')
    for width in (1440,390):
        page.set_viewport_size({'width':width,'height':900})
        for route,selector,name in shots:
            page.goto(args.base+route)
            page.evaluate('document.fonts.ready')
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),(width,route)
            target=page.locator(selector).first
            target.screenshot(path=str(out/f'{name}-{width}.png'),animations='disabled')
    report['checks'].append('Desktop and mobile visual review captures created')
    assert not report['errors'],report['errors']
    context.close();browser.close()
(out/'first-visit.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
