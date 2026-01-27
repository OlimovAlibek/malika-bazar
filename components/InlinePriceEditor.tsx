'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ButtonLoader from './ui/ButtonLoader';

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
    <div className="inline-flex items-center gap-2">
      <input
        type="number"
        className={`border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 p-1 w-32 text-right rounded ${
          saving ? 'opacity-50' : ''
        }`}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={save}
        disabled={saving}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            save();
            e.currentTarget.blur();
          }
        }}
      />
      {saving && <ButtonLoader size="sm" />}
    </div>
  );
}