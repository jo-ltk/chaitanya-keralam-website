'use client';
/* TESH Skill Development Programmes, in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md).
   A different composition from About and Tourism: a light (paper) opener with a level index, a panorama,
   dark vertical tabs for the learning areas, three level columns, a chapter, a format grid and the admission form. */
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
const HOME = '/images/home';
const PROG = '/images/programmes';

const GLANCE = [
  { code: '3M', title: '3-Month Foundation', meta: '240 training hours · Offline', href: '/programmes/3-month-foundation' },
  { code: '6M', title: '6-Month Professional', meta: '480 training hours · Offline', href: '/programmes/6-month-professional' },
  { code: '1Y', title: '1-Year Advanced', meta: '960 training hours · Offline', href: '/programmes/1-year-advanced' },
];

const AREAS = [
  { title: 'Eco-Spiritual Peace Tourism & Travel',
    text: 'Knowledge and practical skills related to tourism experiences — exploring the connection between nature, ecology, spirituality, peace, wellness, culture and responsible travel.',
    topics: ['Tourism experiences', 'Travel planning', 'Destination development', 'Interpretation', 'Responsible tourism'],
    scene: 'backwater' as Scene, src: `${PROG}/tourism-area.png`, alt: 'Travellers listening to stories by the backwaters' },
  { title: 'Eco-Spiritual Hospitality',
    text: 'Practical hospitality skills for eco-friendly and wellness-oriented tourism environments.',
    topics: ['Guest relations', 'Front office', 'Housekeeping', 'Food & beverage service', 'Guest experience', 'Wellness hospitality', 'Retreat hospitality', 'Eco-hospitality'],
    scene: 'dusk' as Scene, src: `${PROG}/hospitality-area.jpg`, alt: 'A table set for guests on a Kerala veranda' },
  { title: 'International Caregiving',
    text: 'Foundational and progressive caregiving skills that can support opportunities in care-related services. Caregiving is integrated as a specialised skill area within the broader eco-spiritual tourism and hospitality programme.',
    topics: ['Personal care', 'Daily living support', 'Elderly care', 'Vulnerable person care', 'Mobility support', 'Nutrition and safe assistance', 'Emotional and social wellbeing', 'Communication', 'Basic first aid and emergency awareness', 'Care documentation'],
    scene: 'temple' as Scene, src: `${PROG}/caregiving-area.png`, alt: 'Gentle wellness exercise in a sunlit garden room' },
  { title: 'Global Entrepreneurship & Leadership',
    text: 'The mindset and practical abilities required to become an entrepreneur and responsible leader.',
    topics: ['Entrepreneurial mindset', 'Opportunity identification', 'Market research', 'Business models', 'Business planning', 'Costing and pricing', 'Digital marketing', 'Team management', 'Communication', 'Leadership', 'Project development'],
    scene: 'culture' as Scene, src: `${PROG}/entrepreneurship-area.png`, alt: 'Young people planning a project in a Kerala heritage home' },
];

const LEVELS = [
  { code: '3M', level: 'Foundation level', title: '3-Month Foundation', duration: '3 months', hours: '240 training hours', eligibility: 'Plus Two / Higher Secondary or equivalent',
    focus: 'Introduces the basic concepts and practical skills of tourism & travel, eco-spiritual peace tourism, hospitality, basic caregiving, eco-hospitality, entrepreneurship, personal leadership and digital skills.',
    progression: 'Learn · Practise · Assist', href: '/programmes/3-month-foundation',
    scene: 'tea' as Scene, src: `${PROG}/level-3-month.png`, alt: 'Students learning together on a tropical veranda' },
  { code: '6M', level: 'Professional level', title: '6-Month Professional', duration: '6 months', hours: '480 training hours', eligibility: 'Plus Two / Higher Secondary or equivalent',
    focus: 'Develops stronger operational skills in eco-spiritual tourism, destination development, tour and itinerary planning, sustainable tourism, hospitality operations, international caregiving, entrepreneurship, business development, team leadership and TESH Home practical training.',
    progression: 'Learn · Practise · Operate · Take responsibility', href: '/programmes/6-month-professional',
    scene: 'dusk' as Scene, src: `${PROG}/level-6-month.png`, alt: 'A warm welcome on a Kerala veranda' },
  { code: '1Y', level: 'Advanced level', title: '1-Year Advanced', duration: '12 months', hours: '960 training hours', eligibility: null,
    focus: 'Develops higher-level capabilities in tourism and destination management, tour operations, tourism experience design, advanced hospitality management, eco-resort and wellness management, advanced caregiving, entrepreneurship, business management, financial skills, digital marketing, leadership and supervision, TESH Home management, and business and management projects.',
    progression: 'Supervise · Lead · Manage · Create', href: '/programmes/1-year-advanced',
    scene: 'culture' as Scene, src: `${PROG}/level-1-year.png`, alt: 'Collaborative learning in a sunlit lab' },
];

