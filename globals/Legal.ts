import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { PRIVACY_DEFAULTS, TERMS_DEFAULTS } from '../lib/legal-content';
import { build, label } from './Landing';

// Same approach as the Landing global: each editor form is generated from the page's defaults.
function legalGlobal(slug: string, title: string, path: string, defaults: Record<string, any>): GlobalConfig {
  return {
    slug,
    label: title,
    admin: { group: 'Legal pages' },
    access: { read: () => true },
    hooks: { afterChange: [() => { try { revalidatePath(path); } catch {} }] },
    fields: [
      {
        type: 'tabs',
        tabs: Object.keys(defaults).map((k) => ({
          label: label(k),
          fields: [build(k, defaults[k])],
        })),
      },
    ],
  };
}

export const Privacy = legalGlobal('privacy', 'Privacy policy', '/privacy', PRIVACY_DEFAULTS);
export const Terms = legalGlobal('terms', 'Terms of use', '/terms', TERMS_DEFAULTS);
