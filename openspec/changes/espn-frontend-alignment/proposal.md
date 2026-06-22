## Why

The backend Edge Function was recently updated to fetch from the official ESPN API, which introduces new statuses (`STATUS_SCHEDULED`, `STATUS_IN_PROGRESS`, `STATUS_FINAL`) that are mapped to our internal `SCHEDULED`, `LIVE`, `FINISHED`. We must ensure the frontend `MatchGrid.tsx` perfectly aligns with this schema without any residual local date filtering or mock data blocking the UI.

## What Changes

- Verify that `MatchGrid.tsx` pulls entries from `public.jogos` sorted chronologically with no client-side clock checks or time-based validation variables.
- Ensure form input fields for scores (`palpite_a`, `palpite_b`) remain interactive and unlocked strictly when `status === 'SCHEDULED'`.
- Ensure fields lock and card styling adapts when `status === 'LIVE'` or `status === 'FINISHED'`.
- Confirm that `EmptyState` renders cleanly when the database contains no games for the selection.

## Capabilities

### New Capabilities
- `espn-frontend-alignment`: Synchronize `MatchGrid` UI states strictly with the updated ESPN-driven Supabase schema.

### Modified Capabilities

## Impact

- `src/components/MatchGrid.tsx`
- `src/App.tsx` (Data Fetching)
