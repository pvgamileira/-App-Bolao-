import { calculateGuessPoints } from './scoreCalculator';

// simple tests, since we don't have vitest/jest setup right now, I'll just write it for when they are added.
// To test locally, I can just write a quick script or console.assert

const testCases = [
  // Exact Match: 5 points
  { guess: { scoreA: 2, scoreB: 1 }, official: { scoreA: 2, scoreB: 1 }, expected: 5 },
  // Goal Difference: +2, Winner Trend: +1 => Total: 3 points
  { guess: { scoreA: 2, scoreB: 0 }, official: { scoreA: 3, scoreB: 1 }, expected: 3 },
  // Goal Difference (missed by one): +2, Winner Trend: +1 => Total: 3 points
  { guess: { scoreA: 2, scoreB: 2 }, official: { scoreA: 2, scoreB: 1 }, expected: 2 }, // Wait, 2-2 is a tie, official 2-1 is A win. Trend bonus = 0. Missed by 1 = yes. Points = 2.
  { guess: { scoreA: 3, scoreB: 1 }, official: { scoreA: 2, scoreB: 1 }, expected: 3 }, // 3-1 is A win, official 2-1 is A win. Trend = 1. Missed A by 1 = yes. Points = 3.
  // Tie Exception:
  // Official tie (1-1), guess tie (2-2). Trend bonus is nullified. Exact diff (0) = yes (+2). Total: 2 points.
  { guess: { scoreA: 2, scoreB: 2 }, official: { scoreA: 1, scoreB: 1 }, expected: 2 },
  // Completely wrong
  { guess: { scoreA: 0, scoreB: 3 }, official: { scoreA: 2, scoreB: 1 }, expected: 0 },
];

testCases.forEach((tc, i) => {
  const points = calculateGuessPoints(tc.guess, tc.official);
  if (points !== tc.expected) {
    console.error(`Test ${i} failed. Expected ${tc.expected}, got ${points}. Guess: ${JSON.stringify(tc.guess)}, Official: ${JSON.stringify(tc.official)}`);
  }
});
