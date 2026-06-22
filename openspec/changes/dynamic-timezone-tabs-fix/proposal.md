## Why

Currently, the frontend filtering logic in `MatchGrid.tsx` relies on a hardcoded string `2026-06-22` to separate "Hoje" from "Futuros" matches. As time passes, this filter will become stale, trapping the application in a single day. The backend sync function now correctly shifts its date window dynamically, and the frontend must follow suit to create an evergreen application.

## What Changes

- Replace the hardcoded `2026-06-22` date comparison in `src/components/MatchGrid.tsx` with a dynamic client-side `Date` object calculation.
- Evaluate `today` using `new Date().toISOString().split('T')[0]`.
- Update the `filteredMatches` logic so `activeTab === 'today'` catches any match whose ISO string starts with `localTodayStr`, and `activeTab === 'future'` catches matches explicitly greater than `localTodayStr + 'T23:59:59Z'`.

## Capabilities

### New Capabilities
- `dynamic-timezone-tabs-fix`: Ensures tab filtering shifts automatically as the calendar day progresses without manual code edits.

### Modified Capabilities

## Impact

- `src/components/MatchGrid.tsx` (Filtering logic variable updates)
