## ADDED Requirements

### Requirement: React App Real-Time Synchronization
The system SHALL synchronize the UI in real-time with the `jogos` and `palpites` tables using Supabase WebSockets.

#### Scenario: Match score is updated via Edge Function
- **WHEN** the `jogos` table receives an `UPDATE` event from the backend
- **THEN** the React frontend updates its global `matches` state immediately without reloading the page
- **AND** the UI reflects the new match score and status (e.g., Live) in milliseconds

#### Scenario: Participant submits a new guess
- **WHEN** a user inserts or updates a row in the `palpites` table
- **THEN** the React frontend catches the `INSERT` or `UPDATE` payload via WebSockets
- **AND** updates the displayed peer guesses globally without a manual refresh
