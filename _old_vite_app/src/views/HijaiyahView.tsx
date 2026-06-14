import { useState, useEffect } from 'react';
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
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#10b981', '#fbbf24', '#f97316', '#ec4899', '#6366f1']
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
    <div className="flex-1 pb-10 bg-emerald-50/30">
      <Header title={t.menu_hijaiyah} onBack={() => navigate('/menu')} />
      <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mt-6">
        {hijaiyahData.map((hija, i) => {
          const isDone = completed.includes(hija.id);
          const isActive = activeChar === hija.id;
          const isYellowish = hija.color.includes('yellow') || hija.color.includes('amber') || hija.color.includes('lime');
          
          return (
            <motion.button
              key={hija.id}
              initial={{ scale: 0, opacity: 0, y: 30, rotate: -10 }}
              animate={
                isActive
                  ? { scale: [1, 1.25, 0.85, 1.1, 1], rotate: [0, -10, 10, -5, 0], opacity: 1, y: 0 }
                  : { scale: 1, opacity: 1, y: 0, rotate: 0 }
              }
              transition={{ 
                type: isActive ? "keyframes" : "spring",
                duration: isActive ? 0.5 : 0.6,
                bounce: isActive ? undefined : 0.4,
                delay: isActive ? 0 : i * 0.03 
              }}
              whileHover={{ scale: 1.08, rotate: 3, y: -4 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              onClick={() => handleCharClick(hija)}
              className={cn(
                "relative aspect-square rounded-[2rem] clay-btn border-b-[8px] flex flex-col items-center justify-center p-2 text-white overflow-hidden group cursor-pointer shadow-md select-none",
                hija.color,
                hija.color.replace('bg-', 'border-').replace('400', '600'),
                isYellowish ? "text-emerald-950" : "text-white",
                isActive ? "z-10" : "z-0"
              )}
            >
              {isDone && (
                <div className="absolute top-2.5 right-2.5 bg-white/40 p-1.5 rounded-full shadow-inner border border-white/20">
                  <Check size={14} className={isYellowish ? "text-emerald-950" : "text-white"} />
                </div>
              )}
              <span className="text-5xl md:text-6xl font-black drop-shadow-md leading-none Arabic-Font" style={{ fontFamily: 'Scheherazade New, sans-serif' }}>
                {hija.arabic}
              </span>
              <span className="text-sm md:text-base font-black mt-2 tracking-wide uppercase select-none opacity-90">
                {hija.name}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
