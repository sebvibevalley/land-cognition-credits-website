import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LAND Cognition Credit Claim Portal',
    template: '%s | LAND Cognition Credit Claim Portal',
  },
  description:
    'Check your LAND ownership on Polygon and see eligibility for LAND Cognition Credits. Credit amounts come from a distributor contract that is not live yet.',
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
