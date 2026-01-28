import Link from 'next/link';
import { User, LogIn } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export default async function HeaderAction() {
  const user = await getCurrentUser();

  const href = '/profile';

  return (
    <Link
      href={href}
      className="
        flex items-center justify-center
        w-12 h-12
        rounded-full
        border border-gray-200 dark:border-slate-700
        bg-gray-100 dark:bg-slate-800
        hover:bg-gray-200 dark:hover:bg-slate-700
        transition
      "
      aria-label={'Profil'}
    >
      
        <User className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      
    </Link>
  );
}