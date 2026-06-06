import { serviceClient } from '@/lib/supabase/service'
import type { ProductCard, Condition } from '@/types'

export type ShopListItem = {
  id: string
  name: string | null
  slug: string
  room_code: string | null
  phone: string | null
  telegram_username: string | null
  is_active: boolean
  banner_url: string | null
  avatar_url: string | null
  description: string | null
  products_count: number
}

// v_products dan shop produktlarini tortib olish uchun row type
type ProductRow = {
  id: string
  slug: string
  brand: string
  model: string
  storage_gb: number | null
  condition: string
  price_uzs: number
  updated_at: string
  shop_name: string
  shop_slug: string
  room_code: string
  primary_image_url: string | null
}

const CARD_COLS = 'id,slug,brand,model,storage_gb,condition,price_uzs,updated_at,shop_name,shop_slug,room_code,primary_image_url'

function rowToCard(row: ProductRow): ProductCard {
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

const SHOP_COLS = 'id,name,slug,room_code,phone,telegram_username,is_active,banner_url,avatar_url,description,products_count'

export async function getShops(): Promise<ShopListItem[]> {
  try {
    const { data, error } = await serviceClient
      .from('v_shops')
      .select(SHOP_COLS)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) { console.error('getShops:', error.message); return [] }
    return (data ?? []) as ShopListItem[]
  } catch (e) {
    console.error('getShops network error:', e)
    return []
  }
}

export async function getShopBySlug(slug: string): Promise<ShopListItem | null> {
  const { data, error } = await serviceClient
    .from('v_shops')
    .select(SHOP_COLS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) { console.error('getShopBySlug:', error.message); return null }
  return data as ShopListItem | null
}

export async function getShopProducts(shopSlug: string): Promise<ProductCard[]> {
  const { data, error } = await serviceClient
    .from('v_products')
    .select(CARD_COLS)
    .eq('shop_slug', shopSlug)
    .order('updated_at', { ascending: false })

  if (error) { console.error('getShopProducts:', error.message); return [] }
  return (data ?? []).map(row => rowToCard(row as ProductRow))
}
