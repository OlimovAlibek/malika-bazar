'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ButtonLoader from './ui/ButtonLoader';

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
      className={`px-3 py-1 rounded text-sm border flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
        active
          ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
          : 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      }`}
    >
      {loading && <ButtonLoader size="sm" />}
      {active ? 'Active' : 'Hidden'}
    </button>
  );
}