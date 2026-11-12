import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { PROGRAMME_1Y_DEFAULTS, PROGRAMME_3M_DEFAULTS, PROGRAMME_6M_DEFAULTS } from '../lib/programme-detail-content';
import { build, label } from './Landing';

// Same approach as the Landing global: each editor form is generated from the page's defaults.
function programmeGlobal(slug: string, title: string, path: string, defaults: Record<string, any>): GlobalConfig {
  return {
    slug,
    label: title,
    admin: { group: 'Programme pages' },
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

export const Programme3M = programmeGlobal('programme-3-month', '3-Month Foundation page', '/programmes/3-month-foundation', PROGRAMME_3M_DEFAULTS);
export const Programme6M = programmeGlobal('programme-6-month', '6-Month Professional page', '/programmes/6-month-professional', PROGRAMME_6M_DEFAULTS);
export const Programme1Y = programmeGlobal('programme-1-year', '1-Year Advanced page', '/programmes/1-year-advanced', PROGRAMME_1Y_DEFAULTS);
