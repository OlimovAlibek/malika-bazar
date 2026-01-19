export const revalidate = 0;

import type { Metadata } from 'next';
import { publicSupabase } from '@/lib/supabase/public';
import { formatUpdatedAt } from '@/lib/formatUpdatedAt';
import ProductActions from '@/components/ProductActions';
import ShareButton from '@/components/ShareButton';

type Props = {
  params: { id: string };
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
    .eq('id', params.id)
    .single();

  if (!product) {
    return {
      title: 'Mahsulot topilmadi | Malika Bazar',
    };
  }

  const shop = Array.isArray(product.shops) ? product.shops[0] : product.shops;
  const title = `${product.brand} ${product.model} ${product.storage_gb}GB — ${product.price_uzs.toLocaleString()} so‘m`;
  const description = `Malika bozorida ${product.brand} ${product.model} ${product.storage_gb}GB narxi. Do‘kon: ${shop?.name || ''}. Eng so‘nggi narxlar.`;

  const image = product.product_images?.[0]?.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
      brand,
      model,
      storage_gb,
      price_uzs,
      updated_at,
      shop:shops!inner (
        id,
        name,
        shop_number,
        phone_number,
        telegram_username
      ),
      product_images (
        image_url
      )
    `)
    .eq('id', params.id)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    return <div className="p-4">Mahsulot topilmadi</div>;
  }

  const shop = Array.isArray(product.shop) ? product.shop[0] : product.shop;
  const imageUrl = product.product_images?.[0]?.image_url;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${product.brand} ${product.model}`}
          className="w-full h-64 object-contain rounded-xl bg-gray-100"
        />
      )}

      {/* Title */}
      <h1 className="text-xl font-semibold">
        {product.brand} {product.model} {product.storage_gb}GB
      </h1>

      {/* Price */}
      <div className="text-3xl font-bold">
        {product.price_uzs.toLocaleString()} so‘m
      </div>

      {/* Updated */}
      <div className="text-sm text-gray-500">
        {formatUpdatedAt(product.updated_at)}
      </div>

      {/* Shop info */}
      <div className="border rounded-xl p-3 space-y-1">
        <div className="font-medium">{shop.name}</div>
        <div className="text-sm text-gray-600">
          Shop {shop.shop_number}
        </div>
      </div>

      {/* Actions (Client Component) */}
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
    </div>
  );
}