## Context

Currently, mock data is injected when matches aren't found or there is a fallback, masking empty states. Additionally, strict ISO midnight-to-midnight filtering fails due to timezone conversions, hiding matches that technically land on the next UTC day but are today locally.

## Goals / Non-Goals

**Goals:**
- Render exactly what is in the database. If 0 rows, render `<EmptyState />`.
- Fetch matches resiliently without strict UTC date cutoffs that hide valid games.
- Ensure predictions bind correctly to `public.palpites`.

**Non-Goals:**
- Creating a complex timezone management library.

## Decisions

- **Total Mock Purge:** Strip all `const mockMatches = ...` or similar fallbacks.
- **Query Adjustment:** Instead of `gte`/`lte` strict dates, fetch matches ordered by `data_hora ASC` and filter locally in JavaScript by checking if the formatted date matches the current active tournament day (e.g., June 22, 2026), or just use a broader limit without strict day constraints.
- **State Binding:** Ensure `guesses` object maps correctly to `MatchGrid` inputs and upserts handle `usuario_id, jogo_id` on conflict.

## Risks / Trade-offs

- Filtering in JS means fetching slightly more rows from Supabase, but since we limit to the upcoming games, the payload remains negligible.
