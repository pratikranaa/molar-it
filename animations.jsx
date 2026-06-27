// Framer-motion-style entrance animations — soft blur dissolve, spring easing, scroll reveal

function usePrefersReducedMotion() {
  var state = React.useState(function () {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  var reduced = state[0];
  var setReduced = state[1];
  React.useEffect(function () {
    if (!window.matchMedia) return;
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var onChange = function () { setReduced(mq.matches); };
    mq.addEventListener('change', onChange);
    return function () { mq.removeEventListener('change', onChange); };
  }, []);
  return reduced;
}

function scheduleReveal(setInView, reduced) {
  if (reduced) {
    setInView(true);
    return;
  }
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      setInView(true);
    });
  });
}

function useInView(threshold, triggerOnce) {
  if (threshold === undefined) threshold = 0.08;
  if (triggerOnce === undefined) triggerOnce = true;
  var reduced = usePrefersReducedMotion();
  var ref = React.useRef(null);
  var state = React.useState(reduced);
  var inView = state[0];
  var setInView = state[1];
  React.useEffect(function () {
    if (reduced) {
      setInView(true);
      return;
    }
    var el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 1.08) {
      scheduleReveal(setInView, reduced);
      if (triggerOnce) return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          scheduleReveal(setInView, reduced);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold: threshold, rootMargin: '0px 0px -4% 0px' }
    );
    observer.observe(el);
    return function () { observer.disconnect(); };
  }, [threshold, triggerOnce, reduced]);
  return [ref, inView];
}

var EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
var EASE_SMOOTH = 'cubic-bezier(0.22, 1, 0.36, 1)';

function buildMotionStyle(inView, opts) {
  var duration = opts.duration || 950;
  var delay = opts.delay || 0;
  var y = opts.y !== undefined ? opts.y : 16;
  var blur = opts.blur === false ? 0 : (opts.blur !== undefined ? opts.blur : 8);
  var scale = opts.scale;
  var ease = opts.ease || EASE_OUT;
  var parts = [
    'opacity ' + duration + 'ms ' + ease,
    'transform ' + duration + 'ms ' + ease,
  ];
  if (blur) parts.push('filter ' + duration + 'ms ' + ease);
  var transition = parts.join(', ');

  if (inView) {
    var transform = 'translate3d(0, 0, 0)';
    if (scale) transform += ' scale(1)';
    return {
      opacity: 1,
      transform: transform,
      filter: blur ? 'blur(0px)' : undefined,
      transition: transition,
      transitionDelay: delay + 'ms',
      willChange: 'auto',
    };
  }

  var hiddenTransform = 'translate3d(0, ' + y + 'px, 0)';
  if (scale) hiddenTransform += ' scale(' + (typeof scale === 'number' ? scale : 0.985) + ')';
  return {
    opacity: 0,
    transform: hiddenTransform,
    filter: blur ? 'blur(' + blur + 'px)' : undefined,
    transition: transition,
    transitionDelay: delay + 'ms',
    willChange: 'opacity, transform, filter',
  };
}

function MotionDiv(props) {
  var refInView = useInView(props.threshold, props.triggerOnce);
  var ref = refInView[0];
  var inView = refInView[1];
  var className = props.className || '';
  var style = props.style || {};
  var motionStyle = buildMotionStyle(inView, props);
  var merged = Object.assign({}, motionStyle, style);
  if (merged.filter === undefined) delete merged.filter;
  return React.createElement('div', {
    ref: ref,
    className: className,
    style: merged,
  }, props.children);
}

function FadeUp(props) {
  return React.createElement(MotionDiv, {
    className: props.className,
    style: props.style,
    delay: props.delay,
    duration: props.duration || 950,
    y: props.y !== undefined ? props.y : 16,
    blur: props.blur !== undefined ? props.blur : 8,
    scale: props.scale,
    ease: props.ease,
    threshold: props.threshold,
    triggerOnce: props.triggerOnce,
    children: props.children,
  });
}

function FadeIn(props) {
  return React.createElement(MotionDiv, {
    className: props.className,
    style: props.style,
    delay: props.delay,
    duration: props.duration || 800,
    y: props.y !== undefined ? props.y : 0,
    blur: props.blur !== undefined ? props.blur : 6,
    ease: props.ease || EASE_SMOOTH,
    threshold: props.threshold,
    triggerOnce: props.triggerOnce,
    children: props.children,
  });
}

function ScaleIn(props) {
  return React.createElement(MotionDiv, {
    className: props.className,
    style: props.style,
    delay: props.delay,
    duration: props.duration || 900,
    y: props.y !== undefined ? props.y : 10,
    blur: props.blur !== undefined ? props.blur : 6,
    scale: props.scale !== undefined ? props.scale : 0.97,
    ease: props.ease,
    threshold: props.threshold,
    triggerOnce: props.triggerOnce,
    children: props.children,
  });
}

function StaggerContainer(props) {
  var children = props.children;
  var staggerDelay = props.staggerDelay !== undefined ? props.staggerDelay : 110;
  var baseDelay = props.baseDelay || 0;
  var className = props.className || '';
  var style = props.style || {};
  var mapped = React.Children.map(children, function (child, i) {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        delay: (child.props.delay || 0) + baseDelay + i * staggerDelay,
      });
    }
    return child;
  });
  return React.createElement('div', { className: className, style: style }, mapped);
}

window.Animations = {
  FadeUp: FadeUp,
  FadeIn: FadeIn,
  ScaleIn: ScaleIn,
  StaggerContainer: StaggerContainer,
  Motion: MotionDiv,
};
window.FadeUp = FadeUp;
window.FadeIn = FadeIn;
window.ScaleIn = ScaleIn;
window.StaggerContainer = StaggerContainer;
window.Motion = MotionDiv;
