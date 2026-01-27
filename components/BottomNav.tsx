export const dynamic = 'force-dynamic';

// components/BottomNav.tsx (SERVER COMPONENT)
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import BottomNavItem from './BottomNavItem';

// components/BottomNav.tsx


export default async function BottomNav() {
  const user = await getCurrentUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <ul className="grid grid-cols-3 max-w-xl mx-auto">
        <BottomNavItem href="/" label="Bosh sahifa" icon="🏠" />
        <BottomNavItem href="/phones" label="Telefonlar" icon="📱" />

        {user ? (
          <BottomNavItem href="/profile" label="Profil" icon="👤" />
        ) : (
          <BottomNavItem href="/tg" label="Kirish" icon="🔐" />
        )}
      </ul>
    </nav>
  );
}