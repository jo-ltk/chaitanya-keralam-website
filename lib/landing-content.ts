// Landing page content: defaults (the current live copy) + a resolver that overlays
// whatever editors saved in the Payload "Landing page" global (/cms).
// Anything left empty in the CMS falls back to these defaults, so the page never breaks.

const SB = 'https://uwhatknkdcffxpezkage.supabase.co/storage/v1/object/public/site-media/uploads';

export type Img = { url: string; alt: string };
const img = (url: string, alt: string): Img => ({ url, alt });

export const LANDING_DEFAULTS = {
  hero: {
    video: `${SB}/kerala-aerial-landscape-1793006981218.mp4`,
    titles: [{ value: 'Perhaps the only paradise on earth!' }, { value: 'One with nature.' }, { value: "God's own country." }],
    image1: img(`${SB}/western-ghats-mist-1793007116438.jpg`, 'Western Ghats in mist'),
    image2: img(`${SB}/diya-temple-festival-1793008151792.png`, 'Festival lamps, temple and people'),
    cta: 'Begin your Kerala yatra',
  },
  statement: {
    kicker: 'Chaitanya Keralam',
    text: 'Temple bells at dawn, church bells at noon, the azaan at dusk, all under one sky. In Kerala, faith means living in harmony with nature and with one another.',
  },
  chapters: [
    {
      kicker: '01 · Perhaps the only paradise on earth',
      word: 'Paradise',
      text: 'The Kerala of the stories you grew up with: misty hills, coconut groves, backwaters and quiet village temples. Come and see it for yourself, at your own pace.',
      link: 'See the places',
      main: img(`${SB}/houseboat-backwaters-1793008580480.png`, 'Houseboat on still backwaters'),
      inset: img(`${SB}/coconut-grove-water-1793007847586.jpg`, 'Coconut grove by the water'),
    },
    {
      kicker: '02 · One with nature',
      word: 'Nature',
      text: 'Wake to birdsong, walk beneath old trees and breathe the clean air of the Western Ghats. Here, nature restores you slowly and gently.',
      link: 'Travel gently with us',
      main: img(`${SB}/western-ghats-mist-1793007116438.jpg`, 'Western Ghats Silent Valley'),
      inset: img('/assets/images/athirappilly-aerial.png', 'Aerial view of Athirappilly waterfall in the forest'),
    },
    {
      kicker: "03 · God's own country",
      word: "God's own",
      text: 'Onam, Christmas and Eid, celebrated together by neighbours of every faith. Temples, churches and mosques on the same street. This is God\'s own country.',
      link: 'Our values',
      main: img('/assets/images/temple-lamps.png', 'Lamps at a temple festival'),
      inset: img(`${SB}/oil-lamps-flowers-1793010878547.png`, 'Oil lamps and flowers'),
    },
  ],
  destinations: {
    heading: 'Places that stay with you',
    link: 'All destinations',
    cards: [
      { label: 'Backwaters', title: 'Alappuzha: a houseboat, a cup of chai and the backwaters drifting by', image: img('/assets/images/gallery-backwaters.jpg', 'Alappuzha backwaters') },
      { label: 'Hills', title: 'Munnar: tea gardens, cool air and morning walks you will remember for years', image: img('/assets/images/munnar-tea.jpg', 'Munnar tea hills') },
      { label: 'Forests', title: 'Wayanad: forest paths, spice gardens and quiet hill villages', image: img('/assets/images/gallery-rainforest.jpg', 'Wayanad forest') },
      { label: 'Coast', title: 'Varkala: sea breeze on the red cliffs and a calm evening by the shore', image: img('/assets/images/gallery-coast.jpg', 'Varkala cliffs and beach') },
      { label: 'Waterfalls', title: 'Athirappilly: feel the cool spray of the great waterfall', image: img('/assets/images/athirappilly-falls.jpg', 'Athirappilly falls') },
      { label: 'Heritage', title: 'Kochi: old churches, spice markets and the Chinese fishing nets at sunset', image: img('/assets/images/gallery-culture.jpg', 'Fort Kochi streets') },
    ],
  },
  vision: {
    label: 'Our vision',
    heading: 'Eco-Spiritual Peace Tourism',
    lead: "A yatra for today. See Kerala's beauty, visit holy places of every faith, rest close to nature and return home lighter. Every journey is planned with care for the land and for the people who welcome you.",
    facts: [
      { value: '44', label: 'Rivers' },
      { value: '14', label: 'Districts' },
      { value: '1', label: 'Western Ghats, a UNESCO World Heritage range' },
    ],
    button: 'Our vision',
    image1: img('/assets/images/forest-path.jpg', 'Forest path morning light'),
    image2: img('/assets/images/gallery-rainforest.jpg', 'Rain on leaves'),
  },
  invitation: {
    kicker: 'Global invitation',
    quote: '“Inviting global entrepreneurs and visionary leaders for global peace and sustainable development.”',
  },
  moment: {
    image: img('/assets/images/sunrise-yoga-tea-hills.png', 'Sunrise yoga amid Kerala tea hills'),
    label: 'Munnar · Dawn',
    caption: 'Sunrise yoga amid the tea hills, where the day begins slowly.',
  },
  values: {
    heading: 'Values our elders lived by',
    lead: 'Four simple values for a balanced life, and the ones we hope to pass on to our children.',
    link: 'What these values mean',
    rows: [
      { title: 'Anbu · Love / Compassion', text: 'Loving-kindness, empathy, and unconditional affection toward family, fellow humans, and all living creatures. In classical Tamil philosophy like the Thirukkural, Anbu is considered the foundational virtue of human life, the fuel that makes a human soul truly alive.', image: img(`${SB}/anbu-love-compassion-1793008816345.png`, 'Shared meal, hands and banana leaf') },
      { title: 'Unmai · Truth / Honesty', text: 'Truthfulness, reality, sincerity, and integrity in thoughts, words, and actions. Standing firmly by facts and inner truth without deceit or pretense.', image: img(`${SB}/unmai-truth-integrity-1793009294446.png`, 'Still water reflecting the sky') },
      { title: 'Patru · Attachment / Devotion / Loyalty', text: "A deep-seated devotion, attachment, or commitment to a principle, language (Tamil-patru), country (Nattu-patru), or person. It defines a human's sense of duty and loyalty toward what they hold dear, giving direction to one's love and truth.", image: img(`${SB}/patru-commitment-devotion-1793009464320.png`, 'Lighting the lamp at dawn') },
      { title: 'Pagutharivu · Rationalism / Discernment', text: 'Critical thinking, logical reasoning, and analytical intelligence. It literally means the "ability to divide/analyze (pagu) knowledge (arivu)". A cornerstone of the modern Tamil social reform movement, it implores individuals to question dogma, reject blind superstitions, and evaluate everything using scientific logic and cause-and-effect reasoning.', image: img(`${SB}/pagutharivu-rational-thinking-1793009636243.png`, 'An elder and a young person in conversation') },
    ],
    banner: {
      tamil: 'சங்க இலக்கியம்',
      kicker: 'Rooted in classical Tamil thought',
      heading: 'Sangam literature',
      text: 'The ancient Tamil poetry where these values first took shape.',
      button: 'Read more',
      url: 'https://en.wikipedia.org/wiki/Sangam_literature',
    },
  },
  stories: {
    heading: 'Journeys with meaning',
    link: 'Plan a journey',
    items: [
      { label: 'Ayurveda & rest', title: 'Ayurveda the traditional way: herbal oils, simple food and quiet, restful days', image: img(`${SB}/ayurveda-foot-massage-1793010154542.png`, 'Ayurveda and yoga by the water') },
      { label: 'Family homestays', title: 'Stay with Kerala families, eat a sadya on a banana leaf and leave the land as you found it', image: img(`${SB}/family-homestay-1793010296886.png`, 'Visitors with a local family homestay') },
      { label: 'Youth & community', title: 'Your journey helps young people of Kerala build careers in hospitality and tourism', image: img(`${SB}/youth-community-1793010493930.png`, 'Young people training in hospitality') },
    ],
  },
  banner: {
    heading: "God's own country awaits.",
    button: 'Plan a journey for your family',
    image: img(`${SB}/sunset-backwaters-1793010741262.png`, 'Sunset over the backwaters'),
  },
  maps: {
    heading: 'Find Kerala',
    lead: 'From the world to India, and into Kerala itself.',
  },
  official: {
    kicker: 'Plan with confidence',
    heading: 'Official Kerala Tourism',
    image: img('/assets/images/panorama-dusk.jpg', ''),
    link1: 'Official Kerala Tourism website',
    link1Url: 'https://www.keralatourism.org/',
    link2: 'Kochi-Muziris Biennale',
    link2Url: 'https://www.kochimuzirisbiennale.org/',
  },
  plan: {
    heading: 'Let us plan your Kerala journey',
    text: 'Travelling with family, as a couple, or on a pilgrimage? Tell us what you have in mind. We will plan an unhurried journey with comfortable stays, good food and time to rest.',
    guideTitle: 'Download our Kerala family travel guide',
    guideUrl: `${SB}/chaitanya-keralam-guide.pdf`,
  },
  footer: {
    promise: "Perhaps the only paradise on earth!\nOne with nature.\nGod's own country.",
    tagline: 'Eco-Spiritual Peace Tourism · Anbu · Unmai · Patru · Pagutharivu',
    address: 'Edex Edupark, Kochi, Kerala',
    phones: [{ value: '+91 90370 16730' }, { value: '+91 85478 18701' }],
    emails: [{ value: 'josephanil2007@gmail.com' }, { value: 'akashjose369@gmail.com' }, { value: 'shajimilan79@gmail.com' }],
  },
};

