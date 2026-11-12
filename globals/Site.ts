import type { GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { SITE_DEFAULTS } from '../lib/site-settings';
import { build, label } from './Landing';

// Menu, footer and social links shared by every page. Saving refreshes the whole site.
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Site settings (menu & footer)',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/', 'layout'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(SITE_DEFAULTS).map((k) => ({
        label: label(k),
        fields: [build(k, (SITE_DEFAULTS as any)[k])],
      })),
    },
  ],
};
