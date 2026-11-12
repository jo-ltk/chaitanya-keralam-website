import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { VALUES_DEFAULTS } from '../lib/values-content';
import { build, label } from './Landing';

// Same approach as the Landing global: the editor form is generated from VALUES_DEFAULTS.
export const Values: GlobalConfig = {
  slug: 'values',
  label: 'Values page',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/values'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(VALUES_DEFAULTS).map((k) => ({
        label: label(k),
        fields: [build(k, (VALUES_DEFAULTS as any)[k])],
      })),
    },
  ],
};
