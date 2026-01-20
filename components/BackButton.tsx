'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-slate-600 shadow hover:bg-white"
    >
      ← Orqaga
    </button>
  );
}