'use client';
/* Landing-page navigation for inner pages (same markup/classes as components/landing/LandingPage.tsx).
   Transparent over a dark .page-hero, solid after it. */
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/eco-spiritual-tourism', label: 'Tourism' },
  { href: '/programmes', label: 'Programmes' },
  { href: '/tesh-homes', label: 'TESH Homes' },
  { href: '/values', label: 'Our values' },
  { href: '/#contact', label: 'Contact' },
];

export default function SiteNav({ overDarkHero = true }: { overDarkHero?: boolean }) {
  const [solid, setSolid] = useState(!overDarkHero);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!overDarkHero) { setSolid(true); return; }
    const hero = document.querySelector('.hero, .page-hero') as HTMLElement | null;
    const onScroll = () => setSolid(window.scrollY > (hero ? hero.offsetHeight - 80 : 40));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overDarkHero]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <>
      <header className={`nav${solid ? ' solid' : ''}`} id="nav">
        <div className="wrap nav-in">
          <Link className="brand" href="/" aria-label="Chaitanya Keralam, home">
            <img src="/assets/logo.png" alt="" width={46} height={44} />
            <span>Chaitanya Keralam<small className="brand-tag">Eco Spiritual Peace Haven / India</small></span>
          </Link>
          <nav aria-label="Primary" style={{ display: 'contents' }}>
            <ul className="nav-links">
              {LINKS.map((l) => <li key={l.href}><Link href={l.href} aria-current={l.href === '/about' ? 'page' : undefined}>{l.label}</Link></li>)}
            </ul>
          </nav>
          <div className="nav-end">
            <Link className="btn nav-cta" href="/programmes#admissions">Apply now</Link>
            <button ref={btn} className="nav-menu" id="menuBtn" type="button" aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}><i /></button>
          </div>
        </div>
      </header>
      <div className="menu" id="menu" hidden={!open} onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
        <ul>{LINKS.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        <p className="label">Perhaps the only paradise on earth. Come, stay a while.</p>
      </div>
    </>
  );
}
