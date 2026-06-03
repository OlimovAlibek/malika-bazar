import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceClient } from '@/lib/supabase/service'
import { formatPrice } from '@/lib/format'
import { ShopSettingsForm } from '@/components/seller/ShopSettingsForm'

export const metadata: Metadata = { title: "Do'konim — Sotuvchi" }

export default async function SellerShopPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'seller') redirect('/profile')

  const { data: shop } = await serviceClient
    .from('shops')
    .select('id, name, slug, room_code, phone, telegram_username, description, banner_url, avatar_url, is_active')
    .eq('seller_id', user.id)
    .maybeSingle()

  const { data: products } = shop
    ? await serviceClient
        .from('products')
        .select('id, condition, price_uzs, brand, model, storage_gb, is_active, updated_at, product_images!left(url, is_primary)')
        .eq('shop_id', shop.id)
        .order('updated_at', { ascending: false })
    : { data: [] }

  const allProducts = products ?? []
  const sellerName  = user.first_name ?? 'Sotuvchi'

  return (
    <div className="space-y-6">

      {/* Page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Do'konim</h1>
        {shop?.slug && !/^[0-9a-f]{8}-/.test(shop.slug) && (
          <Link
            href={`/${shop.slug}`}
            target="_blank"
            className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-[#FF9900]/10 text-[#FF9900] hover:bg-[#FF9900]/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Ommaviy ko'rinish
          </Link>
        )}
      </div>

      {/* Editable settings */}
      <ShopSettingsForm
        shopId={shop?.id ?? ''}
        sellerName={sellerName}
        initial={{
          name:              shop?.name              ?? '',
          room_code:         shop?.room_code         ?? '',
          phone:             shop?.phone             ?? '',
          telegram_username: shop?.telegram_username ?? '',
          description:       shop?.description       ?? '',
          banner_url:        shop?.banner_url        ?? null,
          avatar_url:        shop?.avatar_url        ?? null,
        }}
      />

      {/* Products section */}
      {allProducts.length > 0 && (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Mahsulotlar</p>
            <Link
              href="/seller/products/new"
              className="flex items-center gap-1.5 text-xs font-bold text-[#FF9900] hover:underline"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Qo'shish
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {allProducts.map(p => {
              const imgUrl = (p.product_images as { url: string; is_primary: boolean }[])
                              ?.find(img => img.is_primary)?.url ?? null
              return (
                <Link
                  key={p.id}
                  href={`/seller/products/${p.id}/edit`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 shrink-0 overflow-hidden relative">
                    {imgUrl ? (
                      <Image src={imgUrl} alt={p.model} fill sizes="44px" className="object-contain p-1" unoptimized />
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        p.condition === 'new'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {p.condition === 'new' ? 'Yangi' : 'B/U'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(Number(p.price_uzs))}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {allProducts.length === 0 && (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-12 flex flex-col items-center shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Hali mahsulot yo'q</p>
          <Link href="/seller/products/new" className="text-xs text-[#FF9900] font-semibold hover:underline">
            Birinchi mahsulotni qo'shish
          </Link>
        </div>
      )}

    </div>
  )
}
