import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { Star, Gamepad2, Headphones, Sparkles, BookOpen, User, Download } from 'lucide-react';
import { hijaiyahData } from '../data/hijaiyah';
import { doaData } from '../data/doa';
import { sholatData } from '../data/sholat';
import { surahData } from '../data/surah';
import { countAudioCache, fetchAndCacheAudio } from '../lib/audioCache';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../components/MenuCard';

export default function MainMenuView() {
  const navigate = useNavigate();
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
    const batchSize = 10;
    for (let i = 0; i < allRequests.length; i += batchSize) {
      const batch = allRequests.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (req) => {
          try {
            await fetchAndCacheAudio(req.id, req.url);
          } catch (err) {
            console.error('Failed to download audio for:', req.id);
          }
          count++;
          setDownloadProgress(Math.min(count, allRequests.length));
        })
      );
    }
    setIsDownloading(false);
    toast.success('Audio siap offline!');
    countAudioCache().then(setCachedCount);
  };

  const kidEmoji = user?.uid === 'abeel' ? '🧑' : user?.uid === 'emier' ? '🧑' : '👧';
  const displayKidName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center flex-1 justify-start">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full pb-10">
        <MenuCard onClick={() => navigate('/hijaiyah')} color="bg-pink-500 border-pink-700 hover:bg-pink-400" title={t.menu_hijaiyah} icon={<Gamepad2 size={36} />} delay={0.05} />
        <MenuCard onClick={() => navigate('/kuis')} color="bg-rose-500 border-rose-700 hover:bg-rose-400" title={t.menu_kuis} icon={<Sparkles size={36} />} delay={0.1} />
        <MenuCard onClick={() => navigate('/hafalan')} color="bg-teal-500 border-teal-700 hover:bg-teal-400" title={t.menu_hafalan} icon={<Headphones size={36} />} delay={0.15} />
        <MenuCard onClick={() => navigate('/doa')} color="bg-blue-500 border-blue-700 hover:bg-blue-400" title={t.menu_doa} icon={<BookOpen size={36} />} delay={0.2} />
        <MenuCard onClick={() => navigate('/sholat')} color="bg-green-500 border-green-700 hover:bg-green-400" title={t.menu_sholat} icon={<Star size={36} />} delay={0.25} />
        <MenuCard onClick={() => navigate('/profile')} color="bg-purple-500 border-purple-700 hover:bg-purple-400" title={t.menu_profile} icon={<User size={36} />} delay={0.3} />
        {isGameZoneUnlocked ? (
          <MenuCard onClick={() => navigate('/gamezone')} color="bg-orange-500 border-orange-700 hover:bg-orange-400" title="Game Zone 🎮" icon={<Gamepad2 size={36} />} delay={0.35} />
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
