import type { Metadata } from 'next';
import LegalPage from '@/components/landing/LegalPage';
import { getLegalContent } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms for using the Chaitanya Keralam website and sending us an enquiry.',
};

// Content comes from the Payload "Terms of use" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getLegalContent('terms');
  return <LegalPage content={content} />;
}
