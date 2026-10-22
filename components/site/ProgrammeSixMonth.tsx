'use client';
/* Converted from the Chaitanya Keralam design canvas (ProgrammeSixMonth). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class ProgrammeSixMonth extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) { super(props); this.state = { menu: false, part: 0 }; }
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
      { label: 'Part I · Months 1–3', title: 'Part I — Eco-Spiritual Tourism', months: [
        { label: 'Month 1', title: 'Foundations', text: 'Foundations of eco-spiritual tourism, ecosystems and biodiversity, spiritual traditions and sustainable tourism.' },
        { label: 'Month 2', title: 'Planning & design', text: 'Destination planning, itinerary design, ethical tourism, community participation and tourism marketing.' },
        { label: 'Month 3', title: 'Operations & experience', text: 'Tour operations, guiding, storytelling, destination experience design and tourism project work.' }] },
      { label: 'Part II · Months 4–6', title: 'Part II — Eco-Spiritual Hospitality', months: [
        { label: 'Month 4', title: 'Hospitality foundations', text: 'Hospitality foundations, front office, guest relations and housekeeping.' },
        { label: 'Month 5', title: 'Service & wellness', text: 'Food and beverage service, resort operations, wellness hospitality and retreats.' },
        { label: 'Month 6', title: 'Quality & practice', text: 'Sustainable hospitality, safety and quality, hospitality marketing, industry training and final project.' }] }
    ];
    var i = this.state.part;
    return Object.assign(this.nav('Programmes'), {
      parts: data.map(function (p, k) { return { label: p.label, on: k === i, cls: k === i ? 'on' : '', pick: function () { self.setState({ part: k }); } }; }),
      part: data[i]
    });
  }

  render() {
    const $v: any = this.renderVals();
    return (
<>


<div className={"navbar"}>
<a className={"nav-logo"} href={"/"} tabIndex={-1}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /></a>
<NavBar brandHref={"/"} links={$v?.navLinks} />
<div className={"nav-cta"}><Button variant={"primary"} size={"sm"} href={"/programmes#admissions"}>Apply now</Button></div>
<button className={"menu-btn"} aria-label={$v?.menuLabel} aria-expanded={$v?.menuOpen} onClick={$v?.toggleMenu}><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><path d={$v?.menuIcon} /></svg></button>
</div>
{!!($v?.menuOpen) && (<>
<nav className={"mnav"} aria-label={"Mobile"}>
{($v?.navLinks || []).map((l: any, $index: number) => (<React.Fragment key={$index}><a href={l?.href} className={l?.cls} onClick={$v?.closeMenu}>{l?.label}</a></React.Fragment>))}
<div className={"cta"}><Button variant={"primary"} href={"/programmes#admissions"}>Apply now</Button></div>
</nav>
</>)}


<section className={"c-hero gold"}>
<div className={"wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / <a href={"/programmes"}>Programmes</a> / 6-Month Professional</p>
<span className={"c-badge r1"}><i style={css("background:#c5a15a")}></i>6-Month Professional Programme · 480 training hours</span>
<h1 className={"h-display h-page r2"}>Develop <em>professional</em> skills in eco-spiritual tourism and hospitality.</h1>
</div>
<div className={"r3"} style={css("background:#fff;border-radius:24px;padding:8px")}>
<a href={"#curriculum"} style={css("display:grid;grid-template-columns:56px minmax(0,1fr);gap:16px;align-items:center;padding:18px 20px;text-decoration:none;color:#123d32;border-radius:18px")}><span className={"lvl"} style={css("background:#dde8df;width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-weight:600")}>I</span><span className={"stack-s"} style={css("gap:0")}><b style={css("font-weight:600")}>Part I · Eco-Spiritual Tourism</b><span className={"small"}>Months 1–3</span></span></a>
<a href={"#curriculum"} style={css("display:grid;grid-template-columns:56px minmax(0,1fr);gap:16px;align-items:center;padding:18px 20px;text-decoration:none;color:#123d32;border-radius:18px;border-top:1px solid #eee7d5")}><span className={"lvl"} style={css("background:#c5a15a;width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-weight:600")}>II</span><span className={"stack-s"} style={css("gap:0")}><b style={css("font-weight:600")}>Part II · Eco-Spiritual Hospitality</b><span className={"small"}>Months 4–6</span></span></a>
</div>
</div>
</section>


<section className={"sec white"}>
<div className={"wrap c-layout"}>
<div className={"stack"} style={css("gap:clamp(56px,6vw,96px)")}>

<div id={"curriculum"}>
<div className={"head"} style={css("margin-bottom:24px")}><p className={"eyebrow"}>Curriculum</p><h2 className={"h-sec"}>Two parts, six <em>months</em></h2></div>
<div className={"seg"} role={"tablist"} aria-label={"Programme parts"}>
{($v?.parts || []).map((p: any, $index: number) => (<React.Fragment key={$index}><button className={p?.cls} role={"tab"} aria-selected={p?.on} onClick={p?.pick}>{p?.label}</button></React.Fragment>))}
</div>
<h3 className={"h-card"} style={css("margin-bottom:20px;color:#2f6b50")} data-swap>{$v?.part?.title}</h3>
<div className={"months"} role={"tabpanel"} data-swap>
{($v?.part?.months || []).map((m: any, $index: number) => (<React.Fragment key={$index}>
<div><p className={"eyebrow plain"} style={css("color:#80664b")}>{m?.label}</p><h4 className={"h-card"}>{m?.title}</h4><p className={"small"}>{m?.text}</p></div>
</React.Fragment>))}
</div>
</div>

<div id={"outcomes"}>
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>Learning outcomes</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>Skills for <em>professional</em> practice</h2><p className={"body muted"}>Participants develop professional-level practical skills and greater responsibility in tourism, hospitality, caregiving and entrepreneurial activities, including:</p></div>
<ul className={"olist"}>
<li style={css("background:#f7f3e8")}><b>01</b>Tourism planning and itinerary design</li>
<li style={css("background:#f7f3e8")}><b>02</b>Guest services and hospitality operations</li>
<li style={css("background:#f7f3e8")}><b>03</b>Responsible and sustainable tourism practice</li>
<li style={css("background:#f7f3e8")}><b>04</b>Digital marketing for tourism and hospitality</li>
<li style={css("background:#f7f3e8")}><b>05</b>Teamwork and communication</li>
<li style={css("background:#f7f3e8")}><b>06</b>Business concepts for tourism enterprises</li>
<li style={css("background:#f7f3e8")}><b>07</b>International caregiving</li>
<li style={css("background:#f7f3e8")}><b>08</b>TESH Home practical training</li>
</ul>
</div>

<div id={"project"} className={"founder"} style={css("grid-column:auto")}>
<p className={"eyebrow"}>Final project</p>
<h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>Design a concept of your own</h2>
<p className={"body"}>Students develop one of the following, bringing together both parts of the programme:</p>
<div className={"incl"}><span style={css("background:#f7f3e8")}>Eco-spiritual resort</span><span style={css("background:#f7f3e8")}>Wellness retreat</span><span style={css("background:#f7f3e8")}>Tourism package</span><span style={css("background:#f7f3e8")}>Community-based tourism project</span><span style={css("background:#f7f3e8")}>Sustainable hospitality business concept</span></div>
<p className={"small"} style={css("color:#123d32")}><b>Industry exposure</b> depends on partner arrangements. <b>TESH Home practical training</b> is part of this level where available.</p>
</div>
</div>

<aside className={"summary"} id={"enquire"} aria-label={"Programme summary"}>
<p className={"eyebrow"}>At a glance</p>
<dl>
<div><dt>Duration</dt><dd>6 months</dd></div>
<div><dt>Training hours</dt><dd>480</dd></div>
<div><dt>Schedule</dt><dd>4 hours a day, 5 days a week</dd></div>
<div><dt>Progression</dt><dd>Learn · Practise · Operate · Take responsibility</dd></div>
<div><dt>Mode</dt><dd>Offline</dd></div>
<div><dt>Eligibility</dt><dd>Plus Two / Higher Secondary or equivalent, as stated in the curriculum</dd></div>
<div><dt>Planned commencement</dt><dd>December 2026</dd></div>
</dl>
<Button variant={"primary"} href={"/programmes#admissions"}>Enquire About the Six-Month Programme</Button>
<Button variant={"quiet"} href={"/programmes#compare"}>Compare programmes</Button>
</aside>
</div>
</section>

<nav className={"pager"} aria-label={"Programme navigation"}>
<a href={"/programmes/3-month-foundation"}><span className={"small"}>← Previous level</span><b>3-Month Foundation</b></a>
<a href={"/programmes/1-year-advanced"}><span className={"small"}>Next level →</span><b>1-Year Advanced</b></a>
</nav>

<Footer />
</>
    );
  }
}
