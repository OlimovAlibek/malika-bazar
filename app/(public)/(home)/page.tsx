import Image from 'next/image';
import { Heart, Search, SlidersHorizontal } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { publicSupabase } from '@/lib/supabase/public';
import { supabaseService } from '@/lib/supabase/service';
import { PhoneCard } from '@/components/PhoneCard';
import HeaderAction from '@/components/HeaderAction';
import DarkModeToggle from '@/components/DarkModeToggle';
import HeaderIconButton from '@/components/HeaderIconButton';
import HomeFilters from '@/components/HomeFilters';

export const revalidate = 0;

type Props = {
  searchParams?: {
    brand?: string;
    min?: string;
    max?: string;
    storage?: string;
    sort?: 'price_asc' | 'price_desc';
  };
};

export default async function HomePage({ searchParams }: Props) {
  const user = await getCurrentUser();

  const favoriteIds = new Set<string>();
  if (user) {
    const { data } = await supabaseService
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    data?.forEach(f => favoriteIds.add(f.product_id));
  }

  
  

  let query = publicSupabase
  .from('products')
  .select(`
    id,
    slug,
    brand,
    model,
    storage_gb,
    price_uzs,
    updated_at,
    shop:shops!inner ( name, shop_number ),
    product_images ( image_url )
  `)
  .eq('is_active', true);

// ✅ BRAND (MULTI)
if (searchParams?.brand) {
  const brands = searchParams.brand.split(',');
  query = query.in('brand', brands);
}

// ✅ PRICE
if (searchParams?.min) {
  query = query.gte('price_uzs', Number(searchParams.min));
}
if (searchParams?.max) {
  query = query.lte('price_uzs', Number(searchParams.max));
}

// ✅ STORAGE
if (searchParams?.storage) {
  query = query.eq('storage_gb', Number(searchParams.storage));
}

// ✅ SORT
const sort =
  searchParams?.sort === 'price_desc' ? false : true;

const { data: products } = await query.order('price_uzs', {
  ascending: sort,
});

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="Tezku"
              width={44}
              height={44}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-base">TEZKU</div>
              <div className="text-xs text-gray-500">Malika bozor</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HeaderIconButton href="/favorites" label={''}>
              <Heart className="w-5 h-5 text-sky-500" />
            </HeaderIconButton>
            <DarkModeToggle />
            <HeaderAction />
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="sticky top-0 z-30 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <form action="/phones">
              <input
                name="query"
                placeholder="Telefon qidirish"
                className="
                  w-full rounded-2xl pl-10 pr-4 py-4
                  bg-white dark:bg-slate-800
                  border border-gray-200 dark:border-slate-700
                  text-sm focus:ring-2 focus:ring-sky-500
                "
              />
            </form>
          </div>

          <HomeFilters />
        </div>
      </div>

      {/* BRANDS */}
      <div className="max-w-2xl mx-auto px-4 pb-3">
        <div className="flex gap-3 overflow-x-auto">
          {['Samsung', 'Apple', 'Xiaomi', 'Redmi', 'Realme', 'OPPO'].map(b => (
            <a
              key={b}
              href={`/brands/${b.toLowerCase()}`}
              className="
                shrink-0 px-5 py-2 rounded-full
                bg-white dark:bg-slate-800
                border text-sm font-medium
                hover:border-sky-400
              "
            >
              {b}
            </a>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Eng arzon narxlar</h2>
          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-medium">
            {products?.length ?? 0} ta
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {products?.map(p => {
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
                shopNumber={shop.shop_number}
                imageUrl={imageUrl}
                liked={favoriteIds.has(p.id)}
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
}