export type LandingContent = typeof LANDING_DEFAULTS;

const isImg = (d: any) => d && typeof d === 'object' && 'url' in d && 'alt' in d && Object.keys(d).length === 2;

function merge(def: any, stored: any): any {
  if (Array.isArray(def)) {
    if (!Array.isArray(stored) || stored.length === 0) return def;
    return stored.map((s, i) => merge(def[i] ?? def[0], s));
  }
  if (isImg(def)) {
    const uploaded = stored?.image && typeof stored.image === 'object' ? stored.image.url : '';
    return {
      url: uploaded || (typeof stored?.url === 'string' && stored.url) || def.url,
      alt: typeof stored?.alt === 'string' && stored.alt !== '' ? stored.alt : def.alt,
    };
  }
  if (def && typeof def === 'object') {
    const out: any = {};
    for (const k of Object.keys(def)) out[k] = merge(def[k], stored?.[k]);
    return out;
  }
  return typeof stored === 'string' && stored !== '' ? stored : def;
}

export function resolveLandingContent(stored: unknown): LandingContent {
  return merge(LANDING_DEFAULTS, stored) as LandingContent;
}

export async function getLandingContent(): Promise<LandingContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: 'landing', depth: 1 });
    return resolveLandingContent(doc);
  } catch (e) {
    console.error('Landing content: falling back to defaults', e);
    return LANDING_DEFAULTS;
  }
}
