// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     // ❌ EXCLUDE ALL API ROUTES
//     '/((?!api|_next|favicon.ico).*)',
//   ],
// };

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ service role is OK in middleware
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore system routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.split('/').length !== 2
  ) {
    return NextResponse.next();
  }

  const slug = pathname.replace('/', '').toLowerCase();

  // Try to resolve as shop slug
  const { data: shop } = await supabase
    .from('shops')
    .select(`
      slug,
      room:rooms (
        code
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!shop || !Array.isArray(shop.room) || shop.room.length === 0 || !shop.room[0]?.code) {
    return NextResponse.next();
  }

  // Redirect to canonical URL
  const url = req.nextUrl.clone();
  url.pathname = `/${shop.room[0].code}/${shop.slug}`;

  return NextResponse.redirect(url);
}