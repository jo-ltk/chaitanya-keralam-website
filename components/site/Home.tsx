'use client';
/* Converted from the Chaitanya Keralam design canvas (Home). */
import React from 'react';
import { Button, NavBar, StoryPanel, Tag, TextField } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class Home extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) { super(props); this.state = { prog: '3m', sent: false, why: 0, menu: false, fc: 0, fcDir: 'fwd', fcFlip: false, fcHover: false, fcPaused: false }; this._dur = 6000; this._rem = 6000; }
  componentDidMount() {
    var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) { this.setState({ fcPaused: true }); return; }
    this._sched(this._dur);
  }
  componentWillUnmount() { clearTimeout(this._t); }
  _sched(ms) {
    var self = this; clearTimeout(this._t);
    this._rem = ms; this._start = Date.now();
    this._t = setTimeout(function () {
      if (document.hidden) { self._sched(1500); return; }
      self._go(self.state.fc + 1, 'fwd');
    }, ms);
  }
  _halt() { clearTimeout(this._t); this._rem = Math.max(400, this._rem - (Date.now() - this._start)); }
  _go(i, dir) {
    var n = 5;
    this.setState({ fc: (i + n) % n, fcDir: dir, fcFlip: !this.state.fcFlip });
    if (!this.state.fcPaused && !this.state.fcHover) this._sched(this._dur); else this._rem = this._dur;
  }
  nav(cur) {
    var self = this;
    var L = [['Home', '/'], ['About', '/about'], ['Tourism', '/eco-spiritual-tourism'], ['Programmes', '/programmes'], ['TESH Homes', '/tesh-homes'], ['Admissions', '/programmes#admissions'], ['Contact', '#contact']];
    return {
      navLinks: L.map(function (l) { return { label: l[0], href: l[1], active: l[0] === cur, cls: l[0] === cur ? 'on' : '' }; }),
      menuOpen: this.state.menu,
      menuLabel: this.state.menu ? 'Close menu' : 'Open menu',
      menuIcon: this.state.menu ? 'M5 5l10 10M15 5 5 15' : 'M3 6h14M3 10h14M3 14h14',
      toggleMenu: function () { self.setState({ menu: !self.state.menu }); },
      closeMenu: function () { self.setState({ menu: false }); }
    };
  }
  renderVals() {
    var h = React.createElement;
    var data = {
      '3m': { title: '3-Month Foundation Programme', href: '/programmes/3-month-foundation', summary: 'Introduces the basic concepts and practical skills of tourism, hospitality, basic caregiving, entrepreneurship, personal leadership and digital skills.', duration: '3 months · 4 hours a day, 5 days a week', hours: '240 training hours', elig: 'Plus Two / Higher Secondary or equivalent',
        items: ['Tourism & travel and eco-spiritual peace tourism', 'Hospitality and eco-hospitality', 'Basic caregiving', 'Entrepreneurship and personal leadership', 'Digital skills', 'Outcome: foundational skills and practical awareness to begin assisting in tourism, hospitality, caregiving and TESH-related activities'] },
      '6m': { title: '6-Month Professional Programme', href: '/programmes/6-month-professional', summary: 'Develops stronger operational skills in eco-spiritual tourism, destination development, tour and itinerary planning, sustainable tourism, hospitality operations, international caregiving and team leadership.', duration: '6 months · 4 hours a day, 5 days a week', hours: '480 training hours', elig: 'Plus Two / Higher Secondary or equivalent',
        items: ['Eco-spiritual tourism, destination development and sustainable tourism', 'Tour and itinerary planning', 'Hospitality operations and international caregiving', 'Entrepreneurship, business development and team leadership', 'TESH Home practical training', 'Outcome: professional-level practical skills and greater responsibility'] },
      '12m': { title: '1-Year Advanced Programme', href: '/programmes/1-year-advanced', summary: 'Develops higher-level capabilities in tourism and destination management, tour operations, tourism experience design, advanced hospitality, eco-resort and wellness management, advanced caregiving and business management.', duration: '12 months · 4 hours a day, 5 days a week', hours: '960 training hours', elig: 'To be confirmed',
        items: ['Tourism management, destination management and tour operations', 'Tourism experience design and advanced hospitality management', 'Eco-resort and wellness management; advanced caregiving', 'Entrepreneurship, business management, financial skills and digital marketing', 'Leadership and supervision; TESH Home management', 'Business and management projects'] }
    };
    var self = this;
    var progs = [['3m', '3 months'], ['6m', '6 months'], ['12m', '1 year']].map(function (p) {
      return { label: p[1], active: self.state.prog === p[0], pick: function () { self.setState({ prog: p[0] }); } };
    });
    var whyData = [
      [
        '01',
        'Eco-Spiritual Peace Tourism & Travel',
        'Immersive training connecting Kerala’s pristine backwaters, hill sanctuaries, and heritage trails with responsible visitor stewardship.',
        ['Travel Planning', 'Destination Development', 'Cultural Interpretation', 'Eco-Stewardship'],
        'Part of 3-Month, 6-Month & 1-Year Programmes',
        '/images/home/kerala-backwaters-at-golden-hour.webp'
      ],
      [
        '02',
        'Eco-Spiritual Hospitality',
        'Warm, authentic homestay and retreat hospitality blending traditional Kerala guest care with professional front office and eco-resort standards.',
        ['Guest Relations', 'Food & Beverage', 'Housekeeping', 'Retreat & Eco-Hospitality'],
        'Practical Training in TESH Home Living',
        '/images/home/tropical-veranda-table-setting.webp'
      ],
      [
        '03',
        'International Caregiving',
        'Specialised compassionate care skills tailored for global benchmarks — supporting seniors, vulnerable guests, and wellness-seekers with dignity.',
        ['Personal Care', 'Daily Living Support', 'Mobility & Nutrition', 'First Aid & Documentation'],
        'Integrated into 6-Month & 1-Year Courses',
        '/images/home/warm-wellness-stretch-in-a-sunlit-garden-room.webp'
      ],
      [
        '04',
        'Global Entrepreneurship & Leadership',
        'Empowering youth to launch, manage, and scale independent micro-ventures, homestay enterprises, and community-rooted tourism businesses.',
        ['Business Modeling', 'Pricing & Costing', 'Digital Marketing', 'Youth Team Leadership'],
        'Key Pillar for 1,000 Global Youth Leaders',
        '/images/home/tropical-veranda-study-circle.webp'
      ]
    ];
    var whyRows = whyData.map(function (r, i) {
      var open = self.state.why === i;
      return {
        n: r[0],
        title: r[1],
        desc: r[2],
        tags: r[3],
        badge: r[4],
        img: r[5],
        open: open,
        closed: !open,
        cls: open ? 'why-row on' : 'why-row off',
        pick: function () { self.setState({ why: open ? -1 : i }); }
      };
    });
    var fcData = [
      ['Nature & ecology', 'Backwaters, forests and hills', 'Backwaters and green landscapes of Kerala', "Kerala's rivers, forests, hill ranges and biodiversity are the foundation of eco-spiritual peace tourism.", 'Learners explore responsible travel that protects the natural environments guests come to experience.', '/eco-spiritual-tourism', 'Explore eco-spiritual tourism', 'p1'],
      ['Culture & heritage', 'Living traditions', 'Kerala heritage and cultural traditions', 'A heritage shaped by ancient trade and cultural exchange — from Muziris to the traditions alive today.', "Interpretation skills help young people share Kerala's stories with travellers respectfully.", '/eco-spiritual-tourism#why-kerala', 'Why Kerala', 'p2'],
      ['Hospitality', 'A culture of welcome', 'Kerala hospitality and community living', "Kerala's traditions of hospitality and community living shape how guests are welcomed.", 'Guest relations, front office, housekeeping and eco-hospitality are part of TESH training.', '/programmes#areas', 'See the learning areas', 'p3'],
      ['Wellness & peace', 'Space to reflect', 'Meditation, wellness and quiet places', "Meditation, wellness and Kerala's Ayurvedic and spiritual traditions invite slower, reflective travel.", 'Wellness and retreat hospitality are included in the Eco-Spiritual Hospitality area.', '/about#approach', 'Our approach', 'p4'],
      ['Youth & opportunity', 'Learning into livelihoods', 'Young people learning practical skills', 'Practical training that connects learning with livelihoods, leadership and enterprise.', 'An intended pathway from training to proposed TESH Home roles and youth entrepreneurship.', '/programmes', 'Explore programmes', 'p6']
    ];
    var fi = this.state.fc, fn = fcData.length;
    var fcSlides = fcData.map(function (r, k) {
      var pos = k === fi ? 'on' : (k === (fi - 1 + fn) % fn ? 'prev' : 'next');
      return { n: '0' + (k + 1), kicker: r[0], title: r[1], caption: r[2], left: r[3], right: r[4], href: r[5], cta: r[6], tone: r[7],
        label: (k + 1) + ' of ' + fn + ': ' + r[1], cls: 'fc-slide ' + pos, hidden: k !== fi, current: k === fi ? 'true' : 'false',
        dot: k === fi ? 'fc-dot on' : 'fc-dot', go: function () { if (k !== fi) self._go(k, k > fi ? 'fwd' : 'back'); } };
    });
    var held = this.state.fcPaused || this.state.fcHover;
    return Object.assign(this.nav('Home'), {
      fcSlides: fcSlides, fcCur: fcSlides[fi], fcTotal: '0' + fn,
      fcState: 'fc' + (held ? ' held' : ''),
      fcAnim: (this.state.fcFlip ? 'fc-in-a ' : 'fc-in-b ') + this.state.fcDir,
      fcPrev: function () { self._go(fi - 1, 'back'); },
      fcNext: function () { self._go(fi + 1, 'fwd'); },
      fcKey: function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); self._go(fi - 1, 'back'); } else if (e.key === 'ArrowRight') { e.preventDefault(); self._go(fi + 1, 'fwd'); } },
      fcHold: function (e) { if (e && e.pointerType && e.pointerType !== 'mouse') return; if (e && e.type === 'focus' && e.target.matches && !e.target.matches(':focus-visible')) return; if (self.state.fcHover) return; if (!self.state.fcPaused) self._halt(); self.setState({ fcHover: true }); },
      fcRelease: function (e) { if (e && e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return; if (!self.state.fcHover) return; self.setState({ fcHover: false }); if (!self.state.fcPaused) self._sched(self._rem); },
      fcToggle: function () { if (self.state.fcPaused) { self.setState({ fcPaused: false }); if (!self.state.fcHover) self._sched(self._rem); } else { self._halt(); self.setState({ fcPaused: true }); } },
      fcPlayLabel: this.state.fcPaused ? 'Play slideshow' : 'Pause slideshow',
      fcPlayIcon: this.state.fcPaused ? 'M6 4l10 6-10 6Z' : 'M5 4h3.5v12H5ZM11.5 4H15v12h-3.5Z',
      fcTStart: function (e) { var t = e.touches[0]; self._tx = t.clientX; self._ty = t.clientY; },
      fcTEnd: function (e) { if (self._tx == null) return; var t = e.changedTouches[0], dx = t.clientX - self._tx, dy = t.clientY - self._ty; self._tx = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) self._go(fi + (dx < 0 ? 1 : -1), dx < 0 ? 'fwd' : 'back'); },
      whyRows: whyRows,
      vTitle: h(React.Fragment, null, 'Our ', h('em', null, 'Vision')),
      mTitle: h(React.Fragment, null, 'Our ', h('em', null, 'Mission')),
      p3Title: h(React.Fragment, null, 'The ', h('em', null, 'Foundation'), ' Level'),
      p6Title: h(React.Fragment, null, 'The ', h('em', null, 'Professional'), ' Level'),
      p12Title: h(React.Fragment, null, 'The ', h('em', null, 'Advanced'), ' Level'),
      progs: progs,
      sel: data[this.state.prog],
      sent: this.state.sent,
      submit: function () { self.setState({ sent: true }); }
    });
  }

  render() {
    const $v: any = this.renderVals();
    return (
<>



<div className={"navbar"}>
<a className={"nav-logo"} href={"/"} tabIndex={-1}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /></a>
<NavBar brandHref={"/"} links={$v?.navLinks} />
<div className={"nav-cta"}><Button variant={"primary"} size={"sm"} href={"/programmes#admissions"}>Apply now</Button></div>
<button className={"menu-btn"} aria-label={$v?.menuLabel} aria-expanded={$v?.menuOpen} onClick={$v?.toggleMenu}><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><path d={$v?.menuIcon} /></svg></button>
</div>
{!!($v?.menuOpen) && (<>
<nav className={"mnav"} aria-label={"Mobile"}>
{($v?.navLinks || []).map((l: any, $index: number) => (<React.Fragment key={$index}><a href={l?.href} className={l?.cls} onClick={$v?.closeMenu}>{l?.label}</a></React.Fragment>))}
<div className={"cta"}><Button variant={"primary"} href={"/programmes#admissions"}>Apply now</Button></div>
</nav>
</>)}


<section id={"home"} className={"wrap hero"}>
<div className={"hero-copy"}>
<p className={"eyebrow r1"}>Chaitanya Keralam · Eco-Spiritual Peace Tourism</p>
<h1 className={"h-display r2"}>Transforming Kerala into a Global <em>Eco-Spiritual</em> Peace Tourism Destination.</h1>
<p className={"lede r3"}>Connecting nature, culture, spirituality, hospitality and sustainable livelihoods to create meaningful opportunities for youth and communities.</p>
<div className={"cta r4"}>
<Button variant={"primary"} href={"/programmes"}>Explore Programmes</Button>
<Button variant={"secondary"} href={"#vision"}>Discover Our Vision</Button>
</div>
<p className={"announce r4"}><span className={"announce-dot"} aria-hidden={"true"}></span><span><b>Programmes begin December 2026</b> · 3-month, 6-month and 1-year options</span></p>
</div>
<img className={"hero-img"} src={"/images/home-hero-illustration.webp"} width={"1774"} height={"887"} alt={"Illustration: a group of smiling young students in green and ivory, taking a selfie together and pointing upward"} />
</section>


<section id={"about"} className={"ab"}>
<div className={"wrap"}>
<div className={"ab-head"}>
<p className={"eyebrow"}>Introduction</p>
<h2 className={"ab-title"}>A new approach to <em>tourism</em>, learning and <em>livelihoods</em>.</h2>
</div>
</div>
<div className={"wrap"}>
<div className={$v?.fcState} role={"region"} aria-roledescription={"carousel"} aria-label={"Kerala highlights"} onPointerEnter={$v?.fcHold} onPointerLeave={$v?.fcRelease} onFocus={$v?.fcHold} onBlur={$v?.fcRelease} onKeyDown={$v?.fcKey}>
<div className={"fc-grid"}>
<div className={`fc-side fc-left ${str($v?.fcAnim)}`} aria-live={"polite"}>
<p className={"fc-count"}><b>{$v?.fcCur?.n}</b> / {$v?.fcTotal}</p>
<p className={"eyebrow plain"}>{$v?.fcCur?.kicker}</p>
<h3 className={"fc-title"}>{$v?.fcCur?.title}</h3>
<p className={"small"}>{$v?.fcCur?.left}</p>
</div>
<div className={"fc-stage"} onTouchStart={$v?.fcTStart} onTouchEnd={$v?.fcTEnd}>
{($v?.fcSlides || []).map((s: any, $index: number) => (<React.Fragment key={$index}>
<figure className={s?.cls} aria-hidden={s?.hidden} role={"group"} aria-roledescription={"slide"} aria-label={s?.label}>
<div className={`fc-img`} style={{overflow:'hidden',borderRadius:'inherit'}}><img src={$index === 0 ? '/images/home/kerala-backwaters-at-golden-hour.webp' : $index === 1 ? '/images/home/kerala-courtyard-heritage-iside-home.webp' : $index === 2 ? '/images/home/warm-kerala-veranda-welcome.webp' : $index === 3 ? '/images/home/warm-wellness-stretch-in-a-sunlit-garden-room.webp' : '/images/home/tropical-veranda-study-circle.webp'} alt={s?.caption} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
<figcaption className={"fc-cap"}><span>{s?.n}</span>{s?.caption}</figcaption>
</figure>
</React.Fragment>))}
</div>
<div className={`fc-side fc-right ${str($v?.fcAnim)}`}>
<p className={"body"}>{$v?.fcCur?.right}</p>
<a className={"fc-link"} href={$v?.fcCur?.href}>{$v?.fcCur?.cta} <span aria-hidden={"true"}>→</span></a>
</div>
</div>
<div className={"fc-ctrl"}>
<button className={"fc-btn"} aria-label={"Previous image"} onClick={$v?.fcPrev}><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}><path d={"M12 4 6 10l6 6"} /></svg></button>
<div className={"fc-dots"} role={"group"} aria-label={"Choose an image"}>
{($v?.fcSlides || []).map((s: any, $index: number) => (<React.Fragment key={$index}><button className={s?.dot} aria-label={s?.label} aria-current={s?.current} onClick={s?.go}><i></i></button></React.Fragment>))}
</div>
<button className={"fc-btn"} aria-label={"Next image"} onClick={$v?.fcNext}><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}><path d={"m8 4 6 6-6 6"} /></svg></button>
<button className={"fc-play"} aria-label={$v?.fcPlayLabel} onClick={$v?.fcToggle}><svg width={"14"} height={"14"} viewBox={"0 0 20 20"} fill={"currentColor"} aria-hidden={"true"}><path d={$v?.fcPlayIcon} /></svg></button>
</div>
</div>
</div>
<div className={"wrap"}>
<div className={"ab-body"}>
<h3 className={"ab-sub"}>Kerala's nature, heritage and hospitality — connected to <em>opportunity</em></h3>
<p className={"small"}>Chaitanya Keralam brings together nature, culture, spirituality, peace, wellness, responsible tourism, hospitality, caregiving and entrepreneurship to create meaningful opportunities for youth and communities.</p>
<p className={"small"}>Through TESH Skill Development Programmes and the proposed TESH Homes ecosystem, the initiative aims to connect practical learning with employment opportunities, leadership and youth entrepreneurship.</p>
<div className={"cta"}><Button variant={"quiet"} href={"/about"}>More about Chaitanya Keralam</Button></div>
</div>
</div>
</section>


