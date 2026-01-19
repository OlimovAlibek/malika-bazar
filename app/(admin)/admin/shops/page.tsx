import { createClient } from '@/lib/supabase/server';

export default async function AdminShopsPage() {
  const supabase = await createClient();

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Shops</h2>

      <a
        href="/admin/shops/new"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        + Add Shop
      </a>

      <ul className="space-y-2">
        {shops?.map((shop) => (
          <li
            key={shop.id}
            className="border p-3 rounded"
          >
            <div className="font-medium">
              {shop.name}
            </div>
            <div className="text-sm text-gray-600">
              Shop {shop.shop_number} — {shop.phone_number}
            </div>
            
            <a
  href={`/admin/shops/${shop.id}/edit`}
  className="text-sm underline"
>
  Edit
</a>
          </li>
        ))}
      </ul>
    </div>
  );
}