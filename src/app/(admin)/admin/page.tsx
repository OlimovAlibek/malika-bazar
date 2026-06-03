import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardStats, getRecentSellers, getTopSellersByProducts, getRecentProducts } from '@/lib/db/admin'
import { formatPrice } from '@/lib/format'
import { WebhookButton } from '@/components/admin/WebhookButton'

export const metadata: Metadata = { title: 'Dashboard — Admin' }

export default async function AdminDashboard() {
  const [stats, recentSellers, topSellers, recentProducts] = await Promise.all([
    getDashboardStats(),
    getRecentSellers(5),
    getTopSellersByProducts(5),
    getRecentProducts(6),
  ])

  const today = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const STATS = [
    {
      label: 'Sotuvchilar',
      value: stats.sellers_total,
      sub: `${stats.sellers_active} faol · ${stats.sellers_blocked} bloklangan`,
      href: '/admin/sellers',
      color: 'text-[#FF9900]',
      bg: 'bg-[#FF9900]/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "Do'konlar",
      value: stats.sellers_total,
      sub: `${stats.sellers_active} ta faol`,
      href: '/admin/shops',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      ),
    },
    {
      label: 'Mahsulotlar',
      value: stats.products_total,
      sub: `${stats.products_active} ta faol`,
      href: '/admin/products',
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
        </svg>
      ),
    },
    {
      label: 'Foydalanuvchilar',
      value: stats.buyers_total,
      sub: 'Telegram xaridorlar',
      href: '/admin/users',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{today}</p>
        </div>
        <Link
          href="/admin/sellers/new"
          className="shrink-0 flex items-center gap-2 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Sotuvchi qo'shish
        </Link>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:border-[#FF9900]/40 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mb-4 ${s.color}`}>
              {s.icon}
            </div>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Recent sellers */}
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Yangi qo'shilgan sotuvchilar</p>
            <Link href="/admin/sellers" className="text-xs text-[#FF9900] font-semibold hover:underline">
              Barchasini ko'rish
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentSellers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Hali sotuvchi yo'q</p>
            ) : recentSellers.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-9 h-9 rounded-full bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-[#FF9900]">
                    {s.full_name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {s.telegram_username ? `@${s.telegram_username}` : s.phone}
                    {s.shop_name ? ` · ${s.shop_name}` : ''}
                  </p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.is_blocked
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}>
                  {s.is_blocked ? 'Bloklangan' : 'Faol'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top shops by products */}
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Eng ko'p mahsulotli do'konlar</p>
            <Link href="/admin/shops" className="text-xs text-[#FF9900] font-semibold hover:underline">
              Barchasini ko'rish
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topSellers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Hali do'kon yo'q</p>
            ) : topSellers.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="w-6 text-xs font-black text-gray-400 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {s.shop_name || s.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.room_code ? `Xona ${s.room_code}` : '—'}
                    {s.telegram_username ? ` · @${s.telegram_username}` : ''}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-[#FF9900]">{s.products_count}</p>
                  <p className="text-[10px] text-gray-400">mahsulot</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent products */}
      <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-bold text-gray-900 dark:text-white">So'nggi qo'shilgan mahsulotlar</p>
          <Link href="/admin/products" className="text-xs text-[#FF9900] font-semibold hover:underline">
            Barchasini ko'rish
          </Link>
        </div>
        {recentProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Hali mahsulot yo'q</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentProducts.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {p.brand} {p.model}{p.storage_gb ? ` ${p.storage_gb}GB` : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.shop_name} {p.room_code ? `· Xona ${p.room_code}` : ''}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  p.condition === 'new'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {p.condition === 'new' ? 'Yangi' : 'B/U'}
                </span>
                <p className="text-sm font-bold text-gray-900 dark:text-white shrink-0">
                  {formatPrice(p.price_uzs)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System */}
      <div className="grid md:grid-cols-3 gap-4">
        <WebhookButton currentUrl={process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'} />
      </div>

    </div>
  )
}
