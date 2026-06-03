import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/admin-session'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin routes ──────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value

    if (pathname === '/admin/login') {
      if (token && await verifyAdminSession(token)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }

    if (!token || !(await verifyAdminSession(token))) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // ── Seller routes ─────────────────────────────────────────────────────
  if (pathname.startsWith('/seller')) {
    const cookie  = req.cookies.get(USER_SESSION_COOKIE)?.value
    const session = cookie ? await verifyUserToken(cookie) : null
    if (!session || session.role !== 'seller') {
      return NextResponse.redirect(new URL('/profile', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
