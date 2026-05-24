import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeByte — Nauč sa programovať',
  description: 'Programovanie v štýle Duolinga. Učíš sa s Byteom, robotom, ktorý ťa nikdy nevzdá.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, background: '#0A0A0A' }}>
        {children}
      </body>
    </html>
  );
}
