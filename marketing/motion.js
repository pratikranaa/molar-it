// Native WAAPI + IntersectionObserver: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
// Already-visible defaults and finite animations keep late JS and interrupted visits readable.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const wide = matchMedia('(min-width: 1050px) and (min-height: 720px)');
const active = new Set();
const ease = 'cubic-bezier(.16,1,.3,1)';
const animate = (element, frames, options = {}) => {
  if (!element || reduced.matches || document.hidden) return;
  const animation = element.animate(frames, {duration: 600, easing: ease, fill: 'backwards', ...options});
  active.add(animation);
  const remove = () => active.delete(animation);
  animation.onfinish = remove;
  animation.oncancel = remove;
};
const arrive = (element, distance = 20, delay = 0) => animate(element,
  [{opacity: .55, transform: `translateY(${distance}px)`}, {opacity: 1, transform: 'none'}], {delay});
const visible = element => { const rect = element.getBoundingClientRect(); return rect.bottom > 0 && rect.top < innerHeight; };

// One assembly: the promise stays readable, then browser → services → result settle into place.
const hero = document.querySelector('.identity-hero');
if (hero && scrollY < 80 && !location.hash) {
  arrive(hero.querySelector('h1'), 12);
  arrive(hero.querySelector('.identity-hero-copy'), 10, 45);
  const scene = hero.querySelector('.app-scene');
  if (scene && visible(scene)) {
    arrive(scene.querySelector('.scene-browser'), 26, 70);
    arrive(scene.querySelector('.scene-service-first'), 16, 130);
    arrive(scene.querySelector('.scene-service-second'), 16, 190);
    arrive(scene.querySelector('.scene-result'), 12, 240);
  }
}

// Reveal only explanatory media, with siblings sharing a short stagger. Never hide article copy.
const reveal = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    reveal.unobserve(entry.target);
    if (reduced.matches) continue;
    const children = entry.target.matches('.foundation-output')
      ? entry.target.querySelectorAll('.foundation-browser, dl>div') : [entry.target];
    children.forEach((element, i) => arrive(element, 22, i * 55));
  }
}, {threshold: .12});
document.querySelectorAll('.detail-visual-story>.scenario-detail, .platform-scene-pair .scenario-detail, .foundation-output, .solution-library-visual, .cg-map-shell, .pc-workbench, .pt-debugger, .pgd-workbench').forEach(element => reveal.observe(element));

const process = document.querySelector('[data-product-process]');
let scheduleProcess = () => {};
if (process) {
  const chapters = [...process.querySelectorAll('.process-chapter')];
  const copies = chapters.map(chapter => chapter.querySelector('.process-copy'));
  const figures = chapters.map(chapter => chapter.querySelector('.process-visual'));
  const links = [...process.querySelectorAll('.process-nav a')];
  let enabled = false, inView = false, frame = 0, selected = -1;
  const update = () => {
    frame = 0;
    if (!enabled || document.hidden || !inView) return;
    const positions = copies.map(copy => copy.getBoundingClientRect());
    const aim = Math.max(230, innerHeight * .43);
    const index = positions.reduce((best, rect, i) => Math.abs(rect.top + 100 - aim) < Math.abs(positions[best].top + 100 - aim) ? i : best, 0);
    const progress = Math.max(0, Math.min(1, (aim - positions[index].top + 90) / positions[index].height));
    figures[index].style.setProperty('--process-progress', progress.toFixed(3));
    if (selected === index) return;
    selected = index;
    chapters.forEach((chapter, i) => {
      chapter.classList.toggle('is-active', i === index);
      figures[i].setAttribute('aria-hidden', String(i !== index));
      if (i === index) links[i].setAttribute('aria-current', 'step');
      else links[i].removeAttribute('aria-current');
    });
  };
  scheduleProcess = () => {
    if (enabled && inView && !document.hidden && !frame) frame = requestAnimationFrame(update);
  };
  const configure = () => {
    enabled = wide.matches && !reduced.matches;
    process.classList.toggle('has-process-motion', enabled);
    if (!enabled) {
      cancelAnimationFrame(frame); frame = 0; selected = -1;
      chapters.forEach(chapter => chapter.classList.remove('is-active'));
      figures.forEach(figure => { figure.removeAttribute('aria-hidden'); figure.style.removeProperty('--process-progress'); });
      links.forEach(link => link.removeAttribute('aria-current'));
    } else scheduleProcess();
  };
  const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; scheduleProcess(); }, {rootMargin: '100px'});
  observer.observe(process);
  addEventListener('scroll', scheduleProcess, {passive: true});
  addEventListener('resize', scheduleProcess, {passive: true});
  wide.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  // display:contents has no anchor box in some engines. Scroll to the actual chapter copy.
  links.forEach((link, i) => link.addEventListener('click', event => {
    if (!enabled || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    copies[i].scrollIntoView({block: 'start', behavior: 'smooth'});
  }));
  const followHash = () => {
    const i = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
    if (enabled && i >= 0) copies[i].scrollIntoView({block: 'start', behavior: 'instant'});
  };
  addEventListener('hashchange', followHash);
  configure();
  if (location.hash) requestAnimationFrame(followHash);
}

const stop = () => { active.forEach(animation => animation.cancel()); active.clear(); };
reduced.addEventListener('change', () => { if (reduced.matches) stop(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else scheduleProcess(); });
addEventListener('pagehide', stop);
