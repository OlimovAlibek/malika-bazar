import { createClient } from '@/lib/supabase/server';

export default async function AdminRoomsPage() {
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from('rooms')
    .select(`
      id,
      code,
      blocks (
        code
      )
    `)
    .order('code');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rooms</h2>

        <a
          href="/admin/rooms/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Room
        </a>
      </div>

      <ul className="space-y-2">
        {rooms?.map((room) => (
          <li
            key={room.id}
            className="border p-3 rounded bg-white dark:bg-slate-800"
          >
            <div className="font-medium">
              Xona {room.code}
            </div>
            <div className="text-sm text-gray-500">
              Blok {room.blocks?.[0]?.code}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}