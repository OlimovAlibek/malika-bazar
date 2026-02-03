import { publicSupabase } from '@/lib/supabase/public';

export const revalidate = 300;

export default async function RoomsPage() {
  const { data: rooms } = await publicSupabase
    .from('rooms')
    .select(`
      id,
      code,
      block:blocks (
        code
      ),
      shops (
        id
      )
    `)
    .order('code', { ascending: true });

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        Hozircha xonalar mavjud emas
      </div>
    );
  }

  // Group by block
  const grouped = rooms.reduce((acc: any, room: any) => {
    const block = room.block.code;
    acc[block] ||= [];
    acc[block].push(room);
    return acc;
  }, {});

  return (
    <main className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
      <h1 className="text-xl font-bold pt-4">
        Malika bozor xonalari
      </h1>

      {Object.entries(grouped).map(([block, rooms]: any) => (
        <section key={block}>
          <h2 className="text-sm font-semibold mb-2">
            Blok {block}
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {rooms.map((room: any) => (
              <a
                key={room.id}
                href={`/${room.code}`}
                className="
                  rounded-xl border
                  bg-white dark:bg-slate-800
                  p-3 text-center
                  hover:border-sky-400
                  transition
                "
              >
                <div className="font-semibold">
                  {room.code}
                </div>
                <div className="text-xs text-gray-500">
                  {room.shops.length} do‘kon
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}