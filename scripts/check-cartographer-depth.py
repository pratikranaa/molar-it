#!/usr/bin/env python3
"""Check the Cartographer product example, setup copy and responsive reading path."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://localhost:8882')
parser.add_argument('--out', default='/tmp/molar-cartographer-depth')
args = parser.parse_args()
out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
report = {'base': args.base, 'checks': [], 'errors': [], 'api_requests': [], 'captures': []}
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce', permissions=['clipboard-read', 'clipboard-write'])
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
    page = context.new_page()
    page.on('pageerror', lambda error: report['errors'].append(str(error)))
    page.on('request', lambda request: report['api_requests'].append(request.url) if '/api/' in request.url else None)
    page.goto(args.base + '/products/cartographer')
    for index, status in enumerate(['Observed', 'Observed', 'Observed', 'Failed', 'Not run']):
        page.locator(f'[data-cg-step="{index}"]').click()
        assert page.locator('[data-cg-status]').inner_text() == status
        assert page.locator('[data-cg-step-panel]').get_attribute('aria-labelledby') == f'cg-step-{index}'
        assert page.locator('.cgr-head strong').inner_text() == 'Failed at the receipt check'
    assert page.locator('[data-cg-target]').inner_text() == 'No element inspected'
    assert 'No account-access result' in page.locator('[data-cg-observed]').inner_text()
    report['checks'].append('Five step selections update the target, action and observed state without changing the overall failed result; the unrun step has no fabricated evidence')
    page.locator('[data-cg-step="4"]').focus()
    for key, index in [('Home', 0), ('End', 4), ('ArrowDown', 0), ('ArrowUp', 4)]:
        page.keyboard.press(key)
        assert page.locator(f'[data-cg-step="{index}"]').evaluate('(e)=>e===document.activeElement')
        assert page.locator('[data-cg-run]').get_attribute('data-cg-selected') == str(index)
    report['checks'].append('Vertical keyboard tabs, Home/End, wrapping, focus and panel association work')
    for block in page.locator('.product-story .code-window').all():
        expected = block.locator('pre code').inner_text()
        block.locator('[data-copy]').click()
        assert page.evaluate('navigator.clipboard.readText()') == expected
    assert page.locator('.product-story .code-window').count() == 5
    report['checks'].append('All five code blocks copy exact multiline content')
    for width in (1440, 833, 390, 320):
        page.set_viewport_size({'width': width, 'height': 1000})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), width
        for target in ('cartographer-run', 'product-setup', 'product-capabilities'):
            page.locator(f'.product-section-nav a[href="#{target}"]').click()
            assert page.locator('#' + target).bounding_box()['y'] >= 120, (width, target)
        page.locator('[data-cg-step="3"]').click()
        assert page.locator('[data-cg-expected]').inner_text() == '$24.00'
        assert page.locator('[data-cg-value]').inner_text() == '$240.00'
        if width <= 390:
            assert page.locator('[data-cg-step-panel]').bounding_box()['y'] >= 120
        report['checks'].append(f'{width}px: no page overflow; section anchors and selected mobile details remain below attached navigation')
        if width in (1440, 390):
            # Isolated section captures exclude fixed navigation overlays; viewport captures below preserve the real header.
            style = page.add_style_tag(content='.site-header,.product-section-nav,.skip-link{visibility:hidden!important}')
            for selector, name in (('.cgr-section', 'inspection'), ('.cg-setup', 'setup'), ('.cg-capabilities', 'export'), ('.cg-tools-section', 'tools')):
                capture = f'cartographer-{name}-{width}.png'
                page.locator(selector).screenshot(path=str(out / capture), animations='disabled')
                report['captures'].append(capture)
            style.evaluate('(e)=>e.remove()')
    for width, name in ((1440, 'desktop'), (390, 'mobile')):
        page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
        page.goto(args.base + '/products/cartographer')
        page.evaluate('document.fonts.ready')
        page.screenshot(path=str(out / f'{name}.png'))
        report['captures'].append(f'{name}.png')
    context.close()
    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    page = context.new_page()
    page.goto(args.base + '/products/cartographer')
    assert page.locator('[data-cg-value]').inner_text() == '$240.00'
    assert page.locator('.cg-export-status').is_visible()
    assert page.locator('.product-story .code-window').count() == 5
    assert page.locator('#product-questions details').count() == 9
    report['checks'].append('Without JavaScript, the sample failure, setup examples, export availability, handoffs and nine answers remain readable')
    browser.close()
assert not report['errors'], report['errors']
assert not report['api_requests'], report['api_requests']
(out / 'cartographer-depth.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
