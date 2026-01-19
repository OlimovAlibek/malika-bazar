import Image from 'next/image';
import { formatUpdatedAt } from '@/lib/formatUpdatedAt';
import Link from 'next/link';

type PhoneCardProps = {
  id: string;
  brand: string;
  model: string;
  storage_gb: number;
  price_uzs: number;
  shopName: string;
  shopNumber: string;
  imageUrl?: string;
  updated_at?: string;
};



export function PhoneCard({
  id,
  brand,
  model,
  storage_gb,
  price_uzs,
  shopName,
  shopNumber,
  imageUrl,
  updated_at,
}: PhoneCardProps) {
  return (
    <li className="list-none">
      <Link
        href={`/phones/${id}`}
        className="block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer no-underline"
        prefetch={true}
      >
        {/* IMAGE */}
        {imageUrl && (
          <div className="relative w-full h-52 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-100 pointer-events-none">
            <Image
              src={imageUrl}
              alt={`${brand} ${model}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-3 pointer-events-none"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="font-semibold text-base text-slate-900 mb-0.5">
              {brand} {model}
            </div>
            <div className="text-sm text-gray-500">
              {storage_gb}GB
            </div>
          </div>
          
        </div>


        <div className="flex items-baseline gap-2 mb-3">
          <div className="text-3xl font-bold text-slate-900">
            {price_uzs.toLocaleString()}
          </div>
          <div className="text-lg font-medium text-gray-500">
            so&apos;m
          </div>
        </div>

        {updated_at && (
          <div className="text-xs text-gray-500 mb-3">
            {formatUpdatedAt(updated_at)}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Do&apos;kon
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {shopName}
            </span>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
            #{shopNumber}
          </span>
        </div>
        
      </Link>
      
    </li>
  );
}