import type { Metadata } from 'next';
import TourismPage from '@/components/landing/TourismPage';
import { getTourismContent } from '@/lib/tourism-content';

export const metadata: Metadata = { title: "Eco-Spiritual Peace Tourism" };

// Content comes from the Payload "Eco-Spiritual Tourism page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getTourismContent();
  return <TourismPage content={content} />;
}
