export const revalidate = 0;

import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';

export default async function HomePage() { // ✅ AWAIT HERE

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
    return <div>Xatolik yuz berdi</div>;
  }

  return (
    <main className="min-h-screen pb-8">
      {/* Hero search section */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Malika bozoridagi real telefon narxlari
          </h1>
          <p className="text-sm text-gray-500 mb-5">
            Eng arzon narxlarni toping va solishtiring
          </p>

          <form
            action="/phones"
            method="get"
            className="relative"
          >
            <input
              type="text"
              name="query"
              placeholder="Masalan: iPhone 13, Samsung S23..."
              className="w-full border-2 border-emerald-500 rounded-2xl px-5 py-4 text-base bg-white shadow-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-0 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors"
            >
              Qidirish
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Eng arzon narxlar
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {products?.length || 0} ta mahsulot
          </span>
        </div>

        <ul className="space-y-3">
          {products?.map((product) => {
            const shop = Array.isArray(product.shop) ? product.shop[0] : product.shop;
            const imageUrl = Array.isArray(product.product_images) && product.product_images[0] 
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
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
}