import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { Header } from './Header';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, Sparkles, Gamepad2, Star } from 'lucide-react';
import { playAudio } from '../lib/audioCache';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

function triggerConfettiSpace() {
  confetti({
    particleCount: 65,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#38bdf8', '#818cf8', '#ec4899']
  });
}

export function GameZoneView() {
  const navigate = useNavigate();
  const { currentUserUid, users, getGameZoneStatus, lockGameZone } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;

  const [currentStatus, setCurrentStatus] = useState(() => getGameZoneStatus());
  const [timeLeftStr, setTimeLeftStr] = useState("00:00");
  const [score, setScore] = useState(0);
  const [starPos, setStarPos] = useState({ top: '50%', left: '50%' });
  const [bouncing, setBouncing] = useState(false);

  // Monitor the lock and timer state
  useEffect(() => {
    const updateTimer = () => {
      const status = getGameZoneStatus();
      setCurrentStatus(status);
      if (status && status.unlocked) {
        const diff = status.unlockUntil - Date.now();
        if (diff <= 0) {
          lockGameZone();
          setCurrentStatus(getGameZoneStatus());
          toast("Waktu bermain habis. Yuk belajar lagi dulu.", { icon: '⏰' });
        } else {
          const totalSeconds = Math.max(0, Math.floor(diff / 1000));
          const mins = Math.floor(totalSeconds / 60);
          const secs = totalSeconds % 60;
          setTimeLeftStr(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [getGameZoneStatus, lockGameZone]);

  const handleTapStar = () => {
    setScore(prev => {
      const next = prev + 1;
      if (next % 10 === 0) {
        triggerConfettiSpace();
        toast.success(`Hebat! ${next} Tap Bintang!`, { icon: '🌟' });
      }
      return next;
    });

    setBouncing(true);
    setTimeout(() => setBouncing(false), 200);

    // Randomize star coordinates within the center box
    const randomTop = `${Math.floor(Math.random() * 60) + 20}%`;
    const randomLeft = `${Math.floor(Math.random() * 70) + 15}%`;
    setStarPos({ top: randomTop, left: randomLeft });

    // Fun sound feedback
    playAudio('game_tap', '/audio/kuis/correct.mp3');
  };

  if (!currentStatus || !currentStatus.unlocked) {
    return <LockedGameZone onBack={() => navigate('/menu')} />;
  }

  return (
    <ActiveGameZone
      timeLeftStr={timeLeftStr}
      score={score}
      starPos={starPos}
      bouncing={bouncing}
      handleTapStar={handleTapStar}
      lockGameZone={lockGameZone}
      onBack={() => navigate('/menu')}
    />
  );
}

function LockedGameZone({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 pb-10 flex flex-col bg-emerald-50/30">
      <Header title="Game Zone Terkunci" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full mt-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="clay-card p-8 md:p-10 border-[6px] border-white/95 bg-white/90 text-center w-full relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-gray-100/50 rounded-full filter blur-xl opacity-50 -translate-x-10 -translate-y-10" />
          
          <div className="w-24 h-24 bg-gradient-to-b from-orange-400 to-orange-500 text-white rounded-[2rem] mx-auto flex items-center justify-center shadow-lg mb-6 border-b-[6px] border-orange-700 animate-bounce">
            <Lock size={42} className="stroke-[3px]" />
          </div>

          <h2 className="text-3xl font-black text-emerald-950 mb-4 leading-tight">
            Game Zone Terkunci 🔒
          </h2>
          
          <p className="text-emerald-800/80 font-bold mb-8 text-base leading-relaxed">
            Selesaikan kuis dengan nilai minimal <span className="text-emerald-600 font-black">80%</span> untuk membuka waktu bermain yang seru!
          </p>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-b from-emerald-400 to-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-md border-b-[6px] border-emerald-700 hover:brightness-105 active:scale-95 transition-all text-lg cursor-pointer flex items-center justify-center gap-2 focus:outline-none"
          >
            <ArrowLeft size={20} className="stroke-[3px]" /> Kembali Belajar
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function ActiveGameZone({ 
  timeLeftStr, score, starPos, bouncing, handleTapStar, lockGameZone, onBack 
}: any) {
  return (
    <div className="flex-1 pb-10 flex flex-col min-h-screen bg-emerald-50/30">
      <Header title="🎮 Game Zone" onBack={onBack} />
      
      <div className="max-w-4xl mx-auto w-full px-4 mt-6 flex-1 flex flex-col">
        
        {/* Game Stats and Countdown Overlay */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="clay-card p-4 border-[4px] border-white/95 bg-white/90 flex flex-col items-center justify-center shadow-sm">
            <Gamepad2 className="text-emerald-600 mb-1" size={24} />
            <span className="text-[10px] text-emerald-800 font-black uppercase tracking-wider">Skor Game</span>
            <span className="text-2xl font-black text-emerald-900">{score}</span>
          </div>

          <div className="bg-gradient-to-b from-amber-400 to-amber-500 text-emerald-950 p-4 rounded-2.5xl shadow-md border-b-[6px] border-amber-700 flex flex-col items-center justify-center">
            <span className="text-[10px] text-emerald-950/70 font-black tracking-wider uppercase">Sisa Waktu</span>
            <span className="text-2xl font-black tracking-widest">{timeLeftStr}</span>
          </div>

          <button 
            onClick={() => {
              lockGameZone();
              toast("Kamu selesai bermain. Kembali belajar sekarang!", { icon: '📖' });
            }}
            className="bg-gradient-to-b from-rose-400 to-rose-500 text-white p-4 rounded-2.5xl shadow-md border-b-[6px] border-rose-700 active:scale-95 hover:brightness-105 transition-all flex flex-col items-center justify-center font-black text-xs cursor-pointer focus:outline-none"
          >
            🔒 Selesai Main
          </button>
        </div>

        {/* Space Outer Boundary Play Field */}
        <div className="flex-1 min-h-[380px] relative bg-slate-900 rounded-[2.5rem] shadow-2xl border-[6px] border-white overflow-hidden flex flex-col justify-between p-4 mb-4">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-black pointer-events-none opacity-95" />
          <div className="absolute top-4 left-6 text-white/30 text-xs font-black tracking-widest pointer-events-none flex items-center gap-1.5 select-none">
            <Sparkles size={12} className="animate-spin text-emerald-400" /> JALUR BINTANG ANGKASA
          </div>

          <div className="absolute top-10 right-10 text-3xl pointer-events-none animate-bounce select-none">🌙</div>
          <div className="absolute bottom-10 left-12 text-2xl pointer-events-none opacity-40 select-none">🪐</div>

          <div className="absolute inset-0">
            <motion.button
              onClick={handleTapStar}
              animate={bouncing ? { scale: 1.45 } : { y: [0, -8, 0] }}
              transition={bouncing ? { duration: 0.1 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: starPos.top,
                left: starPos.left,
                transform: 'translate(-50%, -50%)',
              }}
              className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-amber-350 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_35px_#fbbf24] hover:brightness-110 active:scale-90 transition-all border-4 border-white cursor-pointer z-10 select-none text-4xl md:text-5xl"
            >
              ⭐
            </motion.button>
          </div>

          <div className="w-full text-center text-emerald-100/70 pointer-events-none text-xs md:text-sm font-black tracking-wide uppercase py-2.5 bg-white/5 backdrop-blur-sm rounded-2xl mt-auto border border-white/5 select-none">
            Ketuk Bintang Emas yang melayang untuk menambah skor! 🌟
          </div>
        </div>

      </div>
    </div>
  );
}
