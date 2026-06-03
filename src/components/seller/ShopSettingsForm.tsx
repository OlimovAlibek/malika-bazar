'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { updateShopInfo, updateShopBanner, updateShopAvatar } from '@/actions/shop'
import { uploadImage } from '@/lib/upload'

type Props = {
  shopId: string
  initial: {
    name: string
    room_code: string
    phone: string
    telegram_username: string
    description: string
    banner_url: string | null
    avatar_url: string | null
  }
  sellerName: string
}

export function ShopSettingsForm({ shopId: _, initial, sellerName }: Props) {
  const [name, setName]               = useState(initial.name)
  const [roomCode, setRoomCode]       = useState(initial.room_code)
  const [phone, setPhone]             = useState(initial.phone)
  const [telegram, setTelegram]       = useState(initial.telegram_username)
  const [description, setDescription] = useState(initial.description)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')

  const [banner, setBanner]                   = useState(initial.banner_url)
  const [avatar, setAvatar]                   = useState(initial.avatar_url)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const bannerRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const displayName = name || sellerName
  const initials    = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerUploading(true)
    try {
      const { url, public_id } = await uploadImage(file)
      setBanner(url)
      await updateShopBanner(url, public_id)
    } catch {
      setError('Banner yuklanmadi')
    } finally {
      setBannerUploading(false)
      e.target.value = ''
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const { url } = await uploadImage(file)
      setAvatar(url)
      await updateShopAvatar(url)
    } catch {
      setError('Avatar yuklanmadi')
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  async function handleSave(e: React.SyntheticEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await updateShopInfo({ name, room_code: roomCode, phone, telegram_username: telegram, description })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Saqlashda xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave}>
      <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

      {/* ── Shop profile card ───────────────────────────────────── */}
      <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-3">

        {/* Banner */}
        <div className="relative h-36 sm:h-44 bg-[#0F1923]">
          {banner
            ? <Image src={banner} alt="banner" fill className="object-cover" unoptimized />
            : <div className="absolute inset-0 bg-gradient-to-br from-[#1E2A38] to-[#0F1923]" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Banner upload button — always visible */}
          <button
            type="button"
            onClick={() => bannerRef.current?.click()}
            disabled={bannerUploading}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white text-xs font-semibold backdrop-blur-sm transition-colors disabled:opacity-60"
          >
            {bannerUploading
              ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
            }
            {bannerUploading ? 'Yuklanmoqda...' : 'Banner'}
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-8 left-5">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl bg-[#FF9900] border-4 border-white dark:border-[#16161F] overflow-hidden shadow-lg"
              >
                {avatar
                  ? <Image src={avatar} alt="avatar" fill className="object-cover" unoptimized />
                  : <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-gray-900">{initials}</span>
                }
              </div>
              {/* Avatar upload badge */}
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF9900] border-2 border-white dark:border-[#16161F] flex items-center justify-center shadow disabled:opacity-60"
              >
                {avatarUploading
                  ? <svg className="w-3 h-3 text-gray-900 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Shop name preview */}
        <div className="pt-11 pb-4 px-5">
          <p className="text-base font-black text-gray-900 dark:text-white truncate">
            {displayName || <span className="text-gray-400 font-normal">Do'kon nomi kiritilmagan</span>}
          </p>
          {roomCode && (
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              Xona {roomCode}
            </p>
          )}
        </div>
      </div>

      {/* ── Fields ─────────────────────────────────────────────── */}
      <div className="space-y-3">

        {/* Do'kon ma'lumotlari */}
        <Section title="Do'kon ma'lumotlari">
          <Field
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />}
            label="Do'kon nomi"
          >
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masalan: Abdulloh Shop"
              className="field-input"
            />
          </Field>

          <Divider />

          <Field
            icon={<><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>}
            label="Xona / Lokatsiya"
            hint="A-12, 2-qavat 15-xona"
          >
            <input
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              placeholder="A-12"
              className="field-input"
            />
          </Field>

          <Divider />

          <Field
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />}
            label="Do'kon haqida"
            hint="200 belgigacha"
          >
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Yangi va б/у iPhonelar, Samsunglar. Kafolat bilan."
              className="field-input resize-none py-2.5"
            />
          </Field>
        </Section>

        {/* Aloqa */}
        <Section title="Aloqa ma'lumotlari">
          <Field
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />}
            label="Telefon raqami"
          >
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+998901234567"
              className="field-input"
            />
          </Field>

          <Divider />

          <Field
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />}
            label="Telegram"
          >
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-1 shrink-0">@</span>
              <input
                value={telegram.replace(/^@/, '')}
                onChange={e => setTelegram(e.target.value.replace(/^@/, ''))}
                placeholder="username"
                className="field-input"
              />
            </div>
          </Field>
        </Section>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] active:bg-[#d49000] disabled:opacity-60 text-gray-900 text-sm font-black transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saqlanmoqda...
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Saqlandi!
            </>
          ) : 'Saqlash'}
        </button>

      </div>
    </form>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <p className="px-4 pt-4 pb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />
}

function Field({
  icon, label, hint, children,
}: {
  icon: React.ReactNode
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          {icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</label>
          {hint && <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">{hint}</span>}
        </div>
        {children}
      </div>
    </div>
  )
}
