'use client'

import { useState } from 'react'

type Step = 'phone' | 'bot' | 'otp'

export function PhoneOtpForm() {
  const [step, setStep]     = useState<Step>('phone')
  const [phone, setPhone]   = useState('+998')
  const [otp, setOtp]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [botUsername, setBotUsername] = useState('')

  async function handleSendOtp() {
    if (phone.length < 10) return
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (res.status === 200) {
        setStep('otp')
        return
      }
      if (res.status === 422 || res.status === 404) {
        const match = (data.error as string)?.match(/@(\S+)/)
        setBotUsername(match ? match[1] : (process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? 'tezku1212bot'))
        setStep('bot')
        return
      }
      setError(data.error ?? 'Xatolik yuz berdi')
    } catch {
      setError('Server bilan bog\'lanishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.SyntheticEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone, otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Xatolik yuz berdi')
        setLoading(false)
        return
      }
      window.location.href = data.dest
    } catch {
      setError('Server bilan bog\'lanishda xatolik')
      setLoading(false)
    }
  }

  // ── 1-qadam: telefon ──────────────────────────────────────────
  if (step === 'phone') {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Telefon raqami
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
            placeholder="+998901234567"
            disabled={loading}
            className="w-full bg-gray-900 border border-gray-700 focus:border-[#FF9900] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          onClick={handleSendOtp}
          disabled={loading || phone.length < 10}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF9900] hover:bg-[#e8a000] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold rounded-xl text-sm transition-colors"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Yuborilmoqda...
            </>
          ) : (
            <>
              <TgIcon />
              Telegram ga kod yuborish
            </>
          )}
        </button>
      </div>
    )
  }

  // ── 2-qadam: bot bog'lash ─────────────────────────────────────
  if (step === 'bot') {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <TgIcon className="text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-300 leading-snug">
            <p className="font-bold mb-1">Avval botni ulash kerak</p>
            <p>Botga <b>/start</b> yuboring → telefon raqamingizni ulang → keyin qaytib keling</p>
          </div>
        </div>

        <a
          href={`https://t.me/${botUsername}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors"
        >
          <TgIcon />
          @{botUsername} botini ochish
        </a>

        <button
          onClick={() => { setStep('otp'); setError('') }}
          className="w-full py-2.5 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl text-sm font-medium transition-colors"
        >
          Kodni oldim → Kirish
        </button>

        <button
          onClick={() => { setStep('phone'); setError('') }}
          className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Orqaga
        </button>
      </div>
    )
  }

  // ── 3-qadam: OTP ─────────────────────────────────────────────
  return (
    <form onSubmit={handleVerify} className="space-y-3">

      <div className="flex items-start gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-emerald-300 leading-snug">
          Telegram ga 6 xonali kod yuborildi
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5">
          Telegram dan kelgan kod
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          autoFocus
          className="w-full bg-gray-900 border border-gray-700 focus:border-[#FF9900] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600 tracking-[0.4em] font-mono text-center"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF9900] hover:bg-[#e8a000] disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold rounded-xl text-sm transition-colors"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Kirilmoqda...
          </>
        ) : 'Kirish'}
      </button>

      <button
        type="button"
        onClick={() => { setStep('phone'); setOtp(''); setError('') }}
        className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        ← Orqaga
      </button>
    </form>
  )
}

function TgIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
    </svg>
  )
}
