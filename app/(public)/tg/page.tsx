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
      <div className="w-full max-w-sm bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
        <h1 className="text-xl font-semibold text-center">Kirish</h1>
        <TelegramLoginClient />
      </div>
    </main>
  );
}