import type { Metadata } from 'next';
import TeshHomesPage from '@/components/landing/TeshHomesPage';

export const metadata: Metadata = { title: "TESH Homes, Careers & Partnerships" };

export default function Page() {
  return <TeshHomesPage />;
}
