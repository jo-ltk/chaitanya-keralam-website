/* Chaitanya Keralam — interactions & scroll animations (GSAP + ScrollTrigger + Lenis)
 *
 * Plain HTML: this file starts itself on DOMContentLoaded.
 * React / Next.js / Vue: add data-ck-manual to <body> (or set window.CK_MANUAL = true before loading),
 * then call  const stop = window.CKLanding.init();  after the markup is mounted,
 * and  stop()  (or window.CKLanding.destroy()) on unmount. init() is safe to call more than once.
 */
(function () {
  var state = null;

  function init() {
    if (state) return destroy;
    state = { listeners: [], split: [], ctx: null, lenis: null, tick: null };
    function on(el, type, fn, opts) { if (!el) return; el.addEventListener(type, fn, opts); state.listeners.push([el, type, fn, opts]); }
    if (!document.getElementById('nav')) { console.warn('[CKLanding] markup not found — call init() after the page HTML is in the DOM.'); state = null; return function () {}; }

    var nav = document.getElementById('nav');
    var menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
    on(menuBtn, 'click', function () {
      var open = menu.hidden; menu.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    on(menu, 'click', function (e) { if (e.target.closest('a')) { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); } });

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = window.gsap && window.ScrollTrigger;

    function onScrollNav() { nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.6); }
    on(window, 'scroll', onScrollNav, { passive: true }); onScrollNav();

    var playBtn = document.getElementById('playBtn'), playIcon = document.getElementById('playIcon');
    var heroTween = null, playing = !reduce;
    function setPlay(p) {
      playing = p;
      playIcon.setAttribute('d', p ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z');
      playBtn.setAttribute('aria-label', p ? 'Pause background motion' : 'Play background motion');
      var v = document.querySelector('#heroMedia video'); if (v) { p ? v.play().catch(function(){}) : v.pause(); }
      if (heroTween) p ? heroTween.play() : heroTween.pause();
    }
    on(playBtn, 'click', function () { setPlay(!playing); });
    setPlay(playing);

    if (reduce || !hasGsap) return;

    state.ctx = gsap.context(function () {

    document.documentElement.classList.add('motion');
    gsap.registerPlugin(ScrollTrigger);

    /* smooth scroll */
    var lenis = null;
    if (window.Lenis) {
      lenis = state.lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      state.tick = function (t) { lenis.raf(t * 1000); };
      gsap.ticker.add(state.tick);
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        on(a, 'click', function (e) { var id = a.getAttribute('href'); var el = id.length > 1 && document.querySelector(id); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0 }); } });
      });
    }

    /* split helpers */
    /* Idempotent: the original markup is kept in data-ck-orig, so running init twice
       (React StrictMode, hot reload, script included twice) never splits already-split HTML. */
    function original(el) {
      if (el.hasAttribute('data-ck-orig')) el.innerHTML = el.getAttribute('data-ck-orig');
      else el.setAttribute('data-ck-orig', el.innerHTML);
      state.split.push(el);
    }
    function splitWords(el) {
      original(el);
      var html = el.innerHTML.split(/(<br\s*\/?>)/i).map(function (part) {
        if (/^<br/i.test(part)) return part;
        return part.trim().split(/\s+/).filter(Boolean).map(function (w) { return '<span class="w"><span class="wi">' + w + '</span></span>'; }).join(' ');
      }).join('');
      el.innerHTML = html; return el.querySelectorAll('.wi');
    }
    function splitChars(el) {
      original(el);
      var text = el.textContent; el.setAttribute('aria-label', text);
      el.innerHTML = text.split('').map(function (ch) { return ch === ' ' ? ' ' : '<span class="c" aria-hidden="true"><span class="ci">' + ch + '</span></span>'; }).join('');
      return el.querySelectorAll('.ci');
    }

    /* progress bar */
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    /* 1 · hero intro */
    var lines = document.querySelectorAll('#heroTitle .line');
    var chars = []; lines.forEach(function (l) { chars = chars.concat(Array.prototype.slice.call(splitChars(l))); });
    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro.from('#heroMedia .bg', { scale: 1.25, duration: 2.6, ease: 'power3.out' }, 0)
         .from('.nav-in > *', { y: -24, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.3)
         .from(chars, { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.045 }, 0.45)
         .from('.hero [data-fade]', { y: 30, opacity: 0, duration: 1.2, stagger: 0.12 }, 1.0)
         .from('.cue', { opacity: 0, duration: 1 }, 1.6);
    heroTween = gsap.to('#heroMedia .bg', { scale: 1.08, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
    if (!playing) heroTween.pause();
    gsap.to('#heroMedia', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-body', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

    /* 2 · manifesto: words light up as you scroll */
    var mWords = splitWords(document.getElementById('manifestoText'));
    gsap.fromTo(mWords, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 55%', scrub: true } });

    /* generic line/word reveals */
    document.querySelectorAll('.split-lines').forEach(function (el) {
      var w = splitWords(el);
      gsap.from(w, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    gsap.utils.toArray('.eyebrow').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.pl')) return;
      gsap.from(el, { y: 16, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    /* 3 · panorama clip reveal */
    gsap.timeline({ scrollTrigger: { trigger: '.pano', start: 'top top', end: '+=120%', scrub: true, pin: true } })
      .fromTo('#panoMedia', { clipPath: 'inset(22% 26% 22% 26%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      .fromTo('#panoMedia .bg', { scale: 1.45 }, { scale: 1, ease: 'none' }, 0)
      .from('.pano-cap', { opacity: 0, y: 40, ease: 'none', duration: 0.3 }, 0.7);

    /* 4 · pillars: pinned stage, layers swap */
    var pls = gsap.utils.toArray('.pl'), hudBtns = gsap.utils.toArray('.pl-hud button');
    var plChars = pls.map(function (p) { return splitChars(p.querySelector('.pl-word')); });
    gsap.set(pls.slice(1), { autoAlpha: 0 });
    pls.forEach(function (p) { p.classList.remove('is-active'); });
    if (pls[0]) pls[0].classList.add('is-active');
    pls.forEach(function (p, i) { if (i) { gsap.set(plChars[i], { yPercent: 140, opacity: 0 }); gsap.set(p.querySelectorAll('.pl-line, .pl-index'), { opacity: 0, y: 20 }); } });
    var plTl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, scrollTrigger: {
      trigger: '.pillars', start: 'top top', end: '+=' + (pls.length * 100) + '%', scrub: 0.8, pin: '.pillars-stage',
      onUpdate: function (st) { var idx = Math.min(pls.length - 1, Math.floor(st.progress * pls.length * 0.999 + 0.12)); hudBtns.forEach(function (b, j) { b.classList.toggle('on', j === idx); }); pls.forEach(function (p, j) { p.classList.toggle('is-active', j === idx); }); }
    } });
    pls.forEach(function (p, i) {
      plTl.fromTo(p.querySelector('.bg'), { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1, ease: 'none', duration: 1 }, i);
      if (i === 0) return;
      var prev = pls[i - 1], at = i - 0.25;
      plTl.to(plChars[i - 1], { yPercent: -140, opacity: 0, stagger: 0.015, duration: 0.3 }, at)
          .to(prev.querySelectorAll('.pl-line, .pl-index'), { opacity: 0, y: -20, duration: 0.2 }, at)
          .fromTo(p, { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45 }, at)
          .fromTo(plChars[i], { yPercent: 140, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.02, duration: 0.35 }, at + 0.2)
          .to(p.querySelectorAll('.pl-line, .pl-index'), { opacity: 1, y: 0, duration: 0.25 }, at + 0.3);
      plTl.set(prev, { autoAlpha: 0 }, at + 0.45);
    });
    plTl.to({}, { duration: 0.25 });
    hudBtns.forEach(function (b) {
      on(b, 'click', function () {
        var st = plTl.scrollTrigger, i = +b.dataset.go, y = st.start + (st.end - st.start) * ((i + 0.05) / pls.length);
        if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    /* 5 · giant words slide opposite ways, images float */
    gsap.fromTo('#word1', { xPercent: 10 }, { xPercent: -40, ease: 'none', scrollTrigger: { trigger: '.wordsec', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('#word2', { xPercent: -30 }, { xPercent: 12, ease: 'none', scrollTrigger: { trigger: '.wordsec', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* parallax helpers */
    gsap.utils.toArray('[data-speed]').forEach(function (el) {
      var s = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.utils.toArray('[data-inner]').forEach(function (el) {
      var s = parseFloat(el.dataset.inner);
      gsap.fromTo(el.querySelector('.bg'), { yPercent: -s }, { yPercent: s, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* 6 · horizontal gallery */
    var track = document.getElementById('track');
    function dist() { return Math.max(0, track.scrollWidth - track.parentElement.clientWidth); }
    var hTween = gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.6, pin: true, invalidateOnRefresh: true } });
    gsap.utils.toArray('.card').forEach(function (c) {
      gsap.fromTo(c.querySelector('.bg'), { xPercent: -8, scale: 1.18 }, { xPercent: 8, scale: 1.18, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: hTween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(c.querySelector('p'), { opacity: 0, y: 16, duration: 0.8, scrollTrigger: { trigger: c, containerAnimation: hTween, start: 'left 85%' } });
    });

    /* image reveals (clip from bottom) */
    gsap.utils.toArray('.split > .ph, .collage .ph, .tile .ph, .wordsec .ph').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.from('.tile b, .tile i', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.places ul', start: 'top 75%' } });

    /* 10 · final */
    var fChars = splitChars(document.getElementById('finalTitle'));
    gsap.fromTo('#finalMedia .bg', { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from(fChars, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: '.final', start: 'top 45%' } });
    gsap.from('.final .btn', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.final', start: 'top 35%' } });

    /* footer watermark */
    gsap.fromTo('#water', { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    }); /* end gsap.context */

    on(window, 'load', function () { ScrollTrigger.refresh(); });
    requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    return destroy;
  }

  function destroy() {
    if (!state) return;
    state.listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
    if (state.ctx) state.ctx.revert();
    if (state.tick && window.gsap) window.gsap.ticker.remove(state.tick);
    if (state.lenis) state.lenis.destroy();
    state.split.forEach(function (el) { if (el.hasAttribute('data-ck-orig')) el.innerHTML = el.getAttribute('data-ck-orig'); el.removeAttribute('aria-label'); });
    document.documentElement.classList.remove('motion');
    document.querySelectorAll('.pl').forEach(function (p) { p.classList.remove('is-active'); });
    state = null;
  }

  window.CKLanding = { init: init, destroy: destroy };

  var manual = window.CK_MANUAL || (document.body && document.body.hasAttribute('data-ck-manual'));
  if (!manual) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})();
