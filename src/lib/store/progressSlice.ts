import { StateCreator } from 'zustand';
import { Progress } from './types';
import { UserSlice } from './userSlice';

export interface ProgressSlice {
  progress: Record<string, Record<string, Progress>>; // uid -> moduleId -> Progress
  updateProgress: (moduleId: string, itemId: string, pointsGained: number) => void;
}

export const createProgressSlice: StateCreator<ProgressSlice & UserSlice, [], [], ProgressSlice> = (set, get) => ({
  progress: {},
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
  }
});
