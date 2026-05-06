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

export function KuisView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const [options, setOptions] = useState<any[]>([]);
  const [target, setTarget] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');

  const generateQuiz = () => {
    setMessage('');
    setStatus('playing');
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
    const name = char.name; // ID/AR fallback handled via text
    playAudio(`kuis_hijaiyah_${char.id}`, `/audio/kuis/hijaiyah_${char.id}.mp3`);
  };

  useEffect(() => {
    generateQuiz();
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleGuess = (hija: any) => {
    if (status !== 'playing') return;

    if (hija.id === target.id) {
       setStatus('correct');
       setMessage(t.correct);
       updateProgress('kuis_hijaiyah', Date.now().toString(), 15);
       triggerConfetti();
       playAudio('kuis_correct', `/audio/kuis/correct.mp3`);

       setTimeout(generateQuiz, 2000);
    } else {
       setStatus('wrong');
       setMessage(t.wrong);
       playAudio('kuis_wrong', `/audio/kuis/wrong.mp3`);

       setTimeout(() => {
         setStatus('playing');
         setMessage('');
       }, 1500);
    }
  };

  return (
    <div className="flex-1 pb-10 flex flex-col">
      <Header title={t.menu_kuis} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full mt-4">
        
        <div className="mb-8 text-center bg-white p-6 rounded-3xl shadow-lg border-b-4 border-[var(--primary-color)] w-full relative">
          <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-6 uppercase tracking-wider">{t.guess_letter}</h3>
          
          <button 
            onClick={() => announceTarget(target)}
            className="w-24 h-24 bg-blue-100 text-blue-500 rounded-full mx-auto flex items-center justify-center shadow-inner hover:bg-blue-200 active:scale-95 transition-all group border-4 border-white"
          >
            <Volume2 size={48} className="group-hover:scale-110 transition-transform" />
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cnHelper(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white shadow-xl flex items-center gap-2 whitespace-nowrap",
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
              disabled={status === 'correct'}
              className={cnHelper(
                "aspect-square rounded-3xl shadow-xl flex items-center justify-center border-b-8 active:border-b-0 active:translate-y-2 transition-all overflow-hidden relative",
                opt.color,
                opt.color.replace('bg-', 'border-').replace('400', '600')
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
