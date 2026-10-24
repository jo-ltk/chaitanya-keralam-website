import type { ReactNode } from 'react';
import { Albert_Sans } from 'next/font/google';
import '../styles/ck-landing.css';

const albert = Albert_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], display: 'swap' });

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <div className={albert.className}>{children}</div>;
}
