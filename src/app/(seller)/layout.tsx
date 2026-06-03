import Link from 'next/link'
import { cookies } from 'next/headers'
import { DashboardSidebar } from '@/components/layout/DashboardNav'
import { verifyUserToken, USER_SESSION_COOKIE } from '@/lib/user-session'
import { serviceClient } from '@/lib/supabase/service'

function ShopIncompleteBanner() {
  return (
    <div className="mb-5 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3.5 rounded-2xl">
      <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Do&apos;kon ma&apos;lumotlari to&apos;liq emas</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
          Mahsulot qo&apos;shish uchun avval <strong>do&apos;kon nomi</strong>, <strong>telefon raqami</strong> va <strong>Telegram</strong> kiritilishi shart.
        </p>
        <Link
          href="/seller/shop"
          className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:no-underline"
        >
          Do&apos;konni to&apos;ldirish
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

const NAV = [
  {
    href: '/seller',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: '/seller/shop',
    label: "Do'konim",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
  },
  {
    href: '/seller/products',
    label: 'Mahsulotlar',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 15.75h3" />
      </svg>
    ),
  },
]

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const store   = await cookies()
  const token   = store.get(USER_SESSION_COOKIE)?.value
  const session = token ? await verifyUserToken(token) : null

  let profileName = 'Sotuvchi'
  let profileSub  = 'Malika bozor'

  let shopIncomplete = false

  if (session?.role === 'seller') {
    const [sellerRes, shopRes] = await Promise.all([
      serviceClient.from('sellers').select('full_name').eq('id', session.id).maybeSingle(),
      serviceClient.from('shops').select('name, room_code, phone, telegram_username').eq('seller_id', session.id).maybeSingle(),
    ])
    if (sellerRes.data?.full_name) profileName = sellerRes.data.full_name
    if (shopRes.data?.room_code) {
      profileSub = `Malika bozor · ${shopRes.data.room_code}`
    }
    const s = shopRes.data
    shopIncomplete = !(s?.name?.trim() && s?.phone?.trim() && s?.telegram_username?.trim())
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#0D0D14]">
      <DashboardSidebar
        items={NAV}
        title="Sotuvchi"
        profileName={profileName}
        profileSub={profileSub}
        logoutAction="/api/logout"
        showSupport
      />
      <div className="md:pl-[240px] pt-header-safe md:pt-0">
        <main className="px-5 py-6">
          {shopIncomplete && <ShopIncompleteBanner />}
          {children}
        </main>
      </div>
    </div>
  )
}
