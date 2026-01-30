import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import SocialLinks from '@/components/SocialLinks';
import TelegramLoginClient from '@/components/TelegramLoginClient';
import {
  Heart,
  Info,
  MessageCircle,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  /* ======================================================
     🔐 NOT LOGGED IN (GUEST VIEW)
  ====================================================== */
  if (!user) {
    return (
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Profil
        </h1>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <User className="w-10 h-10 text-sky-500" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Xush kelibsiz!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Telegram orqali bir zumda kiring va sevimlilarni saqlang
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-sky-500" />
              Xavfsiz autentifikatsiya
            </div>
            <div className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
              <Heart className="w-5 h-5 text-sky-500" />
              Sevimli telefonlarni saqlash
            </div>
          </div>

          <TelegramLoginClient />
        </div>

        <div className="flex justify-center pt-2">
          <SocialLinks />
        </div>
      </main>
    );
  }

  /* ======================================================
     👤 LOGGED IN VIEW
  ====================================================== */
  return (
    <main className="max-w-xl mx-auto p-4 space-y-5">
      <h1 className="text-xl font-semibold">Profil</h1>

      {/* USER CARD */}
      <div className="rounded-2xl border bg-white dark:bg-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <User className="w-7 h-7 text-sky-500" />
          </div>
          <div>
            <div className="font-semibold text-base">
              {user.first_name || '—'}
            </div>
            <div className="text-sm text-gray-500">
              {user.username ? `@${user.username}` : 'Telegram'}
            </div>
          </div>
        </div>

        <div className="border-t pt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Telegram</span>
            <span>{user.username ? `@${user.username}` : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Telefon</span>
            <span>{user.phone || '—'}</span>
          </div>
        </div>
      </div>

      {/* VERIFIED */}
      <div className="flex items-center gap-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 px-4 py-3 text-sky-600 text-sm">
        <ShieldCheck className="w-5 h-5" />
        Telegram orqali tasdiqlangan
      </div>

      {/* MENU */}
      <div className="space-y-3">
        <ProfileItem href="/favorites" icon={<Heart />} label="Sevimlilar" />
        <ProfileItem href="/about" icon={<Info />} label="Biz haqimizda" />
        <ProfileItem
          href="https://t.me/tezkubot"
          icon={<MessageCircle />}
          label="Murojaat qilish"
          external
        />
      </div>

      {/* LOGOUT */}
      <form action="/api/logout" method="post">
        <button className="w-full mt-2 rounded-xl bg-gray-100 dark:bg-slate-700 py-3 flex items-center justify-center gap-2 text-red-500 font-medium">
          <LogOut className="w-5 h-5" />
          Chiqish
        </button>
      </form>

      <div className="flex justify-center pt-2">
        <SocialLinks />
      </div>
    </main>
  );
}

/* =====================
   SMALL HELPER
===================== */
function ProfileItem({
  href,
  icon,
  label,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="flex items-center justify-between rounded-xl border bg-white dark:bg-slate-800 px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-gray-400">›</span>
    </Link>
  );
}