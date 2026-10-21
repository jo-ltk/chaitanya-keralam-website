'use client';
/* Converted from the Chaitanya Keralam design canvas (TeshHomes). */
import React from 'react';
import { Button, NavBar, StoryPanel, TextField } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class TeshHomes extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) { super(props); this.state = { menu: false, tab: 'home', hSent: false, pSent: false }; }
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
    var h = React.createElement, self = this;
    var isHome = this.state.tab === 'home';
    return Object.assign(this.nav('TESH Homes'), {
      districts: ['Ernakulam', 'Kottayam', 'Alappuzha', 'Pathanamthitta', 'Idukki'],
      t1Title: h(React.Fragment, null, h('em', null, 'Guest'), ' houses'),
      t2Title: h(React.Fragment, null, 'Training & ', h('em', null, 'activity'), ' centres'),
      isHome: isHome, isPartner: !isHome,
      tabHomeCls: isHome ? 'on' : '', tabPartCls: isHome ? '' : 'on',
      toHome: function () { self.setState({ tab: 'home' }); },
      toPartner: function () { self.setState({ tab: 'partner' }); },
      hSent: this.state.hSent, pSent: this.state.pSent,
      hSubmit: function () { self.setState({ hSent: true }); },
      pSubmit: function () { self.setState({ pSent: true }); }
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


<section className={"wrap h-hero"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / TESH Homes, Careers &amp; Partnerships</p>
<p className={"eyebrow r1"}>TESH Homes <span className={"tbc"}>Proposed initiative</span></p>
<h1 className={"h-display h-page r2"}>Turning existing homes into <em>opportunities</em> for communities.</h1>
<p className={"lede r3"}>Kerala has around 1.4 million unutilized or underutilized houses. TESH Homes is a proposed initiative to transform suitable existing homes into TSB and TESH Homes — a distributed network of international guest houses, training centres and activity centres connecting tourism, practical learning and youth entrepreneurship.</p>
<div className={"cta r4"}>
<Button variant={"primary"} href={"#partner-form"} onClick={$v?.toPartner}>Partner With Us</Button>
<Button variant={"secondary"} href={"#homeowners"} onClick={$v?.toHome}>I have a property</Button>
</div>
</div>
<div className={"h-collage"} aria-label={"Photos of Kerala homes"}>
<div className={"ph c1 p3"}>[Feature photo]</div>
<div className={"ph c2 p1"}>[Photo 1]</div>
<div className={"ph c3 p2"}>[Photo 2]</div>
<div className={"ph c4 p4"}>[Photo 4]</div>
<div className={"ph c5 p5"}>[Photo 5]</div>
</div>
</section>


<section id={"pilot"} className={"sec-t"}>
<div className={"wrap"}>
<div className={"dots-wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"eyebrow"}>Central Travancore <span className={"tbc"}>Proposed pilot</span></p>
<h2 className={"h-sec"} style={css("color:#f7f3e8")}>A proposed pilot across <em>five</em> districts</h2>
<p className={"body"}>The Kerala Pilot Project proposes an initial implementation of 10 selected homes in each of five Central Travancore districts — 5 villas per district as TSB &amp; TESH Guest Houses and 5 as Training / Activity Centres. This is a proposed pilot, not a completed development.</p>
<div className={"dstat"}>
<div><b>5</b><span className={"small"}>Districts</span></div>
<div><b>10</b><span className={"small"}>Homes per district</span></div>
<div><b>50</b><span className={"small"}>Homes in total</span></div>
</div>
</div>
<div role={"img"} aria-label={"Diagram: 10 proposed homes in each of five districts — Ernakulam, Kottayam, Alappuzha, Pathanamthitta and Idukki — five guest houses and five training or activity centres in each"}>
{($v?.districts || []).map((d: any, $index: number) => (<React.Fragment key={$index}>
<div className={"drow"}><span>{d}</span><span className={"dots"} aria-hidden={"true"}><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
</React.Fragment>))}
<p className={"dlegend"}><span><i className={"f"}></i>Guest houses (5 per district)</span><span><i></i>Training / activity centres (5 per district)</span></p>
</div>
</div>
</div>
</section>


<section id={"types"} className={"sec"}>
<div className={"wrap"}>
<div className={"g2"} style={css("align-items:end;margin-bottom:clamp(32px,3vw,48px)")}>
<div className={"stack"}><p className={"eyebrow"}>Proposed home types</p><h2 className={"h-sec"}>Two ways a home can <em>serve</em></h2></div>
<p className={"body muted"}>Each proposed TESH Home would connect tourism, practical learning and community life.</p>
</div>
<div className={"types"}>
<StoryPanel tone={"forest"} nav={"TESH Homes"} navEnd={"Type 01"} title={$v?.t1Title} deck={"For local, national and international travellers."}>
<svg width={"96"} height={"96"} viewBox={"0 0 96 96"} aria-hidden={"true"}><path d={"M14 50 48 22l34 28"} fill={"none"} stroke={"#c5a15a"} strokeWidth={"3"} strokeLinejoin={"round"} /><path d={"M22 46v34h52V46"} fill={"#f2e7cd"} stroke={"#f7f3e8"} strokeWidth={"2"} /><rect x={"42"} y={"58"} width={"12"} height={"22"} fill={"#123d32"} /></svg>
</StoryPanel>
<StoryPanel tone={"gold"} nav={"TESH Homes"} navEnd={"Type 02"} title={$v?.t2Title} deck={"Proposed centres for meditation; mediation; caregiver training / social service; AI-enabled agriculture training / farming; composite skills training; global entrepreneurship & e-commerce; and cultural activities & edutainment."}>
<svg width={"96"} height={"96"} viewBox={"0 0 96 96"} aria-hidden={"true"}><path d={"M48 18c10 14 14 22 0 34-14-12-10-20 0-34Z"} fill={"#123d32"} /><path d={"M20 80h56M28 70h40"} stroke={"#123d32"} strokeWidth={"3"} strokeLinecap={"round"} /><path d={"M48 52v18"} stroke={"#123d32"} strokeWidth={"3"} /></svg>
</StoryPanel>
</div>
</div>
</section>


<section id={"careers"} className={"sec white"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Career pathway</p><h2 className={"h-sec"}>From learning to <em>leading</em></h2></div>
<ol className={"hstep"}>
<li><span className={"bar"}></span><span className={"small"} style={css("color:#80664b")}>Step 01</span><h3 className={"h-card"}>Training</h3><p className={"small"}>Practical training in tourism, hospitality, caregiving and global entrepreneurship.</p></li>
<li><span className={"bar"}></span><span className={"small"} style={css("color:#80664b")}>Step 02</span><h3 className={"h-card"}>Practical Experience</h3><p className={"small"}>Hands-on experience through TESH Homes, training centres and community-based activities.</p></li>
<li><span className={"bar"}></span><span className={"small"} style={css("color:#80664b")}>Step 03</span><h3 className={"h-card"}>TESH Home Management</h3><p className={"small"}>Trained youth may take up roles in managing TESH Homes as the proposed network develops.</p></li>
<li><span className={"bar"}></span><span className={"small"} style={css("color:#80664b")}>Step 04</span><h3 className={"h-card"}>Youth Entrepreneurship</h3><p className={"small"}>Moving beyond employment to create sustainable enterprises connected to the TESH ecosystem.</p></li>
</ol>
<div className={"g2"} style={css("margin-top:clamp(48px,5vw,80px);align-items:start")}>
<div className={"stack"} style={css("gap:16px")}><p className={"eyebrow plain"} style={css("color:#5d5b4d")}>TESH Home management roles</p><div className={"incl"}><span>Guest services</span><span>Hospitality operations</span><span>Tourism activities</span><span>Caregiving services*</span><span>Wellness &amp; meditation activities</span><span>House and facility management</span><span>Sustainable agriculture</span><span>Digital / AI-enabled activities</span></div><p className={"eyebrow plain"} style={css("color:#5d5b4d;margin-top:12px")}>Examples of enterprises</p><div className={"incl"}><span>Homestay / guesthouse enterprises</span><span>Sustainable / AI-enabled agriculture</span><span>Eco-tourism experiences</span><span>Tour &amp; travel services</span><span>Wellness &amp; spiritual tourism services</span><span>Local products and community enterprises</span><span>Caregiving services*</span><span>Digital tourism and service businesses</span></div><p className={"small"}>*Subject to relevant requirements.</p></div>
<div className={"stack"} style={css("gap:16px")}><p className={"ab-sub"} style={css("margin:0")}>Global citizenship through global entrepreneurship and e-commerce.</p><p className={"note"}>These are intended career and enterprise pathways, not guaranteed placements or earnings.</p></div>
</div>
</div>
</section>


<section id={"partner"} className={"sec band"}>
<div className={"wrap"}>
<div className={"g2"} style={css("align-items:end;margin-bottom:clamp(32px,3vw,48px)")}>
<div className={"stack"}><p className={"eyebrow"}>Partnership opportunities</p><h2 className={"h-sec"}>Build this <em>with us</em></h2></div>
<p className={"body muted"}>We welcome enquiries from:</p>
</div>
<div className={"plist"}>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 11 12 4l9 7"} /><path d={"M5 10v10h14V10"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Homeowners</h3><p className={"small"}>With suitable properties to contribute to the network.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 18h18"} /><path d={"M5 18a7 7 0 0 1 14 0"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Tourism &amp; hospitality businesses</h3><p className={"small"}>Offering exposure, partnership or collaboration.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 9 12 5l8 4-8 4-8-4Z"} /><path d={"M8 11v4c2 2 6 2 8 0v-4"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Training institutions</h3><p className={"small"}>Sharing expertise and learning pathways.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"9"} cy={"8"} r={"3"} /><circle cx={"17"} cy={"9"} r={"2.5"} /><path d={"M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.5 1.5-4.5 4-4.5"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Community organisations</h3><p className={"small"}>Connecting tourism with local life.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M8 12h8M12 8v8"} /><circle cx={"12"} cy={"12"} r={"9"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Potential project partners</h3><p className={"small"}>Supporting the proposed TESH Homes network.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"8"} r={"4"} /><path d={"M4 21c0-4 3.6-7 8-7s8 3 8 7"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Individuals</h3><p className={"small"}>Interested in youth entrepreneurship.</p></div></div>
</div>
</div>
</section>


<section id={"homeowners"} className={"sec"}>
<span id={"partner-form"}></span>
<div className={"wrap-n"} style={css("max-width:920px")}>
<div className={"head center"}><p className={"eyebrow"}>Get in touch</p><h2 className={"h-sec"}>Start a <em>conversation</em></h2>
<div className={"ftabs"} role={"tablist"} aria-label={"Enquiry type"}>
<button className={$v?.tabHomeCls} role={"tab"} aria-selected={$v?.isHome} onClick={$v?.toHome}>Homeowner enquiry</button>
<button className={$v?.tabPartCls} role={"tab"} aria-selected={$v?.isPartner} onClick={$v?.toPartner}>Partnership enquiry</button>
</div>
</div>

{!!($v?.isHome) && (<>
<div className={"form"} role={"tabpanel"} style={css("animation:rise .4s var(--ease) both")}>
<h3 className={"h-card"}>Homeowner enquiry</h3>
<TextField label={"Name"} placeholder={"Your name"} autocomplete={"name"} />
<div className={"frow"}>
<TextField label={"Phone"} type={"tel"} placeholder={"+91"} autocomplete={"tel"} />
<TextField label={"Email"} type={"email"} placeholder={"you@example.com"} autocomplete={"email"} />
</div>
<TextField label={"Property location"} placeholder={"Town, district"} />
<div className={"frow"}>
<div style={css("display:flex;flex-direction:column;gap:8px")}><label className={"kn-field-label"} htmlFor={"ptype"}>Property type</label><select id={"ptype"} className={"sel"}><option>Independent house</option><option>Villa</option><option>Heritage home</option><option>Other</option></select></div>
<div style={css("display:flex;flex-direction:column;gap:8px")}><label className={"kn-field-label"} htmlFor={"collab"}>Intended collaboration</label><select id={"collab"} className={"sel"}><option>Guest house</option><option>Training centre</option><option>Activity centre</option><option>Not sure yet</option></select></div>
</div>
<div style={css("display:flex;flex-direction:column;gap:8px")}><label className={"kn-field-label"} htmlFor={"hmsg"}>Message</label><textarea id={"hmsg"} className={"ta"} placeholder={"Tell us about the property"}></textarea></div>
{!!($v?.hSent) && (<><p className={"thanks"}>Thank you — the project team will be in touch.</p></>)}
<Button variant={"primary"} onClick={$v?.hSubmit}>Send homeowner enquiry</Button>
</div>
</>)}

{!!($v?.isPartner) && (<>
<div className={"form"} role={"tabpanel"} style={css("animation:rise .4s var(--ease) both")}>
<h3 className={"h-card"}>Partnership enquiry</h3>
<div className={"frow"}>
<TextField label={"Contact name"} placeholder={"Your name"} autocomplete={"name"} />
<TextField label={"Organisation"} placeholder={"Organisation name"} autocomplete={"organization"} />
</div>
<div style={css("display:flex;flex-direction:column;gap:8px")}><label className={"kn-field-label"} htmlFor={"ptype2"}>Partnership type</label><select id={"ptype2"} className={"sel"}><option>Tourism or hospitality business</option><option>Training institution</option><option>Community organisation</option><option>Project partner</option><option>Individual</option></select></div>
<div className={"frow"}>
<TextField label={"Email"} type={"email"} placeholder={"you@example.com"} autocomplete={"email"} />
<TextField label={"Phone"} type={"tel"} placeholder={"+91"} autocomplete={"tel"} />
</div>
<div style={css("display:flex;flex-direction:column;gap:8px")}><label className={"kn-field-label"} htmlFor={"pmsg"}>Collaboration details</label><textarea id={"pmsg"} className={"ta"} placeholder={"How would you like to collaborate?"}></textarea></div>
{!!($v?.pSent) && (<><p className={"thanks"}>Thank you — the project team will be in touch.</p></>)}
<Button variant={"primary"} onClick={$v?.pSubmit}>Send partnership enquiry</Button>
</div>
</>)}
</div>
</section>


<section className={"sec"} style={css("padding-top:0")}>
<div className={"wrap"}>
<div className={"cta-band greenbg"}>
<div className={"stack"}><p className={"eyebrow"}>Learn • Practise • Create • Lead</p><h2 className={"h-sec"} style={css("color:#f7f3e8")}>Help build a network connecting Kerala's homes, communities, tourism and <em style={css("color:#f2e7cd")}>youth opportunities</em>.</h2></div>
<div className={"cta"}><Button variant={"primary"} href={"#partner-form"} onClick={$v?.toPartner}>Partner With Us</Button></div>
</div>
</div>
</section>

<Footer />
</>
    );
  }
}
