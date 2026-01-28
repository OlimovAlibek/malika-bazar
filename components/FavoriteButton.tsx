'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';

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

  // Optimistic state
  const [optimisticLiked, toggleOptimistic] = useOptimistic(
    initialLiked,
    (state) => !state
  );

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Instant UI feedback
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

      if (!data.liked && onUnliked) {
        onUnliked();
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      onClick={toggleFavorite}
      aria-label="Sevimlilarga qo‘shish"
      className="
        absolute top-2 right-2 z-10
        w-9 h-9
        flex items-center justify-center
        rounded-full
        bg-white/90 dark:bg-slate-900/90
        backdrop-blur
        border border-gray-200 dark:border-slate-700
        shadow-sm
        transition
        active:scale-95
        hover:bg-white dark:hover:bg-slate-800
      "
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : (
        <Heart
          className={`w-5 h-5 transition ${
            optimisticLiked
              ? 'fill-rose-500 text-rose-500'
              : 'text-gray-400'
          }`}
        />
      )}
    </button>
  );
}