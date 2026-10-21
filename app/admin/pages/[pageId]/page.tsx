import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminApp from '@/components/admin/AdminApp';

const PAGES = ['home', 'about', 'tourism', 'programmes', 'm3', 'm6', 'm12', 'tesh'];

export const metadata: Metadata = { title: 'Edit page' };

export function generateStaticParams() {
  return PAGES.map((pageId) => ({ pageId }));
}

export default function Page({ params }: { params: { pageId: string } }) {
  if (!PAGES.includes(params.pageId)) notFound();
  return <AdminApp view="pageEdit" page={params.pageId} />;
}
