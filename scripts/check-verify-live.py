#!/usr/bin/env python3
"""Run one public Example Domain check and record console/preview delivery evidence."""
import argparse, json, time
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='https://molar.it')
parser.add_argument('--out',default='/tmp/molar-verify-live')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
report={'base':args.base,'errors':[],'csp':[],'frames':[],'status_polls':0,'beacon':[]}
with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={'width':1440,'height':1000})
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied');window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push({directive:e.effectiveDirective,uri:e.blockedURI.startsWith('data:')?'data:':e.blockedURI}))")
    page=context.new_page()
    page.on('console',lambda m:report['errors'].append(m.text[:500]) if m.type=='error' else None)
    page.on('pageerror',lambda e:report['errors'].append(str(e)))
    responses=[]
    def response(r):
        if 'static.cloudflareinsights.com' in r.url:report['beacon'].append(r.status)
        if '/api/instant-proof' not in r.url:return
        if '/frame?' in r.url:
            report['frames'].append({'step':int(r.url.split('step=')[-1]),'http':r.status,'type':r.headers.get('content-type'),'time':round(time.monotonic(),2)})
        else:
            responses.append(r)
            if r.request.method=='GET':report['status_polls']+=1
    page.on('response',response)
    navigation=page.goto(args.base+'/verify')
    report['policy']=navigation.headers.get('content-security-policy')
    assert page.get_by_label('Public URL',exact=True).input_value()=='https://example.com'
    page.get_by_role('button',name='Run check',exact=True).click()
    deadline=time.monotonic()+145
    while time.monotonic()<deadline:
        page.wait_for_timeout(500)
        state=page.locator('#instant-proof').get_attribute('data-state')
        if state in ('completed','failed'):
            report['ui_state']=state
            break
    report['frame']=page.locator('.frame img').evaluate_all('els=>els.map(e=>({width:e.naturalWidth,height:e.naturalHeight}))')
    report['ui_text']=page.locator('#instant-proof').inner_text()[-1800:]
    report['csp']=page.evaluate('window.__csp')
    report['fonts']=page.evaluate('()=>[...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family)')
    for r in responses[-2:]:
        try:
            body=r.json()
            report['last_response']={k:body[k] for k in ('status','result','error') if k in body}
        except Exception:pass
    page.locator('#instant-proof').screenshot(path=str(out/'verify.png'))
    browser.close()
(out/'verify-live.json').write_text(json.dumps(report,indent=2))
assert report.get('ui_state')=='completed',report.get('ui_text')
assert report['frame'] and report['frame'][0]['width']>0,report['frame']
assert not report['errors'],report['errors']
assert not report['csp'],report['csp']
assert all(frame['http'] in (200,204) for frame in report['frames']),report['frames']
assert 200 in report['beacon'],report['beacon']
assert 'Hanken' in report['fonts'],report['fonts']
print(json.dumps({'state':report['ui_state'],'frame':report['frame'],'status_polls':report['status_polls'],'frame_requests':len(report['frames']),'errors':report['errors'],'fonts':report['fonts']},indent=2))
