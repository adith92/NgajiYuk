import { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { Check } from 'lucide-react';
import { hijaiyahData } from '../data/hijaiyah';
import { playAudio } from '../lib/audioCache';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  });
}

export default function HijaiyahView() {
  const navigate = useNavigate();
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['hijaiyah'] : null;
  const completed = prog?.completedItems || [];
  const [activeChar, setActiveChar] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  const handleCharClick = async (hija: any) => {
    setActiveChar(hija.id);
    await playAudio(`hijaiyah_${hija.id}`, `/audio/hijaiyah/${hija.id}.mp3`);
    if (!completed.includes(hija.id)) {
      updateProgress('hijaiyah', hija.id, 10);
      triggerConfetti();
    }
    setTimeout(() => setActiveChar(null), 600);
  };

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_hijaiyah} onBack={() => navigate('/menu')} />
      <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mt-6">
        {hijaiyahData.map((hija, i) => {
          const isDone = completed.includes(hija.id);
          const isActive = activeChar === hija.id;
          
          return (
            <motion.button
              key={hija.id}
              initial={{ scale: 0, opacity: 0, y: 50, rotate: -20 }}
              animate={
                isActive
                  ? { scale: [1, 1.3, 0.8, 1.1, 1], rotate: [0, -15, 15, -5, 0], opacity: 1, y: 0 }
                  : { scale: 1, opacity: 1, y: 0, rotate: 0 }
              }
              transition={{ 
                type: isActive ? "keyframes" : "spring",
                duration: isActive ? 0.6 : 0.8,
                bounce: isActive ? undefined : 0.6,
                delay: isActive ? 0 : i * 0.05 
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.8, rotate: -10 }}
              onClick={() => handleCharClick(hija)}
              className={cn(
                "relative aspect-square rounded-3xl shadow-lg border-b-4 flex flex-col items-center justify-center p-2 text-white overflow-hidden group",
                hija.color,
                hija.color.replace('bg-', 'border-').replace('400', '600'),
                isActive ? "z-10" : "z-0"
              )}
            >
              {isDone && (
                <div className="absolute top-2 right-2 bg-white/40 p-1 rounded-full">
                  <Check size={16} className="text-white" />
                </div>
              )}
              <span className="text-5xl md:text-6xl font-black drop-shadow-md leading-none Arabic-Font" style={{ fontFamily: 'sans-serif' }}>
                {hija.arabic}
              </span>
              <span className="text-lg md:text-xl font-bold mt-2 tracking-wide capitalize">
                {hija.name}
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
