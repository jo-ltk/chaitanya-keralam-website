import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { TOURISM_DEFAULTS } from '../lib/tourism-content';
import { build, label } from './Landing';

// Same approach as the Landing global: the editor form is generated from TOURISM_DEFAULTS.
export const Tourism: GlobalConfig = {
  slug: 'tourism',
  label: 'Eco-Spiritual Tourism page',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/eco-spiritual-tourism'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(TOURISM_DEFAULTS).map((k) => ({
        label: label(k),
        fields: [build(k, (TOURISM_DEFAULTS as any)[k])],
      })),
    },
  ],
};
