import type { Metadata } from 'next';
import About from '@/components/site/About';

export const metadata: Metadata = { title: "About Us" };

export default function Page() {
  return <About />;
}
