## MODIFIED Requirements

### Requirement: Realtime Subscriptions Lifecycle
The frontend `App.tsx` component SHALL subscribe to realtime events in Supabase to re-fetch leaderboard and matches. The channel MUST be instantiated dynamically (e.g. using a unique suffix or timestamp) or properly removed/cleaned up before a new subscription occurs on re-render, to prevent collisions in React Strict Mode.

#### Scenario: React Strict Mode double-render
- **WHEN** the `App.tsx` component mounts twice rapidly in development mode
- **THEN** it does not throw the "cannot add postgres_changes callbacks... after subscribe()" error
- **THEN** the realtime subscription functions normally and receives updates
