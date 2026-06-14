import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { Check, Volume2 } from 'lucide-react';
import { doaData } from '../data/doa';
import { playAudio } from '../lib/audioCache';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  });
}

export default function DoaView() {
  const navigate = useNavigate();
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['doa'] : null;
  const completed = prog?.completedItems || [];

  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  return (
    <div className="flex-1 pb-10 bg-emerald-50/30">
      <Header title={t.menu_doa} onBack={() => navigate('/menu')} />
      <div className="p-4 max-w-3xl mx-auto space-y-6 mt-4">
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
              className="clay-card p-6 bg-white/90 border-[5px] border-white/95 relative shadow-md flex flex-col w-full"
            >
              <div className="flex justify-between items-start mb-4 gap-2">
                <h3 className="text-xl font-black text-emerald-900 tracking-wide">{title}</h3>
                {!isDone ? (
                   <button 
                     onClick={() => {
                        updateProgress('doa', doa.id, 20);
                        triggerConfetti();
                     }}
                     className="bg-gradient-to-b from-emerald-400 to-emerald-500 text-white font-black px-4 py-2 rounded-2xl shadow-md hover:brightness-105 active:scale-95 border-b-[4px] border-emerald-700 transition-all text-xs shrink-0 cursor-pointer"
                   >
                     Hafal (+20)
                   </button>
                ) : (
                   <div className="flex items-center gap-1 text-emerald-700 font-black bg-emerald-100/50 px-3 py-1.5 rounded-full border border-emerald-200 text-xs shrink-0 select-none shadow-inner">
                     <Check size={14} className="stroke-[3px]" /> Hafal
                   </div>
                )}
              </div>
              
              <p className="text-3xl font-bold text-right leading-loose tracking-wider mb-5 text-emerald-950 Arabic-Font" style={{ fontFamily: 'Scheherazade New, sans-serif' }} dir="rtl">{doa.arabic}</p>
              <p className="text-emerald-800/80 italic mb-3 border-l-4 border-emerald-300 pl-3.5 text-sm md:text-base font-medium">{doa.latin}</p>
              <p className="text-emerald-950 font-bold bg-emerald-50/50 border border-emerald-100/40 p-4 rounded-2xl mb-5 text-sm md:text-base shadow-inner">{arti}</p>
              
              <button 
                onClick={() => playAudio(`doa_${doa.id}`, `/audio/doa/${doa.id}.mp3`)}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-b from-indigo-400 to-indigo-500 text-white py-3 rounded-2.5xl font-black shadow-md hover:brightness-105 active:scale-[0.98] active:translate-y-0.5 border-b-[4px] border-indigo-700 transition-all cursor-pointer focus:outline-none"
              >
                <Volume2 size={20} /> Dengarkan
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
