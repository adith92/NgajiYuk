import { StateCreator } from 'zustand';
import { UserProfile, Theme, Language } from './types';

export interface UserSlice {
  users: Record<string, UserProfile>;
  currentUserUid: string | null;
  landingTheme: Theme;
  isReady: boolean;
  initializeApp: () => void;
  login: (uid: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setLandingTheme: (theme: Theme) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set, get) => ({
  users: {},
  currentUserUid: null,
  landingTheme: 'default',
  isReady: false,

  initializeApp: () => {
    set({ isReady: true });
    const { currentUserUid, users } = get();
    if (currentUserUid && !users[currentUserUid]) {
      set({ currentUserUid: null });
    }
  },

  login: (uid, name) => {
    const { users, landingTheme } = get();
    if (!users[uid]) {
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
        currentUserUid: uid
      });
    } else {
      set({ currentUserUid: uid });
      if (landingTheme !== 'default' && users[uid].theme !== landingTheme) {
        get().updateProfile({ theme: landingTheme });
      }
    }
  },

  logout: () => set({ currentUserUid: null }),

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

  setTheme: (theme) => get().updateProfile({ theme }),
  setLanguage: (language) => get().updateProfile({ language }),
  setLandingTheme: (theme) => set({ landingTheme: theme }),
});
