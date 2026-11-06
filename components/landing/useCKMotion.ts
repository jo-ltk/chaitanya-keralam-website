'use client';
/* Scroll motion for inner pages. Same patterns and values as public/js/main.js (the landing page),
   driven by the same attributes: data-split, data-chars, data-reveal, data-reveal-img, data-inner,
   data-parallax, data-drift, data-statement. Desktop-only effects run at (min-width: 900px) and (pointer: fine). */
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function loadLenis(): Promise<void> {
  return new Promise((resolve) => {
    const w = window as any;
    if (w.Lenis) { resolve(); return; }
    const s = document.createElement('script');
    s.src = '/vendor/lenis.min.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

function keep(el: HTMLElement, store: HTMLElement[]) {
  if (el.hasAttribute('data-ck-orig')) el.innerHTML = el.getAttribute('data-ck-orig')!;
  else el.setAttribute('data-ck-orig', el.innerHTML);
  store.push(el);
}
function words(el: HTMLElement, store: HTMLElement[]) {
  keep(el, store);
  el.innerHTML = (el.textContent || '').trim().split(/\s+/)
    .map((w) => `<span class="w"><span class="wi">${w}</span></span>`).join(' ');
  return Array.from(el.querySelectorAll<HTMLElement>('.wi'));
}
function chars(el: HTMLElement, store: HTMLElement[]) {
  keep(el, store);
  const t = el.textContent || '';
  el.setAttribute('aria-label', t);
  el.innerHTML = t.split(' ').map((w) =>
    `<span style="display:inline-block;white-space:nowrap" aria-hidden="true">${
      w.split('').map((c) => `<span class="c"><span class="ci">${c}</span></span>`).join('')}</span>`).join(' ');
  return Array.from(el.querySelectorAll<HTMLElement>('.ci'));
}

export function useCKMotion(rootRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // static page, nothing hidden

    let cancelled = false;
    let teardown: (() => void) | null = null;

    (async () => {
      await loadLenis();
      if (cancelled) return;

      const split: HTMLElement[] = [];
      let lenis: any = null;
      let mm: gsap.MatchMedia | null = null;
      const tick = (t: number) => lenis?.raf(t * 1000);
      const $$ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));

      document.documentElement.classList.add('motion');

      const ctx = gsap.context(() => {
        // hero intro (nav lives outside <main>, so select from the document)
        gsap.from(document.querySelectorAll('.nav-in > *'), { y: -16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.2 });
        gsap.from($$('.page-hero .kicker, .page-hero .label, .page-hero .lead, .page-hero .tlink'),
          { y: 20, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 1 });

        $$('[data-chars]').forEach((el) => {
          const inHero = !!el.closest('.page-hero');
          gsap.from(chars(el, split), inHero
            ? { yPercent: 120, duration: 1.4, ease: 'expo.out', stagger: 0.025, delay: 0.35 }
            : { yPercent: 120, duration: 1.2, ease: 'expo.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
        });
        $$('[data-split]').forEach((el) =>
          gsap.from(words(el, split), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
        $$('[data-statement]').forEach((el) =>
          gsap.fromTo(words(el, split), { opacity: 0.18 }, { opacity: 1, stagger: 0.08, ease: 'none',
            scrollTrigger: { trigger: el.closest('section') || el, start: 'top 75%', end: 'bottom 70%', scrub: true } }));
        $$('[data-reveal]').forEach((el) =>
          gsap.from(el, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

        mm = gsap.matchMedia();
        mm.add('(min-width: 900px) and (pointer: fine)', () => {
          $$('.chapter-word').forEach((el) => {
            const d = parseFloat(el.dataset.drift || '6') || 6;
            gsap.fromTo(el, { xPercent: -d }, { xPercent: d, ease: 'none',
              scrollTrigger: { trigger: el.closest('.chapter') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
          $$('[data-parallax]').forEach((el) => {
            const s = parseFloat(el.dataset.parallax || '0');
            gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', force3D: true,
              scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
          $$('[data-inner]').forEach((el) => {
            const s = parseFloat(el.dataset.inner || '0');
            gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', force3D: true,
              scrollTrigger: { trigger: el.closest('.ph') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
          $$('[data-reveal-img], .chapter-media').forEach((el) =>
            gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
          const water = document.querySelector('#water');
          const foot = document.querySelector('.foot');
          if (water && foot) gsap.fromTo(water, { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none',
            scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom', scrub: true } });

          const L = (window as any).Lenis;
          if (L) {
            lenis = new L({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
          }
          return () => { if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); lenis = null; } };
        });
      }, root);

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);

      teardown = () => {
        window.removeEventListener('load', refresh);
        mm?.revert();
        ctx.revert();
        split.forEach((el) => {
          const o = el.getAttribute('data-ck-orig');
          if (o !== null) { el.innerHTML = o; el.removeAttribute('data-ck-orig'); }
          el.removeAttribute('aria-label');
        });
        document.documentElement.classList.remove('motion');
      };
    })();

    return () => { cancelled = true; teardown?.(); };
  }, [rootRef]);
}
