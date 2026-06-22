## 1. Anchor Time Refactor

- [x] 1.1 In `src/components/MatchGrid.tsx`, locate the `filteredMatches` declaration.
- [x] 1.2 Remove `const localTodayStr = new Date().toISOString().split('T')[0];`.
- [x] 1.3 Replace the filtering block with:
```typescript
  let filteredMatches: Match[] = [];
  if (matches.length > 0) {
    const firstMatchTime = matches[0].date.getTime();
    const sixteenHoursInMs = 16 * 60 * 60 * 1000;
    
    filteredMatches = matches.filter(match => {
      const isCurrentBlock = (match.date.getTime() - firstMatchTime) < sixteenHoursInMs;
      return activeTab === 'today' ? isCurrentBlock : !isCurrentBlock;
    });
  }
```

## 2. Integrity Validation

- [x] 2.1 Ensure the Floating/Sticky Action Button still evaluates `filteredMatches.length > 0 && hasPendingMatches`.
- [x] 2.2 Verify that the EmptyState text fallback remains intact if the array is empty.
