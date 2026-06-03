import Link from 'next/link'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { ProductCard } from '@/components/product/ProductCard'
import { BannerCarousel } from '@/components/layout/BannerCarousel'
import { BRAND_LOGOS } from '@/components/ui/BrandLogos'
import { getCheapest, getRecentlyUpdated } from '@/lib/db/products'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'

const getCheapestCached     = unstable_cache(getCheapest,       ['home-cheapest'],  { revalidate: 60 })
const getRecentlyUpdatedCached = unstable_cache(getRecentlyUpdated, ['home-recent'], { revalidate: 60 })

export const metadata: Metadata = {
  title: 'Tezku — Malika bozor telefon narxlari',
  alternates: { canonical: 'https://tezku.uz' },
}

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Realme', 'OPPO']

export default async function HomePage() {
  const store   = await cookies()
  const token   = store.get(USER_SESSION_COOKIE)?.value
  const session = token ? await verifyUserToken(token) : null

  const [cheapest, recent] = await Promise.all([
    getCheapestCached(12).catch(() => [] as Awaited<ReturnType<typeof getCheapest>>),
    getRecentlyUpdatedCached(8).catch(() => [] as Awaited<ReturnType<typeof getRecentlyUpdated>>),
  ])

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-[#131921] shadow-md safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

          <Link href="/" className="shrink-0 flex items-baseline gap-1">
            <span className="text-white font-black text-lg tracking-tight">tezku</span>
            <span className="text-[#FF9900] text-[10px] font-black hidden sm:block">.uz</span>
          </Link>

          <form action="/phones" method="get" className="flex-1 min-w-0">
            <div className="flex h-9 rounded-lg overflow-hidden ring-2 ring-transparent focus-within:ring-[#FF9900] transition-all">
              <input
                name="q"
                placeholder="iPhone 15, Samsung S25..."
                className="flex-1 min-w-0 bg-white dark:bg-gray-100 px-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-[#FF9900] hover:bg-[#e8a000] px-4 shrink-0 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </form>

          <Link href="/profile" className="shrink-0 hidden sm:flex flex-col items-end leading-tight">
            {session ? (
              <>
                <span className="text-gray-400 text-[10px]">Mening</span>
                <span className="text-white text-sm font-bold hover:text-[#FF9900] transition-colors">Profilim</span>
              </>
            ) : (
              <>
                <span className="text-gray-400 text-[10px]">Kirish uchun</span>
                <span className="text-white text-sm font-bold hover:text-[#FF9900] transition-colors">Kirish</span>
              </>
            )}
          </Link>
        </div>

        {/* Sub-nav */}
        <div className="bg-[#1E2A38] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center gap-6 overflow-x-auto scrollbar-none">
            {[
              { label: 'Barcha telefonlar', href: '/phones' },
              { label: 'Arzon narxlar',    href: '/phones?sort=price_asc' },
              { label: 'Yangi kelganlar',  href: '/phones?sort=newest' },
              { label: 'Apple',            href: '/phones?brand=Apple' },
              { label: 'Samsung',          href: '/phones?brand=Samsung' },
              { label: 'Xiaomi',           href: '/phones?brand=Xiaomi' },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                className="text-[11px] text-gray-400 hover:text-white whitespace-nowrap transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ─── Banner Carousel ─── */}
      <BannerCarousel />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

        {/* ─── Brendlar ─── */}
        <section>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Brendlar bo'yicha
          </p>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {BRANDS.map((name) => {
              const Logo = BRAND_LOGOS[name]
              return (
                <Link
                  key={name}
                  href={`/phones?brand=${name}`}
                  className="flex items-center justify-center py-4 px-2 sm:py-5 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-150 group"
                >
                  <Logo className={`
                    transition-all duration-150 group-hover:opacity-80
                    ${name === 'Apple'
                      ? 'w-7 h-7 sm:w-9 sm:h-9 text-gray-800 dark:text-gray-200'
                      : name === 'Xiaomi'
                      ? 'w-9 h-9 sm:w-11 sm:h-11'
                      : 'w-14 h-5 sm:w-16 sm:h-6 text-gray-800 dark:text-gray-200'
                    }
                  `} />
                </Link>
              )
            })}
          </div>
        </section>

        {/* ─── Eng arzon ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Eng arzon narxlar</h2>
              <p className="text-xs text-gray-400 mt-0.5">Barcha do'konlar orasida eng past narx</p>
            </div>
            <Link
              href="/phones?sort=price_asc"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              Barchasini ko'rish
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cheapest.map(p => <ProductCard key={p.id} {...p} />)}
          </ul>
        </section>

        {/* ─── Yangilangan ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Yaqinda yangilangan</h2>
              <p className="text-xs text-gray-400 mt-0.5">Narxlari yangilab qo'yilgan telefonlar</p>
            </div>
            <Link
              href="/phones?sort=newest"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              Ko'proq
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className="flex gap-3 overflow-x-auto scrollbar-none md:grid md:grid-cols-4 -mx-4 px-4 md:mx-0 md:px-0 pb-2">
            {recent.map(p => (
              <div key={p.id} className="flex-none w-[165px] sm:w-[185px] md:w-auto">
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ─── Footer ─── */}
      <footer className="mt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-[11px] text-gray-400 py-4">
          © {new Date().getFullYear()} Tezku
        </p>
      </footer>

    </div>
  )
}
