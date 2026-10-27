import type { ReactNode } from 'react';
import '../styles/ck-landing.css';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500&display=swap"
      />
      {children}
      <WhatsAppButton />
    </>
  );
}

