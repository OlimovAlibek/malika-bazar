import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceClient } from '@/lib/supabase/service'
import { EditProductShell } from '@/components/seller/EditProductShell'

export const metadata: Metadata = { title: 'Mahsulotni tahrirlash — Sotuvchi' }

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const user = await getCurrentUser()
  if (!user || user.role !== 'seller') redirect('/profile')

  const { data: shop } = await serviceClient
    .from('shops')
    .select('id')
    .eq('seller_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/seller')

  const { data: product } = await serviceClient
    .from('products')
    .select('id, brand, model, storage_gb, condition, price_uzs, description, is_active, shop_id')
    .eq('id', id)
    .eq('shop_id', shop.id)
    .maybeSingle()

  if (!product) notFound()

  const { data: images } = await serviceClient
    .from('product_images')
    .select('url, public_id, position')
    .eq('product_id', id)
    .order('position')

  const imageUrls = (images ?? []).map(img => img.url)

  return (
    <EditProductShell
      productId={id}
      defaultValues={{
        brand:       product.brand,
        model:       product.model,
        storage_gb:  product.storage_gb,
        condition:   product.condition as 'new' | 'used',
        price_uzs:   product.price_uzs,
        description: product.description ?? '',
        is_active:   product.is_active,
        images:      imageUrls,
      }}
    />
  )
}
