import { serviceClient } from '@/lib/supabase/service'
import type { ProductCard, Condition } from '@/types'

export type ProductDetail = ProductCard & {
  description: string | null
  shop_phone: string | null
  shop_telegram: string | null
  shop_id: string
}

// v_products dan kelgan flat row → ProductCard
type ProductRow = {
  id: string
  slug: string
  brand: string
  model: string
  storage_gb: number | null
  condition: string
  price_uzs: number
  updated_at: string
  shop_id: string
  shop_name: string
  shop_slug: string
  room_code: string
  primary_image_url: string | null
  description?: string | null
  shop_phone?: string | null
  shop_telegram?: string | null
}

const CARD_COLS = 'id,slug,brand,model,storage_gb,condition,price_uzs,updated_at,shop_id,shop_name,shop_slug,room_code,primary_image_url'
const DETAIL_COLS = CARD_COLS + ',description,shop_phone,shop_telegram'

function toCard(row: ProductRow): ProductCard {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    storage_gb: row.storage_gb,
    condition: row.condition as Condition,
    price_uzs: row.price_uzs,
    updated_at: row.updated_at,
    shop: {
      name: row.shop_name,
      slug: row.shop_slug,
      room: { code: row.room_code },
    },
    image_url: row.primary_image_url,
  }
}

function toDetail(row: ProductRow): ProductDetail {
  return {
    ...toCard(row),
    description: row.description ?? null,
    shop_phone: row.shop_phone ?? null,
    shop_telegram: row.shop_telegram ?? null,
    shop_id: row.shop_id,
  }
}

export async function getCheapest(limit = 12): Promise<ProductCard[]> {
  const { data, error } = await serviceClient
    .from('v_products')
    .select(CARD_COLS)
    .order('price_uzs', { ascending: true })
    .limit(limit)

  if (error) { console.error('getCheapest:', error.message); return [] }
  return ((data as unknown as ProductRow[]) ?? []).map(toCard)
}

export async function getRecentlyUpdated(limit = 8): Promise<ProductCard[]> {
  const { data, error } = await serviceClient
    .from('v_products')
    .select(CARD_COLS)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('getRecentlyUpdated:', error.message); return [] }
  return ((data as unknown as ProductRow[]) ?? []).map(toCard)
}

export async function searchProducts(opts: {
  q?: string
  brand?: string
  storage?: string
  sort?: string
}): Promise<ProductCard[]> {
  let query = serviceClient.from('v_products').select(CARD_COLS)

  if (opts.q) {
    const safeQ = opts.q.replace(/[,()[\]]/g, '').trim()
    if (safeQ) query = query.or(`brand.ilike.%${safeQ}%,model.ilike.%${safeQ}%`)
  }

  if (opts.brand) {
    const brands = opts.brand.split(',').map(b => b.trim()).filter(Boolean)
    if (brands.length === 1) query = query.eq('brand', brands[0])
    else if (brands.length > 1) query = query.in('brand', brands)
  }

  if (opts.storage) {
    const gb = Number(opts.storage)
    if (!isNaN(gb)) query = query.eq('storage_gb', gb)
  }

  if (opts.sort === 'price_desc') query = query.order('price_uzs', { ascending: false })
  else if (opts.sort === 'newest') query = query.order('updated_at', { ascending: false })
  else query = query.order('price_uzs', { ascending: true })

  const { data, error } = await query.limit(24)
  if (error) { console.error('searchProducts:', error.message); return [] }
  return ((data as unknown as ProductRow[]) ?? []).map(toCard)
}

type PageRow = ProductRow & { has_more: boolean }

export type ProductsPage = { products: ProductCard[]; hasMore: boolean }

