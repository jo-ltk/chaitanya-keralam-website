// Server-only loader for the programme detail page globals (kept apart so client code never bundles Payload).
import { resolveProgrammeDetailContent, type ProgrammeDetailContent } from './programme-detail-content';

export async function getProgrammeDetailContent<T extends ProgrammeDetailContent>(
  slug: 'programme-3-month' | 'programme-6-month' | 'programme-1-year',
  defaults: T,
): Promise<T> {
  try {
    const { getPayload } = await import('payload');
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({ slug: slug as any, depth: 1 });
    return resolveProgrammeDetailContent(defaults, doc);
  } catch (e) {
    console.error(`Programme detail content (${slug}): falling back to defaults`, e);
    return defaults;
  }
}
