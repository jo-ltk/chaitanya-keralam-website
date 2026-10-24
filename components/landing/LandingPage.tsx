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
    // If already in DOM and global exists
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (existing) {
      resolve();
      return;
    }
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
      // Load dependencies in strict order using local vendored scripts with CDN fallback
      if (!window.gsap) {
        await loadScript('/vendor/gsap.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
      }
      if (!window.ScrollTrigger) {
        await loadScript('/vendor/ScrollTrigger.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
      }
      if (!window.Lenis) {
        await loadScript('/vendor/lenis.min.js', 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js');
      }
      if (!window.CKLanding) {
        await loadScript('/js/main.js');
      }
      if (cancelled) return;
      if (window.CKLanding) {
        // Destroy previous state if any existed to avoid stale locks
        window.CKLanding.destroy();
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
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/eco-spiritual-tourism">Tourism</a></li>
              <li><a href="/programmes">Programmes</a></li>
              <li><a href="/tesh-homes">TESH Homes</a></li>
              <li><a href="/programmes#admissions">Admissions</a></li>
              <li><a href="/programmes#contact">Contact</a></li>
            </ul>
          </nav>
          <div className="nav-end">
            <a className="btn btn-solid btn-sm nav-cta" href="#explore">Explore Kerala</a>
            <button className="disc menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg></button>
          </div>
        </div>
      </header>
      <div className="menu" id="menu" hidden>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/eco-spiritual-tourism">Tourism</a></li>
          <li><a href="/programmes">Programmes</a></li>
          <li><a href="/tesh-homes">TESH Homes</a></li>
          <li><a href="/programmes#admissions">Admissions</a></li>
          <li><a href="/programmes#contact">Contact</a></li>
        </ul>
      </div>

      <main id="top">
        {/* 1 · HERO */}
        <section className="hero" aria-label="Welcome to Kerala · Eco-Spiritual Peace Tourism">
          <div className="ph" id="heroMedia">
            <div className="bg s-backwater"><video autoPlay muted loop playsInline preload="auto" disablePictureInPicture poster="/assets/video/kerala-aerial.jpg">
              <source src="/assets/video/kerala-aerial-1080.webm" type="video/webm" />
              <source src="/assets/video/kerala-aerial-1080.mp4" type="video/mp4" />
            </video></div>
            <span className="frame"></span>
            <span className="label">[Full-screen hero video — Kerala aerial landscape]<small>Muted loop · 1920×1080 min · poster image fallback</small></span>
          </div>
          <div className="wrap hero-body">
            <div>
              <p className="eyebrow" data-fade>KERALA · ECO-SPIRITUAL PEACE TOURISM</p>
              <h1 id="heroTitle"><span className="line">Nature &middot; Stillness &middot; Peace</span></h1>
              <p className="hero-sub" data-fade style={{ marginTop: '20px', maxWidth: '44ch', fontSize: 'clamp(15px, 1.15vw, 19px)', lineHeight: 1.55, color: 'var(--on-muted)' }}>
                Discover Kerala through its breathtaking landscapes, living traditions, cultural harmony, and meaningful experiences that reconnect us with nature and one another.
              </p>
              <div className="hero-actions" data-fade>
                <a className="btn btn-solid" href="#explore"><span>Explore Kerala</span><span className="arr" aria-hidden="true">→</span></a>
                <a className="link" href="#vision"><span>Discover Our Vision</span><span aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="hero-side" data-fade>
              <button className="disc" id="playBtn" type="button" aria-label="Pause background motion"><svg viewBox="0 0 24 24" aria-hidden="true"><path id="playIcon" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg></button>
            </div>
          </div>
        </section>

        {/* 2 · INTRODUCING THE VISION */}
        <section className="manifesto wrap" id="vision" aria-label="Introducing the Vision">
          <p id="manifestoText">
            More than a destination <br />a journey where Kerala&apos;s forests, quiet waters, and living faiths unite in peace and stillness.
          </p>
        </section>

        {/* 3 · PANORAMA REVEAL — KERALA'S NATURAL BEAUTY */}
        <section className="pano" id="natural-beauty" aria-label="Kerala's Natural Beauty">
          <div className="ph" id="panoMedia">
            <div className="bg s-dusk"><img src="/assets/images/panorama-dusk.jpg" alt="Kerala backwaters at dusk" /></div>
            <span className="frame"></span>
            <span className="label">[Panoramic image — Kerala backwaters at dusk]<small>2880×1600 · full-bleed · houseboat, palms, still water</small></span>
          </div>
          <div className="wrap pano-cap">
            <h2 className="split-lines">A Landscape That Stays With You</h2>
            <div className="pano-cap-text">
              <span className="eyebrow">KUMARAKOM · ALAPPUZHA</span>
              <p data-fade>From the quiet rhythm of the backwaters to the dramatic beauty of the Western Ghats, Kerala invites you to slow down, explore, and reconnect with the natural world.</p>
            </div>
          </div>
        </section>

        {/* 4 · THE FOUR PILLARS */}
        <section className="pillars" id="pillars" aria-label="The Chaitanya Keralam Vision — Four Pillars">
          <div className="pillars-stage">
            <article className="pl" data-i="0">
              <div className="ph"><div className="bg s-ghats"><img src="/assets/images/pillar-ecology.jpg" alt="Western Ghats in mist" /></div></div>
              <div className="wrap pl-text">
                <p className="pl-index eyebrow">THE CHAITANYA KERALAM VISION · PILLAR 01</p>
                <h2 className="pl-word">Ecology</h2>
                <p className="pl-line">Journey through lush forests, misty mountains, flowing rivers, waterfalls, and serene backwaters. Experience the untamed beauty of Kerala and rediscover our connection with the natural world.</p>
                <div style={{ marginTop: '24px' }}>
                  <a className="btn btn-solid btn-sm" href="#ghats"><span>Explore Nature</span><span className="arr" aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
            <article className="pl" data-i="1">
              <div className="ph"><div className="bg s-temple"><img src="/assets/images/pillar-stillness.jpg" alt="Silent Valley forest, morning light" /></div></div>
              <div className="wrap pl-text">
                <p className="pl-index eyebrow">THE CHAITANYA KERALAM VISION · PILLAR 02</p>
                <h2 className="pl-word">Stillness</h2>
                <p className="pl-line">Discover moments of reflection, tranquillity, and deeper connection through nature and sacred traditions. Experience the quiet beauty of places where life slows down and the mind finds space to breathe.</p>
                <div style={{ marginTop: '24px' }}>
                  <a className="btn btn-solid btn-sm" href="#spirituality"><span>Discover Spirituality</span><span className="arr" aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
            <article className="pl" data-i="2">
              <div className="ph"><div className="bg s-coast"><img src="/assets/images/pillar-harmony.avif" alt="Kerala's religious and cultural harmony" /></div></div>
              <div className="wrap pl-text">
                <p className="pl-index eyebrow">THE CHAITANYA KERALAM VISION · PILLAR 03</p>
                <h2 className="pl-word">Harmony</h2>
                <p className="pl-line">Discover a culture shaped by diverse communities, living faiths, and shared traditions. Experience the values of mutual respect, peaceful coexistence, and the connections that bring people together.</p>
                <div style={{ marginTop: '24px' }}>
                  <a className="btn btn-solid btn-sm" href="#harmony"><span>Discover Harmony</span><span className="arr" aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
            <article className="pl" data-i="3">
              <div className="ph"><div className="bg s-culture"><img src="/assets/images/pillar-tourism.png" alt="Local people and cultural experiences" /></div></div>
              <div className="wrap pl-text">
                <p className="pl-index eyebrow">THE CHAITANYA KERALAM VISION · PILLAR 04</p>
                <h2 className="pl-word">Tourism</h2>
                <p className="pl-line">Go beyond sightseeing. Connect with local communities, discover cultural traditions, experience authentic hospitality, and explore Kerala through encounters that leave a lasting impression.</p>
                <div style={{ marginTop: '24px' }}>
                  <a className="btn btn-solid btn-sm" href="#destinations"><span>Explore Experiences</span><span className="arr" aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>
            <nav className="pl-hud" aria-label="Pillars">
              <button type="button" data-go="0" className="on">Ecology</button>
              <button type="button" data-go="1">Spirituality</button>
              <button type="button" data-go="2">Peace</button>
              <button type="button" data-go="3">Tourism</button>
            </nav>
          </div>
        </section>

        {/* 5 · WESTERN GHATS / MONSOON */}
        <section className="wordsec" id="ghats" aria-label="Western Ghats and Monsoon">
          <p className="bigword" id="word1" aria-hidden="true">Western Ghats</p>
          <p className="bigword row2" id="word2" aria-hidden="true">Monsoon</p>
          <div className="ph a" data-speed="-18"><div className="bg s-tea"><img src="/assets/images/munnar-tea.jpg" alt="Munnar tea hills" /></div></div>
          <div className="wrap wordsec-cap" data-fade>
            <p className="eyebrow">KERALA · THE WESTERN GHATS</p>
            <div className="ph b wordsec-cap-img"><div className="bg s-falls"><img src="/assets/images/athirappilly.jpg" alt="Athirappilly waterfalls" /></div></div>
            <p>Where the mountains breathe, and the monsoon awakens the forest. Mist drifts across emerald ridges. Rain traces the leaves. Waterfalls descend through ancient forests, bringing the landscape to life.</p>
            <p className="eyebrow" style={{ opacity: 0.75 }}>MUNNAR · WAYANAD · ATHIRAPPILLY</p>
            <p style={{ fontSize: 'clamp(16px, 1.3vw, 22px)', color: 'var(--on)' }}>Experience Kerala in its most elemental form.</p>
          </div>
        </section>

        {/* 6 · HORIZONTAL GALLERY — FESTIVALS AND LIVING CULTURE */}
        <section className="gallery" id="culture" aria-label="Festivals and Living Culture">
          <div className="wrap gal-head">
            <div>
              <p className="eyebrow">LIVING HERITAGE</p>
              <h2 className="split-lines">A Culture Full of Life</h2>
              <p className="gal-sub" data-fade>Experience the energy of traditional festivals, the artistry of local performers, the rhythm of community celebrations, and the traditions passed from one generation to the next.</p>
            </div>
          </div>
          <div className="wrap">
            <div className="track" id="track">
              <figure className="card"><div className="ph"><div className="bg s-backwater"><img src="/assets/images/gallery-backwaters.jpg" alt="Kumarakom and Vembanad Lake backwaters" /></div></div><p><span>Backwaters</span><span>Kumarakom</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-forest"><img src="/assets/images/gallery-rainforest.jpg" alt="Silent Valley ancient rainforest" /></div></div><p><span>Rainforest</span><span>Wayanad</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-falls"><img src="/assets/images/gallery-waterfalls.jpg" alt="Athirappilly waterfalls cascading through forest" /></div></div><p><span>Waterfalls</span><span>Athirappilly</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-coast"><img src="/assets/images/gallery-coast.jpg" alt="Varkala coastal cliffs and the Arabian Sea" /></div></div><p><span>Coast</span><span>Varkala</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-tea"><img src="/assets/images/gallery-hills.jpg" alt="Munnar emerald tea estate hills" /></div></div><p><span>Highlands</span><span>Munnar</span></p></figure>
              <figure className="card"><div className="ph"><div className="bg s-culture"><img src="/assets/images/gallery-culture.jpg" alt="Kathakali performer embodying living traditions" /></div></div><p><span>Living Traditions</span><span>Kochi</span></p></figure>
            </div>
          </div>
        </section>

        {/* 7 · SPLIT — SPIRITUALITY AND REFLECTION */}
        <section className="split" id="spirituality" aria-label="Spirituality and Reflection">
          <div className="ph" data-inner="12"><div className="bg s-temple"><img src="/assets/images/river-quiet.png" alt="Dawn by the river, quiet reflection" /></div></div>
          <div className="wrap split-text">
            <p className="eyebrow">SPIRITUALITY &amp; REFLECTION</p>
            <h2 className="split-lines">Discover the Beauty<br />of Stillness</h2>
            <p className="split-sub" data-fade>
              Amid forests, rivers, and quiet natural landscapes, find moments to pause, reflect, and reconnect with yourself and the world around you. Kerala&apos;s natural and spiritual traditions offer space for contemplation and inner peace.
            </p>
            <div className="ph" data-speed="-10"><div className="bg s-forest"><img src="/assets/images/forest-path.jpg" alt="Quiet meditative forest path" /></div></div>
          </div>
        </section>

        {/* 8 · COLLAGE — PEACE AND CULTURAL HARMONY */}
        <section className="collage" id="harmony" aria-label="Peace and Cultural Harmony">
          <div className="wrap collage-grid">
            <div className="collage-head">
              <p className="eyebrow" data-fade>PEACE &amp; CULTURAL HARMONY</p>
              <h2 className="split-lines">Many Traditions.<br />One Shared Humanity.</h2>
              <p className="collage-sub" data-fade>
                A culture shaped by diverse communities, sacred traditions, and shared humanity — where different faiths coexist in mutual respect and everyday connection.
              </p>
              <div className="collage-stats" data-fade>
                <div className="c-stat">
                  <span className="c-stat-num">Centuries</span>
                  <span className="c-stat-lbl">Of shared heritage, diverse faiths, and mutual respect</span>
                </div>
                <div className="c-stat">
                  <span className="c-stat-num">One Vision</span>
                  <span className="c-stat-lbl">Peaceful coexistence rooted in cultural harmony</span>
                </div>
              </div>
            </div>
            <div className="ph p1" data-inner="10"><div className="bg s-coast"><img src="/assets/images/festival-crowd.png" alt="Diverse community celebrating together" /></div></div>
            <div className="ph p2" data-speed="-14"><div className="bg s-culture"><img src="/assets/images/temple-lamps.png" alt="Traditional lamps illuminating sacred spaces" /></div></div>
            <div className="ph p3" data-speed="10"><div className="bg s-dusk"><img src="/assets/images/church-mosque.png" alt="Church and mosque sharing the same peaceful street" /></div></div>
            <div className="collage-quote" data-fade>
              <blockquote>“Where diverse traditions exist alongside one another, and mutual respect unites communities.”</blockquote>
              <cite>— Kerala Cultural Heritage</cite>
            </div>
          </div>
        </section>

        {/* 9 · PLACES (image grid) — MEANINGFUL TOURISM */}
        <section className="places" id="destinations" aria-label="Meaningful Tourism">
          <div className="wrap">
            <p className="eyebrow" style={{ color: 'var(--ink-muted)', marginBottom: '16px' }}>MEANINGFUL TOURISM</p>
            <h2 className="split-lines">Experience Kerala Beyond the Ordinary</h2>
            <p className="places-sub" data-fade>Meet local communities, discover traditional ways of life, experience regional culture, and explore the landscapes that make Kerala distinctive. Meaningful tourism creates opportunities for visitors to connect with places and people more deeply.</p>
            <ul>
              <li>
                <a className="tile" href="/eco-spiritual-tourism">
                  <div className="ph"><div className="bg s-backwater"><img src="/assets/images/kumarakom-backwaters.png" alt="Kumarakom backwaters" /></div></div>
                  <b>KUMARAKOM</b>
                  <i>Tranquil backwaters and village life connected by water</i>
                </a>
              </li>
              <li>
                <a className="tile" href="/eco-spiritual-tourism">
                  <div className="ph"><div className="bg s-tea"><img src="/assets/images/tile-western-ghats.png" alt="Munnar tea hills" /></div></div>
                  <b>MUNNAR</b>
                  <i>Highland ridges, misty tea valleys, and mountain air</i>
                </a>
              </li>
              <li>
                <a className="tile" href="/eco-spiritual-tourism">
                  <div className="ph"><div className="bg s-culture"><img src="/assets/images/tile-culture.png" alt="Cultural celebrations in Kerala" /></div></div>
                  <b>WAYANAD &amp; THRISSUR</b>
                  <i>Ancient forests, community festivals, and living arts</i>
                </a>
              </li>
            </ul>
            <div style={{ marginTop: '48px', textAlign: 'center' }}>
              <a className="btn btn-solid" href="/eco-spiritual-tourism" style={{ background: 'var(--ink)', color: 'var(--ivory)' }}><span>Explore Eco-Spiritual Tourism</span><span className="arr" aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        {/* 10 · PHILOSOPHY & COMMUNITY PROGRAMMES */}
        <section className="vision" id="programmes" aria-label="Philosophy, Programmes, and TESH Homes">
          <div className="wrap vision-in">
            <div style={{ textAlign: 'center', maxWidth: '52ch', margin: '0 auto' }}>
              <p className="eyebrow" data-fade>THE LIVING INITIATIVE</p>
              <h2 className="split-lines" style={{ fontSize: 'clamp(36px, 4.5vw, 72px)' }}>Community, Learning &amp; Giving</h2>
            </div>

            <div className="vision-cards">
              {/* Box 1: Tyagarchana */}
              <div className="vision-card" data-fade>
                <div>
                  <p className="eyebrow">TYAGARCHANA PHILOSOPHY</p>
                  <h3>A Philosophy of Love &amp; Service</h3>
                  <p className="vision-sub">
                    At the heart of Chaitanya Keralam is the spirit of giving, voluntary sacrifice, and contributing time, effort, and resources for community wellbeing and meaningful contribution.
                  </p>
                </div>
                <div className="vision-cta">
                  <a className="link" href="/about"><span>Discover Our Philosophy</span><span aria-hidden="true">→</span></a>
                </div>
              </div>

              {/* Box 2: Programmes */}
              <div className="vision-card" data-fade>
                <div>
                  <p className="eyebrow">LEARNING &amp; COMMUNITY</p>
                  <h3>Learn. Practise. Create. Lead.</h3>
                  <p className="vision-sub">
                    Opportunities for personal growth, practical learning, and community participation. Pathways in sustainable tourism, community hospitality, and environmental stewardship.
                  </p>
                </div>
                <div className="vision-cta">
                  <a className="btn btn-solid btn-sm" href="/programmes"><span>Explore Programmes</span><span className="arr" aria-hidden="true">→</span></a>
                </div>
              </div>

              {/* Box 3: TESH Homes */}
              <div className="vision-card" data-fade>
                <div>
                  <p className="eyebrow">PROPOSED INITIATIVE</p>
                  <h3>Homes That Connect Communities</h3>
                  <p className="vision-sub">
                    Envisioning suitable homes becoming welcoming spaces for accommodation, learning, and cultural activities, connecting visitors with local life.
                  </p>
                </div>
                <div className="vision-cta">
                  <a className="btn btn-ghost btn-sm" href="/tesh-homes"><span>Discover TESH Homes</span><span className="arr" aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11 · FINAL CALL TO ACTION */}
        <section className="final" id="explore" aria-label="Come Discover a Different Side of Kerala">
          <div className="ph" id="finalMedia"><div className="bg s-backwater"><img src="/assets/images/sunset-arabian-sea.jpg" alt="Sunset over the Arabian Sea" /></div></div>
          <div className="final-in wrap">
            <p className="eyebrow" data-fade>DISCOVER KERALA</p>
            <h2 id="finalTitle">Discover a Different Kerala</h2>
            <p className="final-sub" data-fade>Experience the meeting of nature, spirituality, peace, and culture in a place that invites you to reconnect.</p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn btn-solid" href="#top"><span>Explore Kerala</span><span className="arr" aria-hidden="true">→</span></a>
              <a className="btn btn-ghost" href="/about"><span>Learn About Chaitanya Keralam</span><span className="arr" aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a className="brand" href="#top"><img src="/assets/logo.png" alt="" style={{ width: 64 }} /><span>Chaitanya Keralam</span></a>
              <p style={{ marginTop: '16px', maxWidth: '34ch', fontSize: '14px', lineHeight: 1.6, color: 'var(--on-muted)' }}>
                An initiative envisioning Kerala as a global Eco-Spiritual Peace Tourism destination.
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="#vision">Our Vision</a></li>
                <li><a href="#pillars">The Four Pillars</a></li>
                <li><a href="#natural-beauty">Kerala&apos;s Nature</a></li>
                <li><a href="#spirituality">Spirituality &amp; Reflection</a></li>
              </ul>
            </div>
            <div>
              <h4>Initiatives</h4>
              <ul>
                <li><a href="/eco-spiritual-tourism">Eco-Spiritual Tourism</a></li>
                <li><a href="/programmes">Community Programmes</a></li>
                <li><a href="/tesh-homes">TESH Homes Concept</a></li>
                <li><a href="/about">Tyagarchana Philosophy</a></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/programmes#contact">Contact</a></li>
                <li><a href="#top">Back to Top ↑</a></li>
              </ul>
            </div>
          </div>
          <p className="water" id="water" aria-hidden="true">Keralam</p>
          <div className="legal"><span>© 2026 Chaitanya Keralam</span><span>Eco-Spiritual Peace Tourism</span></div>
        </div>
      </footer>
    </>
  );
}

