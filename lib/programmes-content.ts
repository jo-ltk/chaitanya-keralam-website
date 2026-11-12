// Programmes page content: defaults (the current live copy) + a resolver that overlays
// whatever editors saved in the Payload "Programmes page" global (/cms).
// Anything left empty in the CMS falls back to these defaults, so the page never breaks.
import { img, merge } from './landing-content';

const PROG = '/images/programmes';

export const PROGRAMMES_DEFAULTS = {
  hero: {
    crumbHome: 'Home',
    crumbCurrent: 'Programmes',
    kicker: 'TESH Skill Development Programmes',
    title: 'Build practical skills. Create opportunities. Lead with purpose.',
    subtitle: 'Entrepreneurship & Leadership in Eco-Spiritual Peace Tourism & Hospitality',
    lead: 'The TESH Skill Development Programmes are designed for young people who want to develop practical skills and explore career and entrepreneurial opportunities in eco-spiritual tourism, trading, technology, hospitality, caregiving and related services.',
    button: 'Compare programmes',
    link: 'Eligibility & selection',
    glanceKicker: 'At a glance',
    glance: [
      { code: '3M', title: '3-Month Foundation', meta: '240 training hours · Offline', href: '/programmes/3-month-foundation' },
      { code: '6M', title: '6-Month Professional', meta: '480 training hours · Offline', href: '/programmes/6-month-professional' },
      { code: '1Y', title: '1-Year Advanced', meta: '960 training hours · Offline', href: '/programmes/1-year-advanced' },
    ],
  },
  panorama: {
    image: img(`${PROG}/panorama-study-circle.png`, 'A study circle on a tropical veranda'),
    linkAreas: 'Learning areas',
    linkCompare: 'Compare programmes',
    linkFormat: 'Learning format',
    linkAdmissions: 'Eligibility & admissions',
  },
  areas: {
    kicker: 'Four learning areas',
    heading: 'What you will study',
    topicsLabel: 'Key areas include',
    items: [
      {
        title: 'Eco-Spiritual Peace Tourism & Travel',
        text: 'Knowledge and practical skills related to tourism experiences — exploring the connection between nature, ecology, spirituality, peace, wellness, culture and responsible travel.',
        topics: [{ value: 'Tourism experiences' }, { value: 'Travel planning' }, { value: 'Destination development' }, { value: 'Interpretation' }, { value: 'Responsible tourism' }],
        image: img(`${PROG}/tourism-area.png`, 'Travellers listening to stories by the backwaters'),
      },
      {
        title: 'Eco-Spiritual Hospitality',
        text: 'Practical hospitality skills for eco-friendly and wellness-oriented tourism environments.',
        topics: [{ value: 'Guest relations' }, { value: 'Front office' }, { value: 'Housekeeping' }, { value: 'Food & beverage service' }, { value: 'Guest experience' }, { value: 'Wellness hospitality' }, { value: 'Retreat hospitality' }, { value: 'Eco-hospitality' }],
        image: img(`${PROG}/hospitality-area.jpg`, 'A table set for guests on a Kerala veranda'),
      },
      {
        title: 'International Caregiving',
        text: 'Foundational and progressive caregiving skills that can support opportunities in care-related services. Caregiving is integrated as a specialised skill area within the broader eco-spiritual tourism and hospitality programme.',
        topics: [{ value: 'Personal care' }, { value: 'Daily living support' }, { value: 'Elderly care' }, { value: 'Vulnerable person care' }, { value: 'Mobility support' }, { value: 'Nutrition and safe assistance' }, { value: 'Emotional and social wellbeing' }, { value: 'Communication' }, { value: 'Basic first aid and emergency awareness' }, { value: 'Care documentation' }],
        image: img(`${PROG}/caregiving-area.png`, 'Gentle wellness exercise in a sunlit garden room'),
      },
      {
        title: 'Global Entrepreneurship & Leadership',
        text: 'The mindset and practical abilities required to become an entrepreneur and responsible leader.',
        topics: [{ value: 'Entrepreneurial mindset' }, { value: 'Opportunity identification' }, { value: 'Market research' }, { value: 'Business models' }, { value: 'Business planning' }, { value: 'Costing and pricing' }, { value: 'Digital marketing' }, { value: 'Team management' }, { value: 'Communication' }, { value: 'Leadership' }, { value: 'Project development' }],
        image: img(`${PROG}/entrepreneurship-area.png`, 'Young people planning a project in a Kerala heritage home'),
      },
    ],
  },
  compare: {
    label: 'Programme comparison',
    heading: 'Three levels, one pathway',
    lead: 'All levels: 4 hours a day, 5 days a week.',
    eligibilityLabel: 'Eligibility',
    eligibilityTbc: 'To be confirmed',
    progressionLabel: 'Progression',
    button: 'View Programme',
    levels: [
      {
        code: '3M', level: 'Foundation level', title: '3-Month Foundation', duration: '3 months', hours: '240 training hours', mode: 'Offline',
        eligibility: 'Plus Two / Higher Secondary or equivalent',
        focus: 'Introduces the basic concepts and practical skills of tourism & travel, eco-spiritual peace tourism, hospitality, basic caregiving, eco-hospitality, entrepreneurship, personal leadership and digital skills.',
        progression: 'Learn · Practise · Assist', href: '/programmes/3-month-foundation',
        image: img(`${PROG}/level-3-month.png`, 'Students learning together on a tropical veranda'),
      },
      {
        code: '6M', level: 'Professional level', title: '6-Month Professional', duration: '6 months', hours: '480 training hours', mode: 'Offline',
        eligibility: 'Plus Two / Higher Secondary or equivalent',
        focus: 'Develops stronger operational skills in eco-spiritual tourism, destination development, tour and itinerary planning, sustainable tourism, hospitality operations, international caregiving, entrepreneurship, business development, team leadership and TESH Home practical training.',
        progression: 'Learn · Practise · Operate · Take responsibility', href: '/programmes/6-month-professional',
        image: img(`${PROG}/level-6-month.png`, 'A warm welcome on a Kerala veranda'),
      },
      {
        // Empty eligibility shows the "To be confirmed" tag.
        code: '1Y', level: 'Advanced level', title: '1-Year Advanced', duration: '12 months', hours: '960 training hours', mode: 'Offline',
        eligibility: '',
        focus: 'Develops higher-level capabilities in tourism and destination management, tour operations, tourism experience design, advanced hospitality management, eco-resort and wellness management, advanced caregiving, entrepreneurship, business management, financial skills, digital marketing, leadership and supervision, TESH Home management, and business and management projects.',
        progression: 'Supervise · Lead · Manage · Create', href: '/programmes/1-year-advanced',
        image: img(`${PROG}/level-1-year.png`, 'Collaborative learning in a sunlit lab'),
      },
    ],
  },
  chapter: {
    kicker: 'Learning format',
    word: 'Doing',
    text: 'Learn by doing. TESH programmes are designed around practical and experiential learning. Training may include the formats below.',
    link: 'See the formats',
    image: img(`${PROG}/doing-chapter-main.png`, 'Guidance in a sunlit Kerala computer lab'),
    inset: img(`${PROG}/doing-chapter-tea.jpg`, 'Warm tea on a tropical veranda'),
  },
  formats: {
    heading: 'How training works',
    lead: 'Training schedule: 4 hours a day, 5 days a week.',
    hours: [
      { value: '240', label: 'Training hours · 3 months' },
      { value: '480', label: 'Training hours · 6 months' },
      { value: '960', label: 'Training hours · 1 year' },
    ],
    items: [
      { title: 'Classroom learning', text: 'Understanding concepts, principles and professional knowledge.' },
      { title: 'Practical training', text: 'Hands-on skills through demonstrations and supervised practice.' },
      { title: 'Role play & simulation', text: 'Practising guest service, communication, caregiving and workplace situations.' },
      { title: 'Field & experience-based learning', text: 'Destinations, hospitality environments, communities and nature-based experiences.' },
      { title: 'TESH Home practical exposure', text: 'According to level and programme requirements, where available.' },
      { title: 'Project-based learning', text: 'Tourism, hospitality, caregiving or entrepreneurship-related projects.' },
      { title: 'Leadership practice', text: 'Progressively taking responsibility for activities, teams and projects.' },
      { title: 'Assessment & certification', text: 'Assessment of learning, and a TESH Skill Development Experience Certificate on completion.' },
    ],
  },
  admissions: {
    label: 'Eligibility & selection',
    heading: 'Who can apply, and how',
    steps: [
      { title: 'Credentials', text: 'Academic and extracurricular credentials.' },
      { title: 'Aptitude test', text: 'An assessment of aptitude for the programme.' },
      { title: 'Interview', text: 'A conversation with the programme team.' },
      { title: 'Group discussion', text: 'Teamwork and communication in a group setting.' },
    ],
    facts: [
      { label: 'Target age group', value: '18–29', text: '18 to 29 years — for visionary young leaders who want to develop practical skills and explore income-generating opportunities.' },
      { label: 'Eligibility', value: 'Plus Two', text: 'The 3-month and 6-month curriculum documents state Plus Two / Higher Secondary or equivalent eligibility.' },
      { label: 'Planned commencement', value: 'Dec 2026', text: 'Programmes begin December 2026.' },
    ],
    certificateTitle: 'Experience certificate.',
    certificateText: 'Participants who successfully complete the applicable training requirements receive a TESH Skill Development Experience Certificate, subject to programme completion and assessment requirements.',
  },
  form: {
    heading: 'Admission enquiry',
    nameLabel: 'Full name',
    namePlaceholder: 'Your name',
    ageLabel: 'Age',
    agePlaceholder: '18–29',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    phoneLabel: 'Phone',
    phonePlaceholder: '+91',
    programmeLabel: 'Programme',
    programmeOptions: [{ value: '3-Month Foundation' }, { value: '6-Month Professional' }, { value: '1-Year Advanced' }, { value: 'Not sure yet' }],
    consent: 'We use your details only to respond to your enquiry.',
    button: 'Enquire About Admission',
    thanks: 'Thank you — our admissions team will be in touch soon.',
  },
};

export type ProgrammesContent = typeof PROGRAMMES_DEFAULTS;

export function resolveProgrammesContent(stored: unknown): ProgrammesContent {
  return merge(PROGRAMMES_DEFAULTS, stored) as ProgrammesContent;
}

export async function getProgrammesContent(): Promise<ProgrammesContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: 'programmes', depth: 1 });
    return resolveProgrammesContent(doc);
  } catch (e) {
    console.error('Programmes content: falling back to defaults', e);
    return PROGRAMMES_DEFAULTS;
  }
}
