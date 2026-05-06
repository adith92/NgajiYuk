import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { surahData } from '../data/surah';
import { Header } from './Header';
import { motion } from 'motion/react';
import { Play, Pause, Repeat, FastForward } from 'lucide-react';
import { fetchAndCacheAudio } from '../lib/audioCache';
import toast from 'react-hot-toast';

function cnHelper(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function HafalanView({ onBack }: { onBack: () => void }) {
  const { currentUserUid, users } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language) as any;
  const [selectedAyatId, setSelectedAyatId] = useState(surahData[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedAyat = surahData.find(a => a.id === selectedAyatId) || surahData[0];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayToggle = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      await playAyat();
    }
  };

  const playAyat = async () => {
    if (audioRef.current) {
        audioRef.current.pause();
    }

    const cacheKey = `surah_${selectedAyat.id}`;
    
    let blob = await fetchAndCacheAudio(cacheKey, `/audio/surah/${selectedAyat.id}.mp3`);
    
    if (!blob) {
       toast.error('Gagal memutar audio');
       setIsPlaying(false);
       return;
    }

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.playbackRate = speed;
    audio.loop = loop;
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };
    
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);

    try {
      await audio.play();
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      audioRef.current.loop = loop;
    }
  }, [speed, loop]);

  useEffect(() => {
    if (isPlaying) {
      playAyat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAyatId]);

  return (
    <div className="flex-1 pb-10">
      <Header title={t.menu_hafalan} onBack={onBack} />
      <div className="p-4 max-w-3xl mx-auto mt-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-green-200">
          <div className="mb-6">
            <label className="block text-gray-500 font-bold mb-2 uppercase tracking-wide text-sm">{t.select_ayat}</label>
            <select
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-lg font-bold text-gray-800 focus:outline-none focus:border-green-500"
              value={selectedAyatId}
              onChange={(e) => setSelectedAyatId(e.target.value)}
            >
              {surahData.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          <div className="relative mb-8 text-center min-h-[150px] flex items-center justify-center">
            {isPlaying && (
              <motion.div
                className="absolute inset-0 bg-green-100 rounded-3xl"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 / speed }}
              />
            )}
            <div className="relative z-10 w-full p-4">
              <p className="text-4xl md:text-5xl font-black text-right leading-relaxed text-gray-800" dir="rtl">
                {selectedAyat.arabic}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl mb-6">
             <p className="text-xl font-bold text-gray-800 text-center mb-2">{selectedAyat.translation}</p>
             <p className="text-gray-500 italic text-center text-sm">{selectedAyat.latin}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePlayToggle}
              className={cnHelper(
                "flex items-center gap-2 px-8 py-4 rounded-full font-black text-white text-xl shadow-lg transition-all active:scale-95",
                isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              )}
            >
              {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6" />}
              {isPlaying ? t.pause : t.play}
            </button>

            <button
              onClick={() => setLoop(!loop)}
              className={cnHelper(
                "flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all active:scale-95 border-2",
                loop ? "bg-blue-100 border-blue-500 text-blue-600 shadow-md" : "bg-gray-50 border-gray-200 text-gray-500"
              )}
            >
              <Repeat className="w-5 h-5" />
              {t.loop}
            </button>

            <button
              onClick={() => {
                const speeds = [0.75, 1, 1.25, 1.5];
                setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length]);
              }}
              className="flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all active:scale-95 border-2 bg-purple-50 border-purple-200 text-purple-600"
            >
              <FastForward className="w-5 h-5" />
              {speed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
