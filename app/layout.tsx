import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rental Manager',
  description: 'Florida rental property management for small landlords.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
