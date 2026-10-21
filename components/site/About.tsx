'use client';
/* Converted from the Chaitanya Keralam design canvas (About). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class About extends React.Component<any, any> {
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
  renderVals() { return this.nav('About'); }

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


<section className={"wrap a-hero"}>
<div className={"stack"} style={css("gap:24px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / About Us</p>
<p className={"eyebrow r1"}>About Chaitanya Keralam</p>
<h1 className={"h-display r2"}>A vision <em>rooted</em> in Kerala, looking towards the world.</h1>
</div>
<div className={"stack r3"} style={css("gap:28px")}>
<p className={"lede"}>Chaitanya Keralam is envisioned as a transformative initiative to develop Kerala as a Global Eco-Spiritual Peace Tourism Destination — bringing together nature, culture, spirituality, peace, wellness, responsible tourism, hospitality, caregiving and entrepreneurship to create meaningful livelihood opportunities for youth and the community.</p>
<p className={"eyebrow plain"} style={css("color:#80664b")}>A mission by the youth, for the youth and of the youth.</p>
<div className={"cta"}>
<Button variant={"primary"} href={"#vision"}>Our vision</Button>
<Button variant={"quiet"} href={"#philosophy"}>Our philosophy</Button>
</div>
</div>
</section>
<div className={"wrap"} style={css("padding-bottom:var(--sec)")}>
<div className={"a-mosaic"} aria-label={"Photos of Kerala"}>
<div className={"ph m1 p1"}>[Photo 1]</div>
<div className={"ph m2 p2"}>[Photo 2]</div>
<div className={"ph m3 p4"}>[Photo 4]</div>
<div className={"ph m4 p3"}>[Feature photo]</div>
<div className={"ph m5 p5"}>[Photo 5]</div>
</div>
</div>


<section id={"vision"} className={"sec forest"}>
<div className={"wrap g2"} style={css("align-items:start")}>
<div className={"stack"} style={css("gap:28px")}>
<svg width={"64"} height={"64"} viewBox={"0 0 96 96"} aria-hidden={"true"}><path d={"M48 16c10 14 16 26 16 38a16 16 0 0 1-32 0c0-12 6-24 16-38Z"} fill={"#c5a15a"} /><path d={"M48 70v-20"} stroke={"#f7f3e8"} strokeWidth={"2"} /><path d={"M30 82h36M38 76h20"} stroke={"#f7f3e8"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>
<p className={"eyebrow"}>Our vision</p>
<p className={"statement"}>Transforming Kerala into a Global <em style={css("color:#c5a15a;font-style:italic")}>Eco-Spiritual</em> Peace Tourism Destination.</p>
</div>
<div className={"stack"} style={css("gap:28px")}>
<svg width={"64"} height={"64"} viewBox={"0 0 96 96"} aria-hidden={"true"}><path d={"M20 70 Q48 84 76 70 L70 80 Q48 90 26 80 Z"} fill={"#c5a15a"} /><path d={"M30 70 Q36 46 48 44 Q60 46 66 70 Z"} fill={"#f2e7cd"} stroke={"#f7f3e8"} strokeWidth={"2"} /><path d={"M14 88 q8 -4 16 0 t16 0 t16 0 t16 0"} fill={"none"} stroke={"#f7f3e8"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>
<p className={"eyebrow"}>Our mission</p>
<ol className={"mlist"}>
<li>Transforming luxury homes</li>
<li>Empowering youth</li>
<li>Creating entrepreneurs</li>
<li>Utilizing free land holding for income generation</li>
<li>Global e-commerce opportunities</li>
</ol>
<p className={"small"}>Kerala has around <b>1.4 million</b> unutilized or underutilized houses. Our mission is to transform suitable existing unutilized and underutilized homes into TSB and TESH Homes — creating a distributed network of international guest houses, training centres and activity centres. <span className={"tbc"}>Proposed</span></p>
</div>
</div>
</section>


<section id={"goals"} className={"sec band"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Our goals</p><h2 className={"h-sec"}>Project goals for the <em>years ahead</em></h2><p className={"small"}>These are project goals, not completed achievements.</p></div>
<div className={"goal-big"}>
<div className={"goal-hero"}>
<p className={"eyebrow"} style={css("color:#f2e7cd")}>Project target</p>
<div className={"stack-s"}><span className={"num"}>1,000</span><p className={"body"} style={css("color:#f7f3e8;font-size:clamp(17px,1.3vw,20px);font-weight:500")}>To create a team of 1,000 Independent Global Youth Entrepreneurs in the Eco-Spiritual Peace Tourism Industry in Kerala.</p></div>
</div>
<div className={"goal-list"}>
<div className={"goal-item"}><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 11 12 4l9 7"} /><path d={"M5 10v10h14V10"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"}>Community-based centres</h3><p className={"small"}>Convert underutilized assets into productive community-based centres that create opportunities for youth, support tourism and generate sustainable livelihoods.</p></div></div>
<div className={"goal-item"}><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 12h12"} /><path d={"m12 6 6 6-6 6"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"}>Empowering youth</h3><p className={"small"}>Empowering youth through skill development, practical experience, leadership and entrepreneurial opportunities.</p></div></div>
<div className={"goal-item"}><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 20c0-9 6-15 16-16-1 10-7 16-16 16Z"} /><path d={"M4 20 14 10"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"}>Responsible tourism</h3><p className={"small"}>Encourage responsible tourism and community participation.</p></div></div>
</div>
</div>
</div>
</section>


<section id={"philosophy"} className={"sec white"}>
<div className={"wrap quote"}>
<span className={"rule"}>Our philosophy · Tyagarchana</span>
<span className={"quote-mark"} aria-hidden={"true"}>“</span>
<blockquote>Caring love, voluntary sacrifice and <em style={css("color:#2f6b50;font-style:italic")}>selfless service</em>.</blockquote>
<p className={"lede"} style={css("text-align:center")}>Tyagarchana is the project's stated philosophy — service offered with care, given freely and without expectation.</p>
<p className={"body muted"} style={css("text-align:center")}>In practice, it is intended to shape how Chaitanya Keralam approaches tourism, hospitality and community development: welcoming guests with sincerity, respecting the places and people who host them, and encouraging young people to see service and leadership as contributions to their communities.</p>
</div>
</section>


<section id={"approach"} className={"sec"}>
<div className={"wrap"}>
<div className={"g2"} style={css("align-items:end;margin-bottom:clamp(40px,4vw,64px)")}>
<div className={"stack"}><p className={"eyebrow"}>Our approach</p><h2 className={"h-sec"}>Six threads, <em>woven</em> together</h2></div>
<p className={"body muted"}>The project integrates ancient wisdom, Kerala's hospitality culture, eco-spiritual tourism, peace and wellness, youth entrepreneurship and sustainable livelihoods.</p>
</div>
<div className={"bento"}>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 20c0-9 6-15 16-16-1 10-7 16-16 16Z"} /><path d={"M4 20 14 10"} /></svg></div><h3 className={"h-card"}>Ancient wisdom and cultural values</h3><p className={"small"}>Kerala's heritage of spiritual traditions, cultural exchange and traditional knowledge.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 18h18"} /><path d={"M5 18a7 7 0 0 1 14 0"} /><path d={"M12 9V7"} /></svg></div><h3 className={"h-card"}>Kerala hospitality culture</h3><p className={"small"}>Kerala's traditions of hospitality and community living.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z"} /></svg></div><h3 className={"h-card"}>Eco-spiritual tourism</h3><p className={"small"}>Travel that connects nature, ecology, spirituality, peace and culture.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 9 12 5l8 4-8 4-8-4Z"} /><path d={"M8 11v4c2 2 6 2 8 0v-4"} /></svg></div><h3 className={"h-card"}>Peace and wellness</h3><p className={"small"}>Meditation, wellness and Kerala's Ayurvedic and spiritual traditions.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M12 3v4M12 17v4M3 12h4M17 12h4"} /><circle cx={"12"} cy={"12"} r={"4"} /></svg></div><h3 className={"h-card"}>Youth entrepreneurship</h3><p className={"small"}>Preparing young people to lead and to create their own sustainable enterprises.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 18c4-1 6-4 8-8s4-6 8-6"} /><path d={"M4 21h16"} /></svg></div><h3 className={"h-card"}>Sustainable livelihoods</h3><p className={"small"}>Livelihood opportunities that benefit youth and communities.</p></div>
</div>
</div>
</section>


<section id={"learning"} className={"sec band"}>
<div className={"wrap"}>
<div className={"head center"}><p className={"eyebrow"}>Learning philosophy</p><h2 className={"h-sec"}>Beyond the <em>classroom</em></h2><p className={"lede"} style={css("text-align:center")}>We believe that skill development should go beyond classroom learning. Our programmes combine:</p></div>
<ol className={"hsteps"}>
<li><span className={"dot"}>01</span><h3 className={"h-card"}>Knowledge and practical skills</h3><p className={"small"}>Specific knowledge paired with hands-on practice.</p></li>
<li><span className={"dot"}>02</span><h3 className={"h-card"}>Tourism, hospitality &amp; caregiving</h3><p className={"small"}>Tourism and hospitality training, and caregiving skills.</p></li>
<li><span className={"dot"}>03</span><h3 className={"h-card"}>Management &amp; leadership</h3><p className={"small"}>Management and leadership development, and global entrepreneurship.</p></li>
<li><span className={"dot"}>04</span><h3 className={"h-card"}>Digital &amp; community</h3><p className={"small"}>Digital skills and community engagement.</p></li>
<li><span className={"dot"}>05</span><h3 className={"h-card"}>Practice &amp; projects</h3><p className={"small"}>Practical exposure and project-based learning.</p></li>
</ol>
</div>
</section>


<section className={"sec"}>
<div className={"wrap"}>
<div className={"cta-band forest"}>
<div className={"stack"}><p className={"eyebrow"}>Learn • Practise • Create • Lead</p><h2 className={"h-sec"} style={css("color:#f7f3e8")}>Find the programme that fits your <em>path</em>.</h2></div>
<div className={"cta"}><Button variant={"primary"} href={"/programmes"}>Explore Our Programmes</Button></div>
</div>
</div>
</section>

<Footer />
</>
    );
  }
}
