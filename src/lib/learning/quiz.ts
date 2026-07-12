export interface IdentifiableLearningItem {
  id: string;
}

export interface QuizQuestion<T extends IdentifiableLearningItem> {
  options: T[];
  target: T;
}

export function shuffleItems<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createQuizQuestion<T extends IdentifiableLearningItem>(
  items: readonly T[],
  optionCount = 4,
  random: () => number = Math.random,
): QuizQuestion<T> {
  if (items.length < optionCount) {
    throw new Error(`Quiz requires at least ${optionCount} items`);
  }

  const options = shuffleItems(items, random).slice(0, optionCount);
  const target = options[Math.floor(random() * options.length)];
  return { options, target };
}

export function createQuizProgressItemId(sessionId: string, questionIndex: number): string {
  return `${sessionId}-question-${questionIndex + 1}`;
}
