// Server-only loader for the CMS "Site settings" global (kept apart so client code never bundles Payload).
import { merge } from './cms-merge';
import { SITE_DEFAULTS, type SiteSettings } from './site-settings';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const [site, landing] = await Promise.all([
      payload.findGlobal({ slug: 'site', depth: 0 }),
      payload.findGlobal({ slug: 'landing', depth: 0 }),
    ]);
    // Footer edits saved earlier on the Landing page global still count until overridden here.
    const base = { ...SITE_DEFAULTS, footer: merge(SITE_DEFAULTS.footer, (landing as any)?.footer) };
    return merge(base, site) as SiteSettings;
  } catch (e) {
    console.error('Site settings: falling back to defaults', e);
    return SITE_DEFAULTS;
  }
}
