import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceClient } from '@/lib/supabase/service'
import { NewProductClient } from './NewProductClient'

export const metadata: Metadata = { title: "Yangi mahsulot — Sotuvchi" }

export default async function NewProductPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'seller') redirect('/profile')

  const { data: shop } = await serviceClient
    .from('shops')
    .select('id, name, phone, telegram_username')
    .eq('seller_id', user.id)
    .maybeSingle()

  const missing: string[] = []
  if (!shop?.name?.trim())              missing.push("Do'kon nomi")
  if (!shop?.phone?.trim())             missing.push('Telefon raqami')
  if (!shop?.telegram_username?.trim()) missing.push('Telegram username')

  if (missing.length > 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/seller/products"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Mahsulotlar / Yangi mahsulot</p>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Yangi mahsulot qo&apos;shish</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Do&apos;kon ma&apos;lumotlarini to&apos;ldiring
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Mahsulot qo&apos;shish uchun avval do&apos;konga oid asosiy ma&apos;lumotlarni kiritish shart.
            </p>
          </div>

          <ul className="flex flex-col gap-2 w-full max-w-xs">
            {missing.map(field => (
              <li key={field} className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 px-3.5 py-2.5 rounded-xl">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{field}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/seller/shop"
            className="mt-1 flex items-center gap-2 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Do&apos;konni sozlash
          </Link>
        </div>
      </div>
    )
  }

  return <NewProductClient />
}
