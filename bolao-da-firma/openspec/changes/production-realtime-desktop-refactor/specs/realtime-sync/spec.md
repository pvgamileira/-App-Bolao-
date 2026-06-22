## ADDED Requirements

### Requirement: Real-time UI Subscriptions
The UI MUST subscribe to Supabase Realtime changes for the `jogos` table using `supabase.channel()`.
- Upon receiving an `UPDATE` payload, the local state of matches MUST be patched seamlessly to reflect changes in scores or status immediately without requiring the user to refresh the page.
