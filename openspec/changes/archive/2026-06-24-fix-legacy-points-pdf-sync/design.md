## Context

The "Bolão da Copa" app tracks a group of 5 users competing in a World Cup prediction game. Points were historically tracked in a shared Excel/PDF document ("Palpites da Copa"). The app was built mid-tournament, so many matches already had official scores and user guesses recorded in the PDF before the database existed.

**Current state:**
- The `usuarios` table has a `pontos_legado` column (currently `0` for all users) intended to carry forward pre-app points.
- The `palpites` table has `pontos_ganhos` calculated automatically by a Postgres trigger (`update_user_points_on_match_finish`) whenever a match transitions to `FINISHED`.
- The frontend (`App.tsx` line 75) computes the leaderboard as `sum(pontos_ganhos)` only — it does **not** add `pontos_legado`.
- The PDF official totals as of June 22nd are: Enos: 94, Gabriel: 106, Jairo: 90, Paulo: 92, Thyago: 104.
- The database trigger has already calculated `pontos_ganhos` for all FINISHED matches, including those before the cutoff. A verification script confirmed 0 mismatches between the trigger's math and the scoring rules.

**Constraint:** The Supabase JS client throws WebSocket errors on Node 20 (no native WebSocket), so any local scripts must use the native `fetch` API against the Supabase REST endpoint instead.

## Goals / Non-Goals

**Goals:**
- Set `pontos_legado` for each user such that `pontos_legado + sum(all pontos_ganhos)` equals the PDF target plus any points earned after June 22nd.
- Fix the frontend to include `pontos_legado` in the leaderboard total.
- Ensure the fix is idempotent — running the script multiple times always produces the same correct result.

**Non-Goals:**
- Modifying the scoring trigger logic (already verified correct).
- Changing how `pontos_ganhos` is calculated for individual matches.
- Retroactively correcting individual palpite records from the PDF.
- Supporting ongoing manual PDF-based scoring — after this fix, all future scoring is fully automated.

## Decisions

### Decision 1: Use `pontos_legado = PDF_target - sum(pontos_ganhos where data_hora <= cutoff)` formula

**Rationale:** This formula avoids double-counting. The trigger already computed `pontos_ganhos` for pre-cutoff matches. By subtracting that sum from the PDF target, `pontos_legado` captures only the *delta* — the difference the PDF claims vs. what the trigger calculated. The frontend then adds `pontos_legado + sum(all pontos_ganhos)`, which yields `PDF_target + sum(post-cutoff pontos_ganhos)`.

**Alternative considered:** Setting `pontos_legado = PDF_target` directly. Rejected because this would double-count pre-cutoff points (once in `pontos_legado`, again in `pontos_ganhos`).

### Decision 2: Use native `fetch` against Supabase REST API in the correction script

**Rationale:** The `@supabase/supabase-js` package requires WebSocket support which Node 20 lacks natively. Using `fetch` (available in Node 18+) avoids adding `ws` as a dependency for a one-time script.

### Decision 3: Fix frontend to add `pontos_legado` to leaderboard total

**Rationale:** The current code on line 75 of `App.tsx` uses `points: palpitesPoints` without adding the legacy value. This is a one-line fix: `points: (u.pontos_legado || 0) + palpitesPoints`. Without this, even after setting `pontos_legado` in the DB, the leaderboard would still show only trigger-calculated points.

## Risks / Trade-offs

- **[Risk] Cutoff date boundary ambiguity** → Mitigation: Use `data_hora <= '2026-06-22T23:59:59Z'` to include all matches on June 22nd regardless of timezone. The ESPN API stores timestamps in UTC.
- **[Risk] Script re-run after new matches finish before cutoff correction** → Mitigation: The formula recalculates from scratch each time (idempotent). No incremental state.
- **[Risk] PDF totals have human error** → Mitigation: The user has explicitly stated the PDF is the authoritative source. Accept it as ground truth.
- **[Risk] `pontos_legado` could be negative if trigger computed more points than the PDF claims** → Mitigation: Log a warning but still apply. This would indicate the PDF under-counted, which the user can investigate.
