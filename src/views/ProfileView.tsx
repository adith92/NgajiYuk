import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { useTranslation } from '../lib/i18n';
import { User, Headphones, Trash2, LogOut } from 'lucide-react';
import { countAudioCache, clearAudioCache } from '../lib/audioCache';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProfileView() {
  const navigate = useNavigate();
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
      <Header title={t.menu_profile} onBack={() => navigate('/menu')} />
      
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
                  navigate('/');
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
