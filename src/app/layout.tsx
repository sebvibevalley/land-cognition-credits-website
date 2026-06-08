import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LAND Cognition Credit Claim Portal',
    template: '%s | LAND Cognition Credit Claim Portal',
  },
  description: 'Mock frontend for checking eligibility and claiming LAND Cognition Credits.',
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}