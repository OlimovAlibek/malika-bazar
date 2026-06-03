import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShopById } from '@/lib/db/admin'
import { EditShopForm } from './EditShopForm'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Do'konni tahrirlash — Admin" }

export default async function EditShopPage({ params }: Props) {
  const { id } = await params
  const shop = await getShopById(id)
  if (!shop) notFound()

  return <EditShopForm shop={shop} />
}
