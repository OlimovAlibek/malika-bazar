import { createClient } from '@/lib/supabase/server';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  /* =======================
     1️⃣ TOTALS
  ======================= */
  const { data: totals } = await supabase
    .from('product_events')
    .select('event_type');

  const totalCalls =
    totals?.filter(e => e.event_type === 'call').length ?? 0;
  const totalTelegram =
    totals?.filter(e => e.event_type === 'telegram').length ?? 0;

  /* =======================
     2️⃣ TOP PRODUCTS — CALLS
  ======================= */
  const { data: callProductEvents } = await supabase
    .from('product_events')
    .select(`
      product_id,
      products (
        brand,
        model,
        storage_gb,
        shops (
          name,
          shop_number
        )
      )
    `)
    .eq('event_type', 'call');

  const callProductCounts: Record<string, any> = {};

  callProductEvents?.forEach(row => {
    if (!callProductCounts[row.product_id]) {
      callProductCounts[row.product_id] = {
        count: 0,
        product: row.products,
      };
    }
    callProductCounts[row.product_id].count++;
  });

  const topCallProducts = Object.values(callProductCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  /* =======================
     3️⃣ TOP PRODUCTS — TELEGRAM
  ======================= */
  const { data: telegramProductEvents } = await supabase
    .from('product_events')
    .select(`
      product_id,
      products (
        brand,
        model,
        storage_gb,
        shops (
          name,
          shop_number
        )
      )
    `)
    .eq('event_type', 'telegram');

  const telegramProductCounts: Record<string, any> = {};

  telegramProductEvents?.forEach(row => {
    if (!telegramProductCounts[row.product_id]) {
      telegramProductCounts[row.product_id] = {
        count: 0,
        product: row.products,
      };
    }
    telegramProductCounts[row.product_id].count++;
  });

  const topTelegramProducts = Object.values(telegramProductCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  /* =======================
     4️⃣ TOP SHOPS — CALLS
  ======================= */
  const { data: callShopEvents } = await supabase
    .from('product_events')
    .select(`
      shop_id,
      shops (
        name,
        shop_number
      )
    `)
    .eq('event_type', 'call');

  const callShopCounts: Record<string, any> = {};

  callShopEvents?.forEach(row => {
    if (!callShopCounts[row.shop_id]) {
      callShopCounts[row.shop_id] = {
        count: 0,
        shop: row.shops,
      };
    }
    callShopCounts[row.shop_id].count++;
  });

  const topCallShops = Object.values(callShopCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  /* =======================
     5️⃣ TOP SHOPS — TELEGRAM
  ======================= */
  const { data: telegramShopEvents } = await supabase
    .from('product_events')
    .select(`
      shop_id,
      shops (
        name,
        shop_number
      )
    `)
    .eq('event_type', 'telegram');

  const telegramShopCounts: Record<string, any> = {};

  telegramShopEvents?.forEach(row => {
    if (!telegramShopCounts[row.shop_id]) {
      telegramShopCounts[row.shop_id] = {
        count: 0,
        shop: row.shops,
      };
    }
    telegramShopCounts[row.shop_id].count++;
  });

  const topTelegramShops = Object.values(telegramShopCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Analytics</h1>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Calls" value={totalCalls} />
        <StatBox label="Telegram" value={totalTelegram} />
        <StatBox label="Total Events" value={totalCalls + totalTelegram} />
      </div>

      {/* Products — Calls */}
      <section>
        <h2 className="font-medium mb-3">Top Products (Calls)</h2>
        <ListProducts data={topCallProducts} icon="📞" label="calls" />
      </section>

      {/* Products — Telegram */}
      <section>
        <h2 className="font-medium mb-3">Top Products (Telegram)</h2>
        <ListProducts data={topTelegramProducts} icon="💬" label="clicks" />
      </section>

      {/* Shops — Calls */}
      <section>
        <h2 className="font-medium mb-3">Top Shops (Calls)</h2>
        <ListShops data={topCallShops} icon="📞" label="calls" />
      </section>

      {/* Shops — Telegram */}
      <section>
        <h2 className="font-medium mb-3">Top Shops (Telegram)</h2>
        <ListShops data={topTelegramShops} icon="💬" label="clicks" />
      </section>
    </div>
  );
}

/* =======================
   SMALL UI HELPERS
======================= */

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function ListProducts({
  data,
  icon,
  label,
}: {
  data: any[];
  icon: string;
  label: string;
}) {
  return (
    <ul className="space-y-2">
      {data.map((item: any, idx) => (
        <li key={idx} className="border p-3 rounded">
          <div className="font-medium">
            {item.product.brand} {item.product.model} {item.product.storage_gb}GB
          </div>
          <div className="text-sm text-gray-600">
            {item.product.shops.name} — #{item.product.shops.shop_number}
          </div>
          <div className="text-sm font-semibold mt-1">
            {icon} {item.count} {label}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ListShops({
  data,
  icon,
  label,
}: {
  data: any[];
  icon: string;
  label: string;
}) {
  return (
    <ul className="space-y-2">
      {data.map((item: any, idx) => (
        <li key={idx} className="border p-3 rounded">
          <div className="font-medium">{item.shop.name}</div>
          <div className="text-sm text-gray-600">
            Shop #{item.shop.shop_number}
          </div>
          <div className="text-sm font-semibold mt-1">
            {icon} {item.count} {label}
          </div>
        </li>
      ))}
    </ul>
  );
}