#!/usr/bin/env python3
"""Verify synchronized Trace example controls and the technical reading path."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://localhost:8882')
parser.add_argument('--out', default='/tmp/molar-trace-depth')
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
    page.goto(args.base + '/products/trace')
    root = page.locator('[data-trace-example]')
    slider = page.locator('[data-trace-scrub]')
    assert root.get_attribute('data-trace-index') == '3'
    slider.focus()
    for key, index in [('Home', 0), ('ArrowRight', 1), ('ArrowRight', 2), ('End', 3), ('ArrowLeft', 2)]:
        page.keyboard.press(key)
        assert root.get_attribute('data-trace-index') == str(index)
        assert slider.input_value() == str(index)
        assert f'Step {index + 1} of 4' in slider.get_attribute('aria-valuetext')
        assert page.locator(f'[data-trace-step="{index}"]').get_attribute('aria-pressed') == 'true'
        assert page.locator('.pt-track .is-current').count() == 4
    report['checks'].append('Native scrubber, keyboard Home/End/arrows, selected steps, output and all four tracks synchronize')

    for kind in ('network', 'console', 'page', 'state'):
        for index in range(4):
            button = page.locator(f'[data-trace-event="{index}"][data-trace-kind="{kind}"]')
            button.click()
            assert root.get_attribute('data-trace-index') == str(index)
            assert slider.input_value() == str(index)
            assert button.get_attribute('aria-pressed') == 'true'
            assert page.locator('[data-trace-panel]').get_attribute('aria-labelledby') == 'trace-tab-' + kind
            assert 'failed run' in page.locator('.pt-toolbar').inner_text()
    page.locator('[data-trace-event="2"][data-trace-kind="network"]').click()
    assert '500' in page.locator('[data-trace-panel]').inner_text()
    page.locator('[data-trace-compare]').click()
    assert '200' in page.locator('[data-trace-baseline]').inner_text()
    page.locator('[data-trace-view="page"]').click()
    assert 'Free plan' in page.locator('[data-trace-panel]').inner_text()
    assert 'Pro plan' in page.locator('[data-trace-baseline]').inner_text()
    report['checks'].append('All 16 event markers select the correct step and inspector; passing/failing DOM and network examples remain distinct')

    for block in page.locator('.product-story .code-window').all():
        expected = block.locator('pre code').inner_text()
        block.locator('[data-copy]').click()
        assert page.evaluate('navigator.clipboard.readText()') == expected
    assert page.locator('.product-story .code-window').count() == 5
    report['checks'].append('All five setup, CLI and MCP code blocks copy exact multiline content')

    for width in (1440, 833, 390, 320):
        page.set_viewport_size({'width': width, 'height': 1000})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), width
        for target in ('product-demo', 'product-setup', 'product-capabilities', 'trace-agent-tools'):
            page.locator(f'.product-section-nav a[href="#{target}"]').click()
            assert page.locator('#' + target).bounding_box()['y'] >= 120, (width, target)
        for index in (1, 2, 3):
            page.locator(f'[data-trace-cite="{index}"]').click()
            assert root.get_attribute('data-trace-index') == str(index)
            assert page.locator('[data-trace-panel]').evaluate('(e)=>e===document.activeElement')
            assert page.locator('[data-trace-panel]').bounding_box()['y'] >= 120
        if width <= 390:
            page.locator('[data-trace-event="2"][data-trace-kind="network"]').click()
            assert page.locator('.pt-inspector').bounding_box()['y'] >= 120
        report['checks'].append(f'{width}px: no overflow; all section anchors, three investigation references and mobile markers navigate below attached headers')
        if width in (1440, 390):
            page.locator('[data-trace-step="2"]').click()
            page.locator('[data-trace-view="network"]').click()
            style = page.add_style_tag(content='.site-header,.product-section-nav,.skip-link{visibility:hidden!important}')
            for selector, name in (('.pt-demo-section', 'demo'), ('.pt-investigation', 'investigation'), ('.pt-setup', 'setup'), ('.pt-capture-section', 'capture'), ('.pt-agent-section', 'agents')):
                filename = f'trace-{name}-{width}.png'
                page.locator(selector).screenshot(path=str(out / filename), animations='disabled')
                report['captures'].append(filename)
            style.evaluate('(e)=>e.remove()')

    for width, name in ((1440, 'desktop'), (390, 'mobile')):
        page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
        page.goto(args.base + '/products/trace')
        page.evaluate('document.fonts.ready')
        page.screenshot(path=str(out / f'{name}.png'))
        report['captures'].append(f'{name}.png')
    context.close()
    context = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    page = context.new_page()
    page.goto(args.base + '/products/trace')
    assert 'access check failed' in page.locator('[data-trace-finding]').inner_text()
    assert page.locator('#product-questions details').count() == 11
    assert page.locator('.product-story .code-window').count() == 5
    assert page.locator('.pt-artifact-list .is-missing').inner_text() == 'Not captured'
    assert page.locator('.pt-replay-boundary').is_visible()
    report['checks'].append('Without JavaScript, the failure, setup, artifact limits, replay distinction and eleven FAQs remain readable')
    browser.close()

assert not report['errors'], report['errors']
assert not report['api_requests'], report['api_requests']
(out / 'trace-depth.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
