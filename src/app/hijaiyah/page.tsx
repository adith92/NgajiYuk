"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Grid3X3, Heart, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";
import { useAppStore } from "@/lib/store";
import { hijaiyahData } from "@/data/hijaiyah";
import { playAudio } from "@/lib/audioCache";

function celebrate() {
  confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, colors: ["#22c55e", "#facc15", "#8b5cf6", "#38bdf8"] });
}

export default function HijaiyahPage() {
  const router = useRouter();
  const { currentUserUid, progress, updateProgress } = useAppStore();
  const completed = currentUserUid ? progress[currentUserUid]?.hijaiyah?.completedItems ?? [] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const activeChar = hijaiyahData[activeIndex];
  const isDone = completed.includes(activeChar.id);
  const progressPercent = Math.round((completed.length / hijaiyahData.length) * 100);

  useEffect(() => () => confetti.reset(), []);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + hijaiyahData.length) % hijaiyahData.length);
  };

  const markComplete = () => {
    if (!isDone) {
      updateProgress("hijaiyah", activeChar.id, 10);
      celebrate();
    }
    move(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-lime-50 pb-12">
      <Header title="Belajar Hijaiyah" progressLabel={`${activeIndex + 1} / ${hijaiyahData.length} huruf`} onBack={() => router.push("/dashboard")} />

      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-b from-[#b7f0dc] via-[#dff7d6] to-[#a9df70] p-4 shadow-[0_24px_60px_rgba(34,197,94,0.18)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-green-500/22 to-transparent" />
          <div className="pointer-events-none absolute left-7 top-8 h-10 w-20 rounded-full bg-white/55 blur-sm" />
          <div className="pointer-events-none absolute right-9 top-20 h-12 w-28 rounded-full bg-white/45 blur-sm" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setShowGrid((value) => !value)} className="kid-button flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 text-sm text-emerald-800 shadow-sm">
              <Grid3X3 size={18} /> Semua huruf
            </button>
            <div className="min-w-28 rounded-full bg-emerald-600/78 px-4 py-2 text-center text-sm font-black text-white shadow-md">{activeIndex + 1} / {hijaiyahData.length}</div>
            <button type="button" aria-label="Tandai favorit" className="kid-button flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/82 text-rose-500 shadow-sm"><Heart size={20} /></button>
          </div>

          {showGrid ? (
            <div className="relative z-10 mt-5 grid grid-cols-4 gap-2 rounded-[1.6rem] border border-white/70 bg-white/78 p-3 shadow-xl backdrop-blur sm:grid-cols-7 sm:p-5">
              {hijaiyahData.map((char, index) => {
                const done = completed.includes(char.id);
                return (
                  <button key={char.id} type="button" onClick={() => { setActiveIndex(index); setShowGrid(false); }} className={`relative aspect-square rounded-2xl border text-3xl font-black transition-all hover:-translate-y-1 ${index === activeIndex ? "border-emerald-500 bg-emerald-100 text-emerald-800 shadow-md" : "border-emerald-100 bg-white text-[#173f2a]"}`}>
                    {char.arabic}
                    {done ? <Check className="absolute right-1 top-1 rounded-full bg-emerald-500 p-0.5 text-white" size={15} /> : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="relative z-10 mt-6 grid items-center gap-5 md:grid-cols-[54px_1fr_54px]">
              <button type="button" onClick={() => move(-1)} aria-label="Huruf sebelumnya" className="kid-button mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg"><ChevronLeft size={26} /></button>

              <motion.article key={activeChar.id} initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/86 shadow-[0_22px_50px_rgba(21,95,58,0.16)] backdrop-blur md:grid-cols-[1fr_0.95fr]">
                <div className="flex min-h-72 items-center justify-center border-b border-emerald-100 bg-gradient-to-br from-amber-50 to-white p-8 md:min-h-[390px] md:border-b-0 md:border-r">
                  <span className="arabic-font text-[9rem] font-black leading-none text-[#093e25] drop-shadow-sm sm:text-[12rem]">{activeChar.arabic}</span>
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Huruf Hijaiyah</p>
                  <h1 className="mt-2 text-5xl font-black tracking-tight text-[#173f2a]">{activeChar.name}</h1>
                  <p className="mt-2 text-lg font-bold text-emerald-700">Bunyi dasar: <span className="rounded-lg bg-emerald-50 px-2 py-1">{activeChar.name.charAt(0).toLowerCase()}</span></p>
                  <p className="mt-5 text-sm font-medium leading-6 text-slate-500">Dengarkan audionya, ikuti perlahan, lalu lanjut ke huruf berikutnya.</p>
                  <button type="button" onClick={() => playAudio(`hijaiyah_${activeChar.id}`, `/audio/hijaiyah/${activeChar.id}.mp3`)} className="kid-button mt-6 flex w-full items-center justify-center gap-2 bg-emerald-600 px-5 py-3.5 text-white shadow-lg shadow-emerald-300/45">
                    <Volume2 size={20} /> Dengarkan bunyi
                  </button>
                </div>
              </motion.article>

              <button type="button" onClick={() => move(1)} aria-label="Huruf berikutnya" className="kid-button mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg"><ChevronRight size={26} /></button>
            </div>
          )}

          <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => playAudio(`hijaiyah_${activeChar.id}`, `/audio/hijaiyah/${activeChar.id}.mp3`)} className="kid-button flex items-center justify-center gap-2 border border-white/80 bg-white/88 px-5 py-3 text-emerald-800 shadow-sm"><Volume2 size={19} /> Dengarkan</button>
            <button type="button" className="kid-button flex items-center justify-center gap-2 border border-white/80 bg-white/88 px-5 py-3 text-emerald-800 shadow-sm">🎙️ Ucapkan</button>
            <button type="button" onClick={markComplete} className={`kid-button flex items-center justify-center gap-2 px-5 py-3 shadow-lg ${isDone ? "bg-emerald-700 text-white" : "bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-emerald-300/45"}`}><Check size={19} /> {isDone ? "Sudah dipelajari" : "Selesai & lanjut"}</button>
          </div>
        </section>

        <section className="mt-5 app-card p-5">
          <div className="flex items-center justify-between text-sm font-black"><span>Progress Hijaiyah</span><span className="text-emerald-600">{progressPercent}%</span></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-50"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-400" style={{ width: `${progressPercent}%` }} /></div>
        </section>
      </div>
    </main>
  );
}
