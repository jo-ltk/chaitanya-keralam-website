import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';

export const metadata: Metadata = { title: "Activity log" };

export default function Page() {
  return <AdminApp view="activity" />;
}
