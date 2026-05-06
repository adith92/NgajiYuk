import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'id' | 'ja' | 'bew';
export type Theme = 'default' | 'ocean' | 'forest' | 'sunset' | 'galaxy' | 'candy' | 'sunshine' | 'royal';

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
  
  // Actions
  initializeApp: () => void;
  login: (uid: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>) => void;
  updateProgress: (moduleId: string, itemId: string, pointsGained: number) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: {},
      progress: {},
      currentUserUid: null,
      isReady: false,

      initializeApp: () => {
        set({ isReady: true });
      },

      login: (uid, name) => {
        const { users, progress } = get();
        if (!users[uid]) {
          // Create new profile
          set({
            users: {
              ...users,
              [uid]: {
                uid,
                name,
                theme: 'default',
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
          set({ currentUserUid: uid });
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
      }
    }),
    {
      name: 'ngajiyuk-storage',
    }
  )
);