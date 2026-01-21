// components/BottomNavItem.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  label: string;
  icon: string;
};

export default function BottomNavItem({ href, label, icon }: Props) {
  const pathname = usePathname();

  const isActive =
    pathname === href ||
    (href !== '/' && pathname.startsWith(href));

  return (
    <li>
      <Link
        href={href}
        className={`flex flex-col items-center justify-center py-2 text-xs ${
          isActive
            ? 'text-emerald-600 font-semibold'
            : 'text-gray-400'
        }`}
      >
        <span className="text-lg">{icon}</span>
        {label}
      </Link>
    </li>
  );
}