export async function getProductsPage(opts: {
  sort: 'price_asc' | 'price_desc' | 'newest'
  q?: string
  brand?: string
  storage?: string
  limit?: number
  cursor_at?: string
  cursor_id?: string
  cursor_price?: number
}): Promise<ProductsPage> {
  const limit = opts.limit ?? 24
  const p_search = opts.q?.replace(/[,()[\]]/g, '').trim() || null
  const p_brand  = opts.brand || null
  const p_storage = opts.storage ? Number(opts.storage) : null

  let rpcName: string
  let params: Record<string, unknown>

  if (opts.sort === 'newest') {
    rpcName = 'fn_products_page_newest'
    params = {
      p_limit:      limit,
      p_cursor_at:  opts.cursor_at  ?? null,
      p_cursor_id:  opts.cursor_id  ?? null,
      p_brand,
      p_search,
      p_condition:  null,
      p_min_price:  null,
      p_max_price:  null,
      p_shop_id:    null,
    }
  } else if (opts.sort === 'price_desc') {
    rpcName = 'fn_products_page_price_desc'
    params = {
      p_limit:        limit,
      p_cursor_price: opts.cursor_price ?? null,
      p_cursor_id:    opts.cursor_id    ?? null,
      p_brand,
      p_search,
      p_condition:    null,
      p_min_price:    null,
      p_max_price:    null,
      p_shop_id:      null,
    }
  } else {
    rpcName = 'fn_products_page_price_asc'
    params = {
      p_limit:        limit,
      p_cursor_price: opts.cursor_price ?? null,
      p_cursor_id:    opts.cursor_id    ?? null,
      p_brand,
      p_search,
      p_condition:    null,
      p_min_price:    null,
      p_max_price:    null,
      p_shop_id:      null,
    }
  }

  if (p_storage !== null) {
    // storage filter — v_products filtrlash orqali
    const fallbackQuery = serviceClient.from('v_products').select(CARD_COLS)
      .eq('storage_gb', p_storage)
    if (p_brand)  fallbackQuery.eq('brand', p_brand)
    if (p_search) fallbackQuery.or(`brand.ilike.%${p_search}%,model.ilike.%${p_search}%`)
    if (opts.sort === 'price_desc') fallbackQuery.order('price_uzs', { ascending: false })
    else if (opts.sort === 'newest') fallbackQuery.order('updated_at', { ascending: false })
    else fallbackQuery.order('price_uzs', { ascending: true })
    fallbackQuery.limit(limit)
    const { data, error } = await fallbackQuery
    if (error) { console.error('getProductsPage(storage):', error.message); return { products: [], hasMore: false } }
    return { products: ((data as unknown as ProductRow[]) ?? []).map(toCard), hasMore: false }
  }

  const { data, error } = await serviceClient.rpc(rpcName, params)
  if (error) { console.error(`getProductsPage(${rpcName}):`, error.message); return { products: [], hasMore: false } }

  const rows = (data as unknown as PageRow[]) ?? []
  const hasMore = rows.length > 0 && rows[rows.length - 1]?.has_more === true
  return { products: rows.map(toCard), hasMore }
}

export async function getProductDetail(slug: string): Promise<ProductDetail | null> {
  const { data, error } = await serviceClient
    .from('v_products')
    .select(DETAIL_COLS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) { console.error('getProductDetail:', error.message); return null }
  return data ? toDetail(data as unknown as ProductRow) : null
}

export async function getSimilarProducts(
  brand: string,
  excludeId: string,
  limit = 8,
): Promise<ProductCard[]> {
  const { data, error } = await serviceClient
    .from('v_products')
    .select(CARD_COLS)
    .eq('brand', brand)
    .neq('id', excludeId)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('getSimilarProducts:', error.message); return [] }
  return ((data as unknown as ProductRow[]) ?? []).map(toCard)
}

export async function getFavoriteProducts(buyerId: string): Promise<ProductCard[]> {
  const { data: favs } = await serviceClient
    .from('favorites')
    .select('product_id')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (!favs || favs.length === 0) return []

  const productIds = favs.map(f => f.product_id as string)
  const { data, error } = await serviceClient
    .from('v_products')
    .select(CARD_COLS)
    .in('id', productIds)

  if (error) { console.error('getFavoriteProducts:', error.message); return [] }

  const rows = (data as unknown as ProductRow[]) ?? []
  return productIds
    .map(id => rows.find(r => r.id === id))
    .filter((r): r is ProductRow => r != null)
    .map(toCard)
}

export async function isProductLiked(productId: string, buyerId: string): Promise<boolean> {
  const { data } = await serviceClient
    .from('favorites')
    .select('buyer_id')
    .eq('buyer_id', buyerId)
    .eq('product_id', productId)
    .maybeSingle()
  return !!data
}

export async function getProductImages(productId: string): Promise<string[]> {
  const { data, error } = await serviceClient
    .from('product_images')
    .select('url')
    .eq('product_id', productId)
    .order('position', { ascending: true })

  if (error) { console.error('getProductImages:', error.message); return [] }
  return (data ?? []).map(r => r.url as string)
}
