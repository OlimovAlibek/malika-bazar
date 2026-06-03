'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toggleProductActive, deleteProduct, updateProductPrice } from '@/actions/products'
import { formatNum } from '@/lib/format'

export type SellerItem = {
  id: string
  slug: string
  brand: string
  model: string
  storage_gb: number | null
  condition: 'new' | 'used'
  price_uzs: number
  is_active: boolean
  updated_at: string
  image_url: string | null
}

type Props = { initialProducts: SellerItem[] }

export function SellerProductsList({ initialProducts }: Props) {
  const router = useRouter()
  const [products, setProducts]     = useState<SellerItem[]>(initialProducts)
  const [q, setQ]                   = useState('')
  const [filter, setFilter]         = useState<'all' | 'active' | 'inactive'>('all')
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceInput, setPriceInput]     = useState('')
  const [deleteId, setDeleteId]         = useState<string | null>(null)
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null)

  const visible = products.filter(p => {
    const matchQ =
      q === '' ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.model.toLowerCase().includes(q.toLowerCase())
    const matchF =
      filter === 'all' ||
      (filter === 'active' ? p.is_active : !p.is_active)
    return matchQ && matchF
  })

  function handleToggle(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
    void toggleProductActive(id).catch(() => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
    })
  }

  function startEditPrice(p: SellerItem) {
    setEditingPrice(p.id)
    setPriceInput(String(p.price_uzs))
  }

  function handleSavePrice(id: string) {
    const val = Number(priceInput)
    if (val <= 0) { setEditingPrice(null); return }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price_uzs: val } : p))
    setEditingPrice(null)
    void updateProductPrice(id, val)
  }

  function handleDelete(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteId(null)
    void deleteProduct(id)
  }

  return (
    <>
      {/* Search + filter */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center h-11 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 rounded-xl px-3 gap-2 focus-within:border-[#FF9900] transition-colors">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="flex-1 text-sm bg-transparent text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
          />
          {q && (
            <button onClick={() => setQ('')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'inactive'] as const).map(val => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                filter === val
                  ? 'bg-[#FF9900] text-gray-900'
                  : 'bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {val === 'all' ? 'Barchasi' : val === 'active' ? 'Faol' : 'Nofaol'}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{visible.length} ta</span>
        </div>
      </div>

      {/* Empty state */}
      {visible.length === 0 ? (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-20 flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Mahsulot topilmadi</p>
          {(q || filter !== 'all') && (
            <button
              onClick={() => { setQ(''); setFilter('all') }}
              className="mt-3 text-xs text-[#FF9900] font-semibold hover:underline"
            >
              Filtrlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map(p => (
            <div
              key={p.id}
              className={`bg-white dark:bg-[#16161F] rounded-2xl border flex flex-col transition-all shadow-sm ${
                p.is_active
                  ? 'border-gray-200 dark:border-gray-800'
                  : 'border-gray-100 dark:border-gray-800 opacity-55'
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square rounded-t-2xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.model}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1280px) 33vw, 25vw"
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-9 h-9 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    p.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {p.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    p.condition === 'new'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}>
                    {p.condition === 'new' ? 'Yangi' : 'B/U'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-3 flex flex-col flex-1 gap-1.5">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                  {p.brand} {p.model}{p.storage_gb ? ` ${p.storage_gb}GB` : ''}
                </p>

                {editingPrice === p.id ? (
                  <div className="flex items-center gap-1 mt-auto">
                    <input
                      type="number"
                      value={priceInput}
                      onChange={e => setPriceInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSavePrice(p.id)
                        if (e.key === 'Escape') setEditingPrice(null)
                      }}
                      autoFocus
                      className="flex-1 min-w-0 text-xs bg-gray-50 dark:bg-gray-800 border border-[#FF9900] rounded-lg px-2 py-1.5 outline-none text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleSavePrice(p.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 transition-colors shrink-0"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingPrice(null)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 transition-colors shrink-0"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditPrice(p)}
                    className="flex items-center gap-0.5 group/price mt-auto"
                  >
                    <span className="text-xs font-black text-[#FF9900]">
                      {formatNum(p.price_uzs)}
                      <span className="font-semibold text-gray-400 ml-0.5">so'm</span>
                    </span>
                    <svg
                      className="w-3 h-3 text-gray-300 group-hover/price:text-[#FF9900] transition-colors ml-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => handleToggle(p.id)}
                  title={p.is_active ? 'Nofaol qilish' : 'Faol qilish'}
                  className={`flex-1 flex items-center justify-center py-3 transition-colors ${
                    p.is_active
                      ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={
                        p.is_active
                          ? 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          : 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                      }
                    />
                  </svg>
                </button>

                <div className="w-px bg-gray-100 dark:bg-gray-800" />

                <button
                  onClick={() => {
                    setLoadingEditId(p.id)
                    router.push(`/seller/products/${p.id}/edit`)
                  }}
                  disabled={loadingEditId === p.id}
                  className="flex-1 flex items-center justify-center py-3 text-gray-400 hover:text-[#FF9900] hover:bg-[#FF9900]/5 transition-colors disabled:opacity-60"
                  title="Tahrirlash"
                >
                  {loadingEditId === p.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  )}
                </button>

                <div className="w-px bg-gray-100 dark:bg-gray-800" />

                <button
                  onClick={() => setDeleteId(p.id)}
                  className="flex-1 flex items-center justify-center py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="O'chirish"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
          <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-base font-black text-gray-900 dark:text-white text-center">Mahsulotni o'chirish</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1.5">Bu amalni bekor qilib bo'lmaydi</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-black transition"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
