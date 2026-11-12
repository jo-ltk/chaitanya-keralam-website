import type { Metadata } from 'next';
import ProgrammeSixMonth from '@/components/site/ProgrammeSixMonth';
import { PROGRAMME_6M_DEFAULTS } from '@/lib/programme-detail-content';
import { getProgrammeDetailContent } from '@/lib/programme-detail-content-server';

export const metadata: Metadata = { title: "6-Month Professional Programme" };

// Content comes from the Payload "6-Month Professional page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getProgrammeDetailContent('programme-6-month', PROGRAMME_6M_DEFAULTS);
  return <ProgrammeSixMonth content={content} />;
}
