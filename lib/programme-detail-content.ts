// Programme detail pages (3-Month, 6-Month, 1-Year) content: defaults (the current live copy) + a
// resolver that overlays whatever editors saved in the matching Payload global (/cms, "Programme pages").
// Anything left empty in the CMS falls back to these defaults, so the pages never break.
//
// The three pages share hero / outcomes / summary / pager sections (same keys), but their curriculum
// sections are genuinely different (timeline, tabbed parts, accordion), so each page has its own type.
// Headings with an italic accent are split into start / em / end.
// Summary rows: a value of exactly "To be confirmed" is shown as the "To be confirmed" tag.
import { merge } from './cms-merge';

const v = (...items: string[]) => items.map((value) => ({ value }));

const SUMMARY_ROWS = (duration: string, hours: string, progression: string, eligibility: string) => [
  { label: 'Duration', value: duration },
  { label: 'Training hours', value: hours },
  { label: 'Schedule', value: '4 hours a day, 5 days a week' },
  { label: 'Progression', value: progression },
  { label: 'Mode', value: 'Offline' },
  { label: 'Eligibility', value: eligibility },
  { label: 'Planned commencement', value: 'December 2026' },
];

export const PROGRAMME_3M_DEFAULTS = {
  hero: {
    crumbHome: 'Home',
    crumbProgrammes: 'Programmes',
    crumbCurrent: '3-Month Foundation',
    badge: '3-Month Foundation Programme · 240 training hours',
    titleStart: 'Build your ',
    titleEm: 'foundation',
    titleEnd: ' in eco-spiritual tourism and hospitality.',
    lead: 'Introduces the basic concepts and practical skills of tourism & travel, eco-spiritual peace tourism, hospitality, basic caregiving, eco-hospitality, entrepreneurship, personal leadership and digital skills.',
    imagePlaceholder: '[Image — learners on a field visit]',
  },
  curriculum: {
    eyebrow: 'Curriculum',
    headingStart: 'Three months, three ',
    headingEm: 'steps',
    headingEnd: '',
    practicalLabel: 'Practical work:',
    // Leave "practical" empty on a month to hide its practical-work line.
    months: [
      {
        node: 'M1',
        label: 'Month 1',
        title: 'Introduction to Tourism',
        topics: v('Understanding tourism', 'Eco, spiritual and wellness tourism', 'Nature, environment and culture', 'Sustainable and responsible tourism'),
        practical: 'destination study or field visit.',
      },
      {
        node: 'M2',
        label: 'Month 2',
        title: 'Introduction to Hospitality',
        topics: v('Hospitality industry and operations', 'Front office and guest service', 'Housekeeping and food and beverage', 'Guest experience and eco-hospitality'),
        practical: 'front-office role-play and hotel/resort exposure.',
      },
      {
        node: 'M3',
        label: 'Month 3',
        title: 'Tourism Practical Skills',
        topics: v('Tour planning', 'Tour guiding and communication', 'Tourism marketing and digital skills', 'Final tourism and hospitality project'),
        practical: '',
      },
    ],
  },
  outcomes: {
    eyebrow: 'What you will develop',
    headingStart: 'A confident ',
    headingEm: 'start',
    headingEnd: '',
    intro: 'Students develop foundational skills and practical awareness to begin assisting in tourism, hospitality, caregiving and TESH-related activities, including:',
    items: v(
      'Foundational knowledge of tourism and hospitality',
      'Guest-service skills',
      'Cultural awareness',
      'Basic tourism planning',
      'Digital promotion skills',
      'Basic caregiving and personal leadership',
    ),
    noteTitle: 'Experience certificate.',
    noteText: 'Participants who successfully complete the applicable training requirements receive a TESH Skill Development Experience Certificate, subject to programme completion and assessment requirements.',
  },
  summary: {
    eyebrow: 'At a glance',
    rows: SUMMARY_ROWS('3 months', '240', 'Learn · Practise · Assist', 'Plus Two / Higher Secondary or equivalent, as stated in the curriculum'),
    enquireButton: 'Enquire About the Three-Month Programme',
    compareButton: 'Compare programmes',
  },
  pager: {
    prevLabel: '← All programmes',
    prevTitle: 'Skill Development Programmes',
    nextLabel: 'Next level →',
    nextTitle: '6-Month Professional',
  },
};

