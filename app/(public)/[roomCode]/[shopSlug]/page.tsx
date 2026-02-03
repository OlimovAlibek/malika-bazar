import { notFound } from 'next/navigation';
import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';

type Props = {
  params: {
    roomCode: string;
    shopSlug: string;
  };
};

export const revalidate = 300;

export default async function ShopPublicPage({ params }: Props) {
  const roomCode = params.roomCode.toUpperCase();
  const shopSlug = params.shopSlug;

  /* 1️⃣ Get room */
  const { data: room } = await publicSupabase
    .from('rooms')
    .select('id, code')
    .eq('code', roomCode)
    .single();

  if (!room) notFound();

  /* 2️⃣ Get shop in this room */
  const { data: shop } = await publicSupabase
    .from('shops')
    .select(`
      id,
      name,
      slug,
      phone_number,
      telegram_username,
      room_id
    `)
    .eq('slug', shopSlug)
    .eq('room_id', room.id)
    .eq('is_active', true)
    .single();

  if (!shop) notFound();

  /* 3️⃣ Get products */
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
      product_images (
        image_url
      )
    `)
    .eq('shop_id', shop.id)
    .eq('is_active', true)
    .order('price_uzs', { ascending: true });

  return (
    <main className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
      {/* Header */}
      <div className="space-y-1 pt-4">
        <h1 className="text-xl font-bold">{shop.name}</h1>
        <p className="text-sm text-gray-500">
          Malika bozor · Xona {room.code}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {shop.telegram_username && (
          <a
            href={`https://t.me/${shop.telegram_username}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium"
          >
            Telegram
          </a>
        )}

        {shop.phone_number && (
          <a
            href={`tel:${shop.phone_number}`}
            className="px-4 py-2 rounded-xl border text-sm font-medium"
          >
            Qo‘ng‘iroq
          </a>
        )}
      </div>

      {/* Products */}
      <section>
        <h2 className="text-sm font-semibold mb-3">
          Mahsulotlar
        </h2>

        {products?.length === 0 && (
          <p className="text-gray-500 text-sm">
            Bu do‘konda hozircha mahsulot yo‘q
          </p>
        )}

        <ul className="grid grid-cols-2 gap-3">
          {products?.map((p) => {
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
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
}