import { useState, useEffect } from 'react';
import { useAppStore } from './lib/store';
import { useTranslation, translations } from './lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, User, Check, Volume2, Gamepad2, Headphones, Sparkles, Download, Trash2, Key, LogOut } from 'lucide-react';
import { hijaiyahData } from './data/hijaiyah';
import { doaData } from './data/doa';
import { sholatData } from './data/sholat';
import { surahData } from './data/surah';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Header } from './components/Header';
import { HafalanView } from './components/HafalanView';
import { KuisView } from './components/KuisView';
import { HeroMascot } from './components/HeroMascot';
import { GameZoneView } from './components/GameZoneView';
import { countAudioCache, clearAudioCache, playAudio, fetchAndCacheAudio } from './lib/audioCache';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  });
}

function MainMenu({ setView }: { setView: (v: string) => void }) {
  const { currentUserUid, users, progress, getGameZoneStatus } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const userProgress = currentUserUid ? (progress[currentUserUid] || {}) : {};

  const totalPoints = Object.values(userProgress).reduce((acc, curr) => acc + curr.points, 0);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [cachedCount, setCachedCount] = useState(0);

  useEffect(() => {
    countAudioCache().then(setCachedCount);
  }, []);

  const gameZoneStatus = getGameZoneStatus();
  const isGameZoneUnlocked = gameZoneStatus?.unlocked;

  const startDownloadAll = async () => {
    const allRequests: {id: string, url: string}[] = [];
    hijaiyahData.forEach(d => allRequests.push({ id: `hijaiyah_${d.id}`, url: `/audio/hijaiyah/${d.id}.mp3` }));
    doaData.forEach(d => allRequests.push({ id: `doa_${d.id}`, url: `/audio/doa/${d.id}.mp3` }));
    sholatData.forEach(d => allRequests.push({ id: `sholat_${d.id}`, url: `/audio/sholat/${d.id}.mp3` }));
    surahData.forEach(d => allRequests.push({ id: `surah_${d.id}`, url: `/audio/surah/${d.id}.mp3` }));

    setTotalDownload(allRequests.length);
    setDownloadProgress(0);
    setIsDownloading(true);

    let count = 0;
    for (const req of allRequests) {
      try {
        await fetchAndCacheAudio(req.id, req.url);
      } catch (err) {
        console.error('Failed to download audio for:', req.id);
      }
      count++;
      setDownloadProgress(count);
    }
    setIsDownloading(false);
    toast.success('Audio siap offline!');
    countAudioCache().then(setCachedCount);
  };

  const kidEmoji = user?.uid === 'abeel' ? '🧑' : user?.uid === 'emier' ? '🧑' : '👧';
  const displayKidName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center flex-1 justify-start">
      {/* Dynamic Welcoming Card Banner */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="w-full bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border-4 border-white mb-8 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-color)]/5 rounded-full filter blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-5xl md:text-6xl bg-blue-50 p-3 rounded-2xl shadow-inner border border-blue-100 flex items-center justify-center select-none">{kidEmoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight leading-tight">
                Assalamu'alaikum, <span className="text-[var(--primary-color)]">{displayKidName}</span>! 👋
              </h1>
              <p className="text-gray-500 font-bold mt-1.5 text-sm md:text-base">
                Siap belajar mengaji dengan menyenangkan hari ini? Nyok!
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-1 min-w-40 bg-yellow-400/10 border-2 border-yellow-400/30 p-4 rounded-3xl shrink-0">
            <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-400/25 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase select-none">
              <Star className="fill-yellow-500 stroke-yellow-600 w-3.5 h-3.5" />
              <span>{t.points || "Poin Pinter"}</span>
            </div>
            <span className="text-3xl font-black text-yellow-600 tracking-tight">{totalPoints} p</span>
          </div>
        </div>

        {/* Action Offline Audio Section inside the safe padding */}
        <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex flex-col items-center w-full">
          {!isDownloading && cachedCount === 0 && (
            <button 
              id="btn-download-audio"
              onClick={startDownloadAll} 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold py-3 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs md:text-sm active:scale-95 transition-all cursor-pointer border-b-4 border-indigo-700"
            >
              <Download size={18} />
              Download Semua Audio untuk Belajar Offline
            </button>
          )}

          {isDownloading && (
            <div className="w-full max-w-sm bg-gray-50 border border-gray-100 p-4 rounded-2xl shadow-inner">
              <p className="text-[var(--primary-color)] font-extrabold mb-2 text-center text-xs md:text-sm">
                Mengunduh {downloadProgress} / {totalDownload} audio...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${(downloadProgress / totalDownload) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!isDownloading && cachedCount > 0 && (
            <div className="text-xs bg-green-50 text-green-700 px-4 py-1.5 rounded-full font-extrabold flex items-center gap-1.5 border border-green-200 animate-pulse">
              <span>🟢 {cachedCount} Audio terunduh, siap dipakai offline!</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Structured, Bouncy and Evenly Spaced Menu Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full pb-10">
        <MenuCard onClick={() => setView('hijaiyah')} color="bg-pink-500 border-pink-700 hover:bg-pink-400" title={t.menu_hijaiyah} icon={<Gamepad2 size={36} />} delay={0.05} />
        <MenuCard onClick={() => setView('kuis')} color="bg-rose-500 border-rose-700 hover:bg-rose-400" title={t.menu_kuis} icon={<Sparkles size={36} />} delay={0.1} />
        <MenuCard onClick={() => setView('hafalan')} color="bg-teal-500 border-teal-700 hover:bg-teal-400" title={t.menu_hafalan} icon={<Headphones size={36} />} delay={0.15} />
        <MenuCard onClick={() => setView('doa')} color="bg-blue-500 border-blue-700 hover:bg-blue-400" title={t.menu_doa} icon={<BookOpen size={36} />} delay={0.2} />
        <MenuCard onClick={() => setView('sholat')} color="bg-green-500 border-green-700 hover:bg-green-400" title={t.menu_sholat} icon={<Star size={36} />} delay={0.25} />
        <MenuCard onClick={() => setView('profile')} color="bg-purple-500 border-purple-700 hover:bg-purple-400" title={t.menu_profile} icon={<User size={36} />} delay={0.3} />
        {isGameZoneUnlocked ? (
          <MenuCard onClick={() => setView('gamezone')} color="bg-orange-500 border-orange-700 hover:bg-orange-400" title="Game Zone 🎮" icon={<Gamepad2 size={36} />} delay={0.35} />
        ) : (
          <MenuCard 
            id="locked-game-zone"
            onClick={() => toast.error("Game Zone masih terkunci. Selesaikan kuis dengan nilai minimal 80 ya!", { icon: '🔒' })} 
            color="bg-slate-300 border-slate-400 grayscale opacity-75 contrast-125" 
            title="Game Zone 🔒" 
            icon={<Gamepad2 size={36} className="text-slate-400" />} 
            delay={0.35} 
          />
        )}
      </div>
    </div>
  );
}

function MenuCard({ color, title, icon, onClick, delay, id }: any) {
  return (
    <motion.button
      id={id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-[2rem] shadow-lg flex flex-col items-center justify-center gap-3 text-white font-extrabold text-center text-sm md:text-base h-36 border-b-8 active:border-b-active active:translate-y-1 hover:brightness-105 transition-all duration-150 cursor-pointer select-none overflow-hidden pb-5",
        color
      )}
    >
      <div className="bg-white/20 p-2.5 rounded-2.5xl shadow-inner flex items-center justify-center">
        {icon}
      </div>
      <span className="leading-tight break-keep">{title}</span>
    </motion.button>
  );
}

function HijaiyahView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['hijaiyah'] : null;
  const completed = prog?.completedItems || [];
  const [activeChar, setActiveChar] = useState<string | null>(null);

  const handleCharClick = async (hija: any) => {
    setActiveChar(hija.id);
    
    // play audio
    await playAudio(`hijaiyah_${hija.id}`, `/audio/hijaiyah/${hija.id}.mp3`);
    
    if (!completed.includes(hija.id)) {
      updateProgress('hijaiyah', hija.id, 10);
      triggerConfetti();
    }
    
    setTimeout(() => setActiveChar(null), 600);
  };

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_hijaiyah} onBack={onBack} />
      <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mt-6">
        {hijaiyahData.map((hija, i) => {
          const isDone = completed.includes(hija.id);
          const isActive = activeChar === hija.id;
          
          return (
            <motion.button
              key={hija.id}
              initial={{ scale: 0, opacity: 0, y: 50, rotate: -20 }}
              animate={
                isActive
                  ? { scale: [1, 1.3, 0.8, 1.1, 1], rotate: [0, -15, 15, -5, 0], opacity: 1, y: 0 }
                  : { scale: 1, opacity: 1, y: 0, rotate: 0 }
              }
              transition={{ 
                type: isActive ? "keyframes" : "spring",
                duration: isActive ? 0.6 : 0.8,
                bounce: isActive ? undefined : 0.6,
                delay: isActive ? 0 : i * 0.05 
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.8, rotate: -10 }}
              onClick={() => handleCharClick(hija)}
              className={cn(
                "relative aspect-square rounded-3xl shadow-lg border-b-4 flex flex-col items-center justify-center p-2 text-white overflow-hidden group",
                hija.color,
                hija.color.replace('bg-', 'border-').replace('400', '600'),
                isActive ? "z-10" : "z-0"
              )}
            >
              {isDone && (
                <div className="absolute top-2 right-2 bg-white/40 p-1 rounded-full">
                  <Check size={16} className="text-white" />
                </div>
              )}
              <span className="text-5xl md:text-6xl font-black drop-shadow-md leading-none Arabic-Font" style={{ fontFamily: 'sans-serif' }}>
                {hija.arabic}
              </span>
              <span className="text-lg md:text-xl font-bold mt-2 tracking-wide capitalize">
                {hija.name}
              </span>
              
              <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function DoaView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['doa'] : null;
  const completed = prog?.completedItems || [];

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_doa} onBack={onBack} />
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
                className="flex items-center justify-center gap-2 w-full bg-blue-100 text-blue-600 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
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

function SholatView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['sholat'] : null;
  const completed = prog?.completedItems || [];

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_sholat} onBack={onBack} />
      <div className="p-4 max-w-3xl mx-auto space-y-6 mt-4">
        {sholatData.map((sholat, i) => {
          const isDone = completed.includes(sholat.id);
          const title = sholat.title;
          
          return (
            <motion.div
              key={sholat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-[var(--primary-color)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[var(--primary-color)]">{title}</h3>
                {!isDone && (
                   <button 
                     onClick={() => {
                       updateProgress('sholat', sholat.id, 15);
                       triggerConfetti();
                     }}
                     className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-green-600 active:scale-95"
                   >
                     Selesai (+15)
                   </button>
                )}
                {isDone && <Check size={24} className="text-green-500" />}
              </div>
              <p className="text-2xl font-bold text-right leading-loose mb-2" dir="rtl">{sholat.arabic}</p>
              <p className="text-gray-600 italic border-l-4 border-gray-200 pl-3 mb-2">{sholat.latin}</p>
              <p className="text-gray-700 font-medium bg-gray-50 p-4 rounded-xl mb-4">{sholat.translation}</p>
              
              <button 
                onClick={() => playAudio(`sholat_${sholat.id}`, `/audio/sholat/${sholat.id}.mp3`)}
                className="flex items-center justify-center gap-2 w-full bg-blue-100 text-blue-600 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
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

function ProfileView({ onBack, onLogout }: { onBack: () => void, onLogout: () => void }) {
  const { currentUserUid, users, updateProfile, logout, quizHistory, getGameZoneStatus, lockGameZone } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  
  const [cachedCount, setCachedCount] = useState(0);

  useEffect(() => {
    countAudioCache().then(setCachedCount);
  }, []);

  const handleClearCache = async () => {
    await clearAudioCache();
    const c = await countAudioCache();
    setCachedCount(c);
    toast.success('Cache audio berhasil dihapus!');
  };

  const userHistory = currentUserUid ? (quizHistory[currentUserUid] || []) : [];
  const status = getGameZoneStatus();
  const isUnlocked = status?.unlocked;
  const lastQuiz = userHistory[0];
  const totalQuizzes = userHistory.length;

  return (
    <div className="flex-1">
      <Header title={t.menu_profile} onBack={onBack} />
      
      <div className="max-w-md mx-auto p-4 md:p-6 mt-4 pb-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-[var(--primary-color)] rounded-full mx-auto flex items-center justify-center text-white text-4xl shadow-inner mb-6">
            <User size={48} />
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Nama Profile</label>
              <input 
                type="text" 
                value={user?.name || ''} 
                onChange={e => updateProfile({ name: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:border-[var(--primary-color)] transition-colors"
              />
            </div>

            <div className="pt-4 border-t-2 border-dashed border-gray-200">
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Headphones size={16} /> Offline Cache : {cachedCount}</label>
              <button 
                onClick={handleClearCache}
                className="flex items-center justify-center gap-2 w-full bg-red-100 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-200 active:scale-95 transition-all"
              >
                <Trash2 size={18}/> Hapus Semua Cache
              </button>
            </div>
            
            <div className="pt-4 border-t-2 border-dashed border-gray-200">
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Tema</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {['default', 'ocean', 'forest', 'sunset', 'galaxy', 'candy', 'sunshine', 'royal'].map(th => {
                  const isActive = user?.theme === th;
                  return (
                    <button
                      key={th}
                      onClick={() => updateProfile({ theme: th as any })}
                      className={cn(
                        "py-3 rounded-xl font-bold transition-all border-2",
                        isActive ? "border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-[var(--primary-color)]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {(t as any)[`theme_${th}`] || th}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parent Control Block */}
            <div className="pt-6 mt-6 border-t-2 border-dashed border-gray-200">
              <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">🔒 Parent Control</label>
              
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500">Status Game Zone:</span>
                  {isUnlocked ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-black text-xs flex items-center gap-1">
                      🟢 Terbuka ({status ? Math.max(0, Math.ceil((status.unlockUntil - Date.now()) / 60000)) : 0} m)
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full font-black text-xs">
                      🔴 Terkunci
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="font-bold text-gray-500">Total Kuis Selesai:</span>
                  <span className="font-extrabold text-gray-800">{totalQuizzes} Sesi</span>
                </div>

                {lastQuiz && (
                  <div className="border-t border-gray-100 pt-2 space-y-1">
                    <span className="font-bold text-gray-500 block mb-1">Kuis Terakhir:</span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Skor: <span className="font-bold">{lastQuiz.scorePercent}%</span></span>
                      <span className="text-gray-600">Reward: <span className="font-bold text-blue-600">{lastQuiz.rewardMinutes} m</span></span>
                      <span className={cn("font-bold px-2 py-0.5 rounded", lastQuiz.passed ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50")}>
                        {lastQuiz.passed ? "LULUS" : "GAGAL"}
                      </span>
                    </div>
                  </div>
                )}

                {isUnlocked && (
                  <button 
                    onClick={() => {
                      lockGameZone();
                      toast.success("Game Zone dikunci manual!", { icon: '🔒' });
                    }}
                    className="w-full mt-2 bg-red-100 text-red-600 hover:bg-red-200 py-3 rounded-xl font-bold transition-all border border-red-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    🔒 Lock Game Zone Sekarang
                  </button>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-gray-200">
              <button 
                onClick={() => {
                  logout();
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 active:scale-95 transition-all"
              >
                <LogOut size={20}/> Ganti Anak
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { currentUserUid, users, login, landingTheme, setLandingTheme } = useAppStore();
  const [localTheme, setLocalTheme] = useState(landingTheme);

  useEffect(() => {
    document.body.className = `theme-${localTheme}`;
    setLandingTheme(localTheme);
  }, [localTheme, setLandingTheme]);

  const defaultT = translations.id as any;

  const kids = [
    { uid: 'abeel', name: 'Abeel', color: 'bg-blue-500 border-blue-700 hover:bg-blue-400', emoji: '🧑' },
    { uid: 'emier', name: 'Emier', color: 'bg-green-500 border-green-700 hover:bg-green-400', emoji: '🧑' },
    { uid: 'emily', name: 'Emily', color: 'bg-pink-500 border-pink-700 hover:bg-pink-400', emoji: '👧' }
  ];

  const handleLogin = (uid: string, name: string) => {
    login(uid, name);
    onEnter();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 text-center select-none w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-2xl px-2.5"
      >
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-4 border-white text-center w-full relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-orange-400 to-emerald-400" />
          
          <HeroMascot />
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 tracking-tight leading-tight px-2">
            Siapa yang mau belajar?
          </h1>
          
          <div className="mb-8 w-full max-w-xl">
            <h3 className="text-gray-400 font-extrabold uppercase tracking-widest mb-3.5 text-xs">Pilih Tema Dulu Yuk! 🎨</h3>
            <div className="flex flex-wrap justify-center gap-2 px-1 max-w-md mx-auto">
              {['default', 'ocean', 'forest', 'sunset', 'galaxy', 'candy', 'sunshine', 'royal'].map(th => {
                const isActive = localTheme === th;
                const activeBorderAndColor = `border-[var(--primary-color)] bg-[var(--primary-color)] text-white shadow-md scale-105`;
                const inactiveBorderAndColor = `border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:border-gray-300`;
                
                return (
                  <button
                    key={th}
                    onClick={() => setLocalTheme(th as any)}
                    className={cn(
                      "px-3.5 py-1.5 text-xs md:text-sm rounded-full font-bold transition-all border-2 cursor-pointer select-none focus:outline-none flex items-center justify-center gap-1.5",
                      isActive ? activeBorderAndColor : inactiveBorderAndColor
                    )}
                  >
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full shrink-0 border border-black/10 inline-block",
                      th === 'default' ? 'bg-blue-400' :
                      th === 'ocean' ? 'bg-cyan-400' :
                      th === 'forest' ? 'bg-emerald-400' :
                      th === 'sunset' ? 'bg-orange-400' :
                      th === 'galaxy' ? 'bg-violet-400' :
                      th === 'candy' ? 'bg-pink-400' :
                      th === 'sunshine' ? 'bg-yellow-400' :
                      'bg-indigo-400'
                    )} />
                    <span>{(defaultT)[`theme_${th}`] || th}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 w-full max-w-xl mt-2 px-1">
            {kids.map((kid, i) => (
              <motion.button
                key={kid.uid}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLogin(kid.uid, kid.name)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl text-white shadow-lg border-b-[8px] active:border-b-active active:translate-y-1 hover:brightness-105 transition-all duration-150 cursor-pointer group h-36 focus:outline-none select-none",
                  kid.color
                )}
              >
                <span className="text-5xl mb-2 group-hover:scale-110 transition-transform select-none">{kid.emoji}</span>
                <span className="text-xl font-extrabold leading-none">{kid.name}</span>
              </motion.button>
            ))}
          </div>

          {currentUserUid && users[currentUserUid] && (
             <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 flex justify-center w-full max-w-xl">
               <button 
                 onClick={onEnter}
                 className="bg-[var(--primary-color)] text-white px-6 py-3.5 rounded-2xl font-extrabold shadow-lg border-b-4 border-black/10 hover:scale-103 active:scale-97 active:border-b-0 active:translate-y-1 transition-all text-sm md:text-base flex items-center gap-2 cursor-pointer focus:outline-none"
               >
                 Lanjut belajar sebagai <span className="underline font-black">{users[currentUserUid].name}</span> &rarr;
               </button>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const { initializeApp, isReady, currentUserUid, users } = useAppStore();
  const [view, setView] = useState('landing');

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);
  
  useEffect(() => {
    if (view !== 'landing') {
       const user = currentUserUid ? users[currentUserUid] : null;
       if (user?.theme) {
         document.body.className = `theme-${user.theme}`;
       }
    }
  }, [currentUserUid, users, view]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Star className="text-blue-500 w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex-1 flex flex-col"
        >
          {view === 'landing' && <LandingPage onEnter={() => setView('menu')} />}
          {view === 'menu' && <MainMenu setView={setView} />}
          {view === 'hijaiyah' && <HijaiyahView onBack={() => setView('menu')} />}
          {view === 'kuis' && <KuisView onBack={() => setView('menu')} onGoToGameZone={() => setView('gamezone')} />}
          {view === 'hafalan' && <HafalanView onBack={() => setView('menu')} />}
          {view === 'profile' && <ProfileView onBack={() => setView('menu')} onLogout={() => setView('landing')} />}
          {view === 'doa' && <DoaView onBack={() => setView('menu')} />}
          {view === 'sholat' && <SholatView onBack={() => setView('menu')} />}
          {view === 'gamezone' && <GameZoneView onBack={() => setView('menu')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
