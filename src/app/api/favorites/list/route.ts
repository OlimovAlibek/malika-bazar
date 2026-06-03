import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { getFavoriteProducts } from '@/lib/db/products'

export const dynamic = 'force-dynamic'

export async function GET() {
  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await verifyUserToken(token)
  if (!session || session.role !== 'buyer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await getFavoriteProducts(session.id)
  return NextResponse.json({ products })
}
