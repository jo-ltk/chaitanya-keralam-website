'use client';
/* Eco-Spiritual Peace Tourism page, in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md).
   Deliberately a different composition from About: staggered photo strip, tabbed themes, mirrored chapter,
   panorama, dark pledge list and a four-column image grid. */
import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';

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
const IMG = '/images/eco-spiritual-tourism';

const FILM = [
  { label: 'Nature', scene: 'forest' as Scene, src: `${IMG}/film-nature.png`, alt: 'Misty hills and forest stream, Munnar' },
  { label: 'Heritage', scene: 'culture' as Scene, src: `${IMG}/film-heritage.jpg`, alt: 'Padmanabhapuram Palace courtyard' },
  { label: 'Wellness', scene: 'temple' as Scene, src: `${IMG}/film-wellness.png`, alt: 'Wellness and meditation retreat' },
  { label: 'Hospitality', scene: 'backwater' as Scene, src: `${IMG}/film-hospitality.jpg`, alt: 'Kumarakom heritage homestay by the backwaters' },
];

const THEMES = [
  { title: 'Nature and ecology', text: 'Forests, rivers, mountains, biodiversity and conservation.',
    scene: 'forest' as Scene, src: `${IMG}/theme-nature-ecology.jpg`, alt: 'Periyar Wildlife Sanctuary, Thekkady' },
  { title: 'Spirituality and heritage', text: 'Sacred landscapes, pilgrimage traditions, cultural heritage and respectful understanding of different traditions.',
    scene: 'culture' as Scene, src: `${IMG}/theme-spirituality-heritage.jpg`, alt: 'Guruvayur Temple heritage' },
  { title: 'Wellness and peace', text: 'Meditation, reflection, nature-based wellness and retreat experiences.',
    scene: 'temple' as Scene, alt: 'A serene tropical wellness retreat' },
  { title: 'Kerala culture and hospitality', text: 'Traditional architecture, cuisine, arts, crafts, community knowledge and hospitality.',
    scene: 'dusk' as Scene, src: `${IMG}/theme-culture-hospitality.jpg`, alt: 'A traditional Kerala veranda table setting' },
  { title: 'Responsible tourism', text: 'Waste reduction, water and energy conservation, cultural respect and community participation.',
    scene: 'tea' as Scene, src: `${IMG}/theme-responsible-tourism.jpg`, alt: 'Thenmala eco-tourism destination' },
];

const PRINCIPLES = [
  'Respect local customs and cultural differences.',
  'Protect natural environments.',
  'Reduce waste and conserve resources.',
  'Support local businesses and service providers.',
  'Encourage community participation.',
];

const WORK = [
  { title: 'Guest services', text: 'Welcoming, informing and caring for visitors.',
    scene: 'dusk' as Scene, src: `${IMG}/work-guest-services.png`, alt: 'Hosts welcoming guests on a veranda' },
  { title: 'Local guides', text: 'Sharing nature, heritage and stories with care.',
    scene: 'forest' as Scene, src: `${IMG}/work-local-guides.jpg`, alt: 'A guided village walk in Wayanad' },
  { title: 'Hospitality', text: 'Guest houses, resorts and retreats run sustainably.',
    scene: 'culture' as Scene, src: `${IMG}/work-hospitality.jpg`, alt: 'Inside a Fort Kochi heritage home' },
  { title: 'Community enterprises', text: "Local businesses that keep tourism's benefits close to home.",
    scene: 'tea' as Scene, src: `${IMG}/work-community-enterprises.jpg`, alt: 'Exploring a cardamom spice plantation' },
];

