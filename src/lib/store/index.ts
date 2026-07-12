import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type UserSlice, createUserSlice } from "./userSlice";
import { type ProgressSlice, createProgressSlice } from "./progressSlice";
import { type GameZoneSlice, createGameZoneSlice } from "./gameZoneSlice";
import { type QuizSlice, createQuizSlice } from "./quizSlice";

export * from "./types";

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
      name: "ngajiyuk-storage",
      version: 2,
      partialize: (state) => ({
        users: state.users,
        currentUserUid: state.currentUserUid,
        landingTheme: state.landingTheme,
        progress: state.progress,
        rewardUnlocks: state.rewardUnlocks,
        quizHistory: state.quizHistory,
      }),
      migrate: (persistedState) => persistedState as AppState,
    },
  ),
);
