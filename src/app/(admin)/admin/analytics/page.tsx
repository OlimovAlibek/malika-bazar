import type { Metadata } from 'next'
import { getAnalyticsRaw } from '@/lib/db/admin'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = { title: 'Analitika — Admin' }

const STAT_COLORS = [
  { bar: 'bg-[#FF9900]',   text: 'text-[#FF9900]'   },
  { bar: 'bg-sky-500',     text: 'text-sky-500'      },
  { bar: 'bg-violet-500',  text: 'text-violet-500'   },
  { bar: 'bg-emerald-500', text: 'text-emerald-500'  },
  { bar: 'bg-pink-500',    text: 'text-pink-500'     },
  { bar: 'bg-amber-500',   text: 'text-amber-500'    },
]

export default async function AdminAnalyticsPage() {
  const { sellers: rawSellers, buyers: rawBuyers, products: rawProducts, topShops } =
    await getAnalyticsRaw()

  const totalProducts  = rawProducts.length
  const activeSellers  = rawSellers.filter(s => s.is_blocked === false).length
  const activeBuyers   = rawBuyers.filter(b => b.is_blocked === false).length
  const activeProducts = rawProducts.filter(p => (p as { is_active: boolean }).is_active).length
  const avgPrice       = totalProducts > 0
    ? Math.round((rawProducts as { price_uzs: number }[]).reduce((s, p) => s + p.price_uzs, 0) / totalProducts)
    : 0

  // Brand distribution
  const brandCounts: Record<string, number> = {}
  ;(rawProducts as { brand: string }[]).forEach(p => {
    brandCounts[p.brand] = (brandCounts[p.brand] ?? 0) + 1
  })
  const brandRanking = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
  const maxBrand = brandRanking[0]?.[1] ?? 1

  // Shop product ranking from topShops (v_sellers view)
  const shopRanking = (topShops as { shop_name: string | null; products_count: number }[])
    .filter(s => s.shop_name)
    .slice(0, 8)
  const maxShopProducts = shopRanking[0]?.products_count ?? 1

  // Monthly registrations (last 6 months)
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const year  = d.getFullYear()
    const month = d.getMonth()
    const label = d.toLocaleDateString('uz-UZ', { month: 'short' })
    const sellers = rawSellers.filter(s => {
      const sd = new Date(s.created_at)
      return sd.getFullYear() === year && sd.getMonth() === month
    }).length
    const buyers = rawBuyers.filter(b => {
      const bd = new Date((b as { joined_at: string }).joined_at)
      return bd.getFullYear() === year && bd.getMonth() === month
    }).length
    return { label, sellers, buyers }
  })
  const maxMonthBuyers  = Math.max(...months.map(m => m.buyers),  1)
  const maxMonthSellers = Math.max(...months.map(m => m.sellers), 1)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Analitika</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tizim bo'yicha umumiy ko'rsatkichlar</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Jami mahsulotlar"
          value={totalProducts}
          sub={`${activeProducts} ta faol`}
          color="text-[#FF9900]"
          bg="bg-[#FF9900]/10"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
            </svg>
          }
        />
        <StatCard
          label="Faol sotuvchilar"
          value={activeSellers}
          sub={`${rawSellers.length} ta jami`}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-500/10"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          label="Faol xaridorlar"
          value={activeBuyers}
          sub={`${rawBuyers.length} ta jami`}
          color="text-violet-600 dark:text-violet-400"
          bg="bg-violet-500/10"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
        />
        <StatCard
          label="O'rtacha narx"
          value={formatPrice(avgPrice)}
          sub={`${totalProducts} ta mahsulot`}
          color="text-sky-600 dark:text-sky-400"
          bg="bg-sky-500/10"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
            </svg>
          }
        />
      </div>

      {/* Two-column: shop ranking + brand breakdown */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Shop product ranking */}
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Do'konlar — mahsulot soni</p>
          {shopRanking.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Hali do'kon yo'q</p>
          ) : (
            <div className="space-y-3">
              {shopRanking.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-black text-gray-400 shrink-0 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{s.shop_name}</span>
                      <span className="text-xs font-black text-[#FF9900] shrink-0">{s.products_count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF9900] rounded-full"
                        style={{ width: `${(s.products_count / maxShopProducts) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand breakdown */}
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-4">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Brendlar bo'yicha mahsulotlar</p>
          {brandRanking.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Hali mahsulot yo'q</p>
          ) : (
            <div className="space-y-3">
              {brandRanking.map(([brand, count], i) => {
                const color = STAT_COLORS[i % STAT_COLORS.length]
                return (
                  <div key={brand} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-black text-gray-400 shrink-0 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{brand}</span>
                        <span className={`text-xs font-black shrink-0 ${color.text}`}>{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color.bar}`}
                          style={{ width: `${(count / maxBrand) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Monthly registration chart */}
      <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Oylik ro'yxatdan o'tish</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" />
              Sotuvchilar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              Xaridorlar
            </span>
          </div>
        </div>

        <div className="flex items-end gap-2 h-40">
          {months.map(m => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5 h-32">
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-violet-500 rounded-t-sm"
                    style={{ height: `${(m.buyers / maxMonthBuyers) * 100}%` }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-[#FF9900] rounded-t-sm"
                    style={{ height: `${(m.sellers / maxMonthSellers) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Condition breakdown + price ranges */}
      <div className="grid sm:grid-cols-2 gap-4">

        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-5">Holat bo'yicha</p>
          <ConditionBreakdown products={rawProducts as { condition: string }[]} />
        </div>

        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-5">Narx diapazonlari (UZS)</p>
          <PriceRanges products={rawProducts as { price_uzs: number }[]} />
        </div>

      </div>

    </div>
  )
}

function StatCard({
  label, value, sub, color, bg, icon,
}: {
  label: string
  value: string | number
  sub: string
  color: string
  bg: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  )
}

function ConditionBreakdown({ products }: { products: { condition: string }[] }) {
  const newCount  = products.filter(p => p.condition === 'new').length
  const usedCount = products.filter(p => p.condition !== 'new').length
  const total     = products.length || 1
  const newPct    = Math.round((newCount / total) * 100)
  const usedPct   = 100 - newPct

  return (
    <div className="space-y-4">
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        <div className="bg-emerald-500 rounded-l-full" style={{ width: `${newPct}%` }} />
        <div className="bg-amber-500 flex-1 rounded-r-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs text-gray-500">Yangi</span>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{newCount}</p>
          <p className="text-xs text-gray-400">{newPct}%</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-xs text-gray-500">B/U</span>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{usedCount}</p>
          <p className="text-xs text-gray-400">{usedPct}%</p>
        </div>
      </div>
    </div>
  )
}

function PriceRanges({ products }: { products: { price_uzs: number }[] }) {
  const ranges = [
    { label: '< 3 mln',  min: 0,          max: 3_000_000  },
    { label: '3–7 mln',  min: 3_000_000,  max: 7_000_000  },
    { label: '7–15 mln', min: 7_000_000,  max: 15_000_000 },
    { label: '> 15 mln', min: 15_000_000, max: Infinity   },
  ]

  const counts  = ranges.map(r => ({
    ...r,
    count: products.filter(p => p.price_uzs >= r.min && p.price_uzs < r.max).length,
  }))
  const maxCount = Math.max(...counts.map(c => c.count), 1)

  return (
    <div className="space-y-3">
      {counts.map((r, i) => {
        const color = STAT_COLORS[i % STAT_COLORS.length]
        return (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-14 text-xs font-semibold text-gray-500 shrink-0">{r.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color.bar}`}
                style={{ width: `${(r.count / maxCount) * 100}%` }}
              />
            </div>
            <span className={`w-6 text-xs font-black shrink-0 text-right ${color.text}`}>{r.count}</span>
          </div>
        )
      })}
    </div>
  )
}
