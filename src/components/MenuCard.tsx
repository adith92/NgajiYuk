"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  colorClass: string;
  delay?: number;
}

export function MenuCard({ title, description, icon, href, colorClass, delay = 0 }: MenuCardProps) {
  return (
    <Link href={href} className="block w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`glass-panel p-6 rounded-3xl h-full flex flex-col justify-between group overflow-hidden relative cursor-pointer border border-slate-700/50 hover:border-${colorClass}-500/50 transition-colors`}
      >
        {/* Glow effect on hover */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-${colorClass}-500/0 group-hover:bg-${colorClass}-500/20 rounded-full blur-3xl transition-all duration-500`} />
        
        <div className="relative z-10 flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-${colorClass}-400 group-hover:text-white group-hover:bg-${colorClass}-500 transition-colors shadow-lg`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
        </div>
        
        <p className="relative z-10 text-slate-400 text-sm leading-relaxed">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}
