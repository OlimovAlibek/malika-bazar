'use client';

import { useEffect, useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  productId: string;
  initialLiked: boolean;
  onUnliked?: () => void;
};

export default function FavoriteButton({
  productId,
  initialLiked,
  onUnliked,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ✅ Optimistic state (this is the KEY)
  const [optimisticLiked, toggleOptimistic] = useOptimistic(
    initialLiked,
    (state) => !state
  );

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // ⚡ INSTANT UI CHANGE
    toggleOptimistic(null);

    startTransition(async () => {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        router.push('/tg');
        return;
      }

      const data = await res.json();

      // ✅ If unliked on favorites page → remove from list
      if (!data.liked && onUnliked) {
        onUnliked();
        return;
      }

      // Else just refresh server components
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggleFavorite}
      aria-label="Sevimlilarga qo‘shish"
      className="
        absolute top-2 right-2 z-10
        rounded-full bg-white/90 dark:bg-slate-900/90
        backdrop-blur border border-gray-200 dark:border-slate-700
        p-2 shadow-sm
        transition active:scale-95
      "
    >
      {isPending ? (
        <span className="animate-spin text-gray-400">⟳</span>
      ) : optimisticLiked ? (
        <span className="text-red-500 text-lg">❤️</span>
      ) : (
        <span className="text-gray-400 text-lg">🤍</span>
      )}
    </button>
  );
}