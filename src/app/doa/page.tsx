"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Check, Volume2, Mic, MicOff, Loader2 } from 'lucide-react';
import { doaData } from '@/data/doa';
import { playAudio } from '@/lib/audioCache';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { normalizeArabic, stringSimilarity } from '@/lib/utils';

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']
  });
}

export default function DoaPage() {
  const router = useRouter();
  const { currentUserUid, users, progress, updateProgress } = useAppStore();
  const user = currentUserUid ? users[currentUserUid] : null;
  const t = useTranslation(user?.language || 'id') as any;
  const prog = currentUserUid ? progress[currentUserUid]?.['doa'] : null;
  const completed = prog?.completedItems || [];

  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [sttMessage, setSttMessage] = useState<{ id: string; text: string; type: 'info' | 'success' | 'error'; matchPct?: number } | null>(null);

  useEffect(() => {
    return () => {
      confetti.reset();
    };
  }, []);

  const startRecording = (doaId: string, arabicText: string) => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Maaf, browser kamu belum mendukung fitur mikrofon untuk merekam suara. Coba gunakan Google Chrome ya!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA'; // Detect Arabic
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecordingId(doaId);
      setSttMessage({ id: doaId, text: "Mendengarkan... Silakan baca doanya!", type: 'info' });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      const targetText = normalizeArabic(arabicText);
      const spokenText = normalizeArabic(transcript);
      
      const similarity = stringSimilarity(targetText, spokenText);
      const matchPct = Math.round(similarity * 100);

      if (similarity >= 0.7) { // 70% tolerance for kids
        setSttMessage({ 
          id: doaId, 
          text: `Pintar sekali! Bacaanmu benar.`, 
          type: 'success', 
          matchPct 
        });
        if (!completed.includes(doaId)) {
           updateProgress('doa', doaId, 20);
        }
        triggerConfetti();
      } else {
        setSttMessage({ 
          id: doaId, 
          text: `Hampir benar! Yuk coba lagi. (Kamu baca: ${transcript})`, 
          type: 'error', 
          matchPct 
        });
      }
      
      setRecordingId(null);
      setTimeout(() => {
         setSttMessage(null);
      }, 5000);
    };

    recognition.onerror = (event: any) => {
      setRecordingId(null);
      setSttMessage({ id: doaId, text: "Hmm, suaranya kurang jelas terdengar. Coba lagi ya!", type: 'error' });
      setTimeout(() => {
         setSttMessage(null);
      }, 4000);
    };

    recognition.onend = () => {
      setRecordingId(null);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen pb-10">
      <Header title="Doa Harian 🤲" onBack={() => router.push('/dashboard')} />
      <div className="p-6 max-w-3xl mx-auto space-y-6 mt-4">
        {doaData.map((doa, i) => {
          const isDone = completed.includes(doa.id);
          const title = doa.title;
          const arti = doa.translation;
          const isRecording = recordingId === doa.id;
          const msg = sttMessage?.id === doa.id ? sttMessage : null;
          
          return (
            <motion.div
              key={doa.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
              className={`glass-panel p-6 relative flex flex-col w-full rounded-3xl border-2 transition-all duration-300 group overflow-hidden ${isRecording ? 'border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.2)]' : 'border-violet-200 hover:border-violet-400'}`}
            >
              {/* Glow background */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-200/0 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:bg-violet-200/30 transition-all duration-500" />
              {isRecording && <div className="absolute inset-0 bg-sky-100/30 animate-pulse pointer-events-none" />}
              
              <div className="relative z-10 flex justify-between items-start mb-6 gap-4">
                <h3 className="text-xl font-bold text-slate-700 tracking-wide">{title}</h3>
                {!isDone ? (
                   <button 
                     onClick={() => {
                        updateProgress('doa', doa.id, 20);
                        triggerConfetti();
                     }}
                     className="bg-violet-100 hover:bg-violet-200 text-violet-600 hover:text-violet-700 font-semibold px-4 py-2 rounded-xl shadow-md border border-violet-200 transition-all text-sm shrink-0"
                   >
                     Hafal (+20)
                   </button>
                ) : (
                   <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 text-sm shrink-0">
                     <Check size={16} /> Hafal
                   </div>
                )}
              </div>
              
              <p className="relative z-10 text-3xl font-bold text-right leading-loose tracking-wider mb-5 text-amber-800 Arabic-Font drop-shadow-sm" style={{ fontFamily: 'Scheherazade New, sans-serif' }} dir="rtl">{doa.arabic}</p>
              
              <div className="relative z-10 space-y-4">
                <p className="text-slate-600 italic border-l-4 border-violet-300 pl-4 text-sm md:text-base leading-relaxed">{doa.latin}</p>
                <p className="text-slate-700 bg-white/60 border border-slate-200 p-4 rounded-2xl text-sm md:text-base shadow-inner leading-relaxed">{arti}</p>
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {msg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className={`mt-4 relative z-10 p-3 rounded-xl border flex flex-col text-sm font-medium ${
                      msg.type === 'info' ? 'bg-sky-50 border-sky-200 text-sky-700' :
                      msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                      'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {msg.type === 'info' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {msg.text}
                    </div>
                    {msg.matchPct !== undefined && (
                      <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ${msg.matchPct >= 70 ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                           style={{ width: `${msg.matchPct}%` }}
                         />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playAudio(`doa_${doa.id}`, `/audio/doa/${doa.id}.mp3`)}
                  className="flex items-center justify-center gap-2 w-full bg-white/80 hover:bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all shadow-sm"
                >
                  <Volume2 size={18} /> Dengarkan
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isRecording) {
                      // Manual stop not strictly needed if we just wait, but UX wise:
                      setRecordingId(null);
                      setSttMessage(null);
                    } else {
                      startRecording(doa.id, doa.arabic);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold shadow-md transition-all ${
                    isRecording 
                      ? 'bg-rose-400 hover:bg-rose-500 text-white shadow-rose-200/40 animate-pulse' 
                      : 'bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-white shadow-sky-200/40'
                  }`}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  {isRecording ? 'Berhenti' : 'Ucapkan'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
