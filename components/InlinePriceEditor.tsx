'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  productId: string;
  price: number;
};

export function InlinePriceEditor({
  productId,
  price,
}: Props) {
  const supabase = createClient();
  const [value, setValue] = useState(price);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);

    await supabase
      .from('products')
      .update({ price_uzs: value })
      .eq('id', productId);

    setSaving(false);
  };

  return (
    <input
      type="number"
      className={`border p-1 w-32 text-right ${
        saving ? 'opacity-50' : ''
      }`}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          save();
          e.currentTarget.blur();
        }
      }}
    />
  );
}