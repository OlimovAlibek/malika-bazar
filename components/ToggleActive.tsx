'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  productId: string;
  initialValue: boolean;
};

export function ToggleActive({ productId, initialValue }: Props) {
  const supabase = createClient();
  const [active, setActive] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);

    const newValue = !active;

    await supabase
      .from('products')
      .update({ is_active: newValue })
      .eq('id', productId);

    setActive(newValue);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm border ${
        active
          ? 'bg-green-100 text-green-700 border-green-300'
          : 'bg-red-100 text-red-700 border-red-300'
      }`}
    >
      {active ? 'Active' : 'Hidden'}
    </button>
  );
}