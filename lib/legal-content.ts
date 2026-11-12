// Privacy policy and Terms of use: defaults (the live copy) + resolvers that overlay whatever
// editors saved in the Payload "Privacy policy" / "Terms of use" globals (/cms).
// Anything left empty in the CMS falls back to these defaults, so the pages never break.
//
// Section bodies are plain text: a blank line starts a new paragraph, lines starting with "- "
// become a bullet list, and [link text](/path) becomes a link.
// Contact details at the end of each page come from the "Site settings" global (footer).
import { merge } from './cms-merge';

export const PRIVACY_DEFAULTS = {
  header: {
    label: 'Legal',
    heading: 'Privacy policy',
    lead: 'What we collect when you contact us, why we collect it, and the choices you have.',
    updated: '12 November 2026',
  },
  sections: [
    {
      heading: 'Who we are',
      body:
        'Chaitanya Keralam is an Eco-Spiritual Peace Tourism initiative based at Edex Edupark, Kochi, Kerala, India. This policy explains how we handle personal data collected through this website.\n\n' +
        'For the purposes of the Digital Personal Data Protection Act, 2023 (DPDP Act), Chaitanya Keralam is the Data Fiduciary for the personal data you share with us here. This policy also follows the Information Technology Act, 2000 and the rules made under it.',
    },
    {
      heading: 'What we collect',
      body:
        'We only collect what you choose to give us, plus the minimum technical data needed to run the website safely.\n\n' +
        'When you send an enquiry, an admission enquiry for the TESH Skill Development Programmes, a TESH Homes or partnership enquiry, we collect:\n' +
        '- your name and email address\n' +
        '- your phone number and district, if you give them\n' +
        '- the type of enquiry and the programme or interest you choose\n' +
        '- your message\n' +
        '- your consent, and the date and time you sent the form\n\n' +
        'When you visit the website, our hosting and security providers process technical data such as your IP address, browser type and the pages requested. This is used to deliver the pages and to protect the forms from spam and automated abuse.\n\n' +
        'We do not use analytics, advertising or tracking cookies, and we do not build profiles of visitors.',
    },
    {
      heading: 'Why we use it',
      body:
        'We use your personal data only to:\n' +
        '- reply to your enquiry and follow up on it with you\n' +
        '- consider and process admission enquiries for our programmes\n' +
        '- discuss TESH Homes, homeowner and partnership proposals you send us\n' +
        '- keep the website and its forms secure\n' +
        '- meet our obligations under Indian law\n\n' +
        'We rely on the consent you give when you tick the box on our forms. We do not sell your data, and we do not send you marketing messages unless you ask us to.',
    },
    {
      heading: 'Who we share it with',
      body:
        'Your enquiry is seen only by the Chaitanya Keralam team members who handle enquiries. We use a small number of service providers to run the website, and they process data only on our instructions:\n' +
        '- Supabase, to store enquiries and website files\n' +
        '- Vercel, to host the website\n' +
        '- Resend, to send enquiry notifications to our team by email\n' +
        '- Cloudflare Turnstile, to check that forms are sent by people, not bots\n' +
        '- Google Fonts, to load the typeface used on the site (Google receives your IP address when the font loads)\n\n' +
        'Some of these providers may store or process data on servers outside India. We choose providers that protect data with recognised security standards.\n\n' +
        'We may also disclose personal data if the law requires it, for example in response to a valid request from a court or government authority.',
    },
    {
      heading: 'How long we keep it',
      body:
        'We keep an enquiry for as long as we need it to respond to you and to follow up on it, and for no longer than 24 months after our last contact with you, unless you join a programme or the law requires us to keep it longer.\n\n' +
        'If you withdraw your consent or ask us to delete your data, we will erase it unless we are legally required to keep it.',
    },
    {
      heading: 'How we protect it',
      body:
        'The website uses encrypted connections (HTTPS). Enquiries are stored in a secured database that only authorised team members can open, each with their own login and two-factor authentication. Forms are protected against automated abuse.\n\n' +
        'No system is completely secure. If a personal data breach happens, we will inform the people affected and the Data Protection Board of India as the law requires.',
    },
    {
      heading: 'Your rights',
      body:
        'Under the DPDP Act you have the right to:\n' +
        '- ask for a summary of the personal data we hold about you and how we use it\n' +
        '- ask us to correct, complete or update your data\n' +
        '- ask us to erase your data\n' +
        '- withdraw your consent at any time, as easily as you gave it\n' +
        '- have a grievance about our handling of your data addressed by us\n' +
        '- nominate another person to exercise these rights for you if you die or become unable to do so\n\n' +
        'To use any of these rights, write to us using the contact details at the end of this page. We will reply as soon as we can, and in any case within the time the law allows. Withdrawing consent does not affect anything we did with your data before you withdrew it.\n\n' +
        'If you are not satisfied with our response, you may complain to the Data Protection Board of India.',
    },
    {
      heading: 'Children',
      body:
        'This website is meant for adults. Our skill development programmes are for people aged 18 to 29. We do not knowingly collect personal data from anyone under 18. If you are planning a journey for your family, a parent or guardian should send the enquiry. If you believe a child has sent us their data, contact us and we will delete it.',
    },
    {
      heading: 'Cookies',
      body:
        'We do not use cookies to track or advertise to you. Our team’s sign-in pages use strictly necessary cookies to keep staff logged in. The form security check may store short-lived technical data that it needs in order to work.',
    },
    {
      heading: 'Other websites',
      body:
        'Our pages link to other websites and apps, such as WhatsApp, Instagram, Facebook, X, LinkedIn and Kerala Tourism. When you follow those links, the other service’s own privacy policy applies, not this one.',
    },
    {
      heading: 'Changes to this policy',
      body:
        'We may update this policy when our website or the law changes. The date at the top of this page shows when it was last updated. If we make a significant change, we will say so on the website.',
    },
  ],
  contact: {
    heading: 'Contact and grievances',
    text: 'For questions about this policy, to use your rights or to raise a grievance, write to us or call us. Please mention “Privacy” in your message.',
  },
};

