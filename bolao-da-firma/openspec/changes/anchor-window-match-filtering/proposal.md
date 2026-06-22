## Why

The current filtering logic in `MatchGrid.tsx` evaluates whether a match belongs to the "Hoje" tab based on a strict 24-hour midnight-to-midnight boundary (`localTodayStr`). However, because World Cup matches are synced via ESPN using UTC, the last match of a daily block often kicks off or concludes after 00:00:00 BRT the next morning. This causes the dashboard to split a single logical tournament day across two tabs, confusing the user.

## What Changes

- We will remove the explicit calendar date comparison (`localTodayStr`) inside `MatchGrid.tsx`.
- Instead, we will grab the timestamp of the very first match in the sorted array. Since `App.tsx` already orders `matches` chronologically via Supabase (`.order('data_hora', { ascending: true })`), `matches[0]` is guaranteed to be the start of the current logical slate.
- Any match that occurs within 16 hours of this first match's timestamp will be grouped into the "Hoje" tab. Matches beyond that threshold will fall into "Futuros".

## Capabilities

### New Capabilities
- `anchor-window-match-filtering`: Implements a timezone-agnostic logical grouping of match blocks to prevent late-night games from jumping to the next day's tab.

### Modified Capabilities

## Impact

- `src/components/MatchGrid.tsx` (Filtering logic override)
