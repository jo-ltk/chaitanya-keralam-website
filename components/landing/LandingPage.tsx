'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    CK_MANUAL?: boolean;
    CKLanding?: { init: () => () => void; destroy: () => void };
    gsap?: any;
    ScrollTrigger?: any;
    Lenis?: any;
  }
}

function loadScript(src: string, fallback?: string): Promise<void> {
  return new Promise((resolve) => {
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
      } else {
        resolve();
      }
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
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', '/vendor/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', '/vendor/ScrollTrigger.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js', '/vendor/lenis.min.js');
      await loadScript('/js/main.js');
      if (cancelled) return;
      if (window.CKLanding) {
        const stop = window.CKLanding.init();
        cleanupRef.current = stop;
      }
    })();

    return () => {
      cancelled = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true"></div>

      <header className="nav" id="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top" aria-label="Chaitanya Keralam home"><img src="/assets/logo.png" alt="" /><span>Chaitanya Keralam</span></a>
          <nav aria-label="Primary">
            <ul className="links">
              <li><a href="#pillars">Where to go</a></li>
              <li><a href="#gallery">Experiences</a></li>
              <li><a href="#places">Stories</a></li>
              <li><a href="#plan">Plan your trip</a></li>
            </ul>
          </nav>
          <div className="nav-end">
            <a className="btn btn-solid btn-sm nav-cta" href="#plan">Plan a visit</a>
            <button className="disc menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg></button>
          </div>
        </div>
      </header>
      <div className="menu" id="menu" hidden>
        <ul>
          <li><a href="#pillars">Where to go</a></li>
          <li><a href="#gallery">Experiences</a></li>
          <li><a href="#places">Stories</a></li>
          <li><a href="#plan">Plan your trip</a></li>
        </ul>
      </div>

      <main id="top">
        {/* 1 · HERO */}
        <section className="hero" aria-label="Welcome to Kerala">
          <div className="ph" id="heroMedia">
            <div className="bg s-backwater"><video src="/assets/video/kerala-aerial.mp4" autoPlay muted loop playsInline /></div>
            <span className="frame"></span>
            <span className="label">[Full-screen hero video — Kerala aerial landscape]<small>Muted loop · 1920×1080 min · poster image fallback</small></span>
          </div>
          <div className="wrap hero-body">
            <div>
              <p className="eyebrow" data-fade>God&apos;s own country</p>
              <h1 id="heroTitle"><span className="line">Enter</span> <span className="line soft">Kerala</span></h1>
              <div className="hero-actions" data-fade>
                <a className="btn btn-solid" href="#plan"><span>Plan your journey</span><span className="arr" aria-hidden="true">→</span></a>
                <a className="link" href="#pano"><span>Watch the film</span><span aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="hero-side" data-fade>
              <button className="disc" id="playBtn" type="button" aria-label="Pause background motion"><svg viewBox="0 0 24 24" aria-hidden="true"><path id="playIcon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg></button>
            </div>
          </div>
          <a className="cue" href="#manifesto">Scroll<i aria-hidden="true"></i></a>
        </section>
        {/* 2 · MANIFESTO */}
        <section className="manifesto wrap" id="manifesto">
          <p id="manifestoText">Where forests, faiths and shorelines meet, the land breathes slowly.</p>
        </section>

        {/* 3 · PANORAMA REVEAL */}
        <section className="pano" id="pano" aria-label="Backwaters">
          <div className="ph" id="panoMedia">
            <div className="bg s-dusk"><img src="/assets/images/panorama-dusk.jpg" alt="Kerala backwaters at dusk" /></div>
            <span className="frame"></span>
            <span className="label">[Panoramic image — Kerala backwaters at dusk]<small>2880×1600 · full-bleed · houseboat, palms, still water</small></span>
          </div>
          <div className="wrap pano-cap">
            <h2 className="split-lines">The backwaters</h2>
            <span className="eyebrow">Alappuzha · Kumarakom</span>
          </div>
        </section>

        {/* 4 · THE FOUR PILLARS */}
        <section className="pillars" id="pillars" aria-label="Ecology, Spirituality, Peace, Tourism">
          <div className="pillars-stage">
            <article className="pl" data-i="0">
              <div className="ph"><div className="bg s-ghats"><img src="/assets/images/pillar-ecology.jpg" alt="Western Ghats in mist" /></div></div>
              <div className="wrap pl-text"><p className="pl-index eyebrow">01 · Ecology</p><h2 className="pl-word">Ecology</h2><p className="pl-line">Forests, rivers and hills that breathe.</p></div>
            </article>
            <article className="pl" data-i="1">
              <div className="ph"><div className="bg s-temple"><img src="/assets/images/pillar-stillness.jpg" alt="Silent Valley forest, morning light" /></div></div>
              <div className="wrap pl-text"><p className="pl-index eyebrow">02 · Spirituality</p><h2 className="pl-word">Stillness</h2><p className="pl-line">Quiet water, deep forest, a slower pulse.</p></div>
            </article>
            <article className="pl" data-i="2">
              <div className="ph"><div className="bg s-coast"><img src="/assets/images/pillar-harmony.avif" alt="Kerala's religious and cultural harmony" /></div></div>
              <div className="wrap pl-text"><p className="pl-index eyebrow">03 · Peace</p><h2 className="pl-word">Harmony</h2><p className="pl-line">Many faiths, one shore.</p></div>
            </article>
            <article className="pl" data-i="3">
              <div className="ph"><div className="bg s-culture"><img src="/assets/images/pillar-tourism.webp" alt="Local people and cultural experiences" /></div></div>
              <div className="wrap pl-text"><p className="pl-index eyebrow">04 · Tourism</p><h2 className="pl-word">Welcome</h2><p className="pl-line">A seat at every table.</p></div>
            </article>
            <nav className="pl-hud" aria-label="Pillars">
              <button type="button" data-go="0" className="on">Ecology</button>
              <button type="button" data-go="1">Spirituality</button>
              <button type="button" data-go="2">Peace</button>
              <button type="button" data-go="3">Tourism</button>
            </nav>
          </div>
        </section>
        {/* 5 · GIANT WORD + IMAGES */}
        <section className="wordsec" aria-label="Western Ghats">
          <p className="bigword" id="word1" aria-hidden="true">Western Ghats</p>
          <p className="bigword row2" id="word2" aria-hidden="true">Monsoon</p>
          <div className="ph a" data-speed="-18"><div className="bg s-tea"><img src="/assets/images/munnar-tea.jpg" alt="Munnar tea hills" /></div></div>
          <div className="ph b" data-speed="14"><div className="bg s-falls"><img src="/assets/images/athirappilly.jpg" alt="Athirappilly waterfalls" /></div></div>
        </section>

        {/* 6 · HORIZONTAL GALLERY */}
        <section className="gallery" id="gallery" aria-label="Experiences">
          <div className="wrap gal-head">
            <h2 className="split-lines">Ways to see Kerala</h2>
            <span className="eyebrow">Scroll →</span>
          </div>
          <div className="wrap">
            <div className="track" id="track">
              <figure className="card"><div className="ph"><div className="bg s-backwater"><img src="/assets/images/gallery-backwaters.jpg" alt="Houseboat on Vembanad Lake" /></div></div><p><span>Backwaters</span><span>Alappuzha</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-forest"><img src="/assets/images/gallery-rainforest.jpg" alt="Silent Valley forest" /></div></div><p><span>Rainforest</span><span>Palakkad</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-falls"><img src="/assets/images/gallery-waterfalls.jpg" alt="Athirappilly waterfalls" /></div></div><p><span>Waterfalls</span><span>Thrissur</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-coast"><img src="/assets/images/gallery-coast.jpg" alt="Varkala cliffs and beach" /></div></div><p><span>Coast</span><span>Varkala</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-tea"><img src="/assets/images/gallery-hills.jpg" alt="Munnar tea estates" /></div></div><p><span>Hills</span><span>Munnar</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-culture"><img src="/assets/images/gallery-culture.jpg" alt="Kathakali performer" /></div></div><p><span>Culture</span><span>Kochi</span></p></figure>
            </div>
          </div>
        </section>
        {/* 7 · SPLIT (spirituality) */}
        <section className="split" aria-label="Stillness">
          <div className="ph" data-inner="12"><div className="bg s-temple"><img src="/assets/images/river-quiet.png" alt="Dawn by the river, quiet reflection" /></div></div>
          <div className="wrap split-text">
            <p className="eyebrow">Spirituality</p>
            <h2 className="split-lines">Slow down.<br />Listen.</h2>
            <div className="ph" data-speed="-10"><div className="bg s-forest"></div><span className="frame"></span><span className="label">[Image — Forest path]<small>1200×1200</small></span></div>
          </div>
        </section>

        {/* 8 · COLLAGE (peace) */}
        <section className="collage" aria-label="Harmony">
          <div className="wrap collage-grid">
            <h2 className="split-lines">Many faiths, one shore</h2>
            <div className="ph p1" data-inner="10"><div className="bg s-coast"></div><span className="frame"></span><span className="label">[Large image — Festival crowd by the sea]<small>2000×1500 · 4:3</small></span></div>
            <div className="ph p2" data-speed="-16"><div className="bg s-culture"></div><span className="frame"></span><span className="label">[Image — Temple lamps]<small>1200×1500 · 4:5</small></span></div>
            <div className="ph p3" data-speed="12"><div className="bg s-dusk"></div><span className="frame"></span><span className="label">[Image — Church and mosque, shared street]<small>1200×1200</small></span></div>
          </div>
        </section>

        {/* 9 · PLACES (image grid) */}
        <section className="places" id="places" aria-label="Places to begin">
          <div className="wrap">
            <h2 className="split-lines">Places to begin</h2>
            <ul>
              <li><a className="tile" href="#plan"><div className="ph"><div className="bg s-backwater"></div><span className="frame"></span><span className="label">[Image — Kumarakom backwaters]<small>1600×1600 · 1:1</small></span></div><b>Backwaters</b><i>[Kumarakom — a morning on the water]</i></a></li>
              <li><a className="tile" href="#plan"><div className="ph"><div className="bg s-tea"></div><span className="frame"></span><span className="label">[Image — Munnar tea hills]<small>1600×1600 · 1:1</small></span></div><b>Western Ghats</b><i>[Munnar — tea hills in the mist]</i></a></li>
              <li><a className="tile" href="#plan"><div className="ph"><div className="bg s-culture"></div><span className="frame"></span><span className="label">[Image — Thrissur Pooram]<small>1600×1600 · 1:1</small></span></div><b>Culture</b><i>[Thrissur — a festival of many faiths]</i></a></li>
            </ul>
          </div>
        </section>

        {/* 10 · FINAL CTA */}
        <section className="final" id="plan" aria-label="Plan your journey">
          <div className="ph" id="finalMedia"><div className="bg s-backwater"></div><span className="frame"></span><span className="label">[Full-screen image — Sunset over the Arabian Sea]<small>2560×1440</small></span></div>
          <div className="final-in wrap">
            <h2 id="finalTitle">Come slowly</h2>
            <a className="btn btn-solid" href="#top"><span>Plan your journey</span><span className="arr" aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <a className="brand" href="#top"><img src="/assets/logo.png" alt="" style={{ width: 64 }} /><span>Chaitanya Keralam</span></a>
            <div><h4>Explore</h4><ul><li><a href="#pillars">Where to go</a></li><li><a href="#gallery">Experiences</a></li><li><a href="#places">Stories</a></li></ul></div>
            <div><h4>Plan</h4><ul><li><a href="#plan">Plan your trip</a></li><li><a href="#plan">Getting here</a></li><li><a href="#plan">Seasons</a></li></ul></div>
            <div><h4>Connect</h4><ul><li><a href="#plan">Contact</a></li><li><a href="#plan">Instagram</a></li><li><a href="#plan">YouTube</a></li></ul></div>
          </div>
          <p className="water" id="water" aria-hidden="true">Keralam</p>
          <div className="legal"><span>© [Year] Chaitanya Keralam</span><span>Privacy · Terms</span></div>
        </div>
      </footer>
    </>
  );
}

