import { useState, useEffect } from 'react';
import { useAppStore } from './lib/store';
import { useTranslation } from './lib/i18n';
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
import { checkVynaaKey, generateTtsAudio } from './lib/vynaa';
import { countAudioCache, clearAudioCache, saveAudioToCache, playAudio } from './lib/audioCache';
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
  const { currentUserUid, users, progress, globalVynaaKey } = useAppStore();
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

  const startDownloadAll = async () => {
    if (!globalVynaaKey) {
       toast.error('API Key VYNAA belum diatur!');
       return;
    }
    
    const allRequests: {id: string, text: string, lang: 'ar' | 'id'}[] = [];
    hijaiyahData.forEach(d => allRequests.push({ id: `hijaiyah_${d.id}`, text: d.audioText, lang: 'ar' }));
    doaData.forEach(d => allRequests.push({ id: `doa_${d.id}`, text: d.audioText, lang: 'ar' }));
    sholatData.forEach(d => allRequests.push({ id: `sholat_${d.id}`, text: d.audioText, lang: 'ar' }));
    surahData.forEach(d => allRequests.push({ id: `surah_${d.id}`, text: d.audioText, lang: 'ar' }));

    setTotalDownload(allRequests.length);
    setDownloadProgress(0);
    setIsDownloading(true);

    let count = 0;
    for (const req of allRequests) {
      try {
        const audioBlob = await generateTtsAudio({ ...req, apiKey: globalVynaaKey });
        await saveAudioToCache(req.id, audioBlob);
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

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 space-y-8 flex-1 min-h-[calc(100vh-80px)]">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mt-8 w-full max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-black text-[var(--primary-color)] drop-shadow-md tracking-tight">
          NgajiYuk!
        </h1>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-6 py-2 rounded-full font-bold shadow-sm">
          <Star className="fill-current" />
          <span className="text-lg">{totalPoints} {t.points}</span>
        </div>
        
        {globalVynaaKey && !isDownloading && cachedCount === 0 && (
          <div className="mt-6">
            <button onClick={startDownloadAll} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all">
               <Download size={20} />
               Download Semua Audio Offline
            </button>
          </div>
        )}
        {isDownloading && (
           <div className="mt-6 bg-white p-4 rounded-3xl shadow max-w-md mx-auto">
             <p className="text-[var(--primary-color)] font-bold mb-2 text-center">Mengunduh {downloadProgress} / {totalDownload} audio...</p>
             <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
               <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(downloadProgress / totalDownload) * 100}%` }}></div>
             </div>
           </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl pb-10">
        <MenuCard onClick={() => setView('hijaiyah')} color="bg-pink-500" title={t.menu_hijaiyah} icon={<Gamepad2 size={40} />} delay={0.1} />
        <MenuCard onClick={() => setView('kuis')} color="bg-rose-500" title={t.menu_kuis} icon={<Sparkles size={40} />} delay={0.2} />
        <MenuCard onClick={() => setView('hafalan')} color="bg-teal-500" title={t.menu_hafalan} icon={<Headphones size={40} />} delay={0.3} />
        <MenuCard onClick={() => setView('doa')} color="bg-blue-500" title={t.menu_doa} icon={<BookOpen size={40} />} delay={0.4} />
        <MenuCard onClick={() => setView('sholat')} color="bg-green-500" title={t.menu_sholat} icon={<Star size={40} />} delay={0.5} />
        <MenuCard onClick={() => setView('profile')} color="bg-purple-500" title={t.menu_profile} icon={<User size={40} />} delay={0.6} />
      </div>
    </div>
  );
}

function MenuCard({ color, title, icon, onClick, delay }: any) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-3 text-white font-bold text-center text-lg md:text-xl h-40 border-b-8 active:border-b-0 active:translate-y-2 transition-all",
        color,
        color.replace('bg-', 'border-').replace('500', '700')
      )}
    >
      <div className="bg-white/20 p-3 rounded-full">
        {icon}
      </div>
      <span className="leading-tight">{title}</span>
    </motion.button>
  );
}

function HijaiyahView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users, progress, updateProgress, globalVynaaKey } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['hijaiyah'] : null;
  const completed = prog?.completedItems || [];
  const [activeChar, setActiveChar] = useState<string | null>(null);

  const handleCharClick = async (hija: any) => {
    setActiveChar(hija.id);
    
    // play audio
    await playAudio(`hijaiyah_${hija.id}`, hija.audioText, 'ar', globalVynaaKey);
    
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
  const { currentUserUid, users, progress, updateProgress, globalVynaaKey } = useAppStore();
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
                onClick={() => playAudio(`doa_${doa.id}`, doa.audioText, 'ar', globalVynaaKey)}
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
  const { currentUserUid, users, progress, updateProgress, globalVynaaKey } = useAppStore();
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
                onClick={() => playAudio(`sholat_${sholat.id}`, sholat.audioText, 'ar', globalVynaaKey)}
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

function ProfileView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users, updateProfile, globalVynaaKey, setGlobalVynaaKey, logout } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  
  const [apiKeyInput, setApiKeyInput] = useState(globalVynaaKey);
  const [isChecking, setIsChecking] = useState(false);
  
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

  const handleSaveKey = async () => {
    if (!apiKeyInput) {
       setGlobalVynaaKey('');
       toast.success('API Key dihapus.');
       return;
    }
    setIsChecking(true);
    const valid = await checkVynaaKey(apiKeyInput);
    setIsChecking(false);
    if (valid) {
      setGlobalVynaaKey(apiKeyInput);
      toast.success('API Key VYNAA aktif!');
    } else {
      toast.error('API Key gagal / tidak valid');
    }
  };

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
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Key size={16}/> API Key VYNAA TTS
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="Masukkan API Key"
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[var(--primary-color)]"
                />
                <button 
                  onClick={handleSaveKey}
                  disabled={isChecking}
                  className="bg-blue-500 text-white px-4 rounded-xl font-bold shadow hover:bg-blue-600 disabled:opacity-50"
                >
                  {isChecking ? 'Cek...' : 'Simpan'}
                </button>
              </div>
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

            <div className="pt-6 mt-6 border-t-2 border-gray-200">
              <button 
                onClick={logout}
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

export default function App() {
  const { initializeApp, isReady, currentUserUid, users, login } = useAppStore();
  const [view, setView] = useState('menu');

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);
  
  useEffect(() => {
    const user = currentUserUid ? users[currentUserUid] : null;
    if (user?.theme) {
      document.body.className = `theme-${user.theme}`;
    }
  }, [currentUserUid, users]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Star className="text-blue-500 w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  if (!currentUserUid) {
    const kids = [
      { uid: 'abeel', name: 'Abeel', color: 'bg-blue-500', emoji: '🧑' },
      { uid: 'emier', name: 'Emier', color: 'bg-green-500', emoji: '🧑' },
      { uid: 'emily', name: 'emily', color: 'bg-pink-500', emoji: '👧' }
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-[#eff6ff] p-6 text-center">
        <Toaster position="top-center" />
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-full max-w-3xl"
        >
          <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border-4 border-white/50">
            <div className="bg-blue-100 p-6 rounded-full inline-block mb-8 text-blue-500 shadow-inner">
              <BookOpen size={64} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 tracking-tight">Siapa yang mau belajar?</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
               {kids.map((kid, i) => (
                 <motion.button
                   key={kid.uid}
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: i * 0.1 }}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => login(kid.uid, kid.name)}
                   className={cn(
                     "flex flex-col items-center justify-center p-8 rounded-3xl text-white shadow-xl border-b-[8px] active:border-b-0 active:translate-y-2 transition-all group",
                     kid.color,
                     kid.color.replace('bg-', 'border-').replace('500', '700')
                   )}
                 >
                   <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">{kid.emoji}</span>
                   <span className="text-2xl font-black">{kid.name}</span>
                 </motion.button>
               ))}
            </div>
          </div>
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
          {view === 'menu' && <MainMenu setView={setView} />}
          {view === 'hijaiyah' && <HijaiyahView onBack={() => setView('menu')} />}
          {view === 'kuis' && <KuisView onBack={() => setView('menu')} />}
          {view === 'hafalan' && <HafalanView onBack={() => setView('menu')} />}
          {view === 'profile' && <ProfileView onBack={() => setView('menu')} />}
          {view === 'doa' && <DoaView onBack={() => setView('menu')} />}
          {view === 'sholat' && <SholatView onBack={() => setView('menu')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
