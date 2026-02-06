export const dynamic = 'force-dynamic';

import { Home, Smartphone, User, LogIn } from 'lucide-react';

// components/BottomNav.tsx (SERVER COMPONENT)
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import BottomNavItem from './BottomNavItem';

// components/BottomNav.tsx


export default async function BottomNav() {
  const user = await getCurrentUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <ul className="grid grid-cols-4 max-w-xl mx-auto">
      <BottomNavItem href="/" label="Bosh sahifa" icon="home" />
<BottomNavItem href="/phones" label="Telefonlar" icon="phones" />
<BottomNavItem href="/favorites" label="Sevimlilar" icon="heart" />

<BottomNavItem href="/profile" label="Profil" icon="profile" />
      </ul>
    </nav>
  );
}