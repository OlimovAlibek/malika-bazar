import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSellerById, getSellerProducts } from '@/lib/db/admin'
import { SellerDetailShell } from '@/components/admin/SellerDetailShell'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const seller = await getSellerById(id)
  return { title: seller ? `${seller.full_name} — Admin` : 'Sotuvchi' }
}

export default async function SellerDetailPage({ params }: Props) {
  const { id } = await params
  const seller = await getSellerById(id)
  if (!seller) notFound()

  const products = seller.shop_id ? await getSellerProducts(seller.shop_id) : []

  return <SellerDetailShell seller={seller} products={products} />
}
