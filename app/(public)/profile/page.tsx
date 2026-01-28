import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import SocialLinks from '@/components/SocialLinks';
import TelegramLoginClient from '@/components/TelegramLoginClient';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // ============================
  // 🔐 NOT LOGGED IN VIEW
  // ============================
  if (!user) {
    return (
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Profil
        </h1>

        <div className="border border-gray-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-slate-800 text-center space-y-4">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Profilga kirish
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sevimlilarni saqlash, telefonlarni kuzatish va qo‘shimcha
            imkoniyatlardan foydalanish uchun tizimga kiring.
          </p>

          <TelegramLoginClient/>
        </div>

        <div className="flex justify-center">
          <SocialLinks />
        </div>
      </main>
    );
  }

  // ============================
  // 👤 LOGGED IN VIEW (UNCHANGED)
  // ============================
  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Profil
      </h1>

      <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 space-y-2 bg-white dark:bg-slate-800">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Telegram username
          </div>
          <div className="font-medium text-slate-900 dark:text-slate-100">
            {user.username ? `@${user.username}` : '—'}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Ism</div>
          <div className="font-medium text-slate-900 dark:text-slate-100">
            {user.first_name || '—'}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Telefon raqam
          </div>
          <div className="font-medium text-slate-900 dark:text-slate-100">
            {user.phone || 'Telefon raqam kiritilmagan'}
          </div>
        </div>
      </div>

      <form action="/api/logout" method="post">
        <button
          type="submit"
          className="w-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition"
        >
          Chiqish
        </button>
      </form>

      <div className="space-y-3">
        <Link
          href="/favorites"
          className="block rounded-xl border p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          ❤️ Sevimlilar
        </Link>

        <Link
          href="/about"
          className="block rounded-xl border p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          ℹ️ Biz haqimizda
        </Link>

        <Link
          href="https://t.me/tezkubot"
          target="_blank"
          className="block rounded-xl border p-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          💬 Murojaat qilish
        </Link>
      </div>

      <div className="flex justify-center">
        <SocialLinks />
      </div>
    </main>
  );
}