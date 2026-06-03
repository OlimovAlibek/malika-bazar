'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: fd.get('username'),
          password: fd.get('password'),
        }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const json = await res.json()
        setError(json.error ?? 'Xato yuz berdi')
      }
    } catch {
      setError('Server bilan ulanishda xato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">

      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-baseline gap-1">
          <span className="text-2xl font-black text-white tracking-tight">tezku</span>
          <span className="text-[#FF9900] text-sm font-black">.uz</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin panel</p>
      </div>

      <div className="bg-[#16161F] rounded-2xl border border-gray-800 overflow-hidden">

        <div className="px-6 pt-6 pb-5 border-b border-gray-800">
          <h1 className="text-base font-bold text-white">Admin kirish</h1>
          <p className="text-xs text-gray-500 mt-0.5">Login va parol bilan kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Login
            </label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="admin"
              className="w-full bg-[#0D0D14] border border-gray-700 focus:border-[#FF9900] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Parol
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full bg-[#0D0D14] border border-gray-700 focus:border-[#FF9900] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPass ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#e8a000] disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl text-sm transition-colors mt-2"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-600 mt-6">
        <Link href="/" className="hover:text-gray-400 transition-colors">
          ← Bosh sahifaga qaytish
        </Link>
      </p>
    </div>
  )
}
