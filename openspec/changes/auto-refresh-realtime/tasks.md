## 1. Backend: Automated Sync via Cron

- [x] 1.1 Create a SQL migration script to enable `pg_cron` and `pg_net` extensions.
- [x] 1.2 Add SQL commands to create vault secrets for the Project URL and Service Role Key (or Anon Key) if necessary.
- [x] 1.3 Add a SQL command to schedule the `pg_cron` job to HTTP POST the `sync-matches` Edge Function every 1 minute.

## 2. Frontend: Realtime UI Subscriptions

- [x] 2.1 Refactor `App.tsx` to subscribe to the `jogos` table using `supabase.channel('schema-db-changes')`.
- [x] 2.2 Refactor `App.tsx` to subscribe to the `palpites` table.
- [x] 2.3 Implement the logic within the subscription handlers to merge the incoming payloads into the global React state without reloading the entire list.
- [x] 2.4 Ensure the `useEffect` cleanup function properly unmounts/removes the channels to prevent memory leaks.

## 3. Frontend: Cleanup

- [x] 3.1 Locate the manual `supabase.functions.invoke('sync-matches')` call in `App.tsx` and remove it.
- [x] 3.2 Verify the application loads correctly and relies solely on WebSocket data streams.
