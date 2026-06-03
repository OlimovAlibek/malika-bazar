'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import type { AdminSeller } from '@/lib/db/admin'
import { blockSellerAction } from '@/actions/admin'

type Props = { sellers: AdminSeller[] }

type ConfirmAction = { id: string; type: 'block' | 'unblock' }

export function ShopsList({ sellers: initialSellers }: Props) {
  const [items, setItems]       = useState(initialSellers)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<'all' | 'active' | 'blocked'>('all')
  const [confirm, setConfirm]   = useState<ConfirmAction | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setItems(initialSellers) }, [initialSellers])

  const filtered = items.filter(s => {
    const q = search.toLowerCase()
    const handle = s.telegram_username ? `@${s.telegram_username}` : (s.phone ?? '')
    const matchSearch = !q ||
      (s.shop_name ?? '').toLowerCase().includes(q) ||
      s.full_name.toLowerCase().includes(q) ||
      handle.toLowerCase().includes(q) ||
      (s.room_code ?? '').toLowerCase().includes(q)
    const matchFilter =
      filter === 'all' ||
      (filter === 'active'  && !s.is_blocked) ||
      (filter === 'blocked' &&  s.is_blocked)
    return matchSearch && matchFilter
  })

  function doAction() {
    if (!confirm) return
    const block = confirm.type === 'block'
    setItems(prev => prev.map(s => s.id === confirm.id ? { ...s, is_blocked: block } : s))
    setConfirm(null)
    startTransition(async () => { await blockSellerAction(confirm.id, block) })
  }

  const counts = {
    all:     items.length,
    active:  items.filter(s => !s.is_blocked).length,
    blocked: items.filter(s =>  s.is_blocked).length,
  }

  const target = confirm ? items.find(s => s.id === confirm.id) : null

  return (
    <>
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Do'kon nomi, egasi yoki xona..."
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16161F] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9900]/40"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'active', 'blocked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 h-10 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-[#FF9900] text-gray-900'
                  : 'bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
              }`}
            >
              {f === 'all' ? 'Barchasi' : f === 'active' ? 'Faol' : 'Bloklangan'}
              <span className={`ml-1.5 ${filter === f ? 'opacity-70' : 'opacity-50'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-16 flex flex-col items-center gap-2">
          <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
          <p className="text-sm text-gray-400">Do'kon topilmadi</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div
              key={s.id}
              className={`bg-white dark:bg-[#16161F] rounded-2xl border shadow-sm flex flex-col transition-all ${
                s.is_blocked
                  ? 'border-red-200 dark:border-red-900/50 opacity-75'
                  : 'border-gray-200 dark:border-gray-800 hover:border-[#FF9900]/40'
              }`}
            >
              {/* Card header */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#FF9900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-black text-gray-900 dark:text-white leading-tight truncate">
                      {s.shop_name || '—'}
                    </p>
                    <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.is_blocked
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.is_blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {s.is_blocked ? 'Bloklangan' : 'Faol'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {s.full_name}
                    {s.telegram_username ? ` · @${s.telegram_username}` : ''}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="px-5 pb-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-black px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {s.room_code || '—'}
                  </span>
                  <span className="text-xs text-gray-400">Xona</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#FF9900]">{s.products_count}</span>
                  <span className="text-xs text-gray-400">mahsulot</span>
                </div>
                {s.phone && (
                  <div className="ml-auto text-xs text-gray-400 truncate">{s.phone}</div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-800 mx-5" />

              {/* Actions */}
              <div className="flex">
                <Link
                  href={`/admin/sellers/${s.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold text-gray-500 hover:text-[#FF9900] hover:bg-[#FF9900]/5 transition-colors rounded-bl-2xl"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ko'rish
                </Link>
                <div className="w-px bg-gray-100 dark:bg-gray-800 my-2" />
                <button
                  disabled={isPending}
                  onClick={() => setConfirm({ id: s.id, type: s.is_blocked ? 'unblock' : 'block' })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition-colors rounded-br-2xl disabled:opacity-50 ${
                    s.is_blocked
                      ? 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                  }`}
                >
                  {s.is_blocked ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Blokdan chiqarish
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Bloklash
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm modal */}
      {confirm && target && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16161F] rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              confirm.type === 'block'
                ? 'bg-amber-100 dark:bg-amber-900/30'
                : 'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              <svg className={`w-6 h-6 ${confirm.type === 'block' ? 'text-amber-500' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {confirm.type === 'block' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                )}
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white">
                {confirm.type === 'block' ? "Do'konni bloklash" : "Do'konni faollashtirish"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                {confirm.type === 'block'
                  ? `"${target.shop_name || target.full_name}" do'koni bloklanadi. Sotuvchi tizimga kira olmaydi.`
                  : `"${target.shop_name || target.full_name}" do'koni qayta faollashtiriladi.`}
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={doAction}
                className={`flex-1 h-11 rounded-xl text-white text-sm font-black transition ${
                  confirm.type === 'block'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {confirm.type === 'block' ? 'Bloklash' : 'Faollashtirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
