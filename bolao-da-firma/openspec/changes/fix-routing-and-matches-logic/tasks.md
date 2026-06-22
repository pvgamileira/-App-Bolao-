## 1. App Routing

- [x] 1.1 Update `src/App.tsx` to remove conditional `MatchGrid`/`LeaderboardPodium` rendering logic.
- [x] 1.2 Implement strict `<Routes>` with `<Route path="/" element={<AuthForm />} />`, `<Route path="/dashboard" element={<Layout><MatchGrid /></Layout>} />`, and `<Route path="/leaderboard" element={<Layout><LeaderboardPodium /></Layout>} />`.

## 2. Match Grid Data & UI Fixes

- [x] 2.1 Identify where `MatchGrid` data is fetched (e.g. `Dashboard.tsx`) and update the Supabase query to filter by `status IN ('SCHEDULED', 'LIVE', 'FINISHED')` ordered by `data_hora ASC` limit 15.
- [x] 2.2 Update `src/components/MatchGrid.tsx` to handle the empty state with the text: "Aguardando sincronização da API ou nenhum jogo próximo."
- [x] 2.3 Verify `MatchGrid.tsx` appropriately disables inputs and renders the correct badges ("LIVE" or "FINAL") for `LIVE` and `FINISHED` statuses.

## 3. Edge Function Fix

- [x] 3.1 Modify `supabase/functions/sync-live-matches/index.ts` to fetch from `https://api.football-data.org/v4/competitions/WC/matches`.
