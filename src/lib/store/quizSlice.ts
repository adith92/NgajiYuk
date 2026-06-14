import { StateCreator } from 'zustand';
import { QuizHistory } from './types';
import { UserSlice } from './userSlice';
import { GameZoneSlice } from './gameZoneSlice';

export interface QuizSlice {
  quizHistory: Record<string, QuizHistory[]>;
  completeQuizSession: (moduleId: string, totalQuestions: number, correctAnswers: number, wrongAnswers: number) => QuizHistory;
}

export const createQuizSlice: StateCreator<QuizSlice & UserSlice & GameZoneSlice, [], [], QuizSlice> = (set, get) => ({
  quizHistory: {},
  completeQuizSession: (moduleId, totalQuestions, correctAnswers, wrongAnswers) => {
    const { currentUserUid, quizHistory, unlockGameZone } = get();
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
      unlockGameZone(rewardMinutes, 'quiz', `Skor kuis ${scorePercent}%`);
    }

    return newHistoryItem;
  }
});