/* Client-supplied photographs (Nov 2026) */
const PALAYAM = [
  { label: 'Church', text: 'A Gothic church tower lit up against the night sky.',
    scene: 'temple' as Scene, src: `${IMG}/palayam-church.jpg`, alt: 'The church at Palayam, Thiruvananthapuram, lit up at night' },
  { label: 'Temple', text: 'A temple gopuram with Lord Ganesha, glowing after dusk.',
    scene: 'temple' as Scene, src: `${IMG}/palayam-temple.jpg`, alt: 'The temple gopuram at Palayam, Thiruvananthapuram, with Lord Ganesha, lit up at night' },
  { label: 'Mosque', text: 'Twin minarets of the mosque, lit in white and blue.',
    scene: 'temple' as Scene, src: `${IMG}/palayam-mosque.jpg`, alt: 'The mosque at Palayam, Thiruvananthapuram, with its minarets lit at night' },
];

const KOCHI = [
  { label: 'Bolgatty Palace', text: 'A palace built by the Dutch, shaded by old trees.',
    scene: 'culture' as Scene, src: `${IMG}/kochi-bolgatty-palace.jpg`, alt: 'Bolgatty Palace in Kochi, with a red tiled roof and wooden verandas among tall trees' },
  { label: 'Dutch architecture', text: 'Whitewashed arches beneath sloping tiled roofs.',
    scene: 'culture' as Scene, src: `${IMG}/kochi-dutch-architecture.jpg`, alt: 'A Dutch-style building with white arches and a sloping tiled roof' },
  { label: 'Paradesi Synagogue', text: 'Hand-painted blue floor tiles and glass lamps in Mattancherry.',
    scene: 'culture' as Scene, src: `${IMG}/kochi-paradesi-synagogue.jpg`, alt: 'Inside the Paradesi Synagogue, Kochi: blue tiled floor, wooden benches and hanging glass lamps' },
];

