## ADDED Requirements

### Requirement: Exact Score Match
The system SHALL award 5 points when a user's prediction matches the exact official score.

#### Scenario: Exact score prediction
- **WHEN** a user predicts Team A 2 - 1 Team B and the official score is Team A 2 - 1 Team B
- **THEN** the system returns 5 points.

### Requirement: Goal Difference or Margin Match
The system SHALL award 2 points when the user predicts the correct goal difference OR misses one team's score by exactly 1 goal (without matching the exact score).

#### Scenario: Correct goal difference
- **WHEN** a user predicts A 3 - 1 B (diff 2) and the official score is A 2 - 0 B (diff 2)
- **THEN** the system awards 2 points (plus winner bonus if applicable).

#### Scenario: Missed by one goal
- **WHEN** a user predicts A 2 - 1 B and the official score is A 2 - 0 B
- **THEN** the system awards 2 points (plus winner bonus if applicable).

### Requirement: Correct Winner Bonus
The system SHALL award an additional 1 point when the user correctly predicts the match outcome (Team A wins, Team B wins, or Draw).

#### Scenario: Winner predicted correctly
- **WHEN** user predicts A 2 - 0 B and official score is A 3 - 1 B
- **THEN** system awards +1 point for predicting Team A victory.

### Requirement: Draw Bonus Exception
The system SHALL NOT award the 1-point winner bonus if the official match is a draw but the user did not predict the exact draw score.

#### Scenario: Inexact draw prediction
- **WHEN** the official score is A 1 - 1 B, but the user predicted A 2 - 2 B
- **THEN** the system does not award the +1 winner bonus (the user still receives the +2 margin bonus, resulting in 2 points total).
