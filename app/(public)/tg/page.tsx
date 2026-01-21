import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import TelegramLoginClient from '@/components/TelegramLoginClient';

export default async function TgPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/profile'); // or '/'
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-none">
        <h1 className="text-xl font-semibold text-center text-slate-900 dark:text-slate-100">Kirish</h1>
        <TelegramLoginClient />
      </div>
    </main>
  );
}