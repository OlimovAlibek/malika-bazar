'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

async function getSellerShop() {
  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  if (!token) throw new Error('Unauthorized')

  const session = await verifyUserToken(token)
  if (!session || session.role !== 'seller') throw new Error('Unauthorized')

  const { data } = await serviceClient
    .from('shops')
    .select('id, slug')
    .eq('seller_id', session.id)
    .maybeSingle()

  if (!data) throw new Error('Shop not found')
  return { sellerId: session.id, shopId: data.id, currentSlug: data.slug }
}

function formatPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  // 9 digits → uzbek local (e.g. 901234567)
  if (digits.length === 9) return +998${digits}
  // 12 digits starting with 998
  if (digits.length === 12 && digits.startsWith('998')) return +${digits}
  // already has +998 prefix (13 chars)
  if (digits.length === 13 && digits.startsWith('998')) return +${digits}
  // fallback: keep as-is with + prefix if it looks like an intl number
  return digits.length >= 7 ? +${digits} : null
}

export async function updateShopInfo(data: {
  name: string
  room_code: string
  phone: string
  telegram_username: string
  description: string
}): Promise<void> {
  const { shopId, currentSlug } = await getSellerShop()

  const name = data.name.trim()

  const isPlaceholderSlug = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(currentSlug)
  let slug = currentSlug

  if (isPlaceholderSlug && name) {
    const { data: newSlug } = await serviceClient
      .rpc('fn_shop_slug', { p_name: name })
    if (newSlug) slug = newSlug as string
  }

  await serviceClient
    .from('shops')
    .update({
      name,
      slug,
      room_code:         data.room_code.trim() || null,
      phone:             formatPhone(data.phone),
      telegram_username: data.telegram_username.replace(/^@/, '').trim() || null,
      description:       data.description.trim() || null,
    })
    .eq('id', shopId)

  revalidatePath('/seller/shop')
  revalidatePath('/seller')
}

export async function updateShopBanner(url: string, _publicId: string): Promise<void> {
  const { shopId } = await getSellerShop()
  await serviceClient.from('shops').update({ banner_url: url }).eq('id', shopId)
  revalidatePath('/seller/shop')
}

export async function updateShopAvatar(url: string): Promise<void> {
  const { shopId } = await getSellerShop()
  await serviceClient.from('shops').update({ avatar_url: url }).eq('id', shopId)
  revalidatePath('/seller/shop')
}