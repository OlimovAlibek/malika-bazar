'use client';

import HomeFilters from '@/components/HomeFilters';

export default function PhonesToolbar() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
      <form action="/phones" className="flex-1">
        <input
          name="query"
          placeholder="iPhone 13, Samsung A12..."
          className="w-full rounded-xl border px-4 py-4 text-sm"
        />
      </form>

      <HomeFilters />
    </div>
  );
}