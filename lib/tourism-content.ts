// Eco-Spiritual Tourism page content: defaults (the current live copy) + a resolver that overlays
// whatever editors saved in the Payload "Eco-Spiritual Tourism page" global (/cms).
// Anything left empty in the CMS falls back to these defaults, so the page never breaks.
import { img, merge } from './landing-content';

const IMG = '/images/eco-spiritual-tourism';

export const TOURISM_DEFAULTS = {
  hero: {
    image: img(`${IMG}/hero-sunrise.png`, 'Kerala backwaters, panoramic landscape at sunrise'),
    kicker: 'Eco-Spiritual Peace Tourism',
    title: 'Experience Kerala through nature, culture and peace.',
    lead: 'Eco-Spiritual Peace Tourism connects natural environments, cultural heritage, spiritual traditions, wellness and responsible travel.',
    button: 'Explore the themes',
  },
  intro: {
    photos: [
      { label: 'Nature', image: img(`${IMG}/film-nature.png`, 'Misty hills and forest stream, Munnar') },
      { label: 'Heritage', image: img(`${IMG}/film-heritage.jpg`, 'Padmanabhapuram Palace courtyard') },
      { label: 'Wellness', image: img(`${IMG}/film-wellness.png`, 'Wellness and meditation retreat') },
      { label: 'Hospitality', image: img(`${IMG}/film-hospitality.jpg`, 'Kumarakom heritage homestay by the backwaters') },
    ],
    kicker: 'Our long-term vision',
    text: "Chaitanya Keralam's long-term vision is to develop these elements into meaningful tourism experiences while supporting local communities and youth livelihoods.",
  },
  themes: {
    heading: 'Five themes at the heart of every experience',
    lead: 'Select a theme to explore what it means for travellers, communities and learners.',
    items: [
      { title: 'Nature and ecology', text: 'Forests, rivers, mountains, biodiversity and conservation.', image: img(`${IMG}/theme-nature-ecology.jpg`, 'Periyar Wildlife Sanctuary, Thekkady') },
      { title: 'Spirituality and heritage', text: 'Sacred landscapes, pilgrimage traditions, cultural heritage and respectful understanding of different traditions.', image: img(`${IMG}/theme-spirituality-heritage.jpg`, 'Guruvayur Temple heritage') },
      { title: 'Wellness and peace', text: 'Meditation, reflection, nature-based wellness and retreat experiences.', image: img(`${IMG}/theme-wellness-peace.png`, 'A sunlit group pranayama session in a park') },
      { title: 'Kerala culture and hospitality', text: 'Traditional architecture, cuisine, arts, crafts, community knowledge and hospitality.', image: img(`${IMG}/theme-culture-hospitality.jpg`, 'A traditional Kerala veranda table setting') },
      { title: 'Responsible tourism', text: 'Waste reduction, water and energy conservation, cultural respect and community participation.', image: img(`${IMG}/theme-responsible-tourism.jpg`, 'Thenmala eco-tourism destination') },
    ],
  },
  palayam: {
    label: 'Palayam, Thiruvananthapuram',
    heading: 'A church, a temple and a mosque',
    lead: 'In the heart of Thiruvananthapuram, a church, a temple and a mosque stand as neighbours at Palayam. Bells and prayers share one sky.',
    cards: [
      { label: 'Church', text: 'A Gothic church tower lit up against the night sky.', image: img(`${IMG}/palayam-church.jpg`, 'The church at Palayam, Thiruvananthapuram, lit up at night') },
      { label: 'Temple', text: 'A temple gopuram with Lord Ganesha, glowing after dusk.', image: img(`${IMG}/palayam-temple.jpg`, 'The temple gopuram at Palayam, Thiruvananthapuram, with Lord Ganesha, lit up at night') },
      { label: 'Mosque', text: 'Twin minarets of the mosque, lit in white and blue.', image: img(`${IMG}/palayam-mosque.jpg`, 'The mosque at Palayam, Thiruvananthapuram, with its minarets lit at night') },
    ],
  },
  whyKerala: {
    kicker: 'Why Kerala?',
    word: 'Kerala',
    text: 'Kerala holds remarkable natural diversity — backwaters, beaches, hill ranges and forests — alongside a deep cultural heritage and a long tradition of hospitality.',
    link: 'A land of rivers, forests and open doors',
    image: img(`${IMG}/chapter-why-kerala-main.jpg`, 'Vembanad Lake, Kerala backwaters at golden hour'),
    inset: img(`${IMG}/chapter-why-kerala-inset.png`, 'Sunrise over misty tea hills, Munnar'),
  },
  heritage: {
    heading: 'A land of rivers, forests and open doors',
    lead: "Kerala's heritage has been shaped by ancient trade and cultural exchange, Ayurveda and traditional wellness, spiritual traditions and indigenous knowledge, and hospitality and community living.",
    panorama: img(`${IMG}/heritage-panorama.png`, 'A backwater boathouse vista, Kerala'),
    facts: [
      { label: 'Ancient trade hub', value: 'Muziris', text: "A legendary port on the spice route and Kerala's gateway for many world religions" },
      { label: 'Ports of the Indian Ocean', value: 'Pattanam', text: "Linked with Muziris on the project presentation's map of ancient trade ports, 100 BC – 300 AD" },
    ],
  },
  kochi: {
    label: 'Kochi',
    heading: "Kochi's Dutch and Jewish heritage",
    lead: 'Centuries of trade brought Dutch and Jewish communities to Kochi. The palaces and places of worship they left behind are still part of the city.',
    cards: [
      { label: 'Bolgatty Palace', text: 'A palace built by the Dutch, shaded by old trees.', image: img(`${IMG}/kochi-bolgatty-palace.jpg`, 'Bolgatty Palace in Kochi, with a red tiled roof and wooden verandas among tall trees') },
      { label: 'Dutch architecture', text: 'Whitewashed arches beneath sloping tiled roofs.', image: img(`${IMG}/kochi-dutch-architecture.jpg`, 'A Dutch-style building with white arches and a sloping tiled roof') },
      { label: 'Paradesi Synagogue', text: 'Hand-painted blue floor tiles and glass lamps in Mattancherry.', image: img(`${IMG}/kochi-paradesi-synagogue.jpg`, 'Inside the Paradesi Synagogue, Kochi: blue tiled floor, wooden benches and hanging glass lamps') },
    ],
  },
  cuisine: {
    label: 'Kerala cuisine',
    heading: 'Eaten slowly, on a banana leaf',
    lead: 'Coconut, rice, spices and curry leaves shape every Kerala meal, from a quiet breakfast to a festive sadya.',
    cards: [
      { label: 'Appam', text: 'Lacy, soft-centred rice pancakes served warm on a banana leaf.', image: img(`${IMG}/cuisine-appam.jpg`, 'Three appam, Kerala rice pancakes with lacy edges, on a banana leaf in a woven basket') },
      { label: 'Sadya', text: 'The festive feast: rice, curries and pickles laid out on one leaf.', image: img(`${IMG}/cuisine-sadya.jpg`, 'A Kerala sadya on a banana leaf with rice, papadam, banana chips and an array of curries') },
      { label: 'Puttu and kadala', text: 'Steamed rice and coconut cylinders with a spiced black chickpea curry.', image: img(`${IMG}/cuisine-puttu-kadala.jpg`, 'Puttu with kadala curry, papadam and a ripe banana on a banana leaf') },
      { label: 'Clay-pot curry', text: 'Slow-cooked in a clay pot with curry leaves, cinnamon and star anise.', image: img(`${IMG}/cuisine-meat-curry.jpg`, 'A Kerala meat curry in a black clay pot with curry leaves, star anise and green chillies') },
    ],
  },
  principles: {
    kicker: 'Responsible tourism principles',
    heading: 'Travel that gives back',
    lead: 'The principles that guide how we plan, host and teach.',
    items: [
      { value: 'Respect local customs and cultural differences.' },
      { value: 'Protect natural environments.' },
      { value: 'Reduce waste and conserve resources.' },
      { value: 'Support local businesses and service providers.' },
      { value: 'Encourage community participation.' },
    ],
  },
  livelihoods: {
    label: 'Tourism and livelihoods',
    heading: 'Where tourism meets practical training',
    link: 'See the programmes',
    lead: 'Responsible tourism creates many kinds of work. Chaitanya Keralam aims to connect these opportunities with practical training, so young people and communities can take part.',
    cards: [
      { title: 'Guest services', text: 'Welcoming, informing and caring for visitors.', image: img(`${IMG}/work-guest-services.png`, 'Hosts welcoming guests on a veranda') },
      { title: 'Local guides', text: 'Sharing nature, heritage and stories with care.', image: img(`${IMG}/work-local-guides.jpg`, 'A guided village walk in Wayanad') },
      { title: 'Hospitality', text: 'Guest houses, resorts and retreats run sustainably.', image: img(`${IMG}/work-hospitality.jpg`, 'Inside a Fort Kochi heritage home') },
      { title: 'Community enterprises', text: "Local businesses that keep tourism's benefits close to home.", image: img(`${IMG}/work-community-enterprises.jpg`, 'Exploring a cardamom spice plantation') },
    ],
  },
  banner: {
    image: img(`${IMG}/banner-sunrise.png`, 'Kerala backwaters at sunrise'),
    kicker: 'Learn • Practise • Create • Lead',
    heading: 'Skills you can use.',
    lead: 'Turn a love of Kerala into skills you can use.',
    button: 'Explore Skill Development Programmes',
  },
};

export type TourismContent = typeof TOURISM_DEFAULTS;

export function resolveTourismContent(stored: unknown): TourismContent {
  return merge(TOURISM_DEFAULTS, stored) as TourismContent;
}

export async function getTourismContent(): Promise<TourismContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: 'tourism', depth: 1 });
    return resolveTourismContent(doc);
  } catch (e) {
    console.error('Tourism content: falling back to defaults', e);
    return TOURISM_DEFAULTS;
  }
}
