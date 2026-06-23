## ADDED Requirements

### Requirement: ESPN API Sync
The system SHALL provide a script or backend endpoint capable of querying the ESPN API for 2026 World Cup data and upserting the parsed match data into the local Supabase `jogos` table, updating teams, scores, and match states.

#### Scenario: Running the ESPN Sync script
- **WHEN** the sync script is executed
- **THEN** it fetches data from the ESPN events endpoint
- **THEN** it translates the ESPN match status and scores into the `jogos` table (`placar_oficial_a`, `placar_oficial_b`, `status` = SCHEDULED/FINISHED/LIVE)
