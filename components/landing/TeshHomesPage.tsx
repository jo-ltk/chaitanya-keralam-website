'use client';
/* TESH Homes, Careers & Partnerships, in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md).
   Its own composition: a giant-number opener, two tall home types, a dark pilot map of five districts,
   a career path, a partner grid and a tabbed enquiry block.
   Copy and images come from the Payload "TESH Homes page" global (lib/tesh-homes-content.ts). */
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';
import type { TeshHomesContent } from '@/lib/tesh-homes-content';

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
const join = (list: { value: string }[]) => list.map((x) => x.value).join(' · ');

/* Homeowner / partnership enquiry. Same behaviour as before the redesign: confirms on screen, nothing is sent yet.
   Any link to #homeowners or #partner-form on the page switches to the matching tab. */
function Enquiry({ e: q }: { e: TeshHomesContent['enquiry'] }) {
  const [tab, setTab] = useState<'home' | 'partner'>('home');
  const [hSent, setHSent] = useState(false);
  const [pSent, setPSent] = useState(false);
  const homeBtn = useRef<HTMLButtonElement>(null);
  const partBtn = useRef<HTMLButtonElement>(null);
  const h = q.homeowner;
  const p = q.partnership;

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
          tabIndex={tab === 'home' ? 0 : -1} onClick={() => setTab('home')} onKeyDown={onKey}>{h.tab}</button>
        <button ref={partBtn} className="tab" type="button" role="tab" id="t-partner" aria-selected={tab === 'partner'} aria-controls="enq-panel"
          tabIndex={tab === 'partner' ? 0 : -1} onClick={() => setTab('partner')} onKeyDown={onKey}>{p.tab}</button>
      </div>

      {tab === 'home' ? (
        <form className="form" id="enq-panel" role="tabpanel" aria-labelledby="t-home" onSubmit={sendH} key="home">
          <div className="field full"><label htmlFor="h-name">{h.nameLabel}</label><input id="h-name" name="name" autoComplete="name" placeholder={h.namePlaceholder} /></div>
          <div className="field"><label htmlFor="h-phone">{h.phoneLabel}</label><input id="h-phone" name="phone" type="tel" autoComplete="tel" placeholder={h.phonePlaceholder} /></div>
          <div className="field"><label htmlFor="h-email">{h.emailLabel}</label><input id="h-email" name="email" type="email" autoComplete="email" placeholder={h.emailPlaceholder} /></div>
          <div className="field full"><label htmlFor="h-loc">{h.locationLabel}</label><input id="h-loc" name="location" placeholder={h.locationPlaceholder} /></div>
          <div className="field"><label htmlFor="ptype">{h.propertyTypeLabel}</label>
            <select id="ptype" name="propertyType">{h.propertyTypes.map((o, i) => <option key={i}>{o.value}</option>)}</select></div>
          <div className="field"><label htmlFor="collab">{h.collaborationLabel}</label>
            <select id="collab" name="collaboration">{h.collaborations.map((o, i) => <option key={i}>{o.value}</option>)}</select></div>
          <div className="field full"><label htmlFor="hmsg">{h.messageLabel}</label><textarea id="hmsg" name="message" placeholder={h.messagePlaceholder} /></div>
          <div className="form-foot"><span /><button className="btn btn-ink" type="submit"><span>{h.button}</span><Arrow /></button></div>
          {hSent && <p className="form-note" role="status">{q.thanks}</p>}
        </form>
      ) : (
        <form className="form" id="enq-panel" role="tabpanel" aria-labelledby="t-partner" onSubmit={sendP} key="partner">
          <div className="field"><label htmlFor="p-name">{p.nameLabel}</label><input id="p-name" name="contactName" autoComplete="name" placeholder={p.namePlaceholder} /></div>
          <div className="field"><label htmlFor="p-org">{p.organisationLabel}</label><input id="p-org" name="organisation" autoComplete="organization" placeholder={p.organisationPlaceholder} /></div>
          <div className="field full"><label htmlFor="ptype2">{p.partnershipTypeLabel}</label>
            <select id="ptype2" name="partnershipType">{p.partnershipTypes.map((o, i) => <option key={i}>{o.value}</option>)}</select></div>
          <div className="field"><label htmlFor="p-email">{p.emailLabel}</label><input id="p-email" name="email" type="email" autoComplete="email" placeholder={p.emailPlaceholder} /></div>
          <div className="field"><label htmlFor="p-phone">{p.phoneLabel}</label><input id="p-phone" name="phone" type="tel" autoComplete="tel" placeholder={p.phonePlaceholder} /></div>
          <div className="field full"><label htmlFor="pmsg">{p.messageLabel}</label><textarea id="pmsg" name="message" placeholder={p.messagePlaceholder} /></div>
          <div className="form-foot"><span /><button className="btn btn-ink" type="submit"><span>{p.button}</span><Arrow /></button></div>
          {pSent && <p className="form-note" role="status">{q.thanks}</p>}
        </form>
      )}
    </div>
  );
}

