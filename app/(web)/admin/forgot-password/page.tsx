import type { Metadata } from 'next';
import AuthFlow from '@/components/admin/AuthFlow';

export const metadata: Metadata = { title: "Forgot password" };

export default function Page() {
  return <AuthFlow screen="forgot" />;
}
