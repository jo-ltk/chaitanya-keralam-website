import type { Metadata } from 'next';
import ProgrammesPage from '@/components/landing/ProgrammesPage';
import { getProgrammesContent } from '@/lib/programmes-content';

export const metadata: Metadata = { title: "TESH Skill Development Programmes" };

// Content comes from the Payload "Programmes page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getProgrammesContent();
  return <ProgrammesPage content={content} />;
}
