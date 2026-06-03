'use client'

import { useState, useEffect, useTransition } from 'react'
import type { AdminBuyer } from '@/lib/db/admin'
import { blockBuyerAction } from '@/actions/admin'

type Props = { buyers: AdminBuyer[] }

export function BuyersList({ buyers: initialBuyers }: Props) {
  const [items, setItems]     = useState(initialBuyers)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | 'active' | 'blocked'>('all')
  const [confirm, setConfirm] = useState<{ id: string; type: 'block' | 'unblock' } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setItems(initialBuyers) }, [initialBuyers])

  const filtered = items.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      b.first_name.toLowerCase().includes(q) ||
      (b.username ?? '').toLowerCase().includes(q) ||
      b.telegram_id.includes(q)
    const matchFilter =
      filter === 'all' ||
      (filter === 'active'  && !b.is_blocked) ||
      (filter === 'blocked' &&  b.is_blocked)
    return matchSearch && matchFilter
  })

  function doAction() {
    if (!confirm) return
    const block = confirm.type === 'block'
    setItems(prev => prev.map(b => b.id === confirm.id ? { ...b, is_blocked: block } : b))
    setConfirm(null)
    startTransition(async () => { await blockBuyerAction(confirm.id, block) })
  }

  const counts = {
    all:     items.length,
    active:  items.filter(b => !b.is_blocked).length,
    blocked: items.filter(b =>  b.is_blocked).length,
  }

  const target = confirm ? items.find(b => b.id === confirm.id) : null

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
            placeholder="Ism, username yoki Telegram ID..."
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

      {/* Table card */}
      <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-800 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <span>Foydalanuvchi</span>
          <span className="text-right">Sevimlilar</span>
          <span className="text-right">Qo'shilgan</span>
          <span className="text-right">Holat</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-sm text-gray-400">Foydalanuvchi topilmadi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black ${
                  b.is_blocked
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                    : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                }`}>
                  {b.first_name.slice(0, 2).toUpperCase()}
                </div>

                {/* Name + username */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{b.first_name}</p>
                    {b.username && (
                      <span className="text-xs text-gray-400">@{b.username}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Telegram ID: <span className="font-mono">{b.telegram_id}</span>
                  </p>
                </div>

                {/* Favorites */}
                <div className="hidden sm:flex items-center gap-1 shrink-0">
                  <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{b.favorites_count}</span>
                </div>

                {/* Joined */}
                <div className="hidden sm:block shrink-0 text-xs text-gray-400">
                  {new Date(b.joined_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.is_blocked
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${b.is_blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {b.is_blocked ? 'Bloklangan' : 'Faol'}
                  </span>

                  <button
                    disabled={isPending}
                    onClick={() => setConfirm({ id: b.id, type: b.is_blocked ? 'unblock' : 'block' })}
                    title={b.is_blocked ? 'Blokdan chiqarish' : 'Bloklash'}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                      b.is_blocked
                        ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {b.is_blocked ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                {confirm.type === 'block' ? 'Foydalanuvchini bloklash' : 'Foydalanuvchini faollashtirish'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                {confirm.type === 'block'
                  ? `${target.first_name} foydalanuvchisi bloklanadi. Bot orqali mahsulotlarga kira olmaydi.`
                  : `${target.first_name} foydalanuvchisi qayta faollashtiriladi.`}
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
