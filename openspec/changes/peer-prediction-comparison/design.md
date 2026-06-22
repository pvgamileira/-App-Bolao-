## Context

The `MatchGrid.tsx` is the central hub for the authenticated user. It already handles incoming matches, the user's `savedGuesses`, and real-time score edits. Extending it to include a third layer of data (peer predictions) requires side-effect fetches because the global `App.tsx` state only knows about the logged-in user.

## Goals / Non-Goals

**Goals:**
- Provide a clean, native HTML select dropdown to pick a colleague.
- Fetch predictions on-demand securely using Supabase row-level security (assuming read access is granted).
- Display the peer prediction cleanly without breaking the grid layout.

**Non-Goals:**
- Showing multiple peers at once (only 1v1 comparison for simplicity).
- Calculating potential points gained/lost dynamically in this view.

## Decisions

- **State Management:** Local component state is sufficient. `usersList` will be fetched once. `peerGuesses` will be overwritten every time the dropdown value changes.
- **Data Structure:** Convert the fetched array of palpites into a quick-lookup dictionary `Record<string, {palpite_a: number, palpite_b: number}>` mapped by `jogo_id` for O(1) rendering loops.

## Risks / Trade-offs

- Performing side queries inside `MatchGrid` rather than centralizing in `App.tsx`. Given this is a localized feature, the trade-off favors keeping `App.tsx` clean.
- The `MatchGrid.tsx` will need the `supabase` import.
