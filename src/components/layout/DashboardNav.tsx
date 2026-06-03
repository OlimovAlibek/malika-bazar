'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SupportButton } from '@/components/support/SupportButton'

type NavItem = { href: string; label: string; icon: React.ReactNode }

type Props = {
  items: NavItem[]
  title: string
  profileName?: string
  profileSub?: string
  logoutAction?: string
  showSupport?: boolean
}

export function DashboardSidebar({ items, title, profileName, profileSub, logoutAction, showSupport = false }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const initials = profileName
    ? profileName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : title.slice(0, 2).toUpperCase()

  const NavList = (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
      {items.map(({ href, label, icon }) => {
        const active = pathname === href || (href.length > 8 && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              active
                ? 'bg-[#FF9900] text-gray-900'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            )}
          >
            <span className={cn('shrink-0', active ? 'text-gray-900' : 'text-gray-400')}>
              {icon}
            </span>
            {label}
          </Link>
        )
      })}
    </nav>
  )

  const Profile = profileName ? (
    <div className="px-4 py-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FF9900] flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-gray-900">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{profileName}</p>
          {profileSub && <p className="text-xs text-gray-500 truncate mt-0.5">{profileSub}</p>}
        </div>
      </div>
    </div>
  ) : null

  const LogoutBtn = (
    <div className="px-3 py-3 border-t border-white/10">
      {logoutAction ? (
        <form action={logoutAction} method="post">
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/10 hover:text-red-400 transition-all">
            <LogoutIcon />
            Chiqish
          </button>
        </form>
      ) : (
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/10 hover:text-red-400 transition-all">
          <LogoutIcon />
          Chiqish
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-[#0F1923] fixed inset-y-0 left-0 z-40">
        <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
          <Link href="/" className="group flex items-center gap-2" title="Bosh sahifaga o'tish">
            <div>
              <span className="font-black text-[#FF9900] text-lg tracking-tight group-hover:opacity-80 transition-opacity">Tezku</span>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">{title}</p>
            </div>
            <svg className="w-3 h-3 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
        </div>

        {Profile}
        {NavList}

        {/* Support — desktop sidebar pastida */}
        {showSupport && (
          <div className="px-3 pb-2 border-t border-white/10 pt-2">
            <SupportButton variant="sidebar" />
          </div>
        )}

        {LogoutBtn}
      </aside>

      {/* ── Mobile header ─────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#0F1923] border-b border-white/10 safe-top">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Title */}
          <span className="font-black text-white text-sm tracking-tight flex-1 truncate">
            <Link href="/" className="text-[#FF9900] hover:opacity-80 transition-opacity"
            >Tezku</Link>
            {' '}{title}
          </span>

          {/* O'ng tomon: Support icon + Avatar */}
          <div className="flex items-center gap-1">
            {showSupport && <SupportButton variant="header-icon" />}
            {profileName && (
              <div className="w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center ml-1">
                <span className="text-[11px] font-black text-gray-900">{initials}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <div className={cn(
        'md:hidden fixed inset-y-0 left-0 z-50 w-[240px] bg-[#0F1923] flex flex-col transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Drawer header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link href="/" className="group flex items-center gap-1.5" title="Bosh sahifaga o'tish">
            <div>
              <span className="font-black text-[#FF9900] text-base tracking-tight group-hover:opacity-80 transition-opacity">Tezku</span>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">{title}</p>
            </div>
            <svg className="w-3 h-3 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Yopish"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {Profile}
        {NavList}
        {/* Support drawer da YO'Q — header da icon ko'rinishida mavjud */}
        {LogoutBtn}
      </div>
    </>
  )
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
