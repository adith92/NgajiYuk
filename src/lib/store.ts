import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'id' | 'ja' | 'bew';
export type Theme = 'default' | 'ocean' | 'forest' | 'sunset' | 'galaxy' | 'candy' | 'sunshine' | 'royal';

export interface GameZoneUnlock {
  unlocked: boolean;
  startAt: number;
  unlockUntil: number;
  rewardMinutes: number;
  rewardSource: 'quiz' | 'manual' | 'bonus';
  reason: string;
}

export interface QuizHistory {
  id: string;
  moduleId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  scorePercent: number;
  passed: boolean;
  rewardMinutes: number;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  theme: Theme;
  language: Language;
  avatarId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Progress {
  moduleId: string; // 'hijaiyah', 'sholat', 'doa', 'surah', 'kuis_hijaiyah'
  completedItems: string[];
  points: number;
  updatedAt: number;
}

interface AppState {
  users: Record<string, UserProfile>;
  progress: Record<string, Record<string, Progress>>; // uid -> moduleId -> Progress
  currentUserUid: string | null;
  isReady: boolean;
  landingTheme: Theme;
  rewardUnlocks: Record<string, GameZoneUnlock>; // uid -> GameZoneUnlock status
  quizHistory: Record<string, QuizHistory[]>; // uid -> QuizHistory array
  
  // Actions
  initializeApp: () => void;
  login: (uid: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>) => void;
  updateProgress: (moduleId: string, itemId: string, pointsGained: number) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setLandingTheme: (theme: Theme) => void;
  completeQuizSession: (moduleId: string, totalQuestions: number, correctAnswers: number, wrongAnswers: number) => QuizHistory;
  unlockGameZone: (rewardMinutes: number, rewardSource: 'quiz' | 'manual' | 'bonus', reason: string) => void;
  lockGameZone: () => void;
  getGameZoneStatus: () => GameZoneUnlock | null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: {},
      progress: {},
      currentUserUid: null,
      isReady: false,
      landingTheme: 'default',
      rewardUnlocks: {},
      quizHistory: {},

      initializeApp: () => {
        set({ isReady: true });
        // safety mechanism: check if currentUserUid is valid
        const { currentUserUid, users } = get();
        if (currentUserUid && !users[currentUserUid]) {
          set({ currentUserUid: null });
        }
      },

      login: (uid, name) => {
        const { users, progress, landingTheme } = get();
        if (!users[uid]) {
          // Create new profile
          set({
            users: {
              ...users,
              [uid]: {
                uid,
                name,
                theme: landingTheme || 'default',
                language: 'id',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }
            },
            progress: {
              ...progress,
              [uid]: {}
            },
            currentUserUid: uid
          });
        } else {
          // User exists, just login
          set({ currentUserUid: uid });
          // Note: per feedback: "kalau user sudah ada, update profile theme anak - kecuali user memilih theme baru di landing". Wait, since we keep landingTheme state, we update if logic is right? 
          // Actually, instruction says "jika user lama, jangan paksa reset theme, kecuali user memilih theme baru di landing" 
          // Let's just update the theme if landingTheme is not 'default', or maybe just leave the existing theme alone since we don't know if they picked default or didn't pick. Let's assume if landingTheme isn't default, we update it.
          if (landingTheme !== 'default' && users[uid].theme !== landingTheme) {
            get().updateProfile({ theme: landingTheme });
          }
        }
      },

      logout: () => {
        set({ currentUserUid: null });
      },

      updateProfile: (updates) => {
        const { currentUserUid, users } = get();
        if (!currentUserUid || !users[currentUserUid]) return;
        
        const newProfile = { ...users[currentUserUid], ...updates, updatedAt: Date.now() };
        set({
          users: {
            ...users,
            [currentUserUid]: newProfile
          }
        });
      },

      updateProgress: (moduleId, itemId, pointsGained) => {
        const { currentUserUid, progress } = get();
        if (!currentUserUid) return;

        const userProg = progress[currentUserUid] || {};
        const currentProg = userProg[moduleId] || {
          moduleId,
          completedItems: [],
          points: 0,
          updatedAt: Date.now(),
        };

        if (!currentProg.completedItems.includes(itemId)) {
          const newProg = {
            ...currentProg,
            completedItems: [...currentProg.completedItems, itemId],
            points: currentProg.points + pointsGained,
            updatedAt: Date.now(),
          };

          set({
            progress: {
              ...progress,
              [currentUserUid]: {
                ...userProg,
                [moduleId]: newProg
              }
            }
          });
        }
      },

      setTheme: (theme) => {
        get().updateProfile({ theme });
      },

      setLanguage: (language) => {
        get().updateProfile({ language });
      },

      setLandingTheme: (theme) => {
        set({ landingTheme: theme });
      },

      completeQuizSession: (moduleId, totalQuestions, correctAnswers, wrongAnswers) => {
        const { currentUserUid, quizHistory } = get();
        if (!currentUserUid) {
          throw new Error("No active user");
        }

        const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = scorePercent >= 80;
        let rewardMinutes = 0;
        if (scorePercent === 100) {
          rewardMinutes = 45;
        } else if (scorePercent >= 90) {
          rewardMinutes = 30;
        } else if (scorePercent >= 80) {
          rewardMinutes = 15;
        }

        const newSessionId = `${moduleId}_${Date.now()}`;
        const newHistoryItem: QuizHistory = {
          id: newSessionId,
          moduleId,
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          scorePercent,
          passed,
          rewardMinutes,
          createdAt: Date.now()
        };

        const userHistory = quizHistory[currentUserUid] || [];
        set({
          quizHistory: {
            ...quizHistory,
            [currentUserUid]: [newHistoryItem, ...userHistory]
          }
        });

        if (rewardMinutes > 0) {
          get().unlockGameZone(rewardMinutes, 'quiz', `Skor kuis ${scorePercent}%`);
        }

        return newHistoryItem;
      },

      unlockGameZone: (rewardMinutes, rewardSource, reason) => {
        const { currentUserUid, rewardUnlocks } = get();
        if (!currentUserUid) return;

        const startAt = Date.now();
        const unlockUntil = startAt + (rewardMinutes * 60 * 1000);

        const newStatus: GameZoneUnlock = {
          unlocked: true,
          startAt,
          unlockUntil,
          rewardMinutes,
          rewardSource,
          reason
        };

        set({
          rewardUnlocks: {
            ...rewardUnlocks,
            [currentUserUid]: newStatus
          }
        });
      },

      lockGameZone: () => {
        const { currentUserUid, rewardUnlocks } = get();
        if (!currentUserUid) return;

        const currentStatus = rewardUnlocks[currentUserUid];
        const newStatus: GameZoneUnlock = {
          unlocked: false,
          startAt: currentStatus?.startAt || 0,
          unlockUntil: 0,
          rewardMinutes: 0,
          rewardSource: currentStatus?.rewardSource || 'manual',
          reason: 'Terkunci'
        };

        set({
          rewardUnlocks: {
            ...rewardUnlocks,
            [currentUserUid]: newStatus
          }
        });
      },

      getGameZoneStatus: () => {
        const { currentUserUid, rewardUnlocks } = get();
        if (!currentUserUid) return null;

        const status = rewardUnlocks[currentUserUid];
        if (!status) return null;

        if (status.unlocked && Date.now() > status.unlockUntil) {
          // expired! automatic lock
          get().lockGameZone();
          return {
            ...status,
            unlocked: false,
          };
        }
        return status;
      }
    }),
    {
      name: 'ngajiyuk-storage',
    }
  )
);