## 1. Create Legacy Points Sync Script

- [x] 1.1 Create `scripts/sync_legacy_points.cjs` using native `fetch` against the Supabase REST API (read env vars from `.env.local`).
- [x] 1.2 Hardcode the PDF target points map: `{ ENOS: 94, GABRIEL: 106, JAIRO: 90, PAULO: 92, THYAGO: 104 }`.
- [x] 1.3 Fetch all users from `usuarios` table (fields: `id`, `nome_guerra`).
- [x] 1.4 Fetch all `palpites` joined with `jogos` (fields: `usuario_id`, `pontos_ganhos`, `jogos(data_hora)`).
- [x] 1.5 Filter palpites to only those where `jogos.data_hora <= '2026-06-22T23:59:59Z'` and sum `pontos_ganhos` per user.
- [x] 1.6 Calculate `pontos_legado = PDF_target - sum_pre_cutoff_points` for each user. Log a warning if the result is negative.
- [x] 1.7 PATCH (update) the `pontos_legado` column in `usuarios` for each user via the REST API.
- [x] 1.8 Print a summary table showing each user's name, PDF target, pre-cutoff sum, calculated legacy, and expected new total.


## 2. Fix Frontend Leaderboard Calculation

- [x] 2.1 In `src/App.tsx`, update `fetchLeaderboard` (line 75) to add `pontos_legado` to the total: `points: (u.pontos_legado || 0) + palpitesPoints`.

## 3. Verification

- [x] 3.1 Run the sync script and confirm the printed summary matches expectations.
- [x] 3.2 Verify the app leaderboard in the browser reflects the correct totals (PDF baseline + post-cutoff points).
- [x] 3.3 Run the sync script a second time and confirm output is identical (idempotency check).
