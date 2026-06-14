"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Check, Volume2 } from 'lucide-react';
import { sholatData } from '@/data/sholat';
import { playAudio } from '@/lib/audioCache';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899']
  });
}

export default function SholatPage() {
  const router = useRouter();
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language || 'id') as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['sholat'] : null;
  const completed = prog?.completedItems || [];

  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <div className="min-h-screen pb-10">
      <Header title="Tata Cara Sholat" onBack={() => router.push('/dashboard')} />
      <div className="p-6 max-w-3xl mx-auto space-y-6 mt-4">
        {sholatData.map((sholat, i) => {
          const isDone = completed.includes(sholat.id);
          const title = sholat.title;
          
          return (
            <motion.div
              key={sholat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
              className="glass-panel p-6 relative flex flex-col w-full rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors group overflow-hidden"
            >
              {/* Glow background */}
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex justify-between items-start mb-6 gap-4">
                <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
                {!isDone ? (
                   <button 
                     onClick={() => {
                       updateProgress('sholat', sholat.id, 15);
                       triggerConfetti();
                     }}
                     className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-semibold px-4 py-2 rounded-xl shadow-lg border border-emerald-500/30 transition-all text-sm shrink-0 backdrop-blur-md"
                   >
                     Selesai (+15)
                   </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-teal-300 font-semibold bg-teal-500/20 px-4 py-2 rounded-xl border border-teal-500/30 text-sm shrink-0 backdrop-blur-md">
                    <Check size={16} /> Selesai
                  </div>
                )}
              </div>
              
              <p className="relative z-10 text-3xl font-bold text-right leading-loose tracking-wider mb-5 text-emerald-100 Arabic-Font drop-shadow-md" style={{ fontFamily: 'Scheherazade New, sans-serif' }} dir="rtl">{sholat.arabic}</p>
              
              <div className="relative z-10 space-y-4">
                <p className="text-slate-300 italic border-l-4 border-emerald-500/50 pl-4 text-sm md:text-base leading-relaxed">{sholat.latin}</p>
                <p className="text-slate-200 bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-sm md:text-base shadow-inner leading-relaxed">{sholat.translation}</p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playAudio(`sholat_${sholat.id}`, `/audio/sholat/${sholat.id}.mp3`)}
                className="relative z-10 mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Volume2 size={20} /> Dengarkan
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
