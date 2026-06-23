## Context

The previous scoring system (`update_user_points_on_match_finish`) used a basic algorithm to calculate points when a match finished. The requirements from the "Bolão da Firma" introduce a more nuanced rule set: 5 points for a perfect score match, 3 points for getting the winner or draw, and various +1 point bonuses (exact goal difference, exact loser goals, blowout win). We need to write a new PL/pgSQL function to handle this robustly.

## Goals / Non-Goals

**Goals:**
- Implement the exact scoring matrix as described by the user.
- Calculate and update the `pontos_ganhos` column in the `palpites` table via a Supabase Trigger function.
- Cap the maximum points for a single match at 5 points.
- Ensure edge cases like null predictions are handled gracefully.

**Non-Goals:**
- Modifying the frontend application logic (the frontend reads from `pontos_ganhos` seamlessly).
- Handling backfilling of old matches (unless explicitly triggered).

## Decisions

- **PL/pgSQL Implementation**: The calculation will occur purely inside the Postgres database using a trigger on the `jogos` table that fires after an update when `status` changes to 'FINISHED'.
- **Bonus Capping**: The code will calculate Base Rule 2 (3 points) and then add any applicable bonuses, finally capping the sum using `LEAST(pontos, 5)`.
- **Blowout Definition**: A blowout ("goleada") is defined specifically as an absolute goal difference of 4 or more.

## Risks / Trade-offs

- [Risk] Database performance with a massive number of users. → The query updates `palpites` in a single pass after a match finishes, which scales extremely well for this scope.
- [Risk] Null score updates triggering bad logic. → Explicit COALESCE and NULL checks will be added in PL/pgSQL.

## Migration Plan
Run the new SQL migration which will use `CREATE OR REPLACE FUNCTION` and `DROP/CREATE TRIGGER` to cleanly override the existing trigger.
