'use client';
/* Converted from the Chaitanya Keralam design canvas (Footer). */
import React from 'react';
import { css, str } from '@/lib/dc';

export default class Footer extends React.Component<any, any> {
  [key: string]: any;

  renderVals() { return {}; }

  render() {
    const $v: any = this.renderVals();
    return (
<>

<footer id={"contact"} className={"foot sec"} style={css("font-family: var(--font-sans); color: #f7f3e8")}>
<div className={"wrap"} style={css("display:flex;flex-direction:column;gap:clamp(48px,5vw,96px)")}>
<div className={"g2"} style={css("align-items:end")}>
<h2 className={"h-sec"} style={css("color:#f7f3e8")}>Visit us, or simply <em style={css("color:#c5a15a")}>write</em>.</h2>
<div className={"map"}>[Map — Edex Edupark, Kochi]</div>
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
<div style={css("display:flex;flex-direction:column;gap:12px")}><p className={"eyebrow"} style={css("color:#c5a15a")}>Contact</p><p className={"small"}>Edex Edupark<br />Kochi, Kerala</p><p className={"small"}><a href={"tel:+919037016730"}>+91 90370 16730</a><br /><a href={"tel:+918547818701"}>+91 85478 18701</a></p><p className={"small"}><a href={"mailto:Peacegate@arbitrationindia.com"}>Peacegate@arbitrationindia.com</a><br /><a href={"mailto:akashjose369@gmail.com"}>akashjose369@gmail.com</a></p></div>
</div>
<div className={"foot-bar"}>
<p className={"small"}>© [Year] Chaitanya Keralam. All rights reserved.</p>
<ul><li><a href={"#privacy"}>Privacy Policy</a></li><li><a href={"#terms"}>Terms of Use</a></li></ul>
</div>
</div>
</footer>
</>
    );
  }
}
