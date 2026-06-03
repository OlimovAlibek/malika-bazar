import { NextResponse } from 'next/server'
import { serviceClient } from '@/lib/supabase/service'
import { createUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'

export const dynamic = 'force-dynamic'

const PHONE_RE = /^\+\d{9,15}$/
const OTP_RE   = /^\d{6}$/
const TTL_MS   = 5 * 60 * 1000  // 5 daqiqa

// POST /api/auth/verify-otp
// Body: { phone: string, otp: string }
export async function POST(req: Request) {
  const body  = await req.json().catch(() => null)
  const phone = (body?.phone ?? '').trim()
  const otp   = (body?.otp   ?? '').trim()

  if (!PHONE_RE.test(phone) || !OTP_RE.test(otp)) {
    return NextResponse.json({ error: 'Ma\'lumotlar noto\'g\'ri' }, { status: 400 })
  }

  const minCreatedAt = new Date(Date.now() - TTL_MS).toISOString()

  const { data } = await serviceClient
    .from('auth_tokens')
    .select('token, role, user_id')
    .eq('phone', phone)
    .eq('otp', otp)
    .gte('created_at', minCreatedAt)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data?.user_id || !data?.role) {
    return NextResponse.json({ error: 'Kod xato yoki muddati o\'tdi' }, { status: 401 })
  }

  // Bir martali — o'chirish
  await serviceClient.from('auth_tokens').delete().eq('token', data.token)

  const sessionToken = await createUserToken({
    id:   data.user_id,
    role: data.role as 'seller' | 'buyer',
  })

  const dest = data.role === 'seller' ? '/seller' : '/profile'
  const res  = NextResponse.json({ success: true, dest })

  res.cookies.set(USER_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 30,
    path:     '/',
  })

  return res
}
