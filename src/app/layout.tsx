import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Calculator',
  description: 'The calculator you would never want to miss',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='overflow-hidden'>{children}</body>
    </html>
  );
}
