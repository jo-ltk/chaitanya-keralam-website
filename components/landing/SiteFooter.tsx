/* Landing-page footer for inner pages (same markup/classes as components/landing/LandingPage.tsx). */
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="dark foot" id="contact">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link className="brand" href="/"><img src="/assets/logo.png" alt="" width={60} height={58} style={{ width: 60 }} /><span>Chaitanya Keralam<small className="brand-tag">Eco Spiritual Peace Haven / India</small></span></Link>
            <p className="foot-promise">Perhaps the only paradise on earth!<br />One with nature.<br />God&apos;s own country.</p>
            <p className="label">Eco-Spiritual Peace Tourism · Anbu · Unmai · Patru · Pagutharivu</p>
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
            <li>Edex Edupark, Kochi, Kerala</li>
            <li><a href="tel:+919037016730">+91 90370 16730</a></li>
            <li><a href="tel:+918547818701">+91 85478 18701</a></li>
            <li><a href="mailto:josephanil2007@gmail.com">josephanil2007@gmail.com</a></li>
            <li><a href="mailto:akashjose369@gmail.com">akashjose369@gmail.com</a></li>
            <li><a href="mailto:shajimilan79@gmail.com">shajimilan79@gmail.com</a></li>
          </ul></div>
          <div><h4>Follow</h4><ul className="social">
            <li><Link href="/#plan"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span>Instagram</span></Link></li>
            <li><Link href="/#plan"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3Z" /></svg><span>YouTube</span></Link></li>
            <li><Link href="/#plan"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8Z" /></svg><span>Facebook</span></Link></li>
          </ul></div>
        </div>
        <p className="water" id="water" aria-hidden="true">Keralam</p>
        <div className="legal"><span>© {new Date().getFullYear()} Chaitanya Keralam</span><span>Privacy · Terms</span></div>
      </div>
    </footer>
  );
}
