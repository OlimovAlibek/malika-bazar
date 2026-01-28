import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import FavoritesGrid from '@/components/FavoritesGrid';
import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';


export default async function ProfilePage() {
  const user = await getCurrentUser();

  // 🚫 Not logged in → redirect to home
  if (!user) {
    redirect('/');
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profil</h1>

      <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 space-y-2 bg-white dark:bg-slate-800">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Telegram username</div>
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
          <div className="text-sm text-gray-500 dark:text-gray-400">Telefon raqam</div>
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
          ℹ️ Murojaat qilish
        </Link>

        
      </div>

      <div className="flex justify-center">
        <SocialLinks />
      </div>
    </main>
  );
}