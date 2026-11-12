// Values page content: defaults (the current live copy) + a resolver that overlays
// whatever editors saved in the Payload "Values page" global (/cms).
// Anything left empty in the CMS falls back to these defaults, so the page never breaks.
import { merge } from './landing-content';

export const VALUES_DEFAULTS = {
  header: {
    backLink: '← Chaitanya Keralam',
    heading: 'Values our elders lived by',
    lead: 'Four simple values for a balanced life, and the ones we hope to pass on to our children.',
  },
  values: [
    {
      name: 'Anbu',
      tamil: 'அன்பு',
      meaning: 'Love / Compassion',
      text: 'Loving-kindness, empathy, and unconditional affection toward family, fellow humans, and all living creatures.',
      context: 'In classical Tamil philosophy like the Thirukkural, Anbu is considered the foundational virtue of human life, the fuel that makes a human soul truly alive.',
    },
    {
      name: 'Unmai',
      tamil: 'உண்மை',
      meaning: 'Truth / Honesty',
      text: 'Truthfulness, reality, sincerity, and integrity in thoughts, words, and actions.',
      context: 'Standing firmly by facts and inner truth without deceit or pretense.',
    },
    {
      name: 'Patru',
      tamil: 'பற்று',
      meaning: 'Attachment / Devotion / Loyalty',
      text: 'A deep-seated devotion, attachment, or commitment to a principle, language (Tamil-patru), country (Nattu-patru), or person.',
      context: "It defines a human's sense of duty and loyalty toward what they hold dear, giving direction to one's love and truth.",
    },
    {
      name: 'Pagutharivu',
      tamil: 'பகுத்தறிவு',
      meaning: 'Rationalism / Discernment',
      text: 'Critical thinking, logical reasoning, and analytical intelligence. It literally means the "ability to divide/analyze (pagu) knowledge (arivu)".',
      context: 'A cornerstone of the modern Tamil social reform movement (popularized by leaders like Periyar), Pagutharivu implores individuals to question dogma, reject blind superstitions, and evaluate everything using scientific logic and cause-and-effect reasoning.',
    },
  ],
  furtherReading: {
    heading: 'Further reading',
    text: 'These values are rooted in classical Tamil thought. Read more about the',
    linkText: 'Sangam literature',
    linkUrl: 'https://en.wikipedia.org/wiki/Sangam_literature',
  },
  footer: {
    backHome: 'Back to the home page',
  },
};

export type ValuesContent = typeof VALUES_DEFAULTS;

export function resolveValuesContent(stored: unknown): ValuesContent {
  return merge(VALUES_DEFAULTS, stored) as ValuesContent;
}

export async function getValuesContent(): Promise<ValuesContent> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: 'values', depth: 1 });
    return resolveValuesContent(doc);
  } catch (e) {
    console.error('Values content: falling back to defaults', e);
    return VALUES_DEFAULTS;
  }
}
