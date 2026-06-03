import type { Metadata } from 'next'
import { getShops } from '@/lib/db/shops'
import ShopsClient from './ShopsClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: "Do'konlar — Tezku" }

export default async function ShopsPage() {
  const shops = await getShops()
  return <ShopsClient shops={shops} />
}
