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
      ? 'Interaktívna appka na učenie programovania. 200+ lekcií Pythonu, cvičenia, kvízy a projekty. Web, App Store a Google Play.'
      : 'Interactive app for learning to code. 200+ Python lessons, exercises, quizzes and projects. Web, App Store and Google Play.',
    keywords: isSk
      ? ['programovanie', 'python', 'kurz', 'lekcie', 'coduy', 'nauč sa programovať', 'zadarmo', 'slovensky', 'online kurz', 'appka']
      : ['programming', 'python', 'course', 'lessons', 'coduy', 'learn to code', 'free', 'online course', 'coding', 'app'],
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
        ? '200+ lekcií Pythonu, cvičenia, kvízy a projekty.'
        : '200+ Python lessons, exercises, quizzes and projects.',
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
        ? '200+ lekcií Pythonu, cvičenia a projekty.'
        : '200+ Python lessons, exercises and projects.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png', sizes: '180x180' },
        { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      ],
      apple: { url: '/favicon.png', sizes: '180x180' },
      shortcut: '/favicon.png',
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
import AuthGate from '@/components/AuthGate';
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
        <AuthGate>
          <BottomNav />
          {children}
        </AuthGate>
        <Analytics />
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.Capacitor) {
            window.addEventListener('load', function() {
              setTimeout(function() {
                if (window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
                  window.Capacitor.Plugins.SplashScreen.hide();
                }
              }, 300);
            });
            // Handle deep link from Google OAuth callback
            if (window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
              window.Capacitor.Plugins.App.addListener('appUrlOpen', function(event) {
                if (event.url && event.url.startsWith('coduy://auth')) {
                  var params = new URL(event.url.replace('coduy://', 'https://x/')).searchParams;
                  var at = params.get('access_token');
                  var rt = params.get('refresh_token');
                  if (at && rt) {
                    // Set Supabase session from tokens
                    var sb = window.__supabase;
                    if (sb) sb.auth.setSession({ access_token: at, refresh_token: rt });
                    else location.reload();
                  }
                }
              });
            }
          }
        `}} />
      </body>
    </html>
  );
}
