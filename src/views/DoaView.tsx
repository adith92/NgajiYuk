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
    <div className="flex-1 pb-10">
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
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-[var(--primary-color)] relative"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[var(--primary-color)]">{title}</h3>
                {!isDone ? (
                   <button 
                     onClick={() => {
                        updateProgress('doa', doa.id, 20);
                        triggerConfetti();
                     }}
                     className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-green-600 active:scale-95"
                   >
                     Hafal (+20)
                   </button>
                ) : (
                  <div className="flex items-center gap-1 text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <Check size={18} /> Hafal
                  </div>
                )}
              </div>
              
              <p className="text-3xl font-bold text-right leading-loose tracking-wider mb-4" dir="rtl">{doa.arabic}</p>
              <p className="text-gray-500 italic mb-2 border-l-4 border-gray-300 pl-3">{doa.latin}</p>
              <p className="text-gray-700 font-medium bg-gray-50 p-4 rounded-xl mb-4">{arti}</p>
              
              <button 
                onClick={() => playAudio(`doa_${doa.id}`, `/audio/doa/${doa.id}.mp3`)}
                className="flex items-center justify-center gap-2 w-full bg-blue-100 text-blue-600 py-3 rounded-2xl font-bold active:scale-95 transition-transform clay-btn"
              >
                <Volume2 /> Dengarkan
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
