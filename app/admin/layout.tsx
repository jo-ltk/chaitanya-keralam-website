import type { Metadata } from 'next';
import '../styles/admin.css';

/* PROTOTYPE: this interface uses sample data and simulates every action.
   Before going live, protect /admin on the server (see README: "Making the admin panel real"). */
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Chaitanya Keralam Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
