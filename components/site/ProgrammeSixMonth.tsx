'use client';
/* Converted from the Chaitanya Keralam design canvas (ProgrammeSixMonth). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';
import { SiteSettingsContext } from '@/components/SiteSettingsProvider';
import { PROGRAMME_6M_DEFAULTS, isTbc, num, type Programme6MContent } from '@/lib/programme-detail-content';

export default class ProgrammeSixMonth extends React.Component<any, any> {
  [key: string]: any;
  static contextType = SiteSettingsContext;

  constructor(props) { super(props); this.state = { menu: false, part: 0 }; }
  nav(cur) {
    var self = this;
    // Menu links come from the CMS "Site settings" global, with Home first as on these pages before.
    var menu = (this.context as React.ContextType<typeof SiteSettingsContext>).menu;
    var L = [['Home', '/']].concat(menu.links.map(function (l) { return [l.label, l.url]; }));
    return {
      navLinks: L.map(function (l) { return { label: l[0], href: l[1], active: l[1] === '/programmes', cls: l[1] === '/programmes' ? 'on' : '' }; }),
      menuOpen: this.state.menu,
      menuLabel: this.state.menu ? 'Close menu' : 'Open menu',
      menuIcon: this.state.menu ? 'M5 5l10 10M15 5 5 15' : 'M3 6h14M3 10h14M3 14h14',
      toggleMenu: function () { self.setState({ menu: !self.state.menu }); },
      closeMenu: function () { self.setState({ menu: false }); }
    };
  }
  renderVals() {
    var self = this;
    var c: Programme6MContent = this.props.content || PROGRAMME_6M_DEFAULTS;
    var data = (c.curriculum.parts || []).map(function (p) { return { label: p.tab, title: p.title, months: p.months }; });
    var i = this.state.part;
    return Object.assign(this.nav('Programmes'), {
      parts: data.map(function (p, k) { return { label: p.label, on: k === i, cls: k === i ? 'on' : '', pick: function () { self.setState({ part: k }); } }; }),
      part: data[i]
    });
  }

  render() {
    const $v: any = this.renderVals();
    const c: Programme6MContent = this.props.content || PROGRAMME_6M_DEFAULTS;
    return (
<>


<div className={"navbar"}>
<a className={"nav-logo"} href={"/"} tabIndex={-1}><img src={"/images/chaitanya-keralam-logo.png"} alt={"Chaitanya Keralam logo"} width={"335"} height={"320"} /></a>
<NavBar brandHref={"/"} links={$v?.navLinks} />
<div className={"nav-cta"}><Button variant={"primary"} size={"sm"} href={(this.context as React.ContextType<typeof SiteSettingsContext>).menu.buttonUrl}>{(this.context as React.ContextType<typeof SiteSettingsContext>).menu.button}</Button></div>
<button className={"menu-btn"} aria-label={$v?.menuLabel} aria-expanded={$v?.menuOpen} onClick={$v?.toggleMenu}><svg width={"20"} height={"20"} viewBox={"0 0 20 20"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.6"} strokeLinecap={"round"} aria-hidden={"true"}><path d={$v?.menuIcon} /></svg></button>
</div>
{!!($v?.menuOpen) && (<>
<nav className={"mnav"} aria-label={"Mobile"}>
{($v?.navLinks || []).map((l: any, $index: number) => (<React.Fragment key={$index}><a href={l?.href} className={l?.cls} onClick={$v?.closeMenu}>{l?.label}</a></React.Fragment>))}
<div className={"cta"}><Button variant={"primary"} href={(this.context as React.ContextType<typeof SiteSettingsContext>).menu.buttonUrl}>{(this.context as React.ContextType<typeof SiteSettingsContext>).menu.button}</Button></div>
</nav>
</>)}


<section className={"c-hero gold"}>
<div className={"wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>{c.hero.crumbHome}</a> / <a href={"/programmes"}>{c.hero.crumbProgrammes}</a> / {c.hero.crumbCurrent}</p>
<span className={"c-badge r1"}><i style={css("background:#c5a15a")}></i>{c.hero.badge}</span>
<h1 className={"h-display h-page r2"}>{c.hero.titleStart}<em>{c.hero.titleEm}</em>{c.hero.titleEnd}</h1>
</div>
<div className={"r3"} style={css("background:#fff;border-radius:24px;padding:8px")}>
{(c.hero.partLinks || []).map((p, $index: number) => (<React.Fragment key={$index}>
<a href={"#curriculum"} style={css("display:grid;grid-template-columns:56px minmax(0,1fr);gap:16px;align-items:center;padding:18px 20px;text-decoration:none;color:#123d32;border-radius:18px" + ($index > 0 ? ";border-top:1px solid #eee7d5" : ""))}><span className={"lvl"} style={css("background:" + ($index % 2 ? "#c5a15a" : "#dde8df") + ";width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-weight:600")}>{p.numeral}</span><span className={"stack-s"} style={css("gap:0")}><b style={css("font-weight:600")}>{p.title}</b><span className={"small"}>{p.months}</span></span></a>
</React.Fragment>))}
</div>
</div>
</section>


<section className={"sec white"}>
<div className={"wrap c-layout"}>
<div className={"stack"} style={css("gap:clamp(56px,6vw,96px)")}>

<div id={"curriculum"}>
<div className={"head"} style={css("margin-bottom:24px")}><p className={"eyebrow"}>{c.curriculum.eyebrow}</p><h2 className={"h-sec"}>{c.curriculum.headingStart}<em>{c.curriculum.headingEm}</em>{c.curriculum.headingEnd}</h2></div>
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
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>{c.outcomes.eyebrow}</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>{c.outcomes.headingStart}<em>{c.outcomes.headingEm}</em>{c.outcomes.headingEnd}</h2><p className={"body muted"}>{c.outcomes.intro}</p></div>
<ul className={"olist"}>
{(c.outcomes.items || []).map((o, $index: number) => (<React.Fragment key={$index}>
<li style={css("background:#f7f3e8")}><b>{num($index)}</b>{o.value}</li>
</React.Fragment>))}
</ul>
</div>

<div id={"project"} className={"founder"} style={css("grid-column:auto")}>
<p className={"eyebrow"}>{c.project.eyebrow}</p>
<h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>{c.project.heading}</h2>
<p className={"body"}>{c.project.intro}</p>
<div className={"incl"}>{(c.project.options || []).map((o, $index: number) => (<React.Fragment key={$index}><span style={css("background:#f7f3e8")}>{o.value}</span></React.Fragment>))}</div>
<p className={"small"} style={css("color:#123d32")}><b>{c.project.exposureLabel}</b> {c.project.exposureText} <b>{c.project.teshLabel}</b> {c.project.teshText}</p>
</div>
</div>

<aside className={"summary"} id={"enquire"} aria-label={"Programme summary"}>
<p className={"eyebrow"}>{c.summary.eyebrow}</p>
<dl>
{(c.summary.rows || []).map((r, $index: number) => (<React.Fragment key={$index}>
<div><dt>{r.label}</dt><dd>{isTbc(r.value) ? <span className={"tbc"}>{r.value}</span> : r.value}</dd></div>
</React.Fragment>))}
</dl>
<Button variant={"primary"} href={"/programmes#admissions"}>{c.summary.enquireButton}</Button>
<Button variant={"quiet"} href={"/programmes#compare"}>{c.summary.compareButton}</Button>
</aside>
</div>
</section>

<nav className={"pager"} aria-label={"Programme navigation"}>
<a href={"/programmes/3-month-foundation"}><span className={"small"}>{c.pager.prevLabel}</span><b>{c.pager.prevTitle}</b></a>
<a href={"/programmes/1-year-advanced"}><span className={"small"}>{c.pager.nextLabel}</span><b>{c.pager.nextTitle}</b></a>
</nav>

<Footer />
</>
    );
  }
}
