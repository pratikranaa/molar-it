#!/usr/bin/env python3
"""Blog search, reader controls and answer recovery; inference is explicitly mocked."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE=os.getenv('MOLAR_CHECK_BASE','http://localhost:8080').rstrip('/')
OUT=Path(os.getenv('MOLAR_CHECK_OUT','/tmp/molar-blog-browser'));OUT.mkdir(parents=True,exist_ok=True)
report={'base':BASE,'inference':'mocked for interaction contracts','checks':{},'page_errors':[]}
sources=[{'title':'Playwright downloads','url':'https://playwright.dev/docs/downloads'}]
with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce',permissions=['clipboard-read','clipboard-write'])
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
    page=context.new_page();page.on('pageerror',lambda error:report['page_errors'].append(str(error)))
    page.goto(BASE+'/blog')
    routes=page.locator('[data-blog-entry]').evaluate_all('(cards)=>cards.map(c=>new URL(c.href).pathname)')
    requests=[]
    def answer(route):
        requests.append(route.request.post_data_json)
        route.fulfill(content_type='application/json',body=json.dumps({'mode':'generated','answer':'Wait for the download before clicking. Save and check the file contents.','sources':sources}))
    page.route('**/api/ask',answer)
    page.get_by_role('button',name='Agents',exact=True).click()
    assert page.locator('[data-blog-entry]:visible').count()>0
    assert page.locator('[data-blog-entry]:visible').evaluate_all('(cards)=>cards.every(c=>c.dataset.category==="Agents")')
    page.get_by_role('button',name='All',exact=True).click()
    page.locator('[data-blog-search]').fill('How do I test an unfamiliar export?')
    expect(page.locator('[data-blog-empty]')).to_be_visible()
    assert not requests,'Typing must not invoke generation'
    page.locator('[data-use-blog-query]').click()
    expect(page.locator('#ask-result')).to_be_visible()
    assert requests==[{'question':'How do I test an unfamiliar export?'}]
    expect(page.locator('#ask-answered-question')).to_have_text(requests[0]['question'])
    page.locator('#ask-copy').click();expect(page.locator('#ask-copy')).to_have_text('Copied with sources')
    copied=page.evaluate('navigator.clipboard.readText()');assert requests[0]['question'] in copied and sources[0]['url'] in copied
    with page.expect_download() as received:page.locator('#ask-save').click()
    download=received.value;download.save_as(str(OUT/'saved-answer.txt'));assert (OUT/'saved-answer.txt').read_text()==copied
    report['checks']['search_filters_explicit_answer_copy_save']=True
    page.unroute('**/api/ask')
    page.route('**/api/ask',lambda r:r.fulfill(status=429,content_type='application/json',body=json.dumps({'error':'Answer limit reached. Read these guides now.','sources':sources})))
    page.locator('#ask-submit').click();expect(page.locator('#ask-result-title')).to_have_text('Guides you can read now')
    expect(page.locator('#ask-sources a')).to_have_count(1);expect(page.locator('#ask-submit')).to_be_enabled()
    report['checks']['quota_preserves_reading_paths']=True
    page.unroute('**/api/ask')
    for mode,label in [('sources','From the published guides'),('no-match','No matching guidance')]:
        page.route('**/api/ask',lambda r:r.fulfill(content_type='application/json',body=json.dumps({'mode':mode,'answer':'<script>window.untrustedAnswer=true</script> This is displayed as text.','sources':sources if mode=='sources' else []})))
        page.locator('#ask-submit').click();expect(page.locator('#ask-mode')).to_have_text(label)
        assert page.evaluate('window.untrustedAnswer===undefined')
        if mode=='no-match':expect(page.locator('#ask-sources')).to_be_hidden()
        page.unroute('**/api/ask')
    report['checks']['source_fallback_no_match_plain_text']=True
    held=[];page.route('**/api/ask',lambda r:held.append(r))
    page.locator('#ask-submit').click();expect(page.locator('#ask-cancel')).to_be_visible()
    page.locator('#ask-cancel').click();expect(page.locator('#ask-submit')).to_be_enabled()
    for route in held:
        try:route.fulfill(content_type='application/json',body=json.dumps({'mode':'generated','answer':'This canceled response must not be shown.','sources':sources}))
        except Exception:pass
    expect(page.locator('#ask-result')).to_be_hidden();page.unroute('**/api/ask')
    report['checks']['cancel_ignores_late_answer']=True
    page.goto(BASE+'/blog/test-stripe-without-real-cards')
    expected_code=page.locator('.article-code code').first.inner_text()
    page.locator('.article-code [data-copy]').first.click()
    expect(page.locator('.article-code [data-copy] span').first).to_have_text('Copied')
    assert page.evaluate('navigator.clipboard.readText()')==expected_code
    report['checks']['article_code_copy_preserves_newlines']=True
    for width in (390,833,1440):
        page.set_viewport_size({'width':width,'height':900})
        for route in ['/blog']+routes:
            page.goto(BASE+route,wait_until='domcontentloaded')
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),(width,route)
            expect(page.locator('#ask-form')).to_have_count(1)
            if route!='/blog':
                expect(page.locator('[data-article-graphic]')).to_have_count(1)
                assert page.locator('.article-graphic__nodes').evaluate('(e)=>!Array.from(e.childNodes).some(n=>n.nodeType===3&&n.textContent.trim())')
                assert page.locator('.related-guides [data-blog-entry]').count()==3
        report['checks']['article_layouts_'+str(width)]=len(routes)
    page.set_viewport_size({'width':390,'height':844})
    page.goto(BASE+'/blog/test-stripe-without-real-cards')
    page.locator('.article-mobile-toc summary').click()
    target=page.locator('.article-mobile-toc a').nth(1);anchor=target.get_attribute('href');target.click()
    expect(page.locator('.article-mobile-toc')).not_to_have_attribute('open','')
    assert page.url.endswith(anchor)
    report['checks']['mobile_toc_navigation']=True
    for name,route,width,selector in [('blog-desktop','/blog',1440,None),('blog-question','/blog',1440,'#ask-form'),('blog-grid','/blog',1440,'.blog-controls'),('stripe-desktop','/blog/test-stripe-without-real-cards',1440,None),('stripe-figure','/blog/test-stripe-without-real-cards',1440,'[data-article-graphic]'),('otp-figure','/blog/email-workflow-testing-otp',1440,'[data-article-graphic]'),('stripe-mobile','/blog/test-stripe-without-real-cards',390,None),('figure-mobile','/blog/test-stripe-without-real-cards',390,'[data-article-graphic]'),('followup-mobile','/blog/test-stripe-without-real-cards',390,'#article-question')]:
        page.set_viewport_size({'width':width,'height':1000 if width>500 else 844});page.goto(BASE+route);page.evaluate('document.fonts.ready')
        if selector:page.locator(selector).scroll_into_view_if_needed()
        page.screenshot(path=str(OUT/(name+'.png')))
    assert not report['page_errors'],report['page_errors']
    context.close();browser.close()
(OUT/'browser-checks.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
