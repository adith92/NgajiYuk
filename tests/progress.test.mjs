import test from "node:test";
import assert from "node:assert/strict";
import { calculateLearningSummary, toPercent } from "../src/lib/learning/progress.ts";

const progress = {
  hijaiyah: {
    moduleId: "hijaiyah",
    completedItems: ["alif", "ba", "ta"],
    points: 30,
    updatedAt: 1,
  },
  doa: {
    moduleId: "doa",
    completedItems: ["tidur", "bangun"],
    points: 40,
    updatedAt: 2,
  },
  sholat: {
    moduleId: "sholat",
    completedItems: ["niat"],
    points: 15,
    updatedAt: 3,
  },
};

const history = [
  {
    id: "quiz-2",
    moduleId: "kuis_hijaiyah",
    totalQuestions: 10,
    correctAnswers: 9,
    wrongAnswers: 1,
    scorePercent: 90,
    passed: true,
    rewardMinutes: 30,
    createdAt: 2,
  },
  {
    id: "quiz-1",
    moduleId: "kuis_hijaiyah",
    totalQuestions: 10,
    correctAnswers: 8,
    wrongAnswers: 2,
    scorePercent: 80,
    passed: true,
    rewardMinutes: 15,
    createdAt: 1,
  },
];

test("toPercent clamps invalid and overflowing values", () => {
  assert.equal(toPercent(3, 0), 0);
  assert.equal(toPercent(-2, 10), 0);
  assert.equal(toPercent(20, 10), 100);
  assert.equal(toPercent(1, 3), 33);
});

test("calculateLearningSummary aggregates points, completion, and quiz metrics", () => {
  const summary = calculateLearningSummary(progress, history, {
    hijaiyah: 6,
    doa: 4,
    sholat: 2,
  });

  assert.equal(summary.totalPoints, 85);
  assert.equal(summary.completedTotal, 6);
  assert.equal(summary.hijaiyahPercent, 50);
  assert.equal(summary.doaPercent, 50);
  assert.equal(summary.sholatPercent, 50);
  assert.equal(summary.lastQuizPercent, 90);
  assert.equal(summary.averageQuizPercent, 85);
  assert.equal(summary.quizSessions, 2);
  assert.equal(summary.learnedDoa, 2);
});

test("calculateLearningSummary returns safe defaults for a new profile", () => {
  const summary = calculateLearningSummary({}, [], {
    hijaiyah: 29,
    doa: 12,
    sholat: 10,
  });

  assert.deepEqual(summary, {
    totalPoints: 0,
    completedTotal: 0,
    hijaiyahPercent: 0,
    doaPercent: 0,
    sholatPercent: 0,
    lastQuizPercent: 0,
    averageQuizPercent: 0,
    quizSessions: 0,
    learnedDoa: 0,
  });
});
