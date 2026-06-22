## Context

Currently, match scores and statuses must be updated manually. This causes delays in reflecting match outcomes and updating user rankings. To provide a real-time, engaging experience, the application needs to automatically sync live data from an external Sports API (like API-Football) and automatically score user guesses when a match ends.

## Goals / Non-Goals

**Goals:**
- Automate the fetching of live match data using a scheduled Supabase Edge Function.
- Introduce a new `status` column to track match states ('SCHEDULED', 'LIVE', 'FINISHED').
- Automate user scoring by migrating the 4-rule scoring logic into a PostgreSQL trigger.
- Update the UI (`MatchGrid.tsx`) to react to match states: disabling guess inputs and showing live badges.

**Non-Goals:**
- Full integration with a specific vendor's API key right now (the edge function will assume a standard JSON payload format).
- Real-time WebSockets/Supabase Realtime subscriptions in the UI (users might need to refresh or the app can poll, although real-time could be added later).

## Decisions

- **Supabase Edge Functions for Syncing:** We use an Edge Function instead of a traditional backend worker. It's serverless, scales automatically, and integrates seamlessly with our Supabase project. The function will run on a cron schedule (using pg_cron or Supabase's scheduled functions).
- **PL/pgSQL Trigger for Auto-Scoring:** Moving the scoring logic to the database ensures it runs transactionally the moment a match is marked as 'FINISHED'. This prevents discrepancies between the client and server and avoids the need for a separate batch processing job.
  - *Alternative Considered:* Calculating scores in the Edge Function. *Rejected because* database triggers guarantee consistency and keep data mutation logic close to the data itself, preventing race conditions.
- **Handling Null/Blank Scores:** The API might return null scores during halftime or before a match starts. The Edge Function must explicitly handle nulls and only update `placar_oficial_a` and `placar_oficial_b` if they are valid numbers.

## Risks / Trade-offs

- **[Risk] API Rate Limits:** Polling the sports API too frequently could exhaust rate limits. 
  - *Mitigation:* The Edge Function should run only at reasonable intervals (e.g., every 1-5 minutes) and specifically target matches that are expected to be live based on `data_hora`.
- **[Risk] Trigger Performance:** A massive number of users guessing on a single match could slow down the `update` query if the trigger loops through thousands of rows sequentially.
  - *Mitigation:* The `update_user_points_on_match_finish()` function will use an efficient bulk update query rather than an explicit `FOR` loop if possible, though a loop on thousands of rows is still generally fast enough in PostgreSQL.
