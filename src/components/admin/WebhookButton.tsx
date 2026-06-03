'use client'

import { useState } from 'react'

export function WebhookButton({ currentUrl }: { currentUrl: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [webhookUrl, setWebhookUrl] = useState('')

  async function handleSet() {
    setStatus('loading')
    try {
      const res  = await fetch('/api/telegram/set-webhook', { method: 'POST' })
      const data = await res.json() as { ok?: boolean; webhook_url?: string; error?: string }
      if (data.ok) {
        setWebhookUrl(data.webhook_url ?? '')
        setStatus('ok')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Telegram Bot Webhook</p>
          <p className="text-xs text-gray-500 mt-0.5 font-mono truncate max-w-xs">{currentUrl}</p>
        </div>
      </div>

      {status === 'ok' && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2 mb-3">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="font-mono truncate">{webhookUrl}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2 mb-3">
          Xatolik yuz berdi. URL to'g'riligini tekshiring.
        </div>
      )}

      <button
        onClick={handleSet}
        disabled={status === 'loading'}
        className="w-full h-10 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Yangilanmoqda...
          </>
        ) : 'Webhook yangilash'}
      </button>
    </div>
  )
}
