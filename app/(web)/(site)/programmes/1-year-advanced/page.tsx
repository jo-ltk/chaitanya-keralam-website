import type { Metadata } from 'next';
import ProgrammeOneYear from '@/components/site/ProgrammeOneYear';

export const metadata: Metadata = { title: "1-Year Advanced Programme" };

export default function Page() {
  return <ProgrammeOneYear />;
}
