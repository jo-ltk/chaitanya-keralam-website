'use client';

import { useEffect, useRef } from 'react';
import FindKerala from './maps/FindKerala';
import type { LandingContent } from '@/lib/landing-content';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { isExternal, LINKEDIN_URL } from '@/lib/site-settings';

declare global {
  interface Window {
    CK_MANUAL?: boolean;
    CKLanding?: { init: () => () => void; destroy: () => void };
    CK_FORM_ENDPOINT?: string;
    gsap?: any;
    ScrollTrigger?: any;
    Lenis?: any;
  }
}

function loadScript(src: string, fallback?: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (existing) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => {
      if (fallback) {
        const s2 = document.createElement('script');
        s2.src = fallback;
        s2.async = false;
        s2.onload = () => resolve();
        s2.onerror = () => resolve();
        document.head.appendChild(s2);
      } else resolve();
    };
    document.head.appendChild(s);
  });
}

export default function LandingPage({ content }: { content: LandingContent }) {
  const s = useSiteSettings();
  const ext = (url: string) => (isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {});
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    window.CK_MANUAL = true;

    (async () => {
      if (!window.gsap) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', '/vendor/gsap.min.js');
      if (!window.ScrollTrigger) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', '/vendor/ScrollTrigger.min.js');
      if (!window.Lenis) await loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js', '/vendor/lenis.min.js');
      if (!window.CKLanding) await loadScript('/js/main.js?v=2');
      if (cancelled) return;
      if (window.CKLanding) {
        window.CKLanding.destroy();
        const stop = window.CKLanding.init();
        cleanupRef.current = stop;
      }
    })();

    return () => {
      cancelled = true;
      if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    };
  }, []);

  const c = content;
  const chapterMeta = [
    { cls: 'ch-1', h: 'ch1', href: '#destinations', drift: '-6', mainBg: 's-backwater', insetBg: 's-coast' },
    { cls: 'ch-2', h: 'ch2', href: '#nature', drift: '6', mainBg: 's-ghats', insetBg: 's-falls' },
    { cls: 'ch-3', h: 'ch3', href: '#experiences', drift: '-6', mainBg: 's-culture', insetBg: 's-dusk' },
  ];
  const cardBg = ['s-backwater', 's-tea', 's-forest', 's-coast', 's-falls', 's-culture'];
  const rowBg = ['s-backwater', 's-temple', 's-dusk', 's-forest'];
  const storyBg = ['s-backwater', 's-tea', 's-dusk'];
  const tel = (v: string) => `tel:${v.replace(/[^\d+]/g, '')}`;
  const T = c.hero.titles.map((t) => t.value);
  const arrow = <span className="arrow" aria-hidden="true">→</span>;

  const renderChapter = (i: number) => {
    const m = chapterMeta[i];
    const ch = c.chapters[i];
    if (!ch) return null;
    return (
      <section className={`dark chapter ${m.cls}`} aria-labelledby={m.h}>
        <div className="wrap chapter-stage">
          <span className="kicker chapter-no">{ch.kicker}</span>
          <div className="ph r-4x5 chapter-media"><div className={`bg ${m.mainBg}`}><img src={ch.main.url} alt={ch.main.alt} loading="lazy" decoding="async" /></div></div>
          <h2 className="chapter-word" id={m.h} data-drift={m.drift}>{ch.word}</h2>
          <div className="chapter-copy" data-reveal>
            <p>{ch.text}</p>
            <a className="tlink" href={m.href}><span>{ch.link}</span>{arrow}</a>
          </div>
          <div className="ph r-3x2 chapter-inset" data-reveal-img><div className={`bg ${m.insetBg}`}><img src={ch.inset.url} alt={ch.inset.alt} loading="lazy" decoding="async" /></div></div>
        </div>
      </section>
    );
  };

  return (
    <>

<header className="nav" id="nav">
  <div className="wrap nav-in">
    <a className="brand" href="#top" aria-label="Chaitanya Keralam, home"><img src="/assets/logo.png" alt="" width="46" height="44" /><span>Chaitanya Keralam<small className="brand-tag">Eco Spiritual Peace Haven / India</small></span></a>
    <nav aria-label="Primary" style={{display: "contents"}}>
      <ul className="nav-links">
        {s.menu.links.map((l, i) => <li key={i}><a href={l.url}>{l.label}</a></li>)}
      </ul>
    </nav>
    <div className="nav-end">
      <a className="btn nav-cta" href={s.menu.buttonUrl}>{s.menu.button}</a>
      <button className="nav-menu" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i></button>
    </div>
  </div>
</header>
<div className="menu" id="menu" hidden>
  <ul>
    {s.menu.links.map((l, i) => <li key={i}><a href={l.url}>{l.label}</a></li>)}
  </ul>
  <p className="label">{s.menu.mobileTagline}</p>
</div>

<main id="top">

  <section className="hero" aria-roledescription="carousel" aria-label="Kerala">
    <div className="slide is-active" data-slide="0">
      <div className="ph"><div className="bg"><video className="hero-video" src={c.hero.video} autoPlay muted loop playsInline preload="auto" ref={(v) => { if (v && v.readyState >= 2) v.classList.add('is-ready'); }} onLoadedData={(e) => e.currentTarget.classList.add('is-ready')} /></div></div>
    </div>
    <div className="slide" data-slide="1">
      <div className="ph"><div className="bg s-ghats"><img src={c.hero.image1.url} alt={c.hero.image1.alt} loading="eager" decoding="async" width="2560" height="1440" /></div></div>
    </div>
    <div className="slide" data-slide="2">
      <div className="ph"><div className="bg s-culture"><img src={c.hero.image2.url} alt={c.hero.image2.alt} loading="eager" decoding="async" width="2560" height="1440" /></div></div>
    </div>

    <div className="hero-ui">
      <div className="wrap hero-grid">
        <div>
          <div className="hero-titles" aria-live="polite">
            <h1 className="hero-title is-active" data-title="0">{T[0]}</h1>
            <p className="hero-title" data-title="1" aria-hidden="true">{T[1]}</p>
            <p className="hero-title" data-title="2" aria-hidden="true">{T[2]}</p>
          </div>
          <div className="hero-sub">
            <a className="tlink" href="#nature"><span>{c.hero.cta}</span>{arrow}</a>
          </div>
          <div className="mobile-segs">
            <div className="segs" role="tablist" aria-label="Choose slide">
              {T.map((t, i) => (
                <button key={i} className="seg-hit" type="button" role="tab" aria-label={`Slide ${i + 1}: ${t.replace(/[.!]+$/, '')}`} data-go={i}><span className="seg"></span></button>
              ))}
            </div>
            <button className="hero-ctrl js-play" type="button" aria-label="Pause slideshow"><svg viewBox="0 0 24 24" aria-hidden="true"><path className="js-play-icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>
          </div>
        </div>
        <div className="hero-side">
          <button className="next" id="nextCard" type="button" aria-label="Next slide">
            <div className="ph"><div className="bg s-ghats" id="nextThumb"><img id="nextThumbImg" src={c.hero.image1.url} alt="" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} /></div></div>
            <span className="next-body">
              <span><span className="next-k" style={{display: "block"}}>Next</span><span className="next-t" id="nextTitle">{T[1].replace(/\.$/, '')}</span></span>
              <span className="segs" aria-hidden="true"><span className="seg"></span><span className="seg"></span><span className="seg"></span></span>
            </span>
          </button>
          <button className="hero-ctrl js-play" type="button" aria-label="Pause slideshow"><svg viewBox="0 0 24 24" aria-hidden="true"><path className="js-play-icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>
        </div>
      </div>
    </div>
  </section>

  <section className="dark statement">
    <div className="wrap">
      <span className="kicker">{c.statement.kicker}</span>
      <p id="statement">{c.statement.text}</p>
    </div>
  </section>

  {renderChapter(0)}

  <section className="section" id="destinations" aria-labelledby="destH">
    <div className="wrap">
      <div className="head-row">
        <h2 className="h-section" id="destH" data-split>{c.destinations.heading}</h2>
        <a className="tlink" href="#plan"><span>{c.destinations.link}</span>{arrow}</a>
      </div>
      <ul className="cards">
        {c.destinations.cards.map((card, i) => (
          <li key={i} data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className={`bg ${cardBg[i % cardBg.length]}`}><img src={card.image.url} alt={card.image.alt} loading="lazy" decoding="async" /></div></div><span className="label">{card.label}</span><h3>{card.title}</h3></a></li>
        ))}
      </ul>
      <a className="btn btn-line view-all" href="#plan"><span>{c.destinations.link}</span>{arrow}</a>
    </div>
  </section>

  {renderChapter(1)}

  <section className="section" id="nature" aria-labelledby="natH">
    <div className="wrap story-grid">
      <div className="story-text">
        <span className="label">{c.vision.label}</span>
        <h2 className="h-section" id="natH" data-split>{c.vision.heading}</h2>
        <p className="lead" data-reveal>{c.vision.lead}</p>
        <div className="facts" data-reveal>
          {c.vision.facts.map((f, i) => (
            <div key={i} className="fact"><b>{f.value}</b><span>{f.label}</span></div>
          ))}
        </div>
        <a className="btn btn-ink" href="#plan" data-reveal><span>{c.vision.button}</span>{arrow}</a>
      </div>
      <div className="story-media">
        <div className="ph r-4x5" data-reveal-img><div className="bg s-forest"><img src={c.vision.image1.url} alt={c.vision.image1.alt} loading="lazy" decoding="async" /></div></div>
        <div className="ph r-1x1" data-reveal-img><div className="bg s-falls"><img src={c.vision.image2.url} alt={c.vision.image2.alt} loading="lazy" decoding="async" /></div></div>
      </div>
    </div>
  </section>

  <section className="dark invitation" id="invitation" aria-labelledby="invH">
    <div className="wrap invitation-in">
      <span className="kicker">{c.invitation.kicker}</span>
      <h2 id="invH">{c.invitation.quote}</h2>
    </div>
  </section>

  <section className="section moment" aria-label={c.moment.image.alt} style={{paddingTop: 0, paddingBottom: 0}}>
    <div className="wrap">
      <figure>
        <div className="ph r-3x2" data-reveal-img><div className="bg s-tea" data-inner="6"><img src={c.moment.image.url} alt={c.moment.image.alt} loading="lazy" decoding="async" width="1516" height="1037" /></div></div>
        <figcaption data-reveal><span className="label">{c.moment.label}</span><p>{c.moment.caption}</p></figcaption>
      </figure>
    </div>
  </section>

  <section className="section" id="experiences" aria-labelledby="expH">
    <div className="wrap">
      <div className="head-row"><h2 className="h-section" id="expH" data-split>{c.values.heading}</h2><p className="lead" data-reveal>{c.values.lead}</p><a className="tlink" href="/values"><span>{c.values.link}</span>{arrow}</a></div>
      <ul className="rows">
        {c.values.rows.map((r, i) => (
          <li key={i}><a className="row" href="#plan" data-img={i}><span className="row-no">{String(i + 1).padStart(2, '0')}</span><div className="ph r-16x9"><div className={`bg ${rowBg[i % rowBg.length]}`}><img src={r.image.url} alt={r.image.alt} loading="lazy" decoding="async" /></div></div><span className="row-c"><span className="row-t">{r.title}</span><span className="row-d">{r.text}</span></span>{arrow}</a></li>
        ))}
      </ul>
      <aside className="roots-banner" data-reveal>
        <span className="roots-tamil" aria-hidden="true">{c.values.banner.tamil}</span>
        <div className="roots-copy"><p className="roots-kicker">{c.values.banner.kicker}</p><h3>{c.values.banner.heading}</h3><p>{c.values.banner.text}</p></div>
        <a className="btn btn-white" href={c.values.banner.url} target="_blank" rel="noopener noreferrer"><span>{c.values.banner.button}</span>{arrow}</a>
      </aside>
    </div>
    <div className="hover-img" id="hoverImg" aria-hidden="true">
      {c.values.rows.map((r, i) => (
        <div key={i} className="ph"><div className={`bg ${rowBg[i % rowBg.length]}`}><img src={r.image.url} alt={r.image.alt} loading="lazy" decoding="async" /></div></div>
      ))}
    </div>
  </section>

  {renderChapter(2)}

  <section className="section" id="stories" aria-labelledby="stH">
    <div className="wrap">
      <div className="head-row">
        <h2 className="h-section" id="stH" data-split>{c.stories.heading}</h2>
        <a className="tlink" href="#plan"><span>{c.stories.link}</span>{arrow}</a>
      </div>
      <ul className="stories">
        {c.stories.items.map((s, i) => (
          <li key={i} className="story-item" data-reveal><a href="#plan"><div className="ph r-3x2"><div className={`bg ${storyBg[i % storyBg.length]}`}><img src={s.image.url} alt={s.image.alt} loading="lazy" decoding="async" /></div></div><div><span className="label">{s.label}</span><h3>{s.title}</h3></div></a></li>
        ))}
      </ul>
    </div>
  </section>

  <section className="banner" aria-labelledby="banH">
    <div className="ph"><div className="bg s-backwater" data-inner="8"><img src={c.banner.image.url} alt={c.banner.image.alt} loading="lazy" decoding="async" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} /></div></div>
    <div className="wrap banner-in">
      <h2 id="banH" data-chars>{c.banner.heading}</h2>
      <a className="btn btn-white" href="#plan"><span>{c.banner.button}</span>{arrow}</a>
    </div>
  </section>

  <section className="section" id="maps" aria-labelledby="mapsH">
    <div className="wrap">
      <div className="head-row"><h2 className="h-section" id="mapsH" data-split>{c.maps.heading}</h2><p className="lead" data-reveal>{c.maps.lead}</p></div>
      <FindKerala />
      <p className="geo-credit">Map data: <a href="https://www.amcharts.com/svg-maps/" target="_blank" rel="noopener noreferrer">amCharts</a>, <a href="https://github.com/datameet/maps" target="_blank" rel="noopener noreferrer">DataMeet</a></p>
    </div>
  </section>

  <section className="dark official" id="official" aria-labelledby="offH">
    <div className="ph"><div className="bg s-coast" data-inner="6"><img src={c.official.image.url} alt={c.official.image.alt} loading="lazy" decoding="async" /></div></div>
    <div className="wrap official-in">
      <span className="kicker">{c.official.kicker}</span>
      <h2 id="offH">{c.official.heading}</h2>
      <div className="official-links">
        <a className="btn btn-white" href={c.official.link1Url} target="_blank" rel="noopener noreferrer"><span>{c.official.link1}</span>{arrow}</a>
        <a className="btn btn-white" href={c.official.link2Url} target="_blank" rel="noopener noreferrer"><span>{c.official.link2}</span>{arrow}</a>
      </div>
    </div>
  </section>

  <section className="section" id="plan" aria-labelledby="planH">
    <div className="wrap contact-grid">
      <div className="contact-intro">
        <h2 id="planH" data-split>{c.plan.heading}</h2>
        <p data-reveal>{c.plan.text}</p>
        <a className="guide" href={c.plan.guideUrl} data-reveal>
          <div className="ph"><div className="bg s-tea"></div></div>
          <span className="guide-t"><b>{c.plan.guideTitle}</b><span>PDF · [size] <span aria-hidden="true">↓</span></span></span>
        </a>
      </div>
      <div data-reveal>
        <div className="tabs" role="tablist" aria-label="Enquiry type">
          <button className="tab" type="button" role="tab" id="t-trip" aria-selected="true" aria-controls="enquiry" data-type="trip">Plan a journey</button>
          <button className="tab" type="button" role="tab" id="t-partner" aria-selected="false" aria-controls="enquiry" data-type="partner">Groups & organisations</button>
          <button className="tab" type="button" role="tab" id="t-general" aria-selected="false" aria-controls="enquiry" data-type="general">General enquiry</button>
        </div>
        <form className="form" id="enquiry" role="tabpanel" aria-labelledby="t-trip" noValidate>
          <div className="field"><label htmlFor="f-first">First name*</label><input id="f-first" name="firstName" autoComplete="given-name" placeholder="Enter first name" required /><span className="err" aria-live="polite"></span></div>
          <div className="field"><label htmlFor="f-last">Last name</label><input id="f-last" name="lastName" autoComplete="family-name" placeholder="Enter last name" /></div>
          <div className="field"><label htmlFor="f-email">Email*</label><input id="f-email" name="email" type="email" autoComplete="email" placeholder="Enter email" required /><span className="err" aria-live="polite"></span></div>
          <div className="field"><label htmlFor="f-phone">Phone number*</label>
            <div className="phone"><select id="f-code" name="countryCode" aria-label="Country code"><option value="+91">+91</option><option value="+971">+971</option><option value="+44">+44</option><option value="+1">+1</option><option value="+61">+61</option><option value="+49">+49</option></select><input id="f-phone" name="phone" type="tel" autoComplete="tel-national" placeholder="Phone number" required /></div>
            <span className="err" aria-live="polite"></span></div>
          <div className="field" data-for="trip"><label htmlFor="f-month">When would you like to travel?</label><select id="f-month" name="travelMonth"><option value="">Select month</option><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option><option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option><option>Not sure yet</option></select></div>
          <div className="field" data-for="trip"><label htmlFor="f-guests">Travellers</label><input id="f-guests" name="travellers" type="number" min="1" max="99" inputMode="numeric" placeholder="How many of you?" /></div>
          <div className="field full" data-for="partner" hidden><label htmlFor="f-org">Group or organisation name</label><input id="f-org" name="organisation" autoComplete="organization" placeholder="Temple, church, mosque, senior citizens or community group" /></div>
          <div className="field full"><span className="flabel"><label htmlFor="f-msg">Tell us more</label><span className="count" id="count">0 / 1000</span></span><textarea id="f-msg" name="message" maxLength={1000} placeholder="Places you would like to see, holy places to include, pace, food preferences, health needs: anything that helps us plan"></textarea></div>
          <div className="form-foot">
            <label className="consent"><input id="f-consent" type="checkbox" name="consent" /> <span>I agree to be contacted by phone or email about my enquiry.</span></label>
            <button className="btn btn-ink" type="submit"><span>Send enquiry</span><span className="arrow" aria-hidden="true">→</span></button>
          </div>
          <p className="form-note" id="formNote" role="status" hidden></p>
        </form>
      </div>
    </div>
  </section>
