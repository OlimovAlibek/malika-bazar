import type { Metadata } from "next";
import ThemeProvider from '@/components/ThemeProvider';
import DarkModeToggle from '@/components/DarkModeToggle';
import "./globals.css";

export const metadata: Metadata = {
  title: "Tezku — Malika bozori telefon narxlari",
  description: "Tezku — Malika bozoridagi telefon narxlari. Eng so'nggi narxlar, solishtirish va qidiruv.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">

      <meta name="google-site-verification" content="YmNM5PuMUFYkM34gl-Au9kQWEls8VdV_vSyfYyiiazE" />

      
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
      <ThemeProvider>
        {children}
        </ThemeProvider>
        </body>
      
    </html>
  );
}
