import { StateCreator } from 'zustand';
import { GameZoneUnlock } from './types';
import { UserSlice } from './userSlice';

export interface GameZoneSlice {
  rewardUnlocks: Record<string, GameZoneUnlock>;
  unlockGameZone: (rewardMinutes: number, rewardSource: 'quiz' | 'manual' | 'bonus', reason: string) => void;
  lockGameZone: () => void;
  getGameZoneStatus: () => GameZoneUnlock | null;
}

export const createGameZoneSlice: StateCreator<GameZoneSlice & UserSlice, [], [], GameZoneSlice> = (set, get) => ({
  rewardUnlocks: {},
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
    const { currentUserUid, rewardUnlocks, lockGameZone } = get();
    if (!currentUserUid) return null;

    const status = rewardUnlocks[currentUserUid];
    if (!status) return null;

    const now = Date.now();

    if (status.unlocked) {
      // Anti-cheat: detect manipulated local clock
      if (now < status.startAt || (status.unlockUntil - now > status.rewardMinutes * 60000)) {
        lockGameZone();
        return {
          ...status,
          unlocked: false,
          reason: 'Manipulasi jam terdeteksi'
        };
      }

      if (now > status.unlockUntil) {
        lockGameZone();
        return {
          ...status,
          unlocked: false,
        };
      }
    }
    return status;
  }
});
