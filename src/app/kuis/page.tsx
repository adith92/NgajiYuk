"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock3, RotateCcw, Trophy, Volume2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";
import { hijaiyahData } from "@/data/hijaiyah";
import { playAudio } from "@/lib/audioCache";
import { useAppStore, type QuizHistory } from "@/lib/store";

type HijaiyahItem = (typeof hijaiyahData)[number];
type QuizStatus = "playing" | "correct" | "wrong" | "result";

const QUESTION_COUNT = 10;

function celebrate() {
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.68 }, colors: ["#facc15", "#22c55e", "#8b5cf6", "#38bdf8"] });
}

function createQuestion() {
  const shuffled = [...hijaiyahData].sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 4);
  return { options, target: options[Math.floor(Math.random() * options.length)] };
}

export default function KuisPage() {
  const router = useRouter();
  const { updateProgress, completeQuizSession } = useAppStore();
  const [{ options, target }, setQuestion] = useState(createQuestion);
  const [status, setStatus] = useState<QuizStatus>("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [result, setResult] = useState<QuizHistory | null>(null);

  const announceTarget = useCallback((item: HijaiyahItem) => {
    playAudio(`kuis_hijaiyah_${item.id}`, `/audio/kuis/hijaiyah_${item.id}.mp3`);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => announceTarget(target), 450);
    return () => window.clearTimeout(timer);
  }, [announceTarget, target]);

  useEffect(() => () => confetti.reset(), []);

  const nextQuestion = (correct: number, wrong: number) => {
    if (currentIndex < QUESTION_COUNT - 1) {
      setCurrentIndex((value) => value + 1);
      setQuestion(createQuestion());
      setStatus("playing");
      return;
    }

    const summary = completeQuizSession("kuis_hijaiyah", QUESTION_COUNT, correct, wrong);
    setResult(summary);
    setStatus("result");
  };

  const handleGuess = (item: HijaiyahItem) => {
    if (status !== "playing") return;

    if (item.id === target.id) {
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setStatus("correct");
      updateProgress("kuis_hijaiyah", `question-${currentIndex}-${Date.now()}`, 15);
      playAudio("kuis_correct", "/audio/kuis/correct.mp3");
      celebrate();
      window.setTimeout(() => nextQuestion(nextCorrect, wrongCount), 1200);
    } else {
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);
      setStatus("wrong");
      playAudio("kuis_wrong", "/audio/kuis/wrong.mp3");
      window.setTimeout(() => nextQuestion(correctCount, nextWrong), 1200);
    }
  };

  const resetQuiz = () => {
    setQuestion(createQuestion());
    setStatus("playing");
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setResult(null);
  };

  if (status === "result" && result) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-violet-50 pb-12">
        <Header title="Hasil Kuis Hijaiyah" onBack={() => router.push("/dashboard")} />
        <div className="mx-auto flex max-w-xl px-4 pt-8 sm:px-6">
          <motion.article initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="app-card w-full overflow-hidden text-center">
            <div className={`p-8 text-white ${result.passed ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-orange-500 to-rose-500"}`}>
              <span className="text-7xl">{result.passed ? "🏆" : "💪"}</span>
              <h1 className="mt-4 text-3xl font-black">{result.passed ? "MasyaAllah, Hebat!" : "Sedikit Lagi!"}</h1>
              <p className="mt-2 text-sm font-semibold text-white/85">{result.passed ? "Kamu berhasil membuka reward Game Zone." : "Ulangi kuis dan capai minimal 80%."}</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-violet-50 p-4"><p className="text-2xl font-black text-violet-700">{result.scorePercent}%</p><p className="mt-1 text-[11px] font-bold text-slate-500">Skor</p></div>
                <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-2xl font-black text-emerald-600">{result.correctAnswers}</p><p className="mt-1 text-[11px] font-bold text-slate-500">Benar</p></div>
                <div className="rounded-2xl bg-amber-50 p-4"><p className="text-2xl font-black text-amber-600">{result.rewardMinutes}</p><p className="mt-1 text-[11px] font-bold text-slate-500">Menit reward</p></div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={resetQuiz} className="kid-button flex items-center justify-center gap-2 border border-violet-200 bg-violet-50 px-5 py-3 text-violet-700"><RotateCcw size={18} /> Ulangi kuis</button>
                <button type="button" onClick={() => router.push(result.passed ? "/gamezone" : "/dashboard")} className="kid-button bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3 text-white shadow-lg shadow-violet-300/35">{result.passed ? "🎮 Buka Game Zone" : "Kembali belajar"}</button>
              </div>
            </div>
          </motion.article>
        </div>
      </main>
    );
  }

  const progress = ((currentIndex + 1) / QUESTION_COUNT) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 pb-12">
      <Header title="Kuis Hijaiyah" progressLabel={`Soal ${currentIndex + 1} / ${QUESTION_COUNT}`} onBack={() => router.push("/dashboard")} />
      <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-[#ffe7a7] via-[#fff8db] to-[#ffd98c] p-4 shadow-[0_24px_60px_rgba(245,158,11,0.18)] sm:p-7">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-black text-amber-800"><Clock3 size={16} /> Fokus & pilih</div>
            <span className="rounded-full bg-white/85 px-4 py-2 text-xs font-black text-amber-800">Soal {currentIndex + 1} / {QUESTION_COUNT}</span>
          </div>

          <div className="relative z-10 mt-5 h-3 overflow-hidden rounded-full border border-white/80 bg-white/70"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 transition-all" style={{ width: `${progress}%` }} /></div>

          <motion.article key={target.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mt-5 rounded-[1.8rem] border border-white/80 bg-white/90 p-6 text-center shadow-[0_22px_50px_rgba(180,83,9,0.12)] sm:p-8">
            <p className="text-sm font-black text-slate-600">Huruf apakah ini?</p>
            <p className="arabic-font mt-5 text-[7rem] font-black leading-none text-[#2f1b18] sm:text-[9rem]">{target.arabic}</p>
            <button type="button" onClick={() => announceTarget(target)} className="kid-button mx-auto mt-6 flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-white shadow-lg shadow-amber-300/45"><Volume2 size={20} /> Dengarkan</button>

            <AnimatePresence>
              {status !== "playing" ? (
                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className={`absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2 text-sm font-black text-white shadow-lg ${status === "correct" ? "bg-emerald-500" : "bg-rose-500"}`}>
                  {status === "correct" ? <Check size={17} /> : <X size={17} />}{status === "correct" ? "Benar! 🎉" : `Jawabannya ${target.name}`}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.article>

          <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {options.map((option, index) => {
              const isTarget = option.id === target.id;
              const feedback = status !== "playing" && isTarget ? "border-emerald-500 bg-emerald-100 text-emerald-800" : "border-white/80 bg-white/90 text-[#2f1b18] hover:border-amber-400 hover:bg-amber-50";
              return (
                <motion.button key={option.id} type="button" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: status === "wrong" && !isTarget ? 0.45 : 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={status === "playing" ? { y: -4 } : undefined} onClick={() => handleGuess(option)} disabled={status !== "playing"} className={`kid-button relative min-h-28 border-2 p-4 shadow-sm ${feedback}`}>
                  <span className="arabic-font block text-5xl font-black">{option.arabic}</span>
                  <span className="mt-2 block text-xs font-black">{option.name}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="relative z-10 mt-5 flex justify-center gap-3 text-xs font-black">
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700"><Check size={15} /> {correctCount} benar</span>
            <span className="flex items-center gap-1 rounded-full bg-rose-100 px-4 py-2 text-rose-700"><X size={15} /> {wrongCount} salah</span>
          </div>
        </section>
      </div>
    </main>
  );
}
