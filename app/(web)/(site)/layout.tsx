import Script from 'next/script';
import '@/app/styles/site.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';
import { getSiteSettings } from '@/lib/site-settings-server';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <SiteSettingsProvider value={site}>
      {children}
      <WhatsAppButton />
      {/* Scroll reveals, parallax and tab-swap animations; respects prefers-reduced-motion. */}
      <Script src="/motion.js" strategy="afterInteractive" />
    </SiteSettingsProvider>
  );
}
