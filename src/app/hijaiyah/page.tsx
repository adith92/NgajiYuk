"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Check } from 'lucide-react';
import { hijaiyahData } from '@/data/hijaiyah';
import { playAudio } from '@/lib/audioCache';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
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
    colors: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']
  });
}

export default function HijaiyahPage() {
  const router = useRouter();
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language || 'id') as any;
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
    <div className="min-h-screen pb-10">
      <Header title="Huruf Hijaiyah" onBack={() => router.push('/dashboard')} />
      <div className="p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 max-w-5xl mx-auto mt-6">
        {hijaiyahData.map((hija, i) => {
          const isDone = completed.includes(hija.id);
          const isActive = activeChar === hija.id;
          
          return (
            <motion.button
              key={hija.id}
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={
                isActive
                  ? { scale: [1, 1.15, 0.95, 1.05, 1], opacity: 1, y: 0 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ 
                type: isActive ? "keyframes" : "spring",
                duration: isActive ? 0.5 : 0.6,
                bounce: isActive ? undefined : 0.4,
                delay: isActive ? 0 : i * 0.02 
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCharClick(hija)}
              className={cn(
                "relative aspect-square rounded-3xl flex flex-col items-center justify-center p-2 overflow-hidden group cursor-pointer transition-all",
                "glass-panel border-2 border-sky-200 hover:border-sky-400 hover:shadow-sky-200/30",
                isActive ? "z-10 bg-sky-100/60 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.2)]" : "z-0"
              )}
            >
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {isDone && (
                <div className="absolute top-3 right-3 bg-emerald-100 p-1.5 rounded-full border border-emerald-300 backdrop-blur-md">
                  <Check size={14} className="text-emerald-500" />
                </div>
              )}
              
              <span className="text-5xl md:text-6xl font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)] leading-none text-amber-700 Arabic-Font" style={{ fontFamily: 'Scheherazade New, sans-serif' }}>
                {hija.arabic}
              </span>
              <span className="text-sm md:text-base font-bold mt-3 tracking-wider uppercase text-slate-500 group-hover:text-sky-600 transition-colors">
                {hija.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
