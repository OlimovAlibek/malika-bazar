'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { updateBuyerProfile } from '@/actions/buyer'
import { uploadImage } from '@/lib/upload'

type Props = {
  initialName: string
  initialAvatar: string | null
  username: string | null
}

export function BuyerProfileForm({ initialName, initialAvatar, username }: Props) {
  const [open,   setOpen]   = useState(false)
  const [name,   setName]   = useState(initialName)
  const [avatar, setAvatar] = useState<string | null>(initialAvatar)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error,  setError]  = useState('')
  const [saved,  setSaved]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = name.trim() ? name.trim()[0].toUpperCase() : '?'

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { url } = await uploadImage(file)
      setAvatar(url)
    } catch {
      setError("Rasm yuklanmadi")
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Ism kiritilishi shart'); return }
    setSaving(true)
    setError('')
    try {
      await updateBuyerProfile({ first_name: name.trim(), avatar_url: avatar })
      setSaved(true)
      setOpen(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#FF9900]/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF9900]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#FF9900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {saved ? 'Saqlandi ✓' : 'Profilni tahrirlash'}
          </span>
        </div>
        <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#FF9900] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white dark:bg-[#16161F] rounded-2xl border border-[#FF9900]/40 overflow-hidden"
    >
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Profilni tahrirlash</p>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FF9900] relative group"
            >
              {avatar ? (
                <Image src={avatar} alt="avatar" fill className="object-cover" unoptimized />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-gray-900">
                  {initials}
                </span>
              )}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                {uploading ? (
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                )}
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">Profil rasmi</p>
            <p className="text-[11px] text-gray-400">Rasmga bosib o'zgartiring</p>
            {username && (
              <p className="text-[11px] text-gray-400 mt-0.5">@{username}</p>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Ism</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ismingiz"
            maxLength={80}
            className="w-full h-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF9900] transition-colors"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full h-11 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] disabled:opacity-60 text-gray-900 text-sm font-black transition-colors"
        >
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </form>
  )
}
