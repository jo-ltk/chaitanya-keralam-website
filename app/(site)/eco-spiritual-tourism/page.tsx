import type { Metadata } from 'next';
import EcoSpiritualTourism from '@/components/site/EcoSpiritualTourism';

export const metadata: Metadata = { title: "Eco-Spiritual Peace Tourism" };

export default function Page() {
  return <EcoSpiritualTourism />;
}
