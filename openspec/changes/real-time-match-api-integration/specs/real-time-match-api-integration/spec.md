## ADDED Requirements

### Requirement: Persist Elapsed Match Time
The system SHALL extract and save the elapsed match time provided by the external API.

#### Scenario: Syncing matches from ESPN API
- **WHEN** the `sync-matches` Edge Function processes an event
- **THEN** it extracts `event.status.displayClock` and saves it to the `tempo_decorrido` column in the `jogos` table

### Requirement: Display Elapsed Time in UI
The system SHALL display the elapsed match time dynamically next to the "AO VIVO" status indicator.

#### Scenario: User views a live match
- **WHEN** the match status is `LIVE`
- **THEN** the UI displays the elapsed time (e.g., "45'") next to the "AO VIVO" badge

### Requirement: Lock Score Inputs During Live Matches
The system SHALL prevent users from submitting predictions for matches that have already started.

#### Scenario: User tries to predict a live match
- **WHEN** the match status is `LIVE`
- **THEN** the score input fields are readonly
- **THEN** the official consolidated live score is displayed within the input fields
