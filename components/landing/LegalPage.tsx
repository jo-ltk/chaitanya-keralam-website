'use client';
/* Privacy policy and Terms of use, built from the legal-page recipe in
   docs/LANDING-PAGE-DESIGN-SYSTEM.md (12.9): paper hero + prose + footer, data-split on the title only. */
import Link from 'next/link';
import { Fragment, useRef, type ReactNode } from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { useCKMotion } from './useCKMotion';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { telHref } from '@/lib/site-settings';
import type { LegalContent } from '@/lib/legal-content';

// "[text](url)" → link; internal paths use next/link.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href] = m;
    out.push(href.startsWith('/')
      ? <Link key={m.index} href={href}>{label}</Link>
      : <a key={m.index} href={href} target="_blank" rel="noopener noreferrer">{label}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Blank line = new paragraph; lines starting with "- " = bullet list.
function Body({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const intro = lines.filter((l) => !l.startsWith('- '));
        const items = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
        return (
          <Fragment key={i}>
            {intro.length > 0 && <p>{inline(intro.join(' '))}</p>}
            {items.length > 0 && <ul>{items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>}
          </Fragment>
        );
      })}
    </>
  );
}

export default function LegalPage({ content: c }: { content: LegalContent }) {
  const main = useRef<HTMLElement>(null);
  useCKMotion(main);
  const { footer } = useSiteSettings();

  return (
    <>
      <SiteNav overDarkHero={false} />

      <main id="top" ref={main} className="legal-page">
        <section className="section paper-hero" aria-labelledby="pageH">
          <div className="wrap">
            <p className="label crumbs"><Link href="/">Home</Link> / {c.header.label}</p>
            <h1 className="paper-title" id="pageH" data-split>{c.header.heading}</h1>
            <p className="lead">{c.header.lead}</p>
            <p className="label">Last updated {c.header.updated}</p>
          </div>
        </section>

        <section className="section legal-body" aria-label={c.header.heading}>
          <div className="wrap">
            <article className="prose">
              {c.sections.map((s, i) => (
                <Fragment key={i}>
                  <h2>{s.heading}</h2>
                  <Body text={s.body} />
                </Fragment>
              ))}
              <h2>{c.contact.heading}</h2>
              <p>{c.contact.text}</p>
              <ul>
                <li>Chaitanya Keralam, {footer.address}</li>
                {footer.emails.map((e, i) => <li key={`e${i}`}><a href={`mailto:${e.value}`}>{e.value}</a></li>)}
                {footer.phones.map((p, i) => <li key={`p${i}`}><a href={telHref(p.value)}>{p.value}</a></li>)}
              </ul>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
