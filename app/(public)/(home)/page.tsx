import Image from 'next/image';
import { Heart, Search } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { publicSupabase } from '@/lib/supabase/public';
import { supabaseService } from '@/lib/supabase/service';
import { PhoneCard } from '@/components/PhoneCard';
import HeaderAction from '@/components/HeaderAction';
import DarkModeToggle from '@/components/DarkModeToggle';
import HeaderIconButton from '@/components/HeaderIconButton';

export const revalidate = 300;

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telefon narxlari — Malika bozor | Tezku',
  description:
    'Tezku — Malika bozorida telefon va smartfonlarning eng arzon va real narxlari. Samsung, iPhone, Xiaomi va boshqa brendlar.',
  alternates: {
    canonical: 'https://tezku.uz',
  },
  openGraph: {
    title: 'Telefon narxlari — Malika bozor | Tezku',
    description:
      'Malika bozorida Samsung, Apple, Xiaomi telefonlarining real va yangilanib turuvchi narxlari.',
    url: 'https://tezku.uz',
    type: 'website',
  },
};

export default async function HomePage() {
  /* =========================
     USER + FAVORITES
  ========================= */
  const user = await getCurrentUser();

  const favoriteIds = new Set<string>();
  if (user) {
    const { data } = await supabaseService
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    data?.forEach(f => favoriteIds.add(f.product_id));
  }

  /* =========================
     1️⃣ CHEAPEST PHONES
  ========================= */
  const { data: cheapestPhones } = await publicSupabase
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
    .eq('is_active', true)
    .order('price_uzs', { ascending: true })
    .limit(12);

  /* =========================
     2️⃣ RECENTLY UPDATED
  ========================= */
  const { data: recentlyUpdated } = await publicSupabase
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
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(6);

    const BRANDS = [
      { name: 'Apple', slug: 'apple', image: '/brands/apple.png' },
      { name: 'Samsung', slug: 'samsung', image: '/brands/samsung.png' },
      { name: 'Xiaomi', slug: 'xiaomi', image: '/brands/xiaomi.png' },
      { name: 'Redmi', slug: 'redmi', image: '/brands/redmi.png' },
      { name: 'Realme', slug: 'realme', image: '/brands/realme.png' },
      { name: 'OPPO', slug: 'oppo', image: '/brands/oppo.png' },
    ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      {/* ================= HEADER ================= */}
      <div className="bg-white dark:bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <Image
            src="/tezku-logo-16x9-removebg-preview.png"
            alt="Tezku"
            width={120}
            height={100}
            className="object-contain"
          />

          <div className="flex items-center gap-2">
            <HeaderIconButton href="/favorites" label="Sevimlilar">
              <Heart className="w-5 h-5 text-red-500" />
            </HeaderIconButton>
            <DarkModeToggle />
            <HeaderAction />
          </div>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form action="/phones" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
      </div>

      {/* ================= BRANDS ================= */}
      <section className="max-w-2xl mx-auto px-4 pb-4">


        <div className="grid grid-cols-6 gap-3">
          {BRANDS.map((brand) => (
            <a
              key={brand.slug}
              href={`/phones?brand=${encodeURIComponent(brand.name)}`}
              className="
                flex flex-col items-center justify-center
                rounded-2xl border
                bg-white dark:bg-slate-800
                
                hover:border-sky-400
                transition
              "
            >
              <div className="relative w-14 h-14 mb-2">
                <Image
                  src={brand.image}
                  alt={`${brand.name} telefonlari`}
                  fill
                  
                  className="object-cover"
                />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ================= CHEAPEST ================= */}
      <section className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Eng arzon narxlar</h2>
          <a
            href="/phones?sort=price_asc"
            className="text-sm text-sky-600 font-medium"
          >
            Barchasini ko‘rish →
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {cheapestPhones?.map(p => {
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
              />
            );
          })}
        </ul>
      </section>

      {/* ================= RECENTLY UPDATED ================= */}
      <section className="max-w-2xl mx-auto px-4">
        <h2 className="text-lg font-semibold mb-3">
          Yaqinda yangilangan
        </h2>

        <ul className="grid grid-cols-2 gap-3">
          {recentlyUpdated?.map(p => {
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
              />
            );
          })}
        </ul>
      </section>

      {/* ================= WHY TEZKU ================= */}
      <section className="max-w-2xl mx-auto px-4 pt-10 pb-6 border-t border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
          Nega Tezku?
        </h2>

        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            <strong>Tezku</strong> — bu Malika bozoridagi telefon va smartfonlarning
            real, solishtiriladigan va doim yangilanib turuvchi narxlarini ko‘rsatadigan platforma.
          </p>

          <p>
            Biz sotuvchi emasmiz. Tezku turli do‘konlardagi narxlarni bir joyda jamlab,
            sizga eng arzon va eng qulay variantni tez topishga yordam beradi.
          </p>

          <p>
            Narxlar do‘kon, xotira hajmi va bozor holatiga qarab o‘zgaradi.
            Tezku orqali siz do‘konma-do‘kon yurmasdan, real bozor narxlarini ko‘rishingiz mumkin.
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>📉 Eng arzon narxlarni solishtirish</li>
            <li>🏬 Qaysi do‘konda borligini ko‘rish</li>
            <li>🔄 Doimiy yangilanadigan narxlar</li>
            <li>📍 Malika bozoriga yo‘naltirilgan</li>
          </ul>
        </div>
      </section>

      <footer className="max-w-2xl mx-auto px-4 py-6 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700">
        <div className="flex flex-col gap-2">
          <p>© {new Date().getFullYear()} Tezku — Malika bozor telefon narxlari</p>
        </div>
      </footer>
    </main>
  );
}