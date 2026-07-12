import test from "node:test";
import assert from "node:assert/strict";
import { normalizeArabic, normalizeLatin, stringSimilarity } from "../src/lib/utils.ts";

test("normalizeArabic removes common harakat while preserving letters", () => {
  assert.equal(normalizeArabic("بِسْمِ اللَّهِ"), "بسم الله");
});

test("normalizeLatin creates a stable comparison value", () => {
  assert.equal(normalizeLatin("Bismillah, 123!"), "bismillah123");
});

test("stringSimilarity returns one for identical content", () => {
  assert.equal(stringSimilarity("alif", "alif"), 1);
});

test("stringSimilarity grades partial matches between zero and one", () => {
  const score = stringSimilarity("bismillah", "bismila");
  assert.ok(score > 0.7);
  assert.ok(score < 1);
});

test("stringSimilarity handles two empty strings", () => {
  assert.equal(stringSimilarity("", ""), 1);
});