export const TERMS_DEFAULTS = {
  header: {
    label: 'Legal',
    heading: 'Terms of use',
    lead: 'The simple rules for using this website and sending us an enquiry.',
    updated: '12 November 2026',
  },
  sections: [
    {
      heading: 'About these terms',
      body:
        'These terms apply to your use of the Chaitanya Keralam website. By using the website you agree to them. If you do not agree, please do not use the website.\n\n' +
        'In these terms, “we”, “us” and “our” mean Chaitanya Keralam, Edex Edupark, Kochi, Kerala, India, and “you” means anyone who uses the website.',
    },
    {
      heading: 'What this website is for',
      body:
        'This website shares information about Eco-Spiritual Peace Tourism in Kerala, the TESH Skill Development Programmes, the TESH Homes initiative and the values we live by. It lets you send us an enquiry.\n\n' +
        'The website is for information only. It is not a booking engine, and nothing on it is a binding offer. TESH Homes is described as a proposed pilot and is not a completed development. Programme content, schedules and eligibility may change.',
    },
    {
      heading: 'Enquiries and applications',
      body:
        'Sending an enquiry or an admission enquiry does not create a booking or a contract, and does not guarantee a place on a programme.\n\n' +
        'If we offer you a place on a programme, a stay or a journey, we will confirm the details in writing, including any fees, dates, payment terms and cancellation or refund rules. Those written terms will apply to that arrangement, alongside these terms.\n\n' +
        'Please make sure the information you send us is true and complete, and that you have permission to share any details about other people, such as family members.',
    },
    {
      heading: 'Travel and stays',
      body:
        'If you travel or stay with us, you are responsible for your own travel documents, visas, travel insurance and health precautions. Please respect local customs, places of worship of every faith, the people who host you and the natural environment.',
    },
    {
      heading: 'Using the website',
      body:
        'You agree not to:\n' +
        '- use the website for anything unlawful or harmful\n' +
        '- send false information, spam, or someone else’s details without their permission\n' +
        '- try to break, overload or get around the security of the website or its forms\n' +
        '- copy content from the website in bulk by automated means\n' +
        '- try to access the staff areas of the website without authorisation\n\n' +
        'We may block access to anyone who breaks these rules.',
    },
    {
      heading: 'Our content',
      body:
        'The text, photographs, logo and design of this website belong to Chaitanya Keralam or are used with permission. You may view and share pages for personal, non-commercial use. Please ask us before reusing our content in any other way.\n\n' +
        'The names Chaitanya Keralam and TESH, and our logo, may not be used in a way that suggests we endorse you or your business.',
    },
    {
      heading: 'Accuracy of information',
      body:
        'We take care to keep the website accurate and up to date, but we cannot guarantee that every detail is complete or current. Details about places, seasons, timings and third-party services can change. Please confirm anything important with us before you rely on it.',
    },
    {
      heading: 'Links to other websites',
      body:
        'The website links to other websites and apps, such as Kerala Tourism, the Kochi-Muziris Biennale, WhatsApp and social media. We do not control them and are not responsible for their content or how they handle your data.',
    },
    {
      heading: 'Our responsibility to you',
      body:
        'We provide the website “as is”. We are not responsible for losses that come from using the website, from it being unavailable, or from relying on general information on it, to the extent the law allows.\n\n' +
        'Nothing in these terms limits any right you have under the Consumer Protection Act, 2019 or any other law that cannot be limited by agreement.',
    },
    {
      heading: 'Your privacy',
      body:
        'Our [privacy policy](/privacy) explains how we collect and use personal data you share with us through the website.',
    },
    {
      heading: 'Changes to these terms',
      body:
        'We may update these terms from time to time. The date at the top of this page shows when they were last updated. The version on the website when you use it is the one that applies.',
    },
    {
      heading: 'Governing law',
      body:
        'These terms are governed by the laws of India. Any dispute will be handled by the courts at Kochi (Ernakulam), Kerala.',
    },
  ],
  contact: {
    heading: 'Contact us',
    text: 'If you have a question about these terms, write to us or call us.',
  },
};

export type LegalContent = typeof PRIVACY_DEFAULTS;

const DEFAULTS = { privacy: PRIVACY_DEFAULTS, terms: TERMS_DEFAULTS } as const;
export type LegalSlug = keyof typeof DEFAULTS;

export function resolveLegalContent(slug: LegalSlug, stored: unknown): LegalContent {
  return merge(DEFAULTS[slug], stored) as LegalContent;
}

export async function getLegalContent(slug: LegalSlug): Promise<LegalContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug, depth: 1 });
    return resolveLegalContent(slug, doc);
  } catch (e) {
    console.error(`Legal content (${slug}): falling back to defaults`, e);
    return DEFAULTS[slug];
  }
}