function PhotoCards({ items }: { items: typeof PALAYAM }) {
  return (
    <ul className="cards">
      {items.map((p) => (
        <li key={p.label} data-reveal>
          <div className="card">
            <Ph ratio="4x5" scene={p.scene} src={p.src} alt={p.alt} slot={`Portrait — ${p.alt}`} meta="1200×1500 · 4:5" />
            <span className="label">{p.label}</span>
            <h3>{p.text}</h3>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* Tabbed themes: own component so switching tabs never re-renders the split headings elsewhere */
function Themes() {
  const [cur, setCur] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = THEMES[cur];
  const go = (i: number, focus = false) => {
    const n = (i + THEMES.length) % THEMES.length;
    setCur(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
  };
  return (
    <>
      <div className="tabs" role="tablist" aria-label="Core themes">
        {THEMES.map((th, i) => (
          <button key={th.title} ref={(el) => { tabs.current[i] = el; }} className="tab" type="button" role="tab"
            id={`theme-tab-${i}`} aria-selected={i === cur} aria-controls="theme-panel" tabIndex={i === cur ? 0 : -1}
            onClick={() => go(i)} onKeyDown={(e) => onKey(e, i)}>{th.title}</button>
        ))}
      </div>
      <div className="theme-panel" id="theme-panel" role="tabpanel" aria-labelledby={`theme-tab-${cur}`}>
        <div className="ph r-3x2 theme-media">
          <div className={`bg s-${t.scene}`}>
            {t.src && <img key={t.src} className="theme-img" src={t.src} alt={t.alt} loading="lazy" decoding="async" />}
          </div>
          <span className="slot">[Image — {t.alt}]<small>1500×1000 · 3:2</small></span>
        </div>
        <div className="theme-copy" key={t.title}>
          <span className="theme-no">{String(cur + 1).padStart(2, '0')} <span>/ {String(THEMES.length).padStart(2, '0')}</span></span>
          <h3 className="h-section">{t.title}</h3>
          <p className="lead">{t.text}</p>
          <button type="button" className="tlink" onClick={() => go(cur + 1)}><span>Next theme</span><Arrow /></button>
        </div>
      </div>
    </>
  );
}

export default function TourismPage() {
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
              <img src={`${IMG}/hero-sunrise.png`} alt="Kerala backwaters, panoramic landscape at sunrise" loading="eager" decoding="async" fetchPriority="high" />
            </div>
            <span className="slot">[Full-screen image — Kerala backwaters at sunrise]<small>2560×1440</small></span>
          </div>
          <div className="wrap page-hero-in">
            <p className="label crumbs"><Link href="/">Home</Link> / Eco-Spiritual Peace Tourism</p>
            <span className="kicker">Eco-Spiritual Peace Tourism</span>
            <h1 className="page-title wide" id="pageH" data-chars>Experience Kerala through nature, culture and peace.</h1>
            <p className="lead">Eco-Spiritual Peace Tourism connects natural environments, cultural heritage, spiritual traditions, wellness and responsible travel.</p>
            <a className="btn btn-white" href="#themes"><span>Explore the themes</span><Arrow /></a>
          </div>
        </section>

        {/* 2 · Staggered photo strip + long-term vision */}
        <section className="section" id="intro" aria-label="Kerala landscapes and culture">
          <div className="wrap">
            <ul className="film">
              {FILM.map((f) => (
                <li key={f.label} data-reveal>
                  <Ph ratio="4x5" scene={f.scene} src={f.src} alt={f.alt} slot={`Portrait — ${f.alt}`} meta="1200×1500 · 4:5" inner={5} />
                  <span className="label">{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="film-note">
              <span className="kicker">Our long-term vision</span>
              <p className="lead" data-reveal>Chaitanya Keralam&apos;s long-term vision is to develop these elements into meaningful tourism experiences while supporting local communities and youth livelihoods.</p>
            </div>
          </div>
        </section>

        {/* 3 · Core themes (tabs) */}
        <section className="section" id="themes" aria-labelledby="themesH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="themesH" data-split>Five themes at the heart of every experience</h2>
              <p className="lead" data-reveal>Select a theme to explore what it means for travellers, communities and learners.</p>
            </div>
            <div data-reveal><Themes /></div>
          </div>
        </section>

        {/* 3b · Palayam: church, temple and mosque as neighbours */}
        <section className="section" id="palayam" aria-labelledby="palH">
          <div className="wrap">
            <span className="label">Palayam, Thiruvananthapuram</span>
            <div className="head-row">
              <h2 className="h-section" id="palH" data-split>A church, a temple and a mosque</h2>
              <p className="lead" data-reveal>In the heart of Thiruvananthapuram, a church, a temple and a mosque stand as neighbours at Palayam. Bells and prayers share one sky.</p>
            </div>
            <PhotoCards items={PALAYAM} />
          </div>
        </section>

        {/* 4 · Why Kerala (mirrored chapter) */}
        <section className="dark chapter ch-2 chapter-tight" id="why-kerala" aria-labelledby="ch2">
          <div className="wrap chapter-stage">
            <span className="kicker chapter-no">Why Kerala?</span>
            <Ph ratio="4x5" scene="backwater" src={`${IMG}/chapter-why-kerala-main.jpg`} alt="Vembanad Lake, Kerala backwaters at golden hour" slot="Portrait — Kerala backwaters at golden hour" meta="1200×1500 · 4:5" inner={7} className="chapter-media" />
            <h2 className="chapter-word" id="ch2" data-drift="6">Kerala</h2>
            <div className="chapter-copy" data-reveal>
              <p>Kerala holds remarkable natural diversity — backwaters, beaches, hill ranges and forests — alongside a deep cultural heritage and a long tradition of hospitality.</p>
              <a className="tlink" href="#heritage"><span>A land of rivers, forests and open doors</span><Arrow /></a>
            </div>
            <Ph ratio="3x2" scene="tea" src={`${IMG}/chapter-why-kerala-inset.png`} alt="Sunrise over misty tea hills, Munnar" slot="Image — Sunrise over misty tea hills" meta="1500×1000 · 3:2" reveal className="chapter-inset chapter-inset-lg" />
          </div>
        </section>

        {/* 5 · Heritage: ancient ports + panorama */}
        <section className="section" id="heritage" aria-labelledby="herH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="herH" data-split>A land of rivers, forests and open doors</h2>
              <p className="lead" data-reveal>Kerala&apos;s heritage has been shaped by ancient trade and cultural exchange, Ayurveda and traditional wellness, spiritual traditions and indigenous knowledge, and hospitality and community living.</p>
            </div>
            <Ph ratio="21x9" scene="backwater" src={`${IMG}/heritage-panorama.jpg`} alt="Kodungallur, the Muziris heritage backwater village" slot="Panorama — Village on the backwaters" meta="2880×1234 · 21:9" inner={6} reveal />
            <div className="facts facts-words" data-reveal>
              <div className="fact"><span>Ancient trade hub</span><b>Muziris</b><span>A legendary port on the spice route and Kerala&apos;s gateway for many world religions</span></div>
              <div className="fact"><span>Ports of the Indian Ocean</span><b>Pattanam</b><span>Linked with Muziris on the project presentation&apos;s map of ancient trade ports, 100 BC – 300 AD</span></div>
            </div>
          </div>
        </section>

        {/* 5b · Kochi: Dutch and Jewish heritage */}
        <section className="section" id="kochi" aria-labelledby="kochiH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">Kochi</span>
            <div className="head-row">
              <h2 className="h-section" id="kochiH" data-split>Kochi&apos;s Dutch and Jewish heritage</h2>
              <p className="lead" data-reveal>Centuries of trade brought Dutch and Jewish communities to Kochi. The palaces and places of worship they left behind are still part of the city.</p>
            </div>
            <PhotoCards items={KOCHI} />
          </div>
        </section>

        {/* 6 · Responsible tourism principles (dark pledge list) */}
        <section className="dark section pledges" id="principles" aria-labelledby="prH">
          <div className="wrap">
            <span className="kicker">Responsible tourism principles</span>
            <div className="head-row">
              <h2 className="h-section" id="prH" data-split>Travel that gives back</h2>
              <p className="lead" data-reveal>The principles that guide how we plan, host and teach.</p>
            </div>
            <ol className="rows rows-static">
              {PRINCIPLES.map((p, i) => (
                <li key={p} className="row" data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-t">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7 · Tourism and livelihoods (four-column image grid) */}
        <section className="section" id="livelihoods" aria-labelledby="livH">
          <div className="wrap">
            <span className="label">Tourism and livelihoods</span>
            <div className="head-row">
              <h2 className="h-section" id="livH" data-split>Where tourism meets practical training</h2>
              <Link className="tlink" href="/programmes"><span>See the programmes</span><Arrow /></Link>
            </div>
            <p className="lead liv-lead" data-reveal>Responsible tourism creates many kinds of work. Chaitanya Keralam aims to connect these opportunities with practical training, so young people and communities can take part.</p>
            <ul className="cards cards-4 cards-all">
              {WORK.map((w) => (
                <li key={w.title} data-reveal>
                  <div className="card">
                    <Ph ratio="4x5" scene={w.scene} src={w.src} alt={w.alt} slot={`Portrait — ${w.alt}`} meta="1200×1500 · 4:5" />
                    <span className="label">{w.title}</span>
                    <h3>{w.text}</h3>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="btn btn-line view-all" href="/programmes"><span>See the programmes</span><Arrow /></Link>
          </div>
        </section>

        {/* 8 · Banner CTA */}
        <section className="banner" aria-labelledby="banH">
          <div className="ph">
            <div className="bg s-backwater" data-inner="8">
              <img src={`${IMG}/banner-sunrise.png`} alt="Kerala backwaters at sunrise" loading="lazy" decoding="async" />
            </div>
            <span className="slot" style={{ top: '22%' }}>[Full-screen image — Kerala backwaters at sunrise]<small>2560×1440</small></span>
          </div>
          <div className="wrap banner-in">
            <span className="kicker">Learn • Practise • Create • Lead</span>
            <h2 id="banH" data-chars>Skills you can use.</h2>
            <p className="lead">Turn a love of Kerala into skills you can use.</p>
            <Link className="btn btn-white" href="/programmes"><span>Explore Skill Development Programmes</span><Arrow /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
