## Why

Users need to see the match's live elapsed time (e.g., "45'") and understand that while a match is ongoing ("AO VIVO"), score inputs are locked down but the current live score is displayed, mirroring the behavior of a finished match.

## What Changes

- Add a `tempo_decorrido` (VARCHAR) column to the `jogos` table using a Supabase SQL migration.
- Update the `sync-matches/index.ts` Edge Function to extract `event.status.displayClock` from the ESPN API and save it to the DB.
- Update the UI `MatchGrid.tsx`:
  - Show the elapsed match time dynamically next to the "AO VIVO" badge.
  - Make input fields readonly when a match is `LIVE`.
  - Display the official live score inside the inputs.
- Ensure all data interfaces in the frontend (e.g., `Match` type in `MatchGrid.tsx` and `App.tsx`) include the `tempoDecorrido` field correctly.

## Capabilities

### New Capabilities
- `real-time-match-api-integration`: Live score and time fetching from ESPN API.

### Modified Capabilities


## Impact

- `supabase/migrations/*`
- `supabase/functions/sync-matches/index.ts`
- `src/App.tsx`
- `src/components/MatchGrid.tsx`
