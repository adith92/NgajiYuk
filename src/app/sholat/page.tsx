"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, ListChecks, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";
import { useAppStore } from "@/lib/store";
import { sholatData } from "@/data/sholat";
import { playAudio } from "@/lib/audioCache";

function celebrate() {
  confetti({ particleCount: 80, spread: 65, origin: { y: 0.72 }, colors: ["#38bdf8", "#22c55e", "#facc15", "#8b5cf6"] });
}

export default function SholatPage() {
  const router = useRouter();
  const { currentUserUid, progress, updateProgress } = useAppStore();
  const completed = currentUserUid ? progress[currentUserUid]?.sholat?.completedItems ?? [] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const activeItem = sholatData[activeIndex];
  const isDone = completed.includes(activeItem.id);

  useEffect(() => () => confetti.reset(), []);

  const move = (direction: number) => setActiveIndex((current) => (current + direction + sholatData.length) % sholatData.length);
  const markComplete = () => {
    if (!isDone) {
      updateProgress("sholat", activeItem.id, 15);
      celebrate();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-emerald-50 pb-12">
      <Header title="Bacaan Sholat" progressLabel={`Langkah ${activeIndex + 1} / ${sholatData.length}`} onBack={() => router.push("/dashboard")} />
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-200 bg-gradient-to-br from-[#c9f2ff] via-[#e8f8ff] to-[#d8f7dd] p-4 shadow-[0_24px_60px_rgba(14,165,233,0.16)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-emerald-300/35 to-transparent" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setShowSteps((value) => !value)} className="kid-button flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/88 px-4 text-sm text-sky-800 shadow-sm"><ListChecks size={18} /> Daftar bacaan</button>
            <span className="rounded-full bg-sky-600 px-4 py-2 text-xs font-black text-white shadow-md">{activeIndex + 1} / {sholatData.length}</span>
          </div>

          {showSteps ? (
            <div className="relative z-10 mt-5 grid gap-2 rounded-[1.6rem] border border-white/80 bg-white/84 p-4 shadow-xl sm:grid-cols-2">
              {sholatData.map((item, index) => {
                const done = completed.includes(item.id);
                return (
                  <button key={item.id} type="button" onClick={() => { setActiveIndex(index); setShowSteps(false); }} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 ${index === activeIndex ? "border-sky-400 bg-sky-50" : "border-slate-100 bg-white"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${done ? "bg-emerald-500 text-white" : "bg-sky-100 text-sky-700"}`}>{done ? <Check size={17} /> : index + 1}</span>
                    <span className="text-sm font-black text-[#21395c]">{item.title}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="relative z-10 mt-6 grid items-center gap-5 md:grid-cols-[54px_1fr_54px]">
              <button type="button" onClick={() => move(-1)} aria-label="Bacaan sebelumnya" className="kid-button mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg"><ChevronLeft size={26} /></button>
              <motion.article key={activeItem.id} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_22px_50px_rgba(14,116,144,0.14)] backdrop-blur">
                <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 text-lg font-black">{activeIndex + 1}</span>
                    <div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-100">Tahapan sholat</p><h1 className="text-xl font-black sm:text-2xl">{activeItem.title}</h1></div>
                  </div>
                </div>
                <div className="p-6 text-center sm:p-9">
                  <p dir="rtl" className="arabic-font text-3xl font-bold leading-[2.1] text-[#183550] sm:text-4xl">{activeItem.arabic}</p>
                  <p className="mt-5 text-sm font-bold italic leading-6 text-slate-600 sm:text-base">{activeItem.latin}</p>
                  <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-sm font-medium leading-6 text-slate-600"><span className="font-black text-sky-700">Artinya:</span> {activeItem.translation}</div>
                </div>
              </motion.article>
              <button type="button" onClick={() => move(1)} aria-label="Bacaan berikutnya" className="kid-button mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg"><ChevronRight size={26} /></button>
            </div>
          )}

          <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => playAudio(`sholat_${activeItem.id}`, `/audio/sholat/${activeItem.id}.mp3`)} className="kid-button flex items-center justify-center gap-2 border border-white/80 bg-white/90 px-5 py-3 text-sky-800 shadow-sm"><Volume2 size={19} /> Dengarkan</button>
            <button type="button" onClick={markComplete} className={`kid-button flex items-center justify-center gap-2 px-5 py-3 shadow-lg ${isDone ? "bg-emerald-600 text-white" : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-300/40"}`}><Check size={19} /> {isDone ? "Sudah selesai" : "Tandai selesai"}</button>
            <button type="button" onClick={() => move(1)} className="kid-button flex items-center justify-center gap-2 bg-[#32158a] px-5 py-3 text-white shadow-lg">Lanjut <ChevronRight size={19} /></button>
          </div>
        </section>
      </div>
    </main>
  );
}
