"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Heart, Loader2, Mic, MicOff, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";
import { useSpeechPractice } from "@/hooks/useSpeechPractice";
import { useAppStore } from "@/lib/store";
import { doaData } from "@/data/doa";
import { playAudio } from "@/lib/audioCache";

function celebrate() {
  confetti({ particleCount: 90, spread: 68, origin: { y: 0.7 }, colors: ["#fb7185", "#facc15", "#8b5cf6", "#38bdf8"] });
}

export default function DoaPage() {
  const router = useRouter();
  const { currentUserUid, progress, updateProgress } = useAppStore();
  const completed = useMemo(
    () => (currentUserUid ? progress[currentUserUid]?.doa?.completedItems ?? [] : []),
    [currentUserUid, progress],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDoa = doaData[activeIndex];
  const isDone = completed.includes(activeDoa.id);

  const handleSpeechMatch = useCallback(() => {
    if (!completed.includes(activeDoa.id)) updateProgress("doa", activeDoa.id, 20);
    celebrate();
  }, [activeDoa.id, completed, updateProgress]);

  const speech = useSpeechPractice({ threshold: 0.7, language: "ar-SA", onMatched: handleSpeechMatch });

  useEffect(() => () => {
    confetti.reset();
  }, []);

  const move = (direction: number) => {
    speech.stop();
    speech.clear();
    setActiveIndex((current) => (current + direction + doaData.length) % doaData.length);
  };

  const markComplete = () => {
    if (!isDone) {
      updateProgress("doa", activeDoa.id, 20);
      celebrate();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-violet-50 pb-12">
      <Header title="Doa Harian" progressLabel={`Doa ${activeIndex + 1} / ${doaData.length}`} onBack={() => router.push("/dashboard")} />

      <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-pink-200 bg-gradient-to-br from-[#ffd8e6] via-[#ffe9f0] to-[#f8d9ff] p-4 shadow-[0_24px_60px_rgba(236,72,153,0.16)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-pink-300/28 to-transparent" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <button type="button" onClick={() => move(-1)} aria-label="Doa sebelumnya" className="kid-button flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/86 text-pink-700 shadow-sm"><ChevronLeft size={22} /></button>
            <span className="rounded-full bg-pink-500 px-4 py-2 text-xs font-black text-white shadow-md">Doa {activeIndex + 1} / {doaData.length}</span>
            <button type="button" aria-label="Tandai favorit" className="kid-button flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/86 text-rose-500 shadow-sm"><Heart size={20} /></button>
          </div>

          <motion.article key={activeDoa.id} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative z-10 mt-5 overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/88 p-5 text-center shadow-[0_22px_50px_rgba(190,24,93,0.12)] backdrop-blur sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500">{activeDoa.title}</p>
            <p dir="rtl" className="arabic-font mx-auto mt-6 max-w-3xl text-3xl font-bold leading-[2.1] text-[#32143f] sm:text-4xl">{activeDoa.arabic}</p>
            <p className="mx-auto mt-5 max-w-3xl text-sm font-bold italic leading-6 text-slate-600 sm:text-base">{activeDoa.latin}</p>
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-pink-100 bg-pink-50/70 p-4 text-sm font-medium leading-6 text-slate-600"><span className="font-black text-pink-700">Artinya:</span> {activeDoa.translation}</div>

            <AnimatePresence mode="wait">
              {speech.feedback ? (
                <motion.div key={speech.feedback.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mx-auto mt-5 max-w-3xl rounded-2xl border p-4 text-left text-sm font-semibold ${speech.feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : speech.feedback.type === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-sky-200 bg-sky-50 text-sky-800"}`}>
                  <div className="flex items-start gap-2">{speech.feedback.type === "info" ? <Loader2 className="mt-0.5 animate-spin" size={17} /> : null}<span>{speech.feedback.text}</span></div>
                  {typeof speech.feedback.score === "number" ? <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className={`h-full rounded-full ${speech.feedback.score >= 70 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${speech.feedback.score}%` }} /></div> : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.article>

          <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => playAudio(`doa_${activeDoa.id}`, `/audio/doa/${activeDoa.id}.mp3`)} className="kid-button flex items-center justify-center gap-2 border border-white/80 bg-white/90 px-5 py-3 text-pink-800 shadow-sm"><Volume2 size={19} /> Dengarkan</button>
            <button type="button" onClick={() => speech.isRecording ? speech.stop() : speech.start(activeDoa.arabic)} className={`kid-button flex items-center justify-center gap-2 px-5 py-3 shadow-lg ${speech.isRecording ? "bg-rose-500 text-white" : "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-pink-300/40"}`}>{speech.isRecording ? <MicOff size={19} /> : <Mic size={19} />}{speech.isRecording ? "Berhenti" : "Ucapkan"}</button>
            <button type="button" onClick={markComplete} className={`kid-button flex items-center justify-center gap-2 px-5 py-3 shadow-lg ${isDone ? "bg-emerald-600 text-white" : "bg-white/90 text-emerald-700"}`}><Check size={19} /> {isDone ? "Sudah hafal" : "Tandai selesai"}</button>
          </div>

          <button type="button" onClick={() => move(1)} className="kid-button relative z-10 mx-auto mt-5 flex items-center justify-center gap-2 rounded-full bg-[#32158a] px-7 py-3 text-sm text-white shadow-lg">Doa berikutnya <ChevronRight size={18} /></button>
          <div className="relative z-10 mt-4 flex justify-center gap-1.5">{doaData.slice(0, Math.min(8, doaData.length)).map((item, index) => <span key={item.id} className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-7 bg-pink-600" : "w-2 bg-pink-200"}`} />)}</div>
        </section>
      </div>
    </main>
  );
}
