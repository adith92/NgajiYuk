import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { hijaiyahData } from '../data/hijaiyah';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Trophy, ArrowRight } from 'lucide-react';
import { playAudio } from '../lib/audioCache';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

function cnHelper(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#fbbf24', '#f97316', '#ec4899', '#6366f1']
  });
}

export function KuisView() {
  const navigate = useNavigate();
  const { currentUserUid, users, updateProgress, completeQuizSession } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
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
       setMessage(t.correct || "Benar! 🎉");
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
       setMessage(t.wrong || "Kurang Tepat! 😢");
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

    const shuffled = [...hijaiyahData].sort(() => 0.5 - Math.random());
    const selectedOptions = shuffled.slice(0, 4);
    const targetChar = selectedOptions[Math.floor(Math.random() * 4)];
    setOptions(selectedOptions);
    setTarget(targetChar);
    setTimeout(() => {
      if (targetChar) {
        playAudio(`kuis_hijaiyah_${targetChar.id}`, `/audio/kuis/hijaiyah_${targetChar.id}.mp3`);
      }
    }, 500);
  };

  if (status === 'result' && resultSummary) {
    const isPassed = resultSummary.passed;
    return (
      <div className="flex-1 pb-10 flex flex-col bg-emerald-50/30">
        <Header title={t.menu_kuis} onBack={() => navigate('/menu')} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full mt-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="clay-card p-8 md:p-10 border-[6px] border-white/95 bg-white/90 text-center w-full relative overflow-hidden"
          >
            {/* Playful Floating Circles */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-100/40 rounded-full filter blur-xl opacity-50 -translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-100/40 rounded-full filter blur-xl opacity-50 translate-x-10 translate-y-10" />

            {isPassed ? (
              <>
                <div className="text-8xl mb-6 select-none animate-bounce">🏆</div>
                <h2 className="text-3xl md:text-4xl font-black text-emerald-800 mb-4 leading-tight">
                  MasyaAllah! Nilai kamu bagus 🎉
                </h2>
                <p className="text-emerald-700/80 font-bold mb-6 text-lg">
                  Kamu berhasil menyelesaikan kuis Hijaiyah dengan sangat baik!
                </p>
                <div className="bg-emerald-50 p-6 rounded-3xl mb-8 border-2 border-emerald-100 shadow-inner flex flex-col gap-2">
                  <div className="text-lg font-black text-emerald-900">
                    Skor Kamu: <span className="text-3xl font-black text-emerald-600">{resultSummary.scorePercent}%</span>
                  </div>
                  <div className="text-lg font-black text-amber-700 flex items-center justify-center gap-2">
                    ⏱️ Waktu Bermain: <span className="text-3xl font-black text-amber-500">{resultSummary.rewardMinutes} Menit</span>
                  </div>
                  <p className="text-xs text-emerald-800 font-extrabold mt-2">
                    Hore! Game Zone sekarang sudah terbuka selama {resultSummary.rewardMinutes} menit!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/gamezone')}
                    className="flex-1 bg-gradient-to-b from-orange-400 to-orange-500 text-white px-6 py-4 rounded-2xl font-black shadow-md border-b-[6px] border-orange-700 hover:brightness-105 active:scale-95 transition-all text-lg cursor-pointer focus:outline-none"
                  >
                    🎮 Game Zone
                  </button>
                  <button
                    onClick={() => navigate('/menu')}
                    className="flex-1 bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 hover:brightness-105 px-6 py-4 rounded-2xl font-black border-b-[6px] border-slate-400 active:scale-95 transition-all text-lg cursor-pointer focus:outline-none"
                  >
                    Kembali
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-8xl mb-6 select-none">💪</div>
                <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-4 leading-tight">
                  Belum unlock, coba lagi ya 💪
                </h2>
                <p className="text-emerald-800/80 font-bold mb-6 text-lg">
                  Nilai kamu belum mencukupi untuk membuka Game Zone. Semangat, yuk coba lagi belajar!
                </p>
                <div className="bg-orange-50 p-6 rounded-3xl mb-8 border-2 border-orange-100 shadow-inner">
                  <div className="text-lg font-black text-orange-950">
                    Skor Kamu: <span className="text-3xl font-black text-orange-600">{resultSummary.scorePercent}%</span>
                  </div>
                  <p className="text-xs text-orange-800 font-extrabold mt-2">
                    Minimal skor untuk unlock adalah 80%
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-gradient-to-b from-emerald-400 to-emerald-500 text-white px-6 py-4 rounded-2xl font-black shadow-md border-b-[6px] border-emerald-700 hover:brightness-105 active:scale-95 transition-all text-lg cursor-pointer focus:outline-none"
                  >
                    🔄 Ulangi Kuis
                  </button>
                  <button
                    onClick={() => navigate('/menu')}
                    className="flex-1 bg-gradient-to-b from-slate-200 to-slate-300 text-slate-800 hover:brightness-105 px-6 py-4 rounded-2xl font-black border-b-[6px] border-slate-400 active:scale-95 transition-all text-lg cursor-pointer focus:outline-none"
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
    <div className="flex-1 pb-10 flex flex-col bg-emerald-50/30">
      <Header title={t.menu_kuis} onBack={() => navigate('/menu')} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full mt-4">
        
        {/* Playful Interactive Progress */}
        <div className="w-full bg-emerald-100/50 h-5 rounded-full overflow-hidden mb-6 border-2 border-emerald-100 shadow-inner relative p-1">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full transition-all duration-300 rounded-full shadow-md"
            style={{ width: `${((currentQuestionIndex) / 10) * 100}%` }}
          />
        </div>

        <div className="mb-6 text-center clay-card p-6 bg-white/90 border-[6px] border-white/95 w-full relative flex flex-col items-center shadow-md">
          <div className="flex justify-between items-center w-full text-sm font-black text-emerald-800 mb-6 px-1">
            <span>{t.guess_letter || "Pilih Huruf"} (Soal {Math.min(10, currentQuestionIndex + 1)}/10)</span>
            <div className="flex gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 shadow-sm font-black">✅ {correctCount}</span>
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100 shadow-sm font-black">❌ {wrongCount}</span>
            </div>
          </div>
          
          <button 
            onClick={() => announceTarget(target)}
            className="w-24 h-24 bg-gradient-to-b from-cyan-400 to-cyan-500 text-white rounded-full mx-auto flex items-center justify-center shadow-lg hover:brightness-105 active:scale-95 border-b-[6px] border-cyan-700 cursor-pointer focus:outline-none transition-all"
          >
            <Volume2 size={42} className="stroke-[3px]" />
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className={cnHelper(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-2xl font-black text-white shadow-xl flex items-center gap-2 whitespace-nowrap z-10 border-b-[4px]",
                  status === 'correct' ? "bg-emerald-500 border-emerald-700" : "bg-orange-500 border-orange-700"
                )}
              >
                {status === 'correct' && <Trophy size={18} className="fill-white/10" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
          {options.map((opt, i) => {
            const isYellowish = opt.color.includes('yellow') || opt.color.includes('amber') || opt.color.includes('lime');
            return (
              <motion.button
                key={i + opt.id}
                initial={{ scale: 0, rotate: -10 }}
                animate={status === 'wrong' && opt.id !== target.id ? { scale: 0.9, opacity: 0.5 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGuess(opt)}
                disabled={status === 'correct' || status === 'wrong' || hasGuessed}
                className={cnHelper(
                  "aspect-square rounded-[2rem] flex items-center justify-center transition-all overflow-hidden relative cursor-pointer clay-btn border-b-[8px] shadow-md select-none",
                  opt.color,
                  opt.color.replace('bg-', 'border-').replace('400', '600').replace('500', '700'),
                  isYellowish ? "text-emerald-950" : "text-white"
                )}
              >
                <span className="text-7xl md:text-8xl font-black drop-shadow-md Arabic-Font" style={{ fontFamily: 'Scheherazade New, sans-serif' }}>
                  {opt.arabic}
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
