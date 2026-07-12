import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NgajiYuk | Belajar Islam Seru",
    template: "%s | NgajiYuk",
  },
  description: "Aplikasi belajar Hijaiyah, doa harian, bacaan sholat, kuis, dan reward untuk anak serta keluarga.",
  applicationName: "NgajiYuk",
  category: "education",
  keywords: ["belajar hijaiyah", "doa harian", "bacaan sholat", "kuis islami", "edukasi anak"],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#32158a",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="aurora-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
