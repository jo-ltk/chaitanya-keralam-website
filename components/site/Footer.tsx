'use client';
/* Converted from the Chaitanya Keralam design canvas (Footer). */
import React from 'react';
import dynamic from 'next/dynamic';
import { css, str } from '@/lib/dc';
import { SiteSettingsContext } from '@/components/SiteSettingsProvider';
import { LINKEDIN_URL, telHref } from '@/lib/site-settings';

const Map = dynamic(() => import('@/components/site/Map'), { ssr: false });

export default class Footer extends React.Component<any, any> {
  [key: string]: any;

  static contextType = SiteSettingsContext;
  renderVals() { return {}; }

  render() {
    const $v: any = this.renderVals();
    const { footer, social } = this.context as React.ContextType<typeof SiteSettingsContext>;
    const join = (items: React.ReactNode[]) => items.map((it, i) => <React.Fragment key={i}>{i > 0 && <br />}{it}</React.Fragment>);
    return (
<>

<footer id={"contact"} className={"foot sec"} style={css("font-family: var(--font-sans); color: #f7f3e8")}>
<div className={"wrap"} style={css("display:flex;flex-direction:column;gap:clamp(48px,5vw,96px)")}>
<div className={"g2"} style={css("align-items:end")}>
<h2 className={"h-sec"} style={css("color:#f7f3e8")}>Visit us, or simply <em style={css("color:#c5a15a")}>write</em>.</h2>
<div className={"map"}><Map /></div>
</div>
<div className={"foot-grid"}>
<div style={css("display:flex;flex-direction:column;gap:12px")}>
<a className={"foot-logo"} href={"/"}><span className={"foot-logo-badge"}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /></span><span className={"foot-brand"}>Chaitanya Keralam</span></a>
<p className={"small"}>Eco-Spiritual Peace Tourism and TESH Skill Development Programmes — connecting tourism, practical learning and youth entrepreneurship in Kerala.</p>
<p className={"eyebrow"} style={css("color:#c5a15a")}>Learn • Practise • Create • Lead</p>
<ul className={"foot-links"} style={css("margin-top:4px")}><li><a href={"/about"}>About Chaitanya Keralam</a></li><li><a href={"/eco-spiritual-tourism"}>Eco-Spiritual Peace Tourism</a></li></ul>
</div>
<div style={css("display:flex;flex-direction:column;gap:12px")}><p className={"eyebrow"} style={css("color:#c5a15a")}>Programmes</p><ul className={"foot-links"}><li><a href={"/programmes"}>All programmes</a></li><li><a href={"/programmes/3-month-foundation"}>3-Month Foundation</a></li><li><a href={"/programmes/6-month-professional"}>6-Month Professional</a></li><li><a href={"/programmes/1-year-advanced"}>1-Year Advanced</a></li><li><a href={"/programmes#admissions"}>Admissions</a></li></ul></div>
<div style={css("display:flex;flex-direction:column;gap:12px")}><p className={"eyebrow"} style={css("color:#c5a15a")}>TESH Homes &amp; partnerships</p><ul className={"foot-links"}><li><a href={"/tesh-homes"}>TESH Homes</a></li><li><a href={"/tesh-homes#careers"}>Career pathways</a></li><li><a href={"/tesh-homes#homeowners"}>For homeowners</a></li><li><a href={"/tesh-homes#partner"}>Partner with us</a></li></ul></div>
<div style={css("display:flex;flex-direction:column;gap:12px")}><p className={"eyebrow"} style={css("color:#c5a15a")}>Contact</p><p className={"small"}>{footer.address}</p><p className={"small"}>{join(footer.phones.map((p) => <a href={telHref(p.value)}>{p.value}</a>))}</p><p className={"small"}>{join(footer.emails.map((e) => <a href={`mailto:${e.value}`}>{e.value}</a>))}</p><p className={"eyebrow"} style={css("color:#c5a15a")}>Follow us</p><ul className={"foot-links"}><li><a href={social.xUrl} target={"_blank"} rel={"noopener noreferrer"}>X</a></li><li><a href={social.instagramUrl} target={"_blank"} rel={"noopener noreferrer"}>Instagram</a></li><li><a href={social.facebookUrl} target={"_blank"} rel={"noopener noreferrer"}>Facebook</a></li><li><a href={LINKEDIN_URL} target={"_blank"} rel={"noopener noreferrer"}>LinkedIn</a></li></ul></div>
</div>
<div className={"foot-bar"}>
<p className={"small"}>© {new Date().getFullYear()} Chaitanya Keralam. All rights reserved.</p>
<ul style={css("display:flex;align-items:center;gap:16px;list-style:none;margin:0;padding:0")}>
<li><a href={"/privacy"}>Privacy Policy</a></li>
<li><a href={"/terms"}>Terms of Use</a></li>
<li><span style={css("opacity:0.3;color:#f7f3e8")}>•</span></li>
<li><a href={"/admin/login"} style={css("display:inline-flex;align-items:center;gap:5px;opacity:0.75;transition:opacity 0.2s;font-weight:500;color:#c5a15a")} title={"Staff & Admin Portal"}><svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}><rect x={"3"} y={"11"} width={"18"} height={"11"} rx={"2"} ry={"2"}></rect><path d={"M7 11V7a5 5 0 0 1 10 0v4"}></path></svg> Admin Portal</a></li>
</ul>
</div>
</div>
</footer>
</>
    );
  }
}
