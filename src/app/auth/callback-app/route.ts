import { NextRequest } from 'next/server';

// This route handles OAuth callback from native app
// It does a raw HTTP 302 redirect to coduy:// URL scheme
// which opens the app and closes SFSafariViewController
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || '';
  const allParams = req.nextUrl.searchParams.toString();

  // 302 redirect to custom URL scheme - browser follows this
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `coduy://auth/callback?${allParams}`,
      'Cache-Control': 'no-cache, no-store',
    },
  });
}
