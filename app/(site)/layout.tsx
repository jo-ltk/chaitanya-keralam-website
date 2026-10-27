import Script from 'next/script';
import '../styles/site.css';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WhatsAppButton />
      {/* Scroll reveals, parallax and tab-swap animations; respects prefers-reduced-motion. */}
      <Script src="/motion.js" strategy="afterInteractive" />
    </>
  );
}
