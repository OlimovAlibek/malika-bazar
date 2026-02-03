import { notFound } from 'next/navigation';
import { publicSupabase } from '@/lib/supabase/public';
import { PhoneCard } from '@/components/PhoneCard';

type Props = {
  params: {
    room: string; // a33
    shop: string; // technoshop
  };
};

export const revalidate = 60;

export default async function ShopInRoomPage({ params }: Props) {
  // normalize: a33 → A-33
  const roomCode =
    params.room.length >= 2
      ? `${params.room[0].toUpperCase()}-${params.room.slice(1)}`
      : params.room.toUpperCase();

  const shopUsername = params.shop.toLowerCase();

  // 1️⃣ Load room
  const { data: room, error: roomError } = await publicSupabase
    .from('rooms')
    .select('id, code')
    .eq('code', roomCode)
    .single();

  if (roomError || !room) {
    notFound();
  }

  // 2️⃣ Load shop IN THIS ROOM ONLY
  const { data: shop, error: shopError } = await publicSupabase
    .from('shops')
    .select('id, name, username')
    .eq('username', shopUsername)
    .eq('room_id', room.id)
    .single();

  if (shopError || !shop) {
    notFound();
  }

  // 3️⃣ Load products of this shop
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
    <main className="max-w-2xl mx-auto px-4 pb-24">
      {/* Header */}
      <div className="py-4">
        <h1 className="text-xl font-bold">{shop.name}</h1>
        <p className="text-sm text-gray-500">
          Malika bozor · Xona {room.code}
        </p>
      </div>

      {/* Products */}
      {products?.length === 0 && (
        <div className="text-sm text-gray-500">
          Bu do‘konda hozircha mahsulot yo‘q
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3">
        {products?.map((p) => {
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
              roomCode={room.code}
              imageUrl={imageUrl}
            />
          );
        })}
      </ul>
    </main>
  );
}