import type { Metadata, Viewport } from 'next';
import './styles/kneds-tokens.css';
import './styles/kneds-components.css';

export const metadata: Metadata = {
  title: { default: 'Chaitanya Keralam — Eco-Spiritual Peace Tourism', template: '%s — Chaitanya Keralam' },
  description: 'Transforming Kerala into a Global Eco-Spiritual Peace Tourism Destination. TESH Skill Development Programmes in tourism, hospitality, international caregiving and entrepreneurship.',
  icons: { icon: '/images/chaitanya-keralam-logo.png' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#123d32' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
