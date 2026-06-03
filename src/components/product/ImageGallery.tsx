'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  alt: string
  conditionLabel: string
  conditionNew: boolean
}

export function ImageGallery({ images, alt, conditionLabel, conditionNew }: Props) {
  const [active, setActive]   = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const count = images.length

  const prev = useCallback(() => setActive(i => (i - 1 + count) % count), [count])
  const next = useCallback(() => setActive(i => (i + 1) % count), [count])

  // Touch swipe state
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current || count <= 1) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    // Ignore vertical swipes and short swipes
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx) * 0.9) return
    dx < 0 ? next() : prev()
  }

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     setLightbox(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, prev, next])

  const current = images[active]

  return (
    <>
      {/* ── Asosiy rasm ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-800 sticky top-20">
        <div
          className="relative aspect-square cursor-zoom-in select-none"
          onClick={() => count > 0 && setLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {current ? (
            <Image
              src={current}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-contain p-8 md:p-10"
              priority
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-20 h-20 text-gray-200 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
              </svg>
            </div>
          )}

          {/* Condition badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg tracking-wide pointer-events-none ${
            conditionNew ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-900'
          }`}>
            {conditionLabel}
          </span>

          {/* Expand icon */}
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>

          {/* Counter + swipe hint */}
          {count > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-none">
              <span className="text-[10px] text-white/70 hidden sm:block">← →</span>
              <span className="text-[11px] font-mono font-bold bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                {active + 1}/{count}
              </span>
            </div>
          )}

          {/* Swipe dots indicator on mobile */}
          {count > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none sm:hidden">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-200 ${
                    i === active ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Prev / Next buttons — desktop only */}
        {count > 1 && (
          <div className="hidden sm:flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={prev}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Oldingi
            </button>

            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === active
                      ? 'w-5 h-2 bg-[#FF9900]'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Keyingi
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

        {/* Mobile: swipe nav strip */}
        {count > 1 && (
          <div className="flex sm:hidden items-center justify-between px-3 py-2.5 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex gap-1.5 items-center">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === active
                      ? 'w-5 h-2 bg-[#FF9900]'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────────────────────── */}
      {count > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-[68px] h-[68px] rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                i === active
                  ? 'border-[#FF9900] shadow-md scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="68px"
                className="object-contain p-1.5 bg-white dark:bg-[#16161F]"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            onClick={() => setLightbox(false)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          {count > 1 && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-sm font-mono text-white/50 z-10">
              {active + 1} / {count}
            </div>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-2xl mx-4"
            style={{ aspectRatio: '1' }}
            onClick={e => e.stopPropagation()}
          >
            {current && (
              <Image
                src={current}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
                draggable={false}
              />
            )}
          </div>

          {/* Prev / Next arrows */}
          {count > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
                onClick={e => { e.stopPropagation(); prev() }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
                onClick={e => { e.stopPropagation(); next() }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {count > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActive(i) }}
                  className={`rounded-full transition-all duration-200 ${
                    i === active ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
