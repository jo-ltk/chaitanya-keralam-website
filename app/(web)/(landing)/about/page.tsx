import type { Metadata } from 'next';
import AboutPage from '@/components/landing/AboutPage';

export const metadata: Metadata = { title: "About Us" };

export default function Page() {
  return <AboutPage />;
}
