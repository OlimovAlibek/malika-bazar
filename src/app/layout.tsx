import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const geist = localFont({
  src: [
    { path: "../../public/fonts/geist-latin.woff2", weight: "100 900" },
    { path: "../../public/fonts/geist-latin-ext.woff2", weight: "100 900" },
  ],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Tezku — Malika bozor telefon narxlari",
    template: "%s | Tezku",
  },
  description: "Malika bozorida telefon va smartfonlarning real narxlari.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tezku.uz"),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tezku",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png",   sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png",   sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#FF9900",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-[#F5F5F5] dark:bg-[#0A0A0F] text-gray-900 dark:text-gray-100 antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
