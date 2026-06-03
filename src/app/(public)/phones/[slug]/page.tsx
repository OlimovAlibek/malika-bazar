import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getProductDetail, getSimilarProducts, getProductImages, isProductLiked } from '@/lib/db/products'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { formatDate, formatNum } from '@/lib/format'
import { ProductCard } from '@/components/product/ProductCard'
import { ImageGallery } from '@/components/product/ImageGallery'
import { FavoriteButton } from '@/components/FavoriteButton'
import { ContactButtons } from '@/components/product/ContactButtons'
import { ViewTracker } from '@/components/product/ViewTracker'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getProductDetail(slug)
  if (!p) return { title: 'Topilmadi' }

  const storage     = p.storage_gb ? ` ${p.storage_gb}GB` : ''
  const condition   = p.condition === 'new' ? 'Yangi' : 'Ishlatilgan'
  const priceStr    = formatNum(p.price_uzs)
  const title       = `${p.brand} ${p.model}${storage} — ${priceStr} so'm`
  const description = p.description
    ?? `${p.brand} ${p.model}${storage} ${condition} holda ${priceStr} so'mga. Do'kon: ${p.shop.name}, Malika bozor ${p.shop.room.code}-xona.`
  const url         = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tezku.uz'}/phones/${slug}`
  const image       = p.image_url

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type:      'website',
      siteName:  'Tezku',
      locale:    'uz_UZ',
      ...(image && {
        images: [{ url: image, width: 800, height: 800, alt: `${p.brand} ${p.model}${storage}` }],
      }),
    },
    twitter: {
      card:        image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const p = await getProductDetail(slug)
  if (!p) notFound()

  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  const session = token ? await verifyUserToken(token) : null
  const buyerId = session?.role === 'buyer' ? session.id : null

  const [similar, images, initialLiked] = await Promise.all([
    getSimilarProducts(p.brand, p.id, 8),
    getProductImages(p.id),
    buyerId ? isProductLiked(p.id, buyerId) : Promise.resolve(false),
  ])
  const storageStr = p.storage_gb ? ` ${p.storage_gb}GB` : ''
  const shareTitle = `${p.brand} ${p.model}${storageStr} — ${formatNum(p.price_uzs)} so'm`
  const description = p.description ?? `${p.brand} ${p.model} — Malika bozorida eng yaxshi narxda.`

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      <ViewTracker productId={p.id} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131921] shadow-md safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/phones"
            className="flex items-center gap-1.5 text-white hover:text-[#FF9900] transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-semibold hidden sm:block">Orqaga</span>
          </Link>

          <p className="flex-1 min-w-0 text-white text-sm font-semibold truncate">
            {p.brand} {p.model}{p.storage_gb ? ` ${p.storage_gb}GB` : ''}
          </p>

          <div className="shrink-0">
            <FavoriteButton productId={p.id} initialLiked={initialLiked} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* Asosiy blok */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Chap: gallery */}
          <div className="w-full md:w-[420px] md:shrink-0">
            <ImageGallery
              images={images}
              alt={`${p.brand} ${p.model}`}
              conditionLabel={p.condition === 'new' ? 'Yangi' : 'Ishlatilgan'}
              conditionNew={p.condition === 'new'}
            />
          </div>

          {/* O'ng: narx, do'kon, tavsif, xususiyatlar */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Narx va nom */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">{p.brand}</p>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {p.model}
                {p.storage_gb && (
                  <span className="text-gray-400 font-normal"> · {p.storage_gb}GB</span>
                )}
              </h1>
              <p className="text-4xl font-black text-gray-900 dark:text-white mt-4 leading-none">
                {formatNum(p.price_uzs)}
                <span className="text-base font-semibold text-gray-400 ml-2">so'm</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Yangilangan: {formatDate(p.updated_at)}
              </p>
            </div>

            {/* Do'kon va kontakt */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">Do'kon</p>
                  <Link
                    href={`/${p.shop.room.code}/${p.shop.slug}`}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {p.shop.name}
                  </Link>
                </div>
                <span className="font-mono font-black text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg">
                  {p.shop.room.code}
                </span>
              </div>

              <ContactButtons
                productId={p.id}
                phone={p.shop_phone}
                telegram={p.shop_telegram}
                slug={slug}
                title={shareTitle}
              />
            </div>

            {/* Tavsif */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Tavsif</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Xususiyatlar */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Xususiyatlar</h2>
              <div className="space-y-0">
                <Row label="Brend"  value={p.brand} />
                <Row label="Model"  value={p.model} />
                {p.storage_gb && <Row label="Xotira" value={`${p.storage_gb} GB`} />}
                <Row
                  label="Holati"
                  value={p.condition === 'new' ? 'Yangi' : 'Ishlatilgan'}
                  highlight={p.condition === 'new' ? 'green' : 'amber'}
                />
              </div>
            </div>

          </div>
        </div>

        {/* O'xshash telefonlar */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">
              Boshqa {p.brand} telefonlar
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similar.map(s => <ProductCard key={s.id} {...s} />)}
            </ul>
          </section>
        )}

      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'green' | 'amber'
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-semibold ${
        highlight === 'green'
          ? 'text-emerald-600 dark:text-emerald-400'
          : highlight === 'amber'
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-gray-900 dark:text-white'
      }`}>
        {value}
      </span>
    </div>
  )
}
