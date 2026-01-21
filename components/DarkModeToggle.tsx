'use client';

export default function DarkModeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed top-3 right-3 z-50 rounded-full border bg-white px-3 py-2 text-sm shadow dark:bg-slate-800 dark:border-slate-700"
    >
      🌙 / ☀️
    </button>
  );
}