import type { Metadata } from 'next';
import AuthFlow from '@/components/admin/AuthFlow';

export const metadata: Metadata = { title: "Sign-in paused" };

export default function Page() {
  return <AuthFlow screen="locked" />;
}
