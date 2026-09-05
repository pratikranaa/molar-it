#!/usr/bin/env python3
"""Exercise the real Google tag after consent; only synthetic inputs are used."""
import json, os
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote
from playwright.sync_api import sync_playwright

BASE = os.getenv('MOLAR_CHECK_BASE', 'https://molar.it').rstrip('/')
OUT = Path(os.getenv('MOLAR_CHECK_OUT', '/tmp/molar-live-analytics.json'))
CANARY = 'molar_private_canary_20260906'
report = {'base': BASE, 'checks': {}, 'collection': []}
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    requests, responses, errors = [], [], []
    page.on('request', lambda r: requests.append(r) if any(h in r.url for h in ['google-analytics.com', 'googletagmanager.com']) else None)
    page.on('response', lambda r: responses.append({'url': r.url, 'status': r.status}) if 'google-analytics.com' in r.url else None)
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.goto(BASE+'/ask?q='+CANARY+'&question='+CANARY+'#'+CANARY)
    page.wait_for_timeout(1500)
    assert not requests, 'Google received a request before consent'
    report['checks']['silent_before_consent'] = True
    page.get_by_role('button', name='Accept analytics').click()
    page.wait_for_timeout(1500)
    assert not requests, 'Google loaded on a parameterized URL'
    report['checks']['parameterized_urls_keep_google_off'] = True
    page.goto(BASE+'/ask')
    page.wait_for_timeout(5000)
    assert len([r for r in requests if 'googletagmanager.com/gtag/js' in r.url]) == 1
    page.locator('#ask-question').fill('How can I test login for '+CANARY+'?')
    page.route('**/api/ask', lambda r:r.fulfill(content_type='application/json',body=json.dumps({'mode':'no-match','answer':'No matching guidance for this synthetic privacy check.','sources':[]})))
    page.locator('#ask-submit').click()
    page.locator('#ask-result').wait_for(state='visible')
    page.evaluate("MolarAnalytics.track('demo_interaction', {action:'replay'})")
    page.wait_for_timeout(6000)
    payloads = '\n'.join(unquote(r.url+' '+(r.post_data or '')) for r in requests)
    if CANARY in payloads:
        report['leaked_parameters'] = [{'endpoint':urlparse(r.url).path,'params':{k:v for k,v in parse_qs(urlparse(r.url).query).items() if CANARY in str(v)},'body':r.post_data if CANARY in unquote(r.post_data or '') else None} for r in requests if CANARY in unquote(r.url+' '+(r.post_data or ''))]
        OUT.write_text(json.dumps(report,indent=2))
        print(json.dumps(report,indent=2))
    assert CANARY not in payloads, 'Private input entered Google payloads'
    collection = [r for r in requests if 'google-analytics.com/g/collect' in r.url]
    assert collection, 'No actual GA collection request'
    assert any(r['status'] == 204 for r in responses), responses
    for r in collection:
        params = parse_qs(urlparse(r.url).query)
        body = r.post_data or ''
        report['collection'].append({'status':next((x['status'] for x in responses if x['url']==r.url),None),'event':params.get('en',[]),'location':params.get('dl',[]),'body_events':[parse_qs(line).get('en',[]) for line in body.splitlines()]})
    report['checks']['real_google_tag_and_collection'] = True
    report['checks']['question_query_and_fragment_not_collected'] = True
    # Reaching the footer can trigger a consented scroll hit. Let that existing
    # queue drain before testing actions initiated after withdrawal.
    with page.expect_response(lambda r:'google-analytics.com/g/collect' in r.url and parse_qs(urlparse(r.url).query).get('en')==['scroll'],timeout=15000):
        page.get_by_role('button', name='Privacy choices').click()
    page.get_by_role('button', name='Decline analytics').click()
    before = len(requests)
    page.evaluate("MolarAnalytics.track('demo_interaction', {action:'replay'})")
    page.evaluate('scrollTo(0,0)')
    page.locator('#ask-question').fill('Another synthetic question '+CANARY)
    page.evaluate('scrollTo(0,document.body.scrollHeight)')
    page.wait_for_timeout(5000)
    if len(requests) != before:
        report['after_withdrawal'] = [{'endpoint':urlparse(r.url).path,'params':{k:v for k,v in parse_qs(urlparse(r.url).query).items() if k not in ['cid','sid','sct','_p','_s']},'body':r.post_data} for r in requests[before:]]
        OUT.write_text(json.dumps(report,indent=2)); print(json.dumps(report,indent=2))
    assert len(requests) == before, 'Google request after consent withdrawal'
    assert not any(c['name'].startswith('_ga') for c in context.cookies())
    report['checks']['withdrawal_stops_collection_and_clears_cookies'] = True
    context.close()
    gpc = browser.new_context()
    gpc.add_init_script("Object.defineProperty(navigator,'globalPrivacyControl',{value:true}); localStorage.setItem('molar.analytics.consent.v1','granted')")
    gp = gpc.new_page(); gpc_requests=[]
    gp.on('request', lambda r:gpc_requests.append(r.url) if any(h in r.url for h in ['google-analytics.com','googletagmanager.com']) else None)
    gp.goto(BASE+'/ask'); gp.wait_for_timeout(1500)
    assert not gpc_requests, 'GPC did not prevent Google loading'
    assert gp.evaluate("MolarAnalytics.getConsent()") == 'denied'
    report['checks']['gpc_overrides_prior_grant'] = True
    report['console_errors'] = errors
    gpc.close(); browser.close()
OUT.write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
