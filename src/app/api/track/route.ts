import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { type, product_id } = await req.json()
    if (!['view', 'call', 'telegram', 'favorite'].includes(type) || !product_id) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    let buyer_id: string | null = null
    const store = await cookies()
    const token = store.get(USER_SESSION_COOKIE)?.value
    if (token) {
      const session = await verifyUserToken(token)
      if (session?.role === 'buyer') buyer_id = session.id
    }

    const { data: product } = await serviceClient
      .from('products')
      .select('shop_id')
      .eq('id', product_id)
      .maybeSingle()

    await serviceClient.from('events').insert({
      type,
      product_id,
      shop_id: product?.shop_id ?? null,
      buyer_id,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
