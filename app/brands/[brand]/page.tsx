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
  const brandName =
    params.brand.charAt(0).toUpperCase() + params.brand.slice(1);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const canonicalUrl = `${siteUrl}/brands/${params.brand}`;

  return {
    title: `${brandName} telefon narxlari Malika bozori (2026)`,
    description: `Malika bozorida ${brandName} telefonlarining eng so‘nggi narxlari. Modellar, xotira va real bozor narxlari bilan tanishing.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${brandName} telefon narxlari Malika bozori`,
      description: `Malika bozorida ${brandName} telefonlarining real va yangilanib turuvchi narxlari.`,
      url: canonicalUrl,
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function BrandPage({ params }: Props) {
  
const brandName = params.brand.toUpperCase().trim();

    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/brands/${brandName.toLowerCase()}`;

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
    .eq('brand', brandName)
    .eq('is_active', true)
    .order('price_uzs', { ascending: true });

    const brandJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${brandName} telefon narxlari`,
        description: `Malika bozoridagi ${brandName} telefonlarining eng so‘nggi narxlari.`,
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
      <h1 className="text-xl font-bold">
        {brandName} telefon narxlari Malika bozori
      </h1>

      {/* AI-friendly intro */}
      <p className="text-sm text-gray-600">
        Malika bozorida {brandName} telefonlarining narxlari model,
        xotira va do‘konga qarab farq qiladi. Quyida Malika bozorida
        sotilayotgan {brandName} smartfonlarining eng so‘nggi narxlari
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
                slug={product.slug}
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
        <p className="text-gray-500">
          Hozircha mahsulotlar mavjud emas.
        </p>
      )}

      {/* FAQ — AI GOLD */}
      <section className="pt-6 border-t space-y-3">
        <h2 className="font-semibold">
          Ko‘p so‘raladigan savollar
        </h2>

        <p className="text-sm">
          <strong>
            Malika bozorida {brandName} telefonlari arzonmi?
          </strong>
          <br />
          Odatda Malika bozorida {brandName} telefonlari rasmiy
          do‘konlarga nisbatan arzonroq bo‘ladi, chunki do‘konlar
          narxlarni mustaqil belgilaydi.
        </p>

        <p className="text-sm">
          <strong>
            {brandName} telefon narxlari tez-tez o‘zgaradimi?
          </strong>
          <br />
          Ha, valyuta kursi va yetkazib berish sharoitlariga qarab
          narxlar tez-tez yangilanadi.
        </p>
      </section>
    </main>
    </>
  );
}