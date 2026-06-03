import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { FavoriteButton } from '@/components/FavoriteButton'
import { formatDate, formatNum } from '@/lib/format'
import type { ProductCard as ProductCardType } from '@/types'

type Props = ProductCardType & { liked?: boolean }

// ─── Grid card ────────────────────────────────────────────────────────────────
export const ProductCard = memo(function ProductCard({
  id, slug, brand, model, storage_gb, condition,
  price_uzs, shop, image_url, liked,
}: Props) {
  return (
    <li className="group">
      <Link
        href={`/phones/${slug}`}
        className="flex flex-col h-full bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 active:scale-[0.97]"
      >
        {/* Image — square ratio, better for phone products */}
        <div className="relative aspect-square overflow-hidden bg-[#F7F7FA] dark:bg-[#111118]">
          {image_url ? (
            <Image
              src={image_url}
              alt={`${brand} ${model}`}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
              </svg>
            </div>
          )}

          {/* Condition badge */}
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide ${
            condition === 'new'
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-400 text-amber-900'
          }`}>
            {condition === 'new' ? 'Yangi' : 'B/U'}
          </span>

          {/* Favorite */}
          <div className="absolute top-1.5 right-1.5">
            <FavoriteButton productId={id} initialLiked={liked} />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col p-3 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 leading-none">
            {brand}
          </p>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 flex-1">
            {model}
            {storage_gb && <span className="font-normal text-gray-400"> · {storage_gb}GB</span>}
          </p>

          {/* Price */}
          <p className="text-base font-black text-gray-900 dark:text-white mt-2 leading-none">
            {formatNum(price_uzs)}
            <span className="text-[11px] font-medium text-gray-400 ml-1">so'm</span>
          </p>

          {/* Shop info */}
          <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[65%] leading-none">
              {shop.name}
            </span>
            <span className="text-[10px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded shrink-0 leading-none">
              {shop.room.code}
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
})

// ─── List card ────────────────────────────────────────────────────────────────
export const ProductCardList = memo(function ProductCardList({
  id, slug, brand, model, storage_gb, condition,
  price_uzs, updated_at, shop, image_url, liked,
}: Props) {
  return (
    <li>
      <Link
        href={`/phones/${slug}`}
        className="flex gap-3 bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-150 active:scale-[0.99]"
      >
        {/* Image — square */}
        <div className="relative w-[100px] h-[100px] shrink-0 bg-[#F7F7FA] dark:bg-[#111118] rounded-xl overflow-hidden">
          {image_url ? (
            <Image
              src={image_url}
              alt={`${brand} ${model}`}
              fill
              sizes="100px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {brand}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                condition === 'new'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {condition === 'new' ? 'Yangi' : 'B/U'}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">
              {model}
              {storage_gb && <span className="font-normal text-gray-400"> · {storage_gb}GB</span>}
            </p>

            <p className="text-base font-black text-gray-900 dark:text-white leading-none">
              {formatNum(price_uzs)}
              <span className="text-[11px] font-medium text-gray-400 ml-1">so'm</span>
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {shop.name}
              </span>
              <span className="text-[10px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded shrink-0">
                {shop.room.code}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0 ml-2">
              {formatDate(updated_at)}
            </span>
          </div>
        </div>

        {/* Favorite */}
        <div className="self-start shrink-0">
          <FavoriteButton productId={id} initialLiked={liked} />
        </div>
      </Link>
    </li>
  )
})
