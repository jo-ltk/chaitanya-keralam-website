'use client';
/* Converted from the Chaitanya Keralam design canvas (ProgrammeThreeMonth). */
import React from 'react';
import { Button, NavBar } from '@/components/kneds';
import Footer from '@/components/site/Footer';
import { css, str } from '@/lib/dc';
import { SiteSettingsContext } from '@/components/SiteSettingsProvider';
import { PROGRAMME_3M_DEFAULTS, isTbc, num, type Programme3MContent } from '@/lib/programme-detail-content';

export default class ProgrammeThreeMonth extends React.Component<any, any> {
  [key: string]: any;
  static contextType = SiteSettingsContext;

  constructor(props) { super(props); this.state = { menu: false }; }
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
  renderVals() { return this.nav('Programmes'); }

  render() {
    const $v: any = this.renderVals();
    const c: Programme3MContent = this.props.content || PROGRAMME_3M_DEFAULTS;
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


<section className={"c-hero green"}>
<div className={"wrap"}>
<div className={"stack"} style={css("gap:22px")}>
<p className={"crumbs r1"}><a href={"/"}>{c.hero.crumbHome}</a> / <a href={"/programmes"}>{c.hero.crumbProgrammes}</a> / {c.hero.crumbCurrent}</p>
<span className={"c-badge r1"}><i></i>{c.hero.badge}</span>
<h1 className={"h-display h-page r2"}>{c.hero.titleStart}<em>{c.hero.titleEm}</em>{c.hero.titleEnd}</h1>
<p className={"lede r3"}>{c.hero.lead}</p>
</div>
<div className={"ph ph-w p2 rounded r3"} style={css("aspect-ratio:4/3")}>{c.hero.imagePlaceholder}</div>
</div>
</section>


<section className={"sec white"}>
<div className={"wrap c-layout"}>
<div className={"stack"} style={css("gap:clamp(56px,6vw,96px)")}>

<div id={"curriculum"}>
<div className={"head"}><p className={"eyebrow"}>{c.curriculum.eyebrow}</p><h2 className={"h-sec"}>{c.curriculum.headingStart}<em>{c.curriculum.headingEm}</em>{c.curriculum.headingEnd}</h2></div>
<ol className={"tl"}>
{(c.curriculum.months || []).map((m, $index: number) => (<React.Fragment key={$index}>
<li><span className={"node"}>{m.node}</span><div className={"card"}><p className={"eyebrow plain"} style={css("color:#80664b")}>{m.label}</p><h3 className={"h-card"}>{m.title}</h3>
<ul className={"ticks"}>
{(m.topics || []).map((t, $i: number) => (<React.Fragment key={$i}>
<li><svg width={"18"} height={"18"} viewBox={"0 0 20 20"} fill={"none"} stroke={"#2f6b50"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}><path d={"M4 10.5 8 14l8-8"} /></svg><span>{t.value}</span></li>
</React.Fragment>))}
</ul>
{!!m.practical && (<p className={"pw"}><b>{c.curriculum.practicalLabel}</b> {m.practical}</p>)}</div></li>
</React.Fragment>))}
</ol>
</div>

<div id={"outcomes"} style={css("background:#eee7d5;border-radius:24px;padding:clamp(24px,3.4vw,56px)")}>
<div className={"head"} style={css("margin-bottom:28px")}><p className={"eyebrow"}>{c.outcomes.eyebrow}</p><h2 className={"h-sec"} style={css("font-size:clamp(24px,2.2vw,36px)")}>{c.outcomes.headingStart}<em>{c.outcomes.headingEm}</em>{c.outcomes.headingEnd}</h2><p className={"body muted"}>{c.outcomes.intro}</p></div>
<ul className={"olist"}>
{(c.outcomes.items || []).map((o, $index: number) => (<React.Fragment key={$index}>
<li><b>{num($index)}</b>{o.value}</li>
</React.Fragment>))}
</ul>
<p className={"note"} style={css("margin-top:20px;background:#fff")}><b>{c.outcomes.noteTitle}</b> {c.outcomes.noteText}</p>
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
<a href={"/programmes"}><span className={"small"}>{c.pager.prevLabel}</span><b>{c.pager.prevTitle}</b></a>
<a href={"/programmes/6-month-professional"}><span className={"small"}>{c.pager.nextLabel}</span><b>{c.pager.nextTitle}</b></a>
</nav>

<Footer />
</>
    );
  }
}
