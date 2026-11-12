import type { Metadata } from 'next';
import AboutPage from '@/components/landing/AboutPage';
import { getAboutContent } from '@/lib/about-content';

export const metadata: Metadata = { title: "About Us" };

// Content comes from the Payload "About page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getAboutContent();
  return <AboutPage content={content} />;
}
