## Why

The current application relies heavily on mock data, lacks a genuine desktop experience, and requires manual page refreshes to see score updates. To be production-ready, we must implement real-time synchronization, support responsive layouts for larger screens, and provide a clear, functional authentication workflow.

## What Changes

- Implement a responsive UI that transforms into a side-by-side dashboard on desktop screens (min-width: 768px), centering the viewport and preventing over-stretching.
- Replace all mock arrays with strict empty state handling, showing elegant "No matches available" or loading skeleton components.
- Refactor `AuthForm.tsx` to include an explicit "Criar Conta" tab that inserts users directly into `public.usuarios`, checking for unique nicknames.
- Introduce Supabase web-socket subscriptions (`supabase.channel`) in `MatchGrid.tsx` and `LeaderboardPodium.tsx` to reflect database changes dynamically without page reloads.

## Capabilities

### New Capabilities
- `realtime-sync`: Realtime UI updates for matches and leaderboard using Supabase web sockets.
- `desktop-layout`: Responsive typography and layout constraints for desktop viewports.

### Modified Capabilities
- `auth`: Add "Criar Conta" workflow with explicit nickname and PIN inputs, validating against the database.
- `matches`: Remove mock data, implement empty states, and integrate real-time updates.
- `leaderboard`: Remove mock data, implement loading skeletons, and integrate real-time updates.

## Impact

- **UI/UX**: Significant layout overhaul on desktop. Improved feedback with loading/empty states.
- **Frontend State**: Components will rely entirely on live Supabase data streams and local state management instead of hardcoded data.
- **Database / Backend**: Realtime must be enabled for the `jogos` and potentially `palpites`/`usuarios` tables in Supabase for subscriptions to work.
