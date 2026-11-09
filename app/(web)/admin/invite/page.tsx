import type { Metadata } from 'next';
import AuthFlow from '@/components/admin/AuthFlow';

export const metadata: Metadata = { title: "Accept invitation" };

export default function Page({ searchParams }: { searchParams?: { token?: string } }) {
  return <AuthFlow screen="invite" token={searchParams?.token} />;
}
