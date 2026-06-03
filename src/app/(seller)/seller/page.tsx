import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceClient } from '@/lib/supabase/service'
import { formatPrice, formatNum } from '@/lib/format'

export const metadata: Metadata = { title: 'Dashboard — Sotuvchi' }

export default async function SellerDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'seller') redirect('/profile')

  const { data: shop } = await serviceClient
    .from('shops')
    .select('id, name, room_code')
    .eq('seller_id', user.id)
    .maybeSingle()

  const shopId = shop?.id

  const [productsRes, statsRes] = await Promise.all([
    shopId
      ? serviceClient
          .from('products')
          .select(`id, brand, model, storage_gb, condition, price_uzs, is_active, updated_at, slug,
                   product_images!left ( url, is_primary )`)
          .eq('shop_id', shopId)
          .order('updated_at', { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
    shopId
      ? serviceClient.rpc('fn_shop_stats', { p_shop_id: shopId })
      : Promise.resolve({ data: null }),
  ])

  const recent = (productsRes.data ?? []).map(p => ({
    id:         p.id,
    slug:       p.slug,
    brand:      p.brand,
    model:      p.model,
    storage_gb: p.storage_gb,
    condition:  p.condition as 'new' | 'used',
    price_uzs:  Number(p.price_uzs),
    is_active:  p.is_active,
    image_url:  (p.product_images as { url: string; is_primary: boolean }[])
                  ?.find(img => img.is_primary)?.url ?? null,
  }))

  const statsRow = Array.isArray(statsRes.data) ? statsRes.data[0] : null
  const stats = {
    products: (statsRow as { products_total?: number } | null)?.products_total ?? recent.length,
    views:    (statsRow as { views_30d?: number } | null)?.views_30d    ?? 0,
    calls:    (statsRow as { calls_30d?: number } | null)?.calls_30d    ?? 0,
    telegram: (statsRow as { telegram_30d?: number } | null)?.telegram_30d ?? 0,
  }

  const shopName = user.first_name ?? 'Sotuvchi'
  const today = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Xush kelibsiz, {shopName}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{today}</p>
        </div>
        <Link
          href="/seller/products/new"
          className="shrink-0 flex items-center gap-2 bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Mahsulot
        </Link>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Mahsulotlar',
            value: stats.products,
            color: 'text-[#FF9900]',
            bg:    'bg-[#FF9900]/10',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
              </svg>
            ),
          },
          {
            label: "Ko'rishlar (30 kun)",
            value: stats.views,
            color: 'text-sky-500',
            bg:    'bg-sky-500/10',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
          },
          {
            label: "Qo'ng'iroqlar (30 kun)",
            value: stats.calls,
            color: 'text-emerald-500',
            bg:    'bg-emerald-500/10',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            ),
          },
          {
            label: 'Telegram (30 kun)',
            value: stats.telegram,
            color: 'text-sky-400',
            bg:    'bg-sky-400/10',
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
              </svg>
            ),
          },
        ].map(s => (
          <div
            key={s.label}
            className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mb-4 ${s.color}`}>
              {s.icon}
            </div>
            <p className={`text-3xl font-black ${s.color}`}>{formatNum(Number(s.value))}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">30 kunlik statistika</p>
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
            {[
              { label: "Ko'rishlar",     value: stats.views    },
              { label: "Qo'ng'iroqlar",  value: stats.calls    },
              { label: 'Telegram',       value: stats.telegram },
            ].map(w => (
              <div key={w.label} className="text-center px-4">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{formatNum(Number(w.value))}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{w.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tezkor amallar</p>
          <div className="space-y-2">
            {[
              { href: '/seller/products/new', label: "Mahsulot qo'shish",
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> },
              { href: '/seller/products', label: 'Mahsulotlar',
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> },
              { href: '/seller/shop', label: "Do'konim",
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg> },
            ].map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#FF9900] transition-colors group"
              >
                <span className="text-gray-400 group-hover:text-[#FF9900] transition-colors">{a.icon}</span>
                {a.label}
                <svg className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-[#FF9900] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent products */}
      <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Oxirgi yangilangan</p>
          <Link href="/seller/products" className="text-xs text-[#FF9900] font-semibold hover:underline">
            Barchasini ko'rish
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Mahsulotlar yo'q</p>
            <Link
              href="/seller/products/new"
              className="mt-3 text-xs text-[#FF9900] font-semibold hover:underline"
            >
              Birinchi mahsulotni qo'shish
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map(p => (
              <Link
                key={p.id}
                href={`/seller/products/${p.id}/edit`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 shrink-0 overflow-hidden relative">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.model} fill sizes="48px" className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {p.brand} {p.model}{p.storage_gb ? ` ${p.storage_gb}GB` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      p.condition === 'new'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {p.condition === 'new' ? 'Yangi' : 'B/U'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(p.price_uzs)}</span>
                    {!p.is_active && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                        Nofaol
                      </span>
                    )}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
