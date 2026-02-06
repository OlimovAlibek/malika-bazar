'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function ActiveFilters() {
  const params = useSearchParams();
  const router = useRouter();

  const entries = Array.from(params.entries());
  if (entries.length === 0) return null;

  function remove(key: string) {
    const q = new URLSearchParams(params.toString());
    q.delete(key);
    router.push(`/phones?${q.toString()}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-2 flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <button
          key={key}
          onClick={() => remove(key)}
          className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs"
        >
          {key}: {value} ✕
        </button>
      ))}

      <button
        onClick={() => router.push('/phones')}
        className="text-xs text-gray-500 underline ml-2"
      >
        Hammasini tozalash
      </button>
    </div>
  );
}