export default function TeshHomesPage({ content: c }: { content: TeshHomesContent }) {
  const main = useRef<HTMLElement>(null);
  useCKMotion(main);
  const gh = c.homeTypes.guestHouses;
  const tc = c.homeTypes.centres;

  return (
    <>
      <SiteNav overDarkHero />

      <main id="top" ref={main}>
        {/* 1 · Dark page hero */}
        <section className="page-hero" aria-labelledby="pageH">
          <div className="ph">
            <div className="bg s-culture" data-inner="6">
              <img src={c.hero.image.url} alt={c.hero.image.alt} loading="eager" decoding="async" fetchPriority="high" />
            </div>
            <span className="slot">[Full-screen image — Kerala courtyard villa in morning light]<small>2560×1440</small></span>
          </div>
          <div className="wrap page-hero-in">
            <p className="label crumbs"><Link href="/">Home</Link> / TESH Homes, Careers &amp; Partnerships</p>
            <span className="kicker">{c.hero.kicker}</span>
            <h1 className="page-title wide" id="pageH" data-chars>{c.hero.title}</h1>
            <div className="page-hero-links">
              <a className="btn btn-white" href="#partner-form"><span>{c.hero.button}</span><Arrow /></a>
              <a className="tlink" href="#homeowners"><span>{c.hero.link}</span><Arrow /></a>
            </div>
          </div>
        </section>

        {/* 2 · Giant number opener */}
        <section className="section bignum" aria-labelledby="numH">
          <div className="wrap bignum-in">
            <div className="bignum-figure">
              <span className="label">{c.bigNumber.label}</span>
              <h2 className="bignum-n" id="numH" data-split>{c.bigNumber.number}</h2>
            </div>
            <p className="lead" data-reveal>{c.bigNumber.text}</p>
          </div>
        </section>

        {/* 3 · Two home types */}
        <section className="section" id="types" aria-labelledby="typesH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">{c.homeTypes.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="typesH" data-split>{c.homeTypes.heading}</h2>
              <p className="lead" data-reveal>{c.homeTypes.lead}</p>
            </div>
            <ul className="home-types">
              <li data-reveal>
                <Ph ratio="4x5" scene="backwater" src={gh.image.url} alt={gh.image.alt} slot="Portrait — Guest house by the backwaters" meta="1200×1500 · 4:5" inner={5} />
                <span className="kicker">{gh.kicker}</span>
                <h3>{gh.title}</h3>
                <p className="lead">{gh.lead}</p>
                <p className="type-text">{gh.text}</p>
                <div className="type-fig"><b>{gh.perDistrict}</b><span>{gh.perDistrictText}</span><b>{gh.total}</b><span>{gh.totalText}</span></div>
              </li>
              <li data-reveal>
                <Ph ratio="4x5" scene="ghats" src={tc.image.url} alt={tc.image.alt} slot="Portrait — Training and activity centre" meta="1200×1500 · 4:5" inner={5} />
                <span className="kicker">{tc.kicker}</span>
                <h3>{tc.title}</h3>
                <p className="lead">{tc.lead}</p>
                <p className="type-text">{join(tc.items)}</p>
                <div className="type-fig"><b>{tc.perDistrict}</b><span>{tc.perDistrictText}</span><b>{tc.total}</b><span>{tc.totalText}</span></div>
              </li>
            </ul>
          </div>
        </section>

        {/* 4 · Pilot across five districts (dark) */}
        <section className="dark section pilot" id="pilot" aria-labelledby="pilotH">
          <div className="wrap pilot-in">
            <div className="pilot-text">
              <span className="kicker">{c.pilot.kicker}</span>
              <h2 className="h-section" id="pilotH" data-split>{c.pilot.heading}</h2>
              <p className="lead" data-reveal>{c.pilot.lead}</p>
              <div className="facts" data-reveal>
                {c.pilot.facts.map((f, i) => (
                  <div className="fact" key={i}><b>{f.value}</b><span>{f.label}</span></div>
                ))}
              </div>
            </div>
            <div className="pilot-map" data-reveal role="img" aria-label={c.pilot.mapDescription}>
              {c.pilot.districts.map((d, i) => (
                <div className="drow" key={i}>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="drow-t">{d.value}</span>
                  <span className="dsq" aria-hidden="true">{Array.from({ length: 10 }, (_, k) => <i key={k} className={k < 5 ? 'f' : ''} />)}</span>
                </div>
              ))}
              <p className="dlegend"><span><i className="f" />{c.pilot.legendGuestHouses}</span><span><i />{c.pilot.legendCentres}</span></p>
            </div>
          </div>
        </section>

        {/* 5 · Career pathway */}
        <section className="section" id="careers" aria-labelledby="carH">
          <div className="wrap">
            <div className="story-grid career-grid">
              <div className="story-media career-media">
                <Ph ratio="4x5" scene="culture" src={c.careers.image.url} alt={c.careers.image.alt} slot="Portrait — Young people learning together" meta="1200×1500 · 4:5" inner={5} reveal />
              </div>
              <div className="story-text">
                <span className="label">{c.careers.label}</span>
                <h2 className="h-section" id="carH" data-split>{c.careers.heading}</h2>
                <ol className="path-v">
                  {c.careers.steps.map((s, i) => (
                    <li key={i} data-reveal>
                      <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                      <span className="path-v-c"><span className="path-v-t">{s.title}</span><span className="path-v-d">{s.text}</span></span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="career-more">
              <div data-reveal>
                <span className="kicker">{c.careers.rolesHeading}</span>
                <p>{join(c.careers.roles)}</p>
              </div>
              <div data-reveal>
                <span className="kicker">{c.careers.enterprisesHeading}</span>
                <p>{join(c.careers.enterprises)}</p>
              </div>
            </div>
            <div className="career-close" data-reveal>
              <p className="career-quote">{c.careers.quote}</p>
              <p className="career-note">{c.careers.note}</p>
            </div>
          </div>
        </section>

        {/* 6 · Partnership opportunities */}
        <section className="section" id="partner" aria-labelledby="partH" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <span className="label">{c.partners.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="partH" data-split>{c.partners.heading}</h2>
              <p className="lead" data-reveal>{c.partners.lead}</p>
            </div>
            <ol className="formats formats-3">
              {c.partners.items.map((p, i) => (
                <li key={i} data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
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
              <span className="label">{c.enquiry.label}</span>
              <h2 id="enqH" data-split>{c.enquiry.heading}</h2>
              <div className="enq-brand" data-reveal>
                <div className="enq-brand-mark">
                  <img src="/assets/logo.png" alt="" width={72} height={70} />
                  <span>{c.enquiry.brandName}<small>{c.enquiry.brandTagline}</small></span>
                </div>
                <p className="enq-promise">{c.enquiry.promise}</p>
              </div>
            </div>
            <div data-reveal><Enquiry e={c.enquiry} /></div>
          </div>
        </section>

        {/* 8 · Banner CTA */}
        <section className="banner" aria-labelledby="banH">
          <div className="ph">
            <div className="bg s-backwater" data-inner="8">
              <img src={c.banner.image.url} alt={c.banner.image.alt} loading="lazy" decoding="async" />
            </div>
            <span className="slot" style={{ top: '22%' }}>[Full-screen image — Kerala backwaters at golden sunrise]<small>2560×1440</small></span>
          </div>
          <div className="wrap banner-in">
            <span className="kicker">{c.banner.kicker}</span>
            <h2 id="banH" data-chars>{c.banner.heading}</h2>
            <p className="lead">{c.banner.lead}</p>
            <a className="btn btn-white" href="#partner-form"><span>{c.banner.button}</span><Arrow /></a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
