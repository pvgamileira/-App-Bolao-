## Why

As the tournament progresses, the dashboard can become cluttered with future matches. Users need a quick way to focus on the active matches happening "today" while still being able to navigate to upcoming fixtures. Implementing a tabbed UI structure inside the MatchGrid will solve this natively.

## What Changes

- Add a tab state (`activeTab: 'today' | 'future'`) in `src/components/MatchGrid.tsx`.
- Render a two-button toggle header at the top of the MatchGrid layout.
- Filter the `matches` prop array purely on the client-side before rendering the cards. "Jogos de Hoje" will map strictly to June 22, 2026, and "Jogos Futuros" to dates strictly greater.
- Ensure empty states function dynamically for each tab.

## Capabilities

### New Capabilities
- `filter-matches-by-date-tabs`: Adds a tabbed filtering system to separate today's matches from future matches.

### Modified Capabilities

## Impact

- `src/components/MatchGrid.tsx` (Tab rendering, state, and array filtering)
