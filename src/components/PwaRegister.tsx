'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow]       = useState(false)
  const [isIos, setIsIos]     = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // SW ro'yxatdan o'tkazish
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }

    // Allaqachon o'rnatilganmi?
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    ) {
      setInstalled(true)
      return
    }

    // Oldin "Yo'q" deb yopganmi?
    if (localStorage.getItem('pwa-dismissed') === '1') return

    const ua = navigator.userAgent.toLowerCase()

    // iOS Safari aniqlash (Chrome/Firefox on iOS emas)
    const isIosDevice = /iphone|ipad|ipod/.test(ua)
    const isIosSafari = isIosDevice && /safari/.test(ua) && !/crios|fxios|opios/.test(ua)

    if (isIosSafari) {
      setIsIos(true)
      const t = setTimeout(() => setShow(true), 3500)
      return () => clearTimeout(t)
    }

    // Chrome / Edge / Samsung Browser — beforeinstallprompt
    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShow(true), 3500)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', () => setShow(false))

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    }
  }, [])

  function dismiss() {
    setShow(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
      setInstalled(true)
    }
    setDeferredPrompt(null)
  }

  if (!show || installed) return null

  return (
    <div className="fixed bottom-24 left-3 right-3 z-[60] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">

          {/* App icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#131921] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-[#FF9900] font-black text-lg tracking-tight">T</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              Tezku ilovasini o'rnating
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
              {isIos
                ? 'Tezroq ishlaydi va oflayn ham ko\'rish mumkin'
                : 'Tezroq ishlaydi, oflayn ham mavjud'}
            </p>
          </div>

          {/* Yopish */}
          <button
            onClick={dismiss}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Yopish"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* iOS yo'riqnoma */}
        {isIos ? (
          <div className="mt-3 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2.5">
            <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Safari pastidagi{' '}
              <svg className="w-3.5 h-3.5 inline text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {' '}tugmasini bosib <strong>"Bosh ekranga qo'shish"</strong> ni tanlang
            </p>
          </div>
        ) : (
          /* Chrome / Desktop tugmalar */
          <div className="mt-3 flex gap-2">
            <button
              onClick={dismiss}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Kerak emas
            </button>
            <button
              onClick={install}
              className="flex-1 py-2.5 text-sm font-bold text-gray-900 bg-[#FF9900] hover:bg-[#e8a000] rounded-xl transition-colors"
            >
              O'rnatish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
