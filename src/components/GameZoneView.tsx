import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowLeft, Sparkles, Gamepad2, Trophy } from 'lucide-react';
import { playAudio } from '../lib/audioCache';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

function triggerConfettiSpace() {
  confetti({
    particleCount: 60,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#38bdf8', '#818cf8', '#ec4899']
  });
}

export default function GameZoneView() {
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
    <div className="flex-1 pb-10 flex flex-col">
      <Header title="Game Zone terkunci" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full mt-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl border-4 border-white text-center w-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-gray-100 rounded-full filter blur-xl opacity-50 -translate-x-10 -translate-y-10" />
          
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-lg mb-6 border-b-4 border-red-200">
            <Lock size={48} className="animate-pulse" />
          </div>

          <h2 className="text-3xl font-black text-gray-800 mb-4 leading-tight">
            Game Zone Terkunci 🔒
          </h2>
          
          <p className="text-gray-500 font-medium mb-8 text-base">
            Selesaikan kuis dengan nilai minimal <span className="font-bold text-blue-500">80%</span> untuk membuka waktu bermain yang seru!
          </p>

          <button
            onClick={onBack}
            className="w-full bg-[var(--primary-color)] text-white px-8 py-4 rounded-2xl font-black shadow-lg border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 hover:scale-[1.02] transition-all text-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> Kembali Belajar
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
    <div className="flex-1 pb-10 flex flex-col min-h-screen bg-gray-50">
      <Header title="🎮 Game Zone" onBack={onBack} />
      
      <div className="max-w-4xl mx-auto w-full px-4 mt-4 flex-1 flex flex-col">
        
        {/* Game Stats and Countdown Overlay */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-orange-500 flex flex-col items-center justify-center">
            <Gamepad2 className="text-orange-500 mb-1" size={20} />
            <span className="text-xs text-gray-500 font-bold">Skor Game</span>
            <span className="text-xl font-black text-gray-800">{score}</span>
          </div>

          <div className="bg-orange-500 text-white p-4 rounded-2xl shadow-md border-b-4 border-orange-700 flex flex-col items-center justify-center">
            <span className="text-xs text-orange-100 font-black tracking-wider uppercase">Sisa Waktu</span>
            <span className="text-2xl font-black tracking-widest">{timeLeftStr}</span>
          </div>

          <button 
            onClick={() => {
              lockGameZone();
              toast("Kamu selesai bermain. Kembali belajar sekarang!", { icon: '📖' });
            }}
            className="bg-red-50 text-red-500 p-4 rounded-2xl shadow-md border border-red-200 active:translate-y-1 transition-all flex flex-col items-center justify-center font-bold text-xs hover:bg-red-100 cursor-pointer"
          >
            🔒 Selesai Main
          </button>
        </div>

        {/* Space Outer Boundary Play Field */}
        <div className="flex-1 min-h-[350px] relative bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden flex flex-col justify-between p-4">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black pointer-events-none" />
          <div className="absolute top-4 left-6 text-white/30 text-xs font-mono pointer-events-none flex items-center gap-1">
            <Sparkles size={12} className="animate-spin" /> AREA LUAR ANGKASA
          </div>

          <div className="absolute top-10 right-10 text-xl pointer-events-none animate-bounce">🌙</div>
          <div className="absolute bottom-10 left-12 text-sm pointer-events-none opacity-40">🪐</div>

          <div className="absolute inset-0">
            <motion.button
              onClick={handleTapStar}
              animate={bouncing ? { scale: 1.4 } : { y: [0, -6, 0] }}
              transition={bouncing ? { duration: 0.1 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: starPos.top,
                left: starPos.left,
                transform: 'translate(-50%, -50%)',
              }}
              className="w-16 h-16 md:w-20 md:h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-[0_0_30px_#f59e0b] hover:bg-yellow-300 active:scale-90 transition-all border-4 border-white cursor-pointer z-10 select-none"
            >
              ⭐
            </motion.button>
          </div>

          <div className="w-full text-center text-white/60 pointer-events-none text-xs md:text-sm font-semibold tracking-wider uppercase py-2 bg-black/20 backdrop-blur-sm rounded-full mt-auto">
            Kejar dan Tap Bintang Emas untuk menambah skor! 🌟
          </div>
        </div>

      </div>
    </div>
  );
}
