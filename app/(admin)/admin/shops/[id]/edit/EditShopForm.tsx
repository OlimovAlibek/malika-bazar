'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  shop: any;
};

export default function EditShopForm({ shop }: Props) {
  const supabase = createClient();

  const [name, setName] = useState(shop.name);
  const [shopNumber, setShopNumber] = useState(shop.shop_number);
  const [phone, setPhone] = useState(shop.phone_number);
  const [telegram, setTelegram] = useState(shop.telegram_username);
  const [active, setActive] = useState(shop.is_active);

  const save = async () => {
    await supabase
      .from('shops')
      .update({
        name,
        shop_number: shopNumber,
        phone_number: phone,
        telegram_username: telegram,
        is_active: active,
      })
      .eq('id', shop.id);

    window.location.href = '/admin/shops';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Edit Shop</h2>

      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Shop name"
      />

      <input
        className="border p-2 w-full"
        value={shopNumber}
        onChange={(e) => setShopNumber(e.target.value)}
        placeholder="Shop number"
      />

      <input
        className="border p-2 w-full"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />

      <input
        className="border p-2 w-full"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        placeholder="Telegram username"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label>

      <button
        onClick={save}
        className="bg-black text-white p-2 w-full"
      >
        Save Changes
      </button>
    </div>
  );
}