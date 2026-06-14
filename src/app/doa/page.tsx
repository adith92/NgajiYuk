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
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
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
      <Header title="Doa Harian" onBack={() => router.push('/dashboard')} />
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
              className={`glass-panel p-6 relative flex flex-col w-full rounded-3xl border transition-all duration-300 group overflow-hidden ${isRecording ? 'border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)]' : 'border-slate-700/50 hover:border-purple-500/50'}`}
            >
              {/* Glow background */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {isRecording && <div className="absolute inset-0 bg-teal-500/5 animate-pulse pointer-events-none" />}
              
              <div className="relative z-10 flex justify-between items-start mb-6 gap-4">
                <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
                {!isDone ? (
                   <button 
                     onClick={() => {
                        updateProgress('doa', doa.id, 20);
                        triggerConfetti();
                     }}
                     className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 font-semibold px-4 py-2 rounded-xl shadow-lg border border-purple-500/30 transition-all text-sm shrink-0 backdrop-blur-md"
                   >
                     Hafal (+20)
                   </button>
                ) : (
                   <div className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30 text-sm shrink-0 backdrop-blur-md">
                     <Check size={16} /> Hafal
                   </div>
                )}
              </div>
              
              <p className="relative z-10 text-3xl font-bold text-right leading-loose tracking-wider mb-5 text-purple-100 Arabic-Font drop-shadow-md" style={{ fontFamily: 'Scheherazade New, sans-serif' }} dir="rtl">{doa.arabic}</p>
              
              <div className="relative z-10 space-y-4">
                <p className="text-slate-300 italic border-l-4 border-purple-500/50 pl-4 text-sm md:text-base leading-relaxed">{doa.latin}</p>
                <p className="text-slate-200 bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-sm md:text-base shadow-inner leading-relaxed">{arti}</p>
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {msg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className={`mt-4 relative z-10 p-3 rounded-xl border flex flex-col text-sm font-medium ${
                      msg.type === 'info' ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' :
                      msg.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' :
                      'bg-rose-500/20 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {msg.type === 'info' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {msg.text}
                    </div>
                    {msg.matchPct !== undefined && (
                      <div className="mt-2 w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
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
                  className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-white py-3 rounded-xl font-semibold transition-all"
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
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold shadow-lg transition-all ${
                    isRecording 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 animate-pulse' 
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/25'
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
