"use client";

import { ArrowLeft, Star } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack: () => void;
  progressLabel?: string;
}

export function Header({ title, onBack, progressLabel }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/90 px-4 py-3 shadow-[0_8px_26px_rgba(39,20,105,0.08)] backdrop-blur-xl md:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ke halaman sebelumnya"
          className="kid-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet-100 bg-violet-50 text-violet-700 shadow-sm hover:bg-violet-100"
        >
          <ArrowLeft size={21} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-base font-black tracking-tight text-[#221650] md:text-xl">{title}</p>
          {progressLabel ? <p className="mt-0.5 text-[11px] font-bold text-violet-400">{progressLabel}</p> : null}
        </div>

        <div className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 text-amber-600 shadow-sm" aria-hidden="true">
          <Star size={18} className="fill-amber-400" />
        </div>
      </div>
    </header>
  );
}
