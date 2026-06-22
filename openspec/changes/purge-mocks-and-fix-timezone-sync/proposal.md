## Why

The application is currently rendering hardcoded fictional matches due to an undocumented fallback inside the frontend components. Furthermore, timezone offsets between the external API's string format and PostgreSQL TIMESTAMPTZ cause matches to drop out of strict date filters. This change deletes all mock data, ensures only real database records are rendered, and fixes the querying logic to properly display matches reliably.

## What Changes

- Complete removal of any hardcoded arrays of matches, default states, or mock objects in `src/components/MatchGrid.tsx` and `src/App.tsx`.
- Modify query logic in `App.tsx` to pull the current round's matches ordered by date, preventing UTC conversion drop-offs.
- Ensure the input boxes inside `MatchGrid.tsx` accurately bind to the logged-in user's existing records in `public.palpites`.
- Verify the "Salvar Meus Palpites" button upserts successfully.

## Capabilities

### New Capabilities
- `purge-mocks-and-fix-timezone-sync`: Removes hardcoded data and fixes timezone-related query issues for match display and prediction saving.

### Modified Capabilities

## Impact

- `src/components/MatchGrid.tsx`
- `src/App.tsx`
