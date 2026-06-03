'use client'

import { useState } from 'react'

type Props = {
  productId: string
  phone:     string | null
  telegram?: string | null
  slug:      string
  title:     string
}

function trackCall(productId: string) {
  void fetch('/api/track', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ type: 'call', product_id: productId }),
  })
}

export function ContactButtons({ productId, phone, telegram, slug, title }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/phones/${slug}`
    if (navigator.share) {
      try { await navigator.share({ title, url }) } catch { /* bekor qilindi */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const hasPhone    = !!phone
  const hasTelegram = !!telegram
  const cols = hasPhone && hasTelegram ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className={`grid ${cols} gap-2.5`}>
      {/* Call button */}
      {hasPhone ? (
        <a
          href={`tel:${phone}`}
          onClick={() => trackCall(productId)}
          className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Qo'ng'iroq
        </a>
      ) : (
        <button disabled className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-400 font-bold py-3.5 rounded-xl text-sm cursor-not-allowed">
          Telefon yo'q
        </button>
      )}

      {/* Telegram button */}
      {hasTelegram && (
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1a8cbd] active:bg-[#157aab] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
          </svg>
          Telegram
        </a>
      )}

      {/* Share button */}
      <button
        onClick={handleShare}
        className={`flex items-center justify-center gap-1.5 font-bold py-3.5 rounded-xl text-sm transition-colors ${
          copied
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Nusxalandi!
          </>
        ) : (
          <>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Ulashish
          </>
        )}
      </button>
    </div>
  )
}
