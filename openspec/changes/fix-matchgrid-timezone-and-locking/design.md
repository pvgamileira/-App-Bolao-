## Context

Currently, client-side clocks can misalign with UTC dates stored in Supabase, hiding matches that belong to the active matchday. Furthermore, any client-side date comparisons for locking predictions can block users prematurely.

## Goals / Non-Goals

**Goals:**
- Fetch upcoming matches regardless of strict UTC midnight cutoffs.
- Let the database `status` (`SCHEDULED`, `LIVE`, `FINISHED`) be the sole source of truth for whether predictions can be edited.
- Clean upsert logic for `palpites`.

**Non-Goals:**
- Handling complex timezone offsets for user display (we just show the time as-is).

## Decisions

- **Query Overhaul:** Update `App.tsx` `fetchMatches` to just use `.order('data_hora', { ascending: true }).limit(10)`, completely removing local date filtering that was added previously.
- **Input Locking:** Rely solely on `match.status === 'SCHEDULED'` to toggle the `disabled` prop on inputs in `MatchGrid.tsx`.

## Risks / Trade-offs

- Removing date bounds means we just fetch the next 10 matches sequentially, which is simple and robust but might include future rounds if the current round has less than 10 matches. This is acceptable for our UI.
