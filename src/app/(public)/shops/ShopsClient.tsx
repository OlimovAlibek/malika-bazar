'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopListItem } from '@/lib/db/shops'

type Props = { shops: ShopListItem[] }

export default function ShopsClient({ shops }: Props) {
  const [q, setQ] = useState('')

  const filtered = shops.filter(s =>
    q === '' ||
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.room_code.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131921] shadow-md safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="shrink-0 flex items-baseline gap-1">
            <span className="text-white font-black text-lg tracking-tight">tezku</span>
            <span className="text-[#FF9900] text-[10px] font-black hidden sm:block">.uz</span>
          </Link>

          <div className="flex-1 min-w-0 flex h-9 rounded-lg overflow-hidden ring-2 ring-transparent focus-within:ring-[#FF9900] transition-all">
            <div className="flex-1 flex items-center bg-white dark:bg-gray-100 px-3.5 gap-2">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Do'kon nomi yoki xona raqami..."
                className="flex-1 min-w-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 bg-transparent"
              />
              {q && (
                <button onClick={() => setQ('')} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#131921] border-b border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-white">Malika bozor do'konlari</h1>
          <p className="text-sm text-gray-400 mt-1">
            {filtered.length} ta do'kon · Barcha brendlar bir joyda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">Do'kon topilmadi</p>
            <p className="text-sm text-gray-400 mt-1">Boshqa nom bilan qidiring</p>
            <button
              onClick={() => setQ('')}
              className="mt-4 px-5 py-2 bg-[#FF9900] text-gray-900 text-sm font-bold rounded-xl"
            >
              Tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ShopCard({ shop }: { shop: ShopListItem }) {
  return (
    <div className="group bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">

      <Link href={`/${shop.room_code}/${shop.slug}`} className="block relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {shop.banner_url ? (
          <Image
            src={shop.banner_url}
            alt={shop.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
              <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 right-3 font-mono font-black text-xs bg-black/50 text-white px-2.5 py-1 rounded-lg backdrop-blur-sm">
          {shop.room_code}
        </span>
      </Link>

      <div className="p-4">
        <Link href={`/${shop.room_code}/${shop.slug}`} className="group/link">
          <h3 className="font-black text-gray-900 dark:text-white text-base group-hover/link:text-blue-600 transition-colors">
            {shop.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Malika bozor · {shop.products_count} ta mahsulot
        </p>

        {shop.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          {shop.phone ? (
            <a
              href={`tel:${shop.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Qo'ng'iroq
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-bold py-2.5 rounded-xl">
              Telefon yo'q
            </div>
          )}
          {shop.telegram_username ? (
            <a
              href={`https://t.me/${shop.telegram_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold py-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
              </svg>
              Telegram
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-bold py-2.5 rounded-xl">
              Telegram yo'q
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
