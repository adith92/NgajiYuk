"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export type MenuTone = "green" | "pink" | "blue" | "yellow" | "purple" | "cyan";

interface MenuCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  tone: MenuTone;
  eyebrow?: string;
  progress?: number;
  delay?: number;
}

const toneStyles: Record<MenuTone, {
  card: string;
  icon: string;
  glow: string;
  progress: string;
}> = {
  green: {
    card: "border-emerald-100 hover:border-emerald-300",
    icon: "bg-emerald-100 text-emerald-600",
    glow: "bg-emerald-200/45",
    progress: "from-emerald-400 to-lime-400",
  },
  pink: {
    card: "border-pink-100 hover:border-pink-300",
    icon: "bg-pink-100 text-pink-600",
    glow: "bg-pink-200/45",
    progress: "from-pink-400 to-rose-400",
  },
  blue: {
    card: "border-blue-100 hover:border-blue-300",
    icon: "bg-blue-100 text-blue-600",
    glow: "bg-blue-200/45",
    progress: "from-blue-400 to-cyan-400",
  },
  yellow: {
    card: "border-amber-100 hover:border-amber-300",
    icon: "bg-amber-100 text-amber-600",
    glow: "bg-amber-200/45",
    progress: "from-amber-400 to-orange-400",
  },
  purple: {
    card: "border-violet-100 hover:border-violet-300",
    icon: "bg-violet-100 text-violet-600",
    glow: "bg-violet-200/45",
    progress: "from-violet-500 to-fuchsia-400",
  },
  cyan: {
    card: "border-cyan-100 hover:border-cyan-300",
    icon: "bg-cyan-100 text-cyan-600",
    glow: "bg-cyan-200/45",
    progress: "from-cyan-400 to-sky-500",
  },
};

export function MenuCard({
  title,
  description,
  icon,
  href,
  tone,
  eyebrow,
  progress,
  delay = 0,
}: MenuCardProps) {
  const style = toneStyles[tone];

  return (
    <Link href={href} className="group block h-full rounded-[1.6rem] focus-visible:outline-none">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: "easeOut" }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.985 }}
        className={`app-card relative flex h-full min-h-48 flex-col overflow-hidden border-2 p-5 transition-all duration-200 hover:shadow-[0_18px_42px_rgba(63,39,140,0.16)] ${style.card}`}
      >
        <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-transform duration-300 group-hover:scale-125 ${style.glow}`} />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${style.icon}`}>
            {icon}
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-violet-600 group-hover:text-white">
            <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </div>

        <div className="relative z-10 mt-5">
          {eyebrow ? <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-400">{eyebrow}</p> : null}
          <h2 className="mt-1 text-xl font-black tracking-tight text-[#21164a]">{title}</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{description}</p>
        </div>

        {typeof progress === "number" ? (
          <div className="relative z-10 mt-auto pt-5">
            <div className="mb-2 flex items-center justify-between text-[11px] font-extrabold text-slate-500">
              <span>Progress</span>
              <span>{Math.max(0, Math.min(100, Math.round(progress)))}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-violet-50">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${style.progress}`}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        ) : null}
      </motion.article>
    </Link>
  );
}
