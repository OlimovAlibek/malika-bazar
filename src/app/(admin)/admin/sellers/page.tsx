import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllSellers } from '@/lib/db/admin'
import { SellersList } from '@/components/admin/SellersList'

export const metadata: Metadata = { title: 'Sotuvchilar — Admin' }

export default async function AdminSellersPage() {
  const sellers = await getAllSellers()
  const active  = sellers.filter(s => !s.is_blocked).length
  const blocked = sellers.filter(s =>  s.is_blocked).length

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Sotuvchilar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sellers.length} ta jami ·{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{active} faol</span>
            {blocked > 0 && (
              <> · <span className="text-red-500 font-semibold">{blocked} bloklangan</span></>
            )}
          </p>
        </div>
        <Link
          href="/admin/sellers/new"
          className="shrink-0 flex items-center gap-2 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yangi sotuvchi
        </Link>
      </div>

      <SellersList initialSellers={sellers} />
    </div>
  )
}
