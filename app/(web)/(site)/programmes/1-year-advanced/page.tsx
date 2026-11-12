import type { Metadata } from 'next';
import ProgrammeOneYear from '@/components/site/ProgrammeOneYear';
import { PROGRAMME_1Y_DEFAULTS } from '@/lib/programme-detail-content';
import { getProgrammeDetailContent } from '@/lib/programme-detail-content-server';

export const metadata: Metadata = { title: "1-Year Advanced Programme" };

// Content comes from the Payload "1-Year Advanced page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getProgrammeDetailContent('programme-1-year', PROGRAMME_1Y_DEFAULTS);
  return <ProgrammeOneYear content={content} />;
}
