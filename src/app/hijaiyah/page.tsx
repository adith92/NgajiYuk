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
    colors: ['#14b8a6', '#8b5cf6', '#10b981', '#f59e0b', '#0ea5e9']
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
                "glass-panel border border-slate-700/50 hover:border-teal-500/50 hover:shadow-teal-500/20",
                isActive ? "z-10 bg-teal-500/20 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)]" : "z-0"
              )}
            >
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {isDone && (
                <div className="absolute top-3 right-3 bg-teal-500/20 p-1.5 rounded-full border border-teal-500/50 backdrop-blur-md">
                  <Check size={14} className="text-teal-400" />
                </div>
              )}
              
              <span className="text-5xl md:text-6xl font-black drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)] leading-none text-white Arabic-Font" style={{ fontFamily: 'Scheherazade New, sans-serif' }}>
                {hija.arabic}
              </span>
              <span className="text-sm md:text-base font-bold mt-3 tracking-wider uppercase text-slate-400 group-hover:text-teal-300 transition-colors">
                {hija.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
