import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
  const store = await cookies()
  store.delete('mb_user')

  return NextResponse.redirect(new URL('/profile', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
}
