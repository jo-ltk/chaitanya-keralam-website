import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { PROGRAMMES_DEFAULTS } from '../lib/programmes-content';
import { build, label } from './Landing';

// Same approach as the Landing global: the editor form is generated from PROGRAMMES_DEFAULTS.
export const Programmes: GlobalConfig = {
  slug: 'programmes',
  label: 'Programmes page',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/programmes'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(PROGRAMMES_DEFAULTS).map((k) => ({
        label: label(k),
        fields: [build(k, (PROGRAMMES_DEFAULTS as any)[k])],
      })),
    },
  ],
};
