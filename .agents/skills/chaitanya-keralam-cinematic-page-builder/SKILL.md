---
name: chaitanya-keralam-cinematic-page-builder
description: >-
  Builds or restyles pages for Chaitanya Keralam with a dark, cinematic, image-first aesthetic,
  GSAP + Lenis scroll storytelling, and strict design token adherence. Use whenever creating
  new pages or restyling existing pages to match the Chaitanya Keralam film-like landing page.
---

# Chaitanya Keralam — Cinematic Page Builder

Use this skill whenever Joel asks for another page of the Chaitanya Keralam site, or to restyle an existing page to match the landing page. Every page must feel like the same film: dark, rich, wordless, image-first, with GSAP scroll storytelling.

---

## 1. Sources of Truth (Read First, Every Time)

1. **Design System**:
   - Reference: Design System artifact "Chaitanya Keralam" (`https://claude.ai/code/artifact/b37a04ae-f3f0-4bf7-b2a6-90e55df2f31b`)
   - Read `project/README.md` and `project/tokens.json`. Its tokens win over anything below if they differ.
2. **Landing Page**:
   - Reference: Artifact "Chaitanya Keralam" (`https://claude.ai/artifact/BUqHjmmuXfLbZmCegyuVp2`)
   - Read it and reuse its CSS, nav, footer, placeholder system, and animation script as the starting template. Copy, do not reinvent.
