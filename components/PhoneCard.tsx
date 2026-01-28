import Image from 'next/image';
import { formatUpdatedAt } from '@/lib/formatUpdatedAt';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

type PhoneCardProps = {
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
  variant?: 'grid' | 'list';
  liked?: boolean; // ✅ ADD
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
  variant = 'grid',
  liked = false,
  onUnliked,
}: PhoneCardProps) {
  return (
    <li className="list-none">
      <div className="relative">
      <FavoriteButton 
      productId={id}
    initialLiked={liked}
    onUnliked={onUnliked}
    />
      <Link
        href={`/phones/${slug}`}
        className="block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none hover:border-emerald-200 dark:hover:border-emerald-600 transition-all cursor-pointer no-underline"
        prefetch={true}
      >
        {/* IMAGE */}
        {imageUrl && (
          <div
          className={`relative w-full bg-gradient-to-br from-gray-50 dark:from-slate-700 to-gray-100 dark:to-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 mb-2
            ${variant === 'grid' ? 'aspect-square' : 'h-48'}
          `}
        >
            <Image
              src={imageUrl}
              alt={`${brand} ${model}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-2 pointer-events-none"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
          <div
            className={`font-semibold text-slate-900 dark:text-slate-100 leading-tight
              ${variant === 'grid' ? 'text-sm' : 'text-base'}
            `}
          >
              {brand} {model}
            </div>
            <div className={`text-gray-500 dark:text-gray-400 ${variant === 'grid' ? 'text-xs' : 'text-sm'}`}>
              {storage_gb}GB
            </div>
          </div>
          
        </div>


        <div className="flex items-baseline gap-1 mb-2">
        <div
          className={`font-bold text-slate-900 dark:text-slate-100
            ${variant === 'grid' ? 'text-lg' : 'text-2xl'}
          `}
        >
            {price_uzs.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            so&apos;m
          </div>
        </div>

        {updated_at && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {formatUpdatedAt(updated_at)}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-1">
            {/* <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Do&apos;kon
            </span> */}
            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              {shopName}
            </span>
          </div>
          <span className="inline-flex items-center px-1 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300 text-xs font-mono font-semibold">
            #{shopNumber}
          </span>
        </div>
        
      </Link>
      </div>
    </li>
  );
}