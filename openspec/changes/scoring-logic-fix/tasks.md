## 1. Database Migration

- [x] 1.1 Create a new Supabase migration file (e.g., `supabase/migrations/XXXXXXXXXXXXXX_update_points_trigger.sql`).
- [x] 1.2 Write the `CREATE OR REPLACE FUNCTION update_user_points_on_match_finish()` PL/pgSQL script implementing the 5-point exact match rule.
- [x] 1.3 Add logic for Base Rule 2 (3 points for winner/draw) within the trigger function.
- [x] 1.4 Add bonus logic (+1 exact goal diff, +1 exact loser goals, +1 blowout) into the trigger function.
- [x] 1.5 Wrap the total points in a `LEAST(pontos, 5)` to enforce the maximum points cap.
- [x] 1.6 Ensure the trigger correctly loops over all valid `palpites` for the updated match and handles potential null values safely.
