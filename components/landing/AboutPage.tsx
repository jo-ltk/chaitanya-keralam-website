'use client';
/* About page, built in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md). */
import Link from 'next/link';
import { useRef } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';
import type { AboutContent } from '@/lib/about-content';

type Scene = 'backwater' | 'ghats' | 'forest' | 'coast' | 'culture' | 'temple' | 'tea' | 'falls' | 'dusk';

function Ph({ ratio, scene, src, alt, slot, meta, inner, reveal, eager, className = '' }: {
  ratio?: '1x1' | '4x5' | '3x2' | '16x9'; scene: Scene; src?: string; alt?: string; slot: string; meta?: string;
  inner?: number; reveal?: boolean; eager?: boolean; className?: string;
}) {
  return (
    <div className={`ph ${ratio ? `r-${ratio}` : ''} ${className}`.trim()} {...(reveal ? { 'data-reveal-img': '' } : {})}>
      <div className={`bg s-${scene}`} {...(inner ? { 'data-inner': String(inner) } : {})}>
        {src && (eager
          ? <img src={src} alt={alt || ''} loading="eager" decoding="async" fetchPriority="high" />
          : <img src={src} alt={alt || ''} loading="lazy" decoding="async" />)}
      </div>
      <span className="slot">[{slot}]{meta && <small>{meta}</small>}</span>
    </div>
  );
}

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

// Placeholder tint behind each image while it loads (design only, not CMS content).
const GOAL_SCENES: Scene[] = ['culture', 'dusk', 'forest'];
const THREAD_SCENES: Scene[] = ['culture', 'tea', 'backwater', 'temple', 'dusk', 'forest'];

