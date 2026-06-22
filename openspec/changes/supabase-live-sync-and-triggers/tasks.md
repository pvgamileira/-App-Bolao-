## 1. Database Migrations & Triggers

- [x] 1.1 Create `automation_triggers.sql` that alters `public.jogos` to add `status VARCHAR DEFAULT 'SCHEDULED'`.
- [x] 1.2 Implement the PL/pgSQL function `update_user_points_on_match_finish()` with the 4-rule scoring logic.
- [x] 1.3 Attach the `update_user_points_on_match_finish` function as an `AFTER UPDATE` trigger on `public.jogos` restricted to when `status` changes to `'FINISHED'`.

## 2. Supabase Edge Function

- [x] 2.1 Scaffold the `sync-live-matches` Edge Function in `supabase/functions/sync-live-matches/index.ts`.
- [x] 2.2 Implement the API fetch logic, mapping external payload to the `public.jogos` schema.
- [x] 2.3 Implement the defensive upsert query that gracefully handles null scores and updates `placar_oficial_a`, `placar_oficial_b`, and `status`.

## 3. UI Synchronization

- [x] 3.1 Update `src/components/MatchGrid.tsx` to read the `status` property of the match.
- [x] 3.2 Implement a pulsating "LIVE" badge for matches with `status === 'LIVE'`.
- [x] 3.3 Disable the score inputs for matches that are 'LIVE' or 'FINISHED'.
