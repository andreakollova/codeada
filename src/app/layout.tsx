import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get('host') || '';
  const isSk = host.endsWith('.sk');
  const baseUrl = isSk ? 'https://coduy.sk' : 'https://coduy.com';

  return {
    title: {
      default: isSk ? 'Coduy - Nauč sa programovať' : 'Coduy - Learn to Code',
      template: isSk ? '%s - Coduy' : '%s - Coduy',
    },
    description: isSk
      ? 'Nauč sa programovať s interaktívnymi lekciami, teóriou a praktickými cvičeniami. Python, web development a viac - zadarmo.'
      : 'Learn programming with interactive lessons, theory, and hands-on coding exercises. Python, web development and more - for free.',
    keywords: isSk
      ? ['programovanie', 'python', 'kurz', 'lekcie', 'coduy', 'nauč sa programovať', 'zadarmo', 'slovensky', 'online kurz']
      : ['programming', 'python', 'course', 'lessons', 'coduy', 'learn to code', 'free', 'online course', 'coding'],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        'en': 'https://coduy.com',
        'sk': 'https://coduy.sk',
      },
    },
    openGraph: {
      title: isSk ? 'Coduy - Nauč sa programovať' : 'Coduy - Learn to Code',
      description: isSk
        ? 'Interaktívne lekcie programovania - Python, web development a viac.'
        : 'Interactive programming lessons - Python, web development and more.',
      siteName: 'Coduy',
      type: 'website',
      url: baseUrl,
      locale: isSk ? 'sk_SK' : 'en_US',
      alternateLocale: isSk ? 'en_US' : 'sk_SK',
    },
    twitter: {
      card: 'summary_large_image',
      title: isSk ? 'Coduy - Nauč sa programovať' : 'Coduy - Learn to Code',
      description: isSk
        ? 'Interaktívne lekcie programovania zadarmo.'
        : 'Free interactive programming lessons.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
    other: {
      'geo.region': isSk ? 'SK' : 'US',
      'geo.placename': isSk ? 'Slovensko' : 'United States',
      'content-language': isSk ? 'sk' : 'en',
    },
  };
}

import BottomNav from '@/components/BottomNav';
import LocaleInit from '@/components/LocaleInit';
import { Analytics } from '@vercel/analytics/next';

// JSON-LD structured data
function JsonLd({ isSk }: { isSk: boolean }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Coduy',
    url: isSk ? 'https://coduy.sk' : 'https://coduy.com',
    description: isSk
      ? 'Interaktívna platforma na učenie programovania'
      : 'Interactive platform for learning programming',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: isSk ? 'EUR' : 'USD',
    },
    inLanguage: isSk ? 'sk' : 'en',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const host = headerList.get('host') || '';
  const isSk = host.endsWith('.sk');
  const lang = isSk ? 'sk' : 'en';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" hrefLang="en" href="https://coduy.com" />
        <link rel="alternate" hrefLang="sk" href="https://coduy.sk" />
        <link rel="alternate" hrefLang="x-default" href="https://coduy.com" />
        <JsonLd isSk={isSk} />
      </head>
      <body style={{ margin: 0, background: '#0A0A0A' }}>
        <LocaleInit />
        <BottomNav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
