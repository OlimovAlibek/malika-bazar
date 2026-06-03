'use client'

import { useState, useRef } from 'react'
import { sendSupportMessage } from '@/actions/support'

type Variant = 'profile-menu' | 'sidebar' | 'header-icon'

type Props = {
  variant: Variant
}

export function SupportButton({ variant }: Props) {
  const [open,    setOpen]    = useState(false)
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')
  const textareaRef           = useRef<HTMLTextAreaElement>(null)

  function openModal() {
    setOpen(true)
    setSent(false)
    setError('')
    setTimeout(() => textareaRef.current?.focus(), 300)
  }

  function closeModal() {
    setOpen(false)
    setError('')
    if (textareaRef.current) textareaRef.current.value = ''
  }

  async function handleSend() {
    const msg = textareaRef.current?.value ?? ''
    if (!msg.trim()) { setError('Xabar kiriting'); return }
    setSending(true)
    setError('')
    const result = await sendSupportMessage(msg)
    setSending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSent(true)
      if (textareaRef.current) textareaRef.current.value = ''
      setTimeout(() => { setSent(false); closeModal() }, 2500)
    }
  }

  return (
    <>
      {/* ── Trigger ───────────────────────────────────────────── */}
      {variant === 'profile-menu' ? (
        <button
          onClick={openModal}
          className="flex items-center gap-4 px-5 py-4 w-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-left"
        >
          <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-500">
            <ChatIcon className="w-5 h-5" />
          </span>
          <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
            Yordam va murojaat
          </span>
          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      ) : variant === 'header-icon' ? (
        /* Mobil header dagi kichik icon tugma */
        <button
          onClick={openModal}
          aria-label="Yordam va murojaat"
          className="p-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-white/10 transition-colors active:scale-95"
        >
          <ChatIcon className="w-5 h-5" />
        </button>

      ) : (
        /* sidebar variant — desktop yon panel */
        <button
          onClick={openModal}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all w-full"
        >
          <ChatIcon className="w-4 h-4 shrink-0" />
          Yordam va murojaat
        </button>
      )}

      {/* ── Modal ────────────────────────────────────────────── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[290] bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Bottom sheet (mobile) / Center dialog (desktop) */}
          <div className="fixed inset-x-0 bottom-0 z-[291] sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-6">
            <div
              className="w-full sm:max-w-md bg-white dark:bg-[#1A1A24] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              {/* Drag handle */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <ChatIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">Yordam va murojaat</p>
                    <p className="text-xs text-gray-400 mt-0.5">Xabaring tez ko'rib chiqiladi</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pt-4 pb-5 space-y-3">
                {sent ? (
                  <div className="py-8 flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900 dark:text-white">Xabar yuborildi!</p>
                      <p className="text-sm text-gray-400 mt-1">Tez orada javob beramiz 🙏</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      ref={textareaRef}
                      rows={4}
                      placeholder="Muammo yoki savolingizni yozing..."
                      maxLength={1000}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400 resize-none leading-relaxed"
                    />

                    {error && (
                      <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={sending}
                        className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-black disabled:opacity-60 transition active:scale-95 flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Yuborilmoqda...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                            Yuborish
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}
