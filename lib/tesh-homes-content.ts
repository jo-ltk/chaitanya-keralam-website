// TESH Homes page content: defaults (the current live copy) + a resolver that overlays
// whatever editors saved in the Payload "TESH Homes page" global (/cms).
// Anything left empty in the CMS falls back to these defaults, so the page never breaks.
import { img, merge } from './landing-content';

const IMG = '/images/tesh-homes';

export const TESH_HOMES_DEFAULTS = {
  hero: {
    image: img(`${IMG}/hero-courtyard-villa.png`, 'A Kerala courtyard villa in morning light'),
    kicker: 'TESH Homes · Proposed initiative',
    title: 'Turning homes into opportunity.',
    button: 'Partner With Us',
    link: 'I have a property',
  },
  bigNumber: {
    label: 'Unutilized or underutilized houses in Kerala',
    number: '1.4 million',
    text: 'Kerala has around 1.4 million unutilized or underutilized houses. TESH Homes is a proposed initiative to transform suitable existing homes into TSB and TESH Homes — a distributed network of international guest houses, training centres and activity centres connecting tourism, practical learning and youth entrepreneurship.',
  },
  homeTypes: {
    label: 'Proposed home types',
    heading: 'Two ways a home can serve',
    lead: 'Each proposed TESH Home would connect tourism, practical learning and community life.',
    guestHouses: {
      image: img(`${IMG}/type-01-guest-houses.png`, 'A guest house on calm Kerala backwaters'),
      kicker: 'Type 01',
      title: 'Guest houses',
      lead: 'For local, national and international travellers.',
      text: 'TSB & TESH Guest Houses: international guest houses in suitable existing villas, welcoming travellers into Kerala homes.',
      perDistrict: '5',
      perDistrictText: 'per district in the proposed pilot',
      total: '25',
      totalText: 'across five districts',
    },
    centres: {
      image: img(`${IMG}/type-02-training-centres.png`, 'Training and activity centre'),
      kicker: 'Type 02',
      title: 'Training & activity centres',
      lead: 'Proposed centres for:',
      items: [
        { value: 'Meditation' },
        { value: 'Mediation' },
        { value: 'Caregiver training / social service' },
        { value: 'AI-enabled agriculture training / farming' },
        { value: 'Composite skills training' },
        { value: 'Global entrepreneurship & e-commerce' },
        { value: 'Cultural activities & edutainment' },
      ],
      perDistrict: '5',
      perDistrictText: 'per district in the proposed pilot',
      total: '25',
      totalText: 'across five districts',
    },
  },
  pilot: {
    kicker: 'Central Travancore · Proposed pilot',
    heading: 'A proposed pilot across five districts',
    lead: 'The Kerala Pilot Project proposes an initial implementation of 10 selected homes in each of five Central Travancore districts — 5 villas per district as TSB & TESH Guest Houses and 5 as Training / Activity Centres. This is a proposed pilot, not a completed development.',
    facts: [
      { value: '5', label: 'Districts' },
      { value: '10', label: 'Homes per district' },
      { value: '50', label: 'Homes in total' },
    ],
    districts: [
      { value: 'Ernakulam' },
      { value: 'Kottayam' },
      { value: 'Alappuzha' },
      { value: 'Pathanamthitta' },
      { value: 'Idukki' },
    ],
    mapDescription: 'Diagram: 10 proposed homes in each of five districts — Ernakulam, Kottayam, Alappuzha, Pathanamthitta and Idukki — five guest houses and five training or activity centres in each',
    legendGuestHouses: 'Guest houses (5 per district)',
    legendCentres: 'Training / activity centres (5 per district)',
  },
  careers: {
    image: img(`${IMG}/career-pathway.png`, 'Young people learning together in a sunlit lab'),
    label: 'Career pathway',
    heading: 'From learning to leading',
    steps: [
      { title: 'Training', text: 'Practical training in tourism, hospitality, caregiving and global entrepreneurship.' },
      { title: 'Practical Experience', text: 'Hands-on experience through TESH Homes, training centres and community-based activities.' },
      { title: 'TESH Home Management', text: 'Trained youth may take up roles in managing TESH Homes as the proposed network develops.' },
      { title: 'Youth Entrepreneurship', text: 'Moving beyond employment to create sustainable enterprises connected to the TESH ecosystem.' },
    ],
    rolesHeading: 'TESH Home management roles',
    roles: [
      { value: 'Guest services' },
      { value: 'Hospitality operations' },
      { value: 'Tourism activities' },
      { value: 'Caregiving services*' },
      { value: 'Wellness & meditation activities' },
      { value: 'House and facility management' },
      { value: 'Sustainable agriculture' },
      { value: 'Digital / AI-enabled activities' },
    ],
    enterprisesHeading: 'Examples of enterprises',
    enterprises: [
      { value: 'Homestay / guesthouse enterprises' },
      { value: 'Sustainable / AI-enabled agriculture' },
      { value: 'Eco-tourism experiences' },
      { value: 'Tour & travel services' },
      { value: 'Wellness & spiritual tourism services' },
      { value: 'Local products and community enterprises' },
      { value: 'Caregiving services*' },
      { value: 'Digital tourism and service businesses' },
    ],
    quote: 'Global citizenship through global entrepreneurship and e-commerce.',
    note: 'These are intended career and enterprise pathways, not guaranteed placements or earnings. *Subject to relevant requirements.',
  },
  partners: {
    label: 'Partnership opportunities',
    heading: 'Build this with us',
    lead: 'We welcome enquiries from:',
    items: [
      { title: 'Homeowners', text: 'With suitable properties to contribute to the network.' },
      { title: 'Tourism & hospitality businesses', text: 'Offering exposure, partnership or collaboration.' },
      { title: 'Training institutions', text: 'Sharing expertise and learning pathways.' },
      { title: 'Community organisations', text: 'Connecting tourism with local life.' },
      { title: 'Potential project partners', text: 'Supporting the proposed TESH Homes network.' },
      { title: 'Individuals', text: 'Interested in youth entrepreneurship.' },
    ],
  },
  enquiry: {
    label: 'Get in touch',
    heading: 'Start a conversation',
    brandName: 'Chaitanya Keralam',
    brandTagline: 'TESH Homes · Proposed initiative',
    promise: "Perhaps the only paradise on earth! One with nature. God's own country.",
    thanks: 'Thank you — the project team will be in touch.',
    homeowner: {
      tab: 'Homeowner enquiry',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      phoneLabel: 'Phone',
      phonePlaceholder: '+91',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      locationLabel: 'Property location',
      locationPlaceholder: 'Town, district',
      propertyTypeLabel: 'Property type',
      propertyTypes: [{ value: 'Independent house' }, { value: 'Villa' }, { value: 'Heritage home' }, { value: 'Other' }],
      collaborationLabel: 'Intended collaboration',
      collaborations: [{ value: 'Guest house' }, { value: 'Training centre' }, { value: 'Activity centre' }, { value: 'Not sure yet' }],
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us about the property',
      button: 'Send homeowner enquiry',
    },
    partnership: {
      tab: 'Partnership enquiry',
      nameLabel: 'Contact name',
      namePlaceholder: 'Your name',
      organisationLabel: 'Organisation',
      organisationPlaceholder: 'Organisation name',
      partnershipTypeLabel: 'Partnership type',
      partnershipTypes: [
        { value: 'Tourism or hospitality business' },
        { value: 'Training institution' },
        { value: 'Community organisation' },
        { value: 'Project partner' },
        { value: 'Individual' },
      ],
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      phoneLabel: 'Phone',
      phonePlaceholder: '+91',
      messageLabel: 'Collaboration details',
      messagePlaceholder: 'How would you like to collaborate?',
      button: 'Send partnership enquiry',
    },
  },
  banner: {
    image: img(`${IMG}/banner-sunrise.png`, 'Kerala backwaters at golden sunrise'),
    kicker: 'Learn • Practise • Create • Lead',
    heading: 'Build it with us.',
    lead: "Help build a network connecting Kerala's homes, communities, tourism and youth opportunities.",
    button: 'Partner With Us',
  },
};

export type TeshHomesContent = typeof TESH_HOMES_DEFAULTS;

export function resolveTeshHomesContent(stored: unknown): TeshHomesContent {
  return merge(TESH_HOMES_DEFAULTS, stored) as TeshHomesContent;
}

export async function getTeshHomesContent(): Promise<TeshHomesContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: 'tesh-homes', depth: 1 });
    return resolveTeshHomesContent(doc);
  } catch (e) {
    console.error('TESH Homes content: falling back to defaults', e);
    return TESH_HOMES_DEFAULTS;
  }
}
