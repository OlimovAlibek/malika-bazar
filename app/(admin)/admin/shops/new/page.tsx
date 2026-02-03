'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { slugify } from '@/lib/slugify';

type Room = {
  id: string;
  code: string; // A-33
};

export default function NewShopPage() {
  const supabase = createClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // Load rooms
  useEffect(() => {
    supabase
      .from('rooms')
      .select('id, code')
      .order('code')
      .then(({ data }) => {
        setRooms(data || []);
      });
  }, [supabase]);

  const saveShop = async () => {
    if (!name.trim()) {
      alert('Shop name is required');
      return;
    }

    if (!roomId) {
      alert('Room must be selected');
      return;
    }

    setLoading(true);

    const slug = slugify(name);

    const { error } = await supabase.from('shops').insert({
      name: name.trim(),
      slug,
      phone_number: phone || null,
      telegram_username: telegram || null,
      room_id: roomId,
      is_active: false, // 🔒 hidden until fully ready
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = '/admin/shops';
  };

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Add New Shop</h2>

      {/* Shop name */}
      <input
        className="border rounded p-2 w-full"
        placeholder="Shop name (e.g. TechnoShop)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Room (REQUIRED) */}
      <select
        className="border rounded p-2 w-full"
        value={roomId || ''}
        onChange={(e) => setRoomId(e.target.value || null)}
      >
        <option value="">Xona tanlang *</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            Xona {room.code}
          </option>
        ))}
      </select>

      {/* Phone */}
      <input
        className="border rounded p-2 w-full"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Telegram */}
      <input
        className="border rounded p-2 w-full"
        placeholder="Telegram username (optional)"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
      />

      {/* Save */}
      <button
        onClick={saveShop}
        disabled={loading}
        className="bg-black text-white p-2 w-full rounded disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}