import { useEffect, useState } from 'react';
import { useAppStore } from './lib/store';
import { useTranslation } from './lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, User, Settings, Check, ArrowLeft, Volume2, Gamepad2, Settings as SettingsIcon } from 'lucide-react';
import { hijaiyahData, doaData, sholatData } from './lib/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function MainMenu({ setView }: { setView: (v: string) => void }) {
  const { user, progress } = useAppStore();
  const t = useTranslation(user?.language);

  const totalPoints = Object.values(progress).reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 flex-1 min-h-screen">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl font-black text-[var(--primary-color)] drop-shadow-md tracking-tight">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-bold mt-2">{t.subtitle}</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-sm">
          <Star className="w-5 h-5 fill-current" />
          <span>{totalPoints} {t.points}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <MenuCard onClick={() => setView('hijaiyah')} color="bg-pink-500" title={t.menu_hijaiyah} icon={<Gamepad2 size={40} />} delay={0.1} />
        <MenuCard onClick={() => setView('doa')} color="bg-blue-500" title={t.menu_doa} icon={<BookOpen size={40} />} delay={0.2} />
        <MenuCard onClick={() => setView('sholat')} color="bg-green-500" title={t.menu_sholat} icon={<Star size={40} />} delay={0.3} />
        <MenuCard onClick={() => setView('profile')} color="bg-purple-500" title={t.menu_profile} icon={<User size={40} />} delay={0.4} />
      </div>
    </div>
  );
}

function MenuCard({ onClick, title, icon, color, delay }: any) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 text-white font-bold text-2xl h-48 border-b-8 active:border-b-0 active:translate-y-2 transition-all",
        color,
        color.replace('bg-', 'border-').replace('500', '700')
      )}
    >
      <div className="bg-white/20 p-4 rounded-full">
        {icon}
      </div>
      {title}
    </motion.button>
  );
}

function Header({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <div className="flex items-center p-4 bg-white/50 backdrop-blur shadow-sm sticky top-0 z-10">
      <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
        <ArrowLeft className="text-[var(--primary-color)]" size={24} />
      </button>
      <h2 className="text-2xl font-black text-gray-800 ml-4 flex-1 text-center pr-10">{title}</h2>
    </div>
  );
}

