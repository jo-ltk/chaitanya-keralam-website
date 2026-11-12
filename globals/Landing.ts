import type { Field, GlobalConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { LANDING_DEFAULTS } from '../lib/landing-content';

// The editor form is generated from LANDING_DEFAULTS, so the CMS always shows the
// current live text/images and the schema can't drift from the defaults.

export const label = (k: string) =>
  k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace(/\bUrl\b/, 'URL');

const isImg = (d: any) => d && typeof d === 'object' && 'url' in d && 'alt' in d && Object.keys(d).length === 2;

export function build(name: string, def: any): Field {
  if (Array.isArray(def)) {
    const item = def[0];
    return {
      name,
      label: label(name),
      type: 'array',
      defaultValue: def,
      fields: typeof item === 'object' ? fieldsOf(item) : [{ name: 'value', type: 'text' }],
    } as Field;
  }
  if (isImg(def)) {
    return {
      name,
      label: label(name),
      type: 'group',
      fields: [
        { name: 'image', label: 'Upload new image (replaces the current one)', type: 'upload', relationTo: 'media' },
        { name: 'url', label: 'Current image address', type: 'text', defaultValue: def.url },
        { name: 'alt', label: 'Image description (alt text)', type: 'text', defaultValue: def.alt },
      ],
    };
  }
  if (def && typeof def === 'object') {
    return { name, label: label(name), type: 'group', fields: fieldsOf(def) };
  }
  const long = typeof def === 'string' && (def.length > 90 || def.includes('\n'));
  return { name, label: label(name), type: long ? 'textarea' : 'text', defaultValue: def } as Field;
}

const fieldsOf = (obj: Record<string, any>): Field[] => Object.keys(obj).map((k) => build(k, obj[k]));

export const Landing: GlobalConfig = {
  slug: 'landing',
  label: 'Landing page',
  access: { read: () => true },
  hooks: { afterChange: [() => { try { revalidatePath('/'); } catch {} }] },
  fields: [
    {
      type: 'tabs',
      tabs: Object.keys(LANDING_DEFAULTS).filter((k) => k !== 'footer').map((k) => ({
        label: label(k),
        fields: [build(k, (LANDING_DEFAULTS as any)[k])],
      })),
    },
    // The footer is now edited in "Site settings". The old field stays (hidden) so the DB schema is
    // unchanged and anything saved here earlier is still used as the fallback.
    { ...(build('footer', LANDING_DEFAULTS.footer) as any), admin: { hidden: true } },
  ],
};
