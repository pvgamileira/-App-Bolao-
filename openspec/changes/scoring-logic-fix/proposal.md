## Why

Currently, the scoring logic does not accurately reflect the detailed rules established in the Bolão da Firma (e.g., 5 points for exact match, 3 points for guessing the winner/draw, plus specific bonus points for goal difference and blowouts). We need to replace the existing PL/pgSQL trigger function to correctly compute points according to the established game rules and cap them at a maximum of 5 points per match.

## What Changes

- Replace the existing Supabase SQL trigger function (`update_user_points_on_match_finish`) with a new version.
- Implement Base Rule 1: 5 points for an exact score guess.
- Implement Base Rule 2: 3 points for correctly guessing the winner or a draw without the exact score.
- Implement Bonus Rules (only apply to Base Rule 2, capping at 5 points):
  - +1 point for guessing the exact goal difference.
  - +1 point for guessing the exact goals scored by the losing team (does not apply to draws).
  - +1 point if the real match result is a blowout (goleada) with a goal difference >= 4.
- Ensure the function handles null values gracefully and iterates over all valid predictions for a match.

## Capabilities

### New Capabilities
- `scoring-logic-fix`: Defines the precise set of rules and bonuses for calculating points when a match is finished.

### Modified Capabilities
- (None - The previous scoring logic was basic and undocumented via specs)

## Impact

- **Database**: Replaces the `update_user_points_on_match_finish` trigger function in Supabase.
- **Backend Data**: Updates the `pontos_ganhos` column in the `palpites` table, which subsequently feeds the leaderboard on the frontend.
- No frontend UI code needs to be changed for this calculation.
