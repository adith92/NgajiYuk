"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Gamepad2, Lock, Puzzle, Sparkles, Star, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";
import { playAudio } from "@/lib/audioCache";
import { useAppStore } from "@/lib/store";

function celebrate() {
  confetti({ particleCount: 65, spread: 60, origin: { y: 0.62 }, colors: ["#facc15", "#f59e0b", "#38bdf8", "#8b5cf6", "#ec4899"] });
}

export default function GameZonePage() {
  const router = useRouter();
  const { getGameZoneStatus, lockGameZone } = useAppStore();
  const [status, setStatus] = useState(() => getGameZoneStatus());
  const [timeLeft, setTimeLeft] = useState("00:00");
  const [score, setScore] = useState(0);
  const [starPosition, setStarPosition] = useState({ top: "50%", left: "50%" });
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const current = getGameZoneStatus();
      setStatus(current);
      if (!current?.unlocked) return;

      const remaining = current.unlockUntil - Date.now();
      if (remaining <= 0) {
        lockGameZone();
        setStatus(getGameZoneStatus());
        return;
      }

      const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
      setTimeLeft(`${Math.floor(totalSeconds / 60).toString().padStart(2, "0")}:${(totalSeconds % 60).toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 500);
    return () => window.clearInterval(interval);
  }, [getGameZoneStatus, lockGameZone]);

  useEffect(() => () => confetti.reset(), []);

  const tapStar = () => {
    setScore((value) => {
      const next = value + 1;
      if (next % 10 === 0) celebrate();
      return next;
    });
    setBouncing(true);
    window.setTimeout(() => setBouncing(false), 180);
    setStarPosition({ top: `${Math.floor(Math.random() * 58) + 20}%`, left: `${Math.floor(Math.random() * 68) + 16}%` });
    playAudio("game_tap", "/audio/kuis/correct.mp3");
  };

  if (!status?.unlocked) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-slate-950 pb-12 text-white">
        <Header title="Game Zone" onBack={() => router.push("/dashboard")} />
        <div className="mx-auto max-w-5xl px-4 pt-7 sm:px-6">
          <section className="purple-grid relative overflow-hidden rounded-[2rem] border border-violet-400/25 bg-gradient-to-br from-[#4314a5] via-[#281064] to-[#15083c] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.4)] sm:p-9">
            <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-white/15 bg-white/10 text-amber-300 shadow-[0_0_35px_rgba(250,204,21,0.2)]"><Lock size={42} /></div>
              <h1 className="mt-6 text-3xl font-black sm:text-4xl">Game Zone masih terkunci 🔒</h1>
              <p className="mt-3 text-sm font-medium leading-6 text-violet-200 sm:text-base">Selesaikan Kuis Hijaiyah dengan skor minimal 80% untuk mendapatkan waktu bermain.</p>
              <button type="button" onClick={() => router.push("/kuis")} className="kid-button mt-7 bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3.5 font-black text-[#2a1642] shadow-lg shadow-orange-500/25">🏆 Mulai Kuis Hijaiyah</button>
            </div>

            <div className="relative z-10 mt-9 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Puzzle, name: "Puzzle Hijaiyah", price: "Reward kuis" },
                { icon: Sparkles, name: "Kejar Bintang", price: "Reward kuis" },
                { icon: Gamepad2, name: "Memory Match", price: "Segera hadir" },
              ].map(({ icon: Icon, name, price }) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-white/7 p-5 text-center opacity-70 backdrop-blur">
                  <Icon className="mx-auto text-violet-200" size={30} />
                  <p className="mt-3 text-sm font-black">{name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-violet-300">{price}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-slate-950 pb-12 text-white">
      <Header title="🎮 Game Zone" progressLabel={`Sisa waktu ${timeLeft}`} onBack={() => router.push("/dashboard")} />
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <section className="purple-grid relative overflow-hidden rounded-[2rem] border border-violet-400/25 bg-gradient-to-br from-[#4314a5] via-[#281064] to-[#15083c] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:p-7">
          <div className="absolute -left-12 top-16 h-48 w-48 rounded-full bg-blue-500/18 blur-3xl" />
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-black"><Star className="fill-amber-400 text-amber-400" size={19} /> Skor {score}</div>
            <div className="flex h-12 items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/12 px-4 text-sm font-black text-amber-200"><Clock3 size={19} /> {timeLeft}</div>
            <button type="button" onClick={lockGameZone} className="kid-button h-12 border border-white/15 bg-white/10 px-5 text-sm text-violet-100 hover:bg-white/15"><Lock size={17} className="inline" /> Selesai main</button>
          </div>

          <div className="relative z-10 mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="relative min-h-[470px] overflow-hidden rounded-[1.8rem] border border-violet-300/20 bg-gradient-to-b from-[#12072d] via-[#160a39] to-[#071431] shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.25),transparent_40%)]" />
              <span className="absolute left-[12%] top-[15%] animate-twinkle text-lg">✦</span>
              <span className="absolute right-[18%] top-[24%] animate-twinkle text-amber-200">✦</span>
              <span className="absolute bottom-[16%] left-[25%] animate-twinkle text-sky-200">✧</span>
              <span className="absolute right-[12%] top-[12%] text-4xl">🌙</span>
              <span className="absolute bottom-[12%] left-[10%] text-3xl opacity-70">🪐</span>

              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-violet-200">Kejar Bintang</div>

              <motion.button type="button" onClick={tapStar} aria-label="Tangkap bintang" animate={bouncing ? { scale: 1.45, rotate: 12 } : { y: [0, -10, 0], rotate: [0, 3, 0] }} transition={bouncing ? { duration: 0.12 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: starPosition.top, left: starPosition.left, transform: "translate(-50%, -50%)" }} className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-orange-500 text-5xl shadow-[0_0_42px_rgba(250,204,21,0.65)]">⭐</motion.button>

              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-white/7 p-3 text-center text-xs font-bold text-violet-200 backdrop-blur">Ketuk bintang yang berpindah untuk menambah skor 🌟</div>
            </div>

            <aside className="space-y-3">
              <div className="rounded-[1.6rem] border border-white/12 bg-white/8 p-5 backdrop-blur">
                <Trophy className="text-amber-300" size={27} />
                <p className="mt-3 text-lg font-black">Target kecil</p>
                <p className="mt-1 text-xs font-medium leading-5 text-violet-200">Setiap 10 bintang akan memunculkan selebrasi.</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${(score % 10) * 10}%` }} /></div>
              </div>
              {[
                { icon: Puzzle, name: "Puzzle Hijaiyah", tag: "Segera hadir", bg: "from-sky-500/30 to-violet-500/25" },
                { icon: Gamepad2, name: "Memory Match", tag: "Segera hadir", bg: "from-pink-500/30 to-purple-500/25" },
              ].map(({ icon: Icon, name, tag, bg }) => (
                <div key={name} className={`rounded-[1.6rem] border border-white/12 bg-gradient-to-br p-5 opacity-75 ${bg}`}>
                  <div className="flex items-center justify-between"><Icon size={26} /><Lock size={17} /></div>
                  <p className="mt-4 text-sm font-black">{name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-violet-200">{tag}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
