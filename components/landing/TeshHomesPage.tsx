'use client';
/* TESH Homes, Careers & Partnerships, in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md).
   Its own composition: a giant-number opener, two tall home types, a dark pilot map of five districts,
   a career path, a partner grid and a tabbed enquiry block. */
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
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
const IMG = '/images/tesh-homes/';
const img = (name: string) => IMG + encodeURIComponent(name);

const DISTRICTS = ['Ernakulam', 'Kottayam', 'Alappuzha', 'Pathanamthitta', 'Idukki'];

const STEPS = [
  { t: 'Training', d: 'Practical training in tourism, hospitality, caregiving and global entrepreneurship.' },
  { t: 'Practical Experience', d: 'Hands-on experience through TESH Homes, training centres and community-based activities.' },
  { t: 'TESH Home Management', d: 'Trained youth may take up roles in managing TESH Homes as the proposed network develops.' },
  { t: 'Youth Entrepreneurship', d: 'Moving beyond employment to create sustainable enterprises connected to the TESH ecosystem.' },
];

const ROLES = ['Guest services', 'Hospitality operations', 'Tourism activities', 'Caregiving services*', 'Wellness & meditation activities', 'House and facility management', 'Sustainable agriculture', 'Digital / AI-enabled activities'];
const ENTERPRISES = ['Homestay / guesthouse enterprises', 'Sustainable / AI-enabled agriculture', 'Eco-tourism experiences', 'Tour & travel services', 'Wellness & spiritual tourism services', 'Local products and community enterprises', 'Caregiving services*', 'Digital tourism and service businesses'];

const PARTNERS = [
  { t: 'Homeowners', d: 'With suitable properties to contribute to the network.' },
  { t: 'Tourism & hospitality businesses', d: 'Offering exposure, partnership or collaboration.' },
  { t: 'Training institutions', d: 'Sharing expertise and learning pathways.' },
  { t: 'Community organisations', d: 'Connecting tourism with local life.' },
  { t: 'Potential project partners', d: 'Supporting the proposed TESH Homes network.' },
  { t: 'Individuals', d: 'Interested in youth entrepreneurship.' },
];

const CENTRES = ['Meditation', 'Mediation', 'Caregiver training / social service', 'AI-enabled agriculture training / farming', 'Composite skills training', 'Global entrepreneurship & e-commerce', 'Cultural activities & edutainment'];

/* Homeowner / partnership enquiry. Same behaviour as before the redesign: confirms on screen, nothing is sent yet.
   Any link to #homeowners or #partner-form on the page switches to the matching tab. */
