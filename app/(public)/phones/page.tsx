export const revalidate = 300;

import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabaseService } from '@/lib/supabase/service';
import PhonesToolbar from '@/components/PhonesToolbar';
import ActiveFilters from '@/components/ActiveFilters';

type Props = {
  searchParams?: {
    query?: string;
    brand?: string;     // Apple,Samsung
    min?: string;
    max?: string;
    storage?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest';
  };
};

export default async function PhonesPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  /* ❤️ Favorites */
  const favoriteIds = new Set<string>();
  if (user) {
    const { data } = await supabaseService
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    data?.forEach(f => favoriteIds.add(f.product_id));
  }

  /* 🧠 BASE QUERY */
  let q = publicSupabase
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
        room:rooms ( code )
      ),
      product_images ( image_url )
    `)
    .eq('is_active', true);

  /* 🔍 SEARCH */
  if (searchParams?.query) {
    q = q.or(
      `brand.ilike.%${searchParams.query}%,model.ilike.%${searchParams.query}%`
    );
  }

  /* 🏷 MULTI BRAND */
  if (searchParams?.brand) {
    q = q.in('brand', searchParams.brand.split(','));
  }

  /* 💾 STORAGE */
  if (searchParams?.storage) {
    q = q.eq('storage_gb', Number(searchParams.storage));
  }

  /* 💰 PRICE */
  if (searchParams?.min) q = q.gte('price_uzs', Number(searchParams.min));
  if (searchParams?.max) q = q.lte('price_uzs', Number(searchParams.max));

  /* 🔀 SORT */
  if (searchParams?.sort === 'newest') {
    q = q.order('updated_at', { ascending: false });
  } else {
    q = q.order('price_uzs', {
      ascending: searchParams?.sort !== 'price_desc',
    });
  }

  const { data: products } = await q.limit(60); // hard limit for perf

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
      {/* STICKY TOOLBAR */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b">
        <PhonesToolbar />
        <ActiveFilters />
      </div>

      {/* RESULTS */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {products?.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center text-gray-500">
            Natija topilmadi
          </div>
        )}

        <ul className="space-y-3">
          {products?.map(p => {
            const shop = Array.isArray(p.shop) ? p.shop[0] : p.shop;
            const room = Array.isArray(shop.room) ? shop.room[0] : shop.room;
            const imageUrl = p.product_images?.[0]?.image_url;

            return (
              <PhoneCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                brand={p.brand}
                model={p.model}
                storage_gb={p.storage_gb}
                price_uzs={p.price_uzs}
                updated_at={p.updated_at}
                shopName={shop.name}
                roomCode={room?.code}
                imageUrl={imageUrl}
                liked={favoriteIds.has(p.id)}
                variant="list"
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
}