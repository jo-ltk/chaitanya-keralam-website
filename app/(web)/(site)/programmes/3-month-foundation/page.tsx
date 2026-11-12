import type { Metadata } from 'next';
import ProgrammeThreeMonth from '@/components/site/ProgrammeThreeMonth';
import { PROGRAMME_3M_DEFAULTS } from '@/lib/programme-detail-content';
import { getProgrammeDetailContent } from '@/lib/programme-detail-content-server';

export const metadata: Metadata = { title: "3-Month Foundation Programme" };

// Content comes from the Payload "3-Month Foundation page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getProgrammeDetailContent('programme-3-month', PROGRAMME_3M_DEFAULTS);
  return <ProgrammeThreeMonth content={content} />;
}
