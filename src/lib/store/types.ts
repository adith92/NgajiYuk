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
  moduleId: string;
  completedItems: string[];
  points: number;
  updatedAt: number;
}
