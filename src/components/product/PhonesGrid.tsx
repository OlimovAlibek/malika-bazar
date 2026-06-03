'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
import type { ProductCard as ProductCardType, SortOption } from '@/types'

type Props = {
  initialProducts: ProductCardType[]
  initialHasMore: boolean
  sort: SortOption
  q?: string
  brand?: string
  storage?: string
}

export function PhonesGrid({ initialProducts, initialHasMore, sort, q, brand, storage }: Props) {
  const [products, setProducts] = useState<ProductCardType[]>(initialProducts)
  const [hasMore, setHasMore]   = useState(initialHasMore)
  const [loading, setLoading]   = useState(false)

  async function loadMore() {
    if (loading || !hasMore) return
    const last = products[products.length - 1]
    if (!last) return

    const params = new URLSearchParams({ sort })
    if (q)       params.set('q', q)
    if (brand)   params.set('brand', brand)
    if (storage) params.set('storage', storage)

    if (sort === 'newest') {
      params.set('cursor_at', last.updated_at)
      params.set('cursor_id', last.id)
    } else {
      params.set('cursor_price', String(last.price_uzs))
      params.set('cursor_id', last.id)
    }

    setLoading(true)
    try {
      const res  = await fetch(`/api/products?${params}`)
      const data = await res.json() as { products: ProductCardType[]; hasMore: boolean }
      setProducts(prev => [...prev, ...data.products])
      setHasMore(data.hasMore)
    } catch {
      // silent — user can retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {products.length === 0 ? null : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map(p => <ProductCard key={p.id} {...p} />)}
        </ul>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#FF9900] hover:bg-[#e8a000] disabled:opacity-60 text-gray-900 font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Yuklanmoqda...
              </>
            ) : "Ko'proq yuklash"}
          </button>
        </div>
      )}
    </>
  )
}
