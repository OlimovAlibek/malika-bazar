export const revalidate = 3600; // 1 hour

import type { Metadata } from 'next';
import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';

type Props = {
  params: {
    brand: string;
  };
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

const { data: products } = await publicSupabase
  .from('products')
  .select('id')
  .ilike('brand', brandSlug)   // ✅ FIX
  .eq('is_active', true);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const canonicalUrl = `${siteUrl}/brands/${params.brand}`;

  return {
    title: `${brandDisplay} telefon narxlari | Tezku — Malika bozori`,
    description: `Tezku — Malika bozorida ${brandDisplay} telefonlarining eng so'nggi narxlari. Modellar, xotira va real bozor narxlari bilan tanishing.`,
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
  
    const brandSlug = params.brand.trim();
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/brands/${brandSlug}`;
    
const brandDisplay =
  brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);

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
      shop_number
    ),
    product_images (
      image_url
    )
  `)
  .ilike('brand', brandSlug)   // ✅ FIX
  .eq('is_active', true)
  .order('price_uzs', { ascending: true });

    const brandJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${brandDisplay} telefon narxlari`,
        description: `Tezku — Malika bozoridagi ${brandDisplay} telefonlarining eng so'nggi narxlari.`,
        url: `${canonicalUrl}`,
      };

  return (

    <>
      {/* JSON-LD */}
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
/>
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

    

      {/* H1 */}
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {brandDisplay} telefon narxlari | Tezku
      </h1>

      {/* AI-friendly intro */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Tezku orqali Malika bozorida {brandDisplay} telefonlarining narxlari model,
        xotira va do&apos;konga qarab farq qiladi. Quyida Malika bozorida
        sotilayotgan {brandDisplay} smartfonlarining eng so&apos;nggi narxlari
        keltirilgan.
      </p>

      {/* Products */}
      {products && products.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3">
          {products.map((product) => {
            const shop = Array.isArray(product.shop)
              ? product.shop[0]
              : product.shop;

            const imageUrl =
              product.product_images?.[0]?.image_url;

            return (
              <PhoneCard
                key={product.id}
                id={product.id}
                slug={product.slug || product.id}
                brand={product.brand}
                model={product.model}
                storage_gb={product.storage_gb}
                price_uzs={product.price_uzs}
                updated_at={product.updated_at}
                shopName={shop.name}
                shopNumber={shop.shop_number}
                imageUrl={imageUrl}
                variant="grid"
              />
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          Hozircha mahsulotlar mavjud emas.
        </p>
      )}

      {/* FAQ — AI GOLD */}
      <section className="pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
          Ko‘p so‘raladigan savollar
        </h2>

        <p className="text-sm text-slate-900 dark:text-slate-100">
          <strong>
            Malika bozorida {brandDisplay} telefonlari arzonmi?
          </strong>
          <br />
          <span className="text-gray-600 dark:text-gray-400">Tezku orqali ko&apos;rib chiqish mumkinki, odatda Malika bozorida {brandDisplay} telefonlari rasmiy
          do&apos;konlarga nisbatan arzonroq bo&apos;ladi, chunki do&apos;konlar
          narxlarni mustaqil belgilaydi.</span>
        </p>

        <p className="text-sm text-slate-900 dark:text-slate-100">
          <strong>
            {brandDisplay} telefon narxlari tez-tez o‘zgaradimi?
          </strong>
          <br />
          <span className="text-gray-600 dark:text-gray-400">Ha, valyuta kursi va yetkazib berish sharoitlariga qarab
          narxlar tez-tez yangilanadi.</span>
        </p>
      </section>
    </main>
    </>
  );
}