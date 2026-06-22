type Score = {
  scoreA: number;
  scoreB: number;
};

/**
 * Calculates the points earned by a user's guess compared to the official match score.
 * 
 * Rules:
 * 1. Exact Match (+5 points): Guess exactly matches official score.
 * 2. Goal Difference (+2 points): Correctly predicted the exact goal difference, OR missed the score of either team by exactly 1 goal.
 * 3. Winner Trend (+1 point): Correctly guessed the match outcome (Team A win or Team B win). Stacks with Rule 2.
 * 4. Tie Exception: If the official match is a tie, and the user predicted a different non-exact tie, the winner trend bonus is nullified.
 */
export function calculateGuessPoints(guess: Score, official: Score): number {
  let points = 0;

  // Rule 1: Exact Match (+5 points)
  if (guess.scoreA === official.scoreA && guess.scoreB === official.scoreB) {
    return 5;
  }

  // Calculate outcomes and differences
  const officialDiff = official.scoreA - official.scoreB;
  const guessDiff = guess.scoreA - guess.scoreB;
  
  const officialOutcome = officialDiff > 0 ? 'A_WIN' : officialDiff < 0 ? 'B_WIN' : 'TIE';
  const guessOutcome = guessDiff > 0 ? 'A_WIN' : guessDiff < 0 ? 'B_WIN' : 'TIE';



  // Rule 3 & 4: Winner Trend (+1 point) and Tie Exception
  if (officialOutcome === guessOutcome) {
    if (officialOutcome !== 'TIE') {
      points += 1;
    }
  }

  // Rule 2: Goal Difference (+2 points)
  // Condition A: Correctly predicted the exact goal difference
  const isExactDiff = officialDiff === guessDiff;
  
  // Condition B: Missed the score of either team by exactly 1 goal
  // Since "either team" is a bit ambiguous, interpreting it as:
  // (missed team A by 1 AND got team B right) OR (missed team B by 1 AND got team A right)
  // Let's re-read: "missed the score of either team by exactly 1 goal (e.g., official 2-1, guess 2-2 or 3-1)"
  const missedAByOne = Math.abs(guess.scoreA - official.scoreA) === 1 && guess.scoreB === official.scoreB;
  const missedBByOne = Math.abs(guess.scoreB - official.scoreB) === 1 && guess.scoreA === official.scoreA;
  const isMissedByOne = missedAByOne || missedBByOne;

  if (isExactDiff || isMissedByOne) {
    points += 2;
  }

  return points;
}
