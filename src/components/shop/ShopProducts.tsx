'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import type { ProductCard as ProductCardType } from '@/types'

const PAGE_SIZE = 12

type Condition = 'all' | 'new' | 'used'
type Sort = 'price_asc' | 'price_desc' | 'newest'

export function ShopProducts({ products }: { products: ProductCardType[] }) {
  const [q, setQ]           = useState('')
  const [cond, setCond]     = useState<Condition>('all')
  const [sort, setSort]     = useState<Sort>('price_asc')
  const [page, setPage]     = useState(1)

  const filtered = useMemo(() => {
    let list = [...products]

    if (q) {
      const lq = q.toLowerCase()
      list = list.filter(p =>
        p.brand.toLowerCase().includes(lq) || p.model.toLowerCase().includes(lq)
      )
    }
    if (cond !== 'all') list = list.filter(p => p.condition === cond)

    if (sort === 'price_desc') {
      list.sort((a, b) => b.price_uzs - a.price_uzs)
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    } else {
      list.sort((a, b) => a.price_uzs - b.price_uzs)
    }
    return list
  }, [products, q, cond, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function changeFilter<T>(fn: (v: T) => void, v: T) {
    fn(v)
    setPage(1)
  }

  return (
    <div className="space-y-4">

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center h-10 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 rounded-xl px-3 gap-2 focus-within:border-[#FF9900] transition-colors">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={q}
            onChange={e => changeFilter(setQ, e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="flex-1 min-w-0 text-sm bg-transparent text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
          />
          {q && (
            <button onClick={() => changeFilter(setQ, '')} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => changeFilter(setSort, e.target.value as Sort)}
          className="h-10 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 rounded-xl px-3 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-[#FF9900] transition-colors cursor-pointer"
        >
          <option value="price_asc">Arzon ↑</option>
          <option value="price_desc">Qimmat ↓</option>
          <option value="newest">Yangi</option>
        </select>
      </div>

      {/* Condition chips */}
      <div className="flex gap-2">
        {([['all', 'Barchasi'], ['new', 'Yangi'], ['used', 'Ishlatilgan']] as [Condition, string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => changeFilter(setCond, val)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
              cond === val
                ? 'bg-[#FF9900] text-gray-900'
                : 'bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 self-center">
          {filtered.length} ta
        </span>
      </div>

      {/* Products grid */}
      {paged.length === 0 ? (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-16 flex flex-col items-center">
          <svg className="w-10 h-10 text-gray-300 dark:text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-sm text-gray-500">Natija topilmadi</p>
          <button
            onClick={() => { changeFilter(setQ, ''); changeFilter(setCond, 'all') }}
            className="mt-3 text-sm text-[#FF9900] font-semibold hover:underline"
          >
            Filtrlarni tozalash
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {paged.map(p => <ProductCard key={p.id} {...p} />)}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white dark:bg-[#16161F]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Oldingi
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  n === safePage
                    ? 'bg-[#FF9900] text-gray-900'
                    : 'bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition bg-white dark:bg-[#16161F]"
          >
            Keyingi
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
