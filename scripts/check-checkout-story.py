#!/usr/bin/env python3
"""Exercise the authored checkout story without calling a product or payment API."""
import argparse, json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://localhost:8878')
parser.add_argument('--no-captures',action='store_true')
parser.add_argument('--out',default='/tmp/molar-checkout-story')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
report={'checks':[],'layout':[],'errors':[],'requests':[],'contrast':[]}
contrast_js=r'''() => {
 const rgb=s=>{const n=s.match(/[\d.]+/g);return n?n.map(Number):[0,0,0,0]};
 const mix=(a,b)=>{const alpha=a[3]??1;return a.slice(0,3).map((v,i)=>v*alpha+b[i]*(1-alpha))};
 const luminance=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0);
 const rows=[];
 for(const el of document.querySelectorAll('.checkout-story *')){
  // Clipped announcements have no visible text to measure.
  if(el.tagName==='VIDEO'||el.closest('.sr-only'))continue;
  if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||el.closest('[hidden]'))continue;
  const style=getComputedStyle(el),parents=[];for(let p=el;p;p=p.parentElement)parents.unshift(p);
  let bg=[255,255,255];for(const p of parents)bg=mix(rgb(getComputedStyle(p).backgroundColor),bg);
  const fg=mix(rgb(style.color),bg),a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  const size=parseFloat(style.fontSize),large=size>=24||(size>=18.66&&Number(style.fontWeight)>=700);
  if(ratio<(large?3:4.5))rows.push({text:el.textContent.trim().slice(0,90),class:el.className,ratio:+ratio.toFixed(2),size,fg:style.color,bg});
 }return rows;
}'''
with sync_playwright() as p:
    browser=p.chromium.launch()
    context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    context.add_init_script("localStorage.setItem('molar.analytics.consent.v1','denied')")
    page=context.new_page()
    page.on('pageerror',lambda e: report['errors'].append(str(e)))
    page.on('request',lambda r: report['requests'].append(r.url) if '/api/' in r.url else None)
    for route in ('/','/platform'):
        assert page.goto(args.base+route).status==200
        scene=page.locator('[data-checkout-story]')
        scene.scroll_into_view_if_needed()
        assert scene.get_attribute('data-step')=='5'
        assert 'is-playing' not in scene.get_attribute('class')
        assert page.locator('.identity-hero .button-outline').get_attribute('href')=='#checkout-story'
        assert page.locator('main video').count()==0
        for condition,verdict,plan in [('working','passed','Pro'),('decline','passed','Free'),('callback','failed','Free')]:
            scene.locator(f'[data-story-condition="{condition}"]').click()
            assert scene.get_attribute('data-result')==verdict
            assert scene.locator('.fs-plan-tag').inner_text()==plan
        scene.locator('[data-story-details] summary').click()
        assert json.loads(scene.locator('[data-story-json]').inner_text())['error']=='account_update_failed'
        scene.locator('[data-story-details] summary').click()
        scene.locator('[data-story-step="5"]').focus()
        page.keyboard.press('Home')
        assert scene.get_attribute('data-step')=='0'
        page.keyboard.press('ArrowRight')
        assert scene.get_attribute('data-step')=='1'
        page.keyboard.press('End')
        assert scene.get_attribute('data-step')=='5'
        assert scene.locator('[data-story-play] span').inner_text()=='Replay'
        report['checks'].append(route+' cases, request inspection, keyboard tabs, reduced motion, CTA')
        for width in (1440,833,390):
            page.set_viewport_size({'width':width,'height':1000})
            for phase in range(6):
                scene.locator(f'[data-story-step="{phase}"]').click()
                page.evaluate('document.fonts.ready')
                geometry=scene.evaluate('''root=>{const s=root.querySelector('.fs-screen'),c=s.firstElementChild;return {pageOverflow:document.documentElement.scrollWidth>innerWidth,screen:s.clientHeight,content:c.getBoundingClientRect().height,small:[...root.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()&&getComputedStyle(e).display!=='none'&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>e.textContent),fieldClip:root.querySelector('.fs-field strong')?getComputedStyle(root.querySelector('.fs-field strong')).clipPath:null}}''')
                report['contrast'].extend(dict(route=route,width=width,phase=phase,**row) for row in page.evaluate(contrast_js))
                report['layout'].append({'route':route,'width':width,'phase':phase,**geometry})
                if not args.no_captures and width in (1440,390) and (route=='/' or phase==5):
                    page.locator('.checkout-story').screenshot(path=str(out/f"{'home' if route=='/' else 'platform'}-{width}-step-{phase}.png"),animations='disabled',style='.site-header,.skip-link{visibility:hidden!important}')
    # Playback runs once, pauses on direct inspection, and stays stopped offscreen.
    page.emulate_media(reduced_motion='no-preference')
    page.set_viewport_size({'width':1440,'height':1100})
    page.goto(args.base+'/')
    scene=page.locator('[data-checkout-story]')
    scene.scroll_into_view_if_needed()
    page.wait_for_function("document.querySelector('[data-checkout-story]').classList.contains('is-playing')")
    page.wait_for_function("document.querySelector('[data-checkout-story]').dataset.step==='1'")
    scene.locator('[data-story-step="2"]').click()
    page.wait_for_timeout(3100)
    assert scene.get_attribute('data-step')=='2'
    assert 'is-playing' not in scene.get_attribute('class')
    scene.locator('[data-story-play]').click()
    page.evaluate("document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0)")
    page.wait_for_function("!document.querySelector('[data-checkout-story]').classList.contains('is-playing')")
    stopped=scene.get_attribute('data-step')
    scene.scroll_into_view_if_needed()
    page.wait_for_timeout(3100)
    assert scene.get_attribute('data-step')==stopped
    assert 'is-playing' not in scene.get_attribute('class')
    report['checks'].append('Autoplay on entry; manual selection pauses; offscreen stop persists on return')
    scene.locator('[data-story-step="0"]').click()
    assert scene.locator('.fs-field strong').first.evaluate('(e)=>getComputedStyle(e).clipPath') in ('none','inset(0px)')
    report['checks'].append('Paused form fields stay visible with normal motion preferences')
    browser.close()
(out/'checkout-story.json').write_text(json.dumps(report,indent=2))
failures=[item for item in report['layout'] if item['pageOverflow'] or item['content']>item['screen']+1 or item['small']]
assert not failures,json.dumps(failures,indent=2)
assert not report['contrast'],report['contrast']
assert not report['errors'],report['errors']
assert not report['requests'],report['requests']
print(json.dumps({'checks':report['checks'],'layouts':len(report['layout']),'errors':report['errors']},indent=2))
