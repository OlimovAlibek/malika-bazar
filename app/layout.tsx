import type { Metadata } from "next";
import ThemeProvider from '@/components/ThemeProvider';
import DarkModeToggle from '@/components/DarkModeToggle';
import "./globals.css";

export const metadata: Metadata = {
  title: "Tezku — Malika bozori telefon narxlari",
  description: "Tezku — Malika bozoridagi telefon narxlari. Eng so'nggi narxlar, solishtirish va qidiruv.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
      <ThemeProvider>
        <DarkModeToggle />
        {children}
        </ThemeProvider>
        </body>
      
    </html>
  );
}
