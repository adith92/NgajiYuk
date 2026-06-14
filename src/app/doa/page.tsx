"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Check, Volume2 } from 'lucide-react';
import { doaData } from '@/data/doa';
import { playAudio } from '@/lib/audioCache';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  });
}

export default function DoaPage() {
  const router = useRouter();
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language || 'id') as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['doa'] : null;
  const completed = prog?.completedItems || [];

  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <div className="min-h-screen pb-10">
      <Header title="Doa Harian" onBack={() => router.push('/dashboard')} />
      <div className="p-6 max-w-3xl mx-auto space-y-6 mt-4">
        {doaData.map((doa, i) => {
          const isDone = completed.includes(doa.id);
          const title = doa.title;
          const arti = doa.translation;
          
          return (
            <motion.div
              key={doa.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
              className="glass-panel p-6 relative flex flex-col w-full rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-colors group overflow-hidden"
            >
              {/* Glow background */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex justify-between items-start mb-6 gap-4">
                <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
                {!isDone ? (
                   <button 
                     onClick={() => {
                        updateProgress('doa', doa.id, 20);
                        triggerConfetti();
                     }}
                     className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 font-semibold px-4 py-2 rounded-xl shadow-lg border border-purple-500/30 transition-all text-sm shrink-0 backdrop-blur-md"
                   >
                     Hafal (+20)
                   </button>
                ) : (
                   <div className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30 text-sm shrink-0 backdrop-blur-md">
                     <Check size={16} /> Hafal
                   </div>
                )}
              </div>
              
              <p className="relative z-10 text-3xl font-bold text-right leading-loose tracking-wider mb-5 text-purple-100 Arabic-Font drop-shadow-md" style={{ fontFamily: 'Scheherazade New, sans-serif' }} dir="rtl">{doa.arabic}</p>
              
              <div className="relative z-10 space-y-4">
                <p className="text-slate-300 italic border-l-4 border-purple-500/50 pl-4 text-sm md:text-base leading-relaxed">{doa.latin}</p>
                <p className="text-slate-200 bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-sm md:text-base shadow-inner leading-relaxed">{arti}</p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playAudio(`doa_${doa.id}`, `/audio/doa/${doa.id}.mp3`)}
                className="relative z-10 mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all"
              >
                <Volume2 size={20} /> Dengarkan Doa
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
