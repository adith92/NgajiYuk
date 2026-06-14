"use client";

import { motion } from "framer-motion";
import { BookA, MoonStar, User, Gamepad2, LogOut } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import Link from "next/link";

export default function DashboardPage() {
  const menuItems = [
    {
      title: "Hijaiyah",
      description: "Belajar huruf hijaiyah dari Alif sampai Ya dengan suara dan visual interaktif.",
      icon: <BookA className="w-7 h-7" />,
      href: "/hijaiyah",
      colorClass: "teal"
    },
    {
      title: "Doa Harian",
      description: "Kumpulan doa sehari-hari lengkap dengan bahasa Arab, latin, dan terjemahannya.",
      icon: <MoonStar className="w-7 h-7" />,
      href: "/doa",
      colorClass: "purple"
    },
    {
      title: "Tata Cara Sholat",
      description: "Panduan lengkap gerakan dan bacaan sholat dari niat hingga salam.",
      icon: <User className="w-7 h-7" />,
      href: "/sholat",
      colorClass: "emerald"
    },
    {
      title: "Game & Kuis",
      description: "Asah kemampuanmu dengan kuis interaktif dan permainan edukasi Islami.",
      icon: <Gamepad2 className="w-7 h-7" />,
      href: "/kuis",
      colorClass: "amber"
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Assalamu'alaikum, Sobat!</h1>
          <p className="text-slate-400 mt-1">Mau belajar apa hari ini?</p>
        </div>
        <Link href="/">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 px-4 py-2 rounded-xl transition-all">
            Keluar <LogOut className="w-4 h-4" />
          </button>
        </Link>
      </motion.header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {menuItems.map((item, index) => (
          <MenuCard
            key={item.title}
            {...item}
            delay={0.1 * (index + 1)}
          />
        ))}
      </div>
    </div>
  );
}