export default function AboutPage({ content: c }: { content: AboutContent }) {
  const main = useRef<HTMLElement>(null);
  useCKMotion(main);

  return (
    <>
      <SiteNav overDarkHero />

      <main id="top" ref={main}>
        {/* 1 · Dark page hero */}
        <section className="page-hero" aria-labelledby="pageH">
          <div className="ph">
            <div className="bg s-backwater" data-inner="6">
              <img src={c.hero.image.url} alt={c.hero.image.alt} loading="eager" decoding="async" fetchPriority="high" />
            </div>
            <span className="slot">[Hero, full-screen — Misty Kerala backwaters at dawn, a lone boat, calm and wide]<small>2560×1440</small></span>
          </div>
          <div className="wrap page-hero-in">
            <p className="label crumbs"><Link href="/">Home</Link> / About Us</p>
            <span className="kicker">{c.hero.kicker}</span>
            <h1 className="page-title wide" id="pageH" data-chars>{c.hero.title}</h1>
            <p className="lead">{c.hero.lead}</p>
            <div className="page-hero-links">
              <a className="tlink" href="#vision"><span>{c.hero.visionLink}</span><Arrow /></a>
              <a className="tlink" href="#philosophy"><span>{c.hero.philosophyLink}</span><Arrow /></a>
            </div>
          </div>
        </section>

        {/* 2 · Who we are (paper, story split) */}
        <section className="section" id="about" aria-labelledby="whoH">
          <div className="wrap story-grid">
            <div className="story-text">
              <span className="label">{c.whoWeAre.label}</span>
              <h2 className="h-section" id="whoH" data-split>{c.whoWeAre.heading}</h2>
              <p className="lead" data-reveal>{c.whoWeAre.text}</p>
              <Link className="btn btn-ink" href="/programmes" data-reveal><span>{c.whoWeAre.button}</span><Arrow /></Link>
            </div>
            <div className="story-media">
              <Ph ratio="4x5" scene="culture" src={c.whoWeAre.image1.url} alt={c.whoWeAre.image1.alt} slot="Image — Kerala village market in the morning, warm light, real people" meta="1200×1500 · 4:5" inner={5} reveal />
              <Ph ratio="1x1" scene="tea" src={c.whoWeAre.image2.url} alt={c.whoWeAre.image2.alt} slot="Image — Young artisan being mentored in a craft workshop" meta="1000×1000" inner={5} reveal />
            </div>
          </div>
        </section>

        {/* 3 · Vision (dark statement) */}
        <section className="dark statement" id="vision" aria-label="Our vision">
          <div className="wrap">
            <span className="kicker">{c.vision.kicker}</span>
            <p data-statement>{c.vision.statement}</p>
          </div>
        </section>

        {/* 4 · Mission (paper, hairline list) */}
        <section className="section" id="mission" aria-labelledby="misH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="misH" data-split>{c.mission.heading}</h2>
              <p className="lead" data-reveal>{c.mission.lead}{c.mission.badge && <> <span className="tbc">{c.mission.badge}</span></>}</p>
            </div>
            <ol className="rows rows-static">
              {c.mission.items.map((m, i) => (
                <li key={i} className="row" data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-t">{m.value}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5 · Project target (dark chapter) */}
        <section className="dark chapter ch-1 chapter-tight" aria-labelledby="ch1">
          <div className="wrap chapter-stage">
            <span className="kicker chapter-no">{c.target.kicker}</span>
            <Ph ratio="4x5" scene="backwater" src={c.target.image.url} alt={c.target.image.alt} slot="Portrait — Young Keralites at work by the water at sunset, hopeful and forward-looking" meta="1200×1500 · 4:5" inner={7} className="chapter-media" />
            <h2 className="chapter-word" id="ch1" data-drift="-6">{c.target.number}</h2>
            <div className="chapter-copy" data-reveal>
              <p>{c.target.text}</p>
              <a className="tlink" href="#goals"><span>{c.target.link}</span><Arrow /></a>
            </div>
            <Ph ratio="3x2" scene="dusk" src={c.target.inset.url} alt={c.target.inset.alt} slot="Image — Young team planning together over models and maps" meta="1500×1000 · 3:2" reveal className="chapter-inset chapter-inset-lg" />
          </div>
        </section>

        {/* 6 · Goals (paper, three stories) */}
        <section className="section" id="goals" aria-labelledby="goalsH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="goalsH" data-split>{c.goals.heading}</h2>
              <p className="lead" data-reveal>{c.goals.lead}</p>
            </div>
            <ul className="stories">
              {c.goals.items.map((g, i) => (
                <li key={i} className="story-item" data-reveal>
                  <div>
                    <Ph ratio="3x2" scene={GOAL_SCENES[i % GOAL_SCENES.length]} src={g.image.url} alt={g.image.alt} slot={`Image — ${g.image.alt}`} meta="1500×1000" />
                    <div className="story-body"><span className="label">{g.label}</span><h3>{g.text}</h3></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 · Philosophy (dark quote) */}
        <section className="dark invitation" id="philosophy" aria-labelledby="phH">
          <div className="wrap invitation-in">
            <span className="kicker">{c.philosophy.kicker}</span>
            <h2 id="phH">{c.philosophy.quote}</h2>
            {c.philosophy.paragraphs.map((p, i) => <p key={i} className="lead" data-reveal>{p.value}</p>)}
          </div>
        </section>

        {/* 8 · Approach (paper, six cards) */}
        <section className="section" id="approach" aria-labelledby="appH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="appH" data-split>{c.approach.heading}</h2>
              <p className="lead" data-reveal>{c.approach.lead}</p>
            </div>
            <ul className="cards cards-all">
              {c.approach.threads.map((t, i) => (
                <li key={i} data-reveal>
                  <div className="card">
                    <Ph ratio="1x1" scene={THREAD_SCENES[i % THREAD_SCENES.length]} src={t.image.url} alt={t.image.alt} slot={`Image — ${t.image.alt}`} meta="1600×1600 · 1:1" />
                    <span className="label">{t.title}</span>
                    <h3>{t.text}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 9 · Learning philosophy (paper, hairline list) */}
        <section className="section" id="learning" aria-labelledby="learnH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="learnH" data-split>{c.learning.heading}</h2>
              <p className="lead" data-reveal>{c.learning.lead}</p>
            </div>
            <ol className="rows rows-static">
              {c.learning.items.map((l, i) => (
                <li key={i} className="row" data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-c"><span className="row-t">{l.title}</span><span className="row-d">{l.description}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 10 · Banner CTA */}
        <section className="banner" aria-labelledby="banH">
          <div className="ph">
            <div className="bg s-culture" data-inner="8">
              <img src={c.banner.image.url} alt={c.banner.image.alt} loading="lazy" decoding="async" />
            </div>
            <span className="slot" style={{ top: '22%' }}>[Banner, full-screen — Welcoming Kerala village life or a sunset over the backwaters]<small>2560×1440</small></span>
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
