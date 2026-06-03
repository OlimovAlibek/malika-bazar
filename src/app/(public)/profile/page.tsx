import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'
import { LoginPanel } from '@/components/LoginPanel'
import { BuyerProfileForm } from '@/components/profile/BuyerProfileForm'
import { SupportButton } from '@/components/support/SupportButton'

export const metadata: Metadata = { title: 'Profil — Tezku' }

type ProfileUser = {
  id: string
  first_name: string
  username: string | null
  phone: string | null
  role: 'seller' | 'buyer'
  avatar_url?: string | null
}

async function getCurrentUser(): Promise<ProfileUser | null> {
  const store = await cookies()
  const token = store.get(USER_SESSION_COOKIE)?.value
  if (!token) return null

  const session = await verifyUserToken(token)
  if (!session) return null

  if (session.role === 'seller') {
    const { data } = await serviceClient
      .from('sellers')
      .select('id, full_name, phone, telegram_username')
      .eq('id', session.id)
      .maybeSingle()
    if (!data) return null
    return {
      id:         data.id,
      first_name: data.full_name,
      username:   data.telegram_username ?? null,
      phone:      data.phone,
      role:       'seller',
    }
  }

  const { data } = await serviceClient
    .from('buyers')
    .select('id, first_name, username, phone, avatar_url')
    .eq('id', session.id)
    .maybeSingle()
  if (!data) return null
  return {
    id:         data.id,
    first_name: data.first_name,
    username:   data.username   ?? null,
    phone:      data.phone      ?? null,
    avatar_url: (data as { avatar_url?: string | null }).avatar_url ?? null,
    role:       'buyer',
  }
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0F] pb-28">

      {/* ── Header ── */}
      <header className="bg-[#131921] safe-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-white font-black text-lg tracking-tight">tezku</span>
            <span className="text-[#FF9900] text-[10px] font-black hidden sm:block">.uz</span>
          </Link>
          <div className="flex-1" />
          <span className="text-white font-bold text-sm">Profil</span>
          <div className="flex-1" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">

        {/* ══════════════ LOGGED OUT ══════════════ */}
        {!user && (
          <div className="flex flex-col min-h-[calc(100svh-56px-80px)] justify-center gap-4">

            {/* Card */}
            <div className="bg-[#16161F] rounded-2xl border border-gray-800 overflow-hidden">

              {/* Title */}
              <div className="px-6 pt-6 pb-5">
                <p className="text-base font-bold text-white">Kirish</p>
                <p className="text-sm text-gray-500 mt-0.5">Hisobingizga kiring</p>
              </div>

              {/* Login form */}
              <div className="px-6 pb-5">
                <LoginPanel />
              </div>

              {/* 2-col benefits */}
              <div className="grid grid-cols-2 border-t border-gray-800 divide-x divide-gray-800">
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Xaridor</p>
                  <ul className="space-y-2 text-xs text-gray-400 leading-tight">
                    <li>Sevimlilar ro'yxati</li>
                    <li>Narx bildirishnoma</li>
                    <li>Narxlarni kuzatish</li>
                  </ul>
                </div>
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold text-[#FF9900] uppercase tracking-widest mb-3">Sotuvchi</p>
                  <ul className="space-y-2 text-xs text-gray-400 leading-tight">
                    <li>Mahsulot boshqarish</li>
                    <li>Statistika</li>
                    <li>Do'kon sozlash</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 bg-[#0D0D14] px-6 py-3">
                <p className="text-[11px] text-gray-600 text-center">
                  Rollingizga qarab avtomatik yo'naltirilasiz
                </p>
              </div>
            </div>

            <AppInfo />
          </div>
        )}

        {/* ══════════════ LOGGED IN ══════════════ */}
        {user && (
          <>
            {/* User card */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

              {/* Header gradient */}
              <div className="h-16 bg-gradient-to-r from-[#131921] to-[#1E2A38]" />

              <div className="px-5 pb-5">
                {/* Avatar */}
                <div className="-mt-8 mb-3 flex items-end justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF9900] border-4 border-white dark:border-[#16161F] overflow-hidden relative flex items-center justify-center">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.first_name} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-gray-900 font-black text-2xl">
                        {user.first_name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mb-1">
                    Faol
                  </span>
                </div>

                <p className="text-lg font-black text-gray-900 dark:text-white">
                  {user.first_name}
                </p>
                {user.username && (
                  <p className="text-sm text-gray-400 mt-0.5">@{user.username}</p>
                )}
                {user.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.phone}</p>
                )}
              </div>
            </div>

            {/* Edit form — only buyers */}
            {user.role === 'buyer' && (
              <BuyerProfileForm
                initialName={user.first_name}
                initialAvatar={user.avatar_url ?? null}
                username={user.username}
              />
            )}

            {/* Menu */}
            <div className="bg-white dark:bg-[#16161F] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
              {user.role === 'seller' && (
                <MenuItem
                  href="/seller"
                  label="Sotuvchi paneli"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  }
                  iconBg="bg-amber-50 dark:bg-amber-900/20 text-amber-500"
                />
              )}
              <MenuItem
                href="/favorites"
                label="Sevimli telefonlar"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                }
                iconBg="bg-red-50 dark:bg-red-900/20 text-red-500"
              />
              <SupportButton variant="profile-menu" />
            </div>

            {/* Logout */}
            <form action="/api/logout" method="post">
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-white dark:bg-[#16161F] border border-gray-200 dark:border-gray-800 rounded-2xl text-red-500 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Chiqish
              </button>
            </form>

            <AppInfo />
          </>
        )}

      </div>
    </div>
  )
}

function MenuItem({
  href, label, icon, iconBg, external,
}: {
  href: string
  label: string
  icon: React.ReactNode
  iconBg: string
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
    >
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  )
}

function AppInfo() {
  return (
    <div className="pt-2 text-center space-y-1">
      <p className="text-xs text-gray-400">
        <span className="font-black text-gray-500">tezku</span>
        <span className="text-[#FF9900] font-black">.uz</span>
      </p>
      <p className="text-[11px] text-gray-400">
        Malika bozori telefon narxlari
      </p>
      <div className="flex items-center justify-center gap-4 pt-1">
        <a href="https://t.me/tezku_uz" target="_blank" rel="noreferrer" className="text-[11px] text-gray-400 hover:text-[#FF9900] transition-colors">
          Telegram
        </a>
        <span className="text-gray-300 dark:text-gray-700">·</span>
        <a href="https://instagram.com/tezku.uz" target="_blank" rel="noreferrer" className="text-[11px] text-gray-400 hover:text-[#FF9900] transition-colors">
          Instagram
        </a>
      </div>
    </div>
  )
}
