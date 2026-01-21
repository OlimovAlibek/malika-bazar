import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // 🚫 Not logged in → redirect to home
  if (!user) {
    redirect('/');
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Profil</h1>

      <div className="border rounded-xl p-4 space-y-2 bg-white">
        <div>
          <div className="text-sm text-gray-500">Telegram username</div>
          <div className="font-medium">
            {user.username ? `@${user.username}` : '—'}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Ism</div>
          <div className="font-medium">
            {user.first_name || '—'}
          </div>
        </div>
      </div>

      <form action="/api/logout" method="post">
        <button
          type="submit"
          className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
        >
          Chiqish
        </button>
      </form>
    </main>
  );
}