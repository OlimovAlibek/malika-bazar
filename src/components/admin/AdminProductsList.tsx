'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'
import type { AdminProduct } from '@/lib/db/admin'
import { toggleProductActiveAction } from '@/actions/admin'

type Props = { products: AdminProduct[] }

export function AdminProductsList({ products: initial }: Props) {
  const [items, setItems]     = useState(initial)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | 'new' | 'used'>('all')
  const [shop, setShop]       = useState('all')
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setItems(initial) }, [initial])

  const shopNames = Array.from(new Set(initial.map(p => p.shop_name))).sort()

  const filtered = items.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.shop_name.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || p.condition === filter
    const matchShop   = shop === 'all' || p.shop_name === shop
    return matchSearch && matchFilter && matchShop
  })

  function toggleActive(id: string, currentActive: boolean) {
    const newActive = !currentActive
    setItems(prev => prev.map(p => p.id === id ? { ...p, is_active: newActive } : p))
    startTransition(async () => { await toggleProductActiveAction(id, newActive) })
  }

  return (
    <>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Brand, model yoki do'kon..."
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16161F] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9900]/40"
          />
        </div>
        <select
          value={shop}
          onChange={e => setShop(e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16161F] text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF9900]/40"
        >
          <option value="all">Barcha do'konlar</option>
          {shopNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <div className="flex gap-1.5">
          {(['all', 'new', 'used'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 h-10 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-[#FF9900] text-gray-900'
                  : 'bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
              }`}
            >
              {f === 'all' ? 'Barchasi' : f === 'new' ? 'Yangi' : 'B/U'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} ta mahsulot</p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-16 flex flex-col items-center gap-2">
          <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
          </svg>
          <p className="text-sm text-gray-400">Mahsulot topilmadi</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {filtered.map(p => (
            <div key={p.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${!p.is_active ? 'opacity-50' : ''}`}>
              {/* Image */}
              <div className="relative w-12 h-12 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {p.primary_image_url && (
                  <Image
                    src={p.primary_image_url}
                    alt={p.model}
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {p.brand} {p.model}{p.storage_gb ? ` ${p.storage_gb}GB` : ''}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {p.shop_name}{p.room_code ? ` · Xona ${p.room_code}` : ''}
                </p>
              </div>

              {/* Badges */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.condition === 'new'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {p.condition === 'new' ? 'Yangi' : 'B/U'}
                </span>
              </div>

              {/* Price */}
              <p className="hidden sm:block text-sm font-black text-gray-900 dark:text-white shrink-0">
                {formatPrice(p.price_uzs)}
              </p>

              {/* Toggle active */}
              <button
                disabled={isPending}
                onClick={() => toggleActive(p.id, p.is_active)}
                title={p.is_active ? 'Yashirish' : "Ko'rsatish"}
                className={`shrink-0 p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  p.is_active
                    ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                    : 'text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {p.is_active ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  )}
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
