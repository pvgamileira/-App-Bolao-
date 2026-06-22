## ADDED Requirements

### Requirement: Database Idempotency
The system SHALL ensure that match data fetched from the external API does not create duplicate records. This MUST be handled by a unique `api_id` column in the `public.jogos` table.

#### Scenario: First time fetch
- **WHEN** the external API returns a match that does not exist in the database (no matching `api_id`)
- **THEN** the system inserts a new match record.

#### Scenario: Repeated fetch
- **WHEN** the external API returns a match that already exists in the database (matching `api_id`)
- **THEN** the system updates the existing match record instead of creating a new one.

### Requirement: External API Fetch and Sync
The system SHALL provide a background process (Supabase Edge Function) to fetch "today's" match data from the external sports API, map it to the database schema, and upsert it into `public.jogos`.

#### Scenario: Sync execution
- **WHEN** the sync function is triggered
- **THEN** it fetches data, maps `api_id`, `time_a`, `time_b`, `data_hora`, `placar_oficial_a`, `placar_oficial_b`, and `status`, and upserts into the database.

### Requirement: Frontend Live Match Handling
The frontend `MatchGrid` component SHALL react to the `status` column to disable input and show appropriate visual indicators.

#### Scenario: Match is live
- **WHEN** a match has `status === 'LIVE'`
- **THEN** the system disables the score prediction inputs for that match and displays a blinking "LIVE" badge.

#### Scenario: Match is finished
- **WHEN** a match has `status === 'FINISHED'`
- **THEN** the system disables the score prediction inputs for that match and displays the final official score.
