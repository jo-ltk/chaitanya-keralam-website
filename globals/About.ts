import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { ABOUT_DEFAULTS } from '../lib/about-content';
import { build, label } from './Landing';

// Same approach as the Landing global: the editor form is generated from ABOUT_DEFAULTS.
export const About: GlobalConfig = {
  slug: 'about',
  label: 'About page',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/about'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(ABOUT_DEFAULTS).map((k) => ({
        label: label(k),
        fields: [build(k, (ABOUT_DEFAULTS as any)[k])],
      })),
    },
  ],
};
