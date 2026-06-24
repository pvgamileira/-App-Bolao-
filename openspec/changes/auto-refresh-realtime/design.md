## Context

Our Bolão application requires real-time updates so that participants see live scores and other users' guesses instantaneously. Currently, the ESPN `sync-matches` Edge Function is triggered purely on the frontend's initial load. This approach is inefficient, dependent on user activity, and leads to stale data for users who keep the app open without refreshing.

## Goals / Non-Goals

**Goals:**
- Completely remove manual triggers for API polling from the frontend.
- Utilize Supabase Realtime (WebSockets) to broadcast DB changes instantly.
- Employ `pg_cron` and `pg_net` to automate the ESPN API data sync in the background.

**Non-Goals:**
- Handling custom push notifications (this is purely for UI auto-refresh).
- Moving the core logic out of Supabase (we are sticking to Supabase native features).

## Decisions

**1. Supabase pg_cron + pg_net for Automated Polling:**
Instead of deploying a separate server or Node.js cron instance, we will use the native Supabase `pg_cron` extension to schedule a recurring HTTP POST request (using `pg_net`) to our existing Edge Function. This keeps our architecture serverless and contained entirely within the Supabase ecosystem.

**2. Supabase Realtime for UI Synchronization:**
Since the UI needs to reflect `jogos` and `palpites` immediately, using `supabase.channel` to subscribe to `postgres_changes` is the best approach. Because the Cron job will update the `jogos` table silently, Realtime will catch this DB mutation and broadcast the payload directly to the connected clients.

**3. Cleanup `invoke('sync-matches')` in App.tsx:**
To avoid race conditions and unnecessary billing/API limits, the React app will no longer invoke the Edge Function manually. 

## Risks / Trade-offs

- **[Risk] High API Usage / Rate Limits:** Polling ESPN every minute could hit rate limits if the Edge Function handles it poorly.
  - *Mitigation*: Ensure the Edge Function limits its polling window and runs efficiently. Cron should be scheduled reasonably (e.g., every 1-2 minutes).
- **[Risk] WebSocket connection drops:** React UI might miss updates if the connection drops.
  - *Mitigation*: Implement standard Supabase reconnect logic (usually handled by the SDK). Ensure `App.tsx` handles cleanup on unmount to prevent duplicate subscriptions.
