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
    .select('id')
    .eq('seller_id', session.id)
    .maybeSingle()

  if (!data) throw new Error('Shop not found')
  return { sellerId: session.id, shopId: data.id }
}

async function assertOwnership(productId: string, shopId: string) {
  const { data } = await serviceClient
    .from('products')
    .select('id')
    .eq('id', productId)
    .eq('shop_id', shopId)
    .maybeSingle()
  if (!data) throw new Error('Not found or unauthorized')
}

type ImageInput = {
  url: string
  public_id?: string | null
  position: number
}

export async function createProduct(data: {
  brand: string
  model: string
  storage_gb: number | null
  condition: 'new' | 'used'
  price_uzs: number
  description?: string
  is_active: boolean
  images: ImageInput[]
}) {
  const { shopId } = await getSellerShop()

  const { data: slug } = await serviceClient.rpc('fn_product_slug', {
    p_brand:      data.brand,
    p_model:      data.model,
    p_storage_gb: data.storage_gb ?? null,
  })

  const { data: product, error } = await serviceClient
    .from('products')
    .insert({
      shop_id:     shopId,
      brand:       data.brand,
      model:       data.model,
      slug:        slug ?? `${data.brand}-${data.model}-${Date.now()}`.toLowerCase(),
      storage_gb:  data.storage_gb,
      condition:   data.condition,
      price_uzs:   data.price_uzs,
      description: data.description || null,
      is_active:   data.is_active,
    })
    .select('id')
    .single()

  if (error || !product) throw new Error('Failed to create product')

  if (data.images.length > 0) {
    await serviceClient.from('product_images').insert(
      data.images.map((img, i) => ({
        product_id: product.id,
        url:        img.url,
        public_id:  img.public_id ?? null,
        is_primary: i === 0,
        position:   img.position,
      }))
    )
  }

  revalidatePath('/seller/products')
  revalidatePath('/seller')
  revalidatePath('/')
  return { id: product.id }
}

export async function updateProduct(
  id: string,
  data: {
    brand: string
    model: string
    storage_gb: number | null
    condition: 'new' | 'used'
    price_uzs: number
    description?: string
    is_active: boolean
    images: ImageInput[]
  }
) {
  const { shopId } = await getSellerShop()
  await assertOwnership(id, shopId)

  await serviceClient
    .from('products')
    .update({
      brand:       data.brand,
      model:       data.model,
      storage_gb:  data.storage_gb,
      condition:   data.condition,
      price_uzs:   data.price_uzs,
      description: data.description || null,
      is_active:   data.is_active,
    })
    .eq('id', id)

  // Replace all images
  await serviceClient.from('product_images').delete().eq('product_id', id)
  if (data.images.length > 0) {
    await serviceClient.from('product_images').insert(
      data.images.map((img, i) => ({
        product_id: id,
        url:        img.url,
        public_id:  img.public_id ?? null,
        is_primary: i === 0,
        position:   img.position,
      }))
    )
  }

  revalidatePath('/seller/products')
  revalidatePath('/seller')
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  const { shopId } = await getSellerShop()
  await assertOwnership(id, shopId)

  await serviceClient.from('products').delete().eq('id', id)

  revalidatePath('/seller/products')
  revalidatePath('/seller')
  revalidatePath('/')
}

export async function toggleProductActive(id: string) {
  const { shopId } = await getSellerShop()

  const { data } = await serviceClient
    .from('products')
    .select('is_active')
    .eq('id', id)
    .eq('shop_id', shopId)
    .maybeSingle()

  if (!data) throw new Error('Not found or unauthorized')

  await serviceClient
    .from('products')
    .update({ is_active: !data.is_active })
    .eq('id', id)

  revalidatePath('/seller/products')
  revalidatePath('/seller')
  revalidatePath('/')
}

export async function updateProductPrice(id: string, price: number) {
  const { shopId } = await getSellerShop()

  await serviceClient
    .from('products')
    .update({ price_uzs: price })
    .eq('id', id)
    .eq('shop_id', shopId)

  revalidatePath('/seller/products')
  revalidatePath('/')
}
