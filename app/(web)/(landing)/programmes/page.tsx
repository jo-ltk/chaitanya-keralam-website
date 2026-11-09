import type { Metadata } from 'next';
import ProgrammesPage from '@/components/landing/ProgrammesPage';

export const metadata: Metadata = { title: "TESH Skill Development Programmes" };

export default function Page() {
  return <ProgrammesPage />;
}
