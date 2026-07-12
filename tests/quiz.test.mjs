import test from "node:test";
import assert from "node:assert/strict";
import {
  createQuizProgressItemId,
  createQuizQuestion,
  shuffleItems,
} from "../src/lib/learning/quiz.ts";

const items = [
  { id: "alif" },
  { id: "ba" },
  { id: "ta" },
  { id: "tsa" },
  { id: "jim" },
];

test("shuffleItems does not mutate the source array", () => {
  const source = [...items];
  const result = shuffleItems(source, () => 0.25);
  assert.deepEqual(source, items);
  assert.notStrictEqual(result, source);
});

test("createQuizQuestion returns unique options and a target from those options", () => {
  const question = createQuizQuestion(items, 4, () => 0.42);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((item) => item.id)).size, 4);
  assert.ok(question.options.some((item) => item.id === question.target.id));
});

test("createQuizQuestion rejects an undersized item pool", () => {
  assert.throws(() => createQuizQuestion(items.slice(0, 2), 4), /requires at least 4 items/);
});

test("progress item IDs remain stable inside one quiz session", () => {
  assert.equal(createQuizProgressItemId("session-abc", 0), "session-abc-question-1");
  assert.equal(createQuizProgressItemId("session-abc", 9), "session-abc-question-10");
});
