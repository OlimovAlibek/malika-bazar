export const revalidate = 600;

import type { Metadata } from 'next';
import Image from 'next/image';
import { publicSupabase } from '@/lib/supabase/public';
import { formatUpdatedAt } from '@/lib/formatUpdatedAt';
import ProductActions from '@/components/ProductActions';
import ShareButton from '@/components/ShareButton';
import BackButton from '@/components/BackButton';
import { PhoneCard } from '@/components/PhoneCard';
import FavoriteButton from '@/components/FavoriteButton';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabaseService } from '@/lib/supabase/service';

type Props = {
  params: {
    slug: string;
  };
};

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { data: product } = await publicSupabase
    .from('products')
    .select(`
      slug,
      brand,
      model,
      storage_gb,
      price_uzs,
      shops (
        name
      ),
      product_images (
        image_url
      )
    `)
    .eq('slug', params.slug)
    .single();

  if (!product) {
    return {
      title: 'Mahsulot topilmadi | Tezku',
    };
  }

  const shop = Array.isArray(product.shops)
    ? product.shops[0]
    : product.shops;

  const title = `${product.brand} ${product.model} ${product.storage_gb}GB — ${product.price_uzs.toLocaleString()} so‘m | Tezku`;
  const description = `Tezku — Malika bozorida ${product.brand} ${product.model} ${product.storage_gb}GB narxi. Do‘kon: ${shop?.name || ''}.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const image = product.product_images?.[0]?.image_url;
  const canonicalUrl = `${siteUrl}/phones/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image ? [image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function ProductDetailPage({ params }: Props) {

  
  const { data: product, error } = await publicSupabase
    .from('products')
    .select(`
      id,
      slug,
      brand,
      model,
      storage_gb,
      price_uzs,
      updated_at,
      shop:shops!inner (
      id,
      name,
      slug,
      phone_number,
      telegram_username,
      room:rooms (
        code
      )
    ),
      product_images (
        image_url
      )
    `)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();


    


  if (error || !product) {
    return (
      <div className="p-4 text-slate-900 dark:text-slate-100">
        Mahsulot topilmadi
      </div>
    );
  }

  const user = await getCurrentUser();

let isLiked = false;

if (user) {
  const { data } = await supabaseService
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', product.id)
    .maybeSingle();

  isLiked = !!data;
}

 // ==========================
// SIMILAR PRODUCTS (OPTIMIZED)
// ==========================

// 1️⃣ Strict match: same brand + same storage
const { data: strictMatches } = await publicSupabase
.from('products')
.select(`
  id,
  slug,
  brand,
  model,
  storage_gb,
  price_uzs,
  updated_at,
  shop:shops!inner (
    name,
    slug,
    room:rooms ( code )
  ),
  product_images ( image_url )
`)
.eq('is_active', true)
.eq('brand', product.brand)
.eq('storage_gb', product.storage_gb)
.neq('id', product.id)
.order('price_uzs', { ascending: true })
.limit(6);

// 2️⃣ Fallback pool (covers all remaining cases)
const { data: fallbackPool } = await publicSupabase
.from('products')
.select(`
  id,
  slug,
  brand,
  model,
  storage_gb,
  price_uzs,
  updated_at,
  shop:shops!inner (
    name,
    slug,
    room:rooms ( code )
  ),
  product_images ( image_url )
`)
.eq('is_active', true)
.neq('id', product.id)
.order('price_uzs', { ascending: true })
.limit(20);

// 3️⃣ Merge + deduplicate + cap at 6
const seen = new Set<string>();

const similarProducts = [
...(strictMatches ?? []),
...(fallbackPool ?? []),
].filter((p) => {
if (seen.has(p.id)) return false;
seen.add(p.id);
return true;
}).slice(0, 6);

  

  const shop = Array.isArray(product.shop)
    ? product.shop[0]
    : product.shop;

    const room = Array.isArray(shop.room)
  ? shop.room[0]
  : shop.room;


  const imageUrl = product.product_images?.[0]?.image_url;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.model} ${product.storage_gb}GB`,
    image: imageUrl ? [imageUrl] : [],
    description: `Tezku — Malika bozorida ${product.brand} ${product.model} ${product.storage_gb}GB telefon narxi.`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: product.price_uzs,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/phones/${product.slug}`,
    },
  };

  const favoriteIds = new Set<string>();

