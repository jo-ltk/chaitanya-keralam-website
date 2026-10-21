import type { Metadata } from 'next';
import ProgrammeSixMonth from '@/components/site/ProgrammeSixMonth';

export const metadata: Metadata = { title: "6-Month Professional Programme" };

export default function Page() {
  return <ProgrammeSixMonth />;
}
