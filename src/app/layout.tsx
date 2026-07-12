import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get('host') || '';
  const isSk = host.endsWith('.sk');

  return {
    title: isSk ? 'Coduy - Nauč sa programovať' : 'Coduy - Learn to Code',
    description: isSk
      ? 'Nauč sa programovať s interaktívnymi lekciami, teóriou a praktickými cvičeniami. Python, web development a viac - zadarmo.'
      : 'Learn programming with interactive lessons, theory, and hands-on coding exercises. Python, web development and more - for free.',
    keywords: isSk
      ? ['programovanie', 'python', 'kurz', 'lekcie', 'coduy', 'nauč sa programovať', 'zadarmo']
      : ['programming', 'python', 'course', 'lessons', 'coduy', 'learn to code', 'free'],
    openGraph: {
      title: isSk ? 'Coduy - Nauč sa programovať' : 'Coduy - Learn to Code',
      description: isSk
        ? 'Interaktívne lekcie programovania - Python, web development a viac.'
        : 'Interactive programming lessons - Python, web development and more.',
      siteName: 'Coduy',
      type: 'website',
    },
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
  };
}

import BottomNav from '@/components/BottomNav';
import LocaleInit from '@/components/LocaleInit';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const host = headerList.get('host') || '';
  const lang = host.endsWith('.sk') ? 'sk' : 'en';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, background: '#0A0A0A' }}>
        <LocaleInit />
        <BottomNav />
        {children}
      </body>
    </html>
  );
}