<section id={"why"} className={"why"}>
<div className={"wrap"}>
<div className={"ab-head"}>
<p className={"eyebrow"}>Four programme areas</p>
<h2 className={"ab-title"}>Learning that connects <em>tourism</em>, care and <em>enterprise</em></h2>
</div>
</div>
<ul className={"why-list"}>
{($v?.whyRows || []).map((w: any, $index: number) => (<React.Fragment key={$index}>
<li className={w?.cls}>
<button className={"why-btn"} aria-expanded={w?.open} onClick={w?.pick}>
<span className={"why-l"}><span className={"why-n"}>{w?.n}</span><span className={"why-t"}>{w?.title}</span></span>
{!(w?.open) && (
  <span className={"why-preview"}>
    <span className={"why-thumb"}><img src={w?.img} alt={w?.title} /></span>
    <span className={"why-chevron"} aria-hidden={"true"}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7.5L10 12.5L15 7.5"/></svg>
    </span>
  </span>
)}
{!!(w?.open) && (
  <span className={"why-chevron open"} aria-hidden={"true"}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5L10 7.5L15 12.5"/></svg>
  </span>
)}
</button>
{!!(w?.open) && (
  <div className={"why-expanded"}>
    <div className={"why-expanded-content"}>
      {w?.badge && <span className={"why-badge"}>{w?.badge}</span>}
      <p className={"why-d"}>{w?.desc}</p>
      {w?.tags && (
        <div className={"why-tags-wrap"}>
          <span className={"why-tags-label"}>Key Focus Areas:</span>
          <div className={"why-tags"}>
            {w.tags.map((t: string, ti: number) => (
              <span key={ti} className={"why-tag"}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <div className={"why-expanded-action"}>
        <a className={"why-more-link"} href={"/programmes"}>
          Explore programme curriculum <span aria-hidden={"true"}>→</span>
        </a>
      </div>
    </div>
    <div className={"why-feature-img"}>
      <img src={w?.img} alt={w?.title} />
    </div>
  </div>
)}
</li>
</React.Fragment>))}
</ul>
</section>


<section id={"vision"} className={"sec"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Vision &amp; Mission</p><h2 className={"h-sec"}>Why we <em>exist</em></h2><p className={"body"} style={css("color:#5d5b4d")}>A mission by the youth, for the youth and of the youth — to transform suitable unutilized and underutilized homes into proposed TSB and TESH Homes and to build a team of 1,000 independent global youth entrepreneurs in Kerala's eco-spiritual peace tourism industry.</p></div>
<div className={"vm"}>
<StoryPanel tone={"forest"} nav={"Chaitanya Keralam"} navEnd={"§ Vision"} title={$v?.vTitle} deck={"Transforming Kerala into a Global Eco-Spiritual Peace Tourism Destination."}>
<svg width={"96"} height={"96"} viewBox={"0 0 96 96"} aria-hidden={"true"}><path d={"M48 16c10 14 16 26 16 38a16 16 0 0 1-32 0c0-12 6-24 16-38Z"} fill={"#c5a15a"} /><path d={"M48 70v-20"} stroke={"#f7f3e8"} strokeWidth={"2"} /><path d={"M30 82h36M38 76h20"} stroke={"#f7f3e8"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>
</StoryPanel>
<StoryPanel tone={"gold"} nav={"Chaitanya Keralam"} navEnd={"§ Mission"} title={$v?.mTitle} deck={"Transforming luxury homes · Empowering youth · Creating entrepreneurs · Utilizing free land holding for income generation · Global e-commerce opportunities."}>
<svg width={"96"} height={"96"} viewBox={"0 0 96 96"} aria-hidden={"true"}><path d={"M20 70 Q48 84 76 70 L70 80 Q48 90 26 80 Z"} fill={"#123d32"} /><path d={"M30 70 Q36 46 48 44 Q60 46 66 70 Z"} fill={"#f2e7cd"} stroke={"#123d32"} strokeWidth={"2"} /><path d={"M14 88 q8 -4 16 0 t16 0 t16 0 t16 0"} fill={"none"} stroke={"#123d32"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>
</StoryPanel>
</div>
</div>
</section>


<section id={"programmes"} className={"sec band"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>TESH Skill Development Programmes</p><h2 className={"h-sec"}>Three course options, one <em>grounding</em></h2><p className={"lede"}>Entrepreneurship &amp; Leadership in Eco-Spiritual Peace Tourism &amp; Hospitality — three progressive levels, 4 hours a day, 5 days a week.</p></div>
<div className={"progs"}>
<div id={"programme-3-month"} className={"prog-cell"}><StoryPanel tone={"green"} nav={"3 months"} navEnd={"240 hours"} title={$v?.p3Title} deck={"Basic concepts and practical skills in tourism, eco-spiritual peace tourism, hospitality, basic caregiving, entrepreneurship, personal leadership and digital skills."}>
<svg width={"80"} height={"80"} viewBox={"0 0 80 80"} aria-hidden={"true"}><path d={"M14 66c0-28 18-46 52-52-4 34-22 52-52 52Z"} fill={"#c5a15a"} stroke={"#f7f3e8"} strokeWidth={"2"} /><path d={"M14 66 48 32"} stroke={"#f7f3e8"} strokeWidth={"2"} /></svg>
</StoryPanel><div className={"cta"}><Button variant={"secondary"} href={"/programmes/3-month-foundation"}>View Programme</Button></div></div>
<div id={"programme-6-month"} className={"prog-cell"}><StoryPanel tone={"gold"} nav={"6 months"} navEnd={"480 hours"} title={$v?.p6Title} deck={"Stronger operational skills in eco-spiritual tourism, destination development, hospitality operations, international caregiving, team leadership and TESH Home practical training."}>
<svg width={"80"} height={"80"} viewBox={"0 0 80 80"} aria-hidden={"true"}><path d={"M40 10c6 8 8 14 0 22-8-8-6-14 0-22Z"} fill={"#123d32"} /><path d={"M26 38h28l-4 10H30Z"} fill={"#80664b"} stroke={"#123d32"} strokeWidth={"2"} /><path d={"M40 48v16M28 70h24M32 64h16"} stroke={"#123d32"} strokeWidth={"3"} strokeLinecap={"round"} /></svg>
</StoryPanel><div className={"cta"}><Button variant={"secondary"} href={"/programmes/6-month-professional"}>View Programme</Button></div></div>
<div id={"programme-1-year"} className={"prog-cell"}><StoryPanel tone={"forest"} nav={"1 year"} navEnd={"960 hours"} title={$v?.p12Title} deck={"Higher-level capabilities in tourism and destination management, advanced hospitality, eco-resort and wellness management, business management and TESH Home management."}>
<svg width={"80"} height={"80"} viewBox={"0 0 80 80"} aria-hidden={"true"}><path d={"M10 50 Q40 64 70 50 L64 60 Q40 72 16 60 Z"} fill={"#c5a15a"} /><path d={"M20 50 Q28 30 40 28 Q52 30 60 50 Z"} fill={"#f2e7cd"} /><path d={"M8 70 q8 -4 16 0 t16 0 t16 0 t16 0"} fill={"none"} stroke={"#f7f3e8"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>
</StoryPanel><div className={"cta"}><Button variant={"secondary"} href={"/programmes/1-year-advanced"}>View Programme</Button></div></div>
</div>

<div className={"detail"} data-swap>
<div style={css("display:flex;flex-direction:column;gap:20px")}>
<div className={"chips"}>
{($v?.progs || []).map((p: any, $index: number) => (<React.Fragment key={$index}>
<Tag active={p?.active} onClick={p?.pick}>{p?.label}</Tag>
</React.Fragment>))}
</div>
<h3 className={"h-sec"} style={css("font-size:clamp(28px,2.4vw,44px)")}>{$v?.sel?.title}</h3>
<p className={"body"} style={css("color:#5d5b4d")}>{$v?.sel?.summary}</p>
<dl className={"dl"}>
<div><dt>Duration</dt><dd>{$v?.sel?.duration}</dd></div>
<div><dt>Learning hours</dt><dd>{$v?.sel?.hours}</dd></div>
<div><dt>Mode</dt><dd>Offline</dd></div>
<div><dt>Eligibility</dt><dd>{$v?.sel?.elig}</dd></div>
</dl>
<div className={"cta"}><Button variant={"primary"} href={$v?.sel?.href}>View Programme</Button><Button variant={"quiet"} href={"#admissions"}>Enquire about admission</Button></div>
</div>
<div style={css("display:flex;flex-direction:column;gap:16px")}>
<p className={"eyebrow"}>What the programme covers</p>
<ul className={"ticks"}>
{($v?.sel?.items || []).map((it: any, $index: number) => (<React.Fragment key={$index}>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>{it}</span></li>
</React.Fragment>))}
</ul>
</div>
</div>
</div>
</section>


<section id={"curriculum"} className={"sec"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Practical learning</p><h2 className={"h-sec"}>Learn by <em>doing</em>.</h2><p className={"body"} style={css("color:#5d5b4d")}>TESH programmes are designed around practical and experiential learning. Training may include:</p></div>
<div className={"g3"} style={css("row-gap:clamp(32px,3vw,56px)")}>
<div className={"mod"}><span className={"mod-n"}>01</span><h3 className={"h-card"}>Classroom learning</h3><p className={"small"}>Understanding concepts, principles and professional knowledge.</p></div>
<div className={"mod"}><span className={"mod-n"}>02</span><h3 className={"h-card"}>Practical training</h3><p className={"small"}>Developing hands-on skills through demonstrations and supervised practice.</p></div>
<div className={"mod"}><span className={"mod-n"}>03</span><h3 className={"h-card"}>Role play &amp; simulation</h3><p className={"small"}>Practising guest service, communication, caregiving and workplace situations.</p></div>
<div className={"mod"}><span className={"mod-n"}>04</span><h3 className={"h-card"}>Field &amp; experience-based learning</h3><p className={"small"}>Understanding tourism destinations, hospitality environments, communities and nature-based experiences.</p></div>
<div className={"mod"}><span className={"mod-n"}>05</span><h3 className={"h-card"}>TESH Home practical exposure</h3><p className={"small"}>Students may receive practical exposure through TESH Home activities according to their level and programme requirements.</p><div className={"incl"}><span className={"off"}>According to level</span><span className={"off"}>Where available</span></div></div>
<div className={"mod"}><span className={"mod-n"}>06</span><h3 className={"h-card"}>Project-based learning</h3><p className={"small"}>Students work on tourism, hospitality, caregiving or entrepreneurship-related projects.</p></div>
<div className={"mod"}><span className={"mod-n"}>07</span><h3 className={"h-card"}>Leadership practice</h3><p className={"small"}>Students progressively take responsibility for activities, teams and projects.</p></div>
<div className={"mod prog-model"}><p className={"eyebrow"}>Our progression model</p><div className={"pm-cols"}><div><b>Foundation</b><span>Learn · Practise · Assist</span></div><div><b>Professional</b><span>Learn · Practise · Operate · Take responsibility</span></div><div><b>Advanced</b><span>Supervise · Lead · Manage · Create</span></div></div></div>
</div>
</div>
</section>


<section id={"tesh"} className={"sec"} style={css("background:#ffffff")}>
<div className={"wrap split"}>
<div className={"panel-art"} style={{minHeight:'clamp(320px,34vw,560px)',position:'relative',overflow:'hidden',borderRadius:'24px',boxShadow:'var(--shadow-card)'}}>
<img src={"/images/home/kerala-heritage-home-planning.webp"} alt={"Kerala Heritage Home Planning and transformation"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
</div>
<div style={css("display:flex;flex-direction:column;gap:24px")}>
<p className={"eyebrow"}>TESH Homes <span className={"tbc"}>Proposed</span></p>
<h2 className={"h-sec"}>Turning existing homes into <em>opportunities</em>.</h2>
<p className={"body"} style={css("color:#5d5b4d")}>Kerala has around 1.4 million unutilized or underutilized houses. The proposed TESH Homes initiative aims to transform suitable existing homes into TSB and TESH Homes — a distributed network of international guest houses, training centres and activity centres.</p>
<ul className={"ticks"}>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span><b>Guest houses</b> welcoming local, national and international travellers.</span></li>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span><b>Training centres</b> for practical tourism, hospitality, caregiving and enterprise learning.</span></li>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span><b>Activity centres</b> for meditation, cultural, agricultural and community activities.</span></li>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span><b>Youth entrepreneurship</b> — spaces where trained young people can learn to manage and grow enterprises.</span></li>
</ul>
<div className={"cta"}><Button variant={"secondary"} href={"/tesh-homes"}>Explore TESH Homes</Button></div>
</div>
</div>
</section>


<section id={"outcomes"} className={"sec band"}>
<div className={"wrap"}>
<div className={"g2"} style={css("align-items:start")}>
<div className={"head out-head"}>
<p className={"eyebrow"}>Career pathway</p>
<h2 className={"h-sec"}>From training to <em>enterprise</em></h2>
<p className={"lede"}>Global citizenship through global entrepreneurship and e-commerce.</p><p className={"small"}>An intended pathway — not a guaranteed placement or income.</p>
</div>
<div>
<div className={"out"}><span className={"out-n"}>i.</span><div style={css("display:flex;flex-direction:column;gap:6px")}><h3 className={"h-card"} style={css("font-size:24px")}>Training</h3><p className={"body"}>Youth receive practical training through the Eco-Spiritual Peace Tourism Programme in tourism, hospitality, caregiving and global entrepreneurship.</p></div></div>
<div className={"out"}><span className={"out-n"}>ii.</span><div style={css("display:flex;flex-direction:column;gap:6px")}><h3 className={"h-card"} style={css("font-size:24px")}>Practical Experience</h3><p className={"body"}>Hands-on experience through TESH Homes, training centres and community-based activities, as these become available.</p></div></div>
<div className={"out"}><span className={"out-n"}>iii.</span><div style={css("display:flex;flex-direction:column;gap:6px")}><h3 className={"h-card"} style={css("font-size:24px")}>TESH Home Management</h3><p className={"body"}>Trained youth may take up roles in managing TESH Homes — guest services, hospitality, tourism, caregiving, wellness, facility management, sustainable agriculture and digital activities — as the proposed network develops.</p></div></div>
<div className={"out"} style={css("border-bottom:0")}><span className={"out-n"}>iv.</span><div style={css("display:flex;flex-direction:column;gap:6px")}><h3 className={"h-card"} style={css("font-size:24px")}>Youth Entrepreneurship</h3><p className={"body"}>Experienced youth can move beyond employment and create their own sustainable enterprises connected to the TESH ecosystem.</p></div></div>
</div>
</div>
</div>
</section>


<section id={"careers"} className={"sec"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Career &amp; enterprise areas</p><h2 className={"h-sec"}>Where this could <em>lead</em></h2><p className={"small"}>Intended career and enterprise pathways — not guaranteed placements or earnings.</p></div>
<div className={"g4"}>
<div className={"role"}><h3 className={"h-card"} style={css("font-size:22px")}>Guest services &amp; hospitality</h3><p className={"small"}>Guest services, hospitality operations, and house and facility management.</p></div>
<div className={"role"}><h3 className={"h-card"} style={css("font-size:22px")}>Tourism &amp; tour services</h3><p className={"small"}>Tourism activities, eco-tourism experiences and tour &amp; travel services.</p></div>
<div className={"role"}><h3 className={"h-card"} style={css("font-size:22px")}>TESH Home management</h3><p className={"small"}>Roles within the proposed TESH Homes network, and homestay / guesthouse enterprises.</p></div>
<div className={"role"}><h3 className={"h-card"} style={css("font-size:22px")}>Wellness &amp; spiritual tourism</h3><p className={"small"}>Wellness and meditation activities; wellness and spiritual tourism services.</p></div>
<div className={"role"}><h3 className={"h-card"} style={css("font-size:22px")}>Caregiving services</h3><p className={"small"}>Subject to the relevant requirements.</p></div>
<div className={"role"}><h3 className={"h-card"} style={css("font-size:22px")}>Agriculture, digital &amp; community</h3><p className={"small"}>Sustainable / AI-enabled agriculture, local products and community enterprises, and digital tourism and service businesses.</p></div>
<div className={"founder"}><p className={"eyebrow"} style={css("color:#123d32")}>Youth entrepreneurship</p><h3 className={"h-card"} style={css("font-size:clamp(24px,2vw,32px)")}>Move beyond employment and create your own sustainable enterprise connected to the TESH ecosystem.</h3><div className={"cta"}><Button variant={"primary"} href={"/tesh-homes#careers"}>See career pathways</Button></div></div>
</div>
</div>
</section>


<section id={"certification"} className={"sec"} style={css("background:#ffffff")}>
<div className={"wrap split"}>
<div style={css("display:flex;flex-direction:column;gap:24px")}>
<p className={"eyebrow"}>Certification</p>
<h2 className={"h-sec"}>Recognising what you <em>learn</em> and practise</h2>
<p className={"body"} style={css("color:#5d5b4d")}>Participants who successfully complete the applicable training requirements receive a TESH Skill Development Experience Certificate, subject to programme completion and assessment requirements.</p>
<ul className={"ticks"}>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Awarded on completing training and assessment requirements</span></li>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Available for the 3-month, 6-month and 1-year programmes</span></li>
<li><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Award title for each level <span className={"tbc"}>To be confirmed</span></span></li>
</ul>
</div>
<div className={"cert"}>
<svg width={"56"} height={"56"} viewBox={"0 0 56 56"} aria-hidden={"true"}><circle cx={"28"} cy={"28"} r={"26"} fill={"#c5a15a"} /><path d={"M18 36c0-12 8-20 20-22-2 12-8 20-20 22Z"} fill={"#123d32"} /></svg>
<p className={"eyebrow"} style={css("color:#80664b")}>Chaitanya Keralam</p>
<p style={css("margin:0;font-family:var(--font-serif);font-weight:300;font-size:clamp(28px,2.6vw,44px);line-height:1.1")}>TESH Skill Development <em>Experience</em> Certificate</p>
<p className={"small"}>awarded to</p>
<p style={css("margin:0;font-family:var(--font-serif);font-style:italic;font-size:26px;border-bottom:1px solid #c5a15a;padding:0 24px 6px")}>[Participant name]</p>
<p className={"small"}>[Programme level] · [Date] · [Issuing organisation]</p>
</div>
</div>
</section>


<section id={"gallery"} className={"sec"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Gallery</p><h2 className={"h-sec"}>Glimpses of <em>Kerala</em></h2></div>
<div className={"gal"}>
<figure className={"tile t-wide t-tall"}><img src={"/images/home/kerala-backwaters-storytime.webp"} alt={"Kerala backwaters"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Backwaters</figcaption></figure>
<figure className={"tile"}><img src={"/images/home/tropical-veranda-hospitality-scene.webp"} alt={"Hospitality practice"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Hospitality practice</figcaption></figure>
<figure className={"tile"}><img src={"/images/home/sunrise-over-misty-tea-hills.webp"} alt={"Hill landscapes"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Hill landscapes</figcaption></figure>
<figure className={"tile"}><img src={"/images/home/kerala-courtyard-heritage-tour.webp"} alt={"Heritage and culture"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Heritage &amp; culture</figcaption></figure>
<figure className={"tile"}><img src={"/images/home/exploring-cardamom-in-the-spice-forest.webp"} alt={"Spice plantation & nature"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Spice plantation</figcaption></figure>
<figure className={"tile t-wide"}><img src={"/images/home/kerala-village-walk-with-friends.webp"} alt={"Learning together and village walk"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Learning together</figcaption></figure>
<figure className={"tile t-wide"}><img src={"/images/home/golden-trails-through-the-misty-forest.webp"} alt={"Forest wellness and peace"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /><figcaption>Wellness &amp; peace</figcaption></figure>
</div>
</div>
</section>


<section id={"admissions"} className={"sec band"}>
<div className={"wrap g2"} style={css("align-items:start")}>
<div style={css("display:flex;flex-direction:column;gap:24px")}>
<p className={"eyebrow"}>Admissions</p>
<h2 className={"h-sec"}>Begin your journey with <em>Chaitanya Keralam</em>.</h2>
<p className={"body"} style={css("color:#5d5b4d")}>Programmes begin <b>December 2026</b>. The programmes are for youth aged <b>18–29 years</b>; the 3-month and 6-month curricula state Plus Two / Higher Secondary or equivalent eligibility. Selection is through credentials, an aptitude test, an interview and a group discussion.</p>
<ol className={"steps"}>
<li className={"step"}><span className={"step-n"}>1</span><div><h3 className={"h-card"} style={css("font-size:22px")}>Enquire</h3><p className={"small"}>Send the enquiry form to register your interest.</p></div></li>
<li className={"step"}><span className={"step-n"}>2</span><div><h3 className={"h-card"} style={css("font-size:22px")}>Credentials</h3><p className={"small"}>Share your academic and extracurricular credentials.</p></div></li>
<li className={"step"}><span className={"step-n"}>3</span><div><h3 className={"h-card"} style={css("font-size:22px")}>Aptitude test</h3><p className={"small"}>A short test of aptitude for the programme.</p></div></li>
<li className={"step"} style={css("border-bottom:0")}><span className={"step-n"}>4</span><div><h3 className={"h-card"} style={css("font-size:22px")}>Interview &amp; group discussion</h3><p className={"small"}>Meet the team and take part in a group discussion.</p></div></li>
</ol>
<div className={"cta"}><Button variant={"quiet"} href={"/programmes#admissions"}>Full eligibility &amp; selection details</Button></div>
</div>
<div className={"form"}>
<h3 className={"h-card"}>Admission enquiry</h3>
<div className={"frow"}>
<TextField label={"Full name"} placeholder={"Your name"} autocomplete={"name"} />
<TextField label={"Age"} type={"number"} placeholder={"18–29"} min={"18"} max={"29"} />
</div>
<TextField label={"Email"} type={"email"} placeholder={"you@example.com"} autocomplete={"email"} />
<TextField label={"Phone"} type={"tel"} placeholder={"+91"} autocomplete={"tel"} />
<div style={css("display:flex;flex-direction:column;gap:8px")}>
<label className={"kn-field-label"} htmlFor={"prog"}>Programme</label>
<select id={"prog"} className={"sel"}><option>3-Month Foundation</option><option>6-Month Professional</option><option>1-Year Advanced</option><option>Not sure yet</option></select>
</div>
{!!($v?.sent) && (<>
<p className={"thanks"}>Thank you — our admissions team will be in touch soon.</p>
</>)}
<Button variant={"primary"} onClick={$v?.submit}>Enquire About Admission</Button>
<p className={"small"}>We use your details only to respond to your enquiry.</p>
</div>
</div>
</section>


<section id={"next-chapter"} className={"ab"}>
<div className={"wrap"}>
<div className={"ab-head"}>
<p className={"eyebrow"}>Join us</p>
<h2 className={"ab-title"}>Be part of Kerala's next <em>chapter</em>.</h2>
<p className={"body"} style={css("color:#5d5b4d;max-width:620px")}>Connect responsible tourism, practical learning, community development and sustainable livelihoods.</p>
<div className={"cta"}>
<Button variant={"primary"} href={"/programmes"}>Explore Programmes</Button>
<Button variant={"secondary"} href={"/tesh-homes#partner"}>Partner With Us</Button>
</div>
</div>
</div>
</section>


<Footer />
</>
    );
  }
}
