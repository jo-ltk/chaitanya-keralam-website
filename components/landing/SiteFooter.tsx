'use client';
/* Landing-page footer for inner pages (same markup/classes as components/landing/LandingPage.tsx).
   Contact details and social links come from the CMS "Site settings" global. */
import Link from 'next/link';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { isExternal, telHref } from '@/lib/site-settings';

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
            <li><Social url={social.youtubeUrl}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3Z" /></svg><span>YouTube</span></Social></li>
            <li><Social url={social.facebookUrl}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8Z" /></svg><span>Facebook</span></Social></li>
          </ul></div>
        </div>
        <p className="water" id="water" aria-hidden="true">Keralam</p>
        <div className="legal"><span>© {new Date().getFullYear()} Chaitanya Keralam</span><span>Privacy · Terms · <a href="/cms/login">Admin login</a></span></div>
      </div>
    </footer>
  );
}
