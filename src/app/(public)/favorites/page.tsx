import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { ProductCard } from '@/components/product/ProductCard'
import { getFavoriteProducts } from '@/lib/db/products'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'

export const metadata: Metadata = { title: 'Sevimlilar — Tezku' }

export default async function FavoritesPage() {
  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  const session = token ? await verifyUserToken(token) : null
  const buyerId = session?.role === 'buyer' ? session.id : null

  const products = buyerId ? await getFavoriteProducts(buyerId) : null

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#131921] shadow-md safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="shrink-0 flex items-baseline gap-1">
            <span className="text-white font-black text-lg tracking-tight">tezku</span>
            <span className="text-[#FF9900] text-[10px] font-black hidden sm:block">.uz</span>
          </Link>
          <div className="flex-1" />
          <h1 className="text-white font-bold text-sm">Sevimlilar</h1>
          <div className="flex-1 flex justify-end">
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              ← Orqaga
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Not logged in ── */}
        {!session && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              Sevimlilar bo'sh
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8 leading-relaxed">
              Sevimlilarga qo'shish uchun avval Telegram orqali kiring
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 font-bold rounded-xl text-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
              </svg>
              Kirish
            </Link>
          </div>
        )}

        {/* ── Logged in as seller (no favorites feature) ── */}
        {session && session.role === 'seller' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              Sevimlilar xaridor uchun
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Bu funksiya faqat xaridor hisoblari uchun mavjud
            </p>
            <Link
              href="/seller"
              className="px-6 py-3 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 font-bold rounded-xl text-sm transition-colors"
            >
              Sotuvchi paneliga o'tish
            </Link>
          </div>
        )}

        {/* ── Logged in as buyer, no favorites ── */}
        {products !== null && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Hali sevimli yo'q</h2>
            <p className="text-sm text-gray-500 mb-6">Telefonlarga yurak bosib sevimlilarga qo'shing</p>
            <Link
              href="/phones"
              className="px-6 py-3 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 font-bold rounded-xl text-sm transition-colors"
            >
              Telefonlarni ko'rish
            </Link>
          </div>
        )}

        {/* ── Logged in buyer with favorites ── */}
        {products !== null && products.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                {products.length} ta saqlangan
              </h2>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map(p => (
                <ProductCard key={p.id} {...p} liked />
              ))}
            </ul>
          </>
        )}

      </div>
    </div>
  )
}
