## Why

The current logic for the "Jogos de Hoje" (Today's Matches) tab incorrectly uses the first match in the database (`matches[0]`) as the reference date instead of the actual current date (`new Date()`). This results in the app always showing the first day of matches as "today". Additionally, users need the ability to see all matches (past and future) and filter them by custom date ranges, which is currently missing.

## What Changes

- Update "Jogos de Hoje" logic to filter matches based on the current real-world date.
- Rename the "Jogos Futuros" tab to "Todos os Jogos".
- Add a date range selector (Start Date and End Date) to the "Todos os Jogos" tab.
- Filter the displayed matches in "Todos os Jogos" based on the selected date range. If no dates are selected, all matches are shown.
- Ensure all existing functionalities (submitting guesses, disabling guesses for started/finished matches) continue to work seamlessly.

## Capabilities

### New Capabilities
- `filter-matches-by-date`: Adding a date range filter to the match grid allowing users to filter matches between a start and end date.
- `match-grid-display`: Display logic for resolving "Today's Matches" against the current system date and rendering all matches.

### Modified Capabilities
None

## Impact

- `src/components/MatchGrid.tsx`: This component will be modified to include the new date inputs, updated tab states, and the new filtering logic.
- UI will have additional inputs for date selection in the match list view.
