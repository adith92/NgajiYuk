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
    { uid: 'abeel', name: 'Abeel', color: 'bg-blue-500 border-blue-700 hover:bg-blue-400', emoji: '🧑' },
    { uid: 'emier', name: 'Emier', color: 'bg-green-500 border-green-700 hover:bg-green-400', emoji: '🧑' },
    { uid: 'emily', name: 'Emily', color: 'bg-pink-500 border-pink-700 hover:bg-pink-400', emoji: '👧' }
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
              <ClayButton
                key={kid.uid}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', duration: 0.4 }}
                onClick={() => handleLogin(kid.uid, kid.name)}
                colorClass={kid.color}
                className="group h-36 md:p-6"
              >
                <span className="text-5xl mb-2 group-hover:scale-110 transition-transform select-none">{kid.emoji}</span>
                <span className="text-xl font-extrabold leading-none">{kid.name}</span>
              </ClayButton>
            ))}
          </div>

          {currentUserUid && users[currentUserUid] && (
             <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 flex justify-center w-full max-w-xl">
               <button 
                 onClick={() => navigate('/menu')}
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
