import { create } from 'zustand';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
  moduleId: string; // 'hijaiyah', 'sholat', 'doa'
  completedItems: string[];
  points: number;
  updatedAt: number;
}

interface AppState {
  user: UserProfile | null;
  progress: Record<string, Progress>;
  isReady: boolean;
  
  // Actions
  initializeApp: () => void;
  signIn: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  updateProgress: (moduleId: string, itemId: string, pointsGained: number) => Promise<void>;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  progress: {},
  isReady: false,

  initializeApp: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userDoc = await getDoc(userRef);
        
        let profile: UserProfile;
        
        if (userDoc.exists()) {
          profile = userDoc.data() as UserProfile;
        } else {
          profile = {
            uid: firebaseUser.uid,
            name: 'Anak Pintar',
            theme: 'default',
            language: 'id',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await setDoc(userRef, profile);
        }

        // Fetch progress
        const progRef = collection(db, 'users', firebaseUser.uid, 'progress');
        const progSnap = await getDocs(progRef);
        const progress: Record<string, Progress> = {};
        progSnap.forEach(d => {
          progress[d.id] = d.data() as Progress;
        });

        set({ user: profile, progress, isReady: true });
      } else {
        set({ user: null, progress: {}, isReady: true });
      }
    });
  },

  signIn: async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    
    const newProfile = { ...user, ...updates, updatedAt: Date.now() };
    set({ user: newProfile });
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, newProfile as any);
  },

  updateProgress: async (moduleId, itemId, pointsGained) => {
    const { user, progress } = get();
    if (!user) return;

    const currentProg = progress[moduleId] || {
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

      set({ progress: { ...progress, [moduleId]: newProg } });

      const progRef = doc(db, 'users', user.uid, 'progress', moduleId);
      await setDoc(progRef, newProg);
    }
  },

  setTheme: (theme) => {
    get().updateProfile({ theme });
  },

  setLanguage: (language) => {
    get().updateProfile({ language });
  }
}));
