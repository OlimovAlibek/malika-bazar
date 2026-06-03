'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { serviceClient } from '@/lib/supabase/service'

export async function blockSellerAction(id: string, block: boolean) {
  const { error } = await serviceClient
    .from('sellers')
    .update({ is_blocked: block })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/sellers')
  revalidatePath('/admin')
}

export async function deleteSellerAction(id: string) {
  // auth_tokens jadvalida FK yo'q — qo'lda tozalash kerak
  const { data: seller } = await serviceClient
    .from('sellers')
    .select('phone')
    .eq('id', id)
    .maybeSingle()

  if (seller?.phone) {
    await serviceClient.from('auth_tokens').delete().eq('phone', seller.phone)
  }

  // sellers o'chirilsa: shops → products → product_images CASCADE bilan o'chadi
  const { error } = await serviceClient
    .from('sellers')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/sellers')
  revalidatePath('/admin')
}

export async function createSellerAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const full_name         = (formData.get('full_name')         as string ?? '').trim()
  const phone             = (formData.get('phone')             as string ?? '').trim()
  const telegram_username = (formData.get('telegram_username') as string ?? '').trim() || null

  if (!full_name) return { error: "To'liq ismni kiriting" }
  if (!phone)     return { error: 'Telefon raqamini kiriting' }
  if (!phone.startsWith('+')) return { error: "Raqam + bilan boshlanishi kerak (masalan: +998901234567)" }

  const { data: seller, error: sellerError } = await serviceClient
    .from('sellers')
    .insert({ full_name, phone, telegram_username })
    .select('id')
    .single()

  if (sellerError) {
    if (sellerError.code === '23505') return { error: 'Bu telefon raqam allaqachon ro\'yxatda bor' }
    return { error: sellerError.message }
  }

  // Sotuvchi uchun bo'sh do'kon yaratish
  await serviceClient
    .from('shops')
    .insert({ seller_id: seller.id, name: '', slug: seller.id })

  revalidatePath('/admin/sellers')
  revalidatePath('/admin')
  redirect('/admin/sellers')
}

export async function updateSellerAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const id               = (formData.get('id')               as string ?? '').trim()
  const full_name        = (formData.get('full_name')        as string ?? '').trim()
  const phone            = (formData.get('phone')            as string ?? '').trim()
  const telegram_username = (formData.get('telegram_username') as string ?? '').trim().replace(/^@/, '') || null

  if (!full_name) return { error: "To'liq ismni kiriting" }
  if (!phone)     return { error: 'Telefon raqamini kiriting' }
  if (!phone.startsWith('+')) return { error: "Raqam + bilan boshlanishi kerak (masalan: +998901234567)" }

  const { error } = await serviceClient
    .from('sellers')
    .update({ full_name, phone, telegram_username })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/sellers')
  return null
}

export async function updateShopAction(
  id: string,
  data: {
    name?: string
    room_code?: string
    phone?: string
    telegram_username?: string
    description?: string
    is_active?: boolean
  },
) {
  const { error } = await serviceClient
    .from('shops')
    .update(data)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/shops')
  revalidatePath('/admin')
}

export async function blockBuyerAction(id: string, block: boolean) {
  const { error } = await serviceClient
    .from('buyers')
    .update({ is_blocked: block })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/users')
}

export async function toggleProductActiveAction(id: string, is_active: boolean) {
  const { error } = await serviceClient
    .from('products')
    .update({ is_active })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/products')
}

export async function editShopAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const id               = (formData.get('id')               as string ?? '').trim()
  const name             = (formData.get('name')             as string ?? '').trim()
  const room_code        = (formData.get('room_code')        as string ?? '').trim() || null
  const phone            = (formData.get('phone')            as string ?? '').trim() || null
  const telegram_username = (formData.get('telegram_username') as string ?? '').trim() || null
  const description      = (formData.get('description')      as string ?? '').trim() || null

  if (!name) return { error: "Do'kon nomini kiriting" }

  const { error } = await serviceClient
    .from('shops')
    .update({ name, room_code, phone, telegram_username, description })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/shops')
  revalidatePath('/admin')
  redirect('/admin/shops')
}
