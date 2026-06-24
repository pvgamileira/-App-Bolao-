## Why

The leaderboard points in the app do not match the official manual PDF calculations ("Palpites da Copa") maintained up to June 22nd, 2026. Currently, all users show `pontos_legado = 0` in the database, and the frontend only sums `pontos_ganhos` from the `palpites` table. This means the app's leaderboard reflects only the auto-calculated points from the scoring trigger — it ignores any historical baseline from the PDF. The official PDF totals (Enos: 94, Gabriel: 106, Jairo: 90, Paulo: 92, Thyago: 104) need to be reconciled with the database so the leaderboard is authoritative and trustworthy.

## What Changes

- **Database**: Calculate and set `pontos_legado` for each user in the `usuarios` table using the formula: `pontos_legado = PDF_target - sum(pontos_ganhos for matches on or before 2026-06-22)`. This ensures no point duplication — legacy covers only the gap between what the PDF says and what the trigger already calculated for pre-cutoff matches.
- **Frontend**: Update the leaderboard calculation in `App.tsx` to include `pontos_legado` in the total: `points = pontos_legado + sum(pontos_ganhos)`. Currently line 75 of `App.tsx` ignores `pontos_legado` entirely.
- **Tooling**: Create a local Node.js script (`scripts/sync_legacy_points.cjs`) using native `fetch` against the Supabase REST API (avoiding `@supabase/supabase-js` WebSocket issues on Node 20) to perform the one-time database correction.

## Capabilities

### New Capabilities
- `legacy-points-sync`: One-time script to reconcile the `pontos_legado` column in `usuarios` against the official PDF targets, scoped to matches on or before the cutoff date (2026-06-22).

### Modified Capabilities
_(none — no existing spec-level requirements change)_

## Impact

- **Database (`usuarios` table)**: The `pontos_legado` column will be updated from `0` to the calculated difference for all 5 users.
- **Frontend (`src/App.tsx`)**: The `fetchLeaderboard` function must add `pontos_legado` to the points total. This is a one-line change.
- **No breaking changes**: The scoring trigger, Realtime subscriptions, and all other systems remain untouched.
- **Risk mitigation**: The script is idempotent — running it multiple times produces the same result because it always recalculates from scratch using `Target - Sum(pre-cutoff gains)`.
