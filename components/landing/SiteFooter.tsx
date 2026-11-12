'use client';
/* Landing-page footer for inner pages (same markup/classes as components/landing/LandingPage.tsx).
   Contact details and social links come from the CMS "Site settings" global. */
import Link from 'next/link';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { isExternal, LINKEDIN_URL, telHref } from '@/lib/site-settings';

function Social({ url, children }: { url: string; children: React.ReactNode }) {
  return isExternal(url)
    ? <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>
    : <Link href={url}>{children}</Link>;
}

export default function SiteFooter() {
  const { footer, social } = useSiteSettings();
  return (
    <footer className="dark foot" id="contact">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link className="brand" href="/"><img src="/assets/logo.png" alt="" width={60} height={58} style={{ width: 60 }} /><span>Chaitanya Keralam<small className="brand-tag">Eco Spiritual Peace Haven / India</small></span></Link>
            <p className="foot-promise">{footer.promise.split('\n').map((line, i, a) => (<span key={i}>{line}{i < a.length - 1 && <br />}</span>))}</p>
            <p className="label">{footer.tagline}</p>
          </div>
          <div><h4>Explore</h4><ul>
            <li><Link href="/#destinations">Places</Link></li>
            <li><Link href="/#nature">Our vision</Link></li>
            <li><Link href="/#experiences">Our values</Link></li>
            <li><Link href="/values">What our values mean</Link></li>
            <li><Link href="/#maps">Maps</Link></li>
            <li><a href="https://www.keralatourism.org/" target="_blank" rel="noopener noreferrer">Kerala Tourism</a></li>
            <li><a href="https://www.kochimuzirisbiennale.org/" target="_blank" rel="noopener noreferrer">Kochi-Muziris Biennale</a></li>
          </ul></div>
          <div><h4>Journeys</h4><ul>
            <li><Link href="/#stories">Ayurveda &amp; rest</Link></li>
            <li><Link href="/#stories">Family homestays</Link></li>
            <li><Link href="/#stories">Youth &amp; community</Link></li>
            <li><Link href="/programmes#admissions">Apply now</Link></li>
          </ul></div>
          <div className="foot-contact"><h4>Contact</h4><ul>
            <li>{footer.address}</li>
            {footer.phones.map((p, i) => <li key={`p${i}`}><a href={telHref(p.value)}>{p.value}</a></li>)}
            {footer.emails.map((e, i) => <li key={`e${i}`}><a href={`mailto:${e.value}`}>{e.value}</a></li>)}
          </ul></div>
          <div><h4>Follow</h4><ul className="social">
            <li><Social url={social.instagramUrl}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span>Instagram</span></Social></li>
            {isExternal(social.youtubeUrl) && <li><Social url={social.youtubeUrl}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3Z" /></svg><span>YouTube</span></Social></li>}
            <li><Social url={social.facebookUrl}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8Z" /></svg><span>Facebook</span></Social></li>
            <li><Social url={social.xUrl}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.2 2.3h3.3l-7.2 8.2 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.3 2.3h6.8l4.7 6.2Zm-1.2 17.5h1.8L7.1 4.1h-2Z" /></svg><span>X</span></Social></li>
            <li><Social url={LINKEDIN_URL}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.9 8.7H3.5V20.5h3.4ZM5.2 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM20.5 13.8c0-3.2-1.7-5.3-4.6-5.3a3.9 3.9 0 0 0-3.5 1.9V8.7H9.1V20.5h3.4v-6.1c0-1.7.7-2.9 2.2-2.9s2.1 1.2 2.1 2.9v6.1h3.4Z" /></svg><span>LinkedIn</span></Social></li>
          </ul></div>
        </div>
        <p className="water" id="water" aria-hidden="true">Keralam</p>
        <div className="legal"><span>© {new Date().getFullYear()} Chaitanya Keralam</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <a href="/cms/login">Admin login</a></span></div>
      </div>
    </footer>
  );
}
