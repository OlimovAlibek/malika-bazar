'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  label: string;
};

export default function HeaderIconButton({ href, children, label }: Props) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="
        w-12 h-12
        flex items-center justify-center
        rounded-full
        border border-white/10
        bg-white/5
        backdrop-blur
        hover:bg-white/10
        transition
      "
    >
      {children}
    </Link>
  );
}