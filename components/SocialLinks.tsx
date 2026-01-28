import Link from 'next/link';
import { Send, Instagram, Mail } from 'lucide-react';

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-5">
      <Link
        href="https://t.me/tezku_uz"
        target="_blank"
        aria-label="Tezku Telegram"
        className="group flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
      >
        <Send className="w-5 h-5 group-hover:scale-110 transition" />
        <span className="text-sm font-medium">Telegram</span>
      </Link>

      <Link
        href="https://instagram.com/tezku.uz"
        target="_blank"
        aria-label="Tezku Instagram"
        className="group flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-pink-500 transition"
      >
        <Instagram className="w-5 h-5 group-hover:scale-110 transition" />
        <span className="text-sm font-medium">Instagram</span>
      </Link>

      <Link
        href="mailto:support@tezku.uz"
        aria-label="Tezku Email"
        className="group flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition"
      >
        <Mail className="w-5 h-5 group-hover:scale-110 transition" />
        <span className="text-sm font-medium">Email</span>
      </Link>
    </div>
  );
}