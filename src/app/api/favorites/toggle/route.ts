import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await verifyUserToken(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { product_id, current_liked } = body
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 })

  // Seller: DB da favorites jadvalida buyer_id yo'q, faqat toggle qaytaramiz
  // Client localStorage orqali o'zi saqlab oladi
  if (session.role === 'seller') {
    return NextResponse.json({ liked: !current_liked, sellerOnly: true })
  }

  // Buyer: DB bilan sinxronlash
  const { data: existing } = await serviceClient
    .from('favorites')
    .select('buyer_id')
    .eq('buyer_id', session.id)
    .eq('product_id', product_id)
    .maybeSingle()

  if (existing) {
    await serviceClient.from('favorites')
      .delete()
      .eq('buyer_id', session.id)
      .eq('product_id', product_id)
    return NextResponse.json({ liked: false })
  }

  await serviceClient.from('favorites').insert({ buyer_id: session.id, product_id })

  const { data: product } = await serviceClient
    .from('products')
    .select('shop_id')
    .eq('id', product_id)
    .maybeSingle()

  void serviceClient.from('events').insert({
    type: 'favorite',
    product_id,
    shop_id: product?.shop_id ?? null,
    buyer_id: session.id,
  })

  return NextResponse.json({ liked: true })
}