export const PROGRAMME_6M_DEFAULTS = {
  hero: {
    crumbHome: 'Home',
    crumbProgrammes: 'Programmes',
    crumbCurrent: '6-Month Professional',
    badge: '6-Month Professional Programme · 480 training hours',
    titleStart: 'Develop ',
    titleEm: 'professional',
    titleEnd: ' skills in eco-spiritual tourism and hospitality.',
    partLinks: [
      { numeral: 'I', title: 'Part I · Eco-Spiritual Tourism', months: 'Months 1–3' },
      { numeral: 'II', title: 'Part II · Eco-Spiritual Hospitality', months: 'Months 4–6' },
    ],
  },
  curriculum: {
    eyebrow: 'Curriculum',
    headingStart: 'Two parts, six ',
    headingEm: 'months',
    headingEnd: '',
    parts: [
      {
        tab: 'Part I · Months 1–3',
        title: 'Part I — Eco-Spiritual Tourism',
        months: [
          { label: 'Month 1', title: 'Foundations', text: 'Foundations of eco-spiritual tourism, ecosystems and biodiversity, spiritual traditions and sustainable tourism.' },
          { label: 'Month 2', title: 'Planning & design', text: 'Destination planning, itinerary design, ethical tourism, community participation and tourism marketing.' },
          { label: 'Month 3', title: 'Operations & experience', text: 'Tour operations, guiding, storytelling, destination experience design and tourism project work.' },
        ],
      },
      {
        tab: 'Part II · Months 4–6',
        title: 'Part II — Eco-Spiritual Hospitality',
        months: [
          { label: 'Month 4', title: 'Hospitality foundations', text: 'Hospitality foundations, front office, guest relations and housekeeping.' },
          { label: 'Month 5', title: 'Service & wellness', text: 'Food and beverage service, resort operations, wellness hospitality and retreats.' },
          { label: 'Month 6', title: 'Quality & practice', text: 'Sustainable hospitality, safety and quality, hospitality marketing, industry training and final project.' },
        ],
      },
    ],
  },
  outcomes: {
    eyebrow: 'Learning outcomes',
    headingStart: 'Skills for ',
    headingEm: 'professional',
    headingEnd: ' practice',
    intro: 'Participants develop professional-level practical skills and greater responsibility in tourism, hospitality, caregiving and entrepreneurial activities, including:',
    items: v(
      'Tourism planning and itinerary design',
      'Guest services and hospitality operations',
      'Responsible and sustainable tourism practice',
      'Digital marketing for tourism and hospitality',
      'Teamwork and communication',
      'Business concepts for tourism enterprises',
      'International caregiving',
      'TESH Home practical training',
    ),
  },
  project: {
    eyebrow: 'Final project',
    heading: 'Design a concept of your own',
    intro: 'Students develop one of the following, bringing together both parts of the programme:',
    options: v('Eco-spiritual resort', 'Wellness retreat', 'Tourism package', 'Community-based tourism project', 'Sustainable hospitality business concept'),
    exposureLabel: 'Industry exposure',
    exposureText: 'depends on partner arrangements.',
    teshLabel: 'TESH Home practical training',
    teshText: 'is part of this level where available.',
  },
  summary: {
    eyebrow: 'At a glance',
    rows: SUMMARY_ROWS('6 months', '480', 'Learn · Practise · Operate · Take responsibility', 'Plus Two / Higher Secondary or equivalent, as stated in the curriculum'),
    enquireButton: 'Enquire About the Six-Month Programme',
    compareButton: 'Compare programmes',
  },
  pager: {
    prevLabel: '← Previous level',
    prevTitle: '3-Month Foundation',
    nextLabel: 'Next level →',
    nextTitle: '1-Year Advanced',
  },
};

