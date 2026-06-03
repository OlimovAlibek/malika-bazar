import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: "Do'kon qo'shish — Admin" }

export default function NewShopPage() {
  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/shops" className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <p className="text-xs text-gray-400">Do'konlar / Yangi</p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Do'kon qo'shish</h1>
        </div>
      </div>

      <div className="flex gap-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
        <svg className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
          Do'konlar Telegram bot orqali avtomatik yaratiladi. Avval sotuvchini qo'shing —
          u bot orqali kirganida do'koni ochiladi va o'z ma'lumotlarini to'ldiradi.
        </p>
      </div>

      <Link
        href="/admin/sellers/new"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#FF9900] hover:bg-[#e8a000] text-gray-900 text-sm font-black transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Yangi sotuvchi qo'shish
      </Link>
    </div>
  )
}
