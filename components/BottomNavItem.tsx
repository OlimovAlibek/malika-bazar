'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, User, LogIn, Heart } from 'lucide-react';

type Props = {
  href: string;
  label: string;
  icon: 'home' | 'phones' | 'profile' | 'login' | 'heart';
};

const ICONS = {
  home: Home,
  phones: Smartphone,
  profile: User,
  login: LogIn,
  heart: Heart,
};

export default function BottomNavItem({ href, label, icon }: Props) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const Icon = ICONS[icon];

  return (
    <li>
      <Link
        href={href}
        className={`flex flex-col items-center justify-center py-2 text-xs transition ${
          isActive
            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        <Icon className="w-5 h-5 mb-0.5" />
        {label}
      </Link>
    </li>
  );
}