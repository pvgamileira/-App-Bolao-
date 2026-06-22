## Why

To automate the synchronization of live World Cup matches directly into our database (`public.jogos`), we need a robust backend process. This solves the problem of manual updates and ensures users get real-time scores and status updates without duplicate matches. Doing this now provides a stable architecture before live matches occur.

## What Changes

- Add a new `api_id` column to the `public.jogos` table to ensure idempotency.
- Create a Supabase Edge Function (`sync-worldcup`) to fetch match data from an external sports API and upsert it into the database.
- Update the frontend (`MatchGrid.tsx`) to handle live match statuses (`LIVE`, `FINISHED`) with appropriate UI feedback (e.g., blinking badges and disabled score inputs).

## Capabilities

### New Capabilities
- `live-worldcup-api-sync`: Capability to fetch live match data from an external sports API and synchronize it into the `public.jogos` table, updating live scores and statuses.

### Modified Capabilities

## Impact

- Database Schema: `public.jogos`
- Backend: Supabase Edge Functions (`supabase/functions/sync-worldcup/index.ts`)
- Frontend: React components (`src/components/MatchGrid.tsx`)
