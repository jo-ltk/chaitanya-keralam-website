'use client';
/* Kerala Nature Editorial Design System (KNEDS) components, ported from ds/kneds/components/bundle.js. Styles: app/styles/kneds-components.css */
import React from 'react';

function cx(...a: any[]) { return a.filter(Boolean).join(' '); }
function omit(o: any, keys: string[]) { const r: any = {}; for (const k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }

export function Button(p: any) {
  const variant = p.variant || 'primary', size = p.size || 'md';
  const rest = omit(p, ['variant', 'size', 'className', 'children', 'href']);
  const cls = cx('kn-btn', 'kn-btn-' + variant, size === 'sm' && 'kn-btn-sm', p.className);
  if (p.href) return <a href={p.href} className={cls} {...rest}>{p.children}</a>;
  return <button type="button" className={cls} {...rest}>{p.children}</button>;
}

export function Tag(p: any) {
  const rest = omit(p, ['active', 'className', 'children']);
  return <button type="button" aria-pressed={!!p.active} className={cx('kn-tag', p.active && 'is-active', p.className)} {...rest}>{p.children}</button>;
}

let uid = 0;
export function TextField(p: any) {
  const ref = React.useRef<string | null>(null);
  if (!ref.current) ref.current = p.id || 'kn-field-' + (++uid);
  const id = ref.current, msgId = id + '-msg';
  const rest = omit(p, ['label', 'hint', 'error', 'className', 'id']);
  const msg = p.error || p.hint;
  return (
    <div className={cx('kn-field', p.error && 'is-error', p.className)}>
      {p.label && <label className="kn-field-label" htmlFor={id}>{p.label}</label>}
      <input id={id} className="kn-input" aria-invalid={p.error ? true : undefined} aria-describedby={msg ? msgId : undefined} {...rest} />
      {msg && <p id={msgId} className="kn-field-msg">{p.error || p.hint}</p>}
    </div>
  );
}

export function ProgrammeCard(p: any) {
  const tone = p.tone || 'green';
  const title = p.href ? <a href={p.href}>{p.title}</a> : p.title;
  return (
    <article className={cx('kn-pcard', p.className)}>
      <div className={'kn-pcard-media kn-tone-' + tone}>
        {p.eyebrow && <span className="kn-pcard-eyebrow">{p.eyebrow}</span>}
        {p.image && <img src={p.image} alt={p.imageAlt || ''} />}
      </div>
      <div className="kn-pcard-body">
        <div className="kn-pcard-head"><h3 className="kn-pcard-title">{title}</h3>{p.price && <span className="kn-pcard-price">{p.price}</span>}</div>
        {p.meta && <p className="kn-pcard-meta">{p.meta}</p>}
      </div>
    </article>
  );
}

export function StoryPanel(p: any) {
  const tone = p.tone || 'forest';
  return (
    <section className={cx('kn-story', 'kn-tone-' + tone, p.className)}>
      {p.nav && <div className="kn-story-nav"><span>{p.nav}</span>{p.navEnd && <span>{p.navEnd}</span>}</div>}
      <h2 className="kn-story-title">{p.title}</h2>
      {p.children && <div className="kn-story-art">{p.children}</div>}
      {p.deck && <p className="kn-story-deck">{p.deck}</p>}
    </section>
  );
}

export function NavBar(p: any) {
  const links = p.links || [];
  return (
    <header className={cx('kn-nav', p.className)}>
      {p.brand && <a className="kn-nav-brand" href={p.brandHref || '#'}>{p.brand}</a>}
      <nav aria-label="Main"><ul className="kn-nav-links">{links.map((l: any, i: number) => (
        <li key={i}><a href={l.href || '#'} aria-current={l.active ? 'page' : undefined}>{l.label}</a></li>
      ))}</ul></nav>
      {p.action && <div className="kn-nav-action">{p.action}</div>}
    </header>
  );
}
