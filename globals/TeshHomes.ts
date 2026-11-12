import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { TESH_HOMES_DEFAULTS } from '../lib/tesh-homes-content';
import { build, label } from './Landing';

// Same approach as the Landing global: the editor form is generated from TESH_HOMES_DEFAULTS.
export const TeshHomes: GlobalConfig = {
  slug: 'tesh-homes',
  label: 'TESH Homes page',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/tesh-homes'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(TESH_HOMES_DEFAULTS).map((k) => ({
        label: label(k),
        fields: [build(k, (TESH_HOMES_DEFAULTS as any)[k])],
      })),
    },
  ],
};
