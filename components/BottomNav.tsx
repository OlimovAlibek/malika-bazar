// components/BottomNav.tsx (SERVER COMPONENT)
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import BottomNavItem from './BottomNavItem';

export default async function BottomNav() {
  const user = await getCurrentUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
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