if (user) {
  const { data } = await supabaseService
    .from('favorites')
    .select('product_id')
    .eq('user_id', user.id);

  data?.forEach(f => favoriteIds.add(f.product_id));
}

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* Image */}
        {imageUrl && (
          <div className="relative w-full h-64 rounded-xl bg-gray-100 dark:bg-slate-800 overflow-hidden">
            <BackButton />

            {/* ❤️ Favorite */}
            <div className="absolute right-1 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full">
            <FavoriteButton
              productId={product.id}
              initialLiked={isLiked}
            />
            </div>

            <Image
              priority
              src={imageUrl}
              alt={`${product.brand} ${product.model}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain rounded-xl"
            />
          </div>
        )}
        

        {/* Title */}
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          <a
            href={`/brands/${product.brand.toLowerCase()}`}
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {product.brand}
          </a>{' '}
          {product.model} {product.storage_gb}GB
        </h1>

        {/* Price */}
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {product.price_uzs.toLocaleString()} so‘m
        </div>

        {/* Updated */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatUpdatedAt(product.updated_at)}
        </div>

        <section className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            Tezku orqali Malika bozorida {product.brand} {product.model}{' '}
            {product.storage_gb}GB telefonining eng so‘nggi narxlarini
            ko‘rishingiz mumkin. Narxlar do‘kon, xotira hajmi va
            yangilanish vaqtiga qarab farq qiladi.
          </p>
        </section>

        {/* Shop info */}

        {room?.code && shop.slug && (
  <a
    href={`/${room.code}/${shop.slug}`}
    className="block border border-gray-200 dark:border-slate-700 rounded-xl p-3 space-y-1 bg-white dark:bg-slate-800 hover:border-emerald-500 transition"
  >
    <div className="font-medium text-slate-900 dark:text-slate-100">
      {shop.name}
    </div>

    <div className="text-sm text-gray-600 dark:text-gray-400">
      Xona {room.code}
    </div>

    <div className="text-xs text-emerald-600 dark:text-emerald-400">
      Boshqa mahsulotlarni ko‘rish →
    </div>
  </a>
)}

        {/* Actions */}
        <ProductActions
          productId={product.id}
          shopId={shop.id}
          phone={shop.phone_number}
          telegram={shop.telegram_username}
        />

        {/* Share */}
        <ShareButton
          title={`${product.brand} ${product.model} ${product.storage_gb}GB`}
          price={product.price_uzs}
        />

        {/* Similar products */}
        {similarProducts && similarProducts.length > 0 && (
          <section className="pt-6 border-t border-gray-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold mb-3">
  {similarProducts.some(p => p.brand === product.brand)
    ? 'O‘xshash mahsulotlar'
    : 'Sizga yoqishi mumkin'}
</h2>

            <ul className="grid grid-cols-2 gap-3">
              {similarProducts.map((p) => {
                const shop = Array.isArray(p.shop) ? p.shop[0] : p.shop;
                const imageUrl = p.product_images?.[0]?.image_url;

                return (
                  <PhoneCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug || p.id}
                    brand={p.brand}
                    model={p.model}
                    storage_gb={p.storage_gb}
                    price_uzs={p.price_uzs}
                    updated_at={p.updated_at}
                    shopName={shop.name}
                    roomCode={room?.code}
                    imageUrl={imageUrl}
                    liked={favoriteIds.has(p.id)}
                  />
                );
              })}
            </ul>
          </section>
        )}

        <section className="pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
          <h2 className="text-sm font-semibold">
            Ko‘p so‘raladigan savollar
          </h2>

          <div className="text-xs text-gray-700 dark:text-gray-300">
            <strong>
              {product.brand} {product.model} narxi Malika bozorda arzonmi?
            </strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Odatda Malika bozorida {product.brand} {product.model} narxi
              rasmiy do‘konlarga qaraganda arzonroq bo‘ladi, chunki
              sotuvchilar narxlarni mustaqil belgilaydi.
            </p>
          </div>

          <div className="text-xs text-gray-700 dark:text-gray-300">
            <strong>
              {product.brand} {product.model} narxi tez-tez yangilanadimi?
            </strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ha, valyuta kursi va yetkazib berish sharoitlariga qarab
              narxlar tez-tez o‘zgaradi. Tezku’da narxlar doim yangilanadi.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}