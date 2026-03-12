// Root Layout
import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
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

export const metadata: Metadata = {
  title: 'NaariSamata Saathi - Organization Registration Portal',
  description: 'Empowering women and vulnerable children across India',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${heading.variable} ${body.variable} ${ui.variable} ${technical.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
