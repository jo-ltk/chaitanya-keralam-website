'use client';
/* Converted from the Chaitanya Keralam design canvas (ProgrammeThreeMonth). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class ProgrammeThreeMonth extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) { super(props); this.state = { menu: false }; }
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
  renderVals() { return this.nav('Programmes'); }

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


<section className={"c-hero green"}>
<div className={"wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / <a href={"/programmes"}>Programmes</a> / 3-Month Foundation</p>
<span className={"c-badge r1"}><i></i>3-Month Foundation Programme · 240 training hours</span>
<h1 className={"h-display h-page r2"}>Build your <em>foundation</em> in eco-spiritual tourism and hospitality.</h1>
<p className={"lede r3"}>Introduces the basic concepts and practical skills of tourism &amp; travel, eco-spiritual peace tourism, hospitality, basic caregiving, eco-hospitality, entrepreneurship, personal leadership and digital skills.</p>
</div>
<div className={"ph ph-w p2 rounded r3"} style={css("aspect-ratio:4/3")}>[Image — learners on a field visit]</div>
</div>
</section>


<section className={"sec white"}>
<div className={"wrap c-layout"}>
<div className={"stack"} style={css("gap:clamp(56px,6vw,96px)")}>

<div id={"curriculum"}>
<div className={"head"}><p className={"eyebrow"}>Curriculum</p><h2 className={"h-sec"}>Three months, three <em>steps</em></h2></div>
<ol className={"tl"}>
<li><span className={"node"}>M1</span><div className={"card"}><p className={"eyebrow plain"} style={css("color:#80664b")}>Month 1</p><h3 className={"h-card"}>Introduction to Tourism</h3>
<ul className={"ticks"}>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Understanding tourism</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Eco, spiritual and wellness tourism</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Nature, environment and culture</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Sustainable and responsible tourism</span></li>
</ul>
<p className={"pw"}><b>Practical work:</b> destination study or field visit.</p></div></li>
<li><span className={"node"}>M2</span><div className={"card"}><p className={"eyebrow plain"} style={css("color:#80664b")}>Month 2</p><h3 className={"h-card"}>Introduction to Hospitality</h3>
<ul className={"ticks"}>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Hospitality industry and operations</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Front office and guest service</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Housekeeping and food and beverage</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Guest experience and eco-hospitality</span></li>
</ul>
<p className={"pw"}><b>Practical work:</b> front-office role-play and hotel/resort exposure.</p></div></li>
<li><span className={"node"}>M3</span><div className={"card"}><p className={"eyebrow plain"} style={css("color:#80664b")}>Month 3</p><h3 className={"h-card"}>Tourism Practical Skills</h3>
<ul className={"ticks"}>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Tour planning</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Tour guiding and communication</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Tourism marketing and digital skills</span></li>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>Final tourism and hospitality project</span></li>
</ul></div></li>
</ol>
</div>

<div id={"outcomes"} style={css("background:#eee7d5;border-radius:24px;padding:clamp(24px,3.4vw,56px)")}>
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>What you will develop</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>A confident <em>start</em></h2><p className={"body muted"}>Students develop foundational skills and practical awareness to begin assisting in tourism, hospitality, caregiving and TESH-related activities, including:</p></div>
<ul className={"olist"}>
<li><b>01</b>Foundational knowledge of tourism and hospitality</li>
<li><b>02</b>Guest-service skills</li>
<li><b>03</b>Cultural awareness</li>
<li><b>04</b>Basic tourism planning</li>
<li><b>05</b>Digital promotion skills</li>
<li><b>06</b>Basic caregiving and personal leadership</li>
</ul>
<p className={"note"} style={css("margin-top:20px;background:#fff")}><b>Experience certificate.</b> Participants who successfully complete the applicable training requirements receive a TESH Skill Development Experience Certificate, subject to programme completion and assessment requirements.</p>
</div>
</div>

<aside className={"summary"} id={"enquire"} aria-label={"Programme summary"}>
<p className={"eyebrow"}>At a glance</p>
<dl>
<div><dt>Duration</dt><dd>3 months</dd></div>
<div><dt>Training hours</dt><dd>240</dd></div>
<div><dt>Schedule</dt><dd>4 hours a day, 5 days a week</dd></div>
<div><dt>Progression</dt><dd>Learn · Practise · Assist</dd></div>
<div><dt>Mode</dt><dd>Offline</dd></div>
<div><dt>Eligibility</dt><dd>Plus Two / Higher Secondary or equivalent, as stated in the curriculum</dd></div>
<div><dt>Planned commencement</dt><dd>December 2026</dd></div>
</dl>
<Button variant={"primary"} href={"/programmes#admissions"}>Enquire About the Three-Month Programme</Button>
<Button variant={"quiet"} href={"/programmes#compare"}>Compare programmes</Button>
</aside>
</div>
</section>

<nav className={"pager"} aria-label={"Programme navigation"}>
<a href={"/programmes"}><span className={"small"}>← All programmes</span><b>Skill Development Programmes</b></a>
<a href={"/programmes/6-month-professional"}><span className={"small"}>Next level →</span><b>6-Month Professional</b></a>
</nav>

<Footer />
</>
    );
  }
}
