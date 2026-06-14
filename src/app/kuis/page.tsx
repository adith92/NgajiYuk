"use client";

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { hijaiyahData } from '@/data/hijaiyah';
import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Trophy, ArrowRight, X, Check } from 'lucide-react';
import { playAudio } from '@/lib/audioCache';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#14b8a6', '#8b5cf6', '#10b981', '#f59e0b', '#0ea5e9']
  });
}

export default function KuisPage() {
  const router = useRouter();
  const { currentUserUid, users, updateProgress, completeQuizSession } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language || 'id') as any;
  const [options, setOptions] = useState<any[]>([]);
  const [target, setTarget] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'result'>('playing');

  // Session state counters
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [resultSummary, setResultSummary] = useState<any | null>(null);

  const generateQuiz = () => {
    setMessage('');
    setStatus('playing');
    setHasGuessed(false);
    const shuffled = [...hijaiyahData].sort(() => 0.5 - Math.random());
    const selectedOptions = shuffled.slice(0, 4);
    const targetChar = selectedOptions[Math.floor(Math.random() * 4)];
    setOptions(selectedOptions);
    setTarget(targetChar);
    
    setTimeout(() => {
      announceTarget(targetChar);
    }, 500);
  };

  const announceTarget = (char: any) => {
    if (!char) return;
    playAudio(`kuis_hijaiyah_${char.id}`, `/audio/kuis/hijaiyah_${char.id}.mp3`);
  };

  useEffect(() => {
    generateQuiz();
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      confetti.reset();
    };
  }, []);

  const advanceQuiz = (currentCorrect: number, currentWrong: number) => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(prev => prev + 1);
      generateQuiz();
    } else {
      // Completed 10 questions!
      const totalQuestions = 10;
      const historyItem = completeQuizSession('kuis_hijaiyah', totalQuestions, currentCorrect, currentWrong);
      setResultSummary(historyItem);
      setStatus('result');
    }
  };

  const handleGuess = (hija: any) => {
    if (status !== 'playing' || hasGuessed) return;
    setHasGuessed(true);

    if (hija.id === target.id) {
       setStatus('correct');
       const newCorrect = correctCount + 1;
       setCorrectCount(newCorrect);
       setMessage("Benar! 🎉");
       updateProgress('kuis_hijaiyah', Date.now().toString(), 15);
       triggerConfetti();
       playAudio('kuis_correct', `/audio/kuis/correct.mp3`);

       setTimeout(() => {
         advanceQuiz(newCorrect, wrongCount);
       }, 2000);
    } else {
       setStatus('wrong');
       const newWrong = wrongCount + 1;
       setWrongCount(newWrong);
       setMessage("Kurang Tepat! 😢");
       playAudio('kuis_wrong', `/audio/kuis/wrong.mp3`);

       setTimeout(() => {
         advanceQuiz(correctCount, newWrong);
       }, 2000);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setResultSummary(null);
    setHasGuessed(false);
    setMessage('');
    setStatus('playing');

    generateQuiz();
  };

  if (status === 'result' && resultSummary) {
    const isPassed = resultSummary.passed;
    return (
      <div className="min-h-screen pb-10 flex flex-col">
        <Header title="Kuis Hijaiyah" onBack={() => router.push('/dashboard')} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full mt-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-8 md:p-10 rounded-3xl text-center w-full relative overflow-hidden"
          >
            {/* Glow */}
            <div className={`absolute top-0 left-0 w-64 h-64 ${isPassed ? 'bg-teal-500/20' : 'bg-orange-500/20'} rounded-full filter blur-3xl opacity-50 -translate-x-10 -translate-y-10`} />

            {isPassed ? (
              <>
                <div className="text-8xl mb-6 select-none animate-bounce">🏆</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  MasyaAllah! Luar Biasa 🎉
                </h2>
                <p className="text-teal-300 font-medium mb-6 text-lg">
                  Kamu berhasil menyelesaikan kuis Hijaiyah dengan sangat baik!
                </p>
                <div className="bg-slate-800/50 p-6 rounded-3xl mb-8 border border-slate-700/50 flex flex-col gap-2 relative z-10">
                  <div className="text-lg text-slate-300">
                    Skor Kamu: <span className="text-3xl font-bold text-teal-400 ml-2">{resultSummary.scorePercent}%</span>
                  </div>
                  <div className="text-lg text-slate-300 flex items-center justify-center gap-2">
                    ⏱️ Waktu Bermain: <span className="text-3xl font-bold text-amber-400">{resultSummary.rewardMinutes} Menit</span>
                  </div>
                  <p className="text-sm text-teal-200 mt-2">
                    Game Zone sekarang terbuka selama {resultSummary.rewardMinutes} menit!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <button
                    onClick={() => router.push('/gamezone')}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all text-lg"
                  >
                    🎮 Game Zone
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 bg-slate-800/80 text-white hover:bg-slate-700 px-6 py-4 rounded-xl font-bold border border-slate-600 transition-all text-lg"
                  >
                    Kembali
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-8xl mb-6 select-none">💪</div>
                <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4 leading-tight">
                  Belum unlock, coba lagi!
                </h2>
                <p className="text-slate-300 font-medium mb-6 text-lg">
                  Nilai kamu belum mencukupi untuk membuka Game Zone. Semangat belajar!
                </p>
                <div className="bg-slate-800/50 p-6 rounded-3xl mb-8 border border-slate-700/50 relative z-10">
                  <div className="text-lg text-slate-300">
                    Skor Kamu: <span className="text-3xl font-bold text-orange-400 ml-2">{resultSummary.scorePercent}%</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    Minimal skor untuk unlock adalah 80%
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:from-teal-400 hover:to-emerald-400 transition-all text-lg"
                  >
                    🔄 Ulangi Kuis
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 bg-slate-800/80 text-white hover:bg-slate-700 px-6 py-4 rounded-xl font-bold border border-slate-600 transition-all text-lg"
                  >
                    Kembali
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      <Header title="Kuis Hijaiyah" onBack={() => router.push('/dashboard')} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full mt-4">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800/50 h-4 rounded-full overflow-hidden mb-8 border border-slate-700/50 relative p-0.5">
          <div 
            className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"
            style={{ width: `${((currentQuestionIndex) / 10) * 100}%` }}
          />
        </div>

        <div className="mb-8 text-center glass-panel p-8 rounded-3xl w-full relative flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-center w-full text-sm font-bold text-slate-300 mb-8 px-2 relative z-10">
            <span>Pilih Huruf (Soal {Math.min(10, currentQuestionIndex + 1)}/10)</span>
            <div className="flex gap-3 text-xs">
              <span className="bg-teal-500/20 text-teal-300 px-3 py-1.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                <Check size={14} /> {correctCount}
              </span>
              <span className="bg-orange-500/20 text-orange-300 px-3 py-1.5 rounded-full border border-orange-500/30 flex items-center gap-1">
                <X size={14} /> {wrongCount}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => announceTarget(target)}
            className="relative z-10 w-28 h-28 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 size={48} />
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-2xl font-bold text-white shadow-xl flex items-center gap-2 whitespace-nowrap z-20",
                  status === 'correct' ? "bg-teal-500" : "bg-orange-500"
                )}
              >
                {status === 'correct' && <Trophy size={18} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
          {options.map((opt, i) => {
            return (
              <motion.button
                key={i + opt.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={status === 'wrong' && opt.id !== target?.id ? { scale: 0.95, opacity: 0.3 } : { scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGuess(opt)}
                disabled={status === 'correct' || status === 'wrong' || hasGuessed}
                className={cn(
                  "aspect-square rounded-[2rem] flex flex-col items-center justify-center transition-all overflow-hidden relative cursor-pointer glass-panel border border-slate-700/50 hover:border-teal-500/50",
                  status === 'correct' && opt.id === target?.id ? "bg-teal-500/30 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)]" : ""
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <span className="text-7xl md:text-8xl font-black text-white drop-shadow-md relative z-10 Arabic-Font" style={{ fontFamily: 'Scheherazade New, sans-serif' }}>
                  {opt.arabic}
                </span>
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
