## Context

Currently, the application relies on manual data entry or non-automated processes for World Cup matches. With live matches, latency and data freshness are critical. We need to integrate an external sports API (e.g., API-Football) to automatically sync live scores and match statuses directly into our Supabase `public.jogos` table, which in turn will feed real-time updates to the frontend via Supabase real-time subscriptions or simple polling.

## Goals / Non-Goals

**Goals:**
- Automatically fetch live match data and update our database.
- Establish an idempotent upsert process to avoid duplicating matches on repeated fetching.
- Reflect live statuses ("SCHEDULED", "LIVE", "FINISHED") and scores on the frontend accurately.
- Provide a responsive UI that restricts user input on active/finished matches.

**Non-Goals:**
- Handling player statistics, cards, or substitutions.
- Supporting multiple simultaneous external APIs.
- Pushing updates via WebSockets directly from the Edge Function (we'll rely on the database as the source of truth).

## Decisions

**Idempotency via `api_id`:**
- *Decision:* Add a unique `api_id` column to `public.jogos`.
- *Rationale:* We need a stable external reference to avoid creating duplicate match records during recurring cron executions. Using the external API's native match ID provides this constraint naturally.

**Supabase Edge Function for Sync Logic:**
- *Decision:* Build a Deno/TypeScript Edge Function instead of an external Node.js cron server.
- *Rationale:* Keeps the backend architecture self-contained within Supabase. The function can be scheduled via pg_cron or Supabase's scheduled functions. It will securely utilize `SUPABASE_SERVICE_ROLE_KEY` to bypass Row-Level Security for backend inserts.

**Frontend Resilience:**
- *Decision:* React components will derive state strictly from the `status` column. When `status` is `LIVE` or `FINISHED`, prediction inputs are disabled.
- *Rationale:* Relying on the centralized database state ensures all users see the exact same match status simultaneously, preventing late submissions.

## Risks / Trade-offs

- **Risk:** API Rate Limiting. The external sports API may restrict the frequency of requests.
  - *Mitigation:* Ensure the Edge Function's polling interval respects the rate limits and only fetches matches relevant for "today".
- **Risk:** Transient API Failures.
  - *Mitigation:* Implement robust try/catch blocks within the Edge Function to log errors without crashing the sync process, allowing subsequent runs to recover.
