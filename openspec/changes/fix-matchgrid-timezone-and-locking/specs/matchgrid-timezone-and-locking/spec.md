## ADDED Requirements

### Requirement: Database-Driven State
All match input states SHALL be controlled entirely by the `status` column from `public.jogos`.

#### Scenario: Match is SCHEDULED
- **WHEN** the match `status` is `SCHEDULED`
- **THEN** inputs and buttons MUST be enabled.

#### Scenario: Match is LIVE or FINISHED
- **WHEN** the match `status` is `LIVE` or `FINISHED`
- **THEN** inputs MUST be disabled.

### Requirement: Robust Fetching
Matches SHALL be fetched sequentially without strict date boundaries.

#### Scenario: Loading matches
- **WHEN** `fetchMatches` executes
- **THEN** it fetches up to 10 upcoming or recent matches ordered by `data_hora ASC`.