</main>

<footer className="dark foot" id="contact">
  <div className="wrap">
    <div className="foot-top">
      <div className="foot-brand">
        <a className="brand" href="#top"><img src="/assets/logo.png" alt="" width="60" height="58" style={{width: "60px"}} /><span>Chaitanya Keralam<small className="brand-tag">Eco Spiritual Peace Haven / India</small></span></a>
        <p className="foot-promise">{s.footer.promise.split('\n').map((line, i, a) => (<span key={i}>{line}{i < a.length - 1 && <br />}</span>))}</p>
        <p className="label">{s.footer.tagline}</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="#destinations">Places</a></li><li><a href="#nature">Our vision</a></li><li><a href="#experiences">Our values</a></li><li><a href="/values">What our values mean</a></li><li><a href="#maps">Maps</a></li><li><a href={c.official.link1Url} target="_blank" rel="noopener noreferrer">Kerala Tourism</a></li><li><a href={c.official.link2Url} target="_blank" rel="noopener noreferrer">{c.official.link2}</a></li></ul></div>
      <div><h4>Journeys</h4><ul><li><a href="#stories">Ayurveda & rest</a></li><li><a href="#stories">Family homestays</a></li><li><a href="#stories">Youth & community</a></li><li><a href="/programmes#admissions">Apply now</a></li></ul></div>
      <div className="foot-contact"><h4>Contact</h4><ul><li>{s.footer.address}</li>{s.footer.phones.map((p, i) => (<li key={`p${i}`}><a href={tel(p.value)}>{p.value}</a></li>))}{s.footer.emails.map((e, i) => (<li key={`e${i}`}><a href={`mailto:${e.value}`}>{e.value}</a></li>))}</ul></div>
      <div><h4>Follow</h4><ul className="social"><li><a href={s.social.instagramUrl} {...ext(s.social.instagramUrl)}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span>Instagram</span></a></li>{isExternal(s.social.youtubeUrl) && <li><a href={s.social.youtubeUrl} {...ext(s.social.youtubeUrl)}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3Z" /></svg><span>YouTube</span></a></li>}<li><a href={s.social.facebookUrl} {...ext(s.social.facebookUrl)}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8Z" /></svg><span>Facebook</span></a></li><li><a href={s.social.xUrl} {...ext(s.social.xUrl)}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.2 2.3h3.3l-7.2 8.2 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.3 2.3h6.8l4.7 6.2Zm-1.2 17.5h1.8L7.1 4.1h-2Z"/></svg><span>X</span></a></li><li><a href={LINKEDIN_URL} {...ext(LINKEDIN_URL)}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.9 8.7H3.5V20.5h3.4ZM5.2 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM20.5 13.8c0-3.2-1.7-5.3-4.6-5.3a3.9 3.9 0 0 0-3.5 1.9V8.7H9.1V20.5h3.4v-6.1c0-1.7.7-2.9 2.2-2.9s2.1 1.2 2.1 2.9v6.1h3.4Z"/></svg><span>LinkedIn</span></a></li></ul></div>
    </div>
    <p className="water" id="water" aria-hidden="true">Keralam</p>
    <div className="legal"><span>© {new Date().getFullYear()} Chaitanya Keralam</span><span><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/cms/login">Admin login</a></span></div>
  </div>
</footer>

    </>
  );
}
