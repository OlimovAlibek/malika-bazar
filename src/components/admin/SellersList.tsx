'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import type { AdminSeller } from '@/lib/db/admin'
import { blockSellerAction, deleteSellerAction } from '@/actions/admin'

type Props = { initialSellers: AdminSeller[] }

export function SellersList({ initialSellers }: Props) {
  const [sellers, setSellers] = useState<AdminSeller[]>(initialSellers)
  const [q, setQ]             = useState('')
  const [filter, setFilter]   = useState<'all' | 'active' | 'blocked'>('all')
  const [confirmId, setConfirmId]       = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<'block' | 'unblock' | 'delete'>('block')
  const [isPending, startTransition]    = useTransition()

  useEffect(() => { setSellers(initialSellers) }, [initialSellers])

  const visible = sellers.filter(s => {
    const matchQ =
      q === '' ||
      s.full_name.toLowerCase().includes(q.toLowerCase()) ||
      (s.telegram_username ?? '').toLowerCase().includes(q.toLowerCase()) ||
      (s.shop_name ?? '').toLowerCase().includes(q.toLowerCase())
    const matchF =
      filter === 'all' ||
      (filter === 'active'  ? !s.is_blocked : s.is_blocked)
    return matchQ && matchF
  })

  function openConfirm(id: string, action: 'block' | 'unblock' | 'delete') {
    setConfirmId(id)
    setConfirmAction(action)
  }

  function handleConfirm() {
    if (!confirmId) return
    const id = confirmId
    const action = confirmAction
    setConfirmId(null)

    if (action === 'delete') {
      setSellers(prev => prev.filter(s => s.id !== id))
      startTransition(async () => { await deleteSellerAction(id) })
    } else {
      const block = action === 'block'
      setSellers(prev => prev.map(s => s.id === id ? { ...s, is_blocked: block } : s))
      startTransition(async () => { await blockSellerAction(id, block) })
    }
  }

  const target = sellers.find(s => s.id === confirmId)

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center h-11 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 rounded-xl px-3 gap-2 focus-within:border-[#FF9900] transition-colors">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Ism, username yoki do'kon nomi..."
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
          {(['all', 'active', 'blocked'] as const).map(val => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                filter === val
                  ? 'bg-[#FF9900] text-gray-900'
                  : 'bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {val === 'all' ? 'Barchasi' : val === 'active' ? 'Faol' : 'Bloklangan'}
            </button>
          ))}
          <span className="ml-1 text-xs text-gray-400">{visible.length} ta</span>
        </div>
      </div>

      {/* Table */}
      {visible.length === 0 ? (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-20 flex flex-col items-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500">Sotuvchi topilmadi</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 dark:bg-white/3 border-b border-gray-100 dark:border-gray-800">
            {['Sotuvchi', "Do'kon / Xona", 'Mahsulotlar', 'Holat', 'Amallar'].map(h => (
              <p key={h} className="text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {visible.map(s => (
              <div
                key={s.id}
                className={`grid md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/2 transition-colors ${
                  s.is_blocked ? 'opacity-60' : ''
                }`}
              >
                {/* Sotuvchi */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-[#FF9900]">
                      {s.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {s.telegram_username ? `@${s.telegram_username}` : s.phone}
                    </p>
                  </div>
                </div>

                {/* Do'kon */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {s.shop_name || '—'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {s.room_code && (
                      <span className="font-mono text-[10px] font-black bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                        {s.room_code}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{s.phone}</span>
                  </div>
                </div>

                {/* Mahsulotlar */}
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{s.products_count}</p>
                  <p className="text-xs text-gray-400">mahsulot</p>
                </div>

                {/* Holat */}
                <div>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    s.is_blocked
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.is_blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {s.is_blocked ? 'Bloklangan' : 'Faol'}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(s.created_at).toLocaleDateString('uz-UZ')} dan
                  </p>
                </div>

                {/* Amallar */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/sellers/${s.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#FF9900] hover:bg-[#FF9900]/10 transition-colors"
                    title="Ko'rish"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                  <button
                    disabled={isPending}
                    onClick={() => openConfirm(s.id, s.is_blocked ? 'unblock' : 'block')}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                      s.is_blocked
                        ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                    }`}
                    title={s.is_blocked ? 'Blokni olib tashlash' : 'Bloklash'}
                  >
                    {s.is_blocked ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => openConfirm(s.id, 'delete')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
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
        </div>
      )}

      {/* Confirm modal */}
      {confirmId && target && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
          <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-sm shadow-2xl">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              confirmAction === 'delete'  ? 'bg-red-50 dark:bg-red-900/20' :
              confirmAction === 'block'   ? 'bg-amber-50 dark:bg-amber-900/20' :
              'bg-emerald-50 dark:bg-emerald-900/20'
            }`}>
              <svg className={`w-6 h-6 ${
                confirmAction === 'delete'  ? 'text-red-500' :
                confirmAction === 'block'   ? 'text-amber-500' :
                'text-emerald-500'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {confirmAction === 'delete' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                ) : confirmAction === 'block' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                )}
              </svg>
            </div>
            <p className="text-base font-black text-gray-900 dark:text-white text-center">
              {confirmAction === 'delete'  ? "Sotuvchini o'chirish" :
               confirmAction === 'block'   ? 'Sotuvchini bloklash' :
               'Blokni olib tashlash'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1.5">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{target.full_name}</span>
              {confirmAction === 'delete'  ? " — bu amalni bekor qilib bo'lmaydi" :
               confirmAction === 'block'   ? " — do'koni ko'rinmay qoladi" :
               " — do'koni yana faollashadi"}
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3 rounded-xl text-white text-sm font-black transition ${
                  confirmAction === 'delete'  ? 'bg-red-500 hover:bg-red-600' :
                  confirmAction === 'block'   ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {confirmAction === 'delete'  ? "O'chirish" :
                 confirmAction === 'block'   ? 'Bloklash' :
                 'Blokni olib tashlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
