import type { Metadata } from 'next';
import TourismPage from '@/components/landing/TourismPage';

export const metadata: Metadata = { title: "Eco-Spiritual Peace Tourism" };

export default function Page() {
  return <TourismPage />;
}
