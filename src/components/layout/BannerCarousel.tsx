'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// w=1600&h=600&fit=crop — landscape banner formatiga majburlaydi
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&w=1600&h=620&fit=crop&q=85`

const SLIDES = [
  {
    id: 1,
    brand: 'Apple',
    title: 'iPhone 16 Pro Max',
    price: "21 500 000 so'mdan",
    desc: 'Titanium dizayn · A18 Pro chip · 48MP kamera',
    href: '/phones?brand=Apple',
    bgImage: u('1510557880182-3d4d3cba35a5'),
    overlayColor: 'rgba(10,10,20,0.52)',
    accent: '#E2B96A',
    label: 'Eng yangi',
  },
  {
    id: 2,
    brand: 'Samsung',
    title: 'Galaxy S25 Ultra',
    price: "22 000 000 so'mdan",
    desc: 'Snapdragon 8 Elite · 200MP kamera · S Pen',
    href: '/phones?brand=Samsung',
    bgImage: u('1610945264803-c22b62d2a7b3'),
    overlayColor: 'rgba(10,20,50,0.55)',
    accent: '#60A5FA',
    label: 'Top savdo',
  },
  {
    id: 3,
    brand: 'Xiaomi',
    title: 'Xiaomi 15 Pro',
    price: "14 900 000 so'mdan",
    desc: 'Leica kamera · Snapdragon 8 Elite · 90W zaryadlash',
    href: '/phones?brand=Xiaomi',
    bgImage: u('1585771724684-38269d6639fd'),
    overlayColor: 'rgba(20,10,5,0.52)',
    accent: '#FB923C',
    label: 'Yangi keldi',
  },
  {
    id: 4,
    brand: 'Redmi',
    title: 'Eng arzon narxlar',
    price: "1 290 000 so'mdan",
    desc: "Katta batareya · Chiroyli dizayn · Sifatli kamera",
    href: '/phones?sort=price_asc',
    bgImage: u('1574755393849-623942496936'),
    overlayColor: 'rgba(5,20,15,0.52)',
    accent: '#34D399',
    label: 'Eng arzon',
  },
]

export function BannerCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 150)
  }, [])

  const next = useCallback(() => {
    goTo((active + 1) % SLIDES.length)
  }, [active, goTo])

  const prev = useCallback(() => {
    goTo((active - 1 + SLIDES.length) % SLIDES.length)
  }, [active, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next])

  const slide = SLIDES[active]

  return (
    <div
      className="relative h-[320px] sm:h-[400px] md:h-[460px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image — fills entire banner */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={slide.bgImage}
          alt={slide.title}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient overlay — faqat chap tomonda matn uchun */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: `linear-gradient(to right, ${slide.overlayColor} 0%, ${slide.overlayColor.replace(/[\d.]+\)$/, '0.25)')} 55%, transparent 100%)`,
        }}
      />
      {/* Pastdan yuqoriga yengil qorayish */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Content */}
      <div className={`relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>

        {/* Label badge */}
        <span
          className="inline-block self-start text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{
            background: slide.accent + '25',
            color: slide.accent,
            border: `1.5px solid ${slide.accent}50`,
          }}
        >
          {slide.label}
        </span>

        {/* Brand */}
        <p className="text-white/60 text-sm font-semibold tracking-wide mb-1">
          {slide.brand}
        </p>

        {/* Title */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-3 max-w-lg">
          {slide.title}
        </h2>

        {/* Desc */}
        <p className="text-white/55 text-xs sm:text-sm mb-2">
          {slide.desc}
        </p>

        {/* Price */}
        <p className="font-black text-xl sm:text-2xl md:text-3xl mb-6" style={{ color: slide.accent }}>
          {slide.price}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-900 transition-all hover:scale-105 active:scale-100"
            style={{ background: slide.accent }}
          >
            Ko'rish
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/phones"
            className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            Barcha telefonlar →
          </Link>
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              background: i === active ? slide.accent : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 left-4 z-20 text-white/40 text-xs font-mono">
        {active + 1} / {SLIDES.length}
      </div>
    </div>
  )
}
