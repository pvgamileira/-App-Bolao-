## Why

The current UI suffers from a monolithic layout bug where `/dashboard` and `/leaderboard` render identically, causing navigation confusion. Additionally, the MatchGrid strictly filters by "today's date", breaking due to timezone differences, and does not correctly restrict input fields based on match statuses. Finally, the Edge Function lacks the competition filter required by `football-data.org` to function properly. This change ensures proper routing, correct match querying and UI logic, and robust external API integration.

## What Changes

- Implement strict React Router separation in `App.tsx` for `/`, `/dashboard`, and `/leaderboard`.
- Change `MatchGrid` query logic to fetch based on status (`SCHEDULED`, `LIVE`, `FINISHED`) and limit to 15 ordered by `data_hora`, instead of filtering by today's date.
- Update `MatchGrid` UI to disable inputs for `LIVE` and `FINISHED` matches, displaying appropriate badges ("LIVE" or "FINAL").
- Implement an empty state when no matches are found: "Aguardando sincronização da API ou nenhum jogo próximo."
- Update Edge Function to target `competitions/WC/matches` for the World Cup.

## Capabilities

### New Capabilities
- `routing-and-matches-logic`: Strict React Router paths and improved MatchGrid data querying, state handling, and Edge Function API parameters.

### Modified Capabilities

## Impact

- React Application: `src/App.tsx`
- Components: `src/components/MatchGrid.tsx`
- Edge Functions: `supabase/functions/sync-live-matches/index.ts`
