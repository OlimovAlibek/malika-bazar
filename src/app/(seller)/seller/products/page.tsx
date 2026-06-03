import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { serviceClient } from '@/lib/supabase/service'
import { SellerProductsList } from '@/components/seller/SellerProductsList'

export const metadata: Metadata = { title: 'Mahsulotlar — Sotuvchi' }

export default async function SellerProductsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'seller') redirect('/profile')

  const { data: shop } = await serviceClient
    .from('shops')
    .select('id, name, phone, telegram_username')
    .eq('seller_id', user.id)
    .maybeSingle()

  const shopId = shop?.id
  const shopIncomplete = shopId && !(shop?.name?.trim() && shop?.phone?.trim() && shop?.telegram_username?.trim())

  const { data: rows } = shopId
    ? await serviceClient
        .from('products')
        .select(`
          id, slug, brand, model, storage_gb, condition,
          price_uzs, is_active, updated_at,
          product_images!left ( url, is_primary )
        `)
        .eq('shop_id', shopId)
        .order('updated_at', { ascending: false })
    : { data: [] }

  const products = (rows ?? []).map(p => ({
    id:         p.id,
    slug:       p.slug,
    brand:      p.brand,
    model:      p.model,
    storage_gb: p.storage_gb,
    condition:  p.condition as 'new' | 'used',
    price_uzs:  Number(p.price_uzs),
    is_active:  p.is_active,
    updated_at: p.updated_at,
    image_url:  (p.product_images as { url: string; is_primary: boolean }[])
                  ?.find(img => img.is_primary)?.url ?? null,
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mahsulotlar</h1>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {products.length}
          </span>
        </div>
        <Link
          href="/seller/products/new"
          title={shopIncomplete ? "Avval do'kon ma'lumotlarini to'ldiring" : undefined}
          className={`flex items-center gap-2 text-gray-900 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            shopIncomplete
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-[#FF9900] hover:bg-[#e8a000]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yangi mahsulot
        </Link>
      </div>

      {products.length === 0 && !shopId ? (
        <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 py-20 flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Do'koningiz sozlanmagan</p>
          <Link
            href="/seller/shop"
            className="text-xs text-[#FF9900] font-semibold hover:underline"
          >
            Do'konni sozlash
          </Link>
        </div>
      ) : (
        <SellerProductsList initialProducts={products} />
      )}
    </div>
  )
}
