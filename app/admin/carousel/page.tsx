import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';

export const metadata: Metadata = { title: "Homepage carousel" };

export default function Page() {
  return <AdminApp view="carousel" />;
}
