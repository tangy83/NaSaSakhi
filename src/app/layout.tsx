// Root Layout
import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import {
  Cormorant_Garamond,
  Open_Sans,
  Nunito,
  Roboto,
} from 'next/font/google';

// ─── Latin fonts (always loaded) ─────────────────────────────────────────────
const heading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const ui = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
});

const technical = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-technical',
  display: 'swap',
});

// Note: Indian-script fonts (Noto Sans Devanagari, Tamil, etc.) are not loaded
// globally. The translation feature is currently parked — see PARKED comments
// in volunteer/languages/page.tsx and volunteer/organizations/[id]/translate/page.tsx.

export const metadata: Metadata = {
  title: 'NaariSamata Sakhi - Organization Registration Portal',
  description: 'Empowering women and vulnerable children across India',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${ui.variable} ${technical.variable}`}
    >
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
