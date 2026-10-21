import type { Metadata } from 'next';
import TeshHomes from '@/components/site/TeshHomes';

export const metadata: Metadata = { title: "TESH Homes, Careers & Partnerships" };

export default function Page() {
  return <TeshHomes />;
}
