## ADDED Requirements

### Requirement: Exact Match Scoring (Base Rule 1)
The system SHALL award exactly 5 points when a user's guess perfectly matches the official score of the match. No bonus points apply.

#### Scenario: User guesses exact score
- **WHEN** user guess is 2x1 and official score is 2x1
- **THEN** system awards 5 points

### Requirement: Winner or Draw Scoring (Base Rule 2)
The system SHALL award 3 points when a user correctly guesses the match outcome (winner or draw) but fails to guess the exact score.

#### Scenario: User guesses correct winner
- **WHEN** user guess is 1x0 and official score is 2x1
- **THEN** system awards 3 base points

#### Scenario: User guesses correct draw
- **WHEN** user guess is 1x1 and official score is 2x2
- **THEN** system awards 3 base points

### Requirement: Bonus for Exact Goal Difference
The system SHALL award 1 bonus point if the user correctly predicts the exact goal difference, provided they also correctly predicted the winner (Base Rule 2 applies).

#### Scenario: Exact goal difference matched
- **WHEN** official score is 3x1 (diff 2) and user guess is 2x0 (diff 2)
- **THEN** system awards 3 base points + 1 bonus point = 4 points total

### Requirement: Bonus for Exact Loser Goals
The system SHALL award 1 bonus point if the user correctly predicts the exact number of goals scored by the losing team, provided they correctly predicted the winner. This bonus does NOT apply to draws.

#### Scenario: Exact loser goals matched
- **WHEN** official score is 2x1 and user guess is 3x1
- **THEN** system awards 3 base points + 1 bonus point = 4 points total

### Requirement: Bonus for Blowout (Goleada)
The system SHALL award 1 bonus point if the user correctly predicts the winner AND the official match result is a blowout (goal difference >= 4).

#### Scenario: Blowout match result
- **WHEN** official score is 4x0 (diff 4) and user guess is 1x0 (diff 1)
- **THEN** system awards 3 base points + 1 bonus point = 4 points total

### Requirement: Maximum Points Cap
The system SHALL enforce a hard cap of 5 points maximum per match, regardless of how many bonuses apply.

#### Scenario: Multiple bonuses exceed 5 points
- **WHEN** official score is 4x0 and user guess is 5x1 (diff 4, diff is matched, blowout matched, loser goals matched)
- **THEN** system calculates 3 base + 1 (diff) + 1 (loser) + 1 (blowout) = 6 points, but caps the final award at 5 points.
