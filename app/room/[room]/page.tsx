import { notFound } from 'next/navigation';
import { publicSupabase } from '@/lib/supabase/public';
import Link from 'next/link';

type Props = {
  params: {
    code: string;
  };
};

export const revalidate = 0;

export default async function RoomPage({ params }: Props) {
  const roomCode = params.code.toUpperCase();

  // 1️⃣ Get room
  const { data: room } = await publicSupabase
    .from('rooms')
    .select('id, code')
    .eq('code', roomCode)
    .single();

  if (!room) {
    notFound();
  }

  // 2️⃣ Get shops in this room
  const { data: shops } = await publicSupabase
    .from('shops')
    .select('id, name')
    .eq('room_id', room.id)
    .eq('is_active', true);

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Xona {room.code}</h1>
        <p className="text-sm text-gray-500">
          Malika bozor · {shops?.length || 0} ta do‘kon
        </p>
      </div>

      {/* Tabs (static for now) */}
      <div className="flex gap-2">
        <span className="px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-medium">
          Do‘konlar
        </span>
        <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm">
          Mahsulotlar
        </span>
      </div>

      {/* Shops */}
      {shops && shops.length > 0 ? (
        <div className="space-y-2">
          {shops.map(shop => (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className="block rounded-xl border bg-white p-4 hover:bg-gray-50 transition"
            >
              <div className="font-medium">{shop.name}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
          Bu xonada hozircha do‘kon yo‘q
        </div>
      )}
    </main>
  );
}