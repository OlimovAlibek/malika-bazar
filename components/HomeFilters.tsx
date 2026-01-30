'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import FilterSheet from './FilterSheet';

export default function HomeFilters() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border flex items-center justify-center"
      >
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      <FilterSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}