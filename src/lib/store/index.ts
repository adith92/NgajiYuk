import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { UserSlice, createUserSlice } from './userSlice';
import { ProgressSlice, createProgressSlice } from './progressSlice';
import { GameZoneSlice, createGameZoneSlice } from './gameZoneSlice';
import { QuizSlice, createQuizSlice } from './quizSlice';

// Re-export types
export * from './types';

export type AppState = UserSlice & ProgressSlice & GameZoneSlice & QuizSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createUserSlice(set, get, api),
      ...createProgressSlice(set, get, api),
      ...createGameZoneSlice(set, get, api),
      ...createQuizSlice(set, get, api),
    }),
    {
      name: 'ngajiyuk-storage',
    }
  )
);
