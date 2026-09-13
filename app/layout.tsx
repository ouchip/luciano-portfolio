import type { Metadata, Viewport } from 'next';
import { Geist, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover'};

export const metadata: Metadata = {
  title: 'Luciano Pinilla — Selected work',
  description: 'A personal desktop of selected work and GitHub activity. Fomo Campus, GitHub, and @foezart.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${jakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
