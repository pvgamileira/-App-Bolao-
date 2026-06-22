## 1. Data Fetching and Integration

- [x] 1.1 Verify `src/App.tsx` pulls entries from `public.jogos` sorted chronologically with no client-side clock checks or time-based validation variables.

## 2. Locking Restrictions

- [x] 2.1 Verify `src/components/MatchGrid.tsx` score inputs are enabled if and only if `status === 'SCHEDULED'`.
- [x] 2.2 Verify `src/components/MatchGrid.tsx` locks fields and changes styling correctly when `status === 'LIVE'` or `status === 'FINISHED'`.

## 3. Empty States

- [x] 3.1 Verify if the database contains no games, it displays the `<EmptyState />` component cleanly with no hardcoded placeholders.
