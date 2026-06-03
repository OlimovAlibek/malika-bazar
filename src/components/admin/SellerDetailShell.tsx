'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/format'
import type { AdminSeller, AdminProduct } from '@/lib/db/admin'
import { blockSellerAction, deleteSellerAction, updateSellerAction } from '@/actions/admin'

type Props = {
  seller: AdminSeller
  products: AdminProduct[]
}

export function SellerDetailShell({ seller: initial, products }: Props) {
  const router = useRouter()
  const [seller, setSeller] = useState(initial)
  const [confirmBlock, setConfirmBlock] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Edit seller info state
  const [editOpen, setEditOpen]     = useState(false)
  const [editError, setEditError]   = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState(false)
  const [editPending, setEditPending] = useState(false)

  function doBlock() {
    const newBlocked = !seller.is_blocked
    setSeller(s => ({ ...s, is_blocked: newBlocked }))
    setConfirmBlock(false)
    startTransition(async () => { await blockSellerAction(seller.id, newBlocked) })
  }

  function doDelete() {
    setConfirmDel(false)
    startTransition(async () => {
      await deleteSellerAction(seller.id)
      router.push('/admin/sellers')
    })
  }

  async function handleEditSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setEditPending(true)
    setEditError(null)
    setEditSuccess(false)
    const result = await updateSellerAction(null, fd)
    setEditPending(false)
    if (result?.error) {
      setEditError(result.error)
    } else {
      const full_name         = (fd.get('full_name') as string).trim()
      const phone             = (fd.get('phone') as string).trim()
      const telegram_username = (fd.get('telegram_username') as string).trim().replace(/^@/, '') || null
      setSeller(s => ({ ...s, full_name, phone, telegram_username }))
      setEditSuccess(true)
      setTimeout(() => { setEditSuccess(false); setEditOpen(false) }, 2000)
    }
  }

  const initials = seller.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const handle   = seller.telegram_username ? `@${seller.telegram_username}` : seller.phone

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start gap-4">
          <Link
            href="/admin/sellers"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Sotuvchilar / {seller.full_name}</p>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">{seller.full_name}</h1>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                seller.is_blocked
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${seller.is_blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                {seller.is_blocked ? 'Bloklangan' : 'Faol'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Delete */}
            <button
              disabled={isPending}
              onClick={() => setConfirmDel(true)}
              className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm font-bold transition disabled:opacity-50 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span className="hidden sm:block">O'chirish</span>
            </button>

            {/* Block/Unblock */}
            <button
              disabled={isPending}
              onClick={() => setConfirmBlock(true)}
              className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-bold transition disabled:opacity-50 ${
                seller.is_blocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {seller.is_blocked ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                )}
              </svg>
              {seller.is_blocked ? 'Blokdan chiqarish' : 'Bloklash'}
            </button>
          </div>
        </div>

        {/* Two-column info */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Seller profile card */}
          <div className="lg:col-span-1 bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-center text-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-black ${
              seller.is_blocked
                ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                : 'bg-[#FF9900]/15 text-[#FF9900]'
            }`}>
              {initials}
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 dark:text-white">{seller.full_name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{handle}</p>
            </div>
            <div className="w-full space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <InfoRow
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />}
                label="Telefon"
                value={seller.phone || '—'}
              />
              <InfoRow
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />}
                label="Qo'shilgan"
                value={new Date(seller.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              {seller.last_active_at && (
                <InfoRow
                  icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  label="So'nggi faollik"
                  value={new Date(seller.last_active_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                />
              )}
            </div>
          </div>

          {/* Shop + stats */}
          <div className="lg:col-span-2 space-y-4">

            {/* Shop card */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Do'kon ma'lumotlari</p>
              {seller.shop_id ? (
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-[#FF9900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-black text-gray-900 dark:text-white">{seller.shop_name || '—'}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {seller.room_code && (
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          Xona {seller.room_code}
                        </span>
                      )}
                      {seller.shop_phone && (
                        <span className="text-xs text-gray-400">{seller.shop_phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Do'kon hali ochilmagan</p>
              )}
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Mahsulotlar"
                value={seller.products_count}
                color="text-[#FF9900]"
                bg="bg-[#FF9900]/10"
              />
              <StatCard
                label="Holat"
                value={seller.is_blocked ? 'Bloklangan' : 'Faol'}
                color={seller.is_blocked ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}
                bg={seller.is_blocked ? 'bg-red-500/10' : 'bg-emerald-500/10'}
              />
              <StatCard
                label="Xona"
                value={seller.room_code || '—'}
                color="text-sky-600 dark:text-sky-400"
                bg="bg-sky-500/10"
              />
            </div>

          </div>
        </div>

        {/* Edit seller info */}
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <button
            onClick={() => { setEditOpen(v => !v); setEditError(null); setEditSuccess(false) }}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Sotuvchi ma'lumotlarini tahrirlash</span>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${editOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {editOpen && (
            <form onSubmit={handleEditSubmit} className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <input type="hidden" name="id" value={seller.id} />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">To'liq ism</label>
                <input
                  name="full_name"
                  defaultValue={seller.full_name}
                  placeholder="Ism Familiya"
                  required
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Telefon raqami</label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={seller.phone ?? ''}
                  placeholder="+998901234567"
                  required
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Telegram username</label>
                <div className="flex items-center h-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#FF9900] transition-colors">
                  <span className="px-3 text-sm text-gray-500 border-r border-gray-200 dark:border-gray-700 h-full flex items-center bg-white dark:bg-[#16161F] font-medium">@</span>
                  <input
                    name="telegram_username"
                    defaultValue={seller.telegram_username?.replace(/^@/, '') ?? ''}
                    placeholder="username"
                    className="flex-1 px-3 text-sm bg-transparent text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
              {editError && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ma'lumotlar muvaffaqiyatli yangilandi
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setEditOpen(false); setEditError(null) }}
                  className="flex-1 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={editPending}
                  className="flex-1 h-10 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-black disabled:opacity-60 transition"
                >
                  {editPending ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-black text-gray-900 dark:text-white">
              Mahsulotlar
              <span className="ml-2 text-sm font-bold text-gray-400">{products.length} ta</span>
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-14 flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
              </svg>
              <p className="text-sm text-gray-400">Hali mahsulot qo'shilmagan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p, idx) => (
                <div key={p.id} className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-900">
                    {p.primary_image_url ? (
                      <Image
                        src={p.primary_image_url}
                        alt={p.model}
                        fill
                        unoptimized
                        priority={idx === 0}
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
                        </svg>
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.condition === 'new'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                    }`}>
                      {p.condition === 'new' ? 'Yangi' : 'B/U'}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {p.brand} {p.model}{p.storage_gb ? ` ${p.storage_gb}GB` : ''}
                    </p>
                    <p className="text-sm font-black text-[#FF9900] mt-1">{formatPrice(p.price_uzs)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Block confirm modal */}
      {confirmBlock && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16161F] rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              seller.is_blocked ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
            }`}>
              <svg className={`w-6 h-6 ${seller.is_blocked ? 'text-emerald-500' : 'text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {seller.is_blocked ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                )}
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white">
                {seller.is_blocked ? 'Sotuvchini faollashtirish' : 'Sotuvchini bloklash'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                {seller.is_blocked
                  ? `${seller.full_name} qayta tizimga kira oladi va do'koni faollashadi.`
                  : `${seller.full_name} tizimga kira olmay qoladi va do'koni ko'rinmaydi.`}
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmBlock(false)}
                className="flex-1 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={doBlock}
                className={`flex-1 h-11 rounded-xl text-white text-sm font-black transition ${
                  seller.is_blocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {seller.is_blocked ? 'Faollashtirish' : 'Bloklash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16161F] rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white">Sotuvchini o'chirish</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{seller.full_name}</span> va uning barcha mahsulotlari o'chib ketadi. Bu amalni bekor qilib bo'lmaydi.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmDel(false)}
                className="flex-1 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={doDelete}
                disabled={isPending}
                className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-black disabled:opacity-60 transition"
              >
                {isPending ? 'O\'chirilmoqda...' : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, bg }: { label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16161F] p-4 shadow-sm">
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center mb-3`}>
        <span className={`w-2.5 h-2.5 rounded-full ${color.replace('text-', 'bg-').split(' ')[0]}`} />
      </div>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}
