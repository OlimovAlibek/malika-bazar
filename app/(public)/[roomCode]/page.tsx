import { notFound } from 'next/navigation';
import { publicSupabase } from '@/lib/supabase/public';

type Props = {
  params: {
    roomCode: string;
  };
};

export const revalidate = 300;

export default async function RoomPage({ params }: Props) {
  const resolvedParams = await params;
  const roomCode = resolvedParams.roomCode.toUpperCase();

  /* 1️⃣ Get room */
  const { data: room, error: roomError } = await publicSupabase
    .from('rooms')
    .select(`
      id,
      code,
      block:blocks (
        code
      )
    `)
    .eq('code', roomCode)
    .single();

  if (roomError || !room) {
    notFound();
  }

  /* 2️⃣ Get ACTIVE shops in room */
  const { data: shopsData } = await publicSupabase
    .from('shops')
    .select(`
      id,
      name,
      slug
    `)
    .eq('room_id', room.id)
    .eq('is_active', true)
    .order('name', { ascending: true });

  // ✅ ALWAYS normalize to array
  const shops = shopsData ?? [];

  return (
    <main className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-xl font-bold">
          Xona {room.code}
        </h1>
        <p className="text-sm text-gray-500">
          Malika bozor · {shops.length} ta do‘kon
        </p>
      </div>

      {/* Shops */}
      <section>
        <h2 className="text-sm font-semibold mb-3">
          Do‘konlar
        </h2>

        {shops.length === 0 ? (
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 text-sm text-gray-500">
            Bu xonada hozircha do‘kon yo‘q
          </div>
        ) : (
          <ul className="space-y-2">
            {shops.map((shop) => (
              <li key={shop.id}>
                <a
                  href={`/${room.code}/${shop.slug}`}
                  className="
                    block rounded-xl border
                    bg-white dark:bg-slate-800
                    px-4 py-3
                    hover:border-sky-400
                    transition
                  "
                >
                  <div className="font-medium">
                    {shop.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Xona {room.code}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}