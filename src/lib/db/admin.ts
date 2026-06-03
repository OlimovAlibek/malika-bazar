import { serviceClient } from '@/lib/supabase/service'

export type AdminSeller = {
  id: string
  full_name: string
  phone: string
  telegram_id: number | null
  telegram_username: string | null
  is_blocked: boolean
  created_at: string
  last_active_at: string | null
  shop_id: string | null
  shop_name: string | null
  shop_slug: string | null
  shop_is_active: boolean | null
  room_code: string | null
  shop_phone: string | null
  banner_url: string | null
  avatar_url: string | null
  products_count: number
}

export type AdminShop = {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  telegram_username: string | null
  room_code: string | null
  banner_url: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  seller_name: string
  seller_phone: string
  seller_is_blocked: boolean
  products_count: number
  new_count: number
  used_count: number
  min_price: number | null
  max_price: number | null
}

export type AdminProduct = {
  id: string
  slug: string
  brand: string
  model: string
  storage_gb: number | null
  color: string | null
  condition: 'new' | 'used'
  price_uzs: number
  is_active: boolean
  created_at: string
  updated_at: string
  shop_id: string
  shop_name: string
  shop_slug: string
  room_code: string | null
  primary_image_url: string | null
}

export type AdminBuyer = {
  id: string
  telegram_id: string
  first_name: string
  last_name: string | null
  username: string | null
  phone: string | null
  is_blocked: boolean
  joined_at: string
  last_active_at: string | null
  favorites_count: number
}

export type DashboardStats = {
  sellers_total: number
  sellers_active: number
  sellers_blocked: number
  products_total: number
  products_active: number
  buyers_total: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [sellersAll, sellersActive, productsAll, productsActive, buyersAll] = await Promise.all([
    serviceClient.from('sellers').select('*', { count: 'exact', head: true }),
    serviceClient.from('sellers').select('*', { count: 'exact', head: true }).eq('is_blocked', false),
    serviceClient.from('products').select('*', { count: 'exact', head: true }),
    serviceClient.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    serviceClient.from('buyers').select('*', { count: 'exact', head: true }),
  ])

  const total = sellersAll.count ?? 0
  const active = sellersActive.count ?? 0

  return {
    sellers_total:   total,
    sellers_active:  active,
    sellers_blocked: total - active,
    products_total:  productsAll.count ?? 0,
    products_active: productsActive.count ?? 0,
    buyers_total:    buyersAll.count ?? 0,
  }
}

export async function getRecentSellers(limit = 5): Promise<AdminSeller[]> {
  const { data } = await serviceClient
    .from('v_sellers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as AdminSeller[]
}

export async function getTopSellersByProducts(limit = 5): Promise<AdminSeller[]> {
  const { data } = await serviceClient
    .from('v_sellers')
    .select('*')
    .order('products_count', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as AdminSeller[]
}

export async function getRecentProducts(limit = 6): Promise<AdminProduct[]> {
  const { data } = await serviceClient
    .from('v_admin_products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as unknown as AdminProduct[]
}

export async function getAllSellers(): Promise<AdminSeller[]> {
  const { data } = await serviceClient
    .from('v_sellers')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as AdminSeller[]
}

export async function getSellerById(id: string): Promise<AdminSeller | null> {
  const { data } = await serviceClient
    .from('v_sellers')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return data as unknown as AdminSeller | null
}

export async function getSellerProducts(shopId: string): Promise<AdminProduct[]> {
  const { data } = await serviceClient
    .from('v_admin_products')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as AdminProduct[]
}

export async function getAllShops(): Promise<AdminShop[]> {
  const { data } = await serviceClient
    .from('v_shops')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as AdminShop[]
}

export async function getShopById(id: string): Promise<AdminShop | null> {
  const { data } = await serviceClient
    .from('v_shops')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return data as unknown as AdminShop | null
}

export async function getAllProducts(): Promise<AdminProduct[]> {
  const { data } = await serviceClient
    .from('v_admin_products')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as AdminProduct[]
}

export async function getAllBuyers(): Promise<AdminBuyer[]> {
  const { data } = await serviceClient
    .from('v_buyers')
    .select('*')
    .order('joined_at', { ascending: false })
  return (data ?? []) as unknown as AdminBuyer[]
}

export async function getAnalyticsRaw() {
  const [sellers, buyers, products, topShops] = await Promise.all([
    serviceClient.from('sellers').select('id, created_at, is_blocked'),
    serviceClient.from('buyers').select('id, joined_at, is_blocked'),
    serviceClient.from('products').select('id, brand, condition, price_uzs, is_active'),
    serviceClient
      .from('v_sellers')
      .select('shop_name, products_count')
      .order('products_count', { ascending: false })
      .limit(8),
  ])

  return {
    sellers:  sellers.data  ?? [],
    buyers:   buyers.data   ?? [],
    products: products.data ?? [],
    topShops: topShops.data ?? [],
  }
}
