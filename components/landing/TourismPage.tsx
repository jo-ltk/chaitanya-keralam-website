'use client';
/* Eco-Spiritual Peace Tourism page, in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md).
   Deliberately a different composition from About: staggered photo strip, tabbed themes, mirrored chapter,
   panorama, dark pledge list and a four-column image grid. */
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';
import type { TourismContent } from '@/lib/tourism-content';
import type { Img } from '@/lib/landing-content';

type Scene = 'backwater' | 'ghats' | 'forest' | 'coast' | 'culture' | 'temple' | 'tea' | 'falls' | 'dusk';

function Ph({ ratio, scene, src, alt, slot, meta, inner, reveal, className = '' }: {
  ratio?: '1x1' | '4x5' | '3x2' | '16x9' | '21x9'; scene: Scene; src?: string; alt?: string; slot: string; meta?: string;
  inner?: number; reveal?: boolean; className?: string;
}) {
  return (
    <div className={`ph ${ratio ? `r-${ratio}` : ''} ${className}`.trim()} {...(reveal ? { 'data-reveal-img': '' } : {})}>
      <div className={`bg s-${scene}`} {...(inner ? { 'data-inner': String(inner) } : {})}>
        {src && <img src={src} alt={alt || ''} loading="lazy" decoding="async" />}
      </div>
      <span className="slot">[{slot}]{meta && <small>{meta}</small>}</span>
    </div>
  );
}

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;
// Placeholder tint behind each image while it loads (design only, not CMS content).
const SCENES = {
  film: ['forest', 'culture', 'temple', 'backwater'] as Scene[],
  themes: ['forest', 'culture', 'temple', 'dusk', 'tea'] as Scene[],
  palayam: ['temple'] as Scene[],
  kochi: ['culture'] as Scene[],
  cuisine: ['culture', 'tea', 'culture', 'dusk'] as Scene[],
  work: ['dusk', 'forest', 'culture', 'tea'] as Scene[],
};
const sceneAt = (list: Scene[], i: number) => list[i % list.length];

type Card = { label: string; text: string; image: Img };
type Theme = { title: string; text: string; image: Img };

