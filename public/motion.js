/* Chaitanya Keralam — motion system (no dependencies).
   Reveals: elements get data-reveal / data-stagger from the MAP below, are hidden only once
   html.motion is set (so content stays visible if this file never runs), and get data-in when
   they approach the viewport. Each element animates once, then is marked data-done so its own
   hover transitions take over. Parallax: transform-free (CSS `translate` property) on a few
   large visuals, desktop/tablet only, one rAF-throttled passive scroll handler.
   Swap: [data-swap] regions replay a short fade when their text changes (tabs, toggles). */
(function () {
  if (window.__ckMotion) return; window.__ckMotion = true;
  var d = document, de = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window) || !('MutationObserver' in window)) return;

  // ---- what animates (containers first; descendants of an animated element are skipped) ----
  var SKIP = '.fc-stage,.fc-side,.r1,.r2,.r3,.r4,.hero-img,.t-hero>.ph,.navbar,.mnav,.subnav,.foot-bar';
  var MAP = [
    // staggered groups: children enter one after another
    ['.why-list,.bento,.g3,.g4,.tiles,.plist,.pledge,.sel-steps,.olist,.months,.plans,.progs,.vm,.types,.goal-list,.hub,.heritage,.hsteps,.hstep,.gal,.foot-grid,.a-mosaic,.t-film,.h-collage,.glance,.mlist,.chips,.ttabs,.strip,.flow', 'stagger'],
    // tracks: no fade, they only drive CSS (timeline rail, pilot dots)
    ['.tl,.dots-wrap', 'track'],
    // images and large visuals
    ['.panel-art,.ph,.cert,.map', 'image'],
    // panels and cards that arrive as one
    ['.fc,.detail,.form,.vtabs,.tpanel,.cta-band,.goal-hero,.founder,.summary,.acc,.quote,.note,.pager,.tl>li', 'up'],
    // text blocks
    ['.head,.ab-head,.ab-body,.g2>.stack,.split>.stack,.g2>.body,.g2>.small,.out,.statement,.dl', 'up']
  ];
  // parallax: [selector, speed, max px]
  var PARALLAX = [
    ['.hero-img', 0.07, 40], ['.t-hero>.ph', 0.22, 120],
    ['.panel-art svg', 0.06, 26], ['.gal .tile svg', 0.05, 18],
    ['.a-mosaic .m1', 0.05, 16], ['.a-mosaic .m2', -0.04, 16], ['.a-mosaic .m3', 0.06, 16],
    ['.h-collage .c1', 0.05, 18], ['.h-collage .c2', -0.04, 14], ['.h-collage .c5', 0.04, 14],
    ['#why-kerala .ph,#format .ph,.c-hero .ph,.tpanel .ph', 0.05, 22],
    ['#vision svg,.kn-story-art svg,.plan-top svg', -0.08, 22]
  ];

  de.classList.add('motion');

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; io.unobserve(el);
      el.setAttribute('data-in', '');
      var n = el.hasAttribute('data-stagger') ? Math.min(el.children.length, 8) : 0;
      setTimeout(function () { el.setAttribute('data-done', ''); }, 900 + n * 70);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function claim(el, kind) {
    if (el.hasAttribute('data-reveal') || el.hasAttribute('data-stagger')) return;
    if (el.closest(SKIP)) return;
    var p = el.parentElement && el.parentElement.closest('[data-reveal],[data-stagger]');
    if (p && p.getAttribute('data-reveal') !== 'track') return;
    if (kind === 'stagger') {
      el.setAttribute('data-stagger', '');
      for (var i = 0; i < el.children.length; i++) el.children[i].style.setProperty('--i', Math.min(i, 8));
    } else el.setAttribute('data-reveal', kind);
    io.observe(el);
  }
  function scan() {
    MAP.forEach(function (m) { d.querySelectorAll(m[0]).forEach(function (el) { claim(el, m[1]); }); });
    collectParallax();
  }

  // ---- parallax ----
  var px = [], visible = new Set(), ticking = false, enabled = false;
  var pio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    request();
  }, { rootMargin: '20% 0px 20% 0px' });
  function collectParallax() {
    PARALLAX.forEach(function (p) {
      d.querySelectorAll(p[0]).forEach(function (el) {
        if (el.__px) return; el.__px = { s: p[1], m: p[2] }; px.push(el); pio.observe(el);
      });
    });
  }
  function mode() {
    var w = innerWidth, h = innerHeight;
    // off on phones, and when the "viewport" is a whole canvas artboard (nothing scrolls)
    if (w < 700 || h > 1600 || de.scrollHeight - h < 200) return 0;
    return (w >= 1024 && matchMedia('(pointer:fine)').matches) ? 1 : 0.5;
  }
  function update() {
    ticking = false;
    var k = mode();
    if (!k) { if (enabled) { px.forEach(function (el) { el.style.translate = ''; }); enabled = false; } return; }
    enabled = true;
    var vc = innerHeight / 2, reads = [];
    visible.forEach(function (el) { var r = el.getBoundingClientRect(); reads.push([el, r.top + r.height / 2 - vc]); });
    reads.forEach(function (x) {
      var o = x[0].__px, y = -x[1] * o.s * k;
      y = Math.max(-o.m, Math.min(o.m, y));
      x[0].style.translate = '0 ' + y.toFixed(1) + 'px';
    });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });

  // ---- swap: replay a short fade when tab/toggle content changes ----
  function swap(el) {
    if (!el || el.__sw) return; el.__sw = true;
    requestAnimationFrame(function () {
      el.removeAttribute('data-swapping'); void el.offsetWidth; el.setAttribute('data-swapping', '');
      el.__sw = false;
    });
  }

  // ---- watch for content the page renders after load ----
  var pending = false;
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var t = ms[i].target.nodeType === 1 ? ms[i].target : ms[i].target.parentElement;
      var s = t && t.closest && t.closest('[data-swap]');
      if (s && t.closest('[data-done],[data-swapping],[data-in]') !== null) swap(s);
    }
    if (!pending) { pending = true; requestAnimationFrame(function () { pending = false; scan(); }); }
  }).observe(d.documentElement, { childList: true, subtree: true, characterData: true });

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', scan); else scan();
})();
