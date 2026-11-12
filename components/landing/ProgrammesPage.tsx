'use client';
/* TESH Skill Development Programmes, in the landing-page design language (docs/LANDING-PAGE-DESIGN-SYSTEM.md).
   A different composition from About and Tourism: a light (paper) opener with a level index, a panorama,
   dark vertical tabs for the learning areas, three level columns, a chapter, a format grid and the admission form.
   Copy and images come from the Payload "Programmes page" global (lib/programmes-content.ts). */
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';
import type { ProgrammesContent } from '@/lib/programmes-content';

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
// Placeholder tint behind each image while it loads (design only, not CMS content).
const SCENES = {
  areas: ['backwater', 'dusk', 'temple', 'culture'] as Scene[],
  levels: ['tea', 'dusk', 'culture'] as Scene[],
};
const sceneAt = (list: Scene[], i: number) => list[i % list.length];

/* Learning areas: vertical tabs. Own component so switching never re-renders the split headings elsewhere. */
function Areas({ items, topicsLabel }: { items: ProgrammesContent['areas']['items']; topicsLabel: string }) {
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const a = items[cur] ?? items[0];
  const paused = held || !onScreen || pageHidden;
  const go = (i: number, focus = false) => {
    const n = (i + items.length) % items.length;
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
          {items.map((ar, i) => (
            <button key={i} ref={(el) => { tabs.current[i] = el; }} className="area-tab" type="button" role="tab"
              id={`area-tab-${i}`} aria-selected={i === cur} aria-controls="area-panel" tabIndex={i === cur ? 0 : -1}
              onClick={() => go(i)} onKeyDown={(e) => onKey(e, i)}>
              <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="area-tab-t">{ar.title}</span>
              <span className="arrow" aria-hidden="true">→</span>
              {i === cur && <span className="area-bar" aria-hidden="true" onAnimationEnd={() => go(cur + 1)} />}
            </button>
          ))}
        </div>
      <div className="area-panel" id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${cur}`} key={cur}>
    <div className="ph r-16x9 area-img">
      <div className={`bg s-${sceneAt(SCENES.areas, cur)}`}>{a.image.url && <img className="theme-img" src={a.image.url} alt={a.image.alt} loading="lazy" decoding="async" />}</div>
      <span className="slot">[Image — {a.image.alt}]<small>1600×900 · 16:9</small></span>
    </div>
        <div className="theme-copy">
          <h3 className="area-panel-t">{a.title}</h3>
          <p className="lead">{a.text}</p>
          <span className="kicker">{topicsLabel}</span>
          <ul className="topics">{a.topics.map((t, i) => <li key={i}>{t.value}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

/* Admission enquiry. Same behaviour as before the redesign: confirms on screen, nothing is sent yet. */
function AdmissionForm({ f }: { f: ProgrammesContent['form'] }) {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); };
  return (
    <form className="form" id="admission-form" onSubmit={onSubmit} aria-labelledby="formH">
      <h3 className="form-t field full" id="formH">{f.heading}</h3>
      <div className="field"><label htmlFor="a-name">{f.nameLabel}</label><input id="a-name" name="fullName" autoComplete="name" placeholder={f.namePlaceholder} /></div>
      <div className="field"><label htmlFor="a-age">{f.ageLabel}</label><input id="a-age" name="age" type="number" min={18} max={29} inputMode="numeric" placeholder={f.agePlaceholder} /></div>
      <div className="field"><label htmlFor="a-email">{f.emailLabel}</label><input id="a-email" name="email" type="email" autoComplete="email" placeholder={f.emailPlaceholder} /></div>
      <div className="field"><label htmlFor="a-phone">{f.phoneLabel}</label><input id="a-phone" name="phone" type="tel" autoComplete="tel" placeholder={f.phonePlaceholder} /></div>
      <div className="field full"><label htmlFor="prog">{f.programmeLabel}</label>
        <select id="prog" name="programme">{f.programmeOptions.map((o, i) => <option key={i}>{o.value}</option>)}</select>
      </div>
      <div className="form-foot">
        <p className="consent">{f.consent}</p>
        <button className="btn btn-ink" type="submit"><span>{f.button}</span><Arrow /></button>
      </div>
      {sent && <p className="form-note" role="status">{f.thanks}</p>}
    </form>
  );
}

export default function ProgrammesPage({ content: c }: { content: ProgrammesContent }) {
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
              <p className="label crumbs"><Link href="/">{c.hero.crumbHome}</Link> / {c.hero.crumbCurrent}</p>
              <span className="kicker">{c.hero.kicker}</span>
              <h1 className="paper-title" id="pageH" data-split>{c.hero.title}</h1>
              <p className="prog-sub" data-reveal>{c.hero.subtitle}</p>
              <p className="lead" data-reveal>{c.hero.lead}</p>
              <div className="prog-actions" data-reveal>
                <a className="btn btn-ink" href="#compare"><span>{c.hero.button}</span><Arrow /></a>
                <a className="tlink" href="#admissions"><span>{c.hero.link}</span><Arrow /></a>
              </div>
            </div>
            <nav className="glance" aria-label="Programmes at a glance" data-reveal>
              <span className="kicker">{c.hero.glanceKicker}</span>
              <ul>
                {c.hero.glance.map((g, i) => (
                  <li key={i}><Link href={g.href}>
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
            <Ph ratio="21x9" scene="tea" src={c.panorama.image.url} alt={c.panorama.image.alt} slot={`Panorama — ${c.panorama.image.alt}`} meta="2880×1234 · 21:9" inner={6} reveal />
            <nav className="page-index" aria-label="On this page">
              <ul>
                <li><a className="tlink" href="#areas"><span>{c.panorama.linkAreas}</span><Arrow /></a></li>
                <li><a className="tlink" href="#compare"><span>{c.panorama.linkCompare}</span><Arrow /></a></li>
                <li><a className="tlink" href="#format"><span>{c.panorama.linkFormat}</span><Arrow /></a></li>
                <li><a className="tlink" href="#admissions"><span>{c.panorama.linkAdmissions}</span><Arrow /></a></li>
              </ul>
            </nav>
          </div>
        </section>

        {/* 3 · Learning areas (dark vertical tabs) */}
        <section className="dark section areas" id="areas" aria-labelledby="areasH">
          <div className="wrap">
            <span className="kicker areas-k">{c.areas.kicker}</span>
            <div className="head-row"><h2 className="h-section" id="areasH" data-split>{c.areas.heading}</h2></div>
            <div data-reveal><Areas items={c.areas.items} topicsLabel={c.areas.topicsLabel} /></div>
          </div>
        </section>

        {/* 4 · Three levels */}
        <section className="section" id="compare" aria-labelledby="compareH">
          <div className="wrap">
            <span className="label">{c.compare.label}</span>
            <div className="head-row">
              <h2 className="h-section" id="compareH" data-split>{c.compare.heading}</h2>
              <p className="lead" data-reveal>{c.compare.lead}</p>
            </div>
            <ul className="levels">
              {c.compare.levels.map((l, i) => (
                <li key={i} className="level" data-reveal>
                  <Ph ratio="4x5" scene={sceneAt(SCENES.levels, i)} src={l.image.url} alt={l.image.alt} slot={`Portrait — ${l.image.alt}`} meta="1200×1500 · 4:5" />
                  <div className="level-head">
                    <span className="level-code" aria-hidden="true">{l.code}</span>
                    <span className="label">{l.level}</span>
                    <h3>{l.title}</h3>
                  </div>
                  <ul className="level-facts" aria-label={`${l.title} details`}>
                    <li><b>{l.duration}</b></li>
                    <li><b>{l.hours}</b></li>
                    <li><b>{l.mode}</b></li>
                  </ul>
                  <p className="level-elig"><span>{c.compare.eligibilityLabel}</span>{l.eligibility || <span className="tbc" style={{ marginLeft: 0 }}>{c.compare.eligibilityTbc}</span>}</p>
                  <p className="level-focus">{l.focus}</p>
                  <p className="level-prog"><span className="kicker">{c.compare.progressionLabel}</span>{l.progression}</p>
                  <Link className="btn btn-line" href={l.href}><span>{c.compare.button}</span><Arrow /></Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5 · Learning format (chapter) */}
        <section className="dark chapter ch-3 chapter-tight" aria-labelledby="ch3">
          <div className="wrap chapter-stage">
            <span className="kicker chapter-no">{c.chapter.kicker}</span>
            <Ph ratio="4x5" scene="culture" src={c.chapter.image.url} alt={c.chapter.image.alt} slot={`Portrait — ${c.chapter.image.alt}`} meta="1200×1500 · 4:5" inner={7} className="chapter-media" />
            <h2 className="chapter-word" id="ch3" data-drift="-6">{c.chapter.word}</h2>
            <div className="chapter-copy" data-reveal>
              <p>{c.chapter.text}</p>
              <a className="tlink" href="#format"><span>{c.chapter.link}</span><Arrow /></a>
            </div>
            <Ph ratio="3x2" scene="tea" src={c.chapter.inset.url} alt={c.chapter.inset.alt} slot={`Image — ${c.chapter.inset.alt}`} meta="1500×1000 · 3:2" reveal className="chapter-inset chapter-inset-lg" />
          </div>
        </section>

        {/* 6 · Formats grid + training hours */}
        <section className="section" id="format" aria-labelledby="formatH">
          <div className="wrap">
            <div className="head-row">
              <h2 className="h-section" id="formatH" data-split>{c.formats.heading}</h2>
              <p className="lead" data-reveal>{c.formats.lead}</p>
            </div>
            <div className="facts hours" data-reveal>
              {c.formats.hours.map((h, i) => (
                <div key={i} className="fact"><b>{h.value}</b><span>{h.label}</span></div>
              ))}
            </div>
            <ol className="formats">
              {c.formats.items.map((f, i) => (
                <li key={i} data-reveal>
                  <span className="row-no">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7 · Eligibility, selection and admission enquiry */}
        <section className="section admissions" id="admissions" aria-labelledby="admH">
          <div className="wrap">
            <span className="label">{c.admissions.label}</span>
            <div className="head-row"><h2 className="h-section" id="admH" data-split>{c.admissions.heading}</h2></div>
            <ol className="steps" aria-label="Selection criteria">
              {c.admissions.steps.map((s, i) => (
                <li key={i} data-reveal><b>{i + 1}</b><h3>{s.title}</h3><p>{s.text}</p></li>
              ))}
            </ol>
            <div className="contact-grid admit-grid">
              <div className="admit-info">
                <div className="facts facts-words" data-reveal>
                  {c.admissions.facts.map((f, i) => (
                    <div key={i} className="fact"><span>{f.label}</span><b>{f.value}</b><span>{f.text}</span></div>
                  ))}
                </div>
                <p className="form-note cert" data-reveal><b>{c.admissions.certificateTitle}</b> {c.admissions.certificateText}</p>
              </div>
              <div data-reveal><AdmissionForm f={c.form} /></div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
