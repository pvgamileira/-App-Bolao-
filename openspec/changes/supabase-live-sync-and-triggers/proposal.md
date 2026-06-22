## Why

Manual updates of matches are tedious and prone to delays or errors. Integrating an external Live Sports API and automating score calculations via database triggers ensures real-time accuracy, eliminates manual overhead, and enhances the user experience by immediately reflecting live states.

## What Changes

- Add a Supabase Edge Function to fetch live match data from a standardized Sports API and upsert the data to `public.jogos`.
- Add a `status` column to the `public.jogos` table (e.g., 'SCHEDULED', 'LIVE', 'FINISHED').
- **BREAKING**: Move the 4-rule scoring logic from the client-side (`src/utils/scoreCalculator.ts`) to a secure PL/pgSQL database function and trigger that automatically scores guesses when a match status changes to 'FINISHED'.
- Update the UI in `MatchGrid.tsx` to read live match states, disable inputs for 'LIVE' and 'FINISHED' matches, and display a pulsating "LIVE" badge when a match is ongoing.

## Capabilities

### New Capabilities
- `live-sync`: Supabase Edge Function for syncing matches from an external API and updating the local database.
- `auto-scoring`: PostgreSQL PL/pgSQL function and trigger to automatically score user guesses when a match completes.

### Modified Capabilities
- `matches`: UI to reflect the live status of matches and lock score inputs during and after games.
- `score-calculator`: Logic porting from client-side TypeScript to PL/pgSQL.

## Impact

- **Database**: Schema alteration for `public.jogos` and addition of complex PL/pgSQL functions and triggers.
- **Backend**: Introduction of Supabase Edge Functions.
- **Frontend**: `MatchGrid.tsx` will have new visual states (LIVE badge, locked inputs) based on the new `status` property of matches. Client-side scoring logic might become obsolete or serve only as an optimistic preview.
