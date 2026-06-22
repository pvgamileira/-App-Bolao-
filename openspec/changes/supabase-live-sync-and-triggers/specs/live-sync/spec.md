## ADDED Requirements

### Requirement: Live Matches Edge Function
The system SHALL include a Supabase Edge Function (`sync-live-matches`) that fetches data from an external Sports API.
- The function MUST map the API response to the `public.jogos` schema.
- The function MUST perform a bulk `UPSERT` on `public.jogos` to update `placar_oficial_a`, `placar_oficial_b`, and `status`.
- The function MUST gracefully handle null values for scores (e.g., before a match starts or during halftime where the API might omit them).

#### Scenario: Edge Function runs
Given a scheduled cron job triggers the Edge Function
When the function fetches live data
Then it updates the local `jogos` table with the current score and status.
