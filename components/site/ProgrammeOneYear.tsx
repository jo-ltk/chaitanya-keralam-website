'use client';
/* Converted from the Chaitanya Keralam design canvas (ProgrammeOneYear). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';
import { SiteSettingsContext } from '@/components/SiteSettingsProvider';
import { PROGRAMME_1Y_DEFAULTS, isTbc, num, type Programme1YContent } from '@/lib/programme-detail-content';

export default class ProgrammeOneYear extends React.Component<any, any> {
  [key: string]: any;
  static contextType = SiteSettingsContext;

  constructor(props) { super(props); this.state = { menu: false, open: 0 }; }
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
    var c: Programme1YContent = this.props.content || PROGRAMME_1Y_DEFAULTS;
    var data = c.structure.parts || [];
    var i = this.state.open;
    return Object.assign(this.nav('Programmes'), {
      parts: data.map(function (r, k) {
        var open = k === i;
        return { k: r.letter, title: r.title, text: r.text, topics: (r.topics || []).map(function (t) { return t.value; }), open: open, hidden: !open, cls: open ? 'acc-item open' : 'acc-item', pick: function () { self.setState({ open: open ? -1 : k }); } };
      })
    });
  }

  render() {
    const $v: any = this.renderVals();
    const c: Programme1YContent = this.props.content || PROGRAMME_1Y_DEFAULTS;
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


<section className={"c-hero dark"}>
<div className={"wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>{c.hero.crumbHome}</a> / <a href={"/programmes"}>{c.hero.crumbProgrammes}</a> / {c.hero.crumbCurrent}</p>
<span className={"c-badge r1"}><i style={css("background:#c5a15a")}></i>{c.hero.badge}</span>
<h1 className={"h-display h-page r2"}>{c.hero.titleStart}<em>{c.hero.titleEm}</em>{c.hero.titleEnd}</h1>
</div>
<ol className={"mlist r3"} aria-label={"Programme parts"}>
{(c.hero.partsList || []).map((p, $index: number) => (<React.Fragment key={$index}>
<li>{p.value}</li>
</React.Fragment>))}
</ol>
</div>
</section>


<section className={"sec white"}>
<div className={"wrap c-layout"}>
<div className={"stack"} style={css("gap:clamp(56px,6vw,96px)")}>

<div id={"structure"}>
<div className={"head"} style={css("margin-bottom:24px")}><p className={"eyebrow"}>{c.structure.eyebrow}</p><h2 className={"h-sec"}>{c.structure.headingStart}<em>{c.structure.headingEm}</em>{c.structure.headingEnd}</h2></div>
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
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>{c.capstone.eyebrow}</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px);color:#f7f3e8")}>{c.capstone.headingStart}<em>{c.capstone.headingEm}</em>{c.capstone.headingEnd}</h2><p className={"body"}>{c.capstone.intro}</p></div>
<div className={"heritage"} style={css("grid-template-columns:repeat(auto-fit,minmax(200px,1fr))")}>
{(c.capstone.projects || []).map((p, $index: number) => (<React.Fragment key={$index}>
<div><span className={"small"} style={css("opacity:.7")}>{num($index)}</span><span style={css("font-weight:600")}>{p.value}</span></div>
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
<a href={"/programmes/6-month-professional"}><span className={"small"}>{c.pager.prevLabel}</span><b>{c.pager.prevTitle}</b></a>
<a href={"/tesh-homes"}><span className={"small"}>{c.pager.nextLabel}</span><b>{c.pager.nextTitle}</b></a>
</nav>

<Footer />
</>
    );
  }
}