export const PROGRAMME_1Y_DEFAULTS = {
  hero: {
    crumbHome: 'Home',
    crumbProgrammes: 'Programmes',
    crumbCurrent: '1-Year Advanced',
    badge: '1-Year Advanced Programme · 960 training hours',
    titleStart: 'Develop ',
    titleEm: 'advanced',
    titleEnd: ' capabilities in tourism and hospitality management.',
    partsList: v('Part A — Tourism Studies', 'Part B — Hospitality Studies', 'Part C — Integration and Professional Practice'),
  },
  structure: {
    eyebrow: 'Programme structure',
    headingStart: 'Three parts, one ',
    headingEm: 'integrated',
    headingEnd: ' year',
    parts: [
      {
        letter: 'A',
        title: 'Tourism Studies',
        text: 'Understanding destinations and how to design, run and promote meaningful tourism experiences.',
        topics: v('Tourism foundations', 'Ecology', 'Spirituality & culture', 'Destination management', 'Tour design', 'Tour operations', 'Guiding', 'Storytelling', 'Digital tourism marketing'),
      },
      {
        letter: 'B',
        title: 'Hospitality Studies',
        text: 'Running guest-facing operations with quality, care and sustainability.',
        topics: v('Front office', 'Guest relations', 'Housekeeping', 'Food service', 'Resort management', 'Wellness & retreat hospitality', 'Sustainable operations'),
      },
      {
        letter: 'C',
        title: 'Integration & Professional Practice',
        text: 'Bringing it all together through industry practice and enterprise planning.',
        topics: v('Industry training', 'Entrepreneurship', 'Market research', 'Costing', 'Financial planning', 'Risk management', 'Integrated capstone project'),
      },
    ],
  },
  capstone: {
    eyebrow: 'Integrated capstone',
    headingStart: 'Possible capstone ',
    headingEm: 'projects',
    headingEnd: '',
    intro: 'Learners develop an integrated capstone project combining tourism, hospitality and enterprise planning.',
    projects: v('Eco-spiritual resort', 'Wellness retreat', 'Tourism destination experience', 'Community-based tourism initiative', 'Sustainable tourism or hospitality business'),
  },
  outcomes: {
    eyebrow: 'Learning outcomes',
    headingStart: 'Skills to ',
    headingEm: 'manage',
    headingEnd: ' and lead',
    intro: 'Participants develop advanced practical, supervisory, leadership and entrepreneurial capabilities, including:',
    items: v(
      'Destination management',
      'Hospitality operations',
      'Sustainability in tourism and hospitality',
      'Supervision and leadership',
      'Business planning',
      'Project development',
      'Advanced caregiving',
      'TESH Home management',
    ),
  },
  summary: {
    eyebrow: 'At a glance',
    rows: SUMMARY_ROWS('12 months', '960', 'Supervise · Lead · Manage · Create', 'To be confirmed'),
    enquireButton: 'Enquire About the One-Year Programme',
    compareButton: 'Compare programmes',
  },
  pager: {
    prevLabel: '← Previous level',
    prevTitle: '6-Month Professional',
    nextLabel: 'Where it can lead →',
    nextTitle: 'TESH Homes & career pathways',
  },
};

export type Programme3MContent = typeof PROGRAMME_3M_DEFAULTS;
export type Programme6MContent = typeof PROGRAMME_6M_DEFAULTS;
export type Programme1YContent = typeof PROGRAMME_1Y_DEFAULTS;
export type ProgrammeDetailContent = Programme3MContent | Programme6MContent | Programme1YContent;

/** Two-digit list number used by the outcome / capstone lists ("01", "02", ...). */
export const num = (i: number) => String(i + 1).padStart(2, '0');

/** A summary value of exactly "To be confirmed" renders as the TBC tag. */
export const isTbc = (value: string) => value.trim().toLowerCase() === 'to be confirmed';

export function resolveProgrammeDetailContent<T extends ProgrammeDetailContent>(defaults: T, stored: unknown): T {
  return merge(defaults, stored) as T;
}
