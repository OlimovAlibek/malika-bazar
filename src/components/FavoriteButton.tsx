'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const lsKey = (id: string) => `tezku_fav_${id}`

type Props = {
  productId: string
  initialLiked?: boolean
}

export function FavoriteButton({ productId, initialLiked = false }: Props) {
  const [liked,     setLiked]     = useState(initialLiked)
  const [pending,   setPending]   = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  // Mount: initialLiked (server, faqat buyer uchun) localStorage bilan birlashtir
  useEffect(() => {
    if (initialLiked) {
      // Server tasdiqladi (buyer, DB) — localStorage ga ham yoz
      localStorage.setItem(lsKey(productId), '1')
      setLiked(true)
    } else {
      // Server bilmaydi (seller yoki ko'rilmagan) — localStorage ni tekshir
      if (localStorage.getItem(lsKey(productId)) === '1') {
        setLiked(true)
      }
    }
  }, [productId, initialLiked])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    setPending(true)
    const prev = liked
    setLiked(!prev)
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, current_liked: prev }),
      })
      if (res.status === 401) {
        setLiked(prev)
        setShowLogin(true)
        setTimeout(() => setShowLogin(false), 3000)
        return
      }
      const json = await res.json()
      setLiked(json.liked)
      // localStorage ni yangilaymiz (seller + buyer uchun)
      if (json.liked) {
        localStorage.setItem(lsKey(productId), '1')
      } else {
        localStorage.removeItem(lsKey(productId))
      }
    } catch {
      setLiked(prev)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label={liked ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
        disabled={pending}
      >
        <svg
          className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Kirish kerak tooltip */}
      {showLogin && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <Link
            href="/profile"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 whitespace-nowrap bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-semibold px-3 py-2 rounded-xl shadow-xl"
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Kirish kerak
          </Link>
          <div className="absolute top-full right-3 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-white" />
        </div>
      )}
    </div>
  )
}