const FORMATS = [
  { t: 'Classroom learning', d: 'Understanding concepts, principles and professional knowledge.' },
  { t: 'Practical training', d: 'Hands-on skills through demonstrations and supervised practice.' },
  { t: 'Role play & simulation', d: 'Practising guest service, communication, caregiving and workplace situations.' },
  { t: 'Field & experience-based learning', d: 'Destinations, hospitality environments, communities and nature-based experiences.' },
  { t: 'TESH Home practical exposure', d: 'According to level and programme requirements, where available.' },
  { t: 'Project-based learning', d: 'Tourism, hospitality, caregiving or entrepreneurship-related projects.' },
  { t: 'Leadership practice', d: 'Progressively taking responsibility for activities, teams and projects.' },
  { t: 'Assessment & certification', d: 'Assessment of learning, and a TESH Skill Development Experience Certificate on completion.' },
];

const STEPS = [
  { t: 'Credentials', d: 'Academic and extracurricular credentials.' },
  { t: 'Aptitude test', d: 'An assessment of aptitude for the programme.' },
  { t: 'Interview', d: 'A conversation with the programme team.' },
  { t: 'Group discussion', d: 'Teamwork and communication in a group setting.' },
];

/* Learning areas: vertical tabs. Own component so switching never re-renders the split headings elsewhere. */
function Areas() {
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const a = AREAS[cur];
  const paused = held || !onScreen || pageHidden;
  const go = (i: number, focus = false) => {
    const n = (i + AREAS.length) % AREAS.length;
    setCur(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
  };
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    const vis = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  return (
    <div ref={root} className="area-tabs"
      onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
    >
        <div className={`area-tab-list tabs-auto${paused ? ' is-paused' : ''}`} role="tablist" aria-label="Learning areas" aria-orientation="vertical">
          {AREAS.map((ar, i) => (
            <button key={ar.title} ref={(el) => { tabs.current[i] = el; }} className="area-tab" type="button" role="tab"
              id={`area-tab-${i}`} aria-selected={i === cur} aria-controls="area-panel" tabIndex={i === cur ? 0 : -1}
              onClick={() => go(i)} onKeyDown={(e) => onKey(e, i)}>
              <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="area-tab-t">{ar.title}</span>
              <span className="arrow" aria-hidden="true">→</span>
              {i === cur && <span className="area-bar" aria-hidden="true" onAnimationEnd={() => go(cur + 1)} />}
            </button>
          ))}
        </div>
      <div className="area-panel" id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${cur}`} key={a.title}>
    <div className="ph r-16x9 area-img">
      <div className={`bg s-${a.scene}`}>{a.src && <img className="theme-img" src={a.src} alt={a.alt} loading="lazy" decoding="async" />}</div>
      <span className="slot">[Image — {a.alt}]<small>1600×900 · 16:9</small></span>
    </div>
        <div className="theme-copy">
          <h3 className="area-panel-t">{a.title}</h3>
          <p className="lead">{a.text}</p>
          <span className="kicker">Key areas include</span>
          <ul className="topics">{a.topics.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

/* Admission enquiry. Same behaviour as before the redesign: confirms on screen, nothing is sent yet. */
function AdmissionForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); };
  return (
    <form className="form" id="admission-form" onSubmit={onSubmit} aria-labelledby="formH">
      <h3 className="form-t field full" id="formH">Admission enquiry</h3>
      <div className="field"><label htmlFor="a-name">Full name</label><input id="a-name" name="fullName" autoComplete="name" placeholder="Your name" /></div>
      <div className="field"><label htmlFor="a-age">Age</label><input id="a-age" name="age" type="number" min={18} max={29} inputMode="numeric" placeholder="18–29" /></div>
      <div className="field"><label htmlFor="a-email">Email</label><input id="a-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="a-phone">Phone</label><input id="a-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" /></div>
      <div className="field full"><label htmlFor="prog">Programme</label>
        <select id="prog" name="programme"><option>3-Month Foundation</option><option>6-Month Professional</option><option>1-Year Advanced</option><option>Not sure yet</option></select>
      </div>
      <div className="form-foot">
        <p className="consent">We use your details only to respond to your enquiry.</p>
        <button className="btn btn-ink" type="submit"><span>Enquire About Admission</span><Arrow /></button>
      </div>
      {sent && <p className="form-note" role="status">Thank you — our admissions team will be in touch soon.</p>}
    </form>
  );
}

export default function ProgrammesPage() {
  const main = useRef<HTMLElement>(null);
  useCKMotion(main);

  return (
    <>
      <SiteNav overDarkHero={false} />

      <main id="top" ref={main}>
        {/* 1 · Paper opener with level index */}
        <section className="section paper-hero prog-hero" aria-labelledby="pageH">
          <div className="wrap prog-hero-in">
            <div className="prog-hero-text">
              <p className="label crumbs"><Link href="/">Home</Link> / Programmes</p>
              <span className="kicker">TESH Skill Development Programmes</span>
              <h1 className="paper-title" id="pageH" data-split>Build practical skills. Create opportunities. Lead with purpose.</h1>
              <p className="prog-sub" data-reveal>Entrepreneurship &amp; Leadership in Eco-Spiritual Peace Tourism &amp; Hospitality</p>
              <p className="lead" data-reveal>The TESH Skill Development Programmes are designed for young people who want to develop practical skills and explore career and entrepreneurial opportunities in eco-spiritual tourism, trading, technology, hospitality, caregiving and related services.</p>
              <div className="prog-actions" data-reveal>
                <a className="btn btn-ink" href="#compare"><span>Compare programmes</span><Arrow /></a>
                <a className="tlink" href="#admissions"><span>Eligibility &amp; selection</span><Arrow /></a>
              </div>
            </div>
            <nav className="glance" aria-label="Programmes at a glance" data-reveal>
              <span className="kicker">At a glance</span>
              <ul>
                {GLANCE.map((g) => (
                  <li key={g.code}><Link href={g.href}>
                    <span className="glance-code">{g.code}</span>
                    <span className="glance-t"><b>{g.title}</b><span>{g.meta}</span></span>
                    <Arrow />
                  </Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* 2 · Panorama + on-page index */}
        <section className="section" aria-label="On this page" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Ph ratio="21x9" scene="tea" src={`${PROG}/panorama-study-circle.png`} alt="A study circle on a tropical veranda" slot="Panorama — Study circle on a veranda" meta="2880×1234 · 21:9" inner={6} reveal />
            <nav className="page-index" aria-label="On this page">
              <ul>
                <li><a className="tlink" href="#areas"><span>Learning areas</span><Arrow /></a></li>
                <li><a className="tlink" href="#compare"><span>Compare programmes</span><Arrow /></a></li>
                <li><a className="tlink" href="#format"><span>Learning format</span><Arrow /></a></li>
                <li><a className="tlink" href="#admissions"><span>Eligibility &amp; admissions</span><Arrow /></a></li>
              </ul>
            </nav>
          </div>
        </section>

        {/* 3 · Learning areas (dark vertical tabs) */}
        <section className="dark section areas" id="areas" aria-labelledby="areasH">
          <div className="wrap">
            <span className="kicker areas-k">Four learning areas</span>
            <div className="head-row"><h2 className="h-section" id="areasH" data-split>What you will study</h2></div>
            <div data-reveal><Areas /></div>
          </div>
        </section>

        {/* 4 · Three levels */}
        <section className="section" id="compare" aria-labelledby="compareH">
          <div className="wrap">
            <span className="label">Programme comparison</span>
            <div className="head-row">
              <h2 className="h-section" id="compareH" data-split>Three levels, one pathway</h2>
              <p className="lead" data-reveal>All levels: 4 hours a day, 5 days a week.</p>
            </div>
            <ul className="levels">
              {LEVELS.map((l) => (
                <li key={l.code} className="level" data-reveal>
                  <Ph ratio="4x5" scene={l.scene} src={l.src} alt={l.alt} slot={`Portrait — ${l.alt}`} meta="1200×1500 · 4:5" />
                  <div className="level-head">
                    <span className="level-code" aria-hidden="true">{l.code}</span>
                    <span className="label">{l.level}</span>
                    <h3>{l.title}</h3>
                  </div>
                  <ul className="level-facts" aria-label={`${l.title} details`}>
                    <li><b>{l.duration}</b></li>
                    <li><b>{l.hours}</b></li>
                    <li><b>Offline</b></li>
                  </ul>
                  <p className="level-elig"><span>Eligibility</span>{l.eligibility ?? <span className="tbc" style={{ marginLeft: 0 }}>To be confirmed</span>}</p>
                  <p className="level-focus">{l.focus}</p>
                  <p className="level-prog"><span className="kicker">Progression</span>{l.progression}</p>
                  <Link className="btn btn-line" href={l.href}><span>View Programme</span><Arrow /></Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5 · Learning format (chapter) */}
        <section className="dark chapter ch-3 chapter-tight" aria-labelledby="ch3">
          <div className="wrap chapter-stage">
            <span className="kicker chapter-no">Learning format</span>
            <Ph ratio="4x5" scene="culture" src={`${PROG}/doing-chapter-main.png`} alt="Guidance in a sunlit Kerala computer lab" slot="Portrait — Guidance in a sunlit computer lab" meta="1200×1500 · 4:5" inner={7} className="chapter-media" />
            <h2 className="chapter-word" id="ch3" data-drift="-6">Doing</h2>
            <div className="chapter-copy" data-reveal>
              <p>Learn by doing. TESH programmes are designed around practical and experiential learning. Training may include the formats below.</p>
              <a className="tlink" href="#format"><span>See the formats</span><Arrow /></a>
            </div>
            <Ph ratio="3x2" scene="tea" src={`${PROG}/doing-chapter-tea.jpg`} alt="Warm tea on a tropical veranda" slot="Image — Tea on a veranda" meta="1500×1000 · 3:2" reveal className="chapter-inset chapter-inset-lg" />
          </div>
        </section>

        {/* 6 · Formats grid + training hours */}
        <section className="section" id="format" aria-labelledby="formatH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="formatH" data-split>How training works</h2>
              <p className="lead" data-reveal>Training schedule: 4 hours a day, 5 days a week.</p>
            </div>
            <div className="facts hours" data-reveal>
              <div className="fact"><b>240</b><span>Training hours · 3 months</span></div>
              <div className="fact"><b>480</b><span>Training hours · 6 months</span></div>
              <div className="fact"><b>960</b><span>Training hours · 1 year</span></div>
            </div>
            <ol className="formats">
              {FORMATS.map((f, i) => (
                <li key={f.t} data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7 · Eligibility, selection and admission enquiry */}
        <section className="section admissions" id="admissions" aria-labelledby="admH">
          <div className="wrap">
            <span className="label">Eligibility &amp; selection</span>
            <div className="head-row"><h2 className="h-section" id="admH" data-split>Who can apply, and how</h2></div>
            <ol className="steps" aria-label="Selection criteria">
              {STEPS.map((s, i) => (
                <li key={s.t} data-reveal><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></li>
              ))}
            </ol>
            <div className="contact-grid admit-grid">
              <div className="admit-info">
                <div className="facts facts-words" data-reveal>
                  <div className="fact"><span>Target age group</span><b>18–29</b><span>18 to 29 years — for visionary young leaders who want to develop practical skills and explore income-generating opportunities.</span></div>
                  <div className="fact"><span>Eligibility</span><b>Plus Two</b><span>The 3-month and 6-month curriculum documents state Plus Two / Higher Secondary or equivalent eligibility.</span></div>
                  <div className="fact"><span>Planned commencement</span><b>Dec 2026</b><span>Programmes begin December 2026.</span></div>
                </div>
                <p className="form-note cert" data-reveal><b>Experience certificate.</b> Participants who successfully complete the applicable training requirements receive a TESH Skill Development Experience Certificate, subject to programme completion and assessment requirements.</p>
              </div>
              <div data-reveal><AdmissionForm /></div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
