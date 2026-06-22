## 1. Purge Mocks

- [x] 1.1 Inspect `src/components/MatchGrid.tsx` and `src/App.tsx` to delete all hardcoded mock arrays and fallbacks.
- [x] 1.2 Ensure `MatchGrid.tsx` renders `<EmptyState />` when the database returns 0 rows.

## 2. Resilient Timezone Filtering

- [x] 2.1 Update the match query in `src/App.tsx` to fetch matches ordered by `data_hora ASC` and filter locally in JS by the active tournament day, or widen the DB filter safely.

## 3. Verify Input and Save Mechanics

- [x] 3.1 Verify that the `value` props on the score inputs in `MatchGrid.tsx` are correctly bound to the `guesses` state.
- [x] 3.2 Verify the `handleSaveGuesses` function correctly maps the `guesses` array and calls `supabase.from('palpites').upsert(...)`.
