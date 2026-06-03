import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { serviceClient } from '@/lib/supabase/service'
import { createUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { TOKEN_TTL_MS } from '@/app/api/auth/login/route'

export const dynamic = 'force-dynamic'

const TOKEN_RE = /^[0-9a-f]{32}$/

// GET /api/auth/callback?token={token}
// Tokeni tekshirib, mb_user cookie qo'yadi va yo'naltiradi
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || !TOKEN_RE.test(token)) {
    return NextResponse.redirect(new URL('/profile', req.url))
  }

  const minCreatedAt = new Date(Date.now() - TOKEN_TTL_MS).toISOString()

  const { data } = await serviceClient
    .from('auth_tokens')
    .select('role, user_id')
    .eq('token', token)
    .not('user_id', 'is', null)
    .gte('created_at', minCreatedAt)
    .maybeSingle()

  if (!data?.user_id || !data?.role) {
    return NextResponse.redirect(new URL('/profile?error=expired', req.url))
  }

  // Tokenni o'chirish (bir martali)
  await serviceClient.from('auth_tokens').delete().eq('token', token)

  const sessionToken = await createUserToken({
    id:   data.user_id,
    role: data.role as 'seller' | 'buyer',
  })

  const dest = data.role === 'seller' ? '/seller' : '/profile'
  const res  = NextResponse.redirect(new URL(dest, req.url))

  res.cookies.set(USER_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 30,  // 30 kun
    path:     '/',
  })

  return res
}
