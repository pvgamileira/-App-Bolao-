## ADDED Requirements

### Requirement: Score Calculation Logic
The system SHALL calculate points for each guess based on strict rules: Exact Match (+5), Goal Difference (+2), Winner Trend (+1), Tie Exception (nullify trend bonus).

#### Scenario: Exact match
- **WHEN** user guess exactly matches the official score
- **THEN** the calculation returns 5 points.

#### Scenario: Approximate match (goal difference)
- **WHEN** user guesses the exact goal difference (e.g., official 3-1, guess 2-0)
- **THEN** the calculation returns at least 2 points.

#### Scenario: Winner trend
- **WHEN** user correctly guesses the match outcome (e.g., Team A wins) but not exact score or difference
- **THEN** the calculation adds 1 point.
