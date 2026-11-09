import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <AdminApp view="dashboard" />;
}