function PhotoCards({ items, scenes }: { items: Card[]; scenes: Scene[] }) {
  return (
    <ul className="cards">
      {items.map((p, i) => (
        <li key={i} data-reveal>
          <div className="card">
            <Ph ratio="4x5" scene={sceneAt(scenes, i)} src={p.image.url} alt={p.image.alt} slot={`Portrait — ${p.image.alt}`} meta="1200×1500 · 4:5" />
            <span className="label">{p.label}</span>
            <h3>{p.text}</h3>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* Tabbed themes: own component so switching tabs never re-renders the split headings elsewhere */
function Themes({ items: THEMES }: { items: Theme[] }) {
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = THEMES[cur];
  const next = THEMES[(cur + 1) % THEMES.length];
  const paused = held || !onScreen || pageHidden;
  const go = (i: number, focus = false) => {
    const n = (i + THEMES.length) % THEMES.length;
    setCur(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    const vis = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  // keep the active tab visible when the tab row scrolls sideways on small screens
  useEffect(() => {
    const l = list.current, b = tabs.current[cur];
    if (l && b && l.scrollWidth > l.clientWidth) l.scrollTo({ left: b.offsetLeft - l.offsetLeft, behavior: 'smooth' });
  }, [cur]);

  return (
    <div ref={root}
      onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
    >
      {/* the active tab's bar fills over one slide; its animationend advances the theme, so pausing freezes both */}
      <div ref={list} className={`tabs tabs-auto${paused ? ' is-paused' : ''}`} role="tablist" aria-label="Core themes">
        {THEMES.map((th, i) => (
          <button key={i} ref={(el) => { tabs.current[i] = el; }} className="tab" type="button" role="tab"
            id={`theme-tab-${i}`} aria-selected={i === cur} aria-controls="theme-panel" tabIndex={i === cur ? 0 : -1}
            onClick={() => go(i)} onKeyDown={(e) => onKey(e, i)}>
            {th.title}
            {i === cur && <span className="tab-bar" aria-hidden="true" onAnimationEnd={() => go(cur + 1)} />}
          </button>
        ))}
      </div>
      <div className="theme-panel" id="theme-panel" role="tabpanel" aria-labelledby={`theme-tab-${cur}`}>
        <div className="ph r-3x2 theme-media">
          <div className={`bg s-${sceneAt(SCENES.themes, cur)}`}>
            {t.image.url && <img key={t.image.url} className="theme-img" src={t.image.url} alt={t.image.alt} loading="lazy" decoding="async" />}
          </div>
          <span className="slot">[Image — {t.image.alt}]<small>1500×1000 · 3:2</small></span>
        </div>
        <div className="theme-copy" key={cur}>
          <span className="theme-no">{String(cur + 1).padStart(2, '0')} <span>/ {String(THEMES.length).padStart(2, '0')}</span></span>
          <h3 className="h-section">{t.title}</h3>
          <p className="lead">{t.text}</p>
          <button type="button" className="tlink" onClick={() => go(cur + 1)}><span>Next: {next.title}</span><Arrow /></button>
        </div>
      </div>
    </div>
  );
}

export default function TourismPage({ content: c }: { content: TourismContent }) {
  const main = useRef<HTMLElement>(null);
  useCKMotion(main);

  return (
    <>
      <SiteNav overDarkHero />

      <main id="top" ref={main}>
        {/* 1 · Dark page hero */}
        <section className="page-hero page-hero-tall" aria-labelledby="pageH">
          <div className="ph">
            <div className="bg s-backwater" data-inner="6">
              <img src={c.hero.image.url} alt={c.hero.image.alt} loading="eager" decoding="async" fetchPriority="high" />
            </div>
            <span className="slot">[Full-screen image — Kerala backwaters at sunrise]<small>2560×1440</small></span>
          </div>
          <div className="wrap page-hero-in">
            <p className="label crumbs"><Link href="/">Home</Link> / Eco-Spiritual Peace Tourism</p>
            <span className="kicker">{c.hero.kicker}</span>
            <h1 className="page-title wide" id="pageH" data-chars>{c.hero.title}</h1>
            <p className="lead">{c.hero.lead}</p>
            <a className="btn btn-white" href="#themes"><span>{c.hero.button}</span><Arrow /></a>
          </div>
        </section>

        {/* 2 · Staggered photo strip + long-term vision */}
        <section className="section" id="intro" aria-label="Kerala landscapes and culture">
          <div className="wrap">
            <ul className="film">
              {c.intro.photos.map((f, i) => (
                <li key={i} data-reveal>
                  <Ph ratio="4x5" scene={sceneAt(SCENES.film, i)} src={f.image.url} alt={f.image.alt} slot={`Portrait — ${f.image.alt}`} meta="1200×1500 · 4:5" inner={5} />
                  <span className="label">{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="film-note">
              <span className="kicker">{c.intro.kicker}</span>
              <p className="lead" data-reveal>{c.intro.text}</p>
            </div>
          </div>
        </section>

        {/* 3 · Core themes (tabs) */}
        <section className="section" id="themes" aria-labelledby="themesH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="themesH" data-split>{c.themes.heading}</h2>
              <p className="lead" data-reveal>{c.themes.lead}</p>
            </div>
            <div data-reveal><Themes items={c.themes.items} /></div>
          </div>
        </section>

        {/* 3b · Palayam: church, temple and mosque as neighbours */}
        <section className="section" id="palayam" aria-labelledby="palH">
          <div className="wrap">
            <span className="label">{c.palayam.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="palH" data-split>{c.palayam.heading}</h2>
              <p className="lead" data-reveal>{c.palayam.lead}</p>
            </div>
            <PhotoCards items={c.palayam.cards} scenes={SCENES.palayam} />
          </div>
        </section>

        {/* 4 · Why Kerala (mirrored chapter) */}
        <section className="dark chapter ch-2 chapter-tight" id="why-kerala" aria-labelledby="ch2">
          <div className="wrap chapter-stage">
            <span className="kicker chapter-no">{c.whyKerala.kicker}</span>
            <Ph ratio="4x5" scene="backwater" src={c.whyKerala.image.url} alt={c.whyKerala.image.alt} slot="Portrait — Kerala backwaters at golden hour" meta="1200×1500 · 4:5" inner={7} className="chapter-media" />
            <h2 className="chapter-word" id="ch2" data-drift="6">{c.whyKerala.word}</h2>
            <div className="chapter-copy" data-reveal>
              <p>{c.whyKerala.text}</p>
              <a className="tlink" href="#heritage"><span>{c.whyKerala.link}</span><Arrow /></a>
            </div>
            <Ph ratio="3x2" scene="tea" src={c.whyKerala.inset.url} alt={c.whyKerala.inset.alt} slot="Image — Sunrise over misty tea hills" meta="1500×1000 · 3:2" reveal className="chapter-inset chapter-inset-lg" />
          </div>
        </section>

        {/* 5 · Heritage: ancient ports + panorama */}
        <section className="section" id="heritage" aria-labelledby="herH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="herH" data-split>{c.heritage.heading}</h2>
              <p className="lead" data-reveal>{c.heritage.lead}</p>
            </div>
            <Ph ratio="21x9" scene="backwater" src={c.heritage.panorama.url} alt={c.heritage.panorama.alt} slot="Panorama — Village on the backwaters" meta="2880×1234 · 21:9" inner={6} reveal />
            <div className="facts facts-words" data-reveal>
              {c.heritage.facts.map((f, i) => (
                <div key={i} className="fact"><span>{f.label}</span><b>{f.value}</b><span>{f.text}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* 5b · Kochi: Dutch and Jewish heritage */}
        <section className="section" id="kochi" aria-labelledby="kochiH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">{c.kochi.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="kochiH" data-split>{c.kochi.heading}</h2>
              <p className="lead" data-reveal>{c.kochi.lead}</p>
            </div>
            <PhotoCards items={c.kochi.cards} scenes={SCENES.kochi} />
          </div>
        </section>

        {/* 5c · Kerala cuisine (client-supplied photographs) */}
        <section className="section" id="cuisine" aria-labelledby="cuisH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">{c.cuisine.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="cuisH" data-split>{c.cuisine.heading}</h2>
              <p className="lead" data-reveal>{c.cuisine.lead}</p>
            </div>
            <ul className="cards cards-4 cards-all cards-natural">
              {c.cuisine.cards.map((d, i) => (
                <li key={i} data-reveal>
                  <div className="card">
                    <Ph ratio="4x5" scene={sceneAt(SCENES.cuisine, i)} src={d.image.url} alt={d.image.alt} slot={`Portrait — ${d.image.alt}`} meta="1200×1500 · 4:5" />
                    <span className="label">{d.label}</span>
                    <h3>{d.text}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6 · Responsible tourism principles (dark pledge list) */}
        <section className="dark section pledges" id="principles" aria-labelledby="prH">
          <div className="wrap">
            <span className="kicker">{c.principles.kicker}</span>
            <div className="head-row">
              <h2 className="h-section" id="prH" data-split>{c.principles.heading}</h2>
              <p className="lead" data-reveal>{c.principles.lead}</p>
            </div>
            <ol className="rows rows-static">
              {c.principles.items.map((p, i) => (
                <li key={i} className="row" data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-t">{p.value}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7 · Tourism and livelihoods (four-column image grid) */}
        <section className="section" id="livelihoods" aria-labelledby="livH">
          <div className="wrap">
            <span className="label">{c.livelihoods.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="livH" data-split>{c.livelihoods.heading}</h2>
              <Link className="tlink" href="/programmes"><span>{c.livelihoods.link}</span><Arrow /></Link>
            </div>
            <p className="lead liv-lead" data-reveal>{c.livelihoods.lead}</p>
            <ul className="cards cards-4 cards-all">
              {c.livelihoods.cards.map((w, i) => (
                <li key={i} data-reveal>
                  <div className="card">
                    <Ph ratio="4x5" scene={sceneAt(SCENES.work, i)} src={w.image.url} alt={w.image.alt} slot={`Portrait — ${w.image.alt}`} meta="1200×1500 · 4:5" />
                    <span className="label">{w.title}</span>
                    <h3>{w.text}</h3>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="btn btn-line view-all" href="/programmes"><span>{c.livelihoods.link}</span><Arrow /></Link>
          </div>
        </section>

        {/* 8 · Banner CTA */}
        <section className="banner" aria-labelledby="banH">
          <div className="ph">
            <div className="bg s-backwater" data-inner="8">
              <img src={c.banner.image.url} alt={c.banner.image.alt} loading="lazy" decoding="async" />
            </div>
            <span className="slot" style={{ top: '22%' }}>[Full-screen image — Kerala backwaters at sunrise]<small>2560×1440</small></span>
          </div>
          <div className="wrap banner-in">
            <span className="kicker">{c.banner.kicker}</span>
            <h2 id="banH" data-chars>{c.banner.heading}</h2>
            <p className="lead">{c.banner.lead}</p>
            <Link className="btn btn-white" href="/programmes"><span>{c.banner.button}</span><Arrow /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
