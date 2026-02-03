'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Room = {
  id: string;
  code: string; // A-33
};

type Props = {
  shop: any;
  rooms: Room[];
};

export default function EditShopForm({ shop, rooms }: Props) {
  const supabase = createClient();

  const [name, setName] = useState(shop.name);
  const [phone, setPhone] = useState(shop.phone_number);
  const [telegram, setTelegram] = useState(shop.telegram_username || '');
  const [active, setActive] = useState(shop.is_active);
  const [roomId, setRoomId] = useState<string | null>(shop.room_id);

  const save = async () => {
    await supabase
      .from('shops')
      .update({
        name,
        phone_number: phone,
        telegram_username: telegram || null,
        is_active: active,
        room_id: roomId,
      })
      .eq('id', shop.id);

    window.location.href = '/admin/shops';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Edit Shop</h2>

      {/* Shop name */}
      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Shop name"
      />

      {/* Room */}
      <select
        className="border p-2 w-full"
        value={roomId || ''}
        onChange={(e) =>
          setRoomId(e.target.value || null)
        }
      >
        <option value="">Xona tanlanmagan</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            Xona {room.code}
          </option>
        ))}
      </select>

      {/* Phone */}
      <input
        className="border p-2 w-full"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />

      {/* Telegram */}
      <input
        className="border p-2 w-full"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        placeholder="Telegram username (optional)"
      />

      {/* Active */}
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