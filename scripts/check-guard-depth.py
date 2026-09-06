#!/usr/bin/env python3
"""Check Guard's selection, schedule and repair examples without dispatching runs."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://localhost:8882')
parser.add_argument('--out', default='/tmp/molar-guard-depth')
args = parser.parse_args()
out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
report = {'base': args.base, 'checks': [], 'errors': [], 'api_requests': [], 'captures': []}
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce', permissions=['clipboard-read','clipboard-write'])
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
    page = context.new_page()
    page.on('pageerror', lambda error: report['errors'].append(str(error)))
    page.on('request', lambda request: report['api_requests'].append(request.url) if '/api/' in request.url else None)
    page.goto(args.base + '/products/guard')
    selection=page.locator('[data-guard-selection]')
    for case, names, text in [('mapped',['checkout'],'1 of 3'), ('scenario',['invite-member'],'edited scenario'), ('large',['checkout','signin-and-dashboard','invite-member'],'full configured suite'), ('unmapped',[],'No tests selected')]:
        button=selection.locator(f'[data-selection-case="{case}"]')
        button.focus()
        page.keyboard.press('Enter')
        assert button.get_attribute('aria-pressed')=='true'
        assert selection.locator('.pgd-selection-list .is-selected code').all_inner_texts()==names
        assert text in selection.locator('.pgd-selection-summary').inner_text()
        assert 'Selection only · no execution result' in selection.inner_text()
        assert 'PASSED' not in selection.inner_text()
    report['checks'].append('All four selection cases, keyboard activation and selected rows agree; empty selection is not presented as a pass')

    monitor=page.locator('[data-guard-monitor]')
    for index, status in enumerate(['Passed','Failed','Queued','Passed','Passed','Queued','Passed','Not run','Paused']):
        button=monitor.locator(f'[data-monitor-run="{index}"]')
        button.focus()
        page.keyboard.press('Space')
        assert button.get_attribute('aria-pressed')=='true'
        panel=monitor.locator('[data-monitor-panel]')
        assert panel.locator('.pgd-history-status').inner_text()==status
        if status in ('Queued','Not run','Paused'):
            assert panel.locator('dd').count()==0
            assert 'No assertion result' in panel.inner_text()
        else:
            assert panel.locator('dd').count()==2
        assert monitor.locator('[data-monitor-run="1"]').inner_text()=='Failed'
    monitor.locator('[data-monitor-run="1"]').click()
    assert 'Account still shows Free' in monitor.locator('[data-monitor-panel]').inner_text()
    report['checks'].append('All nine schedule cells preserve independent outcomes; queued, paused and unrun slots have no invented assertions')

    for block in page.locator('.product-story .code-window').all():
        expected=block.locator('pre code').inner_text()
        block.locator('[data-copy]').click()
        assert page.evaluate('navigator.clipboard.readText()')==expected
    assert page.locator('.product-story .code-window').count()==3
    assert 'not an executed repair' in page.locator('#guard-repair').inner_text()
    report['checks'].append('Three CI, CLI and regression-test excerpts copy exact content; the repair excerpt states its setup and example scope')

    for width in (1440,833,390,320):
        page.set_viewport_size({'width':width,'height':1000})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), width
        for target in ('product-demo','guard-selection','product-setup','product-capabilities','guard-repair','product-questions'):
            page.locator(f'.product-section-nav a[href="#{target}"]').click()
            assert page.locator('#'+target).bounding_box()['y']>=120, (width,target)
        selection.locator('[data-selection-case="unmapped"]').click()
        assert 'No tests selected' in selection.locator('[data-selection-panel]').inner_text()
        monitor.locator('[data-monitor-run="8"]').click()
        assert 'No assertion result' in monitor.locator('[data-monitor-panel]').inner_text()
        report['checks'].append(f'{width}px: selection, monitor and all six anchors work beneath attached navigation without page overflow')
        if width in (1440,390):
            selection.locator('[data-selection-case="mapped"]').click()
            monitor.locator('[data-monitor-run="1"]').click()
            style=page.add_style_tag(content='.site-header,.product-section-nav,.skip-link{visibility:hidden!important}')
            for selector,name in (('.pgd-selection-section','selection'),('.pgd-setup-section','setup'),('.pgd-capabilities-section','monitor'),('.pgd-repair-section','repair')):
                filename=f'guard-{name}-{width}.png'
                page.locator(selector).screenshot(path=str(out/filename),animations='disabled')
                report['captures'].append(filename)
            style.evaluate('(e)=>e.remove()')
    context.close()
    context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    page=context.new_page()
    page.goto(args.base+'/products/guard')
    assert '1 of 3 scenarios selected' in page.locator('[data-selection-panel]').inner_text()
    assert 'Account still shows Free' in page.locator('[data-monitor-panel]').inner_text()
    assert page.locator('#product-questions details').count()==11
    assert page.locator('.product-story .code-window').count()==3
    report['checks'].append('No-JavaScript page retains selection, failed schedule result, three setup excerpts and eleven technical FAQs')
    browser.close()
assert not report['errors'],report['errors']
assert not report['api_requests'],report['api_requests']
(out/'guard-depth.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
