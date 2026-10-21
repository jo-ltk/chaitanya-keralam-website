'use client';
/* Converted from the Chaitanya Keralam design canvas (ProgrammeOneYear). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class ProgrammeOneYear extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) { super(props); this.state = { menu: false, open: 0 }; }
  nav(cur) {
    var self = this;
    var L = [['Home', '/'], ['About', '/about'], ['Tourism', '/eco-spiritual-tourism'], ['Programmes', '/programmes'], ['TESH Homes', '/tesh-homes'], ['Admissions', '/programmes#admissions'], ['Contact', '#contact']];
    return {
      navLinks: L.map(function (l) { return { label: l[0], href: l[1], active: l[0] === cur, cls: l[0] === cur ? 'on' : '' }; }),
      menuOpen: this.state.menu,
      menuLabel: this.state.menu ? 'Close menu' : 'Open menu',
      menuIcon: this.state.menu ? 'M5 5l10 10M15 5 5 15' : 'M3 6h14M3 10h14M3 14h14',
      toggleMenu: function () { self.setState({ menu: !self.state.menu }); },
      closeMenu: function () { self.setState({ menu: false }); }
    };
  }
  renderVals() {
    var self = this;
    var data = [
      ['A', 'Tourism Studies', 'Understanding destinations and how to design, run and promote meaningful tourism experiences.', ['Tourism foundations', 'Ecology', 'Spirituality & culture', 'Destination management', 'Tour design', 'Tour operations', 'Guiding', 'Storytelling', 'Digital tourism marketing']],
      ['B', 'Hospitality Studies', 'Running guest-facing operations with quality, care and sustainability.', ['Front office', 'Guest relations', 'Housekeeping', 'Food service', 'Resort management', 'Wellness & retreat hospitality', 'Sustainable operations']],
      ['C', 'Integration & Professional Practice', 'Bringing it all together through industry practice and enterprise planning.', ['Industry training', 'Entrepreneurship', 'Market research', 'Costing', 'Financial planning', 'Risk management', 'Integrated capstone project']]
    ];
    var i = this.state.open;
    return Object.assign(this.nav('Programmes'), {
      parts: data.map(function (r, k) {
        var open = k === i;
        return { k: r[0], title: r[1], text: r[2], topics: r[3], open: open, hidden: !open, cls: open ? 'acc-item open' : 'acc-item', pick: function () { self.setState({ open: open ? -1 : k }); } };
      })
    });
  }

  render() {
    const $v: any = this.renderVals();
    return (
<>


<div className={"navbar"}>
<a className={"nav-logo"} href={"/"} tabIndex={-1}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /></a>
<NavBar brand={"Chaitanya Keralam"} brandHref={"/"} links={$v?.navLinks} />
<div className={"nav-cta"}><Button variant={"primary"} size={"sm"} href={"/programmes#admissions"}>Apply now</Button></div>
<button className={"menu-btn"} aria-label={$v?.menuLabel} aria-expanded={$v?.menuOpen} onClick={$v?.toggleMenu}><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><path d={$v?.menuIcon} /></svg></button>
</div>
{!!($v?.menuOpen) && (<>
<nav className={"mnav"} aria-label={"Mobile"}>
{($v?.navLinks || []).map((l: any, $index: number) => (<React.Fragment key={$index}><a href={l?.href} className={l?.cls} onClick={$v?.closeMenu}>{l?.label}</a></React.Fragment>))}
<div className={"cta"}><Button variant={"primary"} href={"/programmes#admissions"}>Apply now</Button></div>
</nav>
</>)}


<section className={"c-hero dark"}>
<div className={"wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / <a href={"/programmes"}>Programmes</a> / 1-Year Advanced</p>
<span className={"c-badge r1"}><i style={css("background:#c5a15a")}></i>1-Year Advanced Programme · 960 training hours</span>
<h1 className={"h-display h-page r2"}>Develop <em>advanced</em> capabilities in tourism and hospitality management.</h1>
</div>
<ol className={"mlist r3"} aria-label={"Programme parts"}>
<li>Part A — Tourism Studies</li>
<li>Part B — Hospitality Studies</li>
<li>Part C — Integration and Professional Practice</li>
</ol>
</div>
</section>


<section className={"sec white"}>
<div className={"wrap c-layout"}>
<div className={"stack"} style={css("gap:clamp(56px,6vw,96px)")}>

<div id={"structure"}>
<div className={"head"} style={css("margin-bottom:24px")}><p className={"eyebrow"}>Programme structure</p><h2 className={"h-sec"}>Three parts, one <em>integrated</em> year</h2></div>
<div className={"acc"}>
{($v?.parts || []).map((p: any, $index: number) => (<React.Fragment key={$index}>
<div className={p?.cls}>
<button className={"acc-btn"} aria-expanded={p?.open} onClick={p?.pick}><span className={"pl"}>{p?.k}</span><span className={"h-card"}>{p?.title}</span><span className={"ic"} aria-hidden={"true"}>+</span></button>
<div className={"acc-wrap"} aria-hidden={p?.hidden}><div><div className={"acc-body"}><p className={"body muted"}>{p?.text}</p><div className={"incl"}>{(p?.topics || []).map((t: any, $index: number) => (<React.Fragment key={$index}><span>{t}</span></React.Fragment>))}</div></div></div></div>
</div>
</React.Fragment>))}
</div>
</div>

<div id={"capstone"} style={css("background:#123d32;color:#f7f3e8;border-radius:24px;padding:clamp(24px,3.4vw,56px)")} className={"forest"}>
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>Integrated capstone</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px);color:#f7f3e8")}>Possible capstone <em>projects</em></h2><p className={"body"}>Learners develop an integrated capstone project combining tourism, hospitality and enterprise planning.</p></div>
<div className={"heritage"} style={css("grid-template-columns:repeat(auto-fit,minmax(200px,1fr))")}>
<div><span className={"small"} style={css("opacity:.7")}>01</span><span style={css("font-weight:600")}>Eco-spiritual resort</span></div>
<div><span className={"small"} style={css("opacity:.7")}>02</span><span style={css("font-weight:600")}>Wellness retreat</span></div>
<div><span className={"small"} style={css("opacity:.7")}>03</span><span style={css("font-weight:600")}>Tourism destination experience</span></div>
<div><span className={"small"} style={css("opacity:.7")}>04</span><span style={css("font-weight:600")}>Community-based tourism initiative</span></div>
<div><span className={"small"} style={css("opacity:.7")}>05</span><span style={css("font-weight:600")}>Sustainable tourism or hospitality business</span></div>
</div>
</div>

<div id={"outcomes"}>
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>Learning outcomes</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>Skills to <em>manage</em> and lead</h2><p className={"body muted"}>Participants develop advanced practical, supervisory, leadership and entrepreneurial capabilities, including:</p></div>
<ul className={"olist"}>
<li style={css("background:#f7f3e8")}><b>01</b>Destination management</li>
<li style={css("background:#f7f3e8")}><b>02</b>Hospitality operations</li>
<li style={css("background:#f7f3e8")}><b>03</b>Sustainability in tourism and hospitality</li>
<li style={css("background:#f7f3e8")}><b>04</b>Supervision and leadership</li>
<li style={css("background:#f7f3e8")}><b>05</b>Business planning</li>
<li style={css("background:#f7f3e8")}><b>06</b>Project development</li>
<li style={css("background:#f7f3e8")}><b>07</b>Advanced caregiving</li>
<li style={css("background:#f7f3e8")}><b>08</b>TESH Home management</li>
</ul>
</div>
</div>

<aside className={"summary"} id={"enquire"} aria-label={"Programme summary"}>
<p className={"eyebrow"}>At a glance</p>
<dl>
<div><dt>Duration</dt><dd>12 months</dd></div>
<div><dt>Training hours</dt><dd>960</dd></div>
<div><dt>Schedule</dt><dd>4 hours a day, 5 days a week</dd></div>
<div><dt>Progression</dt><dd>Supervise · Lead · Manage · Create</dd></div>
<div><dt>Mode</dt><dd>Offline</dd></div>
<div><dt>Eligibility</dt><dd><span className={"tbc"}>To be confirmed</span></dd></div>
<div><dt>Planned commencement</dt><dd>December 2026</dd></div>
</dl>
<Button variant={"primary"} href={"/programmes#admissions"}>Enquire About the One-Year Programme</Button>
<Button variant={"quiet"} href={"/programmes#compare"}>Compare programmes</Button>
</aside>
</div>
</section>

<nav className={"pager"} aria-label={"Programme navigation"}>
<a href={"/programmes/6-month-professional"}><span className={"small"}>← Previous level</span><b>6-Month Professional</b></a>
<a href={"/tesh-homes"}><span className={"small"}>Where it can lead →</span><b>TESH Homes &amp; career pathways</b></a>
</nav>

<Footer />
</>
    );
  }
}
