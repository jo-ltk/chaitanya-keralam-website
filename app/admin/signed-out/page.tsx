import type { Metadata } from 'next';
import AuthFlow from '@/components/admin/AuthFlow';

export const metadata: Metadata = { title: "Signed out" };

export default function Page() {
  return <AuthFlow screen="logout" />;
}
