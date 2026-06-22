## Why

Users in the workplace want to know what their colleagues are predicting to fuel the "secador" culture (cheering against a rival's bet). Currently, they can only see their own predictions in the grid and the global leaderboard. By introducing an in-context comparison feature, users can select a colleague and instantly overlay their bets directly beneath the score inputs.

## What Changes

- Import `supabase` client into `MatchGrid.tsx`.
- Establish a local state pipeline: fetch all users on mount to populate a header `<select>` dropdown.
- When a user is chosen from the dropdown, execute a secondary query to `palpites` to fetch their predictions and store them in a local object map (`peerGuesses`).
- Render a conditionally visible Tailwind-styled badge containing the peer's prediction below the main score inputs.

## Capabilities

### New Capabilities
- `peer-prediction-comparison`: Introduces a "spy" feature inside the match grid to analyze rival predictions.

### Modified Capabilities

## Impact

- `src/components/MatchGrid.tsx` (Major feature addition to the main layout loop)
