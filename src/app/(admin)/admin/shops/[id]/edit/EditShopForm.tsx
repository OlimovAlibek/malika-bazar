'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { AdminShop } from '@/lib/db/admin'
import { editShopAction } from '@/actions/admin'

export function EditShopForm({ shop }: { shop: AdminShop }) {
  const [state, action, pending] = useActionState(editShopAction, null)

  return (
    <div className="max-w-lg space-y-5">

      <div className="flex items-center gap-3">
        <Link
          href="/admin/shops"
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <p className="text-xs text-gray-400">Do'konlar / Tahrirlash</p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{shop.name}</h1>
        </div>
      </div>

      <form
        action={action}
        className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-5"
      >
        <input type="hidden" name="id" value={shop.id} />

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Do'kon nomi <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            defaultValue={shop.name}
            placeholder="Abdulloh Shop"
            className="input-field"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Xona raqami
          </label>
          <input
            name="room_code"
            defaultValue={shop.room_code ?? ''}
            placeholder="101"
            className="input-field"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Telefon raqami
          </label>
          <input
            name="phone"
            defaultValue={shop.phone ?? ''}
            placeholder="+998901234567"
            className="input-field"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Telegram username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
            <input
              name="telegram_username"
              defaultValue={shop.telegram_username ?? ''}
              placeholder="abdulloh_shop"
              className="input-field pl-8"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tavsif
          </label>
          <textarea
            name="description"
            defaultValue={shop.description ?? ''}
            rows={3}
            placeholder="Do'kon haqida qisqacha..."
            className="input-field resize-none"
          />
        </div>

        {state?.error && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {state.error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Link
            href="/admin/shops"
            className="flex-1 flex items-center justify-center h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Bekor qilish
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 h-12 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-black disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {pending ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>

    </div>
  )
}
