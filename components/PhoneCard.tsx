import Image from 'next/image';
import Link from 'next/link';
import { formatUpdatedAt } from '@/lib/formatUpdatedAt';
import FavoriteButton from '@/components/FavoriteButton';

type Props = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  storage_gb: number;
  price_uzs: number;
  shopName: string;
  roomCode?: string;
  imageUrl?: string;
  updated_at?: string;
  liked?: boolean;
  onUnliked?: () => void;

  /** NEW */
  variant?: 'grid' | 'list';
};

export function PhoneCard({
  id,
  slug,
  brand,
  model,
  storage_gb,
  price_uzs,
  shopName,
  roomCode,
  imageUrl,
  updated_at,
  liked = false,
  onUnliked,
  variant = 'grid', // ✅ default stays GRID
}: Props) {
  /* ================= LIST LAYOUT ================= */
  if (variant === 'list') {
    return (
      <li>
        <Link
          href={`/phones/${slug}`}
          className="relative flex gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3"
        >
          <FavoriteButton
          key={`${id}-${liked}`}
            productId={id}
            initialLiked={liked}
            onUnliked={onUnliked}
          />

          {/* Image */}
          <div className="relative w-32 h-32 shrink-0 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={`${brand} ${model}`}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-xs uppercase text-gray-500 font-medium">
                {brand}
              </div>

              <div className="text-sm font-medium leading-tight">
                {model} · {storage_gb}GB
              </div>

              <div className="text-base font-bold text-sky-600">
                {price_uzs.toLocaleString()} so&apos;m
              </div>

              {updated_at && (
                <div className="text-[11px] text-gray-400">
                  {formatUpdatedAt(updated_at)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {shopName}
              </span>

              {roomCode && (
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 font-mono">
                  {roomCode}
                </span>
              )}
            </div>
          </div>
        </Link>
      </li>
    );
  }

  /* ================= GRID LAYOUT (OLD, UNCHANGED) ================= */
  return (
    <li>
      <div className="relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
        <FavoriteButton
          productId={id}
          initialLiked={liked}
          onUnliked={onUnliked}
        />

        <Link href={`/phones/${slug}`} className="block p-2">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={`${brand} ${model}`}
                fill
                sizes="(max-width:768px) 50vw, 240px"
                className="object-contain p-2"
              />
            )}
          </div>

          {/* Info */}
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-500 uppercase font-medium">
              {brand}
            </div>

            <div className="text-sm leading-tight font-medium line-clamp-2">
              {model} · {storage_gb}GB
            </div>

            <div className="text-base font-bold text-sky-600">
              {price_uzs.toLocaleString()} so&apos;m
            </div>

            {updated_at && (
              <div className="text-[11px] text-gray-400">
                {formatUpdatedAt(updated_at)}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {shopName}
            </span>

            {roomCode && (
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 font-mono">
                {roomCode}
              </span>
            )}
          </div>
        </Link>
      </div>
    </li>
  );
}