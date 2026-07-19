import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams, hash } = req.nextUrl;

  // When auth callback comes from native app, redirect to coduy:// immediately
  // This happens BEFORE any React/page code loads
  if (pathname === '/auth/callback' && searchParams.get('from') === 'app') {
    // Get the code param (PKCE flow) - Supabase puts it in query params
    const code = searchParams.get('code');
    if (code) {
      // Redirect to custom URL scheme with the code
      return NextResponse.redirect(`coduy://auth/callback?code=${code}`);
    }
    // Fallback: redirect without code (tokens might be in hash, handled client-side)
    return NextResponse.redirect('coduy://auth/callback');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/callback'],
};
