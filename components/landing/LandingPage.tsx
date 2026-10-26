'use client';

import { useEffect, useRef } from 'react';

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

export default function LandingPage() {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    window.CK_MANUAL = true;

    (async () => {
      if (!window.gsap) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', '/vendor/gsap.min.js');
      if (!window.ScrollTrigger) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', '/vendor/ScrollTrigger.min.js');
      if (!window.Lenis) await loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js', '/vendor/lenis.min.js');
      if (!window.CKLanding) await loadScript('/js/main.js');
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

  return (
    <>

<header className="nav" id="nav">
  <div className="wrap nav-in">
    <a className="brand" href="#top" aria-label="Chaitanya Keralam, home"><img src="/assets/logo.png" alt="" width="46" height="44" /><span>Chaitanya Keralam</span></a>
    <nav aria-label="Primary" style={{display: "contents"}}>
      <ul className="nav-links">
        <li><a href="#destinations">Places</a></li>
        <li><a href="#nature">Our vision</a></li>
        <li><a href="#experiences">Our values</a></li>
        <li><a href="#stories">Journeys</a></li>
      </ul>
    </nav>
    <div className="nav-end">
      <a className="btn nav-cta" href="#plan">Plan a visit</a>
      <button className="nav-menu" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i></button>
    </div>
  </div>
</header>
<div className="menu" id="menu" hidden>
  <ul>
    <li><a href="#destinations">Places</a></li>
    <li><a href="#nature">Our vision</a></li>
    <li><a href="#experiences">Our values</a></li>
    <li><a href="#stories">Journeys</a></li>
    <li><a href="#plan">Plan a visit</a></li>
  </ul>
  <p className="label">Perhaps the only paradise on earth. Come, stay a while.</p>
</div>

<main id="top">

  
  <section className="hero" aria-roledescription="carousel" aria-label="Kerala">
    <div className="slide is-active" data-slide="0">
      <div className="ph"><video className="hero-video" src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/kerala-aerial-landscape-1793006981218.mp4" autoPlay muted loop playsInline poster="/assets/images/gallery-hills.jpg" /><span className="slot">[Full-screen hero video — Kerala aerial landscape]<small>1920×1080 · muted loop · poster image</small></span></div>
    </div>
    <div className="slide" data-slide="1">
      <div className="ph"><div className="bg s-ghats"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/western-ghats-mist-1793007116438.jpg" alt="Western Ghats in mist" loading="eager" decoding="async" width="2560" height="1440" /></div><span className="slot">[Full-screen image — Western Ghats in mist]<small>2560×1440</small></span></div>
    </div>
    <div className="slide" data-slide="2">
      <div className="ph"><div className="bg s-culture"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/diya-temple-festival-1793008151792.png" alt="Festival lamps, temple and people" loading="eager" decoding="async" width="2560" height="1440" /></div><span className="slot">[Full-screen image — Festival lamps, temple and people]<small>2560×1440</small></span></div>
    </div>

    <div className="hero-ui">
      <div className="wrap hero-grid">
        <div>
          <div className="hero-titles" aria-live="polite">
            <h1 className="hero-title is-active" data-title="0">Perhaps the only paradise on earth.</h1>
            <p className="hero-title" data-title="1" aria-hidden="true">One with nature.</p>
            <p className="hero-title" data-title="2" aria-hidden="true">God's own country.</p>
          </div>
          <div className="hero-sub">
            <a className="tlink" href="#nature"><span>Begin your Kerala yatra</span><span className="arrow" aria-hidden="true">→</span></a>
          </div>
          <div className="mobile-segs">
            <div className="segs" role="tablist" aria-label="Choose slide">
              <button className="seg-hit" type="button" role="tab" aria-label="Slide 1: Perhaps the only paradise on earth" data-go="0"><span className="seg"></span></button>
              <button className="seg-hit" type="button" role="tab" aria-label="Slide 2: One with nature" data-go="1"><span className="seg"></span></button>
              <button className="seg-hit" type="button" role="tab" aria-label="Slide 3: God's own country" data-go="2"><span className="seg"></span></button>
            </div>
            <button className="hero-ctrl js-play" type="button" aria-label="Pause slideshow"><svg viewBox="0 0 24 24" aria-hidden="true"><path className="js-play-icon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>
          </div>
        </div>
        <div className="hero-side">
          <button className="next" id="nextCard" type="button" aria-label="Next slide">
            <div className="ph"><div className="bg s-ghats" id="nextThumb"><img id="nextThumbImg" src="/assets/images/tile-western-ghats.png" alt="" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} /></div></div>
            <span className="next-body">
              <span><span className="next-k" style={{display: "block"}}>Next</span><span className="next-t" id="nextTitle">One with nature</span></span>
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
      <span className="kicker">Chaitanya Keralam</span>
      <p id="statement">Temple bells at dawn, church bells at noon, the azaan at dusk, all under one sky. In Kerala, faith means living in harmony with nature and with one another.</p>
    </div>
  </section>

  
  <section className="dark chapter ch-1" aria-labelledby="ch1">
    <div className="wrap chapter-stage">
      <span className="kicker chapter-no">01 · Perhaps the only paradise on earth</span>
      <div className="ph r-4x5 chapter-media"><div className="bg s-backwater"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/houseboat-backwaters-1793008580480.png" alt="Houseboat on still backwaters" loading="lazy" decoding="async" /></div><span className="slot">[Portrait — Houseboat on still backwaters]<small>1200×1500 · 4:5</small></span></div>
      <h2 className="chapter-word" id="ch1" data-drift="-6">Paradise</h2>
      <div className="chapter-copy" data-reveal>
        <p>The Kerala of the stories you grew up with: misty hills, coconut groves, backwaters and quiet village temples. Come and see it for yourself, at your own pace.</p>
        <a className="tlink" href="#destinations"><span>See the places</span><span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <div className="ph r-3x2 chapter-inset" data-reveal-img><div className="bg s-coast"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/coconut-grove-water-1793007847586.jpg" alt="Coconut grove by the water" loading="lazy" decoding="async" /></div><span className="slot">[Image — Coconut grove by the water]<small>1500×1000 · 3:2</small></span></div>
    </div>
  </section>

  
  <section className="section" id="destinations" aria-labelledby="destH">
    <div className="wrap">
      <div className="head-row">
        <h2 className="h-section" id="destH" data-split>Places that stay with you</h2>
        <a className="tlink" href="#plan"><span>All destinations</span><span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <ul className="cards">
        <li data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className="bg s-backwater"><img src="/assets/images/gallery-backwaters.jpg" alt="Alappuzha backwaters" loading="lazy" decoding="async" /></div><span className="slot">[Image — Alappuzha backwaters]<small>1600×1600 · 1:1</small></span></div><span className="label">Backwaters</span><h3>Alappuzha: a houseboat, a cup of chai and the backwaters drifting by</h3></a></li>
        <li data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className="bg s-tea"><img src="/assets/images/munnar-tea.jpg" alt="Munnar tea hills" loading="lazy" decoding="async" /></div><span className="slot">[Image — Munnar tea hills]<small>1600×1600 · 1:1</small></span></div><span className="label">Hills</span><h3>Munnar: tea gardens, cool air and morning walks you will remember for years</h3></a></li>
        <li data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className="bg s-forest"><img src="/assets/images/gallery-rainforest.jpg" alt="Wayanad forest" loading="lazy" decoding="async" /></div><span className="slot">[Image — Wayanad forest]<small>1600×1600 · 1:1</small></span></div><span className="label">Forests</span><h3>Wayanad: forest paths, spice gardens and quiet hill villages</h3></a></li>
        <li data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className="bg s-coast"><img src="/assets/images/gallery-coast.jpg" alt="Varkala cliffs and beach" loading="lazy" decoding="async" /></div><span className="slot">[Image — Varkala cliffs and beach]<small>1600×1600 · 1:1</small></span></div><span className="label">Coast</span><h3>Varkala: sea breeze on the red cliffs and a calm evening by the shore</h3></a></li>
        <li data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className="bg s-falls"><img src="/assets/images/athirappilly.jpg" alt="Athirappilly falls" loading="lazy" decoding="async" /></div><span className="slot">[Image — Athirappilly falls]<small>1600×1600 · 1:1</small></span></div><span className="label">Waterfalls</span><h3>Athirappilly: feel the cool spray of the great waterfall</h3></a></li>
        <li data-reveal><a className="card" href="#plan"><div className="ph r-1x1"><div className="bg s-culture"><img src="/assets/images/gallery-culture.jpg" alt="Fort Kochi streets" loading="lazy" decoding="async" /></div><span className="slot">[Image — Fort Kochi streets]<small>1600×1600 · 1:1</small></span></div><span className="label">Heritage</span><h3>Kochi: old churches, spice markets and the Chinese fishing nets at sunset</h3></a></li>
      </ul>
      <a className="btn btn-line view-all" href="#plan"><span>All destinations</span><span className="arrow" aria-hidden="true">→</span></a>
    </div>
  </section>

  
  <section className="dark chapter ch-2" aria-labelledby="ch2">
    <div className="wrap chapter-stage">
      <span className="kicker chapter-no">02 · One with nature</span>
      <div className="ph r-4x5 chapter-media"><div className="bg s-ghats"><img src="/assets/images/tile-western-ghats.png" alt="Western Ghats Silent Valley" loading="lazy" decoding="async" /></div><span className="slot">[Portrait — Western Ghats, Silent Valley]<small>1200×1500 · 4:5</small></span></div>
      <h2 className="chapter-word" id="ch2" data-drift="6">Nature</h2>
      <div className="chapter-copy" data-reveal>
        <p>Wake to birdsong, walk beneath old trees and breathe the clean air of the Western Ghats. Here, nature restores you slowly and gently.</p>
        <a className="tlink" href="#nature"><span>Travel gently with us</span><span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <div className="ph r-3x2 chapter-inset" data-reveal-img><div className="bg s-falls"><img src="/assets/images/gallery-waterfalls.jpg" alt="Waterfall in the forest" loading="lazy" decoding="async" /></div><span className="slot">[Image — Waterfall in the forest]<small>1500×1000 · 3:2</small></span></div>
    </div>
  </section>

  
  <section className="section" id="nature" aria-labelledby="natH">
    <div className="wrap story-grid">
      <div className="story-text">
        <span className="label">Our vision</span>
        <h2 className="h-section" id="natH" data-split>Eco-Spiritual Peace Tourism</h2>
        <p className="lead" data-reveal>A yatra for today. See Kerala's beauty, visit holy places of every faith, rest close to nature and return home lighter. Every journey is planned with care for the land and for the people who welcome you.</p>
        <div className="facts" data-reveal>
          <div className="fact"><b>44</b><span>Rivers</span></div>
          <div className="fact"><b>14</b><span>Districts</span></div>
          <div className="fact"><b>1</b><span>Western Ghats, a UNESCO World Heritage range</span></div>
        </div>
        <a className="btn btn-ink" href="#plan" data-reveal><span>Our vision</span><span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <div className="story-media">
        <div className="ph r-4x5" data-reveal-img><div className="bg s-forest"><img src="/assets/images/forest-path.jpg" alt="Forest path morning light" loading="lazy" decoding="async" /></div><span className="slot">[Image — Forest path, morning light]<small>1200×1500</small></span></div>
        <div className="ph r-1x1" data-reveal-img><div className="bg s-falls"><img src="/assets/images/gallery-rainforest.jpg" alt="Rain on leaves" loading="lazy" decoding="async" /></div><span className="slot">[Image — Rain on leaves]<small>1000×1000</small></span></div>
      </div>
    </div>
  </section>

  
  <section className="section" id="experiences" aria-labelledby="expH" style={{paddingTop: 0}}>
    <div className="wrap">
      <div className="head-row"><h2 className="h-section" id="expH" data-split>Values our elders lived by</h2><p className="lead" data-reveal>Four simple values for a balanced life, and the ones we hope to pass on to our children.</p></div>
      <ul className="rows">
        <li><a className="row" href="#plan" data-img="0"><span className="row-no">01</span><div className="ph r-16x9"><div className="bg s-backwater"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/anbu-love-compassion-1793008816345.png" alt="Shared meal, hands and banana leaf" loading="lazy" decoding="async" /></div><span className="slot">[Image — Shared meal, hands and banana leaf]<small>1600×900</small></span></div><span className="row-t">Anbu · Love and compassion</span><span className="arrow" aria-hidden="true">→</span></a></li>
        <li><a className="row" href="#plan" data-img="1"><span className="row-no">02</span><div className="ph r-16x9"><div className="bg s-temple"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/unmai-truth-integrity-1793009294446.png" alt="Still water reflecting the sky" loading="lazy" decoding="async" /></div><span className="slot">[Image — Still water reflecting the sky]<small>1600×900</small></span></div><span className="row-t">Unmai · Truth and integrity</span><span className="arrow" aria-hidden="true">→</span></a></li>
        <li><a className="row" href="#plan" data-img="2"><span className="row-no">03</span><div className="ph r-16x9"><div className="bg s-dusk"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/patru-commitment-devotion-1793009464320.png" alt="Lighting the lamp at dawn" loading="lazy" decoding="async" /></div><span className="slot">[Image — Lighting the lamp at dawn]<small>1600×900</small></span></div><span className="row-t">Patru · Commitment and devotion</span><span className="arrow" aria-hidden="true">→</span></a></li>
        <li><a className="row" href="#plan" data-img="3"><span className="row-no">04</span><div className="ph r-16x9"><div className="bg s-forest"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/pagutharivu-rational-thinking-1793009636243.png" alt="An elder and a young person in conversation" loading="lazy" decoding="async" /></div><span className="slot">[Image — An elder and a young person in conversation]<small>1600×900</small></span></div><span className="row-t">Pagutharivu · Rational thinking and discernment</span><span className="arrow" aria-hidden="true">→</span></a></li>
      </ul>
    </div>
    <div className="hover-img" id="hoverImg" aria-hidden="true">
      <div className="ph"><div className="bg s-backwater"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/anbu-love-compassion-1793008816345.png" alt="Shared meal, hands and banana leaf" loading="lazy" decoding="async" /></div></div><div className="ph"><div className="bg s-temple"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/unmai-truth-integrity-1793009294446.png" alt="Still water reflecting the sky" loading="lazy" decoding="async" /></div></div><div className="ph"><div className="bg s-dusk"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/patru-commitment-devotion-1793009464320.png" alt="Lighting the lamp at dawn" loading="lazy" decoding="async" /></div></div>
      <div className="ph"><div className="bg s-forest"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/pagutharivu-rational-thinking-1793009636243.png" alt="An elder and a young person in conversation" loading="lazy" decoding="async" /></div></div>
    </div>
  </section>

  
  <section className="dark chapter ch-3" aria-labelledby="ch3">
    <div className="wrap chapter-stage">
      <span className="kicker chapter-no">03 · God's own country</span>
      <div className="ph r-4x5 chapter-media"><div className="bg s-culture"><img src="/assets/images/temple-lamps.png" alt="Lamps at a temple festival" loading="lazy" decoding="async" /></div><span className="slot">[Portrait — Lamps at a temple festival]<small>1200×1500 · 4:5</small></span></div>
      <h2 className="chapter-word" id="ch3" data-drift="-6">God's own</h2>
      <div className="chapter-copy" data-reveal>
        <p>Onam, Christmas and Eid, celebrated together by neighbours of every faith. Temples, churches and mosques on the same street. This is God's own country.</p>
        <a className="tlink" href="#experiences"><span>Our values</span><span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <div className="ph r-3x2 chapter-inset" data-reveal-img><div className="bg s-dusk"></div><span className="slot">[Image — Oil lamps and flowers]<small>1500×1000 · 3:2</small></span></div>
    </div>
  </section>

  
  <section className="section" id="stories" aria-labelledby="stH">
    <div className="wrap">
      <div className="head-row">
        <h2 className="h-section" id="stH" data-split>Journeys with meaning</h2>
        <a className="tlink" href="#plan"><span>Plan a journey</span><span className="arrow" aria-hidden="true">→</span></a>
      </div>
      <ul className="stories">
        <li className="story-item" data-reveal><a href="#plan"><div className="ph r-3x2"><div className="bg s-backwater"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/ayurveda-foot-massage-1793010154542.png" alt="Ayurveda and yoga by the water" loading="lazy" decoding="async" /></div><span className="slot">[Image — Ayurveda and yoga by the water]<small>1500×1000</small></span></div><div><span className="label">Ayurveda & rest</span><h3>Ayurveda the traditional way: herbal oils, simple food and quiet, restful days</h3></div></a></li>
        <li className="story-item" data-reveal><a href="#plan"><div className="ph r-3x2"><div className="bg s-tea"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/family-homestay-1793010296886.png" alt="Visitors with a local family homestay" loading="lazy" decoding="async" /></div><span className="slot">[Image — Visitors with a local family, homestay]<small>1500×1000</small></span></div><div><span className="label">Family homestays</span><h3>Stay with Kerala families, eat a sadya on a banana leaf and leave the land as you found it</h3></div></a></li>
        <li className="story-item" data-reveal><a href="#plan"><div className="ph r-3x2"><div className="bg s-dusk"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/youth-community-1793010493930.png" alt="Young people training in hospitality" loading="lazy" decoding="async" /></div><span className="slot">[Image — Young people training in hospitality]<small>1500×1000</small></span></div><div><span className="label">Youth & community</span><h3>Your journey helps young people of Kerala build careers in hospitality and tourism</h3></div></a></li>
      </ul>
    </div>
  </section>

  
  <section className="banner" aria-labelledby="banH">
    <div className="ph"><div className="bg s-backwater" data-inner="8"><img src="https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads/sunset-backwaters-1793010741262.png" alt="Sunset over the backwaters" loading="lazy" decoding="async" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} /></div><span className="slot" style={{top: "22%"}}>[Full-screen image — Sunset over the backwaters]<small>2560×1440</small></span></div>
    <div className="wrap banner-in">
      <h2 id="banH" data-chars>God's own country awaits.</h2>
      <a className="btn btn-white" href="#plan"><span>Plan a journey for your family</span><span className="arrow" aria-hidden="true">→</span></a>
    </div>
  </section>

  
  <section className="section" id="plan" aria-labelledby="planH">
    <div className="wrap contact-grid">
      <div className="contact-intro">
        <h2 id="planH" data-split>Let us plan your Kerala journey</h2>
        <p data-reveal>Travelling with family, as a couple, or on a pilgrimage? Tell us what you have in mind. We will plan an unhurried journey with comfortable stays, good food and time to rest.</p>
        <a className="guide" href="assets/chaitanya-keralam-guide.pdf" data-reveal>
          <div className="ph"><div className="bg s-tea"></div></div>
          <span className="guide-t"><b>Download our Kerala family travel guide</b><span>PDF · [size] <span aria-hidden="true">↓</span></span></span>
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

<footer className="dark foot">
  <div className="wrap">
    <div className="foot-top">
      <div className="foot-brand">
        <a className="brand" href="#top"><img src="/assets/logo.png" alt="" width="60" height="58" style={{width: "60px"}} /><span>Chaitanya Keralam</span></a>
        <p className="foot-promise">Perhaps the only paradise on earth.<br />One with nature.<br />God's own country.</p>
        <p className="label">Eco-Spiritual Peace Tourism · Anbu · Unmai · Patru · Pagutharivu</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="#destinations">Places</a></li><li><a href="#nature">Our vision</a></li><li><a href="#experiences">Our values</a></li></ul></div>
      <div><h4>Journeys</h4><ul><li><a href="#stories">Ayurveda & rest</a></li><li><a href="#stories">Family homestays</a></li><li><a href="#stories">Youth & community</a></li><li><a href="#plan">Plan a visit</a></li></ul></div>
      <div><h4>Follow</h4><ul><li><a href="#plan">Instagram</a></li><li><a href="#plan">YouTube</a></li><li><a href="#plan">Facebook</a></li></ul></div>
    </div>
    <p className="water" id="water" aria-hidden="true">Keralam</p>
    <div className="legal"><span>© [Year] Chaitanya Keralam</span><span>Privacy · Terms</span></div>
  </div>
</footer>

    </>
  );
}
