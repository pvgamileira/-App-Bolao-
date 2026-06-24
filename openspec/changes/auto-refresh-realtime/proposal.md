## Why

Our React/Vite application currently relies on a manual fetch mechanism to update match scores. The Supabase Edge Function `sync-matches` (which fetches live data from ESPN) is only invoked on page load. This causes stale UI states unless the user manually refreshes (F5). Implementing a real-time architecture eliminates friction and provides an instantaneous, fluid experience for all users when tracking live football matches and participant guesses.

## What Changes

- Refactor `App.tsx` to handle robust Supabase Realtime (WebSockets) subscriptions for the `jogos` and `palpites` tables.
- Remove the manual `supabase.functions.invoke('sync-matches')` call from the frontend's initial load lifecycle.
- Implement a backend automated polling system using Supabase's `pg_cron` and `pg_net` extensions to trigger the `sync-matches` Edge Function periodically without user interaction.
- Ensure the React UI automatically reacts to `UPDATE`, `INSERT`, and `DELETE` payloads from WebSockets to immediately refresh the displayed state.

## Capabilities

### New Capabilities
- `realtime-ui`: WebSockets-based synchronization for instantaneous UI updates without page reloads.
- `automated-sync`: Database-level cron job scheduling for independent, periodic execution of external API fetching.

### Modified Capabilities

<!-- No requirement changes -->

## Impact

- **Frontend (`App.tsx`)**: The initialization and cleanup logic for Realtime channels will be expanded. Manual function invocation is removed.
- **Backend (Supabase)**: Requires SQL execution to enable `pg_cron`/`pg_net` and schedule the recurring HTTP POST to the Edge Function.
- **UX**: Massive improvement; zero-refresh required for updates.
