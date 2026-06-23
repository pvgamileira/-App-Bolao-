## 1. Database & Backend

- [x] 1.1 Create a new Supabase migration to add `tempo_decorrido` (text) to the `jogos` table.
- [x] 1.2 Update `supabase/functions/sync-matches/index.ts` to extract `event.status.displayClock` from the ESPN API payload and save it as `tempo_decorrido` in the database.

## 2. Frontend Types & UI

- [x] 2.1 Update the `Match` type in `src/components/MatchGrid.tsx` and the mapping logic in `src/App.tsx` to include `tempoDecorrido` (string | null). Ensure no TypeScript errors occur.
- [x] 2.2 Update `src/components/MatchGrid.tsx` to display `tempoDecorrido` next to the "AO VIVO" indicator.
- [x] 2.3 Update `src/components/MatchGrid.tsx` so that when `match.status === 'LIVE'`, score inputs are readonly and display `placarOficialA`/`placarOficialB`.
