import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getShopBySlug, getShopProducts } from '@/lib/db/shops'
import { ShopProducts } from '@/components/shop/ShopProducts'

type Props = { params: Promise<{ roomCode: string; shopSlug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shopSlug } = await params
  const shop = await getShopBySlug(shopSlug)
  if (!shop) return { title: 'Topilmadi' }
  return { title: `${shop.name} — Tezku` }
}

export default async function ShopPage({ params }: Props) {
  const { roomCode, shopSlug } = await params
  const [shop, products] = await Promise.all([
    getShopBySlug(shopSlug),
    getShopProducts(shopSlug),
  ])

  if (!shop || shop.room_code.toLowerCase() !== roomCode.toLowerCase()) notFound()

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131921] shadow-md safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/shops"
            className="flex items-center gap-1.5 text-white hover:text-[#FF9900] transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-semibold hidden sm:block">Do'konlar</span>
          </Link>
          <p className="flex-1 min-w-0 text-white text-sm font-semibold truncate">{shop.name}</p>
          <span className="font-mono font-black text-xs bg-[#FF9900]/20 text-[#FF9900] px-2.5 py-1 rounded-lg shrink-0">
            {shop.room_code}
          </span>
        </div>
      </header>

      {/* ── Banner ──────────────────────────────────────────────────────────── */}
      <div className="relative h-[320px] sm:h-[400px] md:h-[460px] overflow-hidden bg-gray-900">

        {shop.banner_url ? (
          <Image
            src={shop.banner_url}
            alt={shop.name}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Gradient overlay: pastdan yuqoriga */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Shop info overlay */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-6 pt-10 max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono font-black text-xs bg-[#FF9900] text-gray-900 px-2.5 py-1 rounded-lg">
                  {shop.room_code}
                </span>
                <span className="text-xs text-white/70 font-medium">Malika bozor</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
                {shop.name}
              </h1>
              <p className="text-white/60 text-sm mt-1.5">{products.length} ta mahsulot</p>
            </div>

            {/* Kontakt tugmalar */}
            <div className="flex gap-2 shrink-0">
              {shop.phone && (
                <a
                  href={`tel:${shop.phone}`}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="hidden sm:block">{shop.phone}</span>
                </a>
              )}
              {shop.telegram_username && (
                <a
                  href={`https://t.me/${shop.telegram_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-blue-500/80 hover:bg-blue-500 backdrop-blur-sm text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
                  </svg>
                  <span className="hidden sm:block">@{shop.telegram_username}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Description ─────────────────────────────────────────────────── */}
        {shop.description && (
          <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Do'kon haqida</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {shop.description}
            </p>
          </div>
        )}

        {/* ── Mahsulotlar ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Mahsulotlar</h2>
          <ShopProducts products={products} />
        </section>

      </div>
    </div>
  )
}
