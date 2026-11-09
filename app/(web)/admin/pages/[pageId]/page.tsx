import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminApp from '@/components/admin/AdminApp';

const PAGES = ['home', 'about', 'tourism', 'programmes', 'm3', 'm6', 'm12', 'tesh'];

export const metadata: Metadata = { title: 'Edit page' };

export function generateStaticParams() {
  return PAGES.map((pageId) => ({ pageId }));
}

export default async function Page({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  if (!PAGES.includes(pageId)) notFound();
  return <AdminApp view="pageEdit" page={pageId} />;
}
