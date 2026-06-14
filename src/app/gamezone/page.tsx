"use client";

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Sparkles, Gamepad2, Star } from 'lucide-react';
import { playAudio } from '@/lib/audioCache';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

function triggerConfettiSpace() {
  confetti({
    particleCount: 65,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#38bdf8', '#818cf8', '#ec4899']
  });
}

export default function GameZonePage() {
  const router = useRouter();
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
          // Ideally use a toast here
          alert("Waktu bermain habis. Yuk belajar lagi dulu.");
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
    return <LockedGameZone onBack={() => router.push('/dashboard')} />;
  }

  return (
    <ActiveGameZone
      timeLeftStr={timeLeftStr}
      score={score}
      starPos={starPos}
      bouncing={bouncing}
      handleTapStar={handleTapStar}
      lockGameZone={lockGameZone}
      onBack={() => router.push('/dashboard')}
    />
  );
}

function LockedGameZone({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-10 flex flex-col">
      <Header title="Game Zone Terkunci" onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full mt-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-8 md:p-10 rounded-3xl text-center w-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100/40 rounded-full filter blur-3xl opacity-50 -translate-x-10 -translate-y-10" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 animate-bounce">
            <Lock size={42} />
          </div>

          <h2 className="text-3xl font-bold text-slate-700 mb-4 leading-tight relative z-10">
            Game Zone Terkunci 🔒
          </h2>
          
          <p className="text-slate-500 font-medium mb-8 text-base leading-relaxed relative z-10">
            Selesaikan kuis dengan nilai minimal <span className="text-emerald-500 font-bold">80%</span> untuk membuka waktu bermain yang seru!
          </p>

          <button
            onClick={onBack}
            className="w-full relative z-10 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all text-lg flex items-center justify-center gap-2"
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
    <div className="min-h-screen pb-10 flex flex-col">
      <Header title="🎮 Game Zone" onBack={onBack} />
      
      <div className="max-w-4xl mx-auto w-full px-6 mt-6 flex-1 flex flex-col">
        
        {/* Game Stats and Countdown */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center border border-sky-200">
            <Gamepad2 className="text-sky-500 mb-1" size={24} />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Skor Game</span>
            <span className="text-2xl font-bold text-slate-700">{score}</span>
          </div>

          <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-2xl border border-amber-200 flex flex-col items-center justify-center backdrop-blur-md">
            <span className="text-[10px] text-amber-600 font-bold tracking-wider uppercase">Sisa Waktu</span>
            <span className="text-2xl font-bold tracking-widest text-amber-500">{timeLeftStr}</span>
          </div>

          <button 
            onClick={() => {
              lockGameZone();
              alert("Kamu selesai bermain. Kembali belajar sekarang!");
            }}
            className="bg-rose-100 hover:bg-rose-200 p-4 rounded-2xl border border-rose-200 flex flex-col items-center justify-center font-bold text-xs text-rose-500 transition-all"
          >
            🔒 Selesai Main
          </button>
        </div>

        {/* Play Field */}
        <div className="flex-1 min-h-[400px] relative bg-slate-950/80 rounded-[2.5rem] shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col justify-between p-4 mb-4">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900/40 to-black pointer-events-none opacity-95" />
          
          <div className="absolute top-6 left-8 text-white/30 text-xs font-bold tracking-widest pointer-events-none flex items-center gap-1.5">
            <Sparkles size={14} className="animate-spin text-amber-400" /> JALUR BINTANG ANGKASA
          </div>

          <div className="absolute top-12 right-12 text-3xl pointer-events-none animate-pulse">🌙</div>
          <div className="absolute bottom-12 left-12 text-2xl pointer-events-none opacity-40">🪐</div>

          <div className="absolute inset-0">
            <motion.button
              onClick={handleTapStar}
              animate={bouncing ? { scale: 1.45 } : { y: [0, -10, 0] }}
              transition={bouncing ? { duration: 0.1 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: starPos.top,
                left: starPos.left,
                transform: 'translate(-50%, -50%)',
              }}
              className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_30px_#fbbf24] hover:scale-110 active:scale-90 transition-transform cursor-pointer z-10 text-4xl md:text-5xl"
            >
              ⭐
            </motion.button>
          </div>

          <div className="w-full text-center text-slate-300 pointer-events-none text-xs md:text-sm font-medium tracking-wide uppercase py-3 bg-white/5 backdrop-blur-md rounded-xl mt-auto border border-white/10">
            Ketuk Bintang Emas yang melayang untuk menambah skor! 🌟
          </div>
        </div>

      </div>
    </div>
  );
}
