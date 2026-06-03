'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createSellerAction } from '@/actions/admin'

export default function NewSellerPage() {
  const [state, action, pending] = useActionState(createSellerAction, null)

  return (
    <div className="max-w-md">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/sellers"
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Sotuvchilar</p>
          <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Yangi sotuvchi</h1>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

        {/* Avatar placeholder */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-14 h-14 rounded-2xl bg-[#FF9900]/10 border-2 border-dashed border-[#FF9900]/30 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-[#FF9900]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Yangi sotuvchi</p>
            <p className="text-xs text-gray-400 mt-0.5">Ism va telefon kiritilsa yetarli</p>
          </div>
        </div>

        <form action={action} className="p-6 space-y-4">

          {/* Full name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              To'liq ismi <span className="text-red-400 normal-case">*</span>
            </label>
            <input
              name="full_name"
              placeholder="Abdulloh Toshmatov"
              autoComplete="name"
              className="input-field"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Telefon <span className="text-red-400 normal-case">*</span>
            </label>
            <input
              name="phone"
              placeholder="+998 90 123 45 67"
              type="tel"
              autoComplete="tel"
              className="input-field font-mono"
            />
          </div>

          {/* Telegram username */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Username
              <span className="text-gray-400 font-normal normal-case tracking-normal">(ixtiyoriy)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold select-none">@</span>
              <input
                name="telegram_username"
                placeholder="abdulloh_shop"
                className="input-field pl-7"
              />
            </div>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="font-medium">{state.error}</span>
            </div>
          )}

          {/* Note */}
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Sotuvchi Telegram bot orqali telefon raqami bilan tizimga kiradi.
            Do'kon nomi va xona raqamini sotuvchining o'zi to'ldiradi.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Link
              href="/admin/sellers"
              className="flex-1 flex items-center justify-center h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 h-11 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] active:scale-[0.98] text-gray-900 text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saqlanmoqda...
                </span>
              ) : "Qo'shish"}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