export default function App() {
  const { initializeApp, isReady, user, signIn } = useAppStore();
  const [view, setView] = useState('menu');

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);
  
  useEffect(() => {
    if (user?.theme) {
      document.body.className = `theme-${user.theme}`;
    }
  }, [user?.theme]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Star className="text-blue-500 w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#eff6ff] p-6 text-center">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6">
            <BookOpen size={64} className="text-blue-500" />
          </div>
          <h1 className="text-5xl font-black text-blue-500 drop-shadow-md mb-4">Ngaji Kids</h1>
          <p className="text-xl text-gray-600 font-bold mb-8">Belajar Agama yang Menyenangkan!</p>
          
          <button 
            onClick={signIn}
            className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-blue-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <User />
            Mulai Belajar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
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
          {view === 'profile' && <ProfileView onBack={() => setView('menu')} />}
          {view === 'doa' && <DoaView onBack={() => setView('menu')} />}
          {view === 'sholat' && <SholatView onBack={() => setView('menu')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const playAudio = (url: string) => {
  // Free SFX placeholder for letter sounds. We'll use SpeechSynthesis for generic or pre-recorded
  // For Arabic letters, if we had proper URLs, we'd use them.
  // Using a short beep as fallback if url isn't valid
  const audio = new Audio(url);
  audio.play().catch(() => {
    // Fallback: Web Speech API
    const msg = new SpeechSynthesisUtterance();
    msg.text = 'a'; // this is just a fallback
    msg.lang = 'ar-SA';
    window.speechSynthesis.speak(msg);
  });
};

function HijaiyahView({ onBack }: { onBack: () => void }) {
  const { user, progress, updateProgress } = useAppStore();
  const t = useTranslation(user?.language);
  const prog = progress['hijaiyah'];
  const completed = prog?.completedItems || [];
  const [activeChar, setActiveChar] = useState<string | null>(null);

  const handleCharClick = (hija: any) => {
    setActiveChar(hija.id);
    playAudio(hija.audioUrl);
    updateProgress('hijaiyah', hija.id, 10);
    // Give feedback
    const msg = new SpeechSynthesisUtterance(hija.name);
    msg.lang = 'ar-SA'; // pronunciation approximation
    window.speechSynthesis.speak(msg);

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
                {hija.label}
              </span>
              <span className="text-lg md:text-xl font-bold mt-2 tracking-wide capitalize">
                {user?.language === 'ja' ? hija.jp : hija.name}
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
  const { user, progress, updateProgress } = useAppStore();
  const t = useTranslation(user?.language);
  const prog = progress['doa'];
  const completed = prog?.completedItems || [];

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_doa} onBack={onBack} />
      <div className="p-4 max-w-3xl mx-auto space-y-6 mt-4">
        {doaData.map((doa, i) => {
          const isDone = completed.includes(doa.id);
          const title = (doa.name as any)[user?.language || 'id'];
          const arti = (doa.arti as any)[user?.language || 'id'];
          
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
                     onClick={() => updateProgress('doa', doa.id, 20)}
                     className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-green-600 active:scale-95"
                   >
                     Hafal (+20)
                   </button>
                ) : (
                  <div className="flex items-center gap-1 text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full">
                    <Check size={18} /> Hafal
                  </div>
                )}
              </div>
              
              <p className="text-3xl font-bold text-right leading-loose tracking-wider mb-4" dir="rtl">{doa.arabic}</p>
              <p className="text-gray-500 italic mb-2 border-l-4 border-gray-300 pl-3">{doa.latin}</p>
              <p className="text-gray-700 font-medium bg-gray-50 p-4 rounded-xl">{arti}</p>
              
              <button 
                onClick={() => {
                  const msg = new SpeechSynthesisUtterance(doa.arabic);
                  msg.lang = 'ar-SA';
                  msg.rate = 0.8;
                  window.speechSynthesis.speak(msg);
                }}
                className="mt-4 flex items-center justify-center gap-2 w-full bg-[var(--primary-color)] text-white py-3 rounded-2xl font-bold active:scale-95 transition-transform"
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
  const { user, progress, updateProgress } = useAppStore();
  const t = useTranslation(user?.language);
  const prog = progress['sholat'];
  const completed = prog?.completedItems || [];

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_sholat} onBack={onBack} />
      <div className="p-4 max-w-3xl mx-auto space-y-6 mt-4">
        {sholatData.map((sholat, i) => {
          const isDone = completed.includes(sholat.id);
          const title = (sholat.name as any)[user?.language || 'id'];
          
          return (
            <motion.div
              key={sholat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-indigo-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-600">{title}</h3>
                {!isDone && (
                   <button 
                     onClick={() => updateProgress('sholat', sholat.id, 15)}
                     className="bg-indigo-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-indigo-600 active:scale-95"
                   >
                     Selesai (+15)
                   </button>
                )}
                {isDone && <Check size={24} className="text-green-500" />}
              </div>
              <p className="text-2xl font-bold text-right leading-loose mb-2" dir="rtl">{sholat.arabic}</p>
              <p className="text-gray-600 italic border-l-4 border-indigo-100 pl-3">{sholat.latin}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

function ProfileView({ onBack }: { onBack: () => void }) {
  const { user, updateProfile } = useAppStore();
  const t = useTranslation(user?.language);

  return (
    <div className="flex-1">
      <Header title={t.menu_profile} onBack={onBack} />
      
      <div className="max-w-md mx-auto p-6 mt-8 pb-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-[var(--primary-color)] rounded-full mx-auto flex items-center justify-center text-white text-4xl shadow-inner mb-6">
            <User size={48} />
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{t.profile_name}</label>
              <input 
                type="text" 
                value={user?.name || ''} 
                onChange={e => updateProfile({ name: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:border-[var(--primary-color)] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Tema</label>
              <div className="grid grid-cols-2 gap-3">
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
                      {(t as any)[`theme_${th}`]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Bahasa</label>
              <div className="grid grid-cols-1 gap-3">
                {['id', 'ja', 'bew'].map(l => {
                  const isActive = user?.language === l;
                  return (
                    <button
                      key={l}
                      onClick={() => updateProfile({ language: l as any })}
                      className={cn(
                        "py-3 rounded-xl font-bold transition-all border-2 flex items-center justify-center gap-2",
                        isActive ? "border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-[var(--primary-color)]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {(t as any)[`lang_${l}`]}
                      {isActive && <Check size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
               onClick={() => signOut(auth)}
               className="w-full mt-6 bg-red-100 text-red-600 font-bold py-3 rounded-2xl border-2 border-red-200 active:scale-95 transition-transform"
            >
               Keluar (Sign Out)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
