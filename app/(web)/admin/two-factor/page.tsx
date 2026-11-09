import type { Metadata } from 'next';
import AuthFlow from '@/components/admin/AuthFlow';

export const metadata: Metadata = { title: "Two-step verification" };

export default function Page() {
  return <AuthFlow screen="otp" />;
}
