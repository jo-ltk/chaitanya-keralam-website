// Pure helpers shared by every page's content defaults. No Payload imports here, so client
// components can import page defaults safely.

export type Img = { url: string; alt: string };
export const img = (url: string, alt: string): Img => ({ url, alt });

const isImg = (d: any) => d && typeof d === 'object' && 'url' in d && 'alt' in d && Object.keys(d).length === 2;

// Overlay what editors saved on top of the defaults; empty values fall back to the default.
export function merge(def: any, stored: any): any {
  if (Array.isArray(def)) {
    if (!Array.isArray(stored) || stored.length === 0) return def;
    return stored.map((s, i) => merge(def[i] ?? def[0], s));
  }
  if (isImg(def)) {
    const uploaded = stored?.image && typeof stored.image === 'object' ? stored.image.url : '';
    return {
      url: uploaded || (typeof stored?.url === 'string' && stored.url) || def.url,
      alt: typeof stored?.alt === 'string' && stored.alt !== '' ? stored.alt : def.alt,
    };
  }
  if (def && typeof def === 'object') {
    const out: any = {};
    for (const k of Object.keys(def)) out[k] = merge(def[k], stored?.[k]);
    return out;
  }
  return typeof stored === 'string' && stored !== '' ? stored : def;
}
