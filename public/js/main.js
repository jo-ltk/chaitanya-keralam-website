/* Chaitanya Keralam — landing page v2 (hero carousel, reveals, enquiry form)
 *
 * Plain HTML: starts itself on DOMContentLoaded.
 * React / Next.js: set window.CK_MANUAL = true before this file loads, then
 *   useEffect(() => { const stop = window.CKLanding.init(); return () => stop(); }, []);
 * init() is idempotent (safe under StrictMode / hot reload); destroy() removes everything it added.
 *
 * Form: set window.CK_FORM_ENDPOINT = "https://…" (a URL that accepts a JSON POST) to send enquiries.
 *
 * Motion policy: desktop (≥ 900px, fine pointer) gets smooth scroll, parallax and text reveals.
 * Phones/tablets get calm fade-ups only: no pinning, no parallax, no smooth-scroll hijack.
 */
(function () {
  var S = null;

  function init() {
    if (S) return destroy;
    if (!document.getElementById('nav')) { console.warn('[CKLanding] call init() after the page markup is in the DOM.'); return function () {}; }
    S = { off: [], split: [], timers: [], ctx: null, mm: null, lenis: null, tick: null };
    function on(el, type, fn, opts) { if (!el) return; el.addEventListener(type, fn, opts); S.off.push([el, type, fn, opts]); }
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var G = window.gsap, ST = window.ScrollTrigger;

    /* ---------- nav: solid after the hero, mobile menu ---------- */
    var nav = $('#nav'), menu = $('#menu'), menuBtn = $('#menuBtn'), hero = $('.hero');
    function navState() { nav.classList.toggle('solid', window.scrollY > (hero ? hero.offsetHeight - 80 : 40)); }
    on(window, 'scroll', navState, { passive: true }); navState();
    function setMenu(open) {
      menu.hidden = !open; document.documentElement.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    on(menuBtn, 'click', function () { setMenu(menu.hidden); });
    on(menu, 'click', function (e) { if (e.target.closest('a')) setMenu(false); });
    on(document, 'keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

    /* ---------- split helpers (idempotent) ---------- */
    function keep(el) {
      if (el.hasAttribute('data-ck-orig')) el.innerHTML = el.getAttribute('data-ck-orig'); else el.setAttribute('data-ck-orig', el.innerHTML);
      S.split.push(el);
    }
    function words(el) {
      keep(el);
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w"><span class="wi">' + w + '</span></span>'; }).join(' ');
      return $$('.wi', el);
    }
    function chars(el) {
      keep(el);
      var t = el.textContent; el.setAttribute('aria-label', t);
      el.innerHTML = t.split(' ').map(function (w) {
        return '<span style="display:inline-block;white-space:nowrap" aria-hidden="true">' + w.split('').map(function (c) { return '<span class="c"><span class="ci">' + c + '</span></span>'; }).join('') + '</span>';
      }).join(' ');
      return $$('.ci', el);
    }

    /* ---------- hero carousel ---------- */
    var slides = $$('.slide'), titles = $$('.hero-title'), segBars = $$('.hero-side .seg'), mSegs = $$('.mobile-segs .seg'), segHits = $$('.seg-hit');
    var names = titles.map(function (t) { return t.getAttribute('data-ck-orig') ? t.textContent : t.textContent; });
    var thumbs = ['s-backwater', 's-ghats', 's-culture'];
    var cur = 0, playing = !reduce, DURATION = 7000, startT = 0, elapsed = 0, raf = 0;
    var titleChars = titles.map(function (t) { return G && !reduce ? chars(t) : []; });
    function paintSegs(p) {
      [segBars, mSegs].forEach(function (set) { set.forEach(function (s, i) { s.style.setProperty('--p', i < cur ? 1 : i === cur ? p : 0); }); });
    }
    function show(i, instant) {
      var n = slides.length; i = (i + n) % n; var prev = cur; cur = i;
      slides.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      titles.forEach(function (t, j) {
        t.classList.toggle('is-active', j === i); t.setAttribute('aria-hidden', j === i ? 'false' : 'true');
      });
      if (G && !reduce && titleChars[i].length) {
        G.killTweensOf(titleChars[prev]); G.killTweensOf(titleChars[i]);
        if (!instant) G.fromTo(titleChars[i], { yPercent: 120 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.022, delay: 0.15 });
      }
      var nx = (i + 1) % n, th = $('#nextThumb'), nt = $('#nextTitle');
      if (th) th.className = 'bg ' + thumbs[nx]; if (nt) nt.textContent = names[nx].replace(/\.$/, '');
      $$('video', slides[prev]).forEach(function (v) { if (prev !== i) v.pause(); });
      $$('video', slides[i]).forEach(function (v) { if (playing) v.play().catch(function () {}); });
      elapsed = 0; startT = performance.now(); paintSegs(0);
    }
    function loop(now) {
      if (playing) { elapsed = now - startT; var p = Math.min(1, elapsed / DURATION); paintSegs(p); if (p >= 1) show(cur + 1); }
      raf = requestAnimationFrame(loop);
    }
    function setPlaying(p) {
      playing = p; if (p) startT = performance.now() - elapsed;
      $$('.js-play').forEach(function (b) { b.setAttribute('aria-label', p ? 'Pause slideshow' : 'Play slideshow'); });
      $$('.js-play-icon').forEach(function (ic) { ic.setAttribute('d', p ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z'); });
      $$('video', slides[cur]).forEach(function (v) { p ? v.play().catch(function () {}) : v.pause(); });
    }
    $$('.js-play').forEach(function (b) { on(b, 'click', function () { setPlaying(!playing); }); });
    on($('#nextCard'), 'click', function () { show(cur + 1); });
    segHits.forEach(function (b) { on(b, 'click', function () { show(+b.getAttribute('data-go')); }); });
    on(document, 'visibilitychange', function () { if (document.hidden) { S.wasPlaying = playing; setPlaying(false); } else if (S.wasPlaying) setPlaying(true); });
    /* hero title: one line — size the type so the longest of the three lines fits the width */
    var titleHost = $('.hero-titles');
    function fitHero() {
      if (!titleHost) return;
      titleHost.style.setProperty('--hero-fs', '100px');
      var widest = Math.max.apply(null, titles.map(function (t) { return t.getBoundingClientRect().width; }));
      var avail = titleHost.clientWidth, max = window.innerWidth >= 1025 ? 132 : 88;
      if (widest > 0) titleHost.style.setProperty('--hero-fs', Math.max(18, Math.min(max, Math.floor(100 * avail / widest * 0.985))) + 'px');
    }
    var fitT = 0;
    on(window, 'resize', function () { clearTimeout(fitT); fitT = setTimeout(fitHero, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (S) fitHero(); });
    fitHero();
    S.unfit = function () { if (titleHost) titleHost.style.removeProperty('--hero-fs'); };
    show(0, true); setPlaying(playing); raf = requestAnimationFrame(loop);
    S.stopRaf = function () { cancelAnimationFrame(raf); };
    // pause the carousel & video when the hero is off-screen (keeps scrolling smooth)
    if ('IntersectionObserver' in window && hero) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting && playing) { S.heroPaused = true; setPlaying(false); } else if (e.isIntersecting && S.heroPaused) { S.heroPaused = false; setPlaying(true); } }); }, { threshold: 0.05 });
      io.observe(hero); S.io = io;
    }

    /* ---------- experiences: hover image follows the cursor (desktop) ---------- */
    var hv = $('#hoverImg'), hvPh = hv ? $$('.ph', hv) : [];
    if (hv && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
      var hx = 0, hy = 0;
      $$('.row').forEach(function (r) {
        on(r, 'mouseenter', function () { var k = +r.getAttribute('data-img'); hvPh.forEach(function (p, j) { p.classList.toggle('on', j === k); }); hv.style.opacity = 1; });
        on(r, 'mouseleave', function () { hv.style.opacity = 0; });
      });
      on(window, 'mousemove', function (e) { hx = e.clientX; hy = e.clientY; if (G) G.to(hv, { x: hx + 40, y: hy, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }); else hv.style.transform = 'translate(' + (hx + 40) + 'px,' + hy + 'px)'; }, { passive: true });
    }

    /* ---------- form ---------- */
    initForm(on, $, $$);

    if (reduce || !G || !ST) return destroy;

    /* ---------- motion ---------- */
    G.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    document.documentElement.classList.add('motion');

    S.ctx = G.context(function () {
      // hero intro
      G.from('.nav-in > *', { y: -16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.2 });
      G.from(titleChars[0], { yPercent: 120, duration: 1.4, ease: 'expo.out', stagger: 0.025, delay: 0.35 });
      G.from('.hero-sub, .mobile-segs, .hero-side', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 1 });

      // statement: words light up while scrolling (no pin)
      var sw = words($('#statement'));
      G.fromTo(sw, { opacity: 0.18 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 75%', end: 'bottom 70%', scrub: true } });

      // section titles: words rise once
      $$('[data-split]').forEach(function (el) {
        G.from(words(el), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      // banner title: characters rise once
      $$('[data-chars]').forEach(function (el) {
        G.from(chars(el), { yPercent: 120, duration: 1.2, ease: 'expo.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
      });
      // calm fade-ups (all sizes)
      $$('[data-reveal]').forEach(function (el) {
        G.from(el, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });

      S.mm = G.matchMedia();
      // desktop only: parallax, drifting chapter words, image reveals, smooth scroll
      S.mm.add('(min-width: 900px) and (pointer: fine)', function () {
        $$('.chapter-word').forEach(function (el) {
          var d = parseFloat(el.getAttribute('data-drift')) || 6;
          G.fromTo(el, { xPercent: -d }, { xPercent: d, ease: 'none', scrollTrigger: { trigger: el.closest('.chapter'), start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        $$('[data-parallax]').forEach(function (el) {
          var s = parseFloat(el.getAttribute('data-parallax'));
          G.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', force3D: true, scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        $$('[data-inner]').forEach(function (el) {
          var s = parseFloat(el.getAttribute('data-inner'));
          G.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', force3D: true, scrollTrigger: { trigger: el.closest('.ph') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        $$('[data-reveal-img], .chapter-media').forEach(function (el) {
          G.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
        G.fromTo('#water', { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

        if (window.Lenis) {
          var lenis = S.lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
          lenis.on('scroll', ST.update);
          S.tick = function (t) { lenis.raf(t * 1000); };
          G.ticker.add(S.tick); G.ticker.lagSmoothing(0);
          $$('a[href^="#"]').forEach(function (a) {
            on(a, 'click', function (e) { var id = a.getAttribute('href'); var el = id.length > 1 && document.querySelector(id); if (el && S.lenis) { e.preventDefault(); S.lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70 }); } });
          });
        }
        return function () { if (S && S.lenis) { G.ticker.remove(S.tick); S.lenis.destroy(); S.lenis = null; } };
      });
    });

    // measure once fonts and above-the-fold media are ready (prevents a hitch on the first scroll)
    var refresh = function () { ST.refresh(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    on(window, 'load', refresh);
    return destroy;
  }

  function initForm(on, $, $$) {
    var form = $('#enquiry'); if (!form) return;
    var tabs = $$('.tab'), type = 'trip', msg = $('#f-msg'), count = $('#count'), note = $('#formNote');
    tabs.forEach(function (t) {
      on(t, 'click', function () {
        type = t.getAttribute('data-type');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); x.tabIndex = x === t ? 0 : -1; });
        form.setAttribute('aria-labelledby', t.id);
        $$('[data-for]', form).forEach(function (f) { f.hidden = f.getAttribute('data-for') !== type; });
        note.hidden = true;
      });
      on(t, 'keydown', function (e) {
        var i = tabs.indexOf(t), n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
        if (n >= 0 || e.key === 'ArrowLeft') { n = (n + tabs.length) % tabs.length; tabs[n].focus(); tabs[n].click(); e.preventDefault(); }
      });
    });
    on(msg, 'input', function () { count.textContent = msg.value.length + ' / 1000'; });
    function check(input, test, text) {
      var f = input.closest('.field'), e = $('.err', f), ok = test(input.value.trim());
      f.classList.toggle('bad', !ok); input.setAttribute('aria-invalid', ok ? 'false' : 'true'); if (e) e.textContent = ok ? '' : text;
      return ok;
    }
    on(form, 'submit', function (ev) {
      ev.preventDefault();
      var ok = [
        check($('#f-first'), function (v) { return v.length > 0; }, 'Enter your first name.'),
        check($('#f-email'), function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Enter a valid email, like name@example.com.'),
        check($('#f-phone'), function (v) { return /^[0-9\s-]{6,15}$/.test(v); }, 'Enter a phone number using digits only.')
      ].every(Boolean);
      if (!ok) { var bad = $('.field.bad input', form); if (bad) bad.focus(); return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; }); data.enquiryType = type;
      var endpoint = window.CK_FORM_ENDPOINT, name = data.firstName;
      if (!endpoint) { note.hidden = false; note.textContent = 'Thanks, ' + name + '. This form is not connected yet: set CK_FORM_ENDPOINT to start receiving enquiries.'; return; }
      var btn = $('button[type="submit"]', form); btn.disabled = true;
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); note.hidden = false; note.textContent = 'Thank you, ' + name + '. We have your enquiry and will reply by email.'; form.reset(); count.textContent = '0 / 1000'; })
        .catch(function () { note.hidden = false; note.textContent = 'Your enquiry could not be sent. Check your connection and try again.'; })
        .then(function () { btn.disabled = false; });
    });
  }

  function destroy() {
    if (!S) return;
    S.off.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
    if (S.stopRaf) S.stopRaf();
    if (S.unfit) S.unfit();
    if (S.io) S.io.disconnect();
    if (S.mm) S.mm.revert();
    if (S.ctx) S.ctx.revert();
    if (S.lenis) { window.gsap.ticker.remove(S.tick); S.lenis.destroy(); }
    S.split.forEach(function (el) { if (el.hasAttribute('data-ck-orig')) { el.innerHTML = el.getAttribute('data-ck-orig'); el.removeAttribute('data-ck-orig'); } el.removeAttribute('aria-label'); });
    document.documentElement.classList.remove('motion', 'menu-open');
    document.body.style.overflow = '';
    S = null;
  }

  window.CKLanding = { init: init, destroy: destroy };
  var manual = window.CK_MANUAL || (document.body && document.body.hasAttribute('data-ck-manual'));
  if (!manual) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init(); }
})();
