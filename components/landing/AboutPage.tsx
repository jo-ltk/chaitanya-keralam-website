'use client';
/* About page, built in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md). */
import Link from 'next/link';
import { useRef } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';

type Scene = 'backwater' | 'ghats' | 'forest' | 'coast' | 'culture' | 'temple' | 'tea' | 'falls' | 'dusk';

function Ph({ ratio, scene, slot, meta, inner, reveal, eager, className = '' }: {
  ratio?: '1x1' | '4x5' | '3x2' | '16x9'; scene: Scene; slot: string; meta?: string;
  inner?: number; reveal?: boolean; eager?: boolean; className?: string;
}) {
  return (
    <div className={`ph ${ratio ? `r-${ratio}` : ''} ${className}`.trim()} {...(reveal ? { 'data-reveal-img': '' } : {})}>
      <div className={`bg s-${scene}`} {...(inner ? { 'data-inner': String(inner) } : {})}>
      </div>
      <span className="slot">[{slot}]{meta && <small>{meta}</small>}</span>
    </div>
  );
}

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

const MISSION = [
  'Transforming luxury homes',
  'Empowering youth',
  'Creating entrepreneurs',
  'Utilizing free land holding for income generation',
  'Global e-commerce opportunities',
];

const GOALS = [
  { label: 'Community-based centres', scene: 'culture' as Scene, alt: 'A community centre in a restored Kerala home, neighbours gathering',
    text: 'Convert underutilized assets into productive community-based centres that create opportunities for youth, support tourism and generate sustainable livelihoods.' },
  { label: 'Empowering youth', scene: 'dusk' as Scene, alt: 'Young people training and learning a skill hands-on',
    text: 'Empowering youth through skill development, practical experience, leadership and entrepreneurial opportunities.' },
  { label: 'Responsible tourism', scene: 'forest' as Scene, alt: 'Guests walking gently through forest or village, respectful of the land',
    text: 'Encourage responsible tourism and community participation.' },
];

const THREADS = [
  { label: 'Heritage', scene: 'culture' as Scene, alt: 'Oil lamps or a temple at dusk',
    title: 'Ancient wisdom and cultural values', text: "Kerala's heritage of spiritual traditions, cultural exchange and traditional knowledge." },
  { label: 'Hospitality', scene: 'tea' as Scene, alt: 'A Kerala family welcoming guests with a sadya',
    title: 'Kerala hospitality culture', text: "Kerala's traditions of hospitality and community living." },
  { label: 'Tourism', scene: 'backwater' as Scene, alt: 'A traveller at a quiet backwater or hill viewpoint',
    title: 'Eco-spiritual tourism', text: 'Travel that connects nature, ecology, spirituality, peace and culture.' },
  { label: 'Wellness', scene: 'temple' as Scene, alt: 'Meditation or yoga by still water, Ayurveda',
    title: 'Peace and wellness', text: "Meditation, wellness and Kerala's Ayurvedic and spiritual traditions." },
  { label: 'Enterprise', scene: 'dusk' as Scene, alt: 'A young entrepreneur at a laptop in a homestay',
    title: 'Youth entrepreneurship', text: 'Preparing young people to lead and to create their own sustainable enterprises.' },
  { label: 'Livelihoods', scene: 'forest' as Scene, alt: 'A farmer or artisan earning a livelihood, Kerala greens',
    title: 'Sustainable livelihoods', text: 'Livelihood opportunities that benefit youth and communities.' },
];

const LEARNING = [
  { t: 'Knowledge and practical skills', d: 'Specific knowledge paired with hands-on practice.' },
  { t: 'Tourism, hospitality & caregiving', d: 'Tourism and hospitality training, and caregiving skills.' },
  { t: 'Management & leadership', d: 'Management and leadership development, and global entrepreneurship.' },
  { t: 'Digital & community', d: 'Digital skills and community engagement.' },
  { t: 'Practice & projects', d: 'Practical exposure and project-based learning.' },
];

