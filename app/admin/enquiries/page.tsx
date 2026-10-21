import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';

export const metadata: Metadata = { title: "Enquiries" };

export default function Page() {
  return <AdminApp view="enquiries" />;
}
