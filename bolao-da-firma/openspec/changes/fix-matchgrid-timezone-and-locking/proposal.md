## Why

The application is failing to render all matches of the active day due to localized timezone shifts in strict date filters. Also, inputs might be prematurely disabled due to client-side evaluations or incorrect statuses. We must fetch without timezone clipping and strictly rely on the server's status for enabling/disabling inputs.

## What Changes

- Strip any remaining hardcoded arrays or fallback logic.
- Modify the Supabase query to select rows from `public.jogos` without restrictive hour/day filters, using a broader limit ordered by `data_hora ASC` instead.
- Ensure input boxes and the save button strictly rely on `status === 'SCHEDULED'` to be enabled, and are not locked by client-side date comparisons.
- Ensure the `handleSaveGuesses` function aggregates guesses correctly and upserts via `usuario_id, jogo_id`.

## Capabilities

### New Capabilities
- `matchgrid-timezone-and-locking`: Correctly handles dynamic timezone matches and relies on DB status rather than client clock for locking.

### Modified Capabilities

## Impact

- `src/App.tsx` (Data Fetching and Save Logic)
- `src/components/MatchGrid.tsx` (Rendering and Input Logic)
