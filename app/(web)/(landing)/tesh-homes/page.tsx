import type { Metadata } from 'next';
import TeshHomesPage from '@/components/landing/TeshHomesPage';
import { getTeshHomesContent } from '@/lib/tesh-homes-content';

export const metadata: Metadata = { title: "TESH Homes, Careers & Partnerships" };

// Content comes from the Payload "TESH Homes page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getTeshHomesContent();
  return <TeshHomesPage content={content} />;
}
