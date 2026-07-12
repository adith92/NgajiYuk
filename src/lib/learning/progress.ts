import type { Progress, QuizHistory } from "@/lib/store";

export type UserProgressMap = Record<string, Progress>;

export interface ModuleTotals {
  hijaiyah: number;
  doa: number;
  sholat: number;
}

export interface LearningSummary {
  totalPoints: number;
  completedTotal: number;
  hijaiyahPercent: number;
  doaPercent: number;
  sholatPercent: number;
  lastQuizPercent: number;
  averageQuizPercent: number;
  quizSessions: number;
  learnedDoa: number;
}

export function toPercent(completed: number, total: number): number {
  if (!Number.isFinite(completed) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((completed / total) * 100)));
}

export function calculateLearningSummary(
  userProgress: UserProgressMap,
  quizHistory: readonly QuizHistory[],
  totals: ModuleTotals,
): LearningSummary {
  const progressValues = Object.values(userProgress);
  const hijaiyahCompleted = userProgress.hijaiyah?.completedItems.length ?? 0;
  const doaCompleted = userProgress.doa?.completedItems.length ?? 0;
  const sholatCompleted = userProgress.sholat?.completedItems.length ?? 0;
  const quizTotal = quizHistory.reduce((sum, item) => sum + item.scorePercent, 0);

  return {
    totalPoints: progressValues.reduce((sum, item) => sum + item.points, 0),
    completedTotal: progressValues.reduce((sum, item) => sum + item.completedItems.length, 0),
    hijaiyahPercent: toPercent(hijaiyahCompleted, totals.hijaiyah),
    doaPercent: toPercent(doaCompleted, totals.doa),
    sholatPercent: toPercent(sholatCompleted, totals.sholat),
    lastQuizPercent: quizHistory[0]?.scorePercent ?? 0,
    averageQuizPercent: quizHistory.length ? Math.round(quizTotal / quizHistory.length) : 0,
    quizSessions: quizHistory.length,
    learnedDoa: doaCompleted,
  };
}
