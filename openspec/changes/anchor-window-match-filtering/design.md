## Context

The World Cup standardizes 4 matches per day, occurring generally between morning and late night. A 16-hour window is perfectly suited to encapsulate the start of the first match and the end of the fourth match without bleeding into the next calendar day's block, which would start roughly 24 hours after the first.

## Goals / Non-Goals

**Goals:**
- Eliminate timezone crossover truncation by replacing strict string evaluation with relative delta times.
- Prevent application crash if `matches` is empty.
- Keep the `EmptyState` messaging and `savedGuesses` locks functional.

**Non-Goals:**
- Altering the backend `sync-matches` function or modifying database timestamps. This is strictly a presentation-layer grouping strategy.

## Decisions

- **Relative Anchor Logic:** 
  ```typescript
  let filteredMatches = [];
  if (matches.length > 0) {
    const firstMatchTime = matches[0].date.getTime();
    const sixteenHoursInMs = 16 * 60 * 60 * 1000;
    
    filteredMatches = matches.filter(match => {
      const isCurrentBlock = (match.date.getTime() - firstMatchTime) < sixteenHoursInMs;
      return activeTab === 'today' ? isCurrentBlock : !isCurrentBlock;
    });
  }
  ```

## Risks / Trade-offs

- If the ESPN API somehow returns matches that span across days without a gap, the 16-hour logic might split them. However, FIFA match schedules have clear daily cadences with massive gaps between midnight and the next morning, so this risk is essentially zero.
