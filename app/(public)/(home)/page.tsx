export const revalidate = 0;

import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';

export default async function HomePage() {
  const { data: products, error } = await publicSupabase
    .from('products')
    .select(`
      id,
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
    .eq('is_active', true)
    .order('price_uzs', { ascending: true })
    .limit(10);

  if (error) {
    return <div className="p-4">Xatolik yuz berdi</div>;
  }

  return (
    <main className="min-h-screen pb-8">
      {/* Product Top Nav */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo / Name */}
          <div className="font-bold text-base text-slate-900 whitespace-nowrap">
            Malika
          </div>

          {/* Search */}
          <form action="/phones" method="get" className="flex-1">
            <input
              type="text"
              name="query"
              placeholder="Telefon qidirish…"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-500">
            Eng arzon narxlar
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {products?.length || 0} ta
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {products?.map((product) => {
            const shop = Array.isArray(product.shop) ? product.shop[0] : product.shop;
            const imageUrl =
              Array.isArray(product.product_images) && product.product_images[0]
                ? product.product_images[0].image_url
                : undefined;

            return (
              <PhoneCard
                key={product.id}
                id={product.id}
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
      </div>
    </main>
  );
}

