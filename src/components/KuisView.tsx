import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { hijaiyahData } from '../lib/data';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Trophy } from 'lucide-react';

function cnHelper(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

const playAudioFallback = (url: string, name: string, lang: string) => {
  const audio = new Audio(url);
  audio.play().catch(() => {
    const msg = new SpeechSynthesisUtterance(name);
    msg.lang = lang;
    window.speechSynthesis.speak(msg);
  });
};

export function KuisView({ onBack }: { onBack: () => void }) {
  const { user, updateProgress } = useAppStore();
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
    const name = user?.language === 'ja' ? char.jp : char.name;
    const lang = user?.language === 'ja' ? 'ja-JP' : 'id-ID';
    playAudioFallback(char.audioUrl, name, lang);
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
       
       const msg = new SpeechSynthesisUtterance(t.correct);
       msg.lang = user?.language === 'ja' ? 'ja-JP' : 'id-ID';
       window.speechSynthesis.speak(msg);

       setTimeout(generateQuiz, 2000);
    } else {
       setStatus('wrong');
       setMessage(t.wrong);
       const msg = new SpeechSynthesisUtterance(t.wrong);
       msg.lang = user?.language === 'ja' ? 'ja-JP' : 'id-ID';
       window.speechSynthesis.speak(msg);

       setTimeout(() => {
         setStatus('playing');
         setMessage('');
       }, 1500);
    }
  };

  return (
    <div className="flex-1 pb-10 flex flex-col">
      <Header title={t.menu_kuis} onBack={onBack} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        
        <div className="mb-8 text-center bg-white p-6 rounded-3xl shadow-lg border-b-4 border-[var(--primary-color)] w-full relative">
          <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-wider">{t.guess_letter}</h3>
          
          <button 
            onClick={() => announceTarget(target)}
            className="w-24 h-24 bg-blue-100 text-blue-500 rounded-full mx-auto flex items-center justify-center shadow-inner hover:bg-blue-200 active:scale-95 transition-all group"
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
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-white shadow-xl flex items-center gap-2",
                  status === 'correct' ? "bg-green-500" : "bg-red-500"
                )}
              >
                {status === 'correct' && <Trophy size={20} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full">
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
                {opt.label}
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
