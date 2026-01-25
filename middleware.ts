import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow Telegram webhook without ANY interference
  if (pathname.startsWith('/api/telegram/webhook')) {
    return NextResponse.next();
  }

  // For now, do nothing else
  return NextResponse.next();

}

export const config = {
    matcher: [
      /*
       * Apply middleware to everything EXCEPT:
       * - static files
       * - api routes (except webhook if you want)
       */
      '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
  };