'use client'

import { useState, useEffect, useRef } from 'react'

type State = 'idle' | 'opening' | 'waiting' | 'error'

export function TelegramLoginBtn() {
  const [state, setState]   = useState<State>('idle')
  const [errMsg, setErrMsg] = useState('')
  const tokenRef   = useRef<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null)

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current)  clearTimeout(timeoutRef.current)
  }

  function cancel() {
    clearTimers()
    tokenRef.current = null
    setState('idle')
  }

  useEffect(() => cancel, [])

  async function handleLogin() {
    setState('opening')
    try {
      const res = await fetch('/api/auth/login', { method: 'POST' })
      if (!res.ok) throw new Error()
      const { token, botUrl, expiresIn } = await res.json()
      tokenRef.current = token
      window.open(botUrl, '_blank')
      setState('waiting')

      intervalRef.current = setInterval(async () => {
        try {
          const r    = await fetch(`/api/auth/check?token=${token}`)
          const data = await r.json()
          if (data.ready) {
            clearTimers()
            window.location.href = `/api/auth/callback?token=${token}`
          }
        } catch { /* ignore poll errors */ }
      }, 2000)

      timeoutRef.current = setTimeout(() => {
        clearTimers()
        setState('error')
        setErrMsg("Muddati o'tdi. Qaytadan urinib ko'ring.")
      }, (expiresIn ?? 300) * 1000)
    } catch {
      setState('error')
      setErrMsg("Server bilan bog'lanishda xatolik.")
    }
  }

  if (state === 'idle') {
    return (
      <button
        onClick={handleLogin}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#FF9900] hover:bg-[#e8a000] active:scale-[0.98] text-gray-900 font-bold rounded-xl text-sm transition-colors"
      >
        <TelegramIcon />
        Telegram orqali kirish
      </button>
    )
  }

  if (state === 'opening') {
    return (
      <button disabled className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#FF9900]/60 text-gray-900 font-bold rounded-xl text-sm cursor-wait">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Yuklanmoqda...
      </button>
    )
  }

  if (state === 'waiting') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 py-3.5 px-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <span className="flex gap-1 shrink-0">
            {[0, 150, 300].map(d => (
              <span
                key={d}
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </span>
          <p className="text-sm text-blue-300 font-medium leading-snug">
            Telegram botda telefon raqamingizni yuboring
          </p>
        </div>
        <button
          onClick={cancel}
          className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Bekor qilish
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-red-400 text-center">{errMsg}</p>
      <button
        onClick={() => { setState('idle'); setErrMsg('') }}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#FF9900] hover:bg-[#e8a000] active:scale-[0.98] text-gray-900 font-bold rounded-xl text-sm transition-colors"
      >
        <TelegramIcon />
        Qaytadan urinish
      </button>
    </div>
  )
}

function TelegramIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
    </svg>
  )
}
