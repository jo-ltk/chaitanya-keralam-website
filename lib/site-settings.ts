// Site-wide settings shared by every page: top menu, footer contact details and social links.
// Edited in the Payload "Site settings" global (/cms). Empty fields fall back to these defaults.

export const SITE_FOOTER_DEFAULTS = {
  promise: "Perhaps the only paradise on earth!\nOne with nature.\nGod's own country.",
  tagline: 'Eco-Spiritual Peace Tourism · Anbu · Unmai · Patru · Pagutharivu',
  address: 'Edex Edupark, Kochi, Kerala',
  phones: [{ value: '+91 90370 16730' }, { value: '+91 85478 18701' }, { value: '+91 99472 47200' }],
  emails: [{ value: 'josephanil2007@gmail.com' }, { value: 'akashjose369@gmail.com' }, { value: 'shajimilan79@gmail.com' }],
};

export const SITE_DEFAULTS = {
  menu: {
    links: [
      { label: 'About', url: '/about' },
      { label: 'Tourism', url: '/eco-spiritual-tourism' },
      { label: 'Programmes', url: '/programmes' },
      { label: 'TESH Homes', url: '/tesh-homes' },
      { label: 'Our values', url: '/values' },
      { label: 'Contact', url: '/#contact' },
    ],
    button: 'Apply now',
    buttonUrl: '/programmes#admissions',
    mobileTagline: 'Perhaps the only paradise on earth! Come, stay a while.',
  },
  footer: SITE_FOOTER_DEFAULTS,
  social: {
    instagramUrl: 'https://www.instagram.com/kerala_peace_tourism?utm_source=qr&obrf=ZXo1cTZ1cG53Mmtx',
    youtubeUrl: '/#plan',
    facebookUrl: 'https://www.facebook.com/p/Chaitanya-Keralam-61596133671951/',
    xUrl: 'https://x.com/KERALAPEACino',
  },
};

export const LINKEDIN_URL = 'https://www.linkedin.com/in/kerala-peace-tourism-281408448/';

export type SiteSettings = typeof SITE_DEFAULTS;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const isExternal = (url: string) => /^https?:\/\//.test(url);
