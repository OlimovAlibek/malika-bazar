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
  shopNumber: string;
  imageUrl?: string;
  updated_at?: string;
  liked?: boolean;
  onUnliked?: () => void;
};

export function PhoneCard({
  id,
  slug,
  brand,
  model,
  storage_gb,
  price_uzs,
  shopName,
  shopNumber,
  imageUrl,
  updated_at,
  liked = false,
  onUnliked,
}: Props) {
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

            {/* Price */}
            <div className="text-base font-bold text-sky-600">
              {price_uzs.toLocaleString()} so&apos;m
            </div>

            {/* Updated */}
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
            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 font-mono">
              #{shopNumber}
            </span>
          </div>
        </Link>
      </div>
    </li>
  );
}