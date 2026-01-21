export const revalidate = 0;

import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';


type Props = {
  searchParams?: {
    query?: string;
    brand?: string;
    focus?: string;
  };
};

export default async function PhonesPage({ searchParams }: Props) {
  const supabase = publicSupabase;

  const query = searchParams?.query ?? '';
  const brand = searchParams?.brand ?? '';
  const focus = searchParams?.focus === '1';

  let dbQuery = supabase
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
    .eq('is_active', true);

  if (query) {
    dbQuery = dbQuery.or(
      `brand.ilike.%${query}%,model.ilike.%${query}%`
    );
  }

  if (brand) {
    dbQuery = dbQuery.eq('brand', brand);
  }

  const { data: products, error } = await dbQuery.order(
    'price_uzs',
    { ascending: true }
  );

  if (error) {
    return <div>Xatolik yuz berdi</div>;
  }

  return (
    <main className="min-h-screen pb-8">
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
        <h1 className="text-lg font-bold text-slate-900 mb-1">
  Telefonlar
</h1>

{/* Search input */}
<form action="/phones" className="mb-2">
  <input
    name="query"
    defaultValue={query}
    autoFocus={focus}
    placeholder={
      focus
        ? 'Masalan: iPhone 13, Samsung A12'
        : 'Qidirish yoki filtrlash'
    }
    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
  />
  {brand && (
    <input type="hidden" name="brand" value={brand} />
  )}
</form>

          {/* Brand filter */}
          <div className="flex gap-1 flex-wrap">
            <a
              href="/phones"
              className={`px-2 py-1 border rounded-xl text-xs font-medium transition-all ${
                !brand 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                  : 'bg-white text-slate-700 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              Barchasi
            </a>
            <a
              href="/phones?brand=Apple"
              className={`px-2 py-1 border rounded-xl text-xs font-medium transition-all ${
                brand === 'Apple'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              Apple
            </a>
            <a
              href="/phones?brand=Samsung"
              className={`px-2 py-1 border rounded-xl text-xs font-medium transition-all ${
                brand === 'Samsung'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              Samsung
            </a>
            <a
              href="/phones?brand=Xiaomi"
              className={`px-2 py-1 border rounded-xl text-xs font-medium transition-all ${
                brand === 'Xiaomi'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              Xiaomi
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {products?.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-500 text-base">Natija topilmadi</p>
            <p className="text-sm text-gray-400 mt-1">Boshqa so&apos;rov bilan qayta urinib ko&apos;ring</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">
              Narx bo&apos;yicha tartiblangan
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {products.length} ta
            </span>
          </div>
        )}

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
                slug={product.slug || product.id}
                brand={product.brand}
                model={product.model}
                storage_gb={product.storage_gb}
                price_uzs={product.price_uzs}
                updated_at={product.updated_at}
                shopName={shop.name}
                shopNumber={shop.shop_number}
                imageUrl={imageUrl}
                variant="list"
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
}