// Root Layout
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NaariSamata Saathi - Organization Registration Portal',
  description: 'Empowering women and vulnerable children across India',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
