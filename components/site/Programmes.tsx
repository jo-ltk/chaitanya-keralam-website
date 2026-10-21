'use client';
/* Converted from the Chaitanya Keralam design canvas (Programmes). */
import React from 'react';
import { Button, NavBar, TextField } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';

export default class Programmes extends React.Component<any, any> {
  [key: string]: any;

  constructor(props) { super(props); this.state = { menu: false, sent: false, area: 0 }; }
  nav(cur) {
    var self = this;
    var L = [['Home', '/'], ['About', '/about'], ['Tourism', '/eco-spiritual-tourism'], ['Programmes', '/programmes'], ['TESH Homes', '/tesh-homes'], ['Admissions', '#admissions'], ['Contact', '#contact']];
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
      ['01', 'Eco-Spiritual Peace Tourism & Travel', 'Knowledge and practical skills related to tourism experiences — exploring the connection between nature, ecology, spirituality, peace, wellness, culture and responsible travel.', ['Tourism experiences', 'Travel planning', 'Destination development', 'Interpretation', 'Responsible tourism']],
      ['02', 'Eco-Spiritual Hospitality', 'Practical hospitality skills for eco-friendly and wellness-oriented tourism environments.', ['Guest relations', 'Front office', 'Housekeeping', 'Food & beverage service', 'Guest experience', 'Wellness hospitality', 'Retreat hospitality', 'Eco-hospitality']],
      ['03', 'International Caregiving', 'Foundational and progressive caregiving skills that can support opportunities in care-related services. Caregiving is integrated as a specialised skill area within the broader eco-spiritual tourism and hospitality programme.', ['Personal care', 'Daily living support', 'Elderly care', 'Vulnerable person care', 'Mobility support', 'Nutrition and safe assistance', 'Emotional and social wellbeing', 'Communication', 'Basic first aid and emergency awareness', 'Care documentation']],
      ['04', 'Global Entrepreneurship & Leadership', 'The mindset and practical abilities required to become an entrepreneur and responsible leader.', ['Entrepreneurial mindset', 'Opportunity identification', 'Market research', 'Business models', 'Business planning', 'Costing and pricing', 'Digital marketing', 'Team management', 'Communication', 'Leadership', 'Project development']]
    ];
    var i = this.state.area;
    var areas = data.map(function (r, k) { return { n: r[0], title: r[1], text: r[2], topics: r[3], on: k === i, cls: k === i ? 'vtab on' : 'vtab', pick: function () { self.setState({ area: k }); } }; });
    return Object.assign(this.nav('Programmes'), {
      areas: areas,
      area: areas[i],
      sent: this.state.sent,
      submit: function () { self.setState({ sent: true }); }
    });
  }

  render() {
    const $v: any = this.renderVals();
    return (
<>


<div className={"navbar"}>
<a className={"nav-logo"} href={"/"} tabIndex={-1}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /></a>
<NavBar brand={"Chaitanya Keralam"} brandHref={"/"} links={$v?.navLinks} />
<div className={"nav-cta"}><Button variant={"primary"} size={"sm"} href={"#admissions"}>Apply now</Button></div>
<button className={"menu-btn"} aria-label={$v?.menuLabel} aria-expanded={$v?.menuOpen} onClick={$v?.toggleMenu}><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><path d={$v?.menuIcon} /></svg></button>
</div>
{!!($v?.menuOpen) && (<>
<nav className={"mnav"} aria-label={"Mobile"}>
{($v?.navLinks || []).map((l: any, $index: number) => (<React.Fragment key={$index}><a href={l?.href} className={l?.cls} onClick={$v?.closeMenu}>{l?.label}</a></React.Fragment>))}
<div className={"cta"}><Button variant={"primary"} href={"#admissions"}>Apply now</Button></div>
</nav>
</>)}


<section className={"wrap p-hero"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>Home</a> / Programmes</p>
<p className={"eyebrow r1"}>TESH Skill Development Programmes</p>
<h1 className={"h-display h-page r2"}>Build practical skills. Create opportunities. Lead with <em>purpose</em>.</h1>
<p className={"ab-sub r3"} style={css("font-weight:500;color:#2f6b50")}>Entrepreneurship &amp; Leadership in Eco-Spiritual Peace Tourism &amp; Hospitality</p>
<p className={"lede r3"}>The TESH Skill Development Programmes are designed for young people who want to develop practical skills and explore career and entrepreneurial opportunities in eco-spiritual tourism, trading, technology, hospitality, caregiving and related services.</p>
<div className={"cta r4"}>
<Button variant={"primary"} href={"#compare"}>Compare programmes</Button>
<Button variant={"secondary"} href={"#admissions"}>Eligibility &amp; selection</Button>
</div>
</div>
<nav className={"glance"} aria-label={"Programmes at a glance"}>
<a href={"/programmes/3-month-foundation"}><span className={"lvl"} style={css("background:#dde8df")}>3M</span><span className={"stack-s"} style={css("gap:2px")}><b style={css("font-weight:600")}>3-Month Foundation</b><span className={"small"}>240 training hours · Offline</span></span><span className={"arrow"} aria-hidden={"true"}>→</span></a>
<a href={"/programmes/6-month-professional"}><span className={"lvl"} style={css("background:#c5a15a")}>6M</span><span className={"stack-s"} style={css("gap:2px")}><b style={css("font-weight:600")}>6-Month Professional</b><span className={"small"}>480 training hours · Offline</span></span><span className={"arrow"} aria-hidden={"true"}>→</span></a>
<a href={"/programmes/1-year-advanced"}><span className={"lvl"} style={css("background:#123d32;color:#f7f3e8")}>1Y</span><span className={"stack-s"} style={css("gap:2px")}><b style={css("font-weight:600")}>1-Year Advanced</b><span className={"small"}>960 training hours · Offline</span></span><span className={"arrow"} aria-hidden={"true"}>→</span></a>
</nav>
</section>

<nav className={"subnav"} aria-label={"On this page"}>
<ul><li><a href={"#areas"}>Learning areas</a></li><li><a href={"#compare"}>Compare programmes</a></li><li><a href={"#format"}>Learning format</a></li><li><a href={"#admissions"}>Eligibility &amp; admissions</a></li></ul>
</nav>


<section id={"areas"} className={"sec white"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Four learning areas</p><h2 className={"h-sec"}>What you will <em>study</em></h2></div>
<div className={"vtabs"}>
<div className={"vtab-list"} role={"tablist"} aria-label={"Learning areas"}>
{($v?.areas || []).map((a: any, $index: number) => (<React.Fragment key={$index}>
<button className={a?.cls} role={"tab"} aria-selected={a?.on} onClick={a?.pick}><span>{a?.n}</span><span>{a?.title}</span><span aria-hidden={"true"}>→</span></button>
</React.Fragment>))}
</div>
<div className={"vpanel"} role={"tabpanel"} data-swap>
<span className={"mod-n"}>{$v?.area?.n}</span>
<h3 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>{$v?.area?.title}</h3>
<p className={"lede"}>{$v?.area?.text}</p>
<p className={"eyebrow plain"} style={css("color:#5d5b4d")}>Key areas include</p>
<div className={"incl"}>
{($v?.area?.topics || []).map((t: any, $index: number) => (<React.Fragment key={$index}><span>{t}</span></React.Fragment>))}
</div>
</div>
</div>
</div>
</section>


<section id={"compare"} className={"sec band"}>
<div className={"wrap"}>
<div className={"head center"}><p className={"eyebrow"}>Programme comparison</p><h2 className={"h-sec"}>Three levels, one <em>pathway</em></h2><p className={"body muted"} style={css("text-align:center")}>All levels: 4 hours a day, 5 days a week.</p></div>
<div className={"plans"}>
<article className={"plan"}>
<div className={"plan-top"} style={css("background:#dde8df")}>
<svg width={"56"} height={"56"} viewBox={"0 0 80 80"} aria-hidden={"true"}><path d={"M14 66c0-28 18-46 52-52-4 34-22 52-52 52Z"} fill={"#c5a15a"} stroke={"#123d32"} strokeWidth={"2"} /><path d={"M14 66 48 32"} stroke={"#123d32"} strokeWidth={"2"} /></svg>
<p className={"eyebrow plain"}>Foundation level</p>
<h3 className={"h-sec"} style={css("font-size:clamp(24px,2vw,32px)")}>3-Month Foundation</h3>
</div>
<dl><div><dt>Duration</dt><dd>3 months</dd></div><div><dt>Learning hours</dt><dd>240 training hours</dd></div><div><dt>Mode</dt><dd>Offline</dd></div><div><dt>Eligibility</dt><dd>Plus Two / Higher Secondary or equivalent</dd></div></dl>
<p className={"foc"}>Introduces the basic concepts and practical skills of tourism &amp; travel, eco-spiritual peace tourism, hospitality, basic caregiving, eco-hospitality, entrepreneurship, personal leadership and digital skills.</p><p className={"small"}><b>Progression:</b> Learn · Practise · Assist</p>
<div className={"cta"}><Button variant={"secondary"} href={"/programmes/3-month-foundation"}>View Programme</Button></div>
</article>
<article className={"plan"}>
<div className={"plan-top"} style={css("background:#c5a15a")}>
<svg width={"56"} height={"56"} viewBox={"0 0 80 80"} aria-hidden={"true"}><path d={"M40 10c6 8 8 14 0 22-8-8-6-14 0-22Z"} fill={"#123d32"} /><path d={"M26 38h28l-4 10H30Z"} fill={"#80664b"} stroke={"#123d32"} strokeWidth={"2"} /><path d={"M40 48v16M28 70h24M32 64h16"} stroke={"#123d32"} strokeWidth={"3"} strokeLinecap={"round"} /></svg>
<p className={"eyebrow plain"} style={css("color:#123d32")}>Professional level</p>
<h3 className={"h-sec"} style={css("font-size:clamp(24px,2vw,32px)")}>6-Month Professional</h3>
</div>
<dl><div><dt>Duration</dt><dd>6 months</dd></div><div><dt>Learning hours</dt><dd>480 training hours</dd></div><div><dt>Mode</dt><dd>Offline</dd></div><div><dt>Eligibility</dt><dd>Plus Two / Higher Secondary or equivalent</dd></div></dl>
<p className={"foc"}>Develops stronger operational skills in eco-spiritual tourism, destination development, tour and itinerary planning, sustainable tourism, hospitality operations, international caregiving, entrepreneurship, business development, team leadership and TESH Home practical training.</p><p className={"small"}><b>Progression:</b> Learn · Practise · Operate · Take responsibility</p>
<div className={"cta"}><Button variant={"secondary"} href={"/programmes/6-month-professional"}>View Programme</Button></div>
</article>
<article className={"plan"}>
<div className={"plan-top"} style={css("background:#123d32;color:#f7f3e8")}>
<svg width={"56"} height={"56"} viewBox={"0 0 80 80"} aria-hidden={"true"}><path d={"M10 50 Q40 64 70 50 L64 60 Q40 72 16 60 Z"} fill={"#c5a15a"} /><path d={"M20 50 Q28 30 40 28 Q52 30 60 50 Z"} fill={"#f2e7cd"} /><path d={"M8 70 q8 -4 16 0 t16 0 t16 0 t16 0"} fill={"none"} stroke={"#f7f3e8"} strokeWidth={"2"} strokeLinecap={"round"} /></svg>
<p className={"eyebrow plain"} style={css("color:#c5a15a")}>Advanced level</p>
<h3 className={"h-sec"} style={css("font-size:clamp(24px,2vw,32px);color:#f7f3e8")}>1-Year Advanced</h3>
</div>
<dl><div><dt>Duration</dt><dd>12 months</dd></div><div><dt>Learning hours</dt><dd>960 training hours</dd></div><div><dt>Mode</dt><dd>Offline</dd></div><div><dt>Eligibility</dt><dd><span className={"tbc"}>To be confirmed</span></dd></div></dl>
<p className={"foc"}>Develops higher-level capabilities in tourism and destination management, tour operations, tourism experience design, advanced hospitality management, eco-resort and wellness management, advanced caregiving, entrepreneurship, business management, financial skills, digital marketing, leadership and supervision, TESH Home management, and business and management projects.</p><p className={"small"}><b>Progression:</b> Supervise · Lead · Manage · Create</p>
<div className={"cta"}><Button variant={"secondary"} href={"/programmes/1-year-advanced"}>View Programme</Button></div>
</article>
</div>
</div>
</section>


<section id={"format"} className={"sec white"}>
<div className={"wrap"}>
<div className={"g2"} style={css("margin-bottom:clamp(32px,3vw,48px)")}>
<div className={"stack"}><p className={"eyebrow"}>Learning format</p><h2 className={"h-sec"}>Learn by <em>doing</em></h2><p className={"body muted"}>TESH programmes are designed around practical and experiential learning. Training may include the formats below.</p></div>
<div style={{borderRadius:'12px',overflow:'hidden',aspectRatio:'16/10'}}><img src={"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80"} alt={"Learners in a practical hospitality training session"} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} /></div>
</div>
<div className={"tiles"}>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 5h16v11H4z"} /><path d={"M8 20h8"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Classroom learning</h3><p className={"small"}>Understanding concepts, principles and professional knowledge.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M14 4l6 6-9 9H5v-6z"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Practical training</h3><p className={"small"}>Hands-on skills through demonstrations and supervised practice.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"8"} cy={"8"} r={"3"} /><circle cx={"16"} cy={"8"} r={"3"} /><path d={"M3 20c0-3 2-5 5-5s5 2 5 5M11 20c0-3 2-5 5-5s5 2 5 5"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Role play &amp; simulation</h3><p className={"small"}>Practising guest service, communication, caregiving and workplace situations.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"10"} r={"3"} /><path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Field &amp; experience-based learning</h3><p className={"small"}>Destinations, hospitality environments, communities and nature-based experiences.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M3 11 12 4l9 7"} /><path d={"M5 10v10h14V10"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>TESH Home practical exposure</h3><p className={"small"}>According to level and programme requirements, where available.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 4h10l6 6v10H4z"} /><path d={"M14 4v6h6"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Project-based learning</h3><p className={"small"}>Tourism, hospitality, caregiving or entrepreneurship-related projects.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M12 3v4M12 17v4M3 12h4M17 12h4"} /><circle cx={"12"} cy={"12"} r={"4"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Leadership practice</h3><p className={"small"}>Progressively taking responsibility for activities, teams and projects.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><circle cx={"12"} cy={"12"} r={"8"} /><path d={"M12 8v4l3 2"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Training schedule</h3><p className={"small"}>4 hours a day, 5 days a week.</p></div></div>
<div><div className={"ico"}><svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.5"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 18h4V10H4zM10 18h4V6h-4zM16 18h4V3h-4z"} /></svg></div><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Training hours</h3><p className={"small"}>240 (3 months) · 480 (6 months) · 960 (1 year).</p></div></div>
</div>
</div>
</section>


<section id={"admissions"} className={"sec band"}>
<div className={"wrap"}>
<div className={"head"}><p className={"eyebrow"}>Eligibility &amp; selection</p><h2 className={"h-sec"}>Who can <em>apply</em>, and how</h2></div>
<ol className={"sel-steps"} aria-label={"Selection criteria"}>
<li><span className={"step-n"}>1</span><h3 className={"h-card"} style={css("font-size:18px")}>Credentials</h3><p className={"small"}>Academic and extracurricular credentials.</p></li>
<li><span className={"step-n"}>2</span><h3 className={"h-card"} style={css("font-size:18px")}>Aptitude test</h3><p className={"small"}>An assessment of aptitude for the programme.</p></li>
<li><span className={"step-n"}>3</span><h3 className={"h-card"} style={css("font-size:18px")}>Interview</h3><p className={"small"}>A conversation with the programme team.</p></li>
<li><span className={"step-n"}>4</span><h3 className={"h-card"} style={css("font-size:18px")}>Group discussion</h3><p className={"small"}>Teamwork and communication in a group setting.</p></li>
</ol>
<div className={"g2"} style={css("align-items:start;margin-top:clamp(40px,4vw,64px)")}>
<div className={"stack"} style={css("gap:0")}>
<div className={"out"}><span className={"out-n"}>i.</span><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Target age group</h3><p className={"body muted"}>18 to 29 years — for visionary young leaders who want to develop practical skills and explore income-generating opportunities.</p></div></div>
<div className={"out"}><span className={"out-n"}>ii.</span><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Eligibility</h3><p className={"body muted"}>The 3-month and 6-month curriculum documents state Plus Two / Higher Secondary or equivalent eligibility.</p></div></div>
<div className={"out"}><span className={"out-n"}>iii.</span><div className={"stack-s"}><h3 className={"h-card"} style={css("font-size:18px")}>Planned commencement</h3><p className={"body muted"}>Programmes begin December 2026.</p></div></div>
<p className={"note"} style={css("margin-top:24px")}><b>Experience certificate.</b> Participants who successfully complete the applicable training requirements receive a TESH Skill Development Experience Certificate, subject to programme completion and assessment requirements.</p>
</div>
<div className={"form"}>
<h3 className={"h-card"}>Admission enquiry</h3>
<div className={"frow"}>
<TextField label={"Full name"} placeholder={"Your name"} autocomplete={"name"} />
<TextField label={"Age"} type={"number"} placeholder={"18–29"} min={"18"} max={"29"} />
</div>
<TextField label={"Email"} type={"email"} placeholder={"you@example.com"} autocomplete={"email"} />
<TextField label={"Phone"} type={"tel"} placeholder={"+91"} autocomplete={"tel"} />
<div style={css("display:flex;flex-direction:column;gap:8px")}>
<label className={"kn-field-label"} htmlFor={"prog"}>Programme</label>
<select id={"prog"} className={"sel"}><option>3-Month Foundation</option><option>6-Month Professional</option><option>1-Year Advanced</option><option>Not sure yet</option></select>
</div>
{!!($v?.sent) && (<>
<p className={"thanks"}>Thank you — our admissions team will be in touch soon.</p>
</>)}
<Button variant={"primary"} onClick={$v?.submit}>Enquire About Admission</Button>
<p className={"small"}>We use your details only to respond to your enquiry.</p>
</div>
</div>
</div>
</section>

<Footer />
</>
    );
  }
}
