import type { Metadata } from 'next'
import { getAllSellers } from '@/lib/db/admin'
import { ShopsList } from '@/components/admin/ShopsList'

export const metadata: Metadata = { title: "Do'konlar — Admin" }

export default async function AdminShopsPage() {
  const sellers = await getAllSellers()
  const withShop = sellers.filter(s => s.shop_id !== null)
  const active   = withShop.filter(s => !s.is_blocked).length
  const blocked  = withShop.filter(s =>  s.is_blocked).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Do'konlar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {withShop.length} ta jami ·{' '}
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{active} faol</span>
          {blocked > 0 && (
            <> · <span className="text-red-500 font-semibold">{blocked} bloklangan</span></>
          )}
        </p>
      </div>

      <ShopsList sellers={withShop} />
    </div>
  )
}
