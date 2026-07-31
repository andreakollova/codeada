import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Let auth callback through — page.tsx handles code exchange
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/callback'],
};
