#!/usr/bin/env python3
"""Verify new website flows; set MOLAR_CHECK_BASE to the deployment to test live AI."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.getenv('MOLAR_CHECK_BASE','http://localhost:8080').rstrip('/')
OUT=Path(os.getenv('MOLAR_CHECK_OUT','/tmp/molar-fullsite-browser'));OUT.mkdir(parents=True,exist_ok=True)
report={"base":BASE,"checks":{},"page_errors":[]}
with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={"width":1440,"height":1000},reduced_motion='reduce')
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
    page=context.new_page();page.set_default_timeout(30000)
    page.on('pageerror',lambda error:report['page_errors'].append(str(error)))
    page.goto(BASE+'/ask')
    page.locator('#ask-question').fill('What is the capital of France?')
    if 'localhost' in BASE:
        page.route('**/api/ask',lambda r:r.fulfill(content_type='application/json',body=json.dumps({'mode':'no-match','answer':'No matching guidance in the published sources.','sources':[]})))
    page.locator('#ask-submit').click();page.locator('#ask-result').wait_for(state='visible')
    assert page.locator('#ask-mode').inner_text()=='No matching guidance'
    report['checks']['no_match']=True
    if 'localhost' in BASE:page.unroute('**/api/ask')
    if 'localhost' not in BASE:
        page.get_by_role('button',name='How do I test delayed payment webhooks?').click()
        page.locator('#ask-result').wait_for(state='visible')
        report['answer']=page.locator('#ask-answer').inner_text()
        assert page.locator('#ask-mode').inner_text()=='Generated from the linked sources',page.locator('#ask-mode').inner_text()
        assert page.locator('#ask-sources a').count()>=1
        report['checks']['live_generated_answer']=True
        page.screenshot(path=str(OUT/'ask-live-answer.png'),full_page=True)
    page.route('**/api/ask',lambda r:r.fulfill(status=429,content_type='application/json',body=json.dumps({'error':'The answer limit has been reached. Try again later.'})))
    page.locator('#ask-question').fill('How do I test a payment?');page.locator('#ask-submit').click()
    page.locator('#ask-error').wait_for(state='visible');assert page.locator('#ask-submit').is_enabled();report['checks']['quota_error_recoverable']=True
    page.unroute('**/api/ask')
    page.route('**/api/ask',lambda r:r.fulfill(content_type='application/json',body=json.dumps({'mode':'sources','answer':'Here is a published source excerpt about controlled payment testing.','sources':[{'title':'Checkout testing','url':'/solutions/checkout-testing'}]})))
    page.locator('#ask-submit').click();page.locator('#ask-result').wait_for(state='visible');assert page.locator('#ask-mode').inner_text()=='From the published guides';report['checks']['retry_and_labeled_fallback']=True
    page.unroute('**/api/ask')
    held=[]
    page.route('**/api/ask',lambda r:held.append(r))
    page.locator('#ask-submit').click();page.locator('#ask-cancel').click();page.wait_for_timeout(150)
    assert page.locator('#ask-submit').is_enabled();assert page.locator('#ask-cancel').is_hidden();report['checks']['cancel']=True
    for route in held:
        try:route.abort()
        except Exception:pass
    page.unroute('**/api/ask')
    manifest=json.loads((Path(__file__).resolve().parents[1]/'marketing/build-manifest.json').read_text())
    for width in (390,833,1440):
        page.set_viewport_size({'width':width,'height':900})
        for url in manifest['routes']:
            path=url.removeprefix('https://molar.it') or '/'
            page.goto(BASE+path,wait_until='domcontentloaded')
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),(width,path)
        report['checks']['all_routes_no_overflow_'+str(width)]=len(manifest['routes'])
    assert not report['page_errors'],report['page_errors']
    context.close();browser.close()
(OUT/'checks.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
