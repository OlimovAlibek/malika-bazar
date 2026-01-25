import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // ❌ EXCLUDE ALL API ROUTES
    '/((?!api|_next|favicon.ico).*)',
  ],
};