3. **Logo**:
   - Emblem PNG: Asset `558e7e838554f504767920a919e4f3e9` in the design system (Logos group).
   - Embed it in pages as a base64 `data:` URI (published pages cannot load other artifacts' assets).

---

## 2. Before Building

Ask **one** question round only for what is not already known:
- Which page to build / restyle
- Its 3–6 key points or sections
- Whether real photos/videos are attached

> **Rule:** Never ask about style — the style is fixed.

---

## 3. Non-Negotiable Style Rules

### Colour Palette
- **Ground & Atmosphere**: Dark and rich, few colours.
  - Ground: `#070d0b`
  - Brand hues: Forest `#0b3d24`, Teal `#0e4f4f`, Ocean `#0b3a4f`
  - Warm note: Laterite `#6e2a16`
  - Section grounds: `#0a2a1b` / `#0a3838` / `#08283a` / `#3a160b`
  - Ivory band (for image grids only): `#f7f4ef` (ink: `#111613`, muted: `#4d5550`)
- **Prohibitions**: No yellow, no gold, no bright accents, no gradients on UI elements.
- **Typography Contrast**: Text over media/grounds is white or `rgba(255, 255, 255, 0.8)`.

### Typography
- **Font Family**: Albert Sans `300` / `400` / `500` from Google Fonts (stand-in for Calibre; swap if Joel supplies Calibre files).
- **Scale & Weight**:
  - Display: Light `300`, huge, tight tracking (`-0.03em` to `-0.05em`).
  - Section titles: Regular `400` (e.g., "Case Studies").
  - Tile titles: `300` muted.
- **Prohibitions**: No serif, no italics.

### Content & Copy Density
- **Image-First**: $\ge$ two-thirds of every screen is image or visual media.
- **Micro-Copy**: Titles are 1–4 words. At most one short line under a title. Tiles = one-word label + one short title.
- **Prohibitions**: No paragraphs. No invented facts or statistics. Wrap any unknown copy in `[brackets]`.

### UI Shapes & Controls
- **Media**: Square-cornered, full-bleed where possible.
- **Controls**: Every button, tab, and control is a pill (`border-radius: 999px`).
- **CTAs**:
  - Primary CTA: White pill with dark label over media.
  - Secondary CTA: Text link with `→`.
- **Prohibitions**: No cards with borders or shadows. No emojis. No icons except UI glyphs (Material Icons SVG paths).

### Placeholders
Until real assets arrive, every image is a `.ph` container with:
- A scene gradient class (`s-backwater`, `s-ghats`, `s-forest`, `s-coast`, `s-culture`, `s-temple`, `s-tea`, `s-falls`, `s-dusk`)
- A dashed frame
- A label: `[SIZE IMAGE — subject]`
- A `<small>` tag indicating `pixels · ratio · mood`
- *Never use small image cards in place of big media. No SVG illustrations.*

---

## 4. Page Anatomy

Pick and vary from the sections below. **Never repeat the same layout twice in a row**:

1. **Hero (100svh)**:
   - Full-bleed video/image with top & bottom scrims
   - Transparent fixed nav
   - Eyebrow
   - 1–3 word title split into characters (`.c > .ci`)
   - White CTA + secondary link
   - Pause disc
   - Scroll cue
2. **Statement**:
   - One line; words light up on scroll (`opacity: 0.14 -> 1` scrub).
3. **Clip-Reveal Panorama**:
   - Pinned container; `clipPath` animates from `inset(22% 26%)` to `inset(0)` while inner image scales `1.45 -> 1`. Caption fades in.
4. **Pinned Key Points (Main Body)**:
   - One sticky stage with $N$ layers.
   - Each layer wipes in (`clipPath: inset(100% 0 0 0) -> inset(0)`).
   - Giant word characters rise, previous characters exit up.
   - Side HUD highlights current point and jumps on click.
   - Each point gets its own section ground colour.
5. **Giant Word + Floating Images**:
   - Two huge words sliding opposite directions (`xPercent` scrub) with photos at different `data-speed` parallax rates.
6. **Horizontal Gallery**:
   - Pinned track translated horizontally by `-(scrollWidth - clientWidth)`.
   - Cards with staggered heights; inner image parallax driven via `containerAnimation`.
7. **Split Screen**:
   - Half image (inner parallax) + short title + small square image.
8. **Overlapping Collage**:
   - 12-column grid; 3 images overlapping at varying speeds with title layered above.
9. **Ivory Image Grid**:
   - 3 square tiles (case-study style), 1/2/3 columns at `<560px` / `\ge 560px` / `\ge 900px`.
   - Hover zoom effect and clip reveal.
10. **Final CTA (100svh)**:
    - Full-bleed image zoom-out.
    - Giant 2-word title in chars.
    - White pill CTA button.
11. **Footer**:
    - Emblem + name, 3 link columns, huge faint watermark word sliding in on scroll, and legal row.

---

## 5. Animation Stack & Implementation

### Libraries
Include in this exact order before the inline script:
1. `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
2. `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
3. `https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`

### Wiring Lenis with GSAP
```javascript
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo(anchor.getAttribute('href'));
  });
});
```

### Motion Patterns
- **Splitting**: Custom split helpers (`.w > .wi` for words, `.c > .ci` for characters with `overflow: hidden`).
- **Character Reveals**: `yPercent: 110`, ease `expo.out`, small stagger.
- **Generic Titles**: `.split-lines` titles reveal on enter; eyebrows fade up.
- **Parallax**: `[data-speed]` for element parallax, `[data-inner]` for inner-image parallax, clip-from-bottom reveals.
- **Progress & Nav**: Thin white scroll-progress bar fixed at the top; navigation switches to blurred/solid after scrolling past 60% of hero.

### Progressive Enhancement & Accessibility
- Add `html.motion` class only when GSAP is loaded and motion is not reduced.
- Without `html.motion`, pinned sections render as normal stacked full-height panels and the gallery acts as a native scroll-snap row.
- If `prefers-reduced-motion` matches, skip Lenis and all GSAP animations completely.

---

## 6. Build & Publish Workflow

1. **Format**:
   - Write as a single HTML file in the scratchpad (no outer doctype/html/head/body when wrapping inside an artifact system, or full standalone HTML as requested).
   - Start with `<title>Chaitanya Keralam — {Page}</title>` (short name, e.g. "Keralam Experiences"), plus `<meta name="claude:viewport-fit-sides" content="cover">`.
   - Single deliberate dark look: `color-scheme: dark;` on `:root`, explicit background on `body`.
2. **Logo Substitution**:
   - Keep `__LOGO__` placeholder in the source file and substitute the base64 PNG data URI during the build step.
3. **Artifact Linking**:
   - Link pages to each other using their respective artifact URLs in the navigation.

---

## 7. Testing & Quality Checklist (Gotchas Learned)

- **Sandbox CDN Fallback**: In restricted sandboxes where CDNs are blocked:
  `npm i gsap@3.12.5 lenis@1.1.13`, copy dist files locally, rewrite script URLs, and run `python3 -m http.server`.
- **Display Reset**: Add `[hidden] { display: none !important; }` reset so elements toggled with `hidden` don't persist if they define `display: block/flex`.
- **Viewport Testing**: Check at `1440x900` (desktop) and `390x844` (mobile). Ensure `scrollWidth === innerWidth` (no horizontal overflow).
- **Grid Centering**: `.wrap` must have `width: 100%`. Inside CSS grid items, `margin: 0 auto` shrinks without 100% width and pushes text off-center.
- **Flex Nav**: Give `<nav>` `flex: 1` and center the links inside it.
- **Sizing**: Real page sections: Hero and Final CTA must be `100svh` with `min-height: 560px`. Never size canvas boards with arbitrary `vh`.

---

## 8. Response Format

Keep the response to Joel to **one or two sentences**:
- State which page was built.
- List which sections were included.
- Clarify what still needs real photos/copy.
*(Do not paste URLs or re-explain every animation).*
