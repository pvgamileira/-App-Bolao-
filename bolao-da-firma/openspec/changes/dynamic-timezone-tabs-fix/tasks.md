## 1. Dynamic Filtering Refactor

- [x] 1.1 In `src/components/MatchGrid.tsx`, calculate the dynamic current date prefix: `const localTodayStr = new Date().toISOString().split('T')[0];`.
- [x] 1.2 Update the `filteredMatches` map. Replace `iso.startsWith('2026-06-22')` with `iso.startsWith(localTodayStr)`.
- [x] 1.3 Replace `iso > '2026-06-22T23:59:59Z'` with `iso > \`\${localTodayStr}T23:59:59Z\``.

## 2. Integrity Checks

- [x] 2.1 Verify that the inputs remain disabled if `match.status !== 'SCHEDULED'` or if they are in `savedGuesses`.
- [x] 2.2 Verify that the EmptyState text renders correctly for the current dynamic anchor.