function Enquiry() {
  const [tab, setTab] = useState<'home' | 'partner'>('home');
  const [hSent, setHSent] = useState(false);
  const [pSent, setPSent] = useState(false);
  const homeBtn = useRef<HTMLButtonElement>(null);
  const partBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const pick = (hash: string) => { if (hash === '#partner-form') setTab('partner'); if (hash === '#homeowners') setTab('home'); };
    pick(window.location.hash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href="#partner-form"], a[href="#homeowners"]');
      if (a) pick(a.getAttribute('href')!);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = tab === 'home' ? 'partner' : 'home';
    setTab(next);
    (next === 'home' ? homeBtn : partBtn).current?.focus();
  };
  const sendH = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setHSent(true); };
  const sendP = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setPSent(true); };

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Enquiry type">
        <button ref={homeBtn} className="tab" type="button" role="tab" id="t-home" aria-selected={tab === 'home'} aria-controls="enq-panel"
          tabIndex={tab === 'home' ? 0 : -1} onClick={() => setTab('home')} onKeyDown={onKey}>Homeowner enquiry</button>
        <button ref={partBtn} className="tab" type="button" role="tab" id="t-partner" aria-selected={tab === 'partner'} aria-controls="enq-panel"
          tabIndex={tab === 'partner' ? 0 : -1} onClick={() => setTab('partner')} onKeyDown={onKey}>Partnership enquiry</button>
      </div>

      {tab === 'home' ? (
        <form className="form" id="enq-panel" role="tabpanel" aria-labelledby="t-home" onSubmit={sendH} key="home">
          <div className="field full"><label htmlFor="h-name">Name</label><input id="h-name" name="name" autoComplete="name" placeholder="Your name" /></div>
          <div className="field"><label htmlFor="h-phone">Phone</label><input id="h-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" /></div>
          <div className="field"><label htmlFor="h-email">Email</label><input id="h-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" /></div>
          <div className="field full"><label htmlFor="h-loc">Property location</label><input id="h-loc" name="location" placeholder="Town, district" /></div>
          <div className="field"><label htmlFor="ptype">Property type</label>
            <select id="ptype" name="propertyType"><option>Independent house</option><option>Villa</option><option>Heritage home</option><option>Other</option></select></div>
          <div className="field"><label htmlFor="collab">Intended collaboration</label>
            <select id="collab" name="collaboration"><option>Guest house</option><option>Training centre</option><option>Activity centre</option><option>Not sure yet</option></select></div>
          <div className="field full"><label htmlFor="hmsg">Message</label><textarea id="hmsg" name="message" placeholder="Tell us about the property" /></div>
          <div className="form-foot"><span /><button className="btn btn-ink" type="submit"><span>Send homeowner enquiry</span><Arrow /></button></div>
          {hSent && <p className="form-note" role="status">Thank you — the project team will be in touch.</p>}
        </form>
      ) : (
        <form className="form" id="enq-panel" role="tabpanel" aria-labelledby="t-partner" onSubmit={sendP} key="partner">
          <div className="field"><label htmlFor="p-name">Contact name</label><input id="p-name" name="contactName" autoComplete="name" placeholder="Your name" /></div>
          <div className="field"><label htmlFor="p-org">Organisation</label><input id="p-org" name="organisation" autoComplete="organization" placeholder="Organisation name" /></div>
          <div className="field full"><label htmlFor="ptype2">Partnership type</label>
            <select id="ptype2" name="partnershipType"><option>Tourism or hospitality business</option><option>Training institution</option><option>Community organisation</option><option>Project partner</option><option>Individual</option></select></div>
          <div className="field"><label htmlFor="p-email">Email</label><input id="p-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" /></div>
          <div className="field"><label htmlFor="p-phone">Phone</label><input id="p-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" /></div>
          <div className="field full"><label htmlFor="pmsg">Collaboration details</label><textarea id="pmsg" name="message" placeholder="How would you like to collaborate?" /></div>
          <div className="form-foot"><span /><button className="btn btn-ink" type="submit"><span>Send partnership enquiry</span><Arrow /></button></div>
          {pSent && <p className="form-note" role="status">Thank you — the project team will be in touch.</p>}
        </form>
      )}
    </div>
  );
}

