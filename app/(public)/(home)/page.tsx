

import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export const revalidate = 0;

import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';
import { supabaseService } from '@/lib/supabase/service';
import HeaderAction from '@/components/HeaderAction';
import DarkModeToggle from '@/components/DarkModeToggle';
import { Heart } from 'lucide-react';
import HeaderIconButton from '@/components/HeaderIconButton';

export default async function HomePage() {

  const user = await getCurrentUser();

  let favoriteProductIds = new Set<string>();

  if (user) {
    const { data: favorites } = await supabaseService
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    favorites?.forEach(f => {
      favoriteProductIds.add(f.product_id);
    });
  }

  const { data: products, error } = await publicSupabase
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
  .eq('is_active', true)
  .order('price_uzs', { ascending: true })
  .limit(10);

  if (error) {
    return <div className="p-4 text-slate-900 dark:text-slate-100">Xatolik yuz berdi</div>;
  }

  return (
    <main className="min-h-screen pb-8">
      {/* Product Top Nav */}
      {/* HEADER (scrolls away) */}
<div className="bg-white dark:bg-slate-900 ">
  <div className="max-w-2xl mx-auto px-4 py-1">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <Image
          src="/logo.jpeg"
          alt="Tezku — telefon narxlari"
          width={48}
          height={48}
          className="rounded-full"
          priority
        />
        <span className="font-bold text-base">TEZKU</span>
      </a>

      {/* Right actions */}
      <div className="flex items-center gap-2">
  {/* Favorites */}
  <HeaderIconButton href="/favorites" label="Sevimlilar">
    <Heart className="w-5 h-5 text-rose-400 dark:text-rose-600 hover:text-rose-500 dark:hover:text-rose-500" />
  </HeaderIconButton>

  {/* Dark mode */}
  <DarkModeToggle />

  {/* Profile / Login */}
  <HeaderAction />
</div>
    </div>
  </div>
</div>

{/* STICKY SEARCH ONLY */}
<div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
  <div className="max-w-2xl mx-auto px-4 py-3">
    <form action="/phones" method="get">
      <input
        type="text"
        name="query"
        placeholder="Telefon qidirish…"
        className="
          w-full
          rounded-xl
          px-4 py-4
          text-sm
          border border-gray-300
          dark:border-slate-600
          dark:bg-slate-800
          focus:ring-2 focus:ring-emerald-500
        "
      />
    </form>
  </div>
</div>

      {/* Brand quick links */}
      <div className="max-w-2xl mx-auto px-4 ">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Samsung', 'Apple', 'Xiaomi', 'Redmi'].map((brand) => (
          <a
            key={brand}
            href={`/brands/${brand.toLowerCase()}`}
            className="
  shrink-0
  px-4 py-2
  rounded-full
  bg-gray-100 dark:bg-slate-800
  text-sm font-medium
  text-gray-700 dark:text-gray-300
  hover:bg-gray-200 dark:hover:bg-slate-700
"
          >
            {brand}
          </a>
        ))}
      </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-2">
        <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
  Eng arzon narxlar
</h2>
<p className="text-sm text-gray-500">
  {products?.length || 0} ta telefon
</p>
        </div>

        <ul className="grid grid-cols-2 gap-4">
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
                slug={product.slug || product.id}
                liked={favoriteProductIds.has(product.id)}
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

