import { NextRequest, NextResponse } from 'next/server'
import { getProductsPage } from '@/lib/db/products'
import type { SortOption } from '@/types'

const VALID_SORTS = new Set<SortOption>(['price_asc', 'price_desc', 'newest'])

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  const rawSort = sp.get('sort') ?? 'price_asc'
  const sort: SortOption = VALID_SORTS.has(rawSort as SortOption)
    ? (rawSort as SortOption)
    : 'price_asc'

  const q        = sp.get('q')        ?? undefined
  const brand    = sp.get('brand')    ?? undefined
  const storage  = sp.get('storage')  ?? undefined
  const cursor_at    = sp.get('cursor_at')    ?? undefined
  const cursor_id    = sp.get('cursor_id')    ?? undefined
  const rawPrice     = sp.get('cursor_price')
  const cursor_price = rawPrice ? Number(rawPrice) : undefined

  const result = await getProductsPage({
    sort, q, brand, storage,
    cursor_at, cursor_id, cursor_price,
    limit: 24,
  })

  return NextResponse.json(result)
}
