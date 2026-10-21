import type { Metadata } from 'next';
import Programmes from '@/components/site/Programmes';

export const metadata: Metadata = { title: "TESH Skill Development Programmes" };

export default function Page() {
  return <Programmes />;
}
