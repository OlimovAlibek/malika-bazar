import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Malika Bazar",
  description: "Phone price comparison from Malika market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
