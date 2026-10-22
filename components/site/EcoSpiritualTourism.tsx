'use client';
/* Converted from the Chaitanya Keralam design canvas (EcoSpiritualTourism). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class EcoSpiritualTourism extends React.Component<any, any> {
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
      ['01', 'Nature and ecology', 'Forests, rivers, mountains, biodiversity and conservation.', 'p1'],
      ['02', 'Spirituality and heritage', 'Sacred landscapes, pilgrimage traditions, cultural heritage and respectful understanding of different traditions.', 'p2'],
      ['03', 'Wellness and peace', 'Meditation, reflection, nature-based wellness and retreat experiences.', 'p4'],
      ['04', 'Kerala culture and hospitality', 'Traditional architecture, cuisine, arts, crafts, community knowledge and hospitality.', 'p1'],
      ['05', 'Responsible tourism', 'Waste reduction, water and energy conservation, cultural respect and community participation.', 'p2']
    ];
    var i = this.state.open;
    var themes = data.map(function (r, k) { return { n: r[0], title: r[1], text: r[2], tone: r[3], on: k === i, cls: k === i ? 'ttab on' : 'ttab', pick: function () { self.setState({ open: k }); } }; });
    return Object.assign(this.nav('Tourism'), {
      themes: themes,
      cur: themes[i],
      next: function () { self.setState({ open: (i + 1) % data.length }); }
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


<section className={"t-hero"}>
<img src={"/images/eco-spiritual-tourism/kerala-backwaters-sunrise.png"} alt={"Kerala backwaters — panoramic landscape"} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',filter:'brightness(0.72)'}} aria-hidden={"true"} />
<div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(14, 43, 35, 0.45) 0%, rgba(14, 43, 35, 0.75) 60%, rgba(14, 43, 35, 0.92) 100%)',pointerEvents:'none'}} aria-hidden={"true"} />
<div className={"wrap t-copy"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / Eco-Spiritual Peace Tourism</p>
<p className={"eyebrow r1"}>Eco-Spiritual Peace Tourism</p>
<h1 className={"h-display r2"} style={css("max-width:15ch")}>Experience Kerala through nature, culture and <em>peace</em>.</h1>
</div>
<div className={"stack r3"} style={css("gap:24px")}>
<p className={"lede"}>Eco-Spiritual Peace Tourism connects natural environments, cultural heritage, spiritual traditions, wellness and responsible travel.</p>
<div className={"cta"}><Button variant={"primary"} href={"#themes"}>Explore the themes</Button></div>
</div>
</div>
</section>
<div className={"wrap"}>
<div className={"t-film"} aria-label={"Photos of Kerala landscapes and culture"}>
<div style={{borderRadius:'14px',overflow:'hidden',aspectRatio:'4/3',boxShadow:'var(--shadow-card)'}}><img src={"/images/eco-spiritual-tourism/misty-rainforest-stream.png"} alt={"Kerala forest hills"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
<div style={{borderRadius:'14px',overflow:'hidden',aspectRatio:'4/3',boxShadow:'var(--shadow-card)'}}><img src={"/images/eco-spiritual-tourism/kerala-courtyard.png"} alt={"Kerala spiritual heritage"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
<div style={{borderRadius:'14px',overflow:'hidden',aspectRatio:'4/3',boxShadow:'var(--shadow-card)'}}><img src={"/images/eco-spiritual-tourism/serene-tropical-retreat.png"} alt={"Wellness and meditation"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
<div style={{borderRadius:'14px',overflow:'hidden',aspectRatio:'4/3',boxShadow:'var(--shadow-card)'}}><img src={"/images/eco-spiritual-tourism/golden-backwaters-village.png"} alt={"Kerala heritage home"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
</div>
</div>


<section className={"sec"} style={css("padding-bottom:0")}>
<div className={"wrap-n"} style={css("text-align:center")}>
<p className={"ab-sub"} style={css("font-weight:500;color:#123d32;max-width:30ch;margin:0 auto")}>Chaitanya Keralam's long-term vision is to develop these elements into meaningful tourism experiences while supporting local communities and youth livelihoods.</p>
</div>
</section>


<section id={"themes"} className={"sec"}>
<div className={"wrap"}>
<div className={"g2"} style={css("align-items:end;margin-bottom:clamp(32px,3vw,48px)")}>
<div className={"stack"}><p className={"eyebrow"}>Core themes</p><h2 className={"h-sec"}>Five themes at the heart of <em>every</em> experience</h2></div>
<p className={"body muted"}>Select a theme to explore what it means for travellers, communities and learners.</p>
</div>
<div className={"ttabs"} role={"tablist"} aria-label={"Core themes"}>
{($v?.themes || []).map((t: any, $index: number) => (<React.Fragment key={$index}>
<button className={t?.cls} role={"tab"} aria-selected={t?.on} onClick={t?.pick}>{t?.title}</button>
</React.Fragment>))}
</div>
<div className={"tpanel"} role={"tabpanel"} data-swap>
<div style={{borderRadius:'24px',overflow:'hidden',aspectRatio:'16/11'}}><img src={$v?.cur?.n === '01' ? '/images/eco-spiritual-tourism/misty-rainforest-stream.png' : $v?.cur?.n === '02' ? '/images/eco-spiritual-tourism/kerala-courtyard.png' : $v?.cur?.n === '03' ? '/images/eco-spiritual-tourism/serene-tropical-retreat.png' : $v?.cur?.n === '04' ? '/images/eco-spiritual-tourism/golden-backwaters-village.png' : '/images/eco-spiritual-tourism/kerala-backwaters-sunrise.png'} alt={$v?.cur?.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
<div className={"stack"} style={css("gap:18px")}>
<span className={"tnum"}>{$v?.cur?.n}</span>
<h3 className={"h-sec"} style={css("font-size:clamp(26px,2.4vw,40px)")}>{$v?.cur?.title}</h3>
<p className={"lede"}>{$v?.cur?.text}</p>
<div className={"cta"}><Button variant={"quiet"} onClick={$v?.next}>Next theme →</Button></div>
</div>
</div>
</div>
</section>


<section id={"why-kerala"} className={"sec forest"}>
<div className={"wrap split"} style={css("align-items:center")}>
<div className={"stack"} style={css("gap:24px")}>
<p className={"eyebrow"}>Why Kerala?</p>
<h2 className={"h-sec"} style={css("color:#f7f3e8")}>A land of rivers, forests and <em>open doors</em></h2>
<p className={"body"}>Kerala holds remarkable natural diversity — backwaters, beaches, hill ranges and forests — alongside a deep cultural heritage and a long tradition of hospitality.</p>
<p className={"body"}>Kerala's heritage has been shaped by ancient trade and cultural exchange, Ayurveda and traditional wellness, spiritual traditions and indigenous knowledge, and hospitality and community living.</p>
<div className={"heritage"}>
<div><span className={"small"} style={css("opacity:.8")}>Ancient trade hub</span><b>Muziris</b><span className={"small"}>A legendary port on the spice route and Kerala's gateway for many world religions</span></div>
<div><span className={"small"} style={css("opacity:.8")}>Ports of the Indian Ocean</span><b>Pattanam</b><span className={"small"}>Linked with Muziris on the project presentation's map of ancient trade ports, 100 BC – 300 AD</span></div>
</div>
</div>
<div style={{borderRadius:'18px',overflow:'hidden',aspectRatio:'4/5'}}><img src={"/images/eco-spiritual-tourism/golden-backwaters-village.png"} alt={"Kerala landscape"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
</div>
</section>


<section id={"principles"} className={"sec band"}>
<div className={"wrap"}>
<div className={"head center"}><p className={"eyebrow"}>Responsible tourism principles</p><h2 className={"h-sec"}>Travel that <em>gives back</em></h2><p className={"lede"} style={css("text-align:center")}>The principles that guide how we plan, host and teach.</p></div>
<ul className={"pledge"}>
<li><span className={"circ"}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"9"} cy={"8"} r={"3"} /><circle cx={"17"} cy={"9"} r={"2.5"} /><path d={"M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.5 1.5-4.5 4-4.5"} /></svg></span><p className={"body"} style={css("font-weight:500")}>Respect local customs and cultural differences.</p></li>
<li><span className={"circ"}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 20c0-9 6-15 16-16-1 10-7 16-16 16Z"} /><path d={"M4 20 14 10"} /></svg></span><p className={"body"} style={css("font-weight:500")}>Protect natural environments.</p></li>
<li><span className={"circ"}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z"} /></svg></span><p className={"body"} style={css("font-weight:500")}>Reduce waste and conserve resources.</p></li>
<li><span className={"circ"}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10h16l-1.5-5h-13Z"} /><path d={"M5 10v10h14V10M10 20v-5h4v5"} /></svg></span><p className={"body"} style={css("font-weight:500")}>Support local businesses and service providers.</p></li>
<li><span className={"circ"}><svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"8"} /><path d={"M8 13c1 2 2.5 3 4 3s3-1 4-3"} /></svg></span><p className={"body"} style={css("font-weight:500")}>Encourage community participation.</p></li>
</ul>
</div>
</section>


<section id={"livelihoods"} className={"sec white"}>
<div className={"wrap split"} style={css("align-items:center")}>
<div className={"stack"} style={css("gap:24px")}>
<p className={"eyebrow"}>Tourism and livelihoods</p>
<h2 className={"h-sec"}>Where tourism meets <em>practical training</em></h2>
<p className={"body muted"}>Responsible tourism creates many kinds of work. Chaitanya Keralam aims to connect these opportunities with practical training, so young people and communities can take part.</p>
<div className={"cta"}><Button variant={"secondary"} href={"/programmes"}>See the programmes</Button></div>
</div>
<div className={"hub"}>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 18h18"} /><path d={"M5 18a7 7 0 0 1 14 0"} /><path d={"M12 9V7"} /></svg></div><h3 className={"h-card"}>Guest services</h3><p className={"small"}>Welcoming, informing and caring for visitors.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"10"} r={"3"} /><path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"} /></svg></div><h3 className={"h-card"}>Local guides</h3><p className={"small"}>Sharing nature, heritage and stories with care.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 11 12 4l9 7"} /><path d={"M5 10v10h14V10"} /></svg></div><h3 className={"h-card"}>Hospitality</h3><p className={"small"}>Guest houses, resorts and retreats run sustainably.</p></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M12 3v4M12 17v4M3 12h4M17 12h4"} /><circle cx={"12"} cy={"12"} r={"4"} /></svg></div><h3 className={"h-card"}>Community enterprises</h3><p className={"small"}>Local businesses that keep tourism's benefits close to home.</p></div>
</div>
</div>
</section>


<section className={"sec"}>
<div className={"wrap"}>
<div className={"cta-band goldbg"}>
<div className={"stack"}><p className={"eyebrow"} style={css("color:#123d32")}>Learn • Practise • Create • Lead</p><h2 className={"h-sec"}>Turn a love of Kerala into skills you can use.</h2></div>
<div className={"cta"}><Button variant={"primary"} href={"/programmes"}>Explore Skill Development Programmes</Button></div>
</div>
</div>
</section>

<Footer />
</>
    );
  }
}
