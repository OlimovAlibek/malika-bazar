'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-gray-300 shadow dark:shadow-none hover:bg-white dark:hover:bg-slate-800"
    >
      ← Orqaga
    </button>
  );
}