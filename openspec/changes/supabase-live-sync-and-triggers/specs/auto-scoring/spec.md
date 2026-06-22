## ADDED Requirements

### Requirement: PL/pgSQL Auto-Scoring Trigger
The system SHALL use a PostgreSQL trigger named `update_user_points_on_match_finish` on the `public.jogos` table.
- The trigger MUST execute `AFTER UPDATE` on `public.jogos`.
- The trigger MUST only process rows where the `status` changes to `'FINISHED'`.

### Requirement: Core Calculation Logic in Trigger
The database function MUST apply the following scoring logic to all corresponding rows in `public.palpites`:
1. **Exact Score:** If guess == official -> +5 points.
2. **Approximate:** If not exact, +2 points if the goal difference matches OR user missed either team's score by exactly 1 goal.
3. **Trend:** +1 point if the winner outcome is correct (stacks with rule 2).
4. **Tie Exception:** If the official match is a tie, and the user guessed a different tie, nullify the trend bonus.
- The function MUST update `pontos_ganhos` in the `public.palpites` table.
