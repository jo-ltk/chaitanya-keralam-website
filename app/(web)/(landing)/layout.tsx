import type { ReactNode } from 'react';
import '@/app/styles/ck-landing.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';
import { getSiteSettings } from '@/lib/site-settings-server';

export default async function LandingLayout({ children }: { children: ReactNode }) {
  const site = await getSiteSettings();
  return (
    <SiteSettingsProvider value={site}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500&display=swap"
      />
      {children}
      <WhatsAppButton />
    </SiteSettingsProvider>
  );
}
