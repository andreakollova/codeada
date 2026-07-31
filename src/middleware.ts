import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // When auth callback comes from Capacitor app, redirect to deep link
  // SFSafariViewController will close and iOS will open the app
  if (pathname === '/auth/callback' && searchParams.get('from') === 'app') {
    const code = searchParams.get('code');
    if (code) {
      return NextResponse.redirect(`coduy://auth/callback?code=${code}`);
    }
    return NextResponse.redirect('coduy://auth/callback');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/callback'],
};
