'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Block = {
  id: string;
  code: string; // A, B, C
};

export default function NewRoomPage() {
  const supabase = createClient();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockId, setBlockId] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    supabase
      .from('blocks')
      .select('id, code')
      .order('code')
      .then(({ data }) => setBlocks(data || []));
  }, []);

  const saveRoom = async () => {
    if (!blockId || !number) {
      alert('Block va xona raqami majburiy');
      return;
    }

    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const code = `${block.code}-${number}`;

    const { error } = await supabase.from('rooms').insert({
      block_id: blockId,
      number,
      code,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = '/admin/rooms';
  };

  return (
    <div className="space-y-3 max-w-md">
      <h2 className="text-lg font-semibold">Add New Room</h2>

      {/* Block */}
      <select
        className="border p-2 w-full"
        value={blockId}
        onChange={(e) => setBlockId(e.target.value)}
      >
        <option value="">Blok tanlang</option>
        {blocks.map((block) => (
          <option key={block.id} value={block.id}>
            Blok {block.code}
          </option>
        ))}
      </select>

      {/* Number */}
      <input
        className="border p-2 w-full"
        placeholder="Xona raqami (masalan: 33)"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <button
        onClick={saveRoom}
        className="bg-black text-white p-2 w-full"
      >
        Save Room
      </button>
    </div>
  );
}