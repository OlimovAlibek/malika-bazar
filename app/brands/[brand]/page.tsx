export const revalidate = 3600; // 1 hour

import type { Metadata } from 'next';
import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabaseService } from '@/lib/supabase/service';

type Props = {
  params: {
    brand: string;
  };
};

type ShopWithRoom = {
  name: string;
  room: {
    code: string;
  } | null;
};

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const brandSlug = params.brand.trim();
  const brandDisplay =
    brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);

  await publicSupabase
    .from('products')
    .select('id')
    .ilike('brand', brandSlug)
    .eq('is_active', true);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const canonicalUrl = `${siteUrl}/brands/${params.brand}`;

  return {
    title: `${brandDisplay} telefon narxlari | Tezku — Malika bozori`,
    description: `Tezku — Malika bozorida ${brandDisplay} telefonlarining eng so'nggi narxlari.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${brandDisplay} telefon narxlari | Tezku — Malika bozori`,
      description: `Tezku — Malika bozorida ${brandDisplay} telefonlarining real va yangilanib turuvchi narxlari.`,
      url: canonicalUrl,
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function BrandPage({ params }: Props) {
  const user = await getCurrentUser();

  const favoriteProductIds = new Set<string>();

  if (user) {
    const { data: favorites } = await supabaseService
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    favorites?.forEach(f => favoriteProductIds.add(f.product_id));
  }

  const brandSlug = params.brand.trim();
  const brandDisplay =
    brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/brands/${brandSlug}`;

  

  const { data: products } = await publicSupabase
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
        room:rooms!inner (
  code
)
),
      product_images (
        image_url
      )
    `)
    .ilike('brand', brandSlug)
    .eq('is_active', true)
    .order('price_uzs', { ascending: true });

  const brandJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brandDisplay} telefon narxlari`,
    description: `Tezku — Malika bozoridagi ${brandDisplay} telefonlarining eng so'nggi narxlari.`,
    url: canonicalUrl,
  };

  

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {brandDisplay} telefon narxlari | Tezku
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Tezku orqali Malika bozorida {brandDisplay} telefonlarining narxlari model,
          xotira va do‘konga qarab farq qiladi.
        </p>

        {products && products.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3">
            {products.map(product => {
              const shop = Array.isArray(product.shop)
                ? product.shop[0]
                : product.shop;

              const imageUrl = product.product_images?.[0]?.image_url;

              const roomCode =
  Array.isArray(shop.room) ? shop.room[0]?.code : undefined;

              return (
                <PhoneCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug || product.id}
                  liked={favoriteProductIds.has(product.id)}
                  brand={product.brand}
                  model={product.model}
                  storage_gb={product.storage_gb}
                  price_uzs={product.price_uzs}
                  updated_at={product.updated_at}
                  shopName={shop.name}
                  roomCode={roomCode}
                  imageUrl={imageUrl}
                />
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Hozircha mahsulotlar mavjud emas.
          </p>
        )}
      </main>
    </>
  );
}