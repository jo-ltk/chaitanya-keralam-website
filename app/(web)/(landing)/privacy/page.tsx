import type { Metadata } from 'next';
import LegalPage from '@/components/landing/LegalPage';
import { getLegalContent } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Chaitanya Keralam collects, uses and protects the personal data you share through this website.',
};

// Content comes from the Payload "Privacy policy" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getLegalContent('privacy');
  return <LegalPage content={content} />;
}
