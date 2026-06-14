import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { hijaiyahData } from '../data/hijaiyah';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Trophy } from 'lucide-react';
import { playAudio } from '../lib/audioCache';
import confetti from 'canvas-confetti';

function cnHelper(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  });
}

import { useNavigate } from 'react-router-dom';

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
      <div className="flex-1 pb-10 flex flex-col">
        <Header title={t.menu_kuis} onBack={() => navigate('/menu')} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full mt-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border-4 border-white text-center w-full relative overflow-hidden"
          >
            {/* Playful Floating Circles */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-100 rounded-full filter blur-xl opacity-50 -translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-pink-100 rounded-full filter blur-xl opacity-50 translate-x-10 translate-y-10" />

            {isPassed ? (
              <>
                <div className="text-8xl mb-6">🏆</div>
                <h2 className="text-3xl md:text-4xl font-black text-green-500 mb-4 leading-tight">
                  MasyaAllah! Nilai kamu bagus 🎉
                </h2>
                <p className="text-gray-600 font-medium mb-6 text-lg animate-pulse">
                  Kamu berhasil menyelesaikan kuis Hijaiyah dengan sangat baik!
                </p>
                <div className="bg-green-50 p-6 rounded-3xl mb-8 border-2 border-green-200 shadow-inner flex flex-col gap-2">
                  <div className="text-lg font-bold text-green-800">
                    Skor Kamu: <span className="text-3xl font-black">{resultSummary.scorePercent}%</span>
                  </div>
                  <div className="text-lg font-bold text-blue-800 flex items-center justify-center gap-2">
                    ⏱️ Waktu Bermain: <span className="text-3xl font-black text-blue-600">{resultSummary.rewardMinutes} Menit</span>
                  </div>
                  <p className="text-xs text-blue-600 font-semibold mt-2">
                    Hore! Game Zone sekarang sudah terbuka selama {resultSummary.rewardMinutes} menit!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/gamezone')}
                    className="flex-1 bg-orange-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all text-lg cursor-pointer clay-btn"
                  >
                    🎮 Masuk Game Zone
                  </button>
                  <button
                    onClick={() => navigate('/menu')}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-8 py-4 rounded-2xl font-black transition-all text-lg cursor-pointer clay-btn"
                  >
                    Kembali ke Menu
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-8xl mb-6">💪</div>
                <h2 className="text-3xl md:text-4xl font-black text-red-500 mb-4 leading-tight">
                  Belum unlock, coba lagi ya 💪
                </h2>
                <p className="text-gray-600 font-medium mb-6 text-lg">
                  Nilai kamu belum mencukupi untuk membuka Game Zone. Semangat, yuk coba lagi belajar!
                </p>
                <div className="bg-red-50 p-6 rounded-3xl mb-8 border-2 border-red-200 shadow-inner">
                  <div className="text-lg font-bold text-red-800">
                    Skor Kamu: <span className="text-3xl font-black">{resultSummary.scorePercent}%</span>
                  </div>
                  <p className="text-sm text-red-600 font-bold mt-2">
                    Minimal skor untuk unlock adalah 80%
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-[var(--primary-color)] text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all text-lg cursor-pointer clay-btn"
                  >
                    🔄 Ulangi Kuis
                  </button>
                  <button
                    onClick={() => navigate('/menu')}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-8 py-4 rounded-2xl font-black transition-all text-lg cursor-pointer clay-btn"
                  >
                    Kembali ke Menu
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
    <div className="flex-1 pb-10 flex flex-col">
      <Header title={t.menu_kuis} onBack={() => navigate('/menu')} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full mt-4">
        
        {/* Playful Interactive Progress */}
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6 border border-gray-200 shadow-inner relative">
          <div 
            className="bg-blue-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentQuestionIndex) / 10) * 100}%` }}
          />
        </div>

        <div className="mb-6 text-center bg-white p-6 rounded-3xl shadow-lg border-b-4 border-[var(--primary-color)] w-full relative">
          <div className="flex justify-between items-center w-full text-sm font-bold text-gray-500 mb-4 px-2">
            <span>{t.guess_letter || "Pilih Huruf"} (Soal {Math.min(10, currentQuestionIndex + 1)}/10)</span>
            <div className="flex gap-3 text-xs">
              <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-black">✅ {correctCount}</span>
              <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-black">❌ {wrongCount}</span>
            </div>
          </div>
          
          <button 
            onClick={() => announceTarget(target)}
            className="w-24 h-24 bg-blue-100 text-blue-500 rounded-full mx-auto flex items-center justify-center shadow-inner hover:bg-blue-200 active:scale-95 transition-all group border-4 border-white cursor-pointer"
          >
            <Volume2 size={48} className="group-hover:scale-110 transition-transform" />
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className={cnHelper(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white shadow-xl flex items-center gap-2 whitespace-nowrap z-10",
                  status === 'correct' ? "bg-green-500" : "bg-red-500"
                )}
              >
                {status === 'correct' && <Trophy size={20} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
          {options.map((opt, i) => (
            <motion.button
              key={i + opt.id}
              initial={{ scale: 0, rotate: -10 }}
              animate={status === 'wrong' && opt.id !== target.id ? { scale: 0.9, opacity: 0.5 } : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGuess(opt)}
              disabled={status === 'correct' || status === 'wrong' || hasGuessed}
              className={cnHelper(
                "aspect-square rounded-3xl flex items-center justify-center transition-all overflow-hidden relative cursor-pointer clay-btn",
                opt.color,
                opt.color.replace('bg-', 'border-').replace('400', '600').replace('500', '700')
              )}
            >
              <span className="text-7xl md:text-8xl font-black text-white drop-shadow-md Arabic-Font" style={{ fontFamily: 'sans-serif' }}>
                {opt.arabic}
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
