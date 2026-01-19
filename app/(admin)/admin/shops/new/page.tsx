'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function NewShopPage() {
  const supabase = createClient();

  const [name, setName] = useState('');
  const [shopNumber, setShopNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');

  const saveShop = async () => {
    await supabase.from('shops').insert({
      name,
      shop_number: shopNumber,
      phone_number: phone,
      telegram_username: telegram,
    });

    window.location.href = '/admin/shops';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">
        Add New Shop
      </h2>

      <input
        className="border p-2 w-full"
        placeholder="Shop name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Shop number (A-101)"
        onChange={(e) => setShopNumber(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Phone number"
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Telegram username"
        onChange={(e) => setTelegram(e.target.value)}
      />

      <button
        onClick={saveShop}
        className="bg-black text-white p-2 w-full"
      >
        Save
      </button>
    </div>
  );
}