export default function TeshHomesPage() {
  const main = useRef<HTMLElement>(null);
  useCKMotion(main);

  return (
    <>
      <SiteNav overDarkHero />

      <main id="top" ref={main}>
        {/* 1 · Dark page hero */}
        <section className="page-hero" aria-labelledby="pageH">
          <div className="ph">
            <div className="bg s-culture" data-inner="6">
              <img src={img('Kerala Courtyard Villa in Morning Light.png')} alt="A Kerala courtyard villa in morning light" loading="eager" decoding="async" fetchPriority="high" />
            </div>
            <span className="slot">[Full-screen image — Kerala courtyard villa in morning light]<small>2560×1440</small></span>
          </div>
          <div className="wrap page-hero-in">
            <p className="label crumbs"><Link href="/">Home</Link> / TESH Homes, Careers &amp; Partnerships</p>
            <span className="kicker">TESH Homes · Proposed initiative</span>
            <h1 className="page-title wide" id="pageH" data-chars>Turning existing homes into opportunities for communities.</h1>
            <div className="page-hero-links">
              <a className="btn btn-white" href="#partner-form"><span>Partner With Us</span><Arrow /></a>
              <a className="tlink" href="#homeowners"><span>I have a property</span><Arrow /></a>
            </div>
          </div>
        </section>

        {/* 2 · Giant number opener */}
        <section className="section bignum" aria-labelledby="numH">
          <div className="wrap bignum-in">
            <div className="bignum-figure">
              <span className="label">Unutilized or underutilized houses in Kerala</span>
              <h2 className="bignum-n" id="numH" data-split>1.4 million</h2>
            </div>
            <p className="lead" data-reveal>Kerala has around 1.4 million unutilized or underutilized houses. TESH Homes is a proposed initiative to transform suitable existing homes into TSB and TESH Homes — a distributed network of international guest houses, training centres and activity centres connecting tourism, practical learning and youth entrepreneurship.</p>
          </div>
        </section>

        {/* 3 · Two home types */}
        <section className="section" id="types" aria-labelledby="typesH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">Proposed home types</span>
            <div className="head-row">
              <h2 className="h-section" id="typesH" data-split>Two ways a home can serve</h2>
              <p className="lead" data-reveal>Each proposed TESH Home would connect tourism, practical learning and community life.</p>
            </div>
            <ul className="home-types">
              <li data-reveal>
                <Ph ratio="4x5" scene="backwater" src={img('Kerala Backwaters Houseboat Serenity.png')} alt="A houseboat resting on calm Kerala backwaters" slot="Portrait — Guest house by the backwaters" meta="1200×1500 · 4:5" inner={5} />
                <span className="kicker">Type 01</span>
                <h3>Guest houses</h3>
                <p className="lead">For local, national and international travellers.</p>
                <p className="type-text">TSB &amp; TESH Guest Houses: international guest houses in suitable existing villas, welcoming travellers into Kerala homes.</p>
                <div className="type-fig"><b>5</b><span>per district in the proposed pilot</span><b>25</b><span>across five districts</span></div>
              </li>
              <li data-reveal>
                <Ph ratio="4x5" scene="ghats" src={img('Sunrise Tree Pose Over Misty Valley.png')} alt="Tree pose at sunrise above a misty valley" slot="Portrait — Training and activity centre" meta="1200×1500 · 4:5" inner={5} />
                <span className="kicker">Type 02</span>
                <h3>Training &amp; activity centres</h3>
                <p className="lead">Proposed centres for:</p>
                <p className="type-text">{CENTRES.join(' · ')}</p>
                <div className="type-fig"><b>5</b><span>per district in the proposed pilot</span><b>25</b><span>across five districts</span></div>
              </li>
            </ul>
          </div>
        </section>

        {/* 4 · Pilot across five districts (dark) */}
        <section className="dark section pilot" id="pilot" aria-labelledby="pilotH">
          <div className="wrap pilot-in">
            <div className="pilot-text">
              <span className="kicker">Central Travancore · Proposed pilot</span>
              <h2 className="h-section" id="pilotH" data-split>A proposed pilot across five districts</h2>
              <p className="lead" data-reveal>The Kerala Pilot Project proposes an initial implementation of 10 selected homes in each of five Central Travancore districts — 5 villas per district as TSB &amp; TESH Guest Houses and 5 as Training / Activity Centres. This is a proposed pilot, not a completed development.</p>
              <div className="facts" data-reveal>
                <div className="fact"><b>5</b><span>Districts</span></div>
                <div className="fact"><b>10</b><span>Homes per district</span></div>
                <div className="fact"><b>50</b><span>Homes in total</span></div>
              </div>
            </div>
            <div className="pilot-map" data-reveal role="img"
              aria-label="Diagram: 10 proposed homes in each of five districts — Ernakulam, Kottayam, Alappuzha, Pathanamthitta and Idukki — five guest houses and five training or activity centres in each">
              {DISTRICTS.map((d, i) => (
                <div className="drow" key={d}>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="drow-t">{d}</span>
                  <span className="dsq" aria-hidden="true">{Array.from({ length: 10 }, (_, k) => <i key={k} className={k < 5 ? 'f' : ''} />)}</span>
                </div>
              ))}
              <p className="dlegend"><span><i className="f" />Guest houses (5 per district)</span><span><i />Training / activity centres (5 per district)</span></p>
            </div>
          </div>
        </section>

        {/* 5 · Career pathway */}
        <section className="section" id="careers" aria-labelledby="carH">
          <div className="wrap">
            <div className="story-grid career-grid">
              <div className="story-media career-media">
                <Ph ratio="4x5" scene="culture" src={img('Collaborative Learning in a Sunlit Lab.png')} alt="Young people learning together in a sunlit lab" slot="Portrait — Young people learning together" meta="1200×1500 · 4:5" inner={5} reveal />
              </div>
              <div className="story-text">
                <span className="label">Career pathway</span>
                <h2 className="h-section" id="carH" data-split>From learning to leading</h2>
                <ol className="path-v">
                  {STEPS.map((s, i) => (
                    <li key={s.t} data-reveal>
                      <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                      <span className="path-v-c"><span className="path-v-t">{s.t}</span><span className="path-v-d">{s.d}</span></span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="career-more">
              <div data-reveal>
                <span className="kicker">TESH Home management roles</span>
                <p>{ROLES.join(' · ')}</p>
              </div>
              <div data-reveal>
                <span className="kicker">Examples of enterprises</span>
                <p>{ENTERPRISES.join(' · ')}</p>
              </div>
            </div>
            <div className="career-close" data-reveal>
              <p className="career-quote">Global citizenship through global entrepreneurship and e-commerce.</p>
              <p className="career-note">These are intended career and enterprise pathways, not guaranteed placements or earnings. *Subject to relevant requirements.</p>
            </div>
          </div>
        </section>

        {/* 6 · Partnership opportunities */}
        <section className="section" id="partner" aria-labelledby="partH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">Partnership opportunities</span>
            <div className="head-row">
              <h2 className="h-section" id="partH" data-split>Build this with us</h2>
              <p className="lead" data-reveal>We welcome enquiries from:</p>
            </div>
            <ol className="formats formats-3">
              {PARTNERS.map((p, i) => (
                <li key={p.t} data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7 · Enquiry */}
        <section className="section" id="homeowners" aria-labelledby="enqH" style={{ paddingTop: 0 }}>
          <span id="partner-form" className="anchor" />
          <div className="wrap contact-grid enq-grid">
            <div className="contact-intro">
              <span className="label">Get in touch</span>
              <h2 id="enqH" data-split>Start a conversation</h2>
              <div className="enq-brand" data-reveal>
                <div className="enq-brand-mark">
                  <img src="/assets/logo.png" alt="" width={72} height={70} />
                  <span>Chaitanya Keralam<small>TESH Homes · Proposed initiative</small></span>
                </div>
                <p className="enq-promise">Perhaps the only paradise on earth! One with nature. God&apos;s own country.</p>
              </div>
            </div>
            <div data-reveal><Enquiry /></div>
          </div>
        </section>

        {/* 8 · Banner CTA */}
        <section className="banner" aria-labelledby="banH">
          <div className="ph">
            <div className="bg s-backwater" data-inner="8">
              <img src={img('Kerala Backwaters at Golden Sunrise.png')} alt="Kerala backwaters at golden sunrise" loading="lazy" decoding="async" />
            </div>
            <span className="slot" style={{ top: '22%' }}>[Full-screen image — Kerala backwaters at golden sunrise]<small>2560×1440</small></span>
          </div>
          <div className="wrap banner-in">
            <span className="kicker">Learn • Practise • Create • Lead</span>
            <h2 id="banH" data-chars>Build it with us.</h2>
            <p className="lead">Help build a network connecting Kerala&apos;s homes, communities, tourism and youth opportunities.</p>
            <a className="btn btn-white" href="#partner-form"><span>Partner With Us</span><Arrow /></a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
