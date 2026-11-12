// About page content: defaults (the current live copy) + a resolver that overlays
// whatever editors saved in the Payload "About page" global (/cms).
// Anything left empty in the CMS falls back to these defaults, so the page never breaks.
import { img, merge } from './landing-content';

const IMG = '/images/about';

export const ABOUT_DEFAULTS = {
  hero: {
    image: img(`${IMG}/sunset-boat.jpg`, "A boat crossing Kerala's backwaters, golden water under a glowing sky"),
    kicker: 'About Chaitanya Keralam',
    title: 'A vision rooted in Kerala, looking towards the world.',
    lead: 'A mission by the youth, for the youth and of the youth.',
    visionLink: 'Our vision',
    philosophyLink: 'Our philosophy',
  },
  whoWeAre: {
    label: 'Who we are',
    heading: 'A transformative initiative',
    text: 'Chaitanya Keralam is envisioned as a transformative initiative to develop Kerala as a Global Eco-Spiritual Peace Tourism Destination — bringing together nature, culture, spirituality, peace, wellness, responsible tourism, hospitality, caregiving and entrepreneurship to create meaningful livelihood opportunities for youth and the community.',
    button: 'Explore our programmes',
    image1: img(`${IMG}/market-stall-elders.jpg`, 'Elders gathered at a Kerala market stall, hung with ripening bananas'),
    image2: img(`${IMG}/artisan-mentorship.png`, 'A young artisan being mentored in a craft workshop'),
  },
  vision: {
    kicker: 'Our vision',
    statement: 'Transforming Kerala into a Global Eco-Spiritual Peace Tourism Destination.',
  },
  mission: {
    heading: 'Our mission',
    lead: 'Kerala has around 1.4 million unutilized or underutilized houses. Our mission is to transform suitable existing unutilized and underutilized homes into TSB and TESH Homes — creating a distributed network of international guest houses, training centres and activity centres.',
    badge: 'Proposed',
    items: [
      { value: 'Transforming luxury homes' },
      { value: 'Empowering youth' },
      { value: 'Creating entrepreneurs' },
      { value: 'Utilizing free land holding for income generation' },
      { value: 'Global e-commerce opportunities' },
    ],
  },
  target: {
    kicker: '01 · Project target',
    number: '1,000',
    text: 'To create a team of 1,000 Independent Global Youth Entrepreneurs in the Eco-Spiritual Peace Tourism Industry in Kerala.',
    link: 'See our goals',
    image: img(`${IMG}/youth-at-work-sunset.jpg`, 'Young Keralites at work by the water at sunset, hopeful and forward-looking'),
    inset: img(`${IMG}/team-planning-maps.png`, 'A young team planning together over models and maps'),
  },
  goals: {
    heading: 'Project goals for the years ahead',
    lead: 'These are project goals, not completed achievements.',
    items: [
      { label: 'Community-based centres', text: 'Convert underutilized assets into productive community-based centres that create opportunities for youth, support tourism and generate sustainable livelihoods.', image: img(`${IMG}/banana-leaf-feast.jpg`, 'A Kerala sadya laid out on a banana leaf, a community gathered to share a meal') },
      { label: 'Empowering youth', text: 'Empowering youth through skill development, practical experience, leadership and entrepreneurial opportunities.', image: img(`${IMG}/spice-shopkeeper.jpg`, 'A shopkeeper at work in his spice shop, learning a trade hands-on') },
      { label: 'Responsible tourism', text: 'Encourage responsible tourism and community participation.', image: img(`${IMG}/golden-hour-canoes.jpg`, 'Canoes crossing tropical backwaters at golden hour, respectful of the land') },
    ],
  },
  philosophy: {
    kicker: 'Our philosophy · Tyagarchana',
    quote: '“Caring love, voluntary sacrifice and selfless service.”',
    paragraphs: [
      { value: "Tyagarchana is the project's stated philosophy — service offered with care, given freely and without expectation." },
      { value: 'In practice, it is intended to shape how Chaitanya Keralam approaches tourism, hospitality and community development: welcoming guests with sincerity, respecting the places and people who host them, and encouraging young people to see service and leadership as contributions to their communities.' },
    ],
  },
  approach: {
    heading: 'Six threads, woven together',
    lead: "The project integrates ancient wisdom, Kerala's hospitality culture, eco-spiritual tourism, peace and wellness, youth entrepreneurship and sustainable livelihoods.",
    threads: [
      { title: 'Ancient wisdom and cultural values', text: "Kerala's heritage of spiritual traditions, cultural exchange and traditional knowledge.", image: img(`${IMG}/lighting-the-lamp.jpg`, 'Jasmine-adorned women lighting a traditional oil lamp at dusk') },
      { title: 'Kerala hospitality culture', text: "Kerala's traditions of hospitality and community living.", image: img(`${IMG}/hospitality-welcome.png`, 'Guests welcomed Kerala-style with garlands and an oil lamp greeting') },
      { title: 'Eco-spiritual tourism', text: 'Travel that connects nature, ecology, spirituality, peace and culture.', image: img(`${IMG}/eco-spiritual-tourism.png`, "A quiet moment of reflection by Kerala's backwaters, nature and spirituality entwined") },
      { title: 'Peace and wellness', text: "Meditation, wellness and Kerala's Ayurvedic and spiritual traditions.", image: img(`${IMG}/meditation-amidst-greenery.png`, 'A figure meditating amidst lush greenery, calm and still') },
      { title: 'Youth entrepreneurship', text: 'Preparing young people to lead and to create their own sustainable enterprises.', image: img(`${IMG}/entrepreneur-at-work.jpg`, 'A young entrepreneur working at a laptop, surrounded by greenery') },
      { title: 'Sustainable livelihoods', text: 'Livelihood opportunities that benefit youth and communities.', image: img(`${IMG}/handicraft-stall.jpg`, 'A vibrant handicraft market stall, livelihoods built on traditional craft') },
    ],
  },
  learning: {
    heading: 'Beyond the classroom',
    lead: 'We believe that skill development should go beyond classroom learning. Our programmes combine:',
    items: [
      { title: 'Knowledge and practical skills', description: 'Specific knowledge paired with hands-on practice.' },
      { title: 'Tourism, hospitality & caregiving', description: 'Tourism and hospitality training, and caregiving skills.' },
      { title: 'Management & leadership', description: 'Management and leadership development, and global entrepreneurship.' },
      { title: 'Digital & community', description: 'Digital skills and community engagement.' },
      { title: 'Practice & projects', description: 'Practical exposure and project-based learning.' },
    ],
  },
  banner: {
    image: img(`${IMG}/village-life-banner.jpg`, 'Welcoming Kerala village life at sunset'),
    kicker: 'Learn • Practise • Create • Lead',
    heading: 'Find your path.',
    lead: 'Find the programme that fits your path.',
    button: 'Explore Our Programmes',
  },
};

export type AboutContent = typeof ABOUT_DEFAULTS;

export function resolveAboutContent(stored: unknown): AboutContent {
  return merge(ABOUT_DEFAULTS, stored) as AboutContent;
}

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: 'about', depth: 1 });
    return resolveAboutContent(doc);
  } catch (e) {
    console.error('About content: falling back to defaults', e);
    return ABOUT_DEFAULTS;
  }
}
