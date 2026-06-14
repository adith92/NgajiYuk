import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../lib/store';
import { translations } from '../lib/i18n';
import { HeroMascot } from '../components/HeroMascot';
import { useNavigate } from 'react-router-dom';
import { ClayButton, cn } from '../components/ClayButton';

export default function LandingView() {
  const navigate = useNavigate();
  const { currentUserUid, users, login, landingTheme, setLandingTheme } = useAppStore();
  const [localTheme, setLocalTheme] = useState(landingTheme);

  useEffect(() => {
    document.body.className = `theme-${localTheme}`;
    setLandingTheme(localTheme);
  }, [localTheme, setLandingTheme]);

  const defaultT = translations.id as any;

  const kids = [
    { uid: 'abeel', name: 'Abeel', color: 'cyan', emoji: '🧑' },
    { uid: 'emier', name: 'Emier', color: 'emerald', emoji: '🧑' },
    { uid: 'emily', name: 'Emily', color: 'pink', emoji: '👧' }
  ];

  const handleLogin = (uid: string, name: string) => {
    login(uid, name);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 text-center select-none w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-2xl px-2.5"
      >
        <div className="clay-card p-6 md:p-10 text-center w-full relative overflow-hidden flex flex-col items-center border-[6px] border-white/95 bg-white/90">
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-pink-400 via-yellow-400 to-emerald-400" />
          
          <HeroMascot />
          
          <h1 className="text-3xl md:text-4xl font-black text-emerald-950 mb-6 tracking-wide px-2 mt-4">
            Siapa yang mau belajar?
          </h1>
          
          <div className="mb-8 w-full max-w-xl">
            <h3 className="text-emerald-800 font-extrabold uppercase tracking-wider mb-4 text-xs md:text-sm">Pilih Tema Dulu Yuk! 🎨</h3>
            <div className="flex flex-wrap justify-center gap-2 px-1 max-w-md mx-auto">
              {['default', 'ocean', 'forest', 'sunset', 'galaxy', 'candy', 'sunshine', 'royal'].map(th => {
                const isActive = localTheme === th;
                const activeBorderAndColor = `border-emerald-500 bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] scale-105`;
                const inactiveBorderAndColor = `border-emerald-100 text-emerald-800 bg-white/60 hover:bg-emerald-50 hover:border-emerald-200`;
                
                return (
                  <button
                    key={th}
                    onClick={() => setLocalTheme(th as any)}
                    className={cn(
                      "px-4 py-2 text-xs md:text-sm rounded-full font-bold transition-all border-2 cursor-pointer select-none focus:outline-none flex items-center justify-center gap-2 shadow-sm",
                      isActive ? activeBorderAndColor : inactiveBorderAndColor
                    )}
                  >
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full shrink-0 border border-black/10 inline-block",
                      th === 'default' ? 'bg-emerald-400' :
                      th === 'ocean' ? 'bg-cyan-400' :
                      th === 'forest' ? 'bg-emerald-600' :
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
              <ClayButton
                key={kid.uid}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', duration: 0.4 }}
                onClick={() => handleLogin(kid.uid, kid.name)}
                colorClass={kid.color}
                className="group h-36 md:p-6 rounded-[2rem] border-b-[6px]"
              >
                <span className="text-5xl mb-2 group-hover:scale-110 transition-transform select-none">{kid.emoji}</span>
                <span className="text-xl font-black leading-none tracking-wide">{kid.name}</span>
              </ClayButton>
            ))}
          </div>

          {currentUserUid && users[currentUserUid] && (
             <div className="mt-8 pt-6 border-t-2 border-dashed border-emerald-100 flex justify-center w-full max-w-xl">
               <button 
                 onClick={() => navigate('/menu')}
                 className="bg-gradient-to-b from-orange-400 to-orange-500 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg border-b-[6px] border-orange-700 hover:brightness-105 active:scale-95 active:border-b-0 active:translate-y-1.5 transition-all text-sm md:text-base flex items-center gap-2 cursor-pointer focus:outline-none"
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
