import Link from 'next/link'
import type { Metadata } from 'next'
import { PhonesGrid } from '@/components/product/PhonesGrid'
import { getProductsPage } from '@/lib/db/products'
import type { SortOption } from '@/types'

export const metadata: Metadata = { title: 'Telefonlar — Tezku' }

const BRANDS   = ['Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Realme', 'OPPO']
const STORAGES = [64, 128, 256, 512]
const SORTS: { value: SortOption; label: string }[] = [
  { value: 'price_asc',  label: 'Arzon ↑' },
  { value: 'price_desc', label: 'Qimmat ↓' },
  { value: 'newest',     label: 'Yangi' },
]

type SearchParams = {
  q?: string
  brand?: string
  storage?: string
  sort?: string
}
type Props = { searchParams: Promise<SearchParams> }

function chip(p: SearchParams, key: string, val: string) {
  const next = { ...p, [key]: val }
  return '/phones?' + new URLSearchParams(
    Object.entries(next).filter(([, v]) => v) as [string, string][]
  ).toString()
}
function chipOff(p: SearchParams, key: string) {
  const next = { ...p }
  delete next[key as keyof SearchParams]
  const qs = new URLSearchParams(
    Object.entries(next).filter(([, v]) => v) as [string, string][]
  ).toString()
  return '/phones' + (qs ? '?' + qs : '')
}

const VALID_SORTS = new Set<string>(['price_asc', 'price_desc', 'newest'])
const hasFilter = (p: SearchParams) => !!(p.q || p.brand || p.storage)

export default async function PhonesPage({ searchParams }: Props) {
  const params = await searchParams
  const sort: SortOption = VALID_SORTS.has(params.sort ?? '')
    ? (params.sort as SortOption)
    : 'price_asc'

  const { products, hasMore } = await getProductsPage({
    sort,
    q:       params.q,
    brand:   params.brand,
    storage: params.storage,
    limit:   24,
  })

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#131921] safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

          <Link href="/" className="shrink-0 flex items-baseline gap-1">
            <span className="text-white font-black text-lg tracking-tight">tezku</span>
            <span className="text-[#FF9900] text-[10px] font-black hidden sm:block">.uz</span>
          </Link>

          {/* Search */}
          <form action="/phones" method="get" className="flex-1 min-w-0">
            <div className="flex h-9 rounded-lg overflow-hidden ring-2 ring-transparent focus-within:ring-[#FF9900] transition-all">
              <input
                name="q"
                defaultValue={params.q}
                placeholder="iPhone 15, Samsung S25..."
                className="flex-1 min-w-0 bg-white dark:bg-gray-100 px-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button type="submit" className="bg-[#FF9900] hover:bg-[#e8a000] px-4 shrink-0 transition-colors">
                <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </form>

          <Link href="/" className="shrink-0 hidden sm:flex flex-col items-end leading-tight">
            <span className="text-gray-400 text-[10px]">Bosh sahifaga</span>
            <span className="text-white text-sm font-bold hover:text-[#FF9900] transition-colors">← Orqaga</span>
          </Link>
        </div>

        {/* ── Filter bar ── */}
        <div className="bg-[#1E2A38] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-2 overflow-x-auto scrollbar-none">

            {SORTS.map(s => {
              const active = sort === s.value
              return (
                <Link
                  key={s.value}
                  href={chip(params, 'sort', s.value)}
                  className={`flex-none text-[11px] font-semibold px-3 py-2 rounded-full whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#FF9900] text-gray-900'
                      : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/25'
                  }`}
                >
                  {s.label}
                </Link>
              )
            })}

            <div className="w-px h-4 bg-white/15 mx-1 shrink-0" />

            {BRANDS.map(b => {
              const active = params.brand === b
              return (
                <Link
                  key={b}
                  href={active ? chipOff(params, 'brand') : chip(params, 'brand', b)}
                  className={`flex-none text-[11px] font-semibold px-3 py-2 rounded-full whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#FF9900] text-gray-900'
                      : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/25'
                  }`}
                >
                  {b}
                </Link>
              )
            })}

            <div className="w-px h-4 bg-white/15 mx-1 shrink-0" />

            {STORAGES.map(s => {
              const active = params.storage === String(s)
              return (
                <Link
                  key={s}
                  href={active ? chipOff(params, 'storage') : chip(params, 'storage', String(s))}
                  className={`flex-none text-[11px] font-semibold px-3 py-2 rounded-full whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#FF9900] text-gray-900'
                      : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/25'
                  }`}
                >
                  {s}GB
                </Link>
              )
            })}

            {hasFilter(params) && (
              <>
                <div className="w-px h-4 bg-white/15 mx-1 shrink-0" />
                <Link
                  href="/phones"
                  className="flex-none flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 whitespace-nowrap transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tozalash
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Active filter tags ── */}
      {hasFilter(params) && (
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center gap-2 flex-wrap">
          {params.q && <FilterTag label={`"${params.q}"`} href={chipOff(params, 'q')} />}
          {params.brand && <FilterTag label={params.brand} href={chipOff(params, 'brand')} />}
          {params.storage && <FilterTag label={`${params.storage}GB`} href={chipOff(params, 'storage')} />}
        </div>
      )}

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 py-4">

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">Natija topilmadi</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Boshqa filtr yoki kalit so'z bilan qidiring</p>
            <Link
              href="/phones"
              className="px-5 py-2.5 bg-[#FF9900] text-gray-900 text-sm font-bold rounded-xl hover:bg-[#e8a000] transition-colors"
            >
              Barcha filtrlarni tozalash
            </Link>
          </div>
        ) : (
          <PhonesGrid
            key={`${sort}-${params.q ?? ''}-${params.brand ?? ''}-${params.storage ?? ''}`}
            initialProducts={products}
            initialHasMore={hasMore}
            sort={sort}
            q={params.q}
            brand={params.brand}
            storage={params.storage}
          />
        )}

      </div>
    </div>
  )
}

function FilterTag({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-500 transition-colors"
    >
      {label}
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </Link>
  )
}
