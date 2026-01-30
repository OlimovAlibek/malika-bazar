'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'Redmi'];
const STORAGES = [64, 128, 256];

export default function FilterSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [brands, setBrands] = useState<string[]>(
    params.get('brand')?.split(',') || []
  );
  const [min, setMin] = useState(params.get('min') || '');
  const [max, setMax] = useState(params.get('max') || '');
  const [storage, setStorage] = useState<string | null>(
    params.get('storage')
  );
  const [sort, setSort] = useState(params.get('sort') || 'price_asc');

  function applyFilters() {
    const q = new URLSearchParams();

    if (brands.length) q.set('brand', brands.join(','));
    if (min) q.set('min', min);
    if (max) q.set('max', max);
    if (storage) q.set('storage', storage);
    if (sort) q.set('sort', sort);

    router.push(`/?${q.toString()}`);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute bottom-11 w-full bg-white dark:bg-slate-900 rounded-t-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filterlar</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand */}
        <div>
          <div className="font-medium mb-2">Brand</div>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map(b => (
              <button
                key={b}
                onClick={() =>
                  setBrands(prev =>
                    prev.includes(b)
                      ? prev.filter(x => x !== b)
                      : [...prev, b]
                  )
                }
                className={`px-4 py-2 rounded-full border text-sm ${
                  brands.includes(b)
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-white dark:bg-slate-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="font-medium mb-2">Narx (so&apos;m)</div>
          <div className="flex gap-2">
            <input
              placeholder="Min"
              value={min}
              onChange={e => setMin(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />
            <input
              placeholder="Max"
              value={max}
              onChange={e => setMax(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>
        </div>

        {/* Storage */}
        <div>
          <div className="font-medium mb-2">Xotira</div>
          <div className="flex gap-2">
            {STORAGES.map(s => (
              <button
                key={s}
                onClick={() =>
                    setStorage(prev => (prev === String(s) ? null : String(s)))
                  }
                className={`px-4 py-2 rounded-full border ${
                  storage === String(s)
                    ? 'bg-sky-500 text-white'
                    : ''
                }`}
              >
                {s}GB
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <div className="font-medium mb-2">Saralash</div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full border rounded-xl px-3 py-2"
          >
            <option value="price_asc">Arzon → Qimmat</option>
            <option value="price_desc">Qimmat → Arzon</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold"
        >
          Filterlarni qo‘llash
        </button>
      </div>
    </div>
  );
}