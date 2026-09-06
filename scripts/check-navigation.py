#!/usr/bin/env python3
"""Measure actual hover latency and menu continuity in a browser, including 4× CPU.

--baseline records the old behavior without enforcing the responsiveness budget.
These are local browser measurements, not field INP or a device FPS guarantee.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base', default='http://localhost:8080')
parser.add_argument('--out', default='/tmp/molar-navigation')
parser.add_argument('--baseline', action='store_true')
args = parser.parse_args()
out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
report = {'base': args.base, 'profiles': [], 'checks': [], 'errors': []}

INSTRUMENT = """() => {
  window.navSamples = []; window.navInputs = []; window.navLongTasks = [];
  const groups = [...document.querySelectorAll('.nav-group')];
  groups.forEach((group,index) => group.querySelector('summary').addEventListener('pointerenter', () => {
    navInputs.push({index,time:performance.now()});
  }));
  new PerformanceObserver(list => navLongTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))))
    .observe({type:'longtask'});
  const sample = time => {
    const group = groups.find(g=>g.open), inner = group?.querySelector('.dropdown-inner');
    const style = inner && getComputedStyle(inner);
    navSamples.push({time,open:groups.indexOf(group),transform:style?.transform,opacity:style?.opacity});
    window.navRaf = requestAnimationFrame(sample);
  };
  window.navRaf = requestAnimationFrame(sample);
}"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    for route in ('/', '/platform'):
        for cpu in (1, 4):
            context = browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=2)
            context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
            page = context.new_page()
            page.on('pageerror', lambda e: report['errors'].append(str(e)))
            page.goto(args.base.rstrip('/') + route)
            page.evaluate('document.fonts.ready')
            client = context.new_cdp_session(page)
            client.send('Emulation.setCPUThrottlingRate', {'rate':cpu})
            page.evaluate(INSTRUMENT)
            for index in range(4):
                page.locator('.nav-group > summary').nth(index).hover()
                page.wait_for_timeout(680)
            result = page.evaluate('({samples:navSamples,inputs:navInputs,longTasks:navLongTasks})')
            samples = result['samples']
            timings = []
            for inp in result['inputs']:
                first = next(s for s in samples if s['time'] >= inp['time'] and s['open'] == inp['index'])
                gap = [s for s in samples if inp['time'] <= s['time'] < first['time'] and s['open'] == -1]
                timings.append({'menu':inp['index'],'latency_ms':round(first['time']-inp['time'],1),
                                'blank_frames_while_switching':len(gap) if inp['index'] else 0})
            gaps = [b['time']-a['time'] for a,b in zip(samples,samples[1:])]
            profile = {'route':route,'cpu_slowdown':cpu,'timings':timings,'frames':len(samples),
                       'frame_gap_p95_ms':round(sorted(gaps)[int(len(gaps)*.95)],1),
                       'frames_over_34ms':sum(g>34 for g in gaps),'long_tasks':result['longTasks'],
                       'moving_text_frames':sum(s.get('transform','none') != 'none' for s in samples if s['open']>=0)}
            report['profiles'].append(profile)
            if not args.baseline:
                assert timings[0]['latency_ms'] < 200, profile
                assert all(t['latency_ms'] < 90 and t['blank_frames_while_switching'] == 0 for t in timings[1:]), profile
                assert profile['moving_text_frames'] == 0, profile
            if route == '/' and cpu == 1:
                page.screenshot(path=str(out/'desktop-menu.png'))
            page.evaluate('cancelAnimationFrame(navRaf)')
            context.close()
    if not args.baseline:
        context = browser.new_context(viewport={'width':1440,'height':1000})
        context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
        page = context.new_page()
        page.on('pageerror', lambda e: report['errors'].append(str(e)))
        page.goto(args.base.rstrip('/') + '/')
        summaries = page.locator('.nav-group > summary')
        groups = page.locator('.nav-group')
        first = summaries.first.bounding_box()
        x, y = first['x']+first['width']/2, first['y']+first['height']/2

        def closed():
            assert page.locator('.nav-group[open]').count() == 0

        # Fly-bys and dismissals must cancel the pending open, not reopen later.
        page.mouse.move(x, y)
        page.mouse.move(1300, 900)
        page.wait_for_timeout(300)
        closed()
        page.mouse.move(x, y)
        page.keyboard.press('Escape')
        page.wait_for_timeout(300)
        closed()
        page.mouse.move(1300, 900)
        page.mouse.move(x, y)
        page.mouse.click(1300, 900)
        page.wait_for_timeout(300)
        closed()
        report['checks'].append('fly-by, Escape, and outside click cancel pending hover')

        summaries.first.hover()
        page.wait_for_timeout(200)
        assert groups.first.get_attribute('open') is not None
        groups.first.locator('.dropdown-links a').last.hover()
        page.wait_for_timeout(240)
        assert groups.first.get_attribute('open') is not None
        page.mouse.move(1300, 900)
        page.wait_for_timeout(240)
        closed()
        report['checks'].append('pointer can enter menu links; leaving closes menu')

        summaries.first.focus()
        page.keyboard.press('Enter')
        assert groups.first.get_attribute('open') is not None
        page.keyboard.press('Tab')
        assert page.evaluate("document.activeElement.closest('.nav-dropdown') !== null")
        page.keyboard.press('Escape')
        closed()
        assert summaries.first.evaluate('(el)=>el===document.activeElement')
        page.keyboard.press('Space')
        assert groups.first.get_attribute('open') is not None
        page.locator('.header-actions a').last.focus()
        closed()
        report['checks'].append('Enter, Space, Tab, Escape focus return, and focus-out')

        # An explicit click wins over hover; no delayed toggle can reopen it.
        summaries.first.click()
        page.wait_for_timeout(250)
        assert groups.first.get_attribute('open') is not None
        summaries.first.click()
        page.wait_for_timeout(250)
        closed()
        report['checks'].append('click open and close are stable after the hover window')

        page.mouse.move(1300, 900)
        page.mouse.move(x, y)
        page.set_viewport_size({'width':833,'height':1000})
        page.wait_for_timeout(300)
        closed()
        assert page.locator('.mobile-toggle').get_attribute('aria-expanded') == 'false'
        report['checks'].append('breakpoint change cancels pending desktop hover')

        page.set_viewport_size({'width':1440,'height':1000})
        page.emulate_media(reduced_motion='reduce')
        summaries.first.focus()
        page.keyboard.press('Enter')
        assert groups.first.locator('.dropdown-inner').evaluate('(el)=>getComputedStyle(el).animationName') == 'none'
        page.keyboard.press('Escape')
        page.evaluate('window.scrollTo(0,1000)')
        page.wait_for_timeout(100)
        assert abs(page.locator('.site-header').bounding_box()['y']) <= 1
        report['checks'].append('reduced motion and attached header after scrolling')
        tabs = page.locator('[data-showcase-tab]')
        tabs.nth(1).click()
        panel = page.locator('.product-panels [role=tabpanel]:not([hidden])')
        assert panel.count() == 1
        assert panel.evaluate('(el)=>getComputedStyle(el).transform') == 'none'
        page.emulate_media(reduced_motion='no-preference')
        tabs.nth(2).click()
        assert panel.evaluate('(el)=>getComputedStyle(el).transform') == 'none'
        assert panel.evaluate('(el)=>getComputedStyle(el).animationDuration') == '0.18s'
        report['checks'].append('product tabs preserve crisp text and respect reduced motion')
        context.close()

        for width in (390, 833):
            context = browser.new_context(viewport={'width':width,'height':900},has_touch=True,is_mobile=True,device_scale_factor=2)
            context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
            page = context.new_page()
            page.on('pageerror', lambda e: report['errors'].append(str(e)))
            page.goto(args.base.rstrip('/') + '/')
            page.locator('.mobile-toggle').tap()
            assert page.locator('.mobile-toggle').get_attribute('aria-expanded') == 'true'
            summaries = page.locator('.nav-group > summary')
            summaries.first.tap()
            page.wait_for_timeout(220)
            assert page.locator('.nav-group[open]').count() == 1
            summaries.nth(1).tap()
            page.wait_for_timeout(220)
            assert page.locator('.nav-group[open]').count() == 1
            assert page.locator('.nav-group').nth(1).get_attribute('open') is not None
            assert page.locator('.nav-group[open] .nav-dropdown').evaluate('(el)=>getComputedStyle(el).boxShadow') == 'none'
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
            page.screenshot(path=str(out/f'mobile-menu-{width}.png'))
            page.locator('.mobile-toggle').tap()
            closed()
            assert page.locator('.mobile-toggle').get_attribute('aria-expanded') == 'false'
            report['checks'].append(f'{width}px touch open, switch, close, no desktop shadow, and no overflow')
            context.close()
        assert not report['errors'], report['errors']
    browser.close()

(out/'report.json').write_text(json.dumps(report, indent=2)+'\n')
print(json.dumps(report, indent=2))
