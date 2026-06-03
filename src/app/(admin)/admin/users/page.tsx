import type { Metadata } from 'next'
import { getAllBuyers } from '@/lib/db/admin'
import { BuyersList } from '@/components/admin/BuyersList'

export const metadata: Metadata = { title: 'Foydalanuvchilar — Admin' }

export default async function AdminUsersPage() {
  const buyers  = await getAllBuyers()
  const active  = buyers.filter(b => !b.is_blocked).length
  const blocked = buyers.filter(b =>  b.is_blocked).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Foydalanuvchilar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Telegram bot orqali kelgan xaridorlar ·{' '}
          {buyers.length} ta jami ·{' '}
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{active} faol</span>
          {blocked > 0 && (
            <> · <span className="text-red-500 font-semibold">{blocked} bloklangan</span></>
          )}
        </p>
      </div>

      <BuyersList buyers={buyers} />
    </div>
  )
}
