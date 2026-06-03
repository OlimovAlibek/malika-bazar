import { NextRequest, NextResponse } from 'next/server'
import { signAdminSession, ADMIN_SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const validUser = process.env.ADMIN_USERNAME
  const validPass = process.env.ADMIN_PASSWORD

  if (!validUser || !validPass || username !== validUser || password !== validPass) {
    return NextResponse.json(
      { error: "Login yoki parol noto'g'ri" },
      { status: 401 }
    )
  }

  const token = await signAdminSession()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return res
}
