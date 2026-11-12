'use client';
/* Makes the CMS "Site settings" (menu, footer, social links) available to client components. */
import { createContext, useContext, type ReactNode } from 'react';
import { SITE_DEFAULTS, type SiteSettings } from '@/lib/site-settings';

export const SiteSettingsContext = createContext<SiteSettings>(SITE_DEFAULTS);

export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
