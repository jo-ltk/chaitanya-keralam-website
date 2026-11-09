import type { Metadata } from 'next';
import ProgrammeThreeMonth from '@/components/site/ProgrammeThreeMonth';

export const metadata: Metadata = { title: "3-Month Foundation Programme" };

export default function Page() {
  return <ProgrammeThreeMonth />;
}
