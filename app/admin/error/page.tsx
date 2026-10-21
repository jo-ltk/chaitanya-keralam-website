import type { Metadata } from 'next';
import AuthFlow from '@/components/admin/AuthFlow';

export const metadata: Metadata = { title: "Sign-in error" };

export default function Page() {
  return <AuthFlow screen="error" />;
}
