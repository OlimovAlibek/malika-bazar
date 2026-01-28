'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Sync on load
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark =
      saved === 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (prefersDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');

    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="
        inline-flex items-center justify-center
        w-12 h-12 rounded-full
        border border-gray-200 dark:border-slate-700
        bg-white dark:bg-slate-800
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-slate-700
        transition
      "
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}