import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coduy — Learn to Code',
  description: 'Learn programming with interactive lessons, theory, and hands-on coding exercises.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