export default function AboutPage() {
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
            </div>
            <span className="slot">[Hero, full-screen — Misty Kerala backwaters at dawn, a lone boat, calm and wide]<small>2560×1440</small></span>
          </div>
          <div className="wrap page-hero-in">
            <p className="label crumbs"><Link href="/">Home</Link> / About Us</p>
            <span className="kicker">About Chaitanya Keralam</span>
            <h1 className="page-title wide" id="pageH" data-chars>A vision rooted in Kerala, looking towards the world.</h1>
            <p className="lead">A mission by the youth, for the youth and of the youth.</p>
            <div className="page-hero-links">
              <a className="tlink" href="#vision"><span>Our vision</span><Arrow /></a>
              <a className="tlink" href="#philosophy"><span>Our philosophy</span><Arrow /></a>
            </div>
          </div>
        </section>

        {/* 2 · Who we are (paper, story split) */}
        <section className="section" id="about" aria-labelledby="whoH">
          <div className="wrap story-grid">
            <div className="story-text">
              <span className="label">Who we are</span>
              <h2 className="h-section" id="whoH" data-split>A transformative initiative</h2>
              <p className="lead" data-reveal>Chaitanya Keralam is envisioned as a transformative initiative to develop Kerala as a Global Eco-Spiritual Peace Tourism Destination — bringing together nature, culture, spirituality, peace, wellness, responsible tourism, hospitality, caregiving and entrepreneurship to create meaningful livelihood opportunities for youth and the community.</p>
              <Link className="btn btn-ink" href="/programmes" data-reveal><span>Explore our programmes</span><Arrow /></Link>
            </div>
            <div className="story-media">
              <Ph ratio="4x5" scene="culture" slot="Image — Kerala village market in the morning, warm light, real people" meta="1200×1500 · 4:5" inner={5} reveal />
              <Ph ratio="1x1" scene="tea" slot="Image — Young artisan being mentored in a craft workshop" meta="1000×1000" inner={5} reveal />
            </div>
          </div>
        </section>

        {/* 3 · Vision (dark statement) */}
        <section className="dark statement" id="vision" aria-label="Our vision">
          <div className="wrap">
            <span className="kicker">Our vision</span>
            <p data-statement>Transforming Kerala into a Global Eco-Spiritual Peace Tourism Destination.</p>
          </div>
        </section>

        {/* 4 · Mission (paper, hairline list) */}
        <section className="section" id="mission" aria-labelledby="misH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="misH" data-split>Our mission</h2>
              <p className="lead" data-reveal>Kerala has around <b>1.4 million</b> unutilized or underutilized houses. Our mission is to transform suitable existing unutilized and underutilized homes into TSB and TESH Homes — creating a distributed network of international guest houses, training centres and activity centres. <span className="tbc">Proposed</span></p>
            </div>
            <ol className="rows rows-static">
              {MISSION.map((m, i) => (
                <li key={m} className="row" data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-t">{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5 · Project target (dark chapter) */}
        <section className="dark chapter ch-1 chapter-tight" aria-labelledby="ch1">
          <div className="wrap chapter-stage">
            <span className="kicker chapter-no">01 · Project target</span>
            <Ph ratio="4x5" scene="backwater" slot="Portrait — Young Keralites at work by the water at sunset, hopeful and forward-looking" meta="1200×1500 · 4:5" inner={7} className="chapter-media" />
            <h2 className="chapter-word" id="ch1" data-drift="-6">1,000</h2>
            <div className="chapter-copy" data-reveal>
              <p>To create a team of 1,000 Independent Global Youth Entrepreneurs in the Eco-Spiritual Peace Tourism Industry in Kerala.</p>
              <a className="tlink" href="#goals"><span>See our goals</span><Arrow /></a>
            </div>
            <Ph ratio="3x2" scene="dusk" slot="Image — Young team planning together over models and maps" meta="1500×1000 · 3:2" reveal className="chapter-inset chapter-inset-lg" />
          </div>
        </section>

        {/* 6 · Goals (paper, three stories) */}
        <section className="section" id="goals" aria-labelledby="goalsH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="goalsH" data-split>Project goals for the years ahead</h2>
              <p className="lead" data-reveal>These are project goals, not completed achievements.</p>
            </div>
            <ul className="stories">
              {GOALS.map((g) => (
                <li key={g.label} className="story-item" data-reveal>
                  <div>
                    <Ph ratio="3x2" scene={g.scene} slot={`Image — ${g.alt}`} meta="1500×1000" />
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
            <span className="kicker">Our philosophy · Tyagarchana</span>
            <h2 id="phH">“Caring love, voluntary sacrifice and selfless service.”</h2>
            <p className="lead" data-reveal>Tyagarchana is the project&apos;s stated philosophy — service offered with care, given freely and without expectation.</p>
            <p className="lead" data-reveal>In practice, it is intended to shape how Chaitanya Keralam approaches tourism, hospitality and community development: welcoming guests with sincerity, respecting the places and people who host them, and encouraging young people to see service and leadership as contributions to their communities.</p>
          </div>
        </section>

        {/* 8 · Approach (paper, six cards) */}
        <section className="section" id="approach" aria-labelledby="appH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="appH" data-split>Six threads, woven together</h2>
              <p className="lead" data-reveal>The project integrates ancient wisdom, Kerala&apos;s hospitality culture, eco-spiritual tourism, peace and wellness, youth entrepreneurship and sustainable livelihoods.</p>
            </div>
            <ul className="cards cards-all">
              {THREADS.map((t) => (
                <li key={t.title} data-reveal>
                  <div className="card">
                    <Ph ratio="1x1" scene={t.scene} slot={`Image — ${t.alt}`} meta="1600×1600 · 1:1" />
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
              <h2 className="h-section" id="learnH" data-split>Beyond the classroom</h2>
              <p className="lead" data-reveal>We believe that skill development should go beyond classroom learning. Our programmes combine:</p>
            </div>
            <ol className="rows rows-static">
              {LEARNING.map((l, i) => (
                <li key={l.t} className="row" data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-c"><span className="row-t">{l.t}</span><span className="row-d">{l.d}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 10 · Banner CTA */}
        <section className="banner" aria-labelledby="banH">
          <div className="ph">
            <div className="bg s-culture" data-inner="8">
            </div>
            <span className="slot" style={{ top: '22%' }}>[Banner, full-screen — Welcoming Kerala village life or a sunset over the backwaters]<small>2560×1440</small></span>
          </div>
          <div className="wrap banner-in">
            <span className="kicker">Learn • Practise • Create • Lead</span>
            <h2 id="banH" data-chars>Find your path.</h2>
            <p className="lead">Find the programme that fits your path.</p>
            <Link className="btn btn-white" href="/programmes"><span>Explore Our Programmes</span><Arrow /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
