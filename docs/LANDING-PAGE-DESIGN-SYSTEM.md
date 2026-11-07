# LANDING-PAGE-DESIGN-SYSTEM.md
## Chaitanya Keralam: the landing page design language, written as an instruction manual for AI coding agents

> **Who this file is for:** an AI coding agent (or a developer) who has been asked to redesign **any page** of the Chaitanya Keralam website so that it looks and behaves like the landing page.
>
> **How to use it:** read the whole file once. Then follow **Part 11 (The page redesign procedure)** step by step for every page, and tick every box in **Part 16 (Execution checklist)** before you call the page finished. Whenever a step says "use X", go to the part of this file that defines X and copy it exactly.
>
> **The single most important rule:** you are changing how a page **looks**. You are **not** changing what it **does**. Never remove content, features, routes, forms, API calls, state, validation, analytics, SEO tags or business logic to make a design work. If the design and the functionality conflict, the functionality wins and you adapt the design.

---

## Table of contents

- [Part 0. Words used in this file](#part-0-words-used-in-this-file)
- [Part 1. Non-negotiable rules](#part-1-non-negotiable-rules)
- [Part 2. Source of truth, stack and files](#part-2-source-of-truth-stack-and-files)
- [Part 3. The design language explained in plain words](#part-3-the-design-language-explained-in-plain-words)
- [Part 4. Design tokens (exact values)](#part-4-design-tokens-exact-values)
- [Part 5. Layout system](#part-5-layout-system)
- [Part 6. Component library](#part-6-component-library)
- [Part 7. Animation and interaction catalogue](#part-7-animation-and-interaction-catalogue)
- [Part 8. Performance and accessibility rules](#part-8-performance-and-accessibility-rules)
- [Part 9. Responsive rules](#part-9-responsive-rules)
- [Part 10. Implementing in React / Next.js](#part-10-implementing-in-react--nextjs)
- [Part 11. The page redesign procedure (follow exactly)](#part-11-the-page-redesign-procedure-follow-exactly)
- [Part 12. Page-type layout recipes](#part-12-page-type-layout-recipes)
- [Part 13. Worked before → after examples](#part-13-worked-before--after-examples)
- [Part 14. Copy and content rules](#part-14-copy-and-content-rules)
- [Part 15. Consistency rules (do / do not)](#part-15-consistency-rules-do--do-not)
- [Part 16. Execution checklist](#part-16-execution-checklist)
- [Part 17. Known problems and their fixes](#part-17-known-problems-and-their-fixes)
- [Appendix A. Copy-paste token block](#appendix-a-copy-paste-token-block)
- [Appendix B. Class name index](#appendix-b-class-name-index)

---

## Part 0. Words used in this file

| Word | Meaning in this file |
|---|---|
| **Landing page** | The home page of the site. It is the visual reference for everything. Its reference build lives in `chaitanya-keralam/` (`index.html`, `css/style.css`, `js/main.js`). In the Next.js app it is the home route (`/`). |
| **Inner page** | Any other page: About, Destinations, a destination detail page, Experiences, Stories/Blog, an article, Contact, Booking, FAQ, Privacy, 404, and so on. |
| **Paper section** | A section with the light background `--paper` (#fbfaf7) and dark text `--ink`. Most content sections are paper sections. |
| **Dark section** | A section with class `dark`: background `--night` (#070d0b), white text. Used for the hero, statements, chapters, footer. |
| **Media slot** | The standard image/video container: `<div class="ph …"><div class="bg …">IMAGE HERE</div><span class="slot">label</span></div>`. Every image on the site goes inside one. See [6.3](#63-media-slot-ph). |
| **Token** | A named design value, written as a CSS custom property, for example `--ink`. Never type the raw value when a token exists. |
| **Gutter** | The empty space between the screen edge and the content: `--gutter-x`. |
| **Section rhythm** | The vertical space above and below a section: `--section-y`. |
| **Reveal** | An animation that plays once when an element scrolls into view. |
| **Scrub** | An animation tied to scroll position: it moves forwards when you scroll down and backwards when you scroll up. |
| **Desktop motion** | Extra effects (parallax, smooth scroll, drifting words, image reveals) that run only when the screen is at least 900px wide **and** the device has a mouse or trackpad (`(min-width: 900px) and (pointer: fine)`). |

---

## Part 1. Non-negotiable rules

Read these ten rules before every task. If any instruction later in this file seems to conflict with them, these rules win.

1. **Preserve functionality.** Keep every route, link target, form field `name`, form submit handler, API call, data fetch, state hook, prop, event handler, validation rule, analytics call, SEO `<head>` tag, structured data block and accessibility attribute that the page already has. Restyle and rearrange them; never delete them.
2. **Preserve content.** Keep every piece of text, image, list item and data field the page shows. You may reorder sections, change a heading level for hierarchy, or move content into a different component (for example a list into a card grid). You may not delete content unless the user explicitly asked.
3. **Use the tokens.** Every colour, font, size, spacing value, shadow and easing must come from [Part 4](#part-4-design-tokens-exact-values). Do not invent a new colour, font, radius or shadow. If you think you need one, you are using the wrong component.
4. **Reuse components.** Build pages out of the components in [Part 6](#part-6-component-library). Do not create a new visual style for something that already has a component (a new kind of card, a new button, a new heading style).
5. **Adapt, don't copy.** Do not paste the landing page's section order onto another page. Pick the layout recipe that fits the page's purpose ([Part 12](#part-12-page-type-layout-recipes)).
6. **Square corners.** Images, cards, buttons, inputs and panels have `border-radius: 0`. Only round icon controls (the 46px pause/play disc) use `border-radius: 999px`.
7. **Image-first, few words.** Big images, short headings, short paragraphs. No paragraph longer than about 60 words in a single block on the page (articles and legal pages are the exception and use the prose style in [6.17](#617-prose--long-text)).
8. **One font family.** Albert Sans, weights 300, 400 and 500 only. No serif, no italics for display, no other weights.
9. **Mobile is calm.** Under 900px, there is no smooth-scroll takeover, no parallax and no pinning. Only gentle fade-ups. Nothing may cause horizontal scrolling at 320px.
10. **Everything must work without animation.** All content is visible if JavaScript fails or if the user has "reduce motion" switched on.

---

## Part 2. Source of truth, stack and files

### 2.1 Where the design comes from

The landing page was built as a framework-free reference and then implemented in the project's Next.js app (deployed on Vercel). The reference build is the **source of truth for values** in this file:

```
chaitanya-keralam/
├── index.html        Landing page markup (all sections)
├── css/style.css     All styles and tokens. Tokens are in the :root block at the top.
├── js/main.js        Hero carousel, menu, form, scroll animations: window.CKLanding.init() / destroy()
├── assets/logo.png   Emblem
├── assets/images/    Photographs
├── assets/video/     Hero video + poster
└── vendor/           Local copies of GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.1.13
```

**Step 0 for every task (do this before anything else):**

1. Open the project's landing page code in the repository (the home route, usually `app/page.tsx` or `pages/index.tsx`, plus the global stylesheet it imports, usually `app/globals.css` or `styles/globals.css`).
2. Find the `:root` block with the tokens (`--paper`, `--ink`, `--night`, …). Compare it with [Appendix A](#appendix-a-copy-paste-token-block).
3. **If the repository's values differ from this file, the repository's landing page wins.** Use the repository values, and note the difference in your final report.
4. Find out how the landing page loads GSAP, ScrollTrigger and Lenis (CDN `<Script>` tags or npm packages) and whether there is already a shared Nav/Footer component. Reuse whatever exists; see [Part 10](#part-10-implementing-in-react--nextjs).

### 2.2 Technologies used

| What | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (React) on Vercel | project's version | The landing page markup is rendered as JSX; styles are global CSS. |
| Styling | Plain global CSS with CSS custom properties | n/a | **Not** Tailwind classes, **not** CSS Modules for these classes. Class names are global and must stay exactly as written. |
| Font | Albert Sans (Google Fonts) | weights 300, 400, 500 | Stand-in for Calibre (the font on the WAC reference site). Fallback stack: `"Calibre", "Helvetica Neue", Arial, sans-serif`. |
| Animation engine | GSAP | 3.12.5 | Tweens, timelines, `gsap.context()`, `gsap.matchMedia()`. |
| Scroll animation | GSAP ScrollTrigger | 3.12.5 | Reveals and scrubbed effects. |
| Smooth scroll | Lenis | 1.1.13 | Desktop with fine pointer only. |
| Carousel, menu, form | Hand-written JS in `main.js` | n/a | No carousel library. |
| Icons | Inline SVG paths (Material Icons, Apache 2.0) + the `→` and `↓` characters | n/a | No icon font. |

### 2.3 Design references the client approved

- **WAC (webandcrafts.com)**: editorial white sections, square buttons, case-study image grid, "What we do" list, the contact form with tabs. This is why buttons and inputs are square and why paper sections dominate.
- **Kerala Tourism**: the cinematic full-screen hero with chapter controls.
- **Brand lines (must stay prominent on the site):** "Perhaps the only paradise on earth!" · "One with nature." · "God's own country." The core theme is **Eco-Spiritual Peace Tourism** and the four values **Anbu** (Love and compassion), **Unmai** (Truth and integrity), **Patru** (Commitment and devotion), **Pagutharivu** (Rational thinking and discernment).

---

## Part 3. The design language explained in plain words

A basic model cannot "feel" a style, so here is what the style **is**, as concrete rules.

### 3.1 The rhythm of a page

The landing page alternates between three kinds of bands. Every inner page uses the same three kinds:

| Band | What it looks like | Classes | Used for |
|---|---|---|---|
| **Cinematic dark band** | Full-width photo or very dark background (#070d0b or a chapter tint), white text, large light-weight words | `section.dark`, `.hero`, `.chapter`, `.banner`, `.statement` | Page openers, emotional statements, chapter breaks, final call to action, footer |
| **Paper band** | Near-white background #fbfaf7, near-black text #111613, images in ordered grids | `section.section` (no `dark`) | All information: grids, lists, text + image, forms |
| **Hairline list band** | Paper band whose content is separated by 1px lines (`--line` #dedad1), no boxes | `.rows`, `.stories` on mobile, `.facts`, `.tabs` | Lists of values, steps, FAQ, itinerary, meta data |

**Rhythm rule:** never put more than **three paper sections in a row** without a dark band between them, and never put **two dark bands directly next to each other** except hero → statement (the landing page does this once). Always end the page with the dark footer, and usually with a dark banner CTA or a paper contact form just before the footer.

### 3.2 What "image-first" means

- Every section except forms, legal text and FAQ contains at least one image slot.
- Images are big: full-bleed (edge to edge) in dark bands, and full column width in paper bands.
- Images use fixed aspect ratios from the ratio classes (`r-1x1`, `r-4x5`, `r-3x2`, `r-16x9`, `r-21x9`). Never let an image set its own height.
- Images have **no** rounded corners, **no** border and **no** card box around them. The only shadow on images is on overlapping images (see [4.7](#47-shadows)).

### 3.3 What "few words" means

| Text type | Maximum length |
|---|---|
| Hero title | 1 line (3 to 8 words), always fitted to one line |
| Chapter word | 1 or 2 words ("Paradise", "Nature", "God's own") |
| Section heading (`.h-section`) | 2 to 6 words |
| Kicker / label | 1 to 6 words |
| Lead paragraph (`.lead`) | 1 to 3 sentences, max about 45 words |
| Card title (`.card h3`) | 1 sentence, max about 14 words |
| Button label | 1 to 5 words, verb first ("Plan a visit", "Send enquiry") |

If an existing page has more text than this, **do not delete it**. Split it: put the short version in the visual section and move the long version into a prose block ([6.17](#617-prose--long-text)), an accordion-style rows list ([6.10](#610-rows-list-values--steps--faq)) or a two-column story block ([6.9](#69-story-split-text--images--facts)).

### 3.4 What "light, large type" means

- Display text (hero title, chapter words, banner title, statement) is **weight 300** and very large (64px to 260px).
- Section headings and the contact heading are **weight 400**.
- Body text is weight 400; leads and card titles are weight 300.
- Large text always has **negative letter-spacing** (-0.015em to -0.06em). Small uppercase kickers have **positive letter-spacing** (0.16em).
- Headings use `text-wrap: balance`; paragraphs, card titles and list titles use `text-wrap: pretty`.

### 3.5 What "colour" means here

- The UI is almost monochrome: paper, ink, night, white.
- Colour comes from **photographs**, not from UI elements.
- The brand hues (forest, teal, ocean, laterite) are used only as **image placeholder gradients**, **dark chapter background tints** and the **active-tab underline / button hover** (forest). Never as text colour on paper, never as large flat UI panels, never as gradients on buttons.
- There is **no yellow, no gold, no bright accent** anywhere. The client explicitly rejected them.

---

## Part 4. Design tokens (exact values)

All tokens live in `:root` in the global stylesheet. Copy them from [Appendix A](#appendix-a-copy-paste-token-block). Use them through `var(--name)`.

### 4.1 Colour tokens

| Token | HEX | RGB / RGBA | Where it is used | Contrast notes |
|---|---|---|---|---|
| `--paper` | `#fbfaf7` | rgb(251, 250, 247) | Page background, paper sections, solid nav, mobile menu, text on ink buttons | Ink on paper: **17.53:1** |
| `--paper-2` | `#f2efe8` | rgb(242, 239, 232) | Empty image wells (`.ph` background), form success/notice panel | Ink on paper-2: 15.93:1 |
| `--ink` | `#111613` | rgb(17, 22, 19) | All headings and body text on paper; `.btn-ink` background; input text | |
| `--ink-muted` | `#5a625d` | rgb(90, 98, 93) | Labels, card titles (resting), leads, meta text, inactive tabs, counters | On paper **6.02:1** (passes AA for all sizes) |
| `--line` | `#dedad1` | rgb(222, 218, 209) | 1px hairlines: list separators, tab rail, card/guide border, solid-nav bottom line | Decorative only (1.34:1). **Never** the only border of an input. |
| `--line-strong` | `#8a8478` | rgb(138, 132, 120) | Input, select and textarea borders | 3.56:1 (passes 3:1 for UI borders) |
| `--night` | `#070d0b` | rgb(7, 13, 11) | Dark sections, hero background, footer | White on night: 19.6:1 |
| `--forest` | `#0b3d24` | rgb(11, 61, 36) | `.btn-ink` hover background; placeholder gradients | White on forest: 12.3:1 |
| `--teal` | `#0e4f4f` | rgb(14, 79, 79) | Next-card thumbnail background; placeholder gradients | White on teal: 9.33:1 |
| `--ocean` | `#0b3a4f` | rgb(11, 58, 79) | Placeholder gradients only | |
| `--laterite` | `#6e2a16` | rgb(110, 42, 22) | Placeholder gradients only | |
| `--on` | `#ffffff` | rgb(255, 255, 255) | Text and icons on dark sections and over photos; `.btn-white` background; transparent-nav CTA background | |
| `--on-muted` | `rgba(255,255,255,0.78)` | | Secondary text on dark: kickers, chapter copy, footer promise, next-card title | On night ≈ 11.9:1 |
| `--on-line` | `rgba(255,255,255,0.4)` | | Hairlines and control rings on dark: hero progress track, pause-button ring | |
| `--on-faint` | `rgba(255,255,255,0.1)` | | Footer watermark word, footer legal divider | Decorative only |
| `--accent` | `#0b3d24` | rgb(11, 61, 36) | Focus ring on paper, active tab underline | On paper 11.78:1 |
| `--error` | `#a3261b` | rgb(163, 38, 27) | Form error text and invalid input border | On paper 7.06:1 |

**Fixed literal colours (not tokens, but part of the system; reuse them exactly where stated):**

| Value | Where |
|---|---|
| `#ffffff` | Background of inputs/selects/textareas and of the `.guide` card |
| `#8b918d` | Input placeholder text |
| `#071615` | Background of `.chapter.ch-1` (deep teal-black) |
| `#06130c` | Background of `.chapter.ch-2` (deep green-black) |
| `#120806` | Background of `.chapter.ch-3` (deep laterite-black) |
| `rgba(7,13,11,0.55)` + `backdrop-filter: blur(8px)` | Hero "Next" card background |
| `rgba(255,255,255,0.82)` | Placeholder label text inside `.ph .slot` |
| `rgba(255,255,255,0.86)` | `.btn-white` hover background |
| `rgba(5,10,8,…)` | All dark overlays and scrims (see 4.8) |

**Rule for new dark chapters on inner pages:** pick one of the three chapter backgrounds above (`ch-1`, `ch-2`, `ch-3`) or `--night`. Do not create a fourth tint.

### 4.2 Typography tokens

**Font family token:** `--font: "Albert Sans", "Calibre", "Helvetica Neue", Arial, sans-serif;`

**Loading:** Google Fonts, `family=Albert+Sans:wght@300;400;500&display=swap`, with `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`. In Next.js you may use `next/font/google` (`Albert_Sans`, weights `['300','400','500']`, `display: 'swap'`) and then set `--font` to the generated family name followed by the same fallbacks.

**Base text:** `body { font: 400 16px/1.6 var(--font); -webkit-font-smoothing: antialiased; }`

**Complete type scale (desktop value → how it scales → mobile overrides):**

| Role | Class / selector | Weight | Size | Line height | Letter spacing | Colour | Mobile (≤760px) | Small phones |
|---|---|---|---|---|---|---|---|---|
| Hero title | `.hero-title` | 300 | Fitted by JS to the width (`--hero-fs`), max 132px at ≥1025px, max 88px below; CSS fallback `min(5vw, 84px)` | 1.05 | -0.03em | `--on` | fitted (about 22px at 390px) | min 18px |
| Inner page title (dark) | `.page-title` (see 6.4) | 300 | `clamp(44px, 6.6vw, 124px)` | 1.02 | -0.025em | `--on` | `clamp(38px, 11vw, 56px)` | 36px (≤375), 32px (≤340) |
| Chapter word | `.chapter-word` | 300 | `clamp(72px, 14vw, 260px)`; ≥1025px: `clamp(110px, 11.5vw, 230px)`; ≤1024px: `clamp(72px, 15vw, 180px)` | 0.9 | -0.045em | `--on` | `clamp(56px, 17vw, 96px)`, -0.04em | 52px (≤375), 46px (≤340) |
| Banner title | `.banner h2` | 300 | `clamp(48px, 8.5vw, 168px)` | 0.95 | -0.035em | `--on` | `clamp(40px, 12vw, 64px)` | |
| Statement | `.statement p` | 300 | `clamp(28px, 3.8vw, 64px)` | 1.18 | -0.015em | `--on` | `clamp(24px, 6.6vw, 32px)`, line-height 1.28 | 22px (≤340) |
| Contact / paper page title | `.contact-intro h2`, `.paper-title` | 400 | `clamp(44px, 5.2vw, 92px)` | 1.06 | -0.015em | `--ink` | `clamp(32px, 9vw, 44px)`, line-height 1.1 | 30px (≤340) |
| Section heading | `.h-section` | 400 | `clamp(36px, 4.6vw, 80px)` | 1.05 | -0.015em | inherit | `clamp(32px, 8.6vw, 44px)`, line-height 1.1 | 30px (≤340) |
| Values/list row title | `.row-t` | 300 | `clamp(26px, 3vw, 52px)` | 1.1 | -0.015em | inherit | 22px, line-height 1.3 | 20px (≤340) |
| Big number | `.fact b` | 300 | `clamp(40px, 4vw, 64px)` | 1 | -0.02em | inherit | 36px | |
| Card title | `.card h3` | 300 | `clamp(22px, 1.75vw, 30px)` | 1.32 | normal | `--ink-muted` → `--ink` on hover | 20px, line-height 1.4 | |
| Story/list item title | `.story-item h3` | 400 | `clamp(19px, 1.4vw, 24px)` | 1.35 | normal | inherit | 17px (≤900), 16px (≤760) | |
| Footer promise | `.foot-promise` | 300 | 22px | 1.35 | normal | `--on-muted` | 19px | |
| Menu links (mobile) | `.menu li a` | 400 | `clamp(28px, 8vw, 44px)` | 1.15 | normal | `--ink` | | |
| Lead paragraph | `.lead` | 300 | `clamp(18px, 1.3vw, 22px)` | 1.55 | normal | `--ink-muted` (dark: `--on-muted`) | 17px, line-height 1.6 | |
| Chapter copy | `.chapter-copy p` | 400 | `clamp(17px, 1.25vw, 21px)` | 1.5 | normal | `--on-muted` | 16px, line-height 1.6 | |
| Contact intro text | `.contact-intro p` | 400 | 18px | 1.65 | normal | `--ink` | 16px | |
| Body | `body` | 400 | 16px | 1.6 | normal | `--ink` | 16px | |
| Nav link | `.nav-links a` | 400 | 16px | 20px | normal | inherit | hidden ≤1080px | |
| Text link | `.tlink` | 400 | 16px | 22px | normal | inherit | | |
| Label | `.label` | 400 | 15px | 22px | normal | `--ink-muted` (dark: `--on-muted`) | 14px / 20px | |
| Button | `.btn` | 500 | 15px | 1 | 0.01em | per variant | | |
| Form label | `.field label` | 400 | 16px | 1.3 | normal | `--ink` | 15px | |
| Input text | `.field input` | 400 | 16px | 1.4 | normal | `--ink` | 16px (never below 16px: iOS zooms) | |
| Tab | `.tab` | 400 | `clamp(17px, 1.4vw, 22px)` | 1.2 | normal | `--ink-muted`; selected `--ink` | 16px | |
| Kicker (uppercase) | `.kicker`, `.foot h4` | 500 | 12px | 16px | 0.16em | inherit (usually `--on-muted`) | | |
| Small meta | `.fact span`, `.count`, `.consent`, `.story-item .label` | 400 | 14px | 1.4 | normal | `--ink-muted` | 13 to 15px | |
| Legal | `.legal` | 400 | 13px | inherit | normal | `--on-muted` | | |
| Placeholder slot label | `.ph .slot` | 500 | 11px | 17px | 0.16em, uppercase | `rgba(255,255,255,.82)` | 10px / 15px, 0.12em | |

**Heading level rule:** each page has exactly **one `<h1>`** (the hero title or the page title). Section headings are `<h2>`. Card and list titles are `<h3>`. Choose the element for meaning and the class for looks: `<h2 class="h-section">`, `<h3 class="row-t">` and so on.

### 4.3 Spacing scale

The landing page does not use a numbered spacing scale; it uses a small set of repeated values. **Only use these values.**

| Value | Typical use |
|---|---|
| 4px | Gap between menu list items |
| 6px | Gap between hero progress segments; card label → title on mobile |
| 8px | Small inline gaps (guide meta), mobile nav gap |
| 10px | Gap between label and input in `.field`; card label → title gap; footer link list gap |
| 12px | Gap inside `.btn` and `.tlink` between text and arrow; brand logo → name |
| 14px | Next card inner gap; mobile list row gaps |
| 16px | Gap between grouped controls; mobile story list gap; story-media image gap |
| 18px | Gap inside story items |
| 20px | Chapter copy gap; chapter kicker margin; mobile gutter |
| 22px | Card label top margin (desktop) |
| 24px | Small paddings; default desktop column gap minimum |
| 28px | Story text gap; form row/column gap; statement kicker margin |
| 32px | Hero grid gap; nav item gap; banner inner gap |
| 36px | Tabs → form margin |
| 40px | Footer grid gap; menu gap; "view all" top margin |
| 48px | Large column gaps |
| 56px | Contact grid gap on tablet |
| 64px | Mobile section rhythm |
| 72px | Mobile statement / chapter padding |
| 80px | Banner inner padding |
| 96px | Large desktop margins |

**Fluid values (use exactly as written):**

| Token / expression | Value | Use |
|---|---|---|
| `--gutter-x` | `clamp(20px, 4.5vw, 96px)`; ≤760px: `20px`; ≤375px: `16px` | Left/right page padding inside `.wrap` |
| `--section-y` | `clamp(64px, 8vw, 140px)`; ≤1024px: `clamp(64px, 9vw, 104px)`; ≤760px: `64px` | Top/bottom padding of `.section` |
| Statement padding | `clamp(80px, 12vw, 200px)` top and bottom (≤760px: 72px) | `.statement` |
| Chapter padding | `clamp(72px, 9vw, 160px)`; ≥1025px: `clamp(96px, 9vw, 160px)`; ≤760px: `56px 72px` | `.chapter` |
| Heading row bottom margin | `clamp(36px, 4vw, 64px)` (≤760px: 28px) | `.head-row` |
| Card grid gap | `clamp(40px, 4vw, 72px)` rows, `clamp(20px, 2.6vw, 48px)` columns | `.cards` |
| Two-column gap | `clamp(32px, 5vw, 96px)` | `.story-grid` |
| Contact columns gap | `clamp(40px, 6vw, 120px)` | `.contact-grid` |

### 4.4 Container and layout constraints

```css
.wrap {
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
  padding-left:  max(var(--gutter-x), env(safe-area-inset-left, 0px));
  padding-right: max(var(--gutter-x), env(safe-area-inset-right, 0px));
}
.section { padding-block: var(--section-y); }
```

- **Every** piece of content sits inside a `.wrap`. Backgrounds (dark bands, full-bleed images) sit **outside** the `.wrap`, on the `<section>`.
- `.wrap` must keep `width: 100%`. Without it, a `.wrap` inside a grid or flex parent shrinks and pushes content off-centre (this bug happened; see Part 17).
- Maximum readable widths: `.lead` 46ch, `.chapter-copy` 30ch (36ch at ≥1025px, 40ch at 761–900px), `.contact-intro p` 34ch, `.statement p` 20em, `.consent` 46ch, prose 68ch.

### 4.5 Breakpoints

Use **max-width** media queries with these exact pixel values. Do not add new breakpoints.

| Breakpoint | What changes |
|---|---|
| `min-width: 1025px` | Image-led chapter layout (two columns, image bleeds to edge) |
| `max-width: 1080px` | Nav links hide; hamburger menu button shows |
| `max-width: 1024px` | Tablet: section rhythm reduces; chapter word and media shrink |
| `max-width: 960px` | Contact grid becomes one column |
| `max-width: 900px` | Hero side controls hide, mobile progress shows; cards go to 2 columns; story grid and stories list stack; footer goes to 2 columns. **Desktop motion is off below 900px.** |
| `min-width: 761px and max-width: 900px` | Tablet portrait: chapters stack (image, word, copy) |
| `max-width: 760px` | Mobile layout: 20px gutter, 64px rhythm, mobile type scale, chapters stacked, facts as rows, rows list with images |
| `max-width: 600px` | Cards one column (show first 4 + "view all" button); form one column; nav CTA hides |
| `max-width: 480px` | Facts font size 36px |
| `max-width: 430px` | Buttons 50px tall and full width in story text, view-all and form footer |
| `max-width: 375px` | 16px gutter; smaller brand, chapter word, story thumbnails; footer one column |
| `max-width: 340px` | 320px phones: smallest type sizes |

### 4.6 Border radius

| Element | Radius |
|---|---|
| Images, media slots, cards, buttons (`.btn`), nav CTA, inputs, selects, textareas, tabs, guide card, next card, panels | **0** |
| Round icon controls only (`.hero-ctrl`: pause/play) | **999px** (circle) |

There are no other radii. If an existing page uses rounded cards or pill buttons, make them square.

### 4.7 Shadows

| Shadow | Value | Where |
|---|---|---|
| Solid nav bottom line | `box-shadow: 0 1px 0 var(--line)` | `.nav.solid` |
| Floating chapter image (tablet overlap layout only, 901–1024px) | `0 24px 50px -18px rgba(0,0,0,0.55)` | `.chapter-media` when it overlaps the word |
| Focus outline (not a shadow but same role) | `outline: 2px solid var(--accent); outline-offset: 3px` (white on dark) | `:focus-visible` |
| Input focus | `box-shadow: 0 0 0 1px var(--ink)` + `border-color: var(--ink)` | `.field input:focus` |

**No other shadows.** Cards, buttons and images in grids have no shadow.

### 4.8 Gradients, overlays and backgrounds

**Overlays (scrims) that make text readable on photos. Copy exactly:**

```css
/* Hero (and inner page hero): darkens the top for the nav and the bottom for the title */
.hero::after {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    linear-gradient(180deg, rgba(5,10,8,0.5) 0%, rgba(5,10,8,0) 24%),
    linear-gradient(0deg, rgba(5,10,8,0.78) 0%, rgba(5,10,8,0.15) 55%, rgba(5,10,8,0) 75%);
}
/* Banner CTA: even dim over the whole photo */
.banner::after { content: ""; position: absolute; inset: 0; background: rgba(5,10,8,0.42); pointer-events: none; }
/* Large chapter image (≥1025px): shade on the edge where the giant word overlaps */
.chapter-media::after { background: linear-gradient(90deg, rgba(5,10,8,0.45) 0%, rgba(5,10,8,0) 35%); }
.chapter.ch-2 .chapter-media::after { background: linear-gradient(270deg, rgba(5,10,8,0.45) 0%, rgba(5,10,8,0) 35%); }
```

**Placeholder scene gradients.** Used as the `.bg` of a media slot until a real photograph is added. Each is named after the subject it stands in for. Use the one that matches the subject of the missing photo:

| Class | Stands in for |
|---|---|
| `.s-backwater` | Backwaters, lakes, houseboats, sunsets on water |
| `.s-ghats` | Western Ghats, misty mountains, hills |
| `.s-forest` | Forest, trees, wildlife, paths |
| `.s-coast` | Beach, sea, cliffs, coast |
| `.s-culture` | People, festivals, culture, heritage, villages |
| `.s-temple` | Temples, places of worship, calm water, Ayurveda |
| `.s-tea` | Tea gardens, plantations, spice gardens |
| `.s-falls` | Waterfalls, rivers, rain |
| `.s-dusk` | Lamps, evening, dusk, festivals at night |

(The exact gradient definitions are in [Appendix A](#appendix-a-copy-paste-token-block).) Placeholders also show a subtle 135° stripe texture (`.ph .bg::after`) and a centred uppercase label. Both hide automatically when an `<img>` or `<video>` is placed inside the slot.

### 4.9 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | All CSS transitions (hover, colour, nav, slide crossfade) |
| GSAP `expo.out` | | Text rising into view (words and characters) |
| GSAP `power3.out` | | Fade-ups, nav entrance, hover-image follow |
| GSAP `expo.inOut` | | Image clip reveals |
| GSAP `none` | | Scrubbed effects (parallax, drift, statement light-up) |

**Durations used (do not add others):** 0.2s (input border), 0.25s (buttons, arrows), 0.3s (nav link underline, card title colour, hover image opacity), 0.35s (text-link underline, hover image swap), 0.4s (nav background), 0.5s (row title shift), 0.6s (hover image follow), 1s (fade-ups), 1.1s (word rise), 1.2s (card image zoom, banner char rise, hero char rise on slide change), 1.4s (hero first title, image clip reveal, slide crossfade), 7s (hero slide duration).

### 4.10 Z-index layers

| Layer | z-index |
|---|---|
| Nav | 50 |
| Mobile menu overlay | 49 |
| Hover image that follows the cursor | 30 |
| Chapter copy | 3 |
| Hero UI, chapter word, banner content, placeholder label | 2 |
| Scrims (`::after` overlays), chapter media | 1 |

---

## Part 5. Layout system

### 5.1 The section skeleton (use this for every new section)

```html
<!-- Paper section -->
<section class="section" id="unique-id" aria-labelledby="unique-id-h">
  <div class="wrap">
    <!-- content -->
  </div>
</section>

<!-- Dark section -->
<section class="dark section" aria-labelledby="…">
  <div class="wrap">
    <!-- content -->
  </div>
</section>
```

Rules:

1. One `<section>` per visual band. Never nest sections.
2. The `<section>` gets the background (`dark`, `chapter ch-1`, `banner`). The `.wrap` inside gets the content.
3. Give each section an `id` if anything links to it, and `aria-labelledby` pointing at its heading's `id`.
4. To remove the top padding of a paper section that follows another paper section with the same background (so they read as one block), add `style="padding-top:0"` or a class with `padding-top: 0`. The landing page does this on the values section.

### 5.2 Grids used on the landing page

Only use these grids. Each one already contains its own responsive rules.

| Grid | Class | Desktop | ≤900px | ≤600px |
|---|---|---|---|---|
| Card grid | `.cards` | 3 equal columns, `gap: clamp(40px,4vw,72px) clamp(20px,2.6vw,48px)` | 2 columns | 1 column, gap 44px (≤760px: 40px); items from the 5th on are hidden and a full-width "view all" button shows |
| Two-column text + images | `.story-grid` | `1fr 1fr`, gap `clamp(32px,5vw,96px)`, vertically centred | 1 column, images first (`order: -1`) | same |
| Image pair | `.story-media` | `1.3fr 1fr`, gap 16px, second image raised (`margin-bottom: 18%`) | same | ≤760px: `1.4fr 1fr`, gap 12px, second image lowered (`margin-top: 32%`) |
| Contact | `.contact-grid` | `0.9fr 1.1fr`, gap `clamp(40px,6vw,120px)` | ≤960px: 1 column | same |
| Form | `.form` | 2 columns, gap 28px | same | 1 column, gap 22px |
| List of three | `.stories` | 3 columns, gap `clamp(28px,3vw,48px)` | 1 column list: thumbnail 112px + text, hairlines between | ≤760px thumbnail 96px; ≤375px 84px |
| Facts | `.facts` | 3 columns with a top hairline | same | ≤760px: one row per fact: number (72px column) + label, hairline under each |
| Footer | `.foot-top` | `1.4fr 1fr 1fr 1fr`, gap 40px | 2 columns, brand full width | ≤375px: 1 column |
| Hero | `.hero-grid` | title full width on row 1; link (left) + Next card and pause (right) on row 2 | 1 column; progress bars + pause on row 3 | same |

**Always write grid columns as `minmax(0, 1fr)`**, not just `1fr`. Plain `1fr` lets long words or wide images push the column wider than the screen.

### 5.3 Alignment rules

1. Text is **left-aligned** everywhere except the banner CTA (centred) and the tablet chapter overlap layout (centred word). Never centre paragraphs in paper sections.
2. Section heading rows (`.head-row`) put the heading on the left and an optional text link on the right, aligned to the bottom (`align-items: end`). On mobile the link is hidden if a full-width button repeats it below the content.
3. Images in a grid row share the same aspect ratio, so their tops and bottoms line up.
4. Labels sit **under** images, never on top of them (except in dark full-bleed sections, where text sits on the scrim).
5. The left edge of all content in a page must line up with the left edge of the logo in the nav (both come from `.wrap`).

---

## Part 6. Component library

Every component below lists: **purpose**, **when to use**, **markup** (HTML as in the reference build; in React change `class` to `className`), **variants**, **responsive behaviour** and **rules**. React versions of the shared components are in [Part 10](#part-10-implementing-in-react--nextjs).

### 6.1 Buttons

**Purpose:** the main action in a section. Square, solid or outlined, with an arrow.

```html
<a class="btn btn-ink" href="/plan"><span>Plan a visit</span><span class="arrow" aria-hidden="true">→</span></a>
<a class="btn btn-white" href="/plan"><span>Plan a journey for your family</span><span class="arrow" aria-hidden="true">→</span></a>
<a class="btn btn-line" href="/places"><span>All destinations</span><span class="arrow" aria-hidden="true">→</span></a>
<button class="btn btn-ink" type="submit"><span>Send enquiry</span><span class="arrow" aria-hidden="true">→</span></button>
```

```css
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-height: 52px; padding: 0 28px;
       border: 1px solid transparent; border-radius: 0; font: 500 15px/1 var(--font); letter-spacing: 0.01em;
       text-decoration: none; white-space: nowrap; cursor: pointer; max-width: 100%;
       transition: background-color .25s var(--ease), color .25s var(--ease), border-color .25s var(--ease); }
.btn-ink   { background: var(--ink); color: var(--paper); }
.btn-ink:hover { background: var(--forest); }
.btn-white { background: var(--on); color: var(--ink); }
.btn-white:hover { background: rgba(255,255,255,0.86); }
.btn-line  { border-color: var(--ink); color: var(--ink); background: transparent; }
.btn-line:hover { background: var(--ink); color: var(--paper); }
.arrow { display: inline-block; transition: transform .25s var(--ease); }
a:hover > .arrow, button:hover > .arrow, .row:hover .arrow { transform: translateX(5px); }
@media (max-width: 430px) { .btn { min-height: 50px; padding: 0 22px; } }
```

| Variant | Use on | Use for |
|---|---|---|
| `btn-ink` | Paper sections | The primary action (submit, plan, book) |
| `btn-white` | Dark sections and over photos | The primary action in a dark band |
| `btn-line` | Paper sections | Secondary action, "View all" |
| `nav-cta` | Nav only | "Plan a visit" (white over the hero, ink when the nav is solid) |

Rules:

- One primary button per section. A second action is a **text link** ([6.2](#62-text-link-tlink)), not a second button.
- Labels start with a verb and are sentence case: "Send enquiry", not "SUBMIT" or "Submit Now".
- Disabled state: keep the variant and set `disabled` (the browser dims the cursor). Do not invent a grey button.
- Full width on phones (≤430px) for the main action of forms and lists: add a rule `width: 100%` for that context, as the landing page does for `.story-text .btn`, `.view-all` and `.form-foot .btn`.

### 6.2 Text link (`.tlink`)

**Purpose:** secondary actions and "read more" links. Text plus an arrow; an underline grows from left to right on hover.

```html
<a class="tlink" href="/places"><span>See the places</span><span class="arrow" aria-hidden="true">→</span></a>
```

```css
.tlink { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; font: 400 16px/22px var(--font); }
.tlink > span:first-child { background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat; padding-bottom: 3px;
                            transition: background-size .35s var(--ease); }
.tlink:hover > span:first-child { background-size: 100% 1px; }
```

Rules: the first `<span>` must contain the text (the underline is drawn on it). The arrow is the `→` character in its own `<span class="arrow" aria-hidden="true">`. For downloads use `↓`. Colour is inherited, so the same markup works on paper (ink) and dark (white).

### 6.3 Media slot (`.ph`)

**Purpose:** the only allowed wrapper for images and videos. It fixes the aspect ratio, hides overflow, gives a placeholder until the real image exists, and hosts the parallax and zoom effects.

```html
<!-- With a real image -->
<div class="ph r-4x5">
  <div class="bg s-backwater">
    <img src="/assets/images/houseboat.jpg" alt="Houseboat on still backwaters at dawn"
         width="1200" height="1500" loading="lazy" decoding="async">
  </div>
  <span class="slot">[Portrait — Houseboat on still backwaters]<small>1200×1500 · 4:5</small></span>
</div>

<!-- Placeholder only (no image yet) -->
<div class="ph r-1x1"><div class="bg s-tea"></div><span class="slot">[Image — Munnar tea hills]<small>1600×1600 · 1:1</small></span></div>
```

```css
.ph { position: relative; overflow: hidden; background: var(--paper-2); isolation: isolate; }
.ph .bg { position: absolute; inset: -6% 0; }                 /* 6% overscan for parallax */
.ph .bg > img, .ph .bg > video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ph .bg::after { content: ""; position: absolute; inset: 0;
                 background-image: repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 24px); }
.ph .slot { position: absolute; z-index: 2; left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(84%, 440px);
            text-align: center; font: 500 11px/17px var(--font); letter-spacing: 0.16em; text-transform: uppercase;
            color: rgba(255,255,255,0.82); pointer-events: none; }
.ph .slot small { display: block; margin-top: 6px; letter-spacing: 0.03em; text-transform: none; opacity: 0.8; }
.ph:has(img) .slot, .ph:has(video) .slot, .ph:has(img) .bg::after, .ph:has(video) .bg::after { display: none; }
.r-1x1 { aspect-ratio: 1 / 1; } .r-4x5 { aspect-ratio: 4 / 5; } .r-3x2 { aspect-ratio: 3 / 2; }
.r-16x9 { aspect-ratio: 16 / 9; } .r-21x9 { aspect-ratio: 21 / 9; }
```

| Ratio class | Use for | Recommended source size |
|---|---|---|
| `r-1x1` | Destination/listing cards, story thumbnails on mobile | 1600×1600 |
| `r-4x5` | Portraits, chapter images, people | 1200×1500 |
| `r-3x2` | Story images, chapter inset images, landscape photos in text sections | 1500×1000 |
| `r-16x9` | List row images, video thumbnails, wide photos | 1600×900 |
| `r-21x9` | Panoramas between sections (available, not used on the landing page yet) | 2880×1234 |
| no ratio, `position:absolute; inset:0` | Full-bleed hero, banner, chapter image at ≥1025px | 2560×1440 |

Rules:

1. Put the `<img>`/`<video>` **inside `.bg`**, never directly inside `.ph`. The parallax moves `.bg`; the zoom-on-hover scales `.bg`.
2. Keep the placeholder gradient class on `.bg` even after adding an image. It shows while the image loads.
3. Every `<img>` needs a real `alt` (describe the scene), `width` and `height`, and `loading="lazy" decoding="async"` unless it is in the first screen. The first screen image gets `loading="eager"` and `fetchpriority="high"`.
4. In Next.js, if the project uses `next/image`, use it with `fill` and `sizes`, inside `.bg`, with `style={{objectFit:'cover'}}`. Do not let `next/image` add its own wrapper with a different size.
5. Videos: `autoplay muted loop playsinline preload="auto"` plus `poster`. Never animate scale on a playing video (it shimmers; see Part 17).
6. If you do not have the real image, keep the placeholder and write the subject and size in the label, in the format `[Kind — Subject]<small>W×H · ratio</small>`. Never use a random stock photo URL.

### 6.4 Page hero

There are three hero types. Choose by the page's purpose.

#### 6.4.1 Landing hero carousel (home page only)

The full-screen 3-slide carousel with the one-line fitted title, "Next" card, progress bars and pause button. **Only the home page uses it.** Markup and behaviour are in the reference `index.html` lines 47–92 and `main.js` "hero carousel". Do not reuse the carousel on inner pages: it is the signature of the home page.

#### 6.4.2 Inner page hero: dark, with a full-bleed image (default for inner pages)

Use for any page that has a strong subject photo: About, a destination detail page, Experiences, Journeys, Stories landing, Gallery.

It is the landing hero without the carousel: same height logic (shorter), same scrim, same type style, the title is allowed to wrap.

```html
<section class="page-hero" aria-labelledby="pageH">
  <div class="ph"><div class="bg s-ghats" data-inner="6">
    <img src="/assets/images/western-ghats.jpg" alt="Misty ridges of the Western Ghats" loading="eager" fetchpriority="high">
  </div><span class="slot">[Full-screen image — Western Ghats in mist]<small>2560×1440</small></span></div>
  <div class="wrap page-hero-in">
    <span class="kicker">Destinations</span>
    <h1 class="page-title" id="pageH" data-chars>Places that stay with you</h1>
    <p class="lead">Fourteen districts, one gentle pace. Choose where your Kerala journey begins.</p>
    <a class="tlink" href="#list"><span>See all places</span><span class="arrow" aria-hidden="true">→</span></a>
  </div>
</section>
```

```css
/* Inner page hero: composed only from landing-page values (hero scrim, hero type, hero-ui padding) */
.page-hero { position: relative; min-height: clamp(460px, 72svh, 820px); overflow: hidden; display: flex; align-items: flex-end;
             background: var(--night); color: var(--on); }
.page-hero > .ph { position: absolute; inset: 0; }
.page-hero > .ph .bg { inset: -6% 0; }
.page-hero::after { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, rgba(5,10,8,0.5) 0%, rgba(5,10,8,0) 24%),
              linear-gradient(0deg, rgba(5,10,8,0.78) 0%, rgba(5,10,8,0.15) 55%, rgba(5,10,8,0) 75%); }
.page-hero-in { position: relative; z-index: 2; display: grid; gap: 20px; justify-items: start;
                padding-top: 140px; padding-bottom: clamp(28px, 5vw, 72px); }
.page-hero .kicker { color: var(--on-muted); }
.page-hero .lead { color: var(--on-muted); }
.page-title { font: 300 clamp(44px, 6.6vw, 124px)/1.02 var(--font); letter-spacing: -0.025em; max-width: 14ch; }
@media (max-width: 760px) {
  .page-hero { min-height: 520px; }
  .page-hero-in { padding-bottom: 28px; gap: 16px; }
  .page-title { font-size: clamp(38px, 11vw, 56px); line-height: 1.04; }
}
@media (max-width: 375px) { .page-title { font-size: 36px; } }
@media (max-width: 340px) { .page-title { font-size: 32px; } }
```

Rules: the nav is transparent over this hero and turns solid after it (see [6.5](#65-navigation-header)). Only one primary action in the hero, and it is a `tlink` or a `btn-white`.

#### 6.4.3 Inner page hero: paper, text only (for utility pages)

Use for Contact, Booking, FAQ, Privacy, Terms, Search, Account, 404, and any page whose first job is a form or text. This is the WAC contact-page style.

```html
<section class="section paper-hero" aria-labelledby="pageH">
  <div class="wrap">
    <span class="label">Help</span>
    <h1 class="paper-title" id="pageH" data-split>Questions, answered</h1>
    <p class="lead" data-reveal>Everything families ask us before they travel.</p>
  </div>
</section>
```

```css
.paper-hero { padding-top: calc(76px + var(--section-y)); padding-bottom: clamp(32px, 4vw, 64px); }
.paper-hero .wrap { display: grid; gap: 20px; justify-items: start; }
.paper-title { font: 400 clamp(44px, 5.2vw, 92px)/1.06 var(--font); letter-spacing: -0.015em; max-width: 18ch; }
@media (max-width: 760px) { .paper-hero { padding-top: calc(64px + 48px); } .paper-title { font-size: clamp(32px, 9vw, 44px); line-height: 1.1; } }
@media (max-width: 340px) { .paper-title { font-size: 30px; } }
```

(76px is the nav height on desktop and 64px on phones, so the title never hides under the fixed nav.) On pages with a paper hero the nav is **solid from the start**.

### 6.5 Navigation (header)

**Purpose:** fixed top bar on every page. Same items, same order, on every page.

```html
<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="/" aria-label="Chaitanya Keralam, home"><img src="/assets/logo.png" alt="" width="46" height="44"><span>Chaitanya Keralam</span></a>
    <nav aria-label="Primary" style="display:contents">
      <ul class="nav-links">
        <li><a href="/#destinations">Places</a></li>
        <li><a href="/#nature">Our vision</a></li>
        <li><a href="/#experiences">Our values</a></li>
        <li><a href="/#stories">Journeys</a></li>
      </ul>
    </nav>
    <div class="nav-end">
      <a class="btn nav-cta" href="/#plan">Plan a visit</a>
      <button class="nav-menu" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" hidden> … same links as large text, plus "Plan a visit" … </div>
```

Key styles (full CSS in the stylesheet section "nav"):

- `.nav`: `position: fixed; inset: 0 0 auto; z-index: 50; color: var(--on);` transparent over a dark hero.
- `.nav.solid`: `background: var(--paper); color: var(--ink); box-shadow: 0 1px 0 var(--line);` and its CTA becomes `btn-ink` colours.
- Height: `min-height: 76px` (≤600px: 64px). Logo 46px wide (≤600px: 40px, ≤375px: 36px). Brand name 500 18px (≤600px: 16px, ≤375px: 15px).
- Links: 400 16px, gap `clamp(20px, 3vw, 56px)`, centred; underline grows on hover (0.3s).
- ≤1080px: links hide, the hamburger (`.nav-menu`, three 26px×1.5px lines) shows. ≤600px: the CTA hides (it is inside the menu instead).
- Mobile menu (`.menu`): full screen, paper background, links 400 `clamp(28px, 8vw, 44px)`, each with a hairline under it. Opening it sets `menu.hidden = false`, adds `menu-open` to `<html>`, locks body scroll, and sets `aria-expanded`. **Escape** closes it and returns focus to the button. Clicking a link closes it.

**When is the nav solid?**

| Page starts with | Nav state |
|---|---|
| Landing hero or inner dark hero (`.hero`, `.page-hero`) | Transparent (white text) until the user scrolls past `hero height − 80px`, then `.solid` |
| Anything else (paper hero, form, text) | `.solid` from the first frame |

**Links on inner pages:** the landing page uses in-page anchors (`#destinations`). On inner pages, links must point to real routes or to the home page anchors (`/#destinations`). If the project already has real routes for these pages (for example `/destinations`), use the real routes everywhere. **Never** leave an inner-page nav link pointing at an anchor that does not exist on that page.

### 6.6 Footer

Same footer on every page. Dark (`footer.dark.foot`), with brand + the three brand lines, three link columns (Explore, Journeys, Follow), the huge faint "Keralam" watermark and the legal row.

```html
<footer class="dark foot">
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <a class="brand" href="/"><img src="/assets/logo.png" alt="" width="60" height="58" style="width:60px"><span>Chaitanya Keralam</span></a>
        <p class="foot-promise">Perhaps the only paradise on earth!<br>One with nature.<br>God's own country.</p>
        <p class="label">Eco-Spiritual Peace Tourism · Anbu · Unmai · Patru · Pagutharivu</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="/#destinations">Places</a></li>…</ul></div>
      <div><h4>Journeys</h4><ul>…</ul></div>
      <div><h4>Follow</h4><ul>…</ul></div>
    </div>
    <p class="water" id="water" aria-hidden="true">Keralam</p>
    <div class="legal"><span>© 2026 Chaitanya Keralam</span><span>Privacy · Terms</span></div>
  </div>
</footer>
```

Styles: padding-top `clamp(64px, 7vw, 120px)`; columns `1.4fr 1fr 1fr 1fr` gap 40px; column headings are kickers (500 12px, 0.16em, uppercase, `--on-muted`); links white at 86% opacity, 100% on hover; watermark 300 `clamp(76px, 18vw, 360px)/0.8`, letter-spacing -0.06em, colour `--on-faint`, `white-space: nowrap`; legal 13px with a top hairline in `--on-faint`. If the project's footer has extra links or legal text, **keep them** and add them as more `<li>` items or more columns (max 4 link columns).

### 6.7 Kicker, label and lead

```html
<span class="kicker">01 · Perhaps the only paradise on earth</span>   <!-- uppercase, 12px, 0.16em -->
<span class="label">Our vision</span>                                  <!-- 15px muted -->
<p class="lead">A yatra for today. See Kerala's beauty …</p>          <!-- 300, up to 22px, muted, max 46ch -->
```

- **Kicker** = small uppercase line above a dark-band heading. Use the format `NN · Words` for numbered chapters.
- **Label** = small muted line above a paper-band heading, or the category above a card title.
- **Lead** = the one paragraph under a section heading.

### 6.8 Section heading row (`.head-row`)

```html
<div class="head-row">
  <h2 class="h-section" id="destH" data-split>Places that stay with you</h2>
  <a class="tlink" href="/places"><span>All destinations</span><span class="arrow" aria-hidden="true">→</span></a>
</div>
```

```css
.head-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 16px 48px;
            margin-bottom: clamp(36px, 4vw, 64px); }
@media (max-width: 760px) { .head-row { margin-bottom: 28px; gap: 12px; } .head-row .lead { flex-basis: 100%; } }
```

Variant: heading + lead (no link): put `<p class="lead" data-reveal>` as the second child; on mobile it drops under the heading.

### 6.9 Story split (text + images + facts)

**Purpose:** a two-column "about this" block: label, heading, lead, optional facts, button on one side; two overlapping images on the other.

```html
<section class="section" id="nature" aria-labelledby="natH">
  <div class="wrap story-grid">
    <div class="story-text">
      <span class="label">Our vision</span>
      <h2 class="h-section" id="natH" data-split>Eco-Spiritual Peace Tourism</h2>
      <p class="lead" data-reveal>…</p>
      <div class="facts" data-reveal>
        <div class="fact"><b>44</b><span>Rivers</span></div>
        <div class="fact"><b>14</b><span>Districts</span></div>
        <div class="fact"><b>1</b><span>Western Ghats, a UNESCO World Heritage range</span></div>
      </div>
      <a class="btn btn-ink" href="/vision" data-reveal><span>Our vision</span><span class="arrow" aria-hidden="true">→</span></a>
    </div>
    <div class="story-media">
      <div class="ph r-4x5" data-reveal-img><div class="bg s-forest" data-inner="5"></div><span class="slot">…</span></div>
      <div class="ph r-1x1" data-reveal-img><div class="bg s-falls" data-inner="5"></div><span class="slot">…</span></div>
    </div>
  </div>
</section>
```

- Facts: exactly 3 facts per row. Numbers must be real and sourced; never invent statistics. If a page has 2 or 4 facts, use 2 or 4 equal columns (`grid-template-columns: repeat(N, minmax(0,1fr))`) and keep the mobile row layout.
- To mirror (images left), add a modifier that sets `.story-media { order: -1 }` at ≥901px. On mobile images always come first.

### 6.10 Rows list (values / steps / FAQ)

**Purpose:** a numbered list of big light titles separated by hairlines. On desktop an image follows the cursor; on mobile each row shows its own image.

```html
<ul class="rows">
  <li><a class="row" href="/values/anbu" data-img="0">
    <span class="row-no">01</span>
    <div class="ph r-16x9"><div class="bg s-backwater"></div><span class="slot">[Image — Shared meal]<small>1600×900</small></span></div>
    <span class="row-t">Anbu · Love and compassion</span>
    <span class="arrow" aria-hidden="true">→</span>
  </a></li>
  …
</ul>
<div class="hover-img" id="hoverImg" aria-hidden="true">
  <div class="ph"><div class="bg s-backwater"></div></div>  <!-- one per row, same order -->
  …
</div>
```

- Desktop: grid `64px minmax(0,1fr) auto`, padding `clamp(22px,2.4vw,36px) 0`, bottom hairline; title shifts 10px right on hover; arrow nudges 5px.
- Mobile ≤760px: no number column, the row's own `.ph` shows above the title, rows separated by 32px gaps.
- **FAQ variant (no links, no images):** use `<details>` inside each `<li>` so the answer opens below the title. Keep the same classes for the title line. Answer text uses `.lead` sizing and `padding-bottom: 24px`. Do not add the hover image.

```html
<ul class="rows rows-faq">
  <li><details class="row-details">
    <summary class="row"><span class="row-no">01</span><span class="row-t">When is the best time to visit?</span><span class="arrow" aria-hidden="true">↓</span></summary>
    <div class="row-answer"><p class="lead">October to March is cool and dry …</p></div>
  </details></li>
</ul>
```

```css
.rows-faq summary { list-style: none; cursor: pointer; }
.rows-faq summary::-webkit-details-marker { display: none; }
.rows-faq .row { grid-template-columns: 64px minmax(0,1fr) auto; }
.row-details[open] .arrow { transform: rotate(180deg); }
.row-answer { padding: 0 0 clamp(22px, 2.4vw, 36px) 88px; border-bottom: 1px solid var(--line); }
.row-details[open] .row { border-bottom: 0; }
@media (max-width: 760px) { .rows-faq .row { grid-template-columns: minmax(0,1fr) auto; padding: 18px 0; border-bottom: 1px solid var(--line); } .row-answer { padding-left: 0; } .rows-faq { gap: 0; } }
```

### 6.11 Card grid (destinations, listings, case-study style)

```html
<ul class="cards">
  <li data-reveal><a class="card" href="/places/alappuzha">
    <div class="ph r-1x1"><div class="bg s-backwater"><img …></div><span class="slot">…</span></div>
    <span class="label">Backwaters</span>
    <h3>Alappuzha: a houseboat, a cup of chai and the backwaters drifting by</h3>
  </a></li>
  …
</ul>
<a class="btn btn-line view-all" href="/places"><span>All destinations</span><span class="arrow" aria-hidden="true">→</span></a>
```

- Card = image + label (category) + one-sentence title. **No box, no border, no shadow, no button inside the card.** The whole card is the link.
- Hover: image scales to 1.04 over 1.2s; title colour goes from `--ink-muted` to `--ink`.
- Hand-written content: use 3, 6 or 9 cards so every row is full.
- Data-driven content (a CMS or API list): show **every** item; never drop items to make rows even. If the count leaves one card alone on the last row, that is acceptable. Never make one card wider or taller than the others.
- Listing pages with filtering or pagination: keep the existing filter/pagination logic. Style filter buttons as tabs ([6.13](#613-tabs)) and the pager as `btn-line` buttons.
- **Mobile "show 4 + view all" rule applies only when a "view all" destination exists.** On a full listing page (where this *is* "all"), remove the `nth-child(n+5) { display:none }` rule for that grid by adding a class `cards-all` with `.cards-all li { display: block !important; }`.

### 6.12 Stories list (three items: image, label, title)

```html
<ul class="stories">
  <li class="story-item" data-reveal><a href="/journeys/ayurveda">
    <div class="ph r-3x2"><div class="bg s-backwater"></div><span class="slot">…</span></div>
    <div><span class="label">Ayurveda &amp; rest</span><h3>Ayurveda the traditional way: herbal oils, simple food and quiet, restful days</h3></div>
  </a></li>
</ul>
```

Desktop: 3 columns. ≤900px: a compact list with a square thumbnail (112px, 96px at ≤760px, 84px at ≤375px) and hairlines. Use for articles, related stories, journeys, news.

### 6.13 Tabs

```html
<div class="tabs" role="tablist" aria-label="Enquiry type">
  <button class="tab" type="button" role="tab" id="t-trip" aria-selected="true" aria-controls="enquiry" data-type="trip">Plan a journey</button>
  <button class="tab" type="button" role="tab" id="t-partner" aria-selected="false" aria-controls="enquiry" data-type="partner">Groups &amp; organisations</button>
</div>
```

- Rail: 1px `--line` bottom border; gap `clamp(16px, 4vw, 72px)`; scrolls sideways on overflow with a fade at the right edge on mobile.
- Selected tab: `--ink` text with a 2px `--accent` line exactly on the rail. Others: `--ink-muted`.
- Keyboard: Left/Right arrows move between tabs (see `initForm` in `main.js`).
- Use for: form types, filters on listing pages, itinerary days.

### 6.14 Forms (fields, phone, textarea, consent, errors, notice)

The WAC-style form. Copy the field markup exactly; only names and labels change.

```html
<form class="form" id="enquiry" novalidate>
  <div class="field"><label for="f-first">First name*</label>
    <input id="f-first" name="firstName" autocomplete="given-name" placeholder="Enter first name" required>
    <span class="err" aria-live="polite"></span></div>
  <div class="field"><label for="f-phone">Phone number*</label>
    <div class="phone"><select id="f-code" name="countryCode" aria-label="Country code">…</select>
      <input id="f-phone" name="phone" type="tel" autocomplete="tel-national" placeholder="Phone number" required></div>
    <span class="err" aria-live="polite"></span></div>
  <div class="field full"><span class="flabel"><label for="f-msg">Tell us more</label><span class="count" id="count">0 / 1000</span></span>
    <textarea id="f-msg" name="message" maxlength="1000" placeholder="…"></textarea></div>
  <div class="form-foot">
    <label class="consent"><input type="checkbox" name="consent"> <span>I agree to be contacted by phone or email about my enquiry.</span></label>
    <button class="btn btn-ink" type="submit"><span>Send enquiry</span><span class="arrow" aria-hidden="true">→</span></button>
  </div>
  <p class="form-note" id="formNote" role="status" hidden></p>
</form>
```

| Part | Style |
|---|---|
| Grid | 2 columns, gap 28px; ≤600px 1 column, gap 22px; `.field.full` spans both columns |
| Label | 400 16px/1.3 (≤760px 15px), above the input, gap 10px |
| Input/select | min-height 58px (≤760px 52px), padding 0 18px (≤760px 0 14px), 1px `--line-strong` border, radius 0, white background, 16px text, placeholder `#8b918d` |
| Focus | border `--ink` + `box-shadow: 0 0 0 1px var(--ink)`, no outline glow |
| Select arrow | two 5px gradient triangles at right 22px/17px (in the stylesheet); padding-right 44px |
| Textarea | min-height 180px (≤760px 150px), padding 16px 18px, resize vertical |
| Phone | grid `92px minmax(0,1fr)` (≤760px 84px); select has no right border |
| Error | `.field.bad` → red border; `.err` text 13px `--error`; set `aria-invalid="true"`; focus the first invalid field |
| Consent | 14px muted, 18px checkbox with `accent-color: var(--ink)` |
| Notice | `.form-note`: `--paper-2` panel, 18px 20px padding, 15px, `role="status"` |

**Functionality rule for existing forms:** if the page's form uses a library (React Hook Form, Formik, a server action, an API route), keep the library and its handlers. Only change the markup **classes and wrappers** around the existing inputs. Keep every `name`, `id`, `required`, `pattern`, validation message and submit handler. Map the library's error output into `.field.bad` + `.err`.

### 6.15 Guide / download card

```html
<a class="guide" href="/assets/chaitanya-keralam-guide.pdf">
  <div class="ph"><div class="bg s-tea"></div></div>
  <span class="guide-t"><b>Download our Kerala family travel guide</b><span>PDF · 2.0 MB <span aria-hidden="true">↓</span></span></span>
</a>
```

Square thumbnail 112px (≤600px 96px, ≤430px 88px), 1px `--line` border, white background, max width 440px. Use for any file download or "external resource" link.

### 6.16 Dark bands: statement, chapter, banner

**Statement (one sentence on night):**

```html
<section class="dark statement"><div class="wrap">
  <span class="kicker">Chaitanya Keralam</span>
  <p id="statement">Temple bells at dawn, church bells at noon, the azaan at dusk, all under one sky.</p>
</div></section>
```

The words light up from 18% to 100% opacity as the user scrolls (Part 7). On inner pages give the paragraph `data-statement` instead of `id="statement"` (the generic hook in Part 10 uses the attribute).

**Chapter (giant word + big image + copy + inset image):**

```html
<section class="dark chapter ch-1" aria-labelledby="ch1">
  <div class="wrap chapter-stage">
    <span class="kicker chapter-no">01 · Perhaps the only paradise on earth</span>
    <div class="ph r-4x5 chapter-media"><div class="bg s-backwater" data-inner="7"></div><span class="slot">…</span></div>
    <h2 class="chapter-word" id="ch1" data-drift="-6">Paradise</h2>
    <div class="chapter-copy" data-reveal>
      <p>The Kerala of the stories you grew up with …</p>
      <a class="tlink" href="/places"><span>See the places</span><span class="arrow" aria-hidden="true">→</span></a>
    </div>
    <div class="ph r-3x2 chapter-inset" data-reveal-img><div class="bg s-coast"></div><span class="slot">…</span></div>
  </div>
</section>
```

| Width | Layout |
|---|---|
| ≥1025px | Two columns. Image fills the right column (`ch-1`, `ch-3`) or left column (`ch-2`), at least `min(80vh, 900px)` tall, bleeding to the screen edge. The giant word sits in the text column and overflows onto the image (`margin-right: -40%`; `ch-2` uses `margin-left: -28%`). Copy under the word; the inset image (`width: min(62%, 420px)`) at the bottom of the text column. |
| 901–1024px | Centred word with a smaller floating image (`clamp(180px, 26vw, 300px)`) behind its right edge, with shadow. |
| 761–900px | Stacked: image (max 560px wide), word overlapping the image bottom (`margin-top: -0.42em`), copy. |
| ≤760px | Stacked: full-width image, word overlapping it (`margin-top: -0.45em`), copy. Inset image hidden. |

Rules: the word is 1–2 words. Use `data-drift="-6"` for chapters whose image is on the right, `data-drift="6"` for mirrored. Alternate `ch-1` / `ch-2` / `ch-3` backgrounds down a page. Max 3 chapters per page.

**Banner CTA (centred title on a dimmed full-bleed photo):**

```html
<section class="banner" aria-labelledby="banH">
  <div class="ph"><div class="bg s-backwater" data-inner="8"></div><span class="slot" style="top:22%">…</span></div>
  <div class="wrap banner-in">
    <h2 id="banH" data-chars>God's own country awaits.</h2>
    <a class="btn btn-white" href="/plan"><span>Plan a journey for your family</span><span class="arrow" aria-hidden="true">→</span></a>
  </div>
</section>
```

Min height `clamp(520px, 80vh, 860px)` (≤760px 480px). Title max 11ch. Use once per page, near the end.

### 6.17 Prose / long text

The landing page has no long text. Articles, legal pages and long descriptions need it. Build prose **only** from landing-page values:

```html
<section class="section"><div class="wrap">
  <article class="prose">
    <p>…</p>
    <h2>Getting there</h2>
    <p>…</p>
    <figure><div class="ph r-3x2"><div class="bg s-backwater"><img …></div></div><figcaption class="label">Vembanad Lake at dawn</figcaption></figure>
    <ul><li>…</li></ul>
  </article>
</div></section>
```

```css
.prose { max-width: 68ch; }
.prose > * + * { margin-top: 20px; }
.prose p, .prose li { font: 400 18px/1.65 var(--font); color: var(--ink); }   /* = .contact-intro p */
.prose h2 { font: 400 clamp(32px, 3.4vw, 44px)/1.1 var(--font); letter-spacing: -0.015em; margin-top: 56px; }  /* = mobile .h-section max */
.prose h3 { font: 300 clamp(22px, 1.75vw, 30px)/1.32 var(--font); margin-top: 40px; }                      /* = .card h3 */
.prose a { color: var(--accent); text-underline-offset: 3px; }
.prose ul, .prose ol { padding-left: 1.2em; }
.prose figure { margin: 40px 0; }
.prose figcaption { margin-top: 12px; }
.prose blockquote { margin: 40px 0; padding-left: 24px; border-left: 1px solid var(--line-strong);
                    font: 300 clamp(22px, 2vw, 30px)/1.35 var(--font); }
@media (max-width: 760px) { .prose p, .prose li { font-size: 16px; } }
```

### 6.18 Logo / brand mark

`/assets/logo.png` (295×285 raster emblem, transparent). Shown at 46px wide in the nav, 60px in the footer. Always next to the text "Chaitanya Keralam" (500 weight). Never recolour, outline, put in a white box, or show below 36px.

### 6.19 Icons

- Arrows: the text characters `→` (forward) and `↓` (download / expand). Always in `<span class="arrow" aria-hidden="true">`.
- Pause / play: inline SVG, 24×24 viewBox, `fill: currentColor`, shown at 18px inside a 46px round `.hero-ctrl`:
  - pause: `M6 19h4V5H6v14zm8-14v14h4V5h-4z`
  - play: `M8 5v14l11-7z`
- Hamburger: CSS lines (`.nav-menu i`), not an icon.
- If an existing page uses an icon library (for example social icons), keep the icons but render them 18–20px, `currentColor`, no background chips. Do not add decorative icons or emoji to headings or cards.

---

## Part 7. Animation and interaction catalogue

All motion on the site is one of the patterns below. **Do not invent new animation types** (no bounces, no rotations except the 6° on hero characters, no flips, no confetti, no typewriter effects, no auto-playing marquees, no spinning loaders on content).

### 7.0 How animations are switched on (the opt-in attributes)

You add animation by putting an attribute on an element. The script (landing: `main.js`; inner pages: the `useCKMotion` hook in [10.4](#104-the-shared-motion-hook-for-inner-pages)) finds the attribute and animates it.

| Attribute / class | Put it on | Effect | Runs on |
|---|---|---|---|
| `data-split` | A heading (`h1`, `h2`) | Words rise from below their line, one after another | All sizes |
| `data-chars` | A short big heading (banner, inner page title) | Characters rise from below, one after another | All sizes |
| `data-reveal` | Any block (paragraph, card `<li>`, button, form wrapper) | Fades in while moving up 28px | All sizes |
| `data-reveal-img` | A `.ph` media slot | The image is uncovered from bottom to top (clip-path) | Desktop motion only |
| `data-inner="N"` | The `.bg` inside a `.ph` | The image moves up/down inside its frame by ±N% while scrolling (parallax) | Desktop motion only |
| `data-parallax="N"` | A whole element | The element moves ±N% vertically while scrolling | Desktop motion only |
| `data-drift="N"` | `.chapter-word` | The giant word slides sideways ±N% while scrolling | Desktop motion only |
| `data-statement` (inner) / `#statement` (landing) | The statement paragraph | Words go from 18% to 100% opacity as you scroll | All sizes |
| `.chapter-media` | (class) | Gets the clip reveal automatically | Desktop motion only |
| `#water` | Footer watermark | Slides in from 10% right and fades in, scrubbed | Desktop motion only |

**Desktop motion** = `(min-width: 900px) and (pointer: fine)`. **Reduced motion** (`prefers-reduced-motion: reduce`) = none of the GSAP effects run, Lenis does not run, and CSS transitions/animations are disabled.

### 7.1 Specifications (one table per animation)

Every value below comes from `main.js` or `style.css`.

#### A. Nav entrance (landing page load)

| Property | Value |
|---|---|
| Element | Every direct child of `.nav-in` (brand, links, end group) |
| Trigger | Page load (inside `gsap.context` after init) |
| Initial | `y: -16px`, `opacity: 0` |
| Final | `y: 0`, `opacity: 1` |
| Duration / delay / stagger | 1s / 0.2s / 0.08s between children |
| Easing | `power3.out` |

```js
gsap.from('.nav-in > *', { y: -16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.2 });
```

Inner pages: use the same entrance only on pages with a dark `page-hero`. On paper-hero pages, skip it (the nav is already solid and should feel stable).

#### B. Hero title characters (landing first slide; inner `page-title` with `data-chars`)

| Property | Value |
|---|---|
| Element | Each character `.ci` of the title (split by `chars()`) |
| Trigger | Page load |
| Initial | `yPercent: 120` (the character is below its clipping box `.c`, so invisible) |
| Final | `yPercent: 0` |
| Duration / delay / stagger | 1.4s / 0.35s / 0.025s |
| Easing | `expo.out` |

```js
gsap.from(titleChars, { yPercent: 120, duration: 1.4, ease: 'expo.out', stagger: 0.025, delay: 0.35 });
```

On a slide change in the carousel: `fromTo(chars, {yPercent:120}, {yPercent:0, duration:1.2, ease:'expo.out', stagger:0.022, delay:0.15})`.

The clipping box CSS is required, or the characters will be visible below the line:

```css
.c  { display: inline-block; overflow: hidden; vertical-align: top; padding: 0.12em 0 0.18em; margin: -0.12em 0 -0.18em; }
.ci { display: inline-block; }
```

#### C. Hero supporting UI fade-up

| Element | `.hero-sub, .mobile-segs, .hero-side` (inner: `.page-hero .lead, .page-hero .tlink, .page-hero .kicker`) |
|---|---|
| Trigger | Page load |
| Initial → final | `y: 20, opacity: 0` → `y: 0, opacity: 1` |
| Duration / delay / stagger | 1s / 1s / 0.1s |
| Easing | `power3.out` |

#### D. Hero slide crossfade (landing only)

| Element | `.slide` |
|---|---|
| Trigger | Every 7000ms, or "Next" card click, or progress segment click |
| Initial → final | `opacity: 0; visibility: hidden` → `.is-active { opacity: 1; visibility: visible }` |
| Duration | 1.4s, `var(--ease)` (CSS transition) |
| Extra | Progress segment fill: `transform: scaleX(var(--p))` updated every animation frame, from 0 to 1 over 7s. Pauses when the hero is off-screen (IntersectionObserver, threshold 0.05), when the tab is hidden, and when the pause button is pressed. |

#### E. Statement words light up (scrubbed)

| Element | Each word `.wi` of the statement paragraph |
|---|---|
| Trigger | Scroll: from when the section top reaches 75% of the viewport to when its bottom reaches 70% |
| Initial → final | `opacity: 0.18` → `opacity: 1`, word by word (stagger 0.08) |
| Easing | `none` (scrubbed: tied to scroll) |

```js
gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.08, ease: 'none',
  scrollTrigger: { trigger: section, start: 'top 75%', end: 'bottom 70%', scrub: true } });
```

#### F. Section heading words rise (`data-split`)

| Element | Each word `.wi` |
|---|---|
| Trigger | Once, when the heading's top reaches 88% of the viewport height |
| Initial → final | `yPercent: 115` → `0` |
| Duration / stagger | 1.1s / 0.06s |
| Easing | `expo.out` |

```js
gsap.from(words(el), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.06,
  scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
```

Word clipping box (required):

```css
.w  { display: inline-block; overflow: hidden; vertical-align: top; padding: 0.06em 0 0.12em; margin: -0.06em 0 -0.12em; }
.wi { display: inline-block; }
```

#### G. Big title characters rise (`data-chars`)

| Element | Each character |
|---|---|
| Trigger | Once, when the element's top reaches 80% of the viewport |
| Initial → final | `yPercent: 120` → `0` |
| Duration / stagger | 1.2s / 0.02s |
| Easing | `expo.out` |

#### H. Block fade-up (`data-reveal`)

| Element | Any element with `data-reveal` |
|---|---|
| Trigger | Once, when its top reaches 90% of the viewport |
| Initial → final | `y: 28, opacity: 0` → `y: 0, opacity: 1` |
| Duration | 1s |
| Easing | `power3.out` |

```js
gsap.from(el, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
```

Use on: leads, card `<li>`s, button rows, facts, form wrappers, story items. **Do not** put `data-reveal` on an element that is already inside another `data-reveal` element (double animation). **Do not** put it on the hero or the nav.

#### I. Image clip reveal (`data-reveal-img`, `.chapter-media`) (desktop motion only)

| Element | The `.ph` frame |
|---|---|
| Trigger | Once, when its top reaches 88% of the viewport |
| Initial → final | `clipPath: inset(100% 0% 0% 0%)` (fully hidden from the top) → `inset(0% 0% 0% 0%)` |
| Duration | 1.4s |
| Easing | `expo.inOut` |

#### J. Inner image parallax (`data-inner="N"`) (desktop motion only)

| Element | The `.bg` inside a `.ph` (the `.bg` has 6% overscan: `inset: -6% 0`) |
|---|---|
| Trigger | Scrubbed from when the frame's top enters the bottom of the screen to when its bottom leaves the top |
| Initial → final | `yPercent: -N` → `yPercent: N` |
| Easing | `none`, `force3D: true` |
| Values used | 5 (story images), 7 (chapter images), 8 (banner), 6 (inner page hero) |

**Never use N above 8**: the image would show its edge. Never use `data-inner` on a `.bg` that contains a video.

#### K. Element parallax (`data-parallax="N"`) (desktop motion only)

Same as J, but moves the element itself relative to its `<section>`. Available in `main.js`; the landing page currently uses `data-inner` instead. Use only for overlapping decorative images, max N = 8.

#### L. Chapter word drift (`data-drift="N"`) (desktop motion only)

| Element | `.chapter-word` |
|---|---|
| Trigger | Scrubbed across the whole chapter (top enters bottom → bottom leaves top) |
| Initial → final | `xPercent: -N` → `xPercent: N` (N = 6 or -6) |
| Easing | `none` |

#### M. Footer watermark (desktop motion only)

`#water`: `{ xPercent: 10, opacity: 0 }` → `{ xPercent: 0, opacity: 1 }`, scrubbed from footer top entering the bottom of the screen to footer bottom reaching the bottom.

#### N. Smooth scroll (Lenis) (desktop motion only)

```js
const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
lenis.on('scroll', ScrollTrigger.update);
const tick = (t) => lenis.raf(t * 1000);
gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);
// In-page anchor links scroll with Lenis, with a -70px offset for the fixed nav (0 for #top)
```

Rules: **exactly one Lenis instance** on the page at any time. No `scroll-behavior: smooth` in CSS anywhere (it fights Lenis). Destroy it on unmount.

#### O. Hover and click interactions (CSS)

| Element | Hover / focus effect | Duration | Easing |
|---|---|---|---|
| `.btn-ink` | background ink → forest | 0.25s | `--ease` |
| `.btn-white` | background white → 86% white | 0.25s | `--ease` |
| `.btn-line` | transparent → ink background, paper text | 0.25s | `--ease` |
| `.arrow` inside a hovered link/button/row | `translateX(5px)` | 0.25s | `--ease` |
| `.tlink` text | underline grows 0 → 100% width (1px) | 0.35s | `--ease` |
| `.nav-links a` | underline grows 0 → 100% (1px) | 0.3s | `--ease` |
| `.card` image (`.bg`) | `scale(1.04)` | 1.2s | `--ease` |
| `.card h3` | `--ink-muted` → `--ink` | 0.3s | `--ease` |
| `.row-t` | `translateX(10px)` | 0.5s | `--ease` |
| `.foot a` | opacity 0.86 → 1 | instant | |
| `.nav` background | transparent ↔ paper when `.solid` toggles | 0.4s | `--ease` |
| Inputs | border `--line-strong` → `--ink` on focus | 0.2s | `--ease` |
| Hover image (values list) | follows the cursor at +40px x: `gsap.to(hv, {x, y, duration: 0.6, ease: 'power3.out', overwrite: 'auto'})`; fades in 0.3s; swaps picture 0.35s | | |

Hover effects only on devices that can hover. The cursor-follow image runs only when `(hover: hover) and (pointer: fine)` matches.

#### P. Background animations

There are **none** except the hero carousel crossfade and optional hero background video. No animated gradients, no particles, no floating blobs. Do not add any.

### 7.2 Timing summary (copy this, don't guess)

| Pattern | Duration | Delay | Stagger | Ease | Trigger start |
|---|---|---|---|---|---|
| Nav entrance | 1 | 0.2 | 0.08 | power3.out | load |
| Hero chars | 1.4 | 0.35 | 0.025 | expo.out | load |
| Hero UI fade-up | 1 | 1 | 0.1 | power3.out | load |
| Word rise | 1.1 | 0 | 0.06 | expo.out | top 88% |
| Char rise | 1.2 | 0 | 0.02 | expo.out | top 80% |
| Fade-up | 1 | 0 | n/a | power3.out | top 90% |
| Image reveal | 1.4 | 0 | n/a | expo.inOut | top 88% |
| Statement | scrub | n/a | 0.08 | none | top 75% → bottom 70% |
| Parallax / drift / watermark | scrub | n/a | n/a | none | top bottom → bottom top |

---

## Part 8. Performance and accessibility rules

### 8.1 Performance

1. Animate **only** `transform`, `opacity` and `clip-path`. Never animate `width`, `height`, `top`, `left`, `margin`, `filter`, `blur` or `box-shadow`.
2. Never scale or blur a playing `<video>`. Move its wrapper only.
3. Pause videos and the carousel when they are off-screen (IntersectionObserver) and when the tab is hidden.
4. Reveal triggers use `once: true`, so they are created once and then removed.
5. After fonts load and after `window.load`, call `ScrollTrigger.refresh()` once, so trigger positions are measured with final layout. Give every image `width`/`height` or an aspect-ratio class, so nothing shifts later.
6. Hero/first-screen image: `loading="eager" fetchpriority="high"`. Every other image: `loading="lazy" decoding="async"`.
7. Image files: JPG or WebP, about 80% quality, under ~400KB each; hero video H.264 1080p, no audio, under ~8MB, with `-movflags +faststart`.
8. No pinned (sticky scroll-jacked) sections anywhere. The client found them "stuck". The landing page has none.
9. `backdrop-filter` only on the small "Next" card. Not on the nav, not on large panels.
10. One `requestAnimationFrame` loop at most (the carousel). One Lenis instance. Clean everything up on unmount.

### 8.2 Accessibility

1. **Contrast:** use the colour pairs in [4.1](#41-colour-tokens). Body text on paper is `--ink` (17.5:1) or `--ink-muted` (6.0:1). Text on photos always sits on a scrim.
2. **Focus:** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }`; on dark sections, over the hero and on the transparent nav the outline is white. Never remove outlines.
3. **Keyboard:** everything clickable is an `<a>` or `<button>`. The mobile menu closes on Escape and returns focus. Tabs move with arrow keys. FAQ uses native `<details>`.
4. **Split text:** when characters are split, the parent gets `aria-label` with the full text and the split spans get `aria-hidden="true"`, so screen readers read the word, not letters.
5. **Carousel:** `aria-roledescription="carousel"`, titles in an `aria-live="polite"` region, inactive titles `aria-hidden="true"`, a pause button that works (WCAG 2.2.2), progress segments are buttons with `aria-label`s.
6. **Images:** meaningful `alt` text. Decorative copies (the hover image, the next-card thumbnail) are inside `aria-hidden="true"` containers.
7. **Forms:** every input has a `<label for>`; errors use `aria-invalid` and an `aria-live="polite"` message; notices use `role="status"`; inputs are at least 16px text (prevents iOS zoom).
8. **Touch targets:** at least 44×44px (`.hero-ctrl` and `.nav-menu` are 46px; buttons 50–52px tall).
9. **Reduced motion:** with `prefers-reduced-motion: reduce`, nothing animates and the carousel does not auto-advance:

```css
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
```

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce || !gsap || !ScrollTrigger) return; // skip every GSAP effect and Lenis
```

10. **Content visible without JS:** never set `opacity: 0` or `visibility: hidden` on content in CSS waiting for JavaScript. Hidden starting states are applied by GSAP `from()` at run time only.

---

## Part 9. Responsive rules

### 9.1 What every section must do at each width

| Width | Rules |
|---|---|
| ≥1025px | Full desktop layout. Chapters image-led. Desktop motion on (if fine pointer). |
| 901–1080px | Nav collapses to hamburger at ≤1080px. Otherwise desktop layout. |
| 761–900px | Cards 2 columns; story grid and contact grid stacked (contact stacks at ≤960); chapters stacked; hero side controls replaced by mobile progress bars. **No desktop motion** (<900px). |
| ≤760px | Mobile: `--gutter-x: 20px`, `--section-y: 64px`, mobile type sizes from 4.2, everything one column except the image pair and facts rows, rows list shows images, tabs scroll sideways. |
| ≤600px | Cards 1 column (first 4 + "view all" when a view-all page exists); form 1 column; nav CTA hidden. |
| ≤430px | Main buttons full width; guide card thumbnail 88px. |
| ≤375px | `--gutter-x: 16px`; smaller brand, chapter word 52px, page title 36px; footer one column. |
| ≤340px | 320px phones: page title 32px, headings 30px, chapter word 46px, row titles 20px. |

### 9.2 Mobile rules in plain words

1. One column. Side padding 20px (16px at ≤375px). Nothing touches the screen edge except full-bleed images in dark bands.
2. Text sizes never go below: body 16px, labels 13px, inputs 16px.
3. Images keep their aspect ratio and fill the column width.
4. Buttons that end a block (form submit, view all, main action under text) are full width at ≤430px.
5. Horizontal scrolling is allowed **only** inside `.tabs` (with the right-edge fade). The page itself must never scroll sideways.
6. Hide placeholder labels on tiny thumbnails (`.story-item .ph .slot`, `.guide .ph .slot` at ≤900px); they can't be read.
7. Use `text-wrap: pretty` on card titles, leads and list titles so lines don't break into narrow stacks.
8. Every flex or grid child that contains text gets `min-width: 0` (or the grid uses `minmax(0, 1fr)`).

### 9.3 How to test (mandatory widths)

Test every redesigned page at **320, 375, 390, 430, 768, 1024, 1440 and 1920px**. At each width check:

- `document.documentElement.scrollWidth === document.documentElement.clientWidth` (no horizontal scroll).
- No element's right edge goes past the viewport (except inside `.tabs` and the `.water` watermark, which is clipped by the footer's `overflow: hidden`).
- No text overlaps another text or a control.
- Headings are not cut mid-word.
- Images are not squashed (they keep their ratio).

A Playwright script that does this is in [16.4](#164-automated-check-script).

---

## Part 10. Implementing in React / Next.js

### 10.1 Where things go

| Thing | Where (adapt names to the repo) | Rule |
|---|---|---|
| Tokens + all landing classes | The global stylesheet imported in `app/layout.tsx` (App Router) or `pages/_app.tsx` (Pages Router) | One global stylesheet. Do not duplicate the tokens in other files. |
| New shared classes from this file (`.page-hero`, `.paper-hero`, `.page-title`, `.paper-title`, `.prose`, `.rows-faq`, `.cards-all`) | Append to the same global stylesheet, under a comment `/* ---------- inner pages ---------- */` | Only values from Part 4. |
| Shared components | `components/site/` (for example `SiteNav.tsx`, `SiteFooter.tsx`, `Media.tsx`, `Button.tsx`, `TextLink.tsx`, `SectionHead.tsx`, `PageHero.tsx`) | If the repo already has a `components/` convention, follow it. |
| Motion hook | `components/site/useCKMotion.ts` (or `.js`) | Client-only. |
| Images | `public/assets/images/…` | Keep existing paths for images already used. |

**Tailwind warning:** if the project uses Tailwind, its "preflight" reset changes `h1`–`h6`, `img`, `button` and `input` styles. The landing classes set their own values, but check that headings, buttons and inputs look the same as on the landing page. If they don't, the fix is to make sure the global stylesheet loads **after** Tailwind's base layer, or wrap the landing rules in `@layer components`. Never rewrite the components into Tailwind utility classes.

### 10.2 Loading GSAP, ScrollTrigger and Lenis

Use whichever the landing page in the repo already uses.

**Option A: npm (preferred in Next.js)**

```bash
npm install gsap@3.12.5 lenis@1.1.13
```

```tsx
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
```

**Option B: CDN, as in the reference build** (in `app/layout.tsx`):

```tsx
import Script from 'next/script';
// …inside <body>, after {children}:
<Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="afterInteractive" />
<Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" strategy="afterInteractive" />
<Script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" strategy="afterInteractive" />
```

Then read `window.gsap`, `window.ScrollTrigger`, `window.Lenis` inside effects, and wait until they exist.

### 10.3 Shared components (React)

All components use the **exact class names** from Part 6. `'use client'` is only needed where there is state or effects.

```tsx
// components/site/Button.tsx
import Link from 'next/link';
type Props = { href?: string; variant?: 'ink' | 'white' | 'line'; children: React.ReactNode;
               type?: 'button' | 'submit'; className?: string; onClick?: () => void; disabled?: boolean; reveal?: boolean };
export function Button({ href, variant = 'ink', children, type = 'button', className = '', onClick, disabled, reveal }: Props) {
  const cls = `btn btn-${variant} ${className}`.trim();
  const inner = (<><span>{children}</span><span className="arrow" aria-hidden="true">→</span></>);
  const r = reveal ? { 'data-reveal': '' } : {};
  return href
    ? <Link className={cls} href={href} {...r}>{inner}</Link>
    : <button className={cls} type={type} onClick={onClick} disabled={disabled} {...r}>{inner}</button>;
}
```

```tsx
// components/site/TextLink.tsx
import Link from 'next/link';
export function TextLink({ href, children, arrow = '→' }: { href: string; children: React.ReactNode; arrow?: '→' | '↓' }) {
  return <Link className="tlink" href={href}><span>{children}</span><span className="arrow" aria-hidden="true">{arrow}</span></Link>;
}
```

```tsx
// components/site/Media.tsx: the ONLY way to render an image
type Ratio = '1x1' | '4x5' | '3x2' | '16x9' | '21x9' | null;
type Scene = 'backwater' | 'ghats' | 'forest' | 'coast' | 'culture' | 'temple' | 'tea' | 'falls' | 'dusk';
type Props = { ratio?: Ratio; scene: Scene; src?: string; alt?: string; width?: number; height?: number;
               slot: string; slotMeta?: string; eager?: boolean; inner?: number; revealImg?: boolean; className?: string;
               video?: { src: string; poster: string } };
export function Media({ ratio = '3x2', scene, src, alt = '', width, height, slot, slotMeta, eager, inner, revealImg, className = '', video }: Props) {
  return (
    <div className={`ph ${ratio ? `r-${ratio}` : ''} ${className}`.trim()} {...(revealImg ? { 'data-reveal-img': '' } : {})}>
      <div className={`bg s-${scene}`} {...(inner ? { 'data-inner': String(inner) } : {})}>
        {video
          ? <video src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="auto" />
          : src && <img src={src} alt={alt} width={width} height={height}
                        loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchPriority: 'high' as const } : {})} />}
      </div>
      <span className="slot">{slot}{slotMeta && <small>{slotMeta}</small>}</span>
    </div>
  );
}
```

```tsx
// components/site/SectionHead.tsx
import { TextLink } from './TextLink';
export function SectionHead({ id, title, link, lead }: { id: string; title: string; link?: { href: string; label: string }; lead?: string }) {
  return (
    <div className="head-row">
      <h2 className="h-section" id={id} data-split="">{title}</h2>
      {link && <TextLink href={link.href}>{link.label}</TextLink>}
      {lead && <p className="lead" data-reveal="">{lead}</p>}
    </div>
  );
}
```

```tsx
// components/site/PageHero.tsx: inner page openers (6.4.2 dark / 6.4.3 paper)
import { TextLink } from './TextLink';
import { Media } from './Media';
export function PageHero({ variant = 'dark', kicker, title, lead, action, media }: {
  variant?: 'dark' | 'paper'; kicker?: string; title: string; lead?: string;
  action?: { href: string; label: string }; media?: React.ComponentProps<typeof Media> }) {
  if (variant === 'paper') return (
    <section className="section paper-hero" aria-labelledby="pageH">
      <div className="wrap">
        {kicker && <span className="label">{kicker}</span>}
        <h1 className="paper-title" id="pageH" data-split="">{title}</h1>
        {lead && <p className="lead" data-reveal="">{lead}</p>}
        {action && <TextLink href={action.href}>{action.label}</TextLink>}
      </div>
    </section>
  );
  return (
    <section className="page-hero" aria-labelledby="pageH">
      {media && <Media {...media} ratio={null} eager inner={6} />}
      <div className="wrap page-hero-in">
        {kicker && <span className="kicker">{kicker}</span>}
        <h1 className="page-title" id="pageH" data-chars="">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {action && <TextLink href={action.href}>{action.label}</TextLink>}
      </div>
    </section>
  );
}
```

```tsx
// components/site/SiteNav.tsx
'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
const LINKS = [ { href: '/#destinations', label: 'Places' }, { href: '/#nature', label: 'Our vision' },
                { href: '/#experiences', label: 'Our values' }, { href: '/#stories', label: 'Journeys' } ];
// overDarkHero = true when the page starts with .hero or .page-hero
export function SiteNav({ overDarkHero }: { overDarkHero: boolean }) {
  const [solid, setSolid] = useState(!overDarkHero);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!overDarkHero) { setSolid(true); return; }
    const hero = document.querySelector('.hero, .page-hero') as HTMLElement | null;
    const onScroll = () => setSolid(window.scrollY > (hero ? hero.offsetHeight - 80 : 40));
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overDarkHero]);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  return (<>
    <header className={`nav${solid ? ' solid' : ''}`} id="nav">
      <div className="wrap nav-in">
        <Link className="brand" href="/" aria-label="Chaitanya Keralam, home"><img src="/assets/logo.png" alt="" width={46} height={44} /><span>Chaitanya Keralam</span></Link>
        <nav aria-label="Primary" style={{ display: 'contents' }}>
          <ul className="nav-links">{LINKS.map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </nav>
        <div className="nav-end">
          <Link className="btn nav-cta" href="/#plan">Plan a visit</Link>
          <button ref={btn} className="nav-menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}><i /></button>
        </div>
      </div>
    </header>
    <div className="menu" id="menu" hidden={!open} onClick={e => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
      <ul>{LINKS.map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}<li><Link href="/#plan">Plan a visit</Link></li></ul>
      <p className="label">Perhaps the only paradise on earth! Come, stay a while.</p>
    </div>
  </>);
}
```

```tsx
// components/site/SiteFooter.tsx
import Link from 'next/link';
const COLS = [
  { title: 'Explore',  links: [['/#destinations', 'Places'], ['/#nature', 'Our vision'], ['/#experiences', 'Our values']] },
  { title: 'Journeys', links: [['/#stories', 'Ayurveda & rest'], ['/#stories', 'Family homestays'], ['/#stories', 'Youth & community'], ['/#plan', 'Plan a visit']] },
  { title: 'Follow',   links: [['#', 'Instagram'], ['#', 'YouTube'], ['#', 'Facebook']] },   // replace '#' with the real profile URLs
];
export function SiteFooter() {
  return (
    <footer className="dark foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link className="brand" href="/"><img src="/assets/logo.png" alt="" width={60} height={58} style={{ width: 60 }} /><span>Chaitanya Keralam</span></Link>
            <p className="foot-promise">Perhaps the only paradise on earth!<br />One with nature.<br />God&apos;s own country.</p>
            <p className="label">Eco-Spiritual Peace Tourism · Anbu · Unmai · Patru · Pagutharivu</p>
          </div>
          {COLS.map(c => (
            <div key={c.title}><h4>{c.title}</h4>
              <ul>{c.links.map(([href, label]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul></div>))}
        </div>
        <p className="water" id="water" aria-hidden="true">Keralam</p>
        <div className="legal"><span>© {new Date().getFullYear()} Chaitanya Keralam</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span></div>
      </div>
    </footer>
  );
}
```

> **If the repo already has a Nav and Footer** (for example the landing page renders them), **reuse those components** and only add the `overDarkHero` behaviour if it is missing. Do not create a second nav. Update `LINKS` to the repo's real routes if they exist.

### 10.4 The shared motion hook for inner pages

`main.js` (`window.CKLanding`) is built for the **home page** (it expects the hero carousel). Inner pages use this hook instead. It implements the same patterns, with the same values, driven by the same attributes.

```tsx
// components/site/useCKMotion.ts
'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function keep(el: HTMLElement, store: HTMLElement[]) {
  // Idempotent split: restore the original HTML before splitting again (React StrictMode runs effects twice)
  if (el.hasAttribute('data-ck-orig')) el.innerHTML = el.getAttribute('data-ck-orig')!;
  else el.setAttribute('data-ck-orig', el.innerHTML);
  store.push(el);
}
function words(el: HTMLElement, store: HTMLElement[]) {
  keep(el, store);
  el.innerHTML = el.textContent!.trim().split(/\s+/)
    .map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(' ');
  return Array.from(el.querySelectorAll<HTMLElement>('.wi'));
}
function chars(el: HTMLElement, store: HTMLElement[]) {
  keep(el, store);
  const t = el.textContent!; el.setAttribute('aria-label', t);
  el.innerHTML = t.split(' ').map(w =>
    `<span style="display:inline-block;white-space:nowrap" aria-hidden="true">${
      w.split('').map(c => `<span class="c"><span class="ci">${c}</span></span>`).join('')}</span>`).join(' ');
  return Array.from(el.querySelectorAll<HTMLElement>('.ci'));
}

export function useCKMotion(rootRef: React.RefObject<HTMLElement>, opts: { heroIntro?: boolean } = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;                                   // static page, nothing hidden
    const split: HTMLElement[] = [];
    let lenis: Lenis | null = null;
    let mm: gsap.MatchMedia | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));

    const ctx = gsap.context(() => {
      if (opts.heroIntro) {                               // pages with a dark .page-hero
        // The nav is outside <main>, so select it from the document (context selectors only search inside root)
        gsap.from(document.querySelectorAll('.nav-in > *'), { y: -16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.2 });
        gsap.from('.page-hero .kicker, .page-hero .lead, .page-hero .tlink',
          { y: 20, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 1 });
      }
      $$('[data-chars]').forEach(el => {
        const inHero = !!el.closest('.page-hero');
        gsap.from(chars(el, split), inHero
          ? { yPercent: 120, duration: 1.4, ease: 'expo.out', stagger: 0.025, delay: 0.35 }
          : { yPercent: 120, duration: 1.2, ease: 'expo.out', stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
      });
      $$('[data-split]').forEach(el =>
        gsap.from(words(el, split), { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      $$('[data-statement]').forEach(el =>
        gsap.fromTo(words(el, split), { opacity: 0.18 }, { opacity: 1, stagger: 0.08, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top 75%', end: 'bottom 70%', scrub: true } }));
      $$('[data-reveal]').forEach(el =>
        gsap.from(el, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

      mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (pointer: fine)', () => {
        $$('.chapter-word[data-drift]').forEach(el => {
          const d = parseFloat(el.dataset.drift || '6');
          gsap.fromTo(el, { xPercent: -d }, { xPercent: d, ease: 'none',
            scrollTrigger: { trigger: el.closest('.chapter') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        $$('[data-parallax]').forEach(el => {
          const s = parseFloat(el.dataset.parallax || '0');
          gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', force3D: true,
            scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        $$('[data-inner]').forEach(el => {
          const s = parseFloat(el.dataset.inner || '0');
          gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', force3D: true,
            scrollTrigger: { trigger: el.closest('.ph') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        $$('[data-reveal-img], .chapter-media').forEach(el =>
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
        // The footer is outside <main>: use element references, not selector strings
        const water = document.querySelector('#water'), foot = document.querySelector('.foot');
        if (water && foot) gsap.fromTo(water, { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom', scrub: true } });
        // Smooth scroll: skip if the app already provides one global Lenis instance
        if (!(window as any).__ckLenis) {
          lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
          (window as any).__ckLenis = lenis;
          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
        }
        return () => { if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); (window as any).__ckLenis = null; lenis = null; } };
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      mm?.revert();                                       // removes desktop-only effects and Lenis
      ctx.revert();                                       // reverts every other tween and trigger
      split.forEach(el => { const o = el.getAttribute('data-ck-orig'); if (o !== null) { el.innerHTML = o; el.removeAttribute('data-ck-orig'); } el.removeAttribute('aria-label'); });
    };
  }, [rootRef, opts.heroIntro]);
}
```

**Using it on a page:**

```tsx
// app/destinations/page.tsx (App Router). The client part lives in a client component.
'use client';
import { useRef } from 'react';
import { useCKMotion } from '@/components/site/useCKMotion';
// Rename this file to the repo's convention, e.g. app/destinations/DestinationsView.tsx, and render it from page.tsx
export default function DestinationsView({ places }: { places: Place[] }) {
  const ref = useRef<HTMLElement>(null);
  useCKMotion(ref, { heroIntro: true });
  return (<main ref={ref} id="top"> … sections … </main>);
}
```

If the page fetches data on the server (a Server Component), keep the fetching in the server file exactly as it is and pass the data as props to a client "View" component that calls `useCKMotion`. **Never** move server data fetching into the client to make animation easier.

### 10.5 Page shell (every page)

```tsx
<SiteNav overDarkHero={/* true if the first section is a dark page-hero */} />
<main ref={ref} id="top">
  {/* sections */}
</main>
<SiteFooter />
```

---

## Part 11. The page redesign procedure (follow exactly)

Do these steps **in order**. Do not skip a step. Write down the outputs of steps 1, 2 and 4 in your working notes (or in the PR description) because the checklist in Part 16 asks for them.

### Step 1. Inspect the page and state its purpose

1. Open the page's route file(s) and every component it renders. Follow imports until you reach leaf components.
2. Write one sentence: **"This page exists so that a visitor can ____."** Examples: "…choose a destination", "…read one story", "…send an enquiry", "…read the privacy policy".
3. Decide the page's **primary action** (the one thing the visitor should do) and its **page type** from [Part 12](#part-12-page-type-layout-recipes).

### Step 2. Make a complete inventory (nothing may be lost)

Create a table like this and fill **every** row. If you are unsure whether something is functional, assume it is and keep it.

| # | Item | Type | Source (file:line) | Must keep? | New location |
|---|---|---|---|---|---|
| 1 | "Our story" heading | text | about/page.tsx:12 | yes | Paper hero title |
| 2 | Team members list (from `getTeam()`) | data + map | about/page.tsx:40 | yes | Card grid |
| 3 | Newsletter form → `/api/subscribe` | form + API | components/Newsletter.tsx | yes | Paper band before footer |
| 4 | `<Head>` title + meta description | SEO | about/page.tsx:5 | yes | unchanged |
| 5 | `trackEvent('cta_click')` on CTA | analytics | about/page.tsx:77 | yes | on the new button's onClick |

Item types to look for: text, headings, images, videos, lists, data fetching (`fetch`, `getServerSideProps`, `getStaticProps`, server components, `useSWR`, `useQuery`), forms, inputs, validation, submit handlers, API routes, links and route params, query strings, filters, sorting, pagination, search, modals, tabs, accordions, carousels, maps, embeds, auth checks, redirects, loading states, empty states, error states, analytics, SEO/meta, JSON-LD, i18n strings, feature flags, cookies/consent, accessibility attributes.

### Step 3. Re-read the design system

Before writing code, re-read Parts 3, 4, 6 and 7 of this file. Open the landing page in a browser at 1440px and 390px and look at it.

### Step 4. Map content to components

For each inventory row, choose the component. Use this table; do not invent new components.

| If the existing content is… | Use this component |
|---|---|
| Page title + intro (with a strong photo) | Dark `PageHero` (6.4.2) |
| Page title + intro (utility page, form, text) | Paper `PageHero` (6.4.3) |
| A single big idea / quote / mission line | Statement (6.16) |
| A key theme with a photo (max 3 per page) | Chapter (6.16) |
| A grid of items with images (places, team, packages, gallery) | Card grid (6.11) |
| A list of 3 articles/items with images | Stories list (6.12) |
| A list of 4–8 named items (values, steps, services) | Rows list (6.10) |
| Questions and answers | Rows FAQ variant (6.10) |
| Text + images about one topic | Story split (6.9) |
| Numbers/statistics (real ones only) | Facts (inside 6.9) |
| Long text (article, policy, description) | Prose (6.17) |
| A file download | Guide card (6.15) |
| A form | Form fields (6.14), optionally with tabs (6.13) and the contact grid layout |
| Filters / categories | Tabs (6.13) |
| The final call to action | Banner (6.16) or a paper section with `btn-ink` |
| Breadcrumbs | One line of `.label` text with `/` separators, above the page title |
| Pagination | `btn-line` "Previous" / "Next" buttons in a `head-row`-style flex row |
| Map / video / embed | Inside a `.ph r-16x9` (embeds fill the `.bg` with `width:100%;height:100%;border:0`) |
| Empty state | `.lead` sentence + one `btn-line` |
| Error / success message | `.form-note` panel |
| Loading state | Keep the existing loader logic; show a `.ph` placeholder with the matching scene class while loading. No spinners. |

### Step 5. Choose the layout

1. Find the page type in [Part 12](#part-12-page-type-layout-recipes) and copy its section order.
2. Check the rhythm rule (3.1): no more than 3 paper sections in a row, no two dark bands touching (except a statement right after a hero), dark footer last.
3. If the page's content does not fit the recipe, add or remove sections from the recipe **without** breaking the rhythm rule. Never remove inventory items to fit a recipe.

### Step 6. Build with shared tokens and components

1. Use the shared components from 10.3 (or the repo's existing equivalents).
2. Each section uses the skeleton from 5.1.
3. Copy classes exactly. Do not write new CSS for something a class already does.
4. If you truly need new CSS (for example a map embed size), write it only with values from Part 4 and put it in the global stylesheet under `/* ---------- inner pages ---------- */` with a comment saying which page needs it.

### Step 7. Apply typography, colour, spacing

Check every text element against the type table in 4.2 and every colour against 4.1. Specifically:

- One `<h1>` per page. Section headings `<h2 class="h-section">` (or `.paper-title` / `.page-title` for the h1).
- Muted text uses `--ink-muted` on paper and `--on-muted` on dark. Never grey hex codes like `#666`.
- Spacing comes only from `.section`, `.wrap`, the component gaps, and the values in 4.3.

### Step 8. Add animations

Add attributes (7.0) following these defaults:

| Element | Attribute |
|---|---|
| Page title in dark hero | `data-chars` (runs on load) |
| Page title in paper hero | `data-split` |
| Every section `<h2 class="h-section">` | `data-split` |
| Leads, buttons below text, facts, form wrapper, each card `<li>`, each story item | `data-reveal` |
| Images in story splits, chapter insets | `data-reveal-img` + `data-inner="5"` on the `.bg` |
| Chapter images | (automatic via `.chapter-media`) + `data-inner="7"` on the `.bg` |
| Banner and hero background images | `data-inner="8"` (banner) / `data-inner="6"` (page hero) |
| Statement paragraph | `data-statement` |
| Chapter word | `data-drift="-6"` (image right) or `"6"` (image left) |

Then call `useCKMotion(ref, { heroIntro: <true if dark page-hero> })` once in the page's client component.

### Step 9. Make it responsive

Use only the component classes (they contain their responsive rules). Then walk through 9.1 and 9.2 for your page. Add a responsive rule only if your page has a new element, and only at the existing breakpoints (4.5).

### Step 10. Test and fix

Run the checks in [Part 16](#part-16-execution-checklist), including the automated script in 16.4. Fix every failure. Then re-run. Only when every box is ticked is the page done.

---

## Part 12. Page-type layout recipes

Each recipe lists sections top to bottom. **(D)** = dark band, **(P)** = paper band. Components refer to Part 6. Adapt the content; keep the rhythm.

### 12.1 About / Our vision

1. (D) Dark page hero: kicker "About", title (e.g. "Eco-Spiritual Peace Tourism"), lead, link to the values.
2. (D) Statement: one sentence of the mission (`data-statement`).
3. (P) Story split: label "Our story", heading, lead, facts (only real numbers), two images.
4. (P) Rows list: the four values Anbu, Unmai, Patru, Pagutharivu (or the page's own list).
5. (D) Chapter `ch-2`: one theme (for example "Youth" or "Nature") with big image.
6. (P) Card grid: team or partners (image `r-4x5`, label = role, title = name). Keep all members.
7. (D) Banner CTA → enquiry.
8. Footer.

### 12.2 Destinations listing

1. (D) Dark page hero with a landscape photo: "Places that stay with you".
2. (P) Tabs as filters (Backwaters, Hills, Forests, Coast, Heritage…) wired to the **existing** filter logic, then the card grid with `cards-all` (show every item on mobile too).
3. (P) Pagination row if the page has pagination.
4. (D) Chapter `ch-1` featuring one highlighted destination.
5. (P) Stories list: related journeys/articles.
6. (D) Banner CTA.
7. Footer.

### 12.3 Destination detail

1. (D) Dark page hero: kicker = region or category, title = place name, lead = one-line description, link "Plan a visit".
2. (P) Story split: "About [place]" heading, lead, facts (real data only: best season, distance, altitude…), two images.
3. (P) Prose: the full description, if long.
4. (P) Rows list: things to do / itinerary days (numbered), images shown on mobile.
5. (D) Chapter (`ch-2` or `ch-3`) with the best photo and a short line.
6. (P) Card grid: gallery (3 or 6 images, `r-1x1`, label = caption). Or a 16:9 map embed in a `.ph r-16x9`.
7. (P) Stories list: "Nearby places" (3 items).
8. (P) Contact-style form if the page has an enquiry, else (D) Banner CTA.
9. Footer.

### 12.4 Experiences / Journeys listing

1. (D) Dark page hero.
2. (P) Rows list of experiences (with hover image on desktop).
3. (D) Statement.
4. (P) Card grid of packages (each card: image, label = duration/category, title = name + one line). Prices or dates stay as the existing data shows them, in a `.label` under the title.
5. (D) Banner CTA.
6. Footer.

### 12.5 Stories / blog listing

1. (P) Paper page hero ("Stories") with tabs for categories if the page has categories.
2. (P) First (featured) story: story split layout (image big, title, lead, `tlink` "Read the story").
3. (P) Stories list or card grid for the rest (keep existing pagination / infinite scroll logic).
4. (D) Statement or Banner.
5. Footer.

### 12.6 Story / article detail

1. (D) Dark page hero with the article's lead image; kicker = category · date; title = article title; lead = standfirst.
   (If the article has no lead image: paper page hero.)
2. (P) Prose article (`.prose`, max 68ch). Keep all rich content (images inside `figure` + `.ph`, quotes, lists, embeds).
3. (P) Author/meta row as `.label` lines, hairline above (`border-top: 1px solid var(--line)`).
4. (P) Stories list: related articles.
5. (D) Banner CTA.
6. Footer.

### 12.7 Contact / Plan a visit / Booking

1. (P) Contact grid directly (the paper hero is **inside** the left column, like the landing form): left = `.paper-title`, intro paragraph, guide card, contact details as `.label` + text lines (phone and email as selectable text); right = tabs + form.
   Keep every existing field, name, validation and submit handler.
2. (P) Rows FAQ variant: common questions (if the page has them).
3. (D) Chapter or banner with a calm image ("God's own country awaits").
4. Footer.

### 12.8 FAQ / Help

1. (P) Paper page hero.
2. (P) Tabs for FAQ categories (if any) + rows FAQ variant.
3. (P) A short "Still have questions?" line + `btn-ink` to contact.
4. Footer.

### 12.9 Legal pages (Privacy, Terms, Cookies)

1. (P) Paper page hero: title + `.label` "Last updated [date]".
2. (P) Prose with all the legal text, unchanged.
3. Footer. (No banner, no animation except `data-split` on the title and `data-reveal` on nothing else.)

### 12.10 Gallery

1. (D) Dark page hero.
2. (P) Tabs as category filters (existing logic) + card grid of `r-1x1` images with labels. Lightbox, if it exists, stays.
3. (D) Banner CTA.
4. Footer.

### 12.11 404 / error / empty pages

1. (D) Full-height dark band (`.page-hero` with a calm image or `--night`), kicker "Page not found", title "This path isn't on the map.", `btn-white` "Back to home", `tlink` "Plan a visit".
2. Footer.

### 12.12 Account / dashboard / admin-like pages (if any exist)

Use paper sections only: paper page hero, then `.rows`-style lists, `.facts` for real counts, forms with `.field`, tables inside an `overflow-x: auto` wrapper with 1px `--line` row borders, 15px text, `--ink-muted` header row. No chapters, no banner, no parallax.

---

## Part 13. Worked before → after examples

### 13.1 A generic "About" page

**Before (typical generic markup):**

```tsx
<div className="container mx-auto py-10">
  <h1 className="text-4xl font-bold text-green-700 text-center">About Us</h1>
  <p className="text-center mt-4 text-gray-600">We are a tourism company in Kerala. We believe in eco-friendly, peaceful travel …(120 words)…</p>
  <div className="grid grid-cols-3 gap-6 mt-10">
    {team.map(m => (
      <div key={m.id} className="rounded-xl shadow-lg p-4 bg-white text-center">
        <img src={m.photo} className="rounded-full w-32 h-32 mx-auto" />
        <h3 className="font-semibold mt-2">{m.name}</h3><p className="text-sm text-gray-500">{m.role}</p>
      </div>))}
  </div>
  <button onClick={() => router.push('/contact')} className="mt-10 bg-yellow-400 rounded-full px-6 py-3">Contact Us</button>
</div>
```

Problems: centred text, bold green title, rounded shadowed cards, circular photos, yellow pill button, one long paragraph, no images in the story, no rhythm.

**After:**

```tsx
'use client';
import { useRef } from 'react';
import { useCKMotion } from '@/components/site/useCKMotion';
import { SiteNav } from '@/components/site/SiteNav';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageHero } from '@/components/site/PageHero';
import { Media } from '@/components/site/Media';
import { Button } from '@/components/site/Button';
import { SectionHead } from '@/components/site/SectionHead';
// `Member`, `team` and `trackEvent` come from the existing page: keep their original imports
export default function AboutView({ team }: { team: Member[] }) {
  const ref = useRef<HTMLElement>(null);
  useCKMotion(ref, { heroIntro: true });
  return (<>
    <SiteNav overDarkHero />
    <main ref={ref} id="top">
      <PageHero kicker="About" title="Eco-Spiritual Peace Tourism"
        lead="We are a tourism company in Kerala. We believe in eco-friendly, peaceful travel."
        action={{ href: '#story', label: 'Read our story' }}
        media={{ scene: 'ghats', src: '/assets/images/about-hero.jpg', alt: 'Misty hills of the Western Ghats', slot: '[Full-screen image — Western Ghats]' }} />

      <section className="dark statement"><div className="wrap">
        <span className="kicker">Chaitanya Keralam</span>
        <p data-statement="">Spirituality goes beyond religion. It is living in harmony with nature and with one another.</p>
      </div></section>

      <section className="section" id="story" aria-labelledby="storyH">
        <div className="wrap story-grid">
          <div className="story-text">
            <span className="label">Our story</span>
            <h2 className="h-section" id="storyH" data-split="">One with nature</h2>
            {/* the remaining ~100 words of the original paragraph, split into two short paragraphs: nothing deleted */}
            <p className="lead" data-reveal="">…first half of the original text…</p>
            <p className="lead" data-reveal="">…second half of the original text…</p>
            <Button href="/contact" reveal onClick={() => trackEvent('cta_click')}>Contact us</Button>
          </div>
          <div className="story-media">
            <Media ratio="4x5" scene="forest" slot="[Image — Forest path]" revealImg inner={5} />
            <Media ratio="1x1" scene="falls" slot="[Image — Rain on leaves]" revealImg inner={5} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="teamH" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead id="teamH" title="The people who welcome you" />
          <ul className="cards cards-all">
            {team.map(m => (
              <li key={m.id} data-reveal="">
                <div className="card">
                  <Media ratio="4x5" scene="culture" src={m.photo} alt={m.name} slot={`[Portrait — ${m.name}]`} />
                  <span className="label">{m.role}</span>
                  <h3>{m.name}</h3>
                </div>
              </li>))}
          </ul>
        </div>
      </section>

      <section className="banner" aria-labelledby="banH">
        <Media ratio={null} scene="backwater" inner={8} slot="[Full-screen image — Sunset over the backwaters]" />
        <div className="wrap banner-in">
          <h2 id="banH" data-chars="">God's own country awaits.</h2>
          <Button variant="white" href="/contact">Plan a journey for your family</Button>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>);
}
```

What was kept: all text (split into two leads, none deleted), every team member, the route to `/contact`, the analytics call. What changed: layout, components, type, colours, animation.

### 13.2 A generic contact form page

**Before:** a centred card with rounded inputs, floating labels, a blue "Submit" pill, using React Hook Form:

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 rounded-2xl shadow">
  <input {...register('name', { required: 'Name is required' })} placeholder="Name" className="rounded-lg border p-2 w-full" />
  {errors.name && <p className="text-red-500">{errors.name.message}</p>}
  <input {...register('email', { required: true, pattern: /\S+@\S+/ })} placeholder="Email" className="rounded-lg border p-2 w-full mt-3" />
  <textarea {...register('message')} className="rounded-lg border p-2 w-full mt-3" />
  <button disabled={isSubmitting} className="bg-blue-600 text-white rounded-full px-4 py-2 mt-4">Submit</button>
  {isSubmitSuccessful && <p>Thanks!</p>}
</form>
```

**After (same hook, same handlers, same validation; only markup and classes change):**

```tsx
<section className="section paper-hero" id="plan" aria-labelledby="planH" style={{ paddingBottom: 'var(--section-y)' }}>
  <div className="wrap contact-grid">
    <div className="contact-intro">
      <h1 className="paper-title" id="planH" data-split="">Let us plan your Kerala journey</h1>
      <p data-reveal="">Tell us what you have in mind. We will plan an unhurried journey with you.</p>
    </div>
    <div data-reveal="">
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={`field${errors.name ? ' bad' : ''}`}>
          <label htmlFor="f-name">Name*</label>
          <input id="f-name" placeholder="Enter your name" aria-invalid={!!errors.name}
                 {...register('name', { required: 'Name is required' })} />
          <span className="err" aria-live="polite">{errors.name?.message}</span>
        </div>
        <div className={`field${errors.email ? ' bad' : ''}`}>
          <label htmlFor="f-email">Email*</label>
          <input id="f-email" type="email" placeholder="Enter email" aria-invalid={!!errors.email}
                 {...register('email', { required: true, pattern: /\S+@\S+/ })} />
          <span className="err" aria-live="polite">{errors.email && 'Enter a valid email, like name@example.com.'}</span>
        </div>
        <div className="field full">
          <label htmlFor="f-msg">Tell us more</label>
          <textarea id="f-msg" {...register('message')} />
        </div>
        <div className="form-foot">
          <span />
          <Button type="submit" disabled={isSubmitting}>Send enquiry</Button>
        </div>
        {isSubmitSuccessful && <p className="form-note" role="status">Thanks!</p>}
      </form>
    </div>
  </div>
</section>
```

The `register()` calls, validation rules, `handleSubmit(onSubmit)`, `isSubmitting` and the success message are unchanged. The original "Name is required" message is kept; for email, the original had no message, so the landing page's message is used.

### 13.3 A data-driven listing page with filters and pagination

Keep the data logic; replace only the presentation:

```tsx
const [category, setCategory] = useState(initialCategory);          // existing state: keep
const { data, page, setPage, totalPages } = usePlaces({ category }); // existing hook: keep
…
<section className="section" aria-labelledby="listH">
  <div className="wrap">
    <SectionHead id="listH" title="All places" />
    <div className="tabs" role="tablist" aria-label="Filter places">
      {CATEGORIES.map(c => (
        <button key={c} className="tab" type="button" role="tab" aria-selected={category === c}
                onClick={() => setCategory(c)}>{c}</button>))}
    </div>
    {data.length === 0
      ? <p className="lead">No places in this category yet.</p>   /* existing empty state text, restyled */
      : <ul className="cards cards-all">{data.map(p => (
          <li key={p.slug} data-reveal=""><Link className="card" href={`/places/${p.slug}`}>
            <Media ratio="1x1" scene="backwater" src={p.image} alt={p.name} slot={`[Image — ${p.name}]`} />
            <span className="label">{p.category}</span><h3>{p.tagline ?? p.name}</h3>
          </Link></li>))}</ul>}
    {totalPages > 1 && (
      <div className="head-row" style={{ marginTop: 48, marginBottom: 0 }}>
        <Button variant="line" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <span className="label">Page {page} of {totalPages}</span>
        <Button variant="line" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
      </div>)}
  </div>
</section>
```

After filtering changes the list, call `ScrollTrigger.refresh()` (new items change the page height).

---

## Part 14. Copy and content rules

1. **Do not change the meaning of existing copy.** You may shorten a heading only if the full text stays elsewhere on the page.
2. Brand voice (from the landing page): warm, unhurried, family-centred, respectful of every faith, concrete Kerala images (houseboats, chai, sadya on a banana leaf, temple and church bells, the azaan, misty tea hills). Second person ("you"), sentence case, no exclamation marks (the one exception is the client-approved brand line "Perhaps the only paradise on earth!"), no emoji, no superlatives like "best ever".
3. Brand lines and values: always write them exactly: "Perhaps the only paradise on earth!" / "One with nature." / "God's own country." / "Eco-Spiritual Peace Tourism" / "Anbu · Love and compassion", "Unmai · Truth and integrity", "Patru · Commitment and devotion", "Pagutharivu · Rational thinking and discernment".
4. Never invent facts, numbers, testimonials, awards, prices, partners or dates. If a design slot needs content that doesn't exist, use a bracketed placeholder: `[Testimonial from a guest]`, `[Price]`.
5. Button labels: verb first, sentence case, 1–5 words.
6. Numbers in `.facts`: tabular numerals (already set), no units inside the `<b>` (units go in the label).
7. Use the separator `·` (middle dot with spaces) in kickers and meta lines, as the landing page does.

---

## Part 15. Consistency rules (do / do not)

| Do | Do not |
|---|---|
| Use `--paper`, `--ink`, `--night`, `--on` and the muted/line tokens | Use Tailwind colour classes (`text-green-700`, `bg-yellow-400`) or any hex not in Part 4 |
| Albert Sans 300/400/500 | Bold (600/700), italics for display, any other font |
| Square corners | `rounded-*`, pill buttons, circular photos |
| Images in `.ph` with a ratio class | Raw `<img>` with its own width/height styling |
| Labels under images | Text badges or chips on top of images in paper sections |
| One primary button per section | Two solid buttons side by side |
| `.tlink` for secondary actions | Underlined blue browser links |
| Hairlines (`--line`) to separate list items | Boxes with borders and shadows around list items |
| Left-aligned text | Centred paragraphs in paper sections |
| Reveal animations from Part 7 | New animation styles, bounce/elastic easing, rotation, scale-up pop-ins |
| Same nav and footer on every page | Page-specific navs, missing footer |
| Adapt the section order to the page's purpose | Copying the home page's hero carousel and chapters onto every page |
| Keep the existing functionality and data flow | Rewriting data fetching, removing filters or fields to simplify the layout |
| `minmax(0, 1fr)` columns and `min-width: 0` | Fixed pixel widths that overflow on 320px |
| Test at all 8 widths | Testing only at your monitor width |

---

## Part 16. Execution checklist

Copy this list into your notes for every page and tick each item. **A page is not done until every box is ticked.** If an item cannot be ticked, fix the page; if it truly does not apply, write "n/a" with a reason.

### 16.1 Before redesigning

- [ ] I did Step 0 (2.1): I found the repo's landing page code and global stylesheet and compared tokens with Appendix A. Differences noted: ____
- [ ] I wrote the page's purpose sentence and primary action (Step 1).
- [ ] I chose the page type from Part 12.
- [ ] I made the full inventory table (Step 2), including data fetching, forms, API calls, state, routes/links, SEO tags, analytics, loading/empty/error states.
- [ ] I mapped every inventory row to a component (Step 4). No row is unmapped.
- [ ] I checked whether shared Nav/Footer/Media/Button components already exist in the repo, and I will reuse them.
- [ ] I know how GSAP/ScrollTrigger/Lenis are loaded in the repo.

### 16.2 During the redesign

**Design system compliance**
- [ ] Every colour is a token from 4.1 (or one of the listed fixed literals). Search the diff for `#` and `rgb` to confirm.
- [ ] Only Albert Sans; only weights 300/400/500.
- [ ] Every text style matches a row of the type table (4.2).
- [ ] All radii are 0 except round icon controls (999px).
- [ ] Only the shadows in 4.7.
- [ ] Spacing comes from `.section`, `.wrap`, component classes and 4.3 values.
- [ ] One `<h1>`; section headings are `<h2>`; card/list titles `<h3>`.

**Component reuse**
- [ ] Every section uses the 5.1 skeleton.
- [ ] Every image is inside a `.ph` with a ratio class (or full-bleed slot) and the `<img>` is inside `.bg`.
- [ ] Buttons are `.btn-ink` / `.btn-white` / `.btn-line`; secondary actions are `.tlink`.
- [ ] No new card, button or heading style was invented.

**Functionality preservation**
- [ ] Every inventory item exists in the new page (check the table row by row).
- [ ] Every form keeps its field `name`s, validation, submit handler, success and error behaviour.
- [ ] Every link points to the same destination as before (or to the correct real route).
- [ ] Data fetching code is unchanged (server/client boundaries unchanged).
- [ ] Analytics calls and SEO/meta tags are unchanged.
- [ ] Loading, empty and error states still appear when they should.

**Layout and rhythm**
- [ ] The section order follows the Part 12 recipe (adapted as needed).
- [ ] No more than 3 paper sections in a row; no two dark bands touching (except statement after hero); footer last.
- [ ] Nav state is correct: transparent over a dark hero then solid, or solid from the start.

**Animation**
- [ ] Attributes added as per the Step 8 table.
- [ ] `useCKMotion` (or the landing `main.js` on the home page) is called exactly once per page.
- [ ] No element has `data-reveal` inside another `data-reveal`.
- [ ] Only `transform`, `opacity`, `clip-path` are animated.
- [ ] No pinned sections; no animation on videos.

### 16.3 After the redesign (verification)

**Responsive**
- [ ] Checked at 320, 375, 390, 430, 768, 1024, 1440, 1920px.
- [ ] No horizontal scroll at any width (`scrollWidth === clientWidth`).
- [ ] No overlapping or clipped text; headings not cut mid-word; images keep their ratio.
- [ ] Buttons full width at ≤430px where specified; tabs scroll sideways on mobile.

**Animation testing**
- [ ] Page load: nav and hero animate once (dark hero pages).
- [ ] Scrolling down: headings rise, blocks fade up, images reveal (desktop), parallax is subtle (desktop).
- [ ] Scrolling back up does not replay `once` reveals.
- [ ] Phone/tablet (<900px): no parallax, no smooth-scroll takeover, only fade-ups.
- [ ] With "reduce motion" on: everything is visible and static; nothing is stuck invisible.
- [ ] With JavaScript disabled: all content is visible.
- [ ] React StrictMode / hot reload: headings never show raw HTML like `class="w"`; animations don't double.
- [ ] Navigating away and back (client-side routing) leaves no leftover smooth-scroll or triggers (no console errors, no stuck scroll).

**Accessibility**
- [ ] Keyboard: every interactive element reachable with Tab, visible focus ring, menu closes with Escape, tabs work with arrow keys.
- [ ] All images have meaningful `alt` (or are decorative inside `aria-hidden`).
- [ ] Form inputs have labels; errors are announced (`aria-live`) and marked `aria-invalid`.
- [ ] Contrast pairs are from 4.1.

**Visual consistency**
- [ ] Side by side with the landing page at 1440px and 390px, the page looks like the same website: same nav, footer, type, colours, buttons, image treatment, spacing rhythm.
- [ ] No yellow/gold, no gradients on UI, no rounded corners, no shadows on cards.

**Code quality**
- [ ] No duplicated token definitions; new CSS is in the global stylesheet under the inner-pages comment with only Part 4 values.
- [ ] No inline styles except the documented ones (`padding-top: 0`, logo width, slot `top`).
- [ ] TypeScript/ESLint pass; the build passes (`next build`).
- [ ] No console errors or warnings in the browser.

**Final verification**
- [ ] I wrote a short report: files changed, components used, inventory table with "kept" status, placeholder image slots still needing photos, and any token differences found in Step 0.
- [ ] Screenshots attached: hero, one middle section, and the last section before the footer, at 390px and 1440px.

### 16.4 Automated check script

Run with the dev server running (`npm run dev`) and Playwright installed (`npm i -D playwright`, `npx playwright install chromium`). Save as `scripts/check-page.mjs` and run `node scripts/check-page.mjs /about`.

```js
import { chromium } from 'playwright';
const path = process.argv[2] || '/';
const base = process.env.BASE_URL || 'http://localhost:3000';
const widths = [320, 375, 390, 430, 768, 1024, 1440, 1920];
const browser = await chromium.launch();
let failed = false;
for (const w of widths) {
  for (const reduced of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // scroll through the page so every reveal runs
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const W = document.documentElement.clientWidth, over = [];
      document.querySelectorAll('body *').forEach(el => {
        if (el.closest('.tabs, .water, .hover-img, .menu')) return;
        const b = el.getBoundingClientRect();
        if (b.width && b.right > W + 1 && getComputedStyle(el).position !== 'fixed') over.push(el.tagName + '.' + String(el.className).slice(0, 40));
      });
      const raw = /class="w"|class="c"|translate\(/.test(document.body.innerText);
      const h1 = document.querySelectorAll('h1').length;
      const hidden = [...document.querySelectorAll('[data-reveal],[data-split],[data-chars]')]
        .filter(el => getComputedStyle(el).opacity === '0').length;
      return { scroll: document.documentElement.scrollWidth - W, over: over.slice(0, 5), raw, h1, hidden };
    });
    const bad = r.scroll > 0 || r.over.length || r.raw || r.h1 !== 1 || r.hidden || errors.length;
    if (bad) failed = true;
    console.log(`${w}px ${reduced ? 'reduced' : 'motion '} ${bad ? 'FAIL' : 'ok  '}`, JSON.stringify(r), errors.join(' | '));
    if (!reduced) await page.screenshot({ path: `check-${path.replace(/\W+/g, '_') || 'home'}-${w}.png`, fullPage: true });
    await ctx.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
```

Every line must print `ok`. Then open the screenshots and look at them: the script can't judge visual quality, only breakage.

---

## Part 17. Known problems and their fixes

These happened on the landing page. Avoid them on every page.

| Symptom | Cause | Fix |
|---|---|---|
| Headings show raw text like `class="w"> class="wi" style="translate: none…">Ways` | The split function ran twice (React StrictMode, hot reload, or the script loaded twice) and split already-split HTML | Use the idempotent `keep()` pattern (store `data-ck-orig`, restore before splitting, restore on cleanup), exactly as in `main.js` and `useCKMotion`. |
| Small white fragments of a previous big word stay visible | Glyphs taller than their clipping box; the old layer was never hidden | Keep the `.c` padding/margin values (0.12em top / 0.18em bottom) and never animate a word that sits behind another layer without hiding the old one. |
| Content shifted off-centre inside a grid | `.wrap` without `width: 100%` inside a grid/flex parent | Keep `width: 100%` on `.wrap`. |
| The mobile menu shows on page load | A `display` rule on `.menu` overrides the `hidden` attribute | Keep `[hidden] { display: none !important; }` in the global CSS. |
| Hamburger visible on desktop / layout too wide | `.nav-menu { display: none }` overridden by a later `display` rule | Keep the specific selectors from the stylesheet; test at 1440px. |
| Hero video shakes/shimmers; scrolling stutters | Scaling a playing video, heavy video file | Never scale/blur video; move only the wrapper; re-encode (1080p, CRF 24, `-movflags +faststart`); pause off-screen. |
| The first scroll feels stuck; pinned sections feel stuck | Triggers measured before fonts/images loaded; long pins; `scroll-behavior: smooth` fighting Lenis | No pins; `ScrollTrigger.refresh()` after fonts and load; images with fixed ratios; remove `scroll-behavior: smooth`; one Lenis instance with `lerp: 0.12`. |
| Text can't be selected in stacked layers | Invisible layers on top catch the mouse | Inactive layers get `visibility: hidden` / `pointer-events: none`. |
| Big empty areas around giant words | A small image next to a huge word | Use the image-led chapter layout (≥1025px) with an inset image; never place a small floating image alone in a large dark area. |
| Mobile layout cramped, narrow text columns | `text-wrap: balance` on paragraphs and card titles; desktop sizes on mobile | `text-wrap: pretty` on paragraphs/titles; use the ≤760px type sizes. |
| Gap between hero title and its link too large | Link aligned to the bottom of a tall side column | Align the link to the centre of row 2; put the side controls in a row (`display:flex`) on desktop only. |
| Styles look different inside Next.js | Tailwind preflight or CSS Modules changed headings/buttons; class names hashed | Global stylesheet, loaded after Tailwind base, class names unchanged. |

---

## Appendix A. Copy-paste token block

```css
:root {
  /* colour */
  --paper: #fbfaf7;
  --paper-2: #f2efe8;
  --ink: #111613;
  --ink-muted: #5a625d;
  --line: #dedad1;
  --line-strong: #8a8478;
  --night: #070d0b;
  --forest: #0b3d24; --teal: #0e4f4f; --ocean: #0b3a4f; --laterite: #6e2a16;
  --on: #ffffff; --on-muted: rgba(255,255,255,0.78); --on-line: rgba(255,255,255,0.4); --on-faint: rgba(255,255,255,0.1);
  --accent: #0b3d24;
  --error: #a3261b;
  /* type */
  --font: "Albert Sans", "Calibre", "Helvetica Neue", Arial, sans-serif;
  /* layout */
  --gutter-x: clamp(20px, 4.5vw, 96px);
  --section-y: clamp(64px, 8vw, 140px);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  color-scheme: light;
}
@media (max-width: 1024px) { :root { --section-y: clamp(64px, 9vw, 104px); } }
@media (max-width: 760px)  { :root { --gutter-x: 20px; --section-y: 64px; } }
@media (max-width: 375px)  { :root { --gutter-x: 16px; } }

*, *::before, *::after { box-sizing: border-box; }
html { background: var(--paper); -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--paper); color: var(--ink); font: 400 16px/1.6 var(--font); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
[hidden] { display: none !important; }
img, video { max-width: 100%; display: block; }
a { color: inherit; }
h1, h2, h3, h4, p, figure { margin: 0; }
h1, h2, h3 { font-weight: 400; text-wrap: balance; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.dark :focus-visible, .hero :focus-visible, .page-hero :focus-visible, .nav:not(.solid) :focus-visible { outline-color: var(--on); }

/* Placeholder scene gradients */
.s-backwater { background: radial-gradient(60% 40% at 50% 38%, rgba(255,255,255,0.16), transparent 70%), linear-gradient(180deg, #123a40 0%, #2f6461 34%, #6f8d86 45%, #164a4a 47%, #0b3034 72%, #061a1d 100%); }
.s-ghats { background: radial-gradient(50% 30% at 30% 30%, rgba(255,255,255,0.14), transparent 70%), linear-gradient(175deg, #1b3a33 0%, #3d6253 30%, #1d4632 46%, #0f3322 62%, #0a2a1b 100%); }
.s-forest { background: radial-gradient(30% 60% at 62% 10%, rgba(255,255,255,0.18), transparent 70%), linear-gradient(180deg, #0f3a26 0%, #0b2c1d 50%, #061a11 100%); }
.s-coast { background: radial-gradient(60% 30% at 70% 42%, rgba(255,255,255,0.15), transparent 70%), linear-gradient(180deg, #16405a 0%, #3f6f84 38%, #7f8f86 46%, #0e4a5c 48%, #0b3a4f 70%, #4a3a2c 88%, #2c2018 100%); }
.s-culture { background: radial-gradient(40% 50% at 40% 40%, rgba(255,200,170,0.16), transparent 70%), linear-gradient(160deg, #5a2412 0%, #3a160b 55%, #1d0b06 100%); }
.s-temple { background: radial-gradient(35% 45% at 50% 30%, rgba(255,255,255,0.14), transparent 70%), linear-gradient(180deg, #0e4f4f 0%, #0a3838 55%, #061f1f 100%); }
.s-tea { background: repeating-linear-gradient(170deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 26px), linear-gradient(180deg, #3d6253 0%, #1f5034 40%, #0b3d24 100%); }
.s-falls { background: linear-gradient(90deg, transparent 44%, rgba(255,255,255,0.22) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.22) 52%, transparent 56%), linear-gradient(180deg, #1f4436 0%, #0f3322 60%, #082016 100%); }
.s-dusk { background: radial-gradient(70% 40% at 50% 46%, rgba(255,180,150,0.18), transparent 70%), linear-gradient(180deg, #2b1a22 0%, #5c2a1c 36%, #6e2a16 46%, #1d2a2c 50%, #0b2027 100%); }
```

The complete component CSS is the landing page stylesheet (`css/style.css` in the reference build, or the repo's global stylesheet). The inner-page additions in this file are: `.page-hero`, `.page-hero-in`, `.page-title` (6.4.2), `.paper-hero`, `.paper-title` (6.4.3), `.rows-faq`, `.row-details`, `.row-answer` (6.10), `.cards-all` (6.11) and `.prose` (6.17). Add them once to the global stylesheet under `/* ---------- inner pages ---------- */`.

---

## Appendix B. Class name index

| Class | Section | One-line purpose |
|---|---|---|
| `.wrap` | 4.4 | Centred content container with gutters, max 1680px |
| `.section` | 5.1 | Paper band vertical padding |
| `.dark` | 3.1 | Night background, white text |
| `.label`, `.kicker`, `.lead` | 6.7 | Small muted line / uppercase line / intro paragraph |
| `.h-section` | 4.2 | Section heading |
| `.head-row` | 6.8 | Heading + link row |
| `.btn`, `.btn-ink`, `.btn-white`, `.btn-line`, `.nav-cta` | 6.1 | Buttons |
| `.tlink`, `.arrow` | 6.2 | Text link with arrow |
| `.ph`, `.bg`, `.slot`, `.r-*`, `.s-*` | 6.3 | Media slot, image layer, placeholder label, ratios, scenes |
| `.nav`, `.nav.solid`, `.nav-in`, `.brand`, `.nav-links`, `.nav-end`, `.nav-menu`, `.menu` | 6.5 | Navigation |
| `.hero`, `.slide`, `.hero-ui`, `.hero-grid`, `.hero-titles`, `.hero-title`, `.hero-sub`, `.hero-side`, `.next`, `.segs`, `.seg`, `.seg-hit`, `.hero-ctrl`, `.mobile-segs` | 6.4.1 | Home hero carousel (home only) |
| `.page-hero`, `.page-hero-in`, `.page-title` | 6.4.2 | Inner dark hero |
| `.paper-hero`, `.paper-title` | 6.4.3 | Inner paper hero |
| `.statement` | 6.16 | One big sentence on night |
| `.chapter`, `.ch-1/2/3`, `.chapter-stage`, `.chapter-no`, `.chapter-media`, `.chapter-word`, `.chapter-copy`, `.chapter-inset` | 6.16 | Giant word chapter |
| `.banner`, `.banner-in` | 6.16 | Final CTA on photo |
| `.cards`, `.card`, `.view-all`, `.cards-all` | 6.11 | Image card grid |
| `.story-grid`, `.story-text`, `.story-media`, `.facts`, `.fact` | 6.9 | Text + images + facts |
| `.rows`, `.row`, `.row-no`, `.row-t`, `.hover-img`, `.rows-faq` | 6.10 | Numbered list / FAQ |
| `.stories`, `.story-item` | 6.12 | Three-item story list |
| `.tabs`, `.tab` | 6.13 | Tabs and filters |
| `.contact-grid`, `.contact-intro`, `.form`, `.field`, `.full`, `.phone`, `.err`, `.count`, `.form-foot`, `.consent`, `.form-note` | 6.14 | Forms |
| `.guide`, `.guide-t` | 6.15 | Download card |
| `.prose` | 6.17 | Long text |
| `.foot`, `.foot-top`, `.foot-brand`, `.foot-promise`, `.water`, `.legal` | 6.6 | Footer |
| `.w`, `.wi`, `.c`, `.ci` | 7.1 | Split-text wrappers (created by JS; never write by hand) |
| `.sr-only` | n/a | Visually hidden text for screen readers |

*End of file. When in doubt: the landing page in the repository is the reference, this file explains it, and functionality